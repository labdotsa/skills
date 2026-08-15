---
name: database-design
description: This skill should be used when the user asks to "design a database", "review a database schema", "normalize a schema", "decide what to compute at request time", "optimize database queries", "design indexes", "model multi-tenant data", or "plan database migrations"; or when an existing application's data model must be analyzed end-to-end across domain rules, read/write paths, performance, security, and lifecycle.
metadata:
  author: labdotsa
  category: engineering
---

# Database Design

Design the data system as a set of truths, invariants, access paths, and lifecycle policies. Treat the schema, queries, application services, jobs, authorization rules, and operational evidence as one design surface. Optimize for correctness first, then measured workload cost, then convenience.

## Start with evidence, not tables

Inspect the repository before proposing a schema:

1. Read domain vocabulary, requirements, routes, services, jobs, migrations, seed data, and retention documentation.
2. Locate every database read and write with `rg`, including raw SQL, ORM builders, views, RPCs, triggers, and background workers.
3. Identify request-critical paths, asynchronous paths, batch/export paths, and administrative paths.
4. Capture actual query shapes, predicates, joins, ordering, pagination, selected columns, expected cardinality, freshness, and latency requirements.
5. Compare source-defined indexes and constraints with the deployed catalog. Treat migrations as history, not proof that production matches source.
6. Classify each conclusion as observed, inferred, or unknown. Record the source and confidence for every consequential claim.

Build a compact workload register:

| Path | Actor/tenant | Read or write | Predicate/join | Ordering/page | Rows touched/returned | Freshness/SLA | Mutation frequency |
| --- | --- | --- | --- | --- | ---: | --- | --- |

Do not infer a schema from entity names alone. A table that looks like a child may be an immutable fact, a current projection, a user-owned resource, or a provider snapshot; each requires different constraints and deletion behavior.

## Model ownership, facts, and state

Separate concepts that change for different reasons:

- **Identity** — profile, account, workspace, customer, external subject.
- **Resource** — link, collection, document, project, or other mutable object.
- **Relationship** — membership, role, tag assignment, subscription assignment.
- **Fact/event** — click, payment, audit entry, webhook receipt, message, measurement.
- **Policy/configuration** — plan entitlement, targeting rule, rate limit, feature setting.
- **Projection/read model** — a deliberately derived representation optimized for a read path.

For each entity, define its owner, tenant boundary, lifecycle states, legal transitions, deletion meaning, retention period, and whether historical accuracy requires snapshots. Write invariants in database terms: `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys, exclusion constraints, transaction boundaries, or explicit application-level policies when the database cannot express the rule.

Treat immutable facts differently from mutable resources. A fact may copy destination, campaign, currency, or actor labels at occurrence time to preserve what was true then. Mark such fields as historical snapshots; do not later join a mutable resource and silently rewrite history. Avoid foreign keys with cascading deletes from an immutable fact to a user-managed resource unless destroying the fact is explicitly part of the retention contract. Prefer `SET NULL`, soft deletion, or an archival boundary where history must survive.

## Normalize deliberately

Normalize a value when it has an independent identity or lifecycle, is shared by multiple rows, must remain consistent, is independently authorized, or is queried as a dimension. Use junction tables for many-to-many relationships. Use one column per stable, fixed-dimensional attribute; first normal form does not require turning every small set of columns into JSON or an entity table.

Run these tests before denormalizing:

- Does the field describe the row's key, the whole key, or another non-key fact?
- Can two copies disagree? If so, which copy wins and how is the other repaired?
- Does the value need its own uniqueness, permissions, retention, audit trail, or index?
- Does the value vary independently, or only as part of the parent aggregate?
- Will writes be more frequent than reads, and can all affected copies update atomically?

Keep JSON/JSONB for opaque provider payloads, sparse extensible attributes, or configuration whose keys are not stable query dimensions. Define a typed contract, size limits, redaction rules, and migration strategy. Extract a JSON field into a table or typed column when it becomes filterable, sortable, relational, security-sensitive, high-volume, or required for an invariant.

Allow denormalization only with a declared reason:

- historical snapshot or audit fidelity;
- a read projection with a named owner and rebuild path;
- a bounded hot-path optimization backed by measurements;
- a provider payload retained for replay/debugging.

For every duplicated value, document source of truth, update transaction, stale-data tolerance, repair/rebuild command, and whether reads may fall back to the canonical row. Never call a cache, counter, formatted money string, or copied label canonical merely because it is convenient to select.

## Choose where computation belongs

Use this placement test:

| Computation | Prefer | Reason |
| --- | --- | --- |
| Canonical input or user-owned state | Write transaction | Enforce once and make it durable |
| Small, selective, current presentation | Request time | Avoid stale copies and unnecessary storage |
| Expensive repeated aggregate over append-only facts | Rollup/materialized projection | Bound read latency and repeated work |
| Optional enrichment, search indexing, notifications | Background worker | Keep the response path resilient |
| External event receipt | Durable inbox first | Make replay and idempotency possible |

Compute during serving when the query is selective, bounded by tenant/date/page, cheap relative to the latency budget, and must reflect current filters or permissions. Persist or roll up when the same expensive grouping/window/ranking is repeated across users, the source is large and append-heavy, the result has a clear freshness contract, or request-time work spills to disk. Use a background job when the result is optional or can become eventually consistent without changing the primary response.

Keep raw facts even after adding a projection. Make rollups rebuildable and define how late events, edits, deletion, retention, plan changes, and backfills affect them. Prefer bounded aggregate endpoints plus cursor-paged detail over downloading every raw fact to a browser and recomputing summaries there. Keep global request hooks limited to authentication and small authorization context; move usage counts, JSON aggregation, and route-specific reports to the route that needs them.

## Design tenant integrity and authorization together

Put the tenant key on every tenant-owned row when it materially improves filtering, partitioning, RLS, or operational isolation. Redundant tenant keys create a consistency obligation: enforce them with composite foreign keys or equivalent database constraints. For example, a child carrying `(workspace_id, link_id)` must be unable to point at a link from another workspace. Do not rely on every application query remembering to compare both values.

Make every read and mutation authorize the submitted target, not merely the currently selected resource or a tenant-wide role cached in request state. Scope list, count, join, detail, and aggregate queries by tenant and accessible sub-resource. In Supabase/Postgres exposed schemas, enable RLS and write policies for the actual ownership/membership model; authentication alone is not authorization. Protect views with invoker semantics or place server-only views/functions outside exposed schemas. Never use editable user metadata as an authorization claim.

Keep sensitive values out of broad projections. Hash secrets and make them write-only. Treat raw IPs, exact coordinates, URLs with query strings, customer metadata, and provider payloads as data-lifecycle concerns, not merely columns. Define masking, retention, deletion, and access rules before adding analytics fields.

## Derive indexes from access paths

Start with the query, not the foreign-key list. For each hot query, align indexes with equality predicates first, then range predicates, then deterministic ordering and tie-breakers. Add partial predicates only when they exactly match the query's semantic scope, such as active rows. Add included columns only for a measured covering/index-only path; remember visibility-map health and heap fetches still matter.

Use stable cursor pagination such as `(created_at, id)` for changing fact streams. Reserve `OFFSET` for small, bounded, immutable snapshots. Avoid indexing every foreign key: indexes increase write latency, WAL, storage, vacuum work, and migration IO. A foreign key protects integrity but does not automatically provide a useful read path.

Validate candidates in this order:

1. Freeze correctness fixtures and representative tenant distributions.
2. Capture generated SQL and `EXPLAIN (ANALYZE, BUFFERS, SETTINGS, FORMAT JSON)` in staging or a safe replica with a protective timeout.
3. Inspect estimates versus actual rows, scans, sort methods, temp blocks, heap fetches, and rows removed by filters.
4. Use hypothetical indexes only to compare planner choices; validate winners with physical staging indexes and concurrent load.
5. Compare latency, shared IO, temporary IO, WAL/write cost, cache behavior, and concurrency—not only a single warm-cache runtime.
6. Create production indexes concurrently where supported, analyze, soak, and remove overlapping indexes only in a later measured change.

When a global eligibility rule ranks every fact before grouping, do not assume a covering index solves the whole problem. Consider a cycle-aware rollup or precomputed sequence only after preserving the rule in characterization tests.

## Make writes atomic and replayable

Use database uniqueness as the arbiter for identity and idempotency. Prefer one transaction for “resolve-or-create identity, validate attribution, and insert fact.” Replace read-then-insert races with `INSERT ... ON CONFLICT` after adding the correct tenant-scoped unique constraint. Add an idempotency key when an external caller may retry; distinguish legitimate repeated business events from duplicate delivery.

Lock or otherwise serialize quota, last-owner, balance, inventory, and state-transition invariants. For webhooks, persist the raw receipt with a provider-scoped unique event key, claim it with a lease/attempt state, process normalized state transactionally, and make side effects an idempotent outbox. Store provider payloads for replay, but do not make JSON the only queryable representation of current subscription or invoice state.

Use integer minor units plus an explicit currency for money. Preserve provider values needed for audit, but treat formatted amounts and converted totals as presentation or valuation snapshots with a declared rate/time basis. Never add values across currencies without an explicit conversion policy.

## Plan lifecycle and migrations

Treat soft deletion as a domain decision, not a universal boolean. Every active query must apply the predicate consistently. Align active-row unique constraints with the rule, commonly through a partial unique index. Decide whether deleted facts still consume quotas, remain visible in aggregates, or are physically retained for compliance.

Use additive, observable migrations: baseline the existing database, add nullable structures, backfill in throttled batches, validate counts and invariants, switch reads/writes, enforce constraints, then remove obsolete structures. Generate reviewed SQL; do not use direct schema push against a live database. Separate concurrent index creation from transactional migrations when the migration runner requires a transaction. Record rollback, dual-read/dual-write duration, backfill progress, and post-migration plan evidence.

## Deliver the design as an auditable package

Return:

- a domain/table map with ownership, source of truth, lifecycle, and fact/projection classification;
- relationship and invariant decisions, including composite tenant constraints;
- a normalization/denormalization ledger for every duplicated or JSON field;
- a computation-placement table covering request, write, rollup, and background work;
- a query catalog with access paths, indexes, pagination, and bounded result contracts;
- security, privacy, retention, and deletion behavior;
- transaction/idempotency/concurrency rules;
- a staged migration and rollback plan;
- characterization fixtures, representative data distributions, plan captures, and acceptance thresholds;
- unresolved questions and evidence needed to decide them.

### Link-analytics pattern to reuse

For a short-link product, model the mutable link separately from immutable click facts and conversion facts. Keep a customer identity unique within its workspace by external identifier; keep lead and sale rows distinct when repeated activity is valid. Snapshot attribution fields on click facts when historical reporting requires them, but do not cascade-delete the history merely because a partner or link is archived. Serve bounded aggregates and cursor-paged detail; introduce per-workspace/per-cycle/per-link rollups only when measured raw-fact ranking remains too expensive. This pattern captures the central design lesson: normalize identity and relationships, denormalize historical facts intentionally, and compute presentation-specific values as late as correctness and latency allow.

## Additional resources

Read the supporting references when the task needs more than the core workflow:

- **`references/normalization-and-computation.md`** — classification tests, denormalization ledger, and request/write/rollup/background decision patterns.
- **`references/postgres-access-paths.md`** — index selection, query-plan evidence, pagination, rollups, and migration mechanics.
- **`references/tenant-lifecycle-and-events.md`** — multi-tenant integrity, RLS, soft deletion, retention, event facts, billing, webhooks, and outbox design.
- **`references/audit-template.md`** — a fill-in end-to-end database review structure and acceptance checklist.
