# Postgres access-path reference

Use this reference when a design must prove query performance rather than merely list possible indexes.

## Query-to-index translation

For each query, write the access contract first:

```text
WHERE tenant_id = ?
  AND deleted_at IS NULL
  AND occurred_at >= ?
ORDER BY occurred_at ASC, id ASC
LIMIT ?
SELECT id, entity_id
```

A candidate index generally follows:

```sql
create index concurrently event_tenant_occurred_id_active_idx
on event (tenant_id, occurred_at, id)
include (entity_id)
where deleted_at is null;
```

Treat this as a hypothesis, not a prescription. Leading equality columns, range/order columns, active-row predicates, included projections, and the table’s write rate all need evidence. Test a link-centric index separately from a tenant/time-centric index; do not deploy both without a query family that benefits from each.

## Required plan evidence

Capture representative SQL and parameters in staging or a safe read replica:

```sql
begin;
set local statement_timeout = '15s';

explain (analyze, buffers, settings, format json)
-- exact generated statement
;

rollback;
```

Record planning/execution time, estimated and actual rows, shared blocks hit/read, temporary blocks, sort method, heap fetches, rows removed by filters, and concurrency behavior. `EXPLAIN ANALYZE` executes the query; never use it casually against a production mutation or an unbounded expensive read.

Use hypothetical indexes only to inspect planner choices. They do not provide real runtime, buffer, visibility-map, WAL, or write-cost evidence. Build a winning candidate physically in staging, run cold and warm cases, then use `CREATE INDEX CONCURRENTLY` in production where supported. Analyze after creation and retain the old overlapping index until a measured soak justifies removal.

## Pagination and aggregation

Use a stable cursor boundary:

```sql
where (occurred_at, id) > (:last_occurred_at, :last_id)
order by occurred_at, id
limit :page_size;
```

Use the same tie-breaker in every query that must be stable under concurrent inserts. Avoid `OFFSET` on large changing relations because skipped rows still require work and new rows can shift page boundaries. Keep a fixed bounded `OFFSET` snapshot only when the snapshot cannot change during pagination.

For counts, establish whether the cap is global per tenant/cycle or local per entity. Apply global eligibility before grouping by entity. A covering index may reduce heap work while the global window/ranking still sorts every candidate; a rollup or cycle sequence may be the correct next model. Preserve count parity fixtures before changing the computation.

## Constraint and index interactions

- Foreign keys enforce relationships but do not automatically index referencing columns.
- Partial unique indexes are useful for “one active row” or reusable identifiers after soft deletion.
- Case-insensitive identifiers need normalized storage or an expression index, plus a matching uniqueness rule.
- Composite foreign keys are the most direct way to ensure a duplicated tenant key agrees with the parent.
- Included columns improve index-only opportunities but do not participate in ordering or uniqueness.
- High-churn fact tables pay for every index in insert, vacuum, and WAL cost.
- Exact predicates matter: a query omitting `deleted_at IS NULL` cannot rely on an active-row partial index for that condition.

## Migration mechanics

Use a reviewed migration sequence:

1. Baseline the existing database without replaying old DDL.
2. Add new columns/tables/indexes in a backward-compatible form.
3. Backfill in bounded batches with progress and throttling.
4. Verify counts, uniqueness candidates, nulls, and query plans.
5. Switch reads, then writes, behind a reversible boundary.
6. Validate and enforce constraints.
7. Remove old paths only after an observation window.

Keep `CREATE INDEX CONCURRENTLY` outside a transaction when the migration runner wraps each file in a transaction. Do not run direct schema push against a live database. Record rollback and cleanup commands, even when the forward migration is expected to be irreversible.

## Operational signals

Compare deltas across timestamped snapshots, not cumulative counters alone:

- calls and total/mean/p95 duration;
- shared blocks read versus hit;
- temporary blocks read/written;
- rows returned and rows removed;
- WAL volume and write latency;
- cache hit rate, vacuum/analyze freshness, and heap fetches;
- connection waits and behavior under representative concurrency.

Tune `work_mem`, partitioning, or compute size only after confirming the query shape, data distribution, and connection topology. More memory can hide a spill without removing a global ranking or unbounded result problem.
