# Audit and diagnostic loop

Audit to improve the live decision system, not to produce a decorative score. Trace symptoms to causes, turn causes into corrective work, and re-verify the result.

## Scope and evidence

1. Define the target: URL set, route family, template, flow, locale, device class, traffic source, and relevant release or incident.
2. Recover or create the governing brief from `page-models.md`. Mark missing intent, ownership, evidence, measures, or constraints as findings.
3. Inspect source content, rendered HTML, interaction states, network behavior, status and headers, structured data, analytics contracts, field/lab performance, and downstream delivery available within scope.
4. Exercise the critical journey with keyboard, representative screen reader, narrow/reflow and wide layouts, zoom, reduced motion, long or RTL content where supported, slow/failing dependencies, consent choices, validation errors, refresh, retry, and duplicate action.
5. Separate evidence classes:
   - **Observed** — directly reproduced or visible.
   - **Measured** — produced by a named test, query, or telemetry source.
   - **Reported** — supplied by a stakeholder or third party but not reproduced.
   - **Inferred** — plausible synthesis requiring validation.
   - **Unknown** — material evidence is unavailable.

Never present an automated scan, Lighthouse score, crawler result, screenshot, or live-site comparison as complete proof.

## Diagnostic passes

Run these passes in order so later optimization does not hide foundational harm:

1. **Truth and safety** — deceptive or unsupported claims, hidden terms, inaccessible critical routes, privacy leakage, invalid consent, broken transactions, exploitable input/auth/session behavior.
2. **Purpose and comprehension** — page job, audience, message match, scan completeness, objections, evidence, CTA contract, alternatives, and recovery.
3. **Page-family fitness** — compare the route against the relevant contract in `page-models.md`.
4. **Experience quality** — information architecture, semantics, accessibility, forms, responsive behavior, localization, motion, and complete states.
5. **Delivery quality** — initial HTML, status/canonical/index rules, resilience, performance, structured data, security controls, and third parties.
6. **Measurement quality** — event correctness, consent enforcement, deduplication, attribution, downstream quality, experiment validity, and guardrails.
7. **Operations** — ownership, sources of truth, review triggers, expiring claims, broken-link/content monitoring, support routes, rollback, and retirement policy.

## Severity and confidence

Assign severity from consequence and reach, not visual prominence:

| Priority | Meaning | Typical action |
|---|---|---|
| P0 | Active harm, falsehood, security/privacy exposure, inaccessible or broken critical journey | Stop, remove, disable, disclose, or repair before optimization |
| P1 | Missing system control or broad structural failure | Establish ownership, shared contract, correct delivery, or release gate |
| P2 | Material friction or weak decision support | Improve structure, copy, proof, comparison, form, recovery, or locale behavior |
| P3 | Responsible optimization opportunity after foundations pass | Test a defined hypothesis with downstream guardrails |

Set confidence to `high`, `medium`, or `low` based on reproducibility, source quality, and causal distance. Do not inflate severity to compensate for weak evidence.

## Finding contract

Write every actionable finding as:

```yaml
id: PP-001
priority: P0 | P1 | P2 | P3
confidence: high | medium | low
surface: URL, template, state, locale, or flow
visitor_job: affected intent or task
evidence:
  class: observed | measured | reported | inferred | unknown
  detail: reproducible evidence and method
problem: externally visible failure
root_cause: nearest supported systemic cause
consequence: user, business, legal, operational, or technical effect
correction: smallest coherent remedy
acceptance: observable pass condition
owner: role or unknown
dependencies: prerequisites or none
```

Do not file duplicate symptoms when one root cause owns them. Link affected routes and states to one systemic finding.

## Audit output

Return:

1. **Decision summary** — page job, overall fitness, highest consequence, and recommended next move.
2. **Evidence and limits** — inspected surfaces, methods, unavailable evidence, and inference boundaries.
3. **Findings** — ordered by priority, then confidence and reach.
4. **Corrective backlog** — root cause → fix → owner → dependency → acceptance evidence.
5. **Verification plan** — automated, manual, field, and downstream checks required after correction.
6. **Residual risk** — unresolved unknowns, accepted risks, and review triggers.

Avoid composite vanity scores. If a score is explicitly required, publish the underlying findings and weighting so it cannot conceal a P0 failure.

## Close the loop

After changes:

1. Reproduce the original failure and demonstrate that it no longer occurs.
2. Rerun checks affected by the correction, including adjacent states and locales.
3. Confirm that the correction did not shift harm into performance, accessibility, privacy, comprehension, or downstream quality.
4. Update the claim ledger, page inventory, test evidence, owner, and review trigger.
5. Keep unresolved findings in the prioritized backlog; do not silently downgrade them because the release shipped.
6. Monitor field outcomes and guardrails. Reopen diagnosis when observed behavior contradicts the hypothesis.

