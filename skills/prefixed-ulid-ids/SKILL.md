---
name: prefixed-ulid-ids
description: This skill should be used when the user asks to "use prefixed ULIDs", "design typed IDs", "add resource prefixes to IDs", "audit ID handling", "migrate IDs", "fix prefix mismatches", or needs to implement IDs stored as resource_ULID across schemas, ORMs, APIs, URLs, logs, and integrations.
metadata:
  author: labdotsa
  category: engineering
---

# Prefixed ULID IDs

Design identifiers as a cross-boundary contract, not as string decoration. Use a stable resource prefix plus a ULID when operational clarity, resource recognition, sortable creation time, or cross-resource references justify the storage and validation cost. Keep domain roles and classifications relational; a prefix identifies a resource identity and does not prove that the identity is a client, vendor, company, or permission holder.

## Choose the contract first

Decide the canonical representation independently for each boundary, then write it down:

| Boundary | Tagged mode | Compatibility mode |
| --- | --- | --- |
| Database | `entity_01J...` | `entity_01J...` |
| Application | `entity_01J...` | bare `01J...` |
| API/URL | `entity_01J...` | bare `01J...` or an explicit public alias |
| Logs/events | tagged resource ID | tagged resource ID preferred |

Prefer tagged mode when IDs cross resource boundaries, power generic loaders, appear in logs, or are handled by multiple teams. Use compatibility mode only when an existing API or ORM contract requires bare ULIDs. Never let an ORM silently strip prefixes in one query and return them in another; provide explicit conversion functions at the boundary.

Keep these invariants:

- ULIDs use the canonical uppercase Crockford Base32 alphabet and exactly 26 characters.
- Prefixes are lowercase, stable, explicit resource names such as `entity` or `invoice_recurring`.
- A table rename does not silently rename an ID prefix.
- Every prefix value comes from one registry; callers never concatenate arbitrary strings.
- Wrong prefixes fail closed. Never turn `workspace_01J...` into `entity_workspace_01J...`.
- A prefixed ID is not a secret. ULIDs reveal approximate creation time and still require authorization.

## Build an ID registry

Inventory every primary key, foreign key, route parameter, public field, raw SQL value, fixture, log field, storage object key, and external event identifier. Assign each addressable resource one stable prefix and record its representation at every boundary.

Create one module that owns the registry, generation, parsing, conversion, and branded types. Import it from schema definitions, repositories, migrations, tests, and integrations. Reject local prefix constants and ad hoc `prefix + '_' + id` expressions.

Use resource IDs for roots, durable facts, externally addressable joins, and entities with an independent lifecycle. Prefer composite keys for pure many-to-many joins. Do not assign a prefix to every table by reflex; an ID is justified when the row has an independent identity, URL, audit trail, event contract, or external reference.

## Validate strictly at runtime

Accept a bare ULID only where the contract says bare is valid. Accept a tagged ID only when its prefix matches the expected resource. Preserve the distinction between these operations:

- `createId(prefix)` — generate a new canonical ID.
- `parseBareUlid(value)` — validate a bare ULID.
- `parseTaggedId(prefix, value)` — validate the exact expected prefix.
- `toStoredId(prefix, value)` — normalize an explicitly allowed bare or same-prefix value.
- `fromStoredId(prefix, value)` — validate storage and return the application representation.

Do not implement parsing with an unrestricted `replace`, `split('_')`, or “add the prefix unless it starts with this prefix” rule. Those shortcuts can accept another resource's ID or silently create malformed values. Test empty strings, lowercase ULIDs, wrong prefixes, extra separators, truncated suffixes, and already-canonical values.

## Type relationships, roles, and polymorphism

Separate resource identity from business meaning:

```text
entity_01J...  = the shared entity identity
client         = a role held by that entity
vendor         = another role held by that entity
company        = a business classification of that entity
```

Model a shared root plus role tables when one identity appears in several product surfaces and roles have different lifecycle, permissions, or fields. Keep `entity_id` as the shared prefixed ID, then enforce role-specific references with composite foreign keys such as `(workspace_id, vendor_id) → vendor(workspace_id, entity_id)`. A prefix proves only the resource shape; it does not prove role membership.

For polymorphic references, do not assume that a prefix turns a `text` column into a safe foreign key. Prefer a common root table, separate nullable foreign keys with a discriminator check, or a registry that owns target validation. Route by prefix only after tenant scoping, existence checks, and authorization.

Use branded TypeScript types when bare/stored confusion or cross-resource mixups are realistic. Runtime validation remains mandatory because data arrives through HTTP, jobs, raw SQL, queues, and external systems.

## Implement the adapter boundary

Use explicit adapters for tagged and compatibility modes. This Drizzle-oriented baseline keeps tagged IDs in application values and storage:

```ts
import { customType } from 'drizzle-orm/pg-core';
import { monotonicFactory } from 'ulid';

const nextUlid = monotonicFactory();
const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export const ID_PREFIX = {
	ENTITY: 'entity',
	CLIENT: 'client',
	VENDOR: 'vendor',
	INVOICE: 'invoice'
} as const satisfies Record<string, string>;

type Prefix = (typeof ID_PREFIX)[keyof typeof ID_PREFIX];
type TaggedId<P extends Prefix> = `${P}_${string}`;

const assertBareUlid = (value: string) => {
	if (!ULID_RE.test(value)) throw new Error(`Invalid ULID: ${value}`);
	return value;
};

export const createId = <P extends Prefix>(prefix: P): TaggedId<P> =>
	`${prefix}_${nextUlid()}` as TaggedId<P>;

export const parseTaggedId = <P extends Prefix>(prefix: P, value: string): TaggedId<P> => {
	const marker = `${prefix}_`;
	if (!value.startsWith(marker)) throw new Error(`Expected ${prefix} ID`);
	assertBareUlid(value.slice(marker.length));
	return value as TaggedId<P>;
};

export const toStoredId = <P extends Prefix>(prefix: P, value: string): TaggedId<P> => {
	const marker = `${prefix}_`;
	if (value.includes('_') && !value.startsWith(marker)) {
		throw new Error(`Expected bare or ${prefix} ID`);
	}
	const bare = value.startsWith(marker) ? value.slice(marker.length) : value;
	assertBareUlid(bare);
	return `${marker}${bare}` as TaggedId<P>;
};

export const prefixedId = <P extends Prefix>(prefix: P) =>
	customType<{ data: TaggedId<P>; driverData: string }>({
		dataType: () => 'text',
		toDriver: (value) => parseTaggedId(prefix, value),
		fromDriver: (value) => parseTaggedId(prefix, value)
	});
```

For compatibility mode, expose separate `toBareId` and `fromStoredId` functions rather than changing the adapter's behavior implicitly. Keep raw SQL on the same conversion path; never pass an unvalidated string directly into an ID predicate or insert.

## Put integrity in the database

Use text storage only after comparing its cost with UUID, binary, or numeric alternatives. For every prefixed primary key, add a shape check where the database is authoritative:

```sql
id text primary key
  check (id ~ '^entity_[0-9A-HJKMNP-TV-Z]{26}$')
```

Add matching checks to high-risk foreign-key columns when malformed values could enter through raw SQL. Add real foreign keys to the intended table and composite foreign keys for tenant-scoped ownership. Prefix checks provide early diagnostics; relational constraints provide integrity.

Index hot foreign keys and access paths, not every ID column. Text identifiers widen indexes and comparisons, and prefixes do not automatically improve selectivity. Use cursor ordering on `(created_at, id)` for fact streams when the ULID is only a tie-breaker; do not rely on ULID ordering as a globally serialized sequence.

## Migrate without identity drift

Treat a prefix change, representation change, or storage-type change as a data and API migration:

1. Inventory all references, including JSON payloads, caches, object storage keys, URLs, logs, exports, and external consumers.
2. Define a durable old-to-new mapping; never derive a migration mapping from a mutable display field.
3. Add new columns or constraints before rewriting children.
4. Backfill in bounded batches and validate counts, uniqueness, prefixes, and orphan absence.
5. Cut reads and writes over transactionally or with an explicitly bounded dual-write period.
6. Rebuild indexes and validate query plans after the representation changes.
7. Retain rollback evidence until external consumers have crossed the contract boundary.

Preserve a stable prefix through table renames. If a legacy table called `subscription` becomes `expense_recurring`, keep `subscription_` IDs unless a deliberate identifier migration is worth the API, storage, and integration cost.

## Verify the complete contract

Test the same ID through every boundary:

- generation is unique under concurrent calls and preserves the expected prefix;
- tagged and bare parsing accepts only the documented forms;
- wrong-resource IDs fail before the database call;
- ORM inserts store the expected text and reads return the expected representation;
- raw SQL uses the same canonicalization functions;
- database checks reject malformed prefixes and suffixes;
- foreign keys reject missing targets and composite keys reject cross-tenant references;
- APIs, URLs, logs, events, and storage keys use the documented form;
- migrations preserve references and support replay/rollback;
- authorization still runs for every lookup, regardless of a valid prefix.

Read the supporting references for relationship patterns, strict adapter examples, and migration evidence requirements.

## Additional resources

- **`references/identity-and-roles.md`** — shared roots, role tables, composite foreign keys, polymorphic references, and the distinction between resource tags and business types.
- **`references/adapter-and-validation.md`** — strict parsing, tagged/bare boundary modes, Drizzle adapters, database checks, and test cases.
- **`references/migration-playbook.md`** — legacy conversion, zero-downtime rollout, external references, rollback, and verification.
