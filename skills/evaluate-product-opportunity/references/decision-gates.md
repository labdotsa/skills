# Decision gate specifications

Use the gate to authorize the next commitment, not to summarize activity.

## Applicability and dependency manifest

Before routing beyond G0, the decision owner approves:

| Gate | Disposition | Why it can change this commitment | Required handoff type and version policy | Omission consequence |
| --- | --- | --- | --- | --- |

Use `mandatory`, `conditional`, or `not_applicable`. At initialization predeclare the required type and a policy such as `current_at_gate`, `same_option_and_cutoff`, or `named_baseline`; bind the actual handoff ID/version in the Gate Record when it exists. A method omission does not make its evidence requirement disappear; either another current native handoff satisfies the exact check or the gate disposition changes with owner-approved rationale. G8 is blocked when a mandatory dependency is missing, stale, or at the wrong scope/version.

## Gate record

~~~yaml
gate:
decision_authority:
authorization_requested:
current_handoffs:
minimum_evidence_checks:
fatal_failures:
conditions:
result: PASS | PASS_WITH_CONDITIONS | FAIL | INSUFFICIENT_EVIDENCE
authorized_next_commitment:
prohibited_commitments:
reopen_triggers:
decision_date:
~~~

## Gate tests

| Gate | Authorization question | Minimum evidence checks | Fatal or failed result | Failure routing |
| --- | --- | --- | --- | --- |
| G0 Scope | Is a bounded front-end opportunity program authorized? | owner, investment, opportunity, plural concepts, interested parties, fatal dimensions | no decision authority; solution presented as opportunity | prepare/reframe or stop |
| G1 Research | Can the evidence support the intended decisions? | inference map, compatible methods/sample, controls, analysis plan, claim lineage | material inference exceeds design; ethical/legal collection failure | repair protocol or classify evidence exploratory |
| G2 Market | Is there a bounded, reachable arena worth focused discovery? | fit market boundary, needed size/segments/structure/drivers/alternatives | unreachable or structurally nonviable arena; incompatible unresolved boundary | redefine arena, narrow, or stop |
| G3 Customer | Does a consequential problem move a reachable user/buyer? | eligible episodes, consequences, alternatives, roles, negative cases, sample limits, behavioral commitment as needed | problem rejected; buyer/access path absent | change segment/problem or stop |
| G4 Model | Does at least one value/delivery/capture option survive evidence? | assumptions, behavioral test where fatal, customer fit, business-model alternatives, price/access evidence where material | no coherent option; fatal demand assumption contradicted | redesign, pivot, or stop |
| G5 Feasibility | Can the scoped option operate under integrated real conditions? | common design basis, subsystem evidence, interface reconciliation, implementation and specialist conditions | fatal technical/data/legal/safety/operating interface | change option/scope or stop |
| G6 Economics | Can the option sustain contribution and cash under downside? | unit/cohort economics, capacity, working capital, cash/funding, break-even, downside, model checks | negative unavoidable unit economics; unaffordable cash/funding; failed model control | change price/channel/cost/scope/funding or stop |
| G7 Risk | Is residual exposure accepted by the proper authority? | criteria, causal risks, current controls, treatment evidence, residual exposure, owners/triggers | unaccepted fatal risk; control exists only on paper | avoid, treat, redesign, escalate, or stop |
| G8 Decision | Is the requested commitment justified now? | current mandatory handoffs, Five Case integration, counterfactual, red-team, conditions and kill criteria | stale dependency; unresolved material gate; cases conflict | not ready, rework, or stop |

## Result semantics

- **PASS:** minimum evidence passes and the requested next commitment is authorized.
- **PASS_WITH_CONDITIONS:** bounded conditions have owners, deadlines, triggers, and consequences; only the stated commitment is authorized.
- **FAIL:** evidence contradicts a fatal requirement for the current opportunity or option.
- **INSUFFICIENT_EVIDENCE:** evidence cannot support the decision; this is not a weak pass.

## Final verdict mapping

| Gate state | Verdict |
| --- | --- |
| All mandatory gates pass; no blocking condition | **Proceed** |
| Pass with bounded enforceable conditions | **Proceed conditionally** |
| Current form fails but evidence supports another option/segment/problem | **Rework / Pivot** |
| Fatal requirement fails without credible remedy | **Stop** |
| Any material mandatory gate is insufficient or stale | **Not decision-ready** |

Before G8, an independent challenge must test source quality, counterfactual strength, omitted alternatives, financial optimism, delivery capacity, dependencies, residual-risk authority, and kill criteria.
