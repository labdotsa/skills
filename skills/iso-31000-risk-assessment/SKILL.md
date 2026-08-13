---
name: iso-31000-risk-assessment
description: Runs the ISO 31000 risk process—communication, scope/context/criteria, identification, analysis, evaluation, treatment, monitoring, and reporting—using fit IEC 31010 techniques. Use when a defined objective or option must be evaluated, treated, monitored, and accepted against explicit risk criteria and decision authority.
metadata:
  author: labdotsa
  category: product
---

# ISO 31000 Risk Assessment

Keep risk connected to objectives. The process is iterative:

~~~text
communicate and consult
        ↓
scope, context, criteria
        ↓
identify → analyze → evaluate → treat
        ↕
monitor, review, record, report
~~~

## Establish scope, context, and criteria

Create the risk frame:

| Element | Required definition |
| --- | --- |
| Objectives | Outcomes whose uncertainty matters |
| Decision/scope | Option, boundary, activities, interfaces |
| Stakeholders | affected, accountable, expert, veto, risk-bearing |
| Horizon | exposure and review period |
| Context | internal/external conditions and dependencies |
| Criteria | likelihood, consequence, velocity, tolerability |
| Appetite/authority | who may accept which exposure |
| Escalation | non-averagable and mandatory triggers |

Define consequence scales by objective; avoid one unlabeled severity scale for financial, safety, legal, and customer harm.

**Frame complete when:** two informed reviewers would classify the same consequence into the same decision band.

## Identify causal risk scenarios

Write:

~~~text
Because [source/cause],
[uncertain event] may occur,
leading to [consequence for objective].
~~~

Record causes, event, consequences, affected stakeholders, existing controls, evidence, and dependencies separately.

Use workshops, interviews, process mapping, checklists, horizon scanning, incident data, assumptions, and specialist analysis according to the scope. Search for upside uncertainty where it changes objectives.

Create the register:

| ID | Objective | Cause → event → consequence | Evidence | Existing control | Owner |
| --- | --- | --- | --- | --- | --- |

## Select an assessment technique

Choose based on the question and available information:

| Need | Fit techniques | Required output |
| --- | --- | --- |
| Broad identification | structured what-if, checklist, interviews, process mapping | scenario register |
| Causes and preventive/recovery barriers | bow-tie, fault tree, event tree | causal/barrier model |
| Component/process failure | FMEA/FMECA, HAZOP | failure modes and priority |
| Alternative futures | scenario analysis, stress testing | coherent exposures |
| Quantitative outcome range | sensitivity, decision tree, Monte Carlo | distribution/threshold |
| Option under uncertainty | decision analysis, cost-benefit with risk | explicit tradeoff |
| Control reliability | barrier/control assessment | effectiveness evidence |

Document why the technique fits, its inputs, assumptions, strengths, limitations, and validation. A simple matrix is acceptable only when it represents the decision well enough.

Foundation: [IEC 31010 technique selection and application](https://committee.iso.org/sites/tc262/home/projects/published/iec-31010-2009-risk-management-1.html).

## Analyze exposure

For each scenario:

1. assess inherent exposure without controls;
2. test whether existing controls are designed, implemented, and evidenced;
3. assess current exposure with operating controls;
4. consider likelihood, consequence, velocity, duration, detectability, uncertainty, dependencies, and aggregation;
5. mark fatal or non-averagable consequences.

Use:

| Risk | Inherent | Control effectiveness/evidence | Current | Uncertainty | Aggregation/dependency |
| --- | --- | --- | --- | --- | --- |

Do not reduce a rating because a control is planned or merely documented.

## Evaluate against criteria

Compare current exposure with the approved criteria and decide:

~~~text
acceptable
tolerable_with_monitoring
treatment_required
avoid_or_stop
escalate_to_authority
evidence_insufficient
~~~

One fatal consequence can control the decision even when likelihood is uncertain or an average score is favorable.

## Design and verify treatment

Choose **avoid**, **reduce**, **share/transfer**, **accept**, or **exploit**. Complete:

| Treatment | Control mechanism | Owner | Resources/date | Planned target exposure | Evidence required | Verified post-treatment residual | Contingency |
| --- | --- | --- | --- | --- | --- | --- | --- |

The planned target is a hypothesis. Reassess and record **verified post-treatment residual** only after the control operates and evidence shows how it changes cause, likelihood, consequence, detection, or recovery. Until then, current exposure remains unchanged and the scenario stays `treatment_required` or `evidence_insufficient`. Track treatment-created risks.

When exposure is accepted, create:

| Risk/scenario | Exposure accepted | Authority | Conditions | Rationale | Expiry/review date | Override/history |
| --- | --- | --- | --- | --- | --- | --- |

## Monitor and communicate

For material risks, specify:

| Indicator | Baseline | Trigger | Response | Owner | Cadence | Escalation |
| --- | ---: | --- | --- | --- | --- | --- |

Link risk triggers to assumptions, feasibility conditions, financial scenarios, incidents, and decision gates. Preserve consultation, review, acceptance, overrides, and changes in the risk record.

## Deliver the risk system

Deliver the risk frame, Risk Register, technique outputs, risk evaluation, Fatal-Risk Report, Risk Treatment Plan, residual-risk acceptance, Monitoring/Contingency Plan, and communication/reporting record.

Aggregate from the controlling scenario, never an average:

| Status | Controlling condition |
| --- | --- |
| `risk_acceptable` | Every material current/verified residual exposure is within criteria and accepted/owned at the proper authority |
| `acceptable_with_treatment` | Treatments are implemented and verified; remaining residual exposure is accepted with enforceable monitoring conditions |
| `treatment_or_evidence_required` | Any material control is planned/unproven, evidence is insufficient, or current exposure exceeds criteria but remains treatable |
| `unacceptable` | Any scenario is `avoid_or_stop`, a fatal exposure remains unaccepted, or no credible treatment reduces it within criteria |
| `escalation_required` | Exposure may be accepted only by a higher authority or a mandatory trigger/override is active |

Name the authority responsible for accepting residual exposure. One controlling fatal scenario constrains the overall result.

Foundation: [ISO 31000:2018](https://www.iso.org/standard/65694.html) and [IEC 31010:2019](https://www.iso.org/standard/72140.html).
