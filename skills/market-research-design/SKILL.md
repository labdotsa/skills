---
name: market-research-design
description: Designs and audits reproducible market, opinion, customer, and behavioral research under ISO 20252 and ICC/ESOMAR principles. Use when the required output is an auditable collection protocol or as-executed audit covering decision questions, method, sampling, instruments, fieldwork, and quality controls.
metadata:
  author: labdotsa
  category: product
---

# Market Research Design

Design the study backward from the decision. The protocol is a control document: another researcher should be able to repeat the material choices and explain every deviation.

## Route the assignment

Choose one path. Do not ask an active or completed study to satisfy a pre-fieldwork action retroactively.

| Starting state | Path | Native control record | Permitted closure |
| --- | --- | --- | --- |
| No material collection | **prospective protocol** | Research Protocol | `protocol_ready` or `not_ready` |
| Collection is active | **fieldwork audit** | Deviation and Amendment Record plus prospective protocol version | `continue_fieldwork`, `pause_for_repair`, or `terminate_invalid` |
| Collection is complete or findings exist | **retrospective evidence audit** | As-Executed Research Record | `decision_usable_with_limits`, `exploratory_only`, or `invalid_for_claim` |

Stop protocol design when no named decision owner can state what action a plausible finding would change. Record **decision_unbounded** instead of producing decorative research questions.

For an active study, preserve everything collected under the prior version. Reconstruct the decision and inference map, compare planned versus achieved sample to date, log instrument/protocol deviations and affected cases, decide whether the intended inference remains supportable, and apply any repair only to future cases. A material ethical, consent, identity, or data-integrity breach pauses or terminates fieldwork.

For a completed study, reconstruct the as-executed sample, instrument versions, fieldwork, exclusions, transformations, and analyses. Compare every reported claim with what that design can support. Planned analyses retain their status; post-hoc cuts remain exploratory. Recommend prospective confirmation when the decision requires an inference the completed design cannot support.

## 1. Lock the decision contract

Create this record first:

| Field | Required content |
| --- | --- |
| Decision | One choice, approval, threshold, or prioritization the research informs |
| Owner | Person or body authorized to act |
| Options | Real alternatives, including current state |
| Population | People, organizations, events, or records to which conclusions may apply |
| Unit of analysis | Exact counted or interpreted unit |
| Scope | Geography, segment, channel, period, language |
| Error costs | Consequence of false positive and false negative |
| Deadline | Date evidence must be usable |

**Complete when:** the owner can describe at least two plausible findings and the different action each would cause.

## 2. Build the inference map

Give every research question an ID and complete one row:

| Question ID | Decision-linked question | Claim to test | Needed evidence | Population/unit | Result states | Decision consequence |
| --- | --- | --- | --- | --- | --- | --- |

Write result states before choosing a method: **support**, **contradict**, **mixed**, and **insufficient**. Remove questions whose result has no decision consequence.

**Complete when:** every planned conclusion has a question ID and every question has a consequence.

## 3. Match method to inference

Use the narrowest method that can support the intended claim:

| Intended inference | Primary method | Required guardrail |
| --- | --- | --- |
| Definition, regulation, historical baseline | Desk research | Verify date, scope, lineage, and measurement definition |
| Chronology, mechanism, language, workaround | Event-based interview or observation | Anchor in recent behavior; retain negative cases |
| Prevalence or subgroup comparison | Probability survey or defensible sampling frame | Calculate precision and non-response risk |
| Directional pattern in a hard-to-reach group | Purposive or quota sample | Label the boundary; make no population estimate |
| Actual behavior or performance | Operational, transactional, or telemetry data | Document generation process, missingness, and exclusions |
| Causal effect | Randomized or defensible quasi-experiment | Predefine assignment, counterfactual, outcomes, and analysis |

Combine methods only when each fills a named gap. “Triangulation” without a claim-level role is not a design.

## 4. Construct the sample

For every participant or record source, specify:

~~~yaml
sampling_frame:
eligibility:
exclusions:
recruitment_path:
strata_or_quotas:
target_n:
precision_or_saturation_logic:
replacement_rule:
nonresponse_tracking:
known_coverage_gaps:
~~~

Choose the branch:

- **Population estimate:** use a probability frame where feasible; calculate target size from expected variability, precision, confidence, design effect, subgroup requirements, and anticipated non-response.
- **Qualitative mechanism:** sample for variation across roles, behaviors, contexts, outcomes, and disconfirming cases. Stop only when new eligible cases no longer change the decision-relevant pattern and known gaps are named.
- **Convenience access:** use it for exploration, instrument development, or mechanism discovery. Keep prevalence and representativeness outside the claim set.

**Planning gate:** every intended inference is compatible with the frame, recruitment path, target sample, and precision or saturation logic.

At each active-study checkpoint and at close, create an achieved-sample audit:

| Planned element | Achieved result | Deviation | Inference affected | Repair or limitation |
| --- | --- | --- | --- | --- |

An achieved sample can narrow an inference; it cannot be repaired by quietly changing the target population after collection.

## 5. Build and pilot collection

Create the instrument from the inference map. Each prompt, observation field, or measure must map to a question ID.

Run a pilot that tests:

1. eligibility and consent;
2. comprehension and translation;
3. recall period and response burden;
4. leading, double-barreled, or ambiguous wording;
5. answer-option coverage and order effects;
6. observer/interviewer consistency;
7. capture, storage, and export;
8. whether the resulting data can answer the mapped question.

Record pilot issue → consequence → revision in an instrument change log. Freeze the production version after the pilot. Version later changes and identify affected cases.

## 6. Install fieldwork controls

Predefine:

- consent, privacy notice, minimization, access, retention, and deletion;
- incentives and conflicts of interest;
- interviewer/observer training and calibration;
- identity, eligibility, duplicate, speed, and attention checks;
- treatment of partials, missing data, outliers, and protocol violations;
- subcontractor responsibilities and handoffs;
- adverse-event and complaint escalation;
- daily or batch quality review.

Preserve paradata needed to audit recruitment, exposure, non-response, exclusions, and changes. Human oversight remains accountable when automation or synthetic data contributes.

## 7. Freeze the analysis plan

Before inspecting confirmatory results, define:

~~~yaml
primary_outcomes:
derived_variables:
coding_rules:
exclusions:
weights:
comparisons:
subgroups:
uncertainty_method:
contradiction_handling:
stop_or_extension_rules:
exploratory_boundary:
~~~

Trace raw observation → transformation → finding → decision claim. Mark post-hoc cuts and new hypotheses as exploratory.

## Close the routed assignment

The **prospective Research Protocol** includes:

1. decision contract;
2. inference map;
3. method and source architecture;
4. sampling plan;
5. instruments and change log;
6. fieldwork and ethical controls;
7. analysis plan;
8. schedule, owners, handoffs, and reporting format;
9. limitations known before collection.

Reject it as **not_ready** when any material claim lacks a compatible method, any population claim lacks a defensible frame, or a third party cannot reproduce the material choices. Otherwise issue **protocol_ready**.

The **fieldwork audit** additionally includes the achieved-sample audit, deviation log, affected-case list, amendment effective date, and the exact continue/pause/terminate decision. The **retrospective audit** includes the as-executed record, claim-fitness table, confirmatory/exploratory split, limitations, and prospective repair plan. Never relabel a retrospective reconstruction as a preregistered protocol.

| Fieldwork-audit status | Controlling condition |
| --- | --- |
| `continue_fieldwork` | Current consent/integrity controls hold; deviations do not threaten material inferences, or a prospective amendment cleanly isolates future cases |
| `pause_for_repair` | A material but plausibly recoverable deviation affects sample, instrument, operations, or analysis; affected cases and repair are not yet bounded |
| `terminate_invalid` | Ethical/data-integrity failure or irrecoverable design damage makes the material claim unsafe or unsupported; terminate the affected collection/claim, not necessarily unrelated work |

| Retrospective-audit status | Controlling condition |
| --- | --- |
| `decision_usable_with_limits` | As-executed design supports the material decision claims and every unplanned/deviating element is bounded visibly |
| `exploratory_only` | Records are valid for pattern/hypothesis generation but selection, measurement, or post-hoc analysis prevents the intended confirmatory/population claim |
| `invalid_for_claim` | Missing lineage, incompatible design, irrecoverable integrity failure, or material unbounded deviation cannot support the named claim at all |

Foundations: [ISO 20252](https://www.iso.org/standard/88881.html) and [ICC/ESOMAR International Code](https://standards.esomar.org/assets/documents/icc-esomar-code-2025.pdf).
