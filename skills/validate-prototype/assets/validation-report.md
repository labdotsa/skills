# Prototype validation report

## Decision

- Verdict: `accepted | not-accepted | incomplete | blocked`
- Mode: `focused | release | retest`
- Capability: `integrated | limited | blocked`
- Revision:
- Target and environment:
- Browser mechanism:
- Acceptance source:
- Primary configuration:

State the decision and the smallest evidence-backed reason.

## Run contract

List must-work journeys, changed surfaces, risk triggers, non-goals, prohibited side effects, and unavailable capabilities.

## Journey results

| Scenario | Outcome | Configuration | Observable result | Evidence | Expansion trigger |
| --- | --- | --- | --- | --- | --- |

Use `pass`, `fail`, `blocked`, or `not-run`. Never imply that an untested cell passed.

## Findings

For each finding, include expected and actual behavior, minimal reproduction, user consequence, evidence, root-cause status, relevant source locations, confidence, and observable retest condition. Keep defects, intermittent failures, UX hypotheses, environment failures, and coverage gaps distinct.

## Confirmed passes

Summarize decision-relevant passes compactly.

## Gaps and human decisions

List unavailable capabilities, untested triggered dimensions, deferred human-only claims, and accepted risks.

## Next action

Nominate no more than three to five deduplicated root-cause groups for later human prioritization. Do not create tickets or an implementation plan inside this report.
