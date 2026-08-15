# Identity and role modeling

Use this reference when a system has a shared subject such as an entity, party, account, contact, or resource that appears in multiple product roles.

## Build an identity ledger

Record each concept before selecting an ID or table:

| Concept | Question | Typical model |
| --- | --- | --- |
| Root identity | What must remain the same when a role changes? | `entity` or `party` row |
| Resource | What has its own mutable lifecycle and URL? | Resource table with its own ID |
| Classification | What describes the identity itself? | Enum or constrained column |
| Role | What can the identity do or be used as? | Role table or membership |
| Relationship | Which two identities are connected? | Junction table or explicit edge |
| Fact | What happened at a point in time? | Append-only event/fact table |

Do not let a prefix answer a question that belongs to another row. `entity_01...` can identify the root row, while `client` and `vendor` remain roles of that root. One entity may hold both roles unless the database explicitly forbids it.

## Shared entity with role tables

Prefer a shared root plus role tables when common fields are written once and role behavior differs:

```sql
create table entity (
  workspace_id text not null,
  id text primary key,
  name text not null,
  type text not null check (type in ('individual', 'company', 'government')),
  unique (workspace_id, id)
);

create table client (
  workspace_id text not null,
  entity_id text not null,
  converted_at timestamptz,
  primary key (workspace_id, entity_id),
  foreign key (workspace_id, entity_id)
    references entity (workspace_id, id)
);

create table vendor (
  workspace_id text not null,
  entity_id text not null,
  primary key (workspace_id, entity_id),
  foreign key (workspace_id, entity_id)
    references entity (workspace_id, id)
);
```

Use separate role tables when roles have different lifecycle fields, permissions, retention, or downstream access paths. Keep common attributes on `entity`. Create the root and role row in one transaction. Deleting a role should not delete the root unless the domain explicitly defines the root as role-owned.

If every role has the same attributes and invariants, a constrained relation may be smaller:

```sql
create table entity_role (
  workspace_id text not null,
  entity_id text not null,
  role text not null check (role in ('client', 'vendor')),
  primary key (workspace_id, entity_id, role),
  foreign key (workspace_id, entity_id)
    references entity (workspace_id, id)
);
```

Do not use a delimited string or an unconstrained array for roles that need authorization, uniqueness, history, or role-specific queries.

## Tagged IDs and database integrity

Treat a prefix as a runtime tag, not as a database foreign key. Enforce all three layers:

1. **Shape** — `CHECK (id ~ '^entity_[0-9A-HJKMNP-TV-Z]{26}$')` or an equivalent validated domain type.
2. **Target** — a real FK to the intended parent table.
3. **Scope** — a composite FK such as `(workspace_id, entity_id)` when tenant ownership matters.

For a child table whose column is called `vendor_id`, a check that the value starts with `entity_` only proves that the value has the entity shape. It does not prove that the row exists in `vendor`. Reference the role table when the business rule requires vendor membership.

Use resource-specific prefixes for addressable roots and durable facts. Pure many-to-many joins usually need composite keys and no independent ID. Give a join its own prefixed ID only when it has an independent URL, lifecycle, audit trail, event identity, or external integration contract.

## Polymorphic relationship choices

Choose the least ambiguous option:

- Use a common root table when all targets share identity, authorization, and lifecycle semantics.
- Use separate nullable FKs plus a `CHECK` when the target set is small and database enforcement matters.
- Use a registry table when many target kinds must be addressed uniformly and the registry can own authorization and lifecycle.
- Use a tagged text reference only for an opaque external/reference boundary where referential integrity is enforced by the owning service and replay checks exist.

Never assume that parsing `invoice_...` and routing to an invoice query is authorization. Resolve the prefix, validate the ULID, scope the lookup to the tenant, and authorize the target before returning or mutating it.

## Review checklist

- Does the prefix identify a root resource or incorrectly encode a mutable role?
- Can one identity have several roles? If yes, is that represented relationally?
- Is every role-specific foreign key constrained to the role table?
- Are tenant keys included in parent uniqueness and composite foreign keys?
- Does the ID adapter reject another resource's prefix instead of rewriting it?
- Is the canonical representation consistent across database, application, API, logs, and URLs?
- Do migrations preserve the stable identity when a table or role is renamed?
- Are high-volume tables paying a justified storage and index-width cost for text IDs?
