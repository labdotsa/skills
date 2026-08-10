# Information Classification Rules

## Purpose

Classify every material statement before it becomes authoritative. The classification governs wording, placement, and
whether implementation may rely on it.

## Classes

| Class | Meaning | Treatment |
| --- | --- | --- |
| Confirmed fact | Explicitly supplied or approved by an accountable stakeholder | State directly and preserve its source meaning. |
| Working assumption | Reversible interpretation introduced to make progress | Label it, explain why it is reasonable, and place it in assumptions when cross-cutting. |
| Accepted decision | A chosen direction that constrains multiple artifacts | Add a decision-log entry and propagate it through every affected artifact. |
| Proposed decision | A recommended direction awaiting approval | Keep alternatives and tradeoffs visible; do not write downstream documents as though it is accepted. |
| Open question | Missing information whose answer could materially change behavior | Record the decision needed, its impact, and the responsible owner if known. |
| Inference | Conclusion derived from supplied evidence rather than directly stated | Identify it as an inference and retain the supporting evidence. |

## Classification tests

Ask in order:

1. Did the user or an authoritative source explicitly state this? If yes, treat it as a confirmed fact.
2. Did the user explicitly choose among alternatives? If yes, treat it as an accepted decision.
3. Is this necessary to proceed but reversible without restructuring the product? Treat it as a working assumption.
4. Would different answers change money, permissions, lifecycle, scope, or application boundaries? Keep it open.
5. Was it derived from several facts? Mark it as an inference.

Do not upgrade repeated assumptions into facts merely because several artifacts copied them.

## Source ledger

For complex briefs, keep a temporary ledger while writing:

| Statement | Class | Source | Confidence | Owner artifacts |
| --- | --- | --- | --- | --- |
| Example rule | Confirmed fact | Stakeholder brief | High | Domain, journey, requirements |
| Example duration | Open question | Not supplied | — | Policy, admin, notifications |

The ledger may remain internal unless traceability is itself a product requirement. Cross-cutting assumptions,
questions, and decisions belong in durable artifacts.

## Wording rules

- Use “must” for accepted required behavior.
- Use “should” for a recommendation, not a hidden requirement.
- Use “may” for permitted optional behavior.
- Use “working assumption” explicitly when downstream work relies on it.
- Use “open decision” when implementation must wait for a stakeholder choice.
- Avoid “likely,” “obviously,” and “typically” when they conceal uncertainty.

## Conflict handling

When new information conflicts with an artifact:

1. Prefer the latest explicit stakeholder decision.
2. Preserve the earlier decision as superseded when it had been accepted.
3. Update every derived artifact; do not leave both definitions active.
4. Report ambiguity when authority or recency cannot be determined.
