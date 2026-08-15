# End-to-end database audit template

Fill this structure when reviewing an existing application. Keep evidence links or file/line references beside each material finding.

## 1. Scope and evidence

```text
System/boundary:
Database/dialect/version:
Tenant/security boundary:
Primary read/write surfaces:
Observed production metrics and time window:
Known generated/deployed schema source:
Unknowns requiring access or measurement:
```

## 2. Domain map

| Concept | Kind | Owner/tenant | Lifecycle | Source of truth | Historical snapshot? | Delete behavior |
| --- | --- | --- | --- | --- | --- | --- |

## 3. Integrity ledger

| Invariant | Current enforcement | Gap | Proposed enforcement | Concurrency risk | Test fixture |
| --- | --- | --- | --- | --- | --- |

Check tenant agreement, required fields, uniqueness/case rules, state transitions, quotas, last-owner rules, monetary units, idempotency, and deletion semantics.

## 4. Normalization ledger

| Field/table | Current shape | Keep/normalize/denormalize | Reason | Source of truth | Repair path |
| --- | --- | --- | --- | --- | --- |

Flag duplicated tenant keys, mutable labels copied into facts, repeated permission booleans, formatted money, provider payloads, and JSON fields that have become query dimensions.

## 5. Computation placement

| Value/query | Current location | Preferred location | Freshness | Rebuild/invalidation | Evidence |
| --- | --- | --- | --- | --- | --- |

## 6. Query catalog and indexes

| Query family | Cardinality | Predicates/joins/order | Current plan | Candidate access path | Measured acceptance |
| --- | ---: | --- | --- | --- | --- |

Capture exact SQL, `EXPLAIN (ANALYZE, BUFFERS)`, temporary IO, heap fetches, concurrency, write cost, and pagination stability.

## 7. Transactions and external events

```text
Identity/upsert boundary:
Fact insertion boundary:
Quota or state-transition locks:
Idempotency keys:
Webhook inbox uniqueness/claiming:
Outbox and side effects:
Retry and replay behavior:
```

## 8. Lifecycle, privacy, and operations

```text
Active-row predicate:
Identifier reuse rule:
Retention/anonymization/purge:
Projection repair after deletion:
Migration/backfill sequence:
Rollback and observation window:
Metrics and alerts:
```

## 9. Finding format

Use one finding per claim:

```text
[ID] Short finding
Evidence: exact source, query, plan, or metric.
Impact: correctness, security, latency, IO, cost, or operability.
Confidence: high / medium / low.
Decision: retain, normalize, constrain, compute at request time, roll up, or defer.
Migration: additive steps, backfill, verification, rollback/cleanup.
Test: fixture, plan threshold, access matrix, or replay case.
```

## Completion checklist

- [ ] Every table has an owner, tenant boundary, lifecycle, and source-of-truth classification.
- [ ] Every duplicated field has an explicit consistency or snapshot policy.
- [ ] Every JSON field has a queryability, typing, size, and privacy decision.
- [ ] Every hot query has measured predicates, ordering, pagination, and plan evidence.
- [ ] Every tenant relationship is enforced or consciously derived.
- [ ] Every external retry path has uniqueness and transaction semantics.
- [ ] Every soft-delete rule agrees with uniqueness, aggregates, retention, and foreign keys.
- [ ] Every projection has a rebuild and freshness contract.
- [ ] Every migration has a safe sequence, rollback/cleanup, and post-change verification.
