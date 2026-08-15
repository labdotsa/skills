# Prefixed ID migration playbook

## Inventory before changing shape

Search schema, migrations, ORM models, raw SQL, route parameters, serializers, form defaults, caches, object storage keys, event payloads, exports, analytics dimensions, and external integrations. Record old shape, new shape, source of truth, owner, and rollback behavior for every reference.

Do not assume a database column is the whole ID surface. A bare ID may also be embedded in a URL, JSON document, signed token, cache key, filename, webhook payload, or audit log.

## Safe rollout

Use an additive rollout when downtime is not acceptable:

1. Add the new column or canonicalization function without removing the old path.
2. Add validation and uniqueness constraints for rows that are already migrated.
3. Create a durable old-to-new mapping table when values cannot be deterministically transformed.
4. Backfill parent rows in bounded batches, then children, then embedded references.
5. Validate counts, uniqueness, prefix grammar, FK coverage, tenant scope, and unresolved references.
6. Dual-read only for a bounded compatibility window; prefer the new value and record fallback usage.
7. Dual-write only when external writers still use the old contract. Make writes idempotent.
8. Switch all readers and writers, then enforce `NOT NULL`, checks, and FKs.
9. Remove fallback code and old columns only after consumers have crossed the contract boundary.

For a maintenance window, use one transaction only when the affected set and lock duration are known. Never rely on an unbounded table rewrite for a high-volume table.

## Preserve identity through renames

Keep prefixes stable across table and domain renames. If `subscription` is renamed to `expense_recurring`, preserve `subscription_` IDs unless a separately justified API migration changes every consumer. A prefix is part of the identifier contract, not a generated reflection of the current table name.

## Acceptance evidence

Capture:

- old and new row counts by resource and tenant;
- duplicate, null, malformed, and orphan counts before and after;
- mapping-table coverage and unresolved external references;
- representative API, URL, event, cache, and object-storage round trips;
- foreign-key and check-constraint validation results;
- query plans and index sizes after the type/width change;
- backfill duration, lock/replication impact, and rollback rehearsal;
- fallback-read and dual-write usage during the compatibility window.

Do not delete the mapping or old representation until rollback is no longer possible and every external consumer has acknowledged the new contract.
