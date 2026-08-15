# Tenant, lifecycle, and event reference

Use this reference for multi-tenant systems with soft deletion, analytics facts, billing state, or external event delivery.

## Tenant integrity

Choose one of two coherent strategies:

1. Derive tenant identity through joins and do not store redundant tenant keys; or
2. Store tenant keys for access-path/RLS/partitioning benefits and enforce agreement with composite unique keys and composite foreign keys.

Do not mix the strategies casually. A row containing `workspace_id` and `link_id` is unsafe when the database only verifies each foreign key independently; it can pair a valid workspace with a valid link from a different workspace. Apply the same rule across click, conversion, membership, partner, collection, and billing relationships.

## Authorization boundary

For each operation, resolve the submitted resource first, then authorize the actor against that exact resource and its tenant. Keep request context small: identity, tenant, and permission projection. Load counts, collections, reports, and large JSON aggregates only in the route that needs them.

For Supabase/Postgres:

- enable RLS on every table in an exposed schema;
- use explicit tenant/membership predicates, not only `TO authenticated`;
- pair `USING` and `WITH CHECK` for updates;
- use `security_invoker` views on supported Postgres versions or keep sensitive views/functions private;
- never authorize from editable user metadata;
- test anonymous, cross-tenant, cross-collection, viewer/editor/admin, and deleted-row cases.

## Soft deletion

Define separately:

- visibility of active rows;
- whether identifiers can be reused;
- whether historical facts remain reportable;
- whether quotas count deleted rows;
- whether deletion is reversible;
- when physical purge or anonymization occurs.

Apply the active predicate consistently in reads, joins, uniqueness, aggregates, and background jobs. A general-purpose `deleted_at` column is not enough. Use partial indexes for active uniqueness where reuse is intended, and do not use cascading deletes from mutable resources into retained facts.

## Immutable fact model

For an analytics or event system, distinguish:

```text
mutable resource      link / campaign / account
immutable occurrence   click / lead / sale / audit event
identity               customer / external subject
projection             dashboard summary / cycle usage
```

Keep occurrence identity, occurrence time, tenant, attribution key, and required historical snapshots in the fact. Keep current names, permissions, and presentation in read-time joins or projections. Preserve repeated business events unless a reliable idempotency key defines duplicates. Do not deduplicate merely because rows look similar.

Use `SET NULL`, archival, or soft deletion for references from facts to mutable entities when historical rows must survive. If physical deletion of a tenant must erase all facts for legal reasons, state that policy explicitly and test the cascade as a retention operation.

## Customers and conversions

Use a tenant-scoped unique key for external identity, commonly `(tenant_id, external_id)` with an active-row predicate when deleted identities can be recreated. Upsert identity and insert the conversion in one transaction. Resolve click/link attribution once and reuse the result; do not repeat unchecked lookups that can observe inconsistent state.

Define whether lead/sale relationships are explicit, inferred, or optional. Keep currency on every monetary fact and avoid aggregating across currencies. Add occurrence/event timestamps separately from ingestion/update timestamps when delayed delivery matters.

## Webhooks and outbox

Persist an inbox row before processing:

| Column | Purpose |
| --- | --- |
| provider | Namespace event identifiers |
| provider_event_id | Idempotency key |
| payload | Immutable replay/debug source |
| received_at | Ingestion timing |
| status/attempts | Processing state |
| lease/error | Safe retry and diagnosis |
| processed_at | Completion evidence |

Enforce uniqueness on `(provider, provider_event_id)`, not on a provider-blind key. Claim work transactionally, update normalized current state idempotently, and enqueue email/notifications/webhooks in an outbox committed with the state change. A processed timestamp without claim/lease semantics is not sufficient for concurrent delivery.

## Retention and privacy

Set field-level rules for raw IP, exact location, user agent, referrer, destination query strings, customer metadata, secrets, and provider payloads. Prefer coarse derived geography for user-facing analytics. Make cleanup batches bounded and observable. Define anonymization versus deletion, the legal hold exception, and how projections are repaired after purge. Treat retention as part of schema design because it changes indexes, partitions, rollups, foreign-key behavior, and query predicates.
