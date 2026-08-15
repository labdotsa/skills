# Normalization and computation reference

Use this reference when deciding whether a value belongs in a canonical table, a snapshot, a projection, or a request-time expression.

## Classification ledger

Record one row per non-trivial field or derived value:

| Field/value | Meaning | Source of truth | Mutation owner | Consumers | Required freshness | Candidate placement | Failure if stale |
| --- | --- | --- | --- | --- | --- | --- | --- |

Classify the value as one of:

- **Canonical state** — the authoritative current value; write transaction owns it.
- **Immutable fact** — what happened at a point in time; never rewrite from current state.
- **Historical snapshot** — copied context retained to preserve interpretation of a fact.
- **Read projection** — derived rows or documents rebuilt from canonical state/facts.
- **Cache** — disposable acceleration with explicit invalidation/TTL.
- **Presentation** — formatting or user/filter-specific computation that should not be stored.

Reject the phrase “computed field” until the classification identifies who owns the value and how it is repaired.

## Normalize or retain a copy

| Question | Normalize into a relation/typed column when… | Retain a copy when… |
| --- | --- | --- |
| Independent identity | The value has its own key or lifecycle | The copy only describes the occurrence |
| Shared value | Many parents must agree on one current value | The historical value must not change with the parent |
| Authorization | Access differs from the parent | The copy is already covered by the fact’s access boundary |
| Querying | It is filtered, sorted, grouped, joined, or constrained | It is sparse, opaque, or rarely inspected |
| Change rate | It changes independently or frequently | It is captured once at event time |
| Repair | Inconsistency would be dangerous | A rebuild or replay can restore the copy |

Examples:

- Keep a many-to-many tag assignment as a junction table with a composite primary key.
- Keep a stable set of UTM dimensions as typed columns if the application filters and reports them directly.
- Keep an immutable provider webhook payload as JSON for replay, but normalize event key, provider, object ID, state, attempts, and timestamps.
- Keep `amount_minor` and `currency` as typed values; never make a formatted amount the only money representation.
- Keep a click’s destination or campaign snapshot when reporting must describe the target at click time; do not use the current link row as historical truth.
- Extract targeting JSON into typed rules when individual rules become queryable, auditable, or independently authorized.

## Computation placement test

Score each candidate on five dimensions from 0 (low) to 2 (high):

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Repetition | Rare query | Several screens | Every request or many users |
| Source size | Small/selective | Moderate | Large/append-heavy |
| Freshness | Flexible | Bounded lag | Must be current |
| Cost | Cheap | Variable | Sort/window/temp IO |
| Rebuildability | Hard/impossible | Possible with manual work | Deterministic from facts |

Use these heuristics:

- High repetition + high source size + high cost favors a projection or rollup.
- High freshness + low cost favors request-time computation.
- Low freshness requirement + optional result favors background work.
- Low rebuildability makes persistence riskier; preserve the canonical input and add repair tooling before materializing.
- User-specific filters, permissions, and time windows usually belong at request time even when a broad rollup exists.

Never materialize solely because a query is long. Capture plans, row counts, temporary IO, concurrency, and write amplification first.

## Projection contract

For every projection define:

1. Input relations and event types.
2. Uniqueness boundary, such as `(tenant_id, cycle_start, entity_id)`.
3. Freshness and visibility guarantee.
4. Late-arrival, correction, deletion, retention, and backfill semantics.
5. Writer or refresh mechanism.
6. Rebuild command and verification query.
7. Read fallback behavior during lag or rebuild.
8. Indexes for both refresh and serving paths.

Prefer one projection per repeated access pattern over a universal denormalized “everything” table. A projection that mixes tenant, permissions, formatting, and multiple freshness policies becomes a second application with unclear ownership.

## Common failure patterns

- Read-then-insert identity upserts without a unique constraint.
- JSON that began as metadata but became a filter without an index or typed contract.
- Counters updated in one code path while facts are inserted in several others.
- A global middleware query loading every usage aggregate for every route.
- A client downloading all raw events to compute summary cards.
- A materialized view with no refresh owner, freshness metric, or rebuild procedure.
- A denormalized tenant key without a composite constraint tying it to the parent.
