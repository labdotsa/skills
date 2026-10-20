# Investigate security boundaries

Select checks from the threat model. This table is a routing aid, not a mandate to run every class.

| Target evidence | Investigate |
| --- | --- |
| Multiple users, roles, or tenants | Authentication, object and action authorization, tenant filters, privileged background jobs, confused deputies, cache ownership. |
| Untrusted input reaches interpreters or files | Query and command injection, template execution, parser differentials, unsafe deserialization, path traversal, archive extraction. |
| Outbound requests or callbacks | SSRF, redirects, URL parsing, DNS changes, metadata access, webhook verification, replay, destination policy. |
| Sensitive browser or session state | XSS, CSRF where applicable, cookie scope, token lifecycle, login and recovery, origin and CORS policy. |
| Money, inventory, entitlements, or asynchronous work | State transitions, race conditions, idempotency, replay, atomicity, approval and settlement boundaries. |
| Secrets, crypto, or retained data | Key handling, cryptographic misuse, disclosure, logs and exports, deletion, backups, retention, trust in client claims. |
| Native code or resource-sensitive inputs | Bounds, ownership, lifetime, integer conversion, concurrency, parser limits, resource exhaustion. Use bounded local tests. |
| Packages, builds, CI, or deployment | Exact dependency versions, advisory applicability, lockfiles, provenance, install hooks, workflow permissions, release trust, configuration. |
| Agents, retrieval, tools, or MCP | Instruction precedence, retrieved-content injection, tool poisoning, credential access, purpose and permission fit, cross-session persistence. |

## Trace a candidate end to end

Record the following in one compact candidate:

1. The lower-trust actor and what the actor can control.
2. The entry point, ordered calls, transformations, guards, and sensitive operation.
3. The resource and intended security invariant.
4. The missing or bypassed control and a concrete consequence.
5. The exact source state, paths, lines, configuration, prerequisites, and contradictory evidence.
6. A falsifiable local test or deterministic source argument, with the fact that would disprove it.

Inspect upstream authorization and downstream filters. Compare a safe path. Distinguish a suspicious sink from a reachable unsafe path. A sanitizer's presence is not sufficient without checking that it handles the relevant input and interpreter.

For a dependency alert, verify the resolved version, affected feature, actual use, reachability, and mitigation. If advisory freshness matters but an authorized lookup is unavailable, record that limitation. Do not invent a CVE or infer exploitability from a version range alone.

For a suspected secret, retain a redacted location and pattern. Do not test the value against a service or copy it into evidence. A dummy fixture value and an active leaked credential have different implications. Unknown liveness remains unknown.

For examples, tests, debug code, optional features, and non-default deployments, verify whether the path is shipped, reachable, or reused. Record the conditions. Do not dismiss a finding solely because of a directory name or accept it solely because a dangerous function exists.

## Delegate without shared-state conflicts

Give each hunter an assigned coverage unit, the shared threat model, source-state identifier, read-only target, execution policy, budget, and private output location. Request candidate evidence and reviewed or blocked units. Avoid duplicate sweeps over the whole repository.

Hunters cannot confirm their own candidates. The coordinator reconciles their records and assigns fresh validators. When agents are unavailable, perform the bounded source investigation and disclose the missing independence. Do not simulate a second agent by changing roles in the same conversation.

Deduplicate only when the same root cause, control, and affected behavior are supported. Link multiple entry points and consequences to one record where appropriate. Keep distinct causes separate even when their symptoms look similar.
