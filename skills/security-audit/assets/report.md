# Security audit report

## Contract and result

- Audit status: complete, partial, or blocked. Missing required independent review, unresolved candidates, or unfinished in-scope coverage prevent complete, including in static package reviews.
- Scope, exclusions, purpose, source state, and diff inputs.
- Threat model, assumptions, and unresolved deployment conditions.
- Environment, tool versions, authorization, execution limits, and budget used.
- Independent validation and final review capability.
- For agent packages, the separate installation recommendation and limits.

## Confirmed findings

| ID | Severity and reason | Actor, boundary, and impact | Source evidence | Independent review | Reproduction | Fix status |
| --- | --- | --- | --- | --- | --- | --- |

For each finding, include the concrete path, conditions, minimal redacted evidence, legitimate comparison, and smallest root-cause repair. A source-confirmed finding must state when runtime reproduction was not performed.

## Unresolved and rejected claims

| ID | Validity | Evidence or counterevidence | Blocker | Smallest resolving check |
| --- | --- | --- | --- | --- |

Keep hardening observations separate from vulnerability findings. Include rejected claims compactly when they explain scanner noise or earlier reported concerns.

## Coverage and limits

| Unit ID and paths | Boundary or control | State | Evidence or reason |
| --- | --- | --- | --- |

Give the total number of units, then separate counts for each current state: planned, reviewed, blocked, deferred, and out_of_scope. Every unit belongs to exactly one state, and the state counts sum to the total. Name material untested behavior, omitted high-risk boundaries, unavailable tools, failed commands, and budget stops. Zero findings means none were confirmed within this scope and these limits.

## Repair verification

For each requested patch, record nonmutating artifact syntax and applicability checks separately from security verification. Also record the baseline and final source states, environment, original attack, independent bypass checks, legitimate behavior, project checks, verifier, and final patch status. Name any remaining blocker and the next resolving action. Omit this section when repairs were not requested.
