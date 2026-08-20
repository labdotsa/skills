---
name: product-diagnosis
description: Diagnoses why an existing digital or service product is not achieving a desired user or business outcome, using supplied evidence, observable product behavior, analytics, research, operational constraints, and competing causal hypotheses. Use when a client asks to improve conversion, activation, engagement, retention, adoption, usability, or another outcome and the cause or appropriate intervention is not yet established.
metadata:
  author: labdotsa
  category: product
---

# Product Diagnosis

Explain the gap between an existing product's current and desired outcomes well enough to choose the next investigation or intervention. Distinguish symptoms, causes, constraints, and solution ideas rather than treating the client's initial diagnosis as established fact.

## Establish the diagnostic frame

Collect the available product and outcome context:

~~~yaml
product_name:
product_url:
product_type:
platforms:
target_users:
client_stated_problem:
desired_outcome:
current_metric_and_baseline:
target_and_horizon:
business_consequence:
submitted_analytics:
submitted_research:
submitted_product_materials:
known_technology:
operational_constraints:
previous_attempts:
output_path: product-diagnosis.md
~~~

Proceed with incomplete inputs when there is a real product and a decision-relevant outcome to investigate. Preserve missing baseline, target, horizon, audience, or measurement definitions as explicit gaps; never invent them.

Rewrite the desired outcome when evidence permits:

~~~text
For [target user and context], increase or decrease [observable behavior or outcome]
from [baseline] to [target] by [horizon], because [business or user consequence].
~~~

Use `goal_requires_definition` when the request cannot yet be expressed as an observable outcome. A request to redesign, modernize, add features, or “improve engagement” is a proposed activity or direction, not a diagnostic goal.

## Set boundaries and permissions

Define which product, audience, journey, channel, geography, period, and decision are in scope. Establish which evidence may be inspected and whether it contains confidential, personal, production, or regulated data. Use the minimum access necessary, avoid exposing supplied confidential material through external searches, and aggregate or redact personal data in the deliverable.

Treat public interface inspection as observation of the interface available in the tested context. It does not establish internal performance, user motivation, accessibility conformance, technical quality, or causal impact by itself. Do not create accounts, submit forms, transact, contact users, run intrusive tests, or mutate a live product without explicit authorization.

## Build the current-state evidence map

Inventory evidence by its fitness for the question:

| Evidence | Can help establish | Cannot establish alone |
| --- | --- | --- |
| Product analytics | where and for whom behavior changes | why users behave that way |
| Interviews or support records | mechanisms, language, and experienced consequences | prevalence across the population |
| Usability observation | interaction breakdowns in tested tasks | business impact at scale |
| Experiments | causal effect within the tested design and population | general truth outside the test boundary |
| Operational data | delivery constraints, failures, and service consequences | user intent without linked evidence |
| Public product inspection | observable journeys, messages, states, and friction candidates | actual funnel performance or principal cause |
| Market or competitor evidence | alternative expectations and switching context | the product's internal performance |

For every material evidence source, record origin, period, population, definition, method, access boundary, and limitation. Normalize metric definitions before comparing numbers. Separate user-reported, observed, measured, and inferred statements.

Map the relevant journey as evidence allows:

~~~text
entry → expectation → first action → value realization → repeated use → outcome
~~~

At each material stage, record the intended behavior, observed signal, affected segment, consequence, and evidence gap. Include service, staff, policy, channel, and offline steps when they shape the product outcome.

## Separate symptom from diagnosis

Translate the client's account into atomic statements and classify each:

~~~text
fact | measurement | observation | client_report | inference
hypothesis | assumption | proposed_solution | decision
~~~

Use a diagnostic chain:

| Layer | Question |
| --- | --- |
| Outcome gap | What differs from the defined target? |
| Behavioral location | Where, when, and for whom does the gap appear? |
| Mechanism | What behavior or system interaction could produce it? |
| Enabling condition | What product, service, technical, policy, or market condition sustains it? |
| Intervention point | Which change could affect the mechanism? |

Do not promote a visible issue directly to root cause. A long form, confusing message, missing feature, slow screen, or competitor difference is a candidate contributor until evidence connects it to the outcome.

## Compare causal hypotheses

Create multiple plausible explanations spanning relevant classes:

- audience or acquisition mismatch;
- expectation or positioning mismatch;
- motivation, value, trust, comprehension, or usability;
- product reliability, performance, accessibility, or integration;
- pricing, policy, eligibility, compliance, or operational constraint;
- measurement, instrumentation, selection, or data-quality error;
- seasonality, market change, or another external factor.

For each hypothesis, complete:

| Field | Required content |
| --- | --- |
| Hypothesis | Specific mechanism and bounded population/context |
| Explains | Observations the mechanism accounts for |
| Struggles to explain | Contrary or missing observations |
| Supporting evidence | Direct records and their limitations |
| Rival explanation | A plausible alternative with a different mechanism |
| Discriminating evidence | Observation or test that separates the explanations |
| Confidence | `high`, `medium`, `low`, or `indeterminate` with rationale |
| Consequence if true | Decision or intervention that would change |

Seek disconfirming evidence before ranking a hypothesis. Shared-source repetition does not count as independent corroboration. Keep material contradictions visible instead of averaging them away.

## Choose the next evidence or intervention

Match the next action to the uncertainty:

| Diagnostic state | Appropriate next move |
| --- | --- |
| Goal or metric undefined | outcome and measurement alignment |
| Location of the gap unknown | instrumentation, funnel, cohort, or journey analysis |
| Behavior visible but mechanism unclear | targeted interviews, observation, or support synthesis |
| Competing causes remain plausible | discriminating analysis, usability test, or experiment |
| Cause supported but response uncertain | prototype or intervention experiment |
| Intervention effect supported | scoped implementation and monitoring |
| Technical or operational constraint dominates | specialist assessment or operating-process change |

Prioritize by decision value, not by how easy an issue is to notice. For every recommendation, name the controlling hypothesis, expected outcome, required evidence or implementation, guardrail metric, risk, and stop condition.

Do not produce a feature roadmap from weak diagnosis. Label quick fixes separately from causal interventions; a usability defect may deserve correction even when it does not explain the headline metric.

## Deliver `product-diagnosis.md`

Adapt detail to the decision while preserving this minimum structure:

~~~markdown
# Product Diagnosis: [Product]

## Diagnostic status
- Product and scope:
- Decision:
- Evidence cutoff:
- Overall confidence:
- Controlling uncertainty:

## Executive finding

## Desired outcome
### Baseline, target, horizon, and audience
### Metric definition and business consequence

## Current-state evidence
### Product and journey
### Behavioral and operational signals
### Evidence coverage and limitations

## Client account
### Reported problem
### Previous attempts and proposed solutions

## Diagnostic model
### Outcome gap and behavioral location
### Competing causal hypotheses
### Contradictions and alternative explanations

## Recommended next move
### Evidence or intervention plan
### Success and guardrail measures
### Risks and stop conditions

## Claim and evidence ledger
| ID | Statement | Class | Source | Period/population | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- | --- |

## Sources
~~~

Keep the executive finding proportional to the evidence. State what is happening, the best-supported explanation, which rival remains credible, and what action would most reduce decision risk.

End with one status:

| Status | Controlling condition |
| --- | --- |
| `goal_requires_definition` | The desired outcome, population, metric, baseline, target, or horizon is too unclear to diagnose |
| `evidence_insufficient` | Available evidence cannot locate or characterize the outcome gap |
| `product_diagnosis_required` | A material gap exists, but causes remain insufficiently distinguished |
| `diagnosis_conditional` | One explanation leads, but a named rival or evidence gap could change the decision |
| `intervention_ready` | Evidence supports a bounded mechanism and a proportionate next intervention or test |
| `specialist_review_required` | A material legal, safety, security, accessibility, financial, clinical, or technical issue requires qualified review |

State which evidence controls the status and the next accountable action. Never describe a conditional finding as a proven root cause.
