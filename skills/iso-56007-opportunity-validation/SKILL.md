---
name: iso-56007-opportunity-validation
description: Manages front-end innovation from opportunity identification through plural concept creation, concept validation, and a development go/no-go decision using ISO 56007 guidance. Use when a raw idea must be reframed around value, compared with alternative concepts, or governed before product development.
metadata:
  author: labdotsa
  category: product
---

# ISO 56007 Opportunity Validation

Manage the front end of innovation:

~~~text
prepare → identify opportunities → create concepts → validate concepts → development decision
~~~

Keep **opportunity** and **concept** separate. The opportunity describes potential value in context; a concept is one possible way to realize it.

## Prepare the front end

Record:

| Element | Required decision |
| --- | --- |
| Innovation intent | Why the organization is searching and what value matters |
| Strategic boundary | Arenas, capabilities, principles, and exclusions |
| Decision authority | Sponsor, process owner, evaluators, and veto holders |
| Participation | Customers, users, partners, specialists, and affected parties |
| Resources | Time, evidence budget, access, tools, and expertise |
| Evaluation cadence | Review dates and allowed outcomes |

If sponsorship, value intent, or decision rights are absent, issue **front_end_not_prepared**. Do not compensate by polishing the idea.

## Identify an opportunity from signals

Capture signals from needs, problems, trends, anomalies, capabilities, technology, regulation, resources, and stakeholder aspirations. Keep the source and uncertainty of each signal.

Convert signals into this opportunity frame:

~~~yaml
beneficiary:
context_and_circumstances:
desired_progress_or_value:
current_barrier_or_unmet_need:
consequence_of_current_state:
value_if_improved:
strategic_relevance:
time_window:
evidence:
opposing_evidence:
~~~

Test the frame:

- It remains meaningful without naming the proposed product.
- Beneficiary, payer, approver, and affected parties are not silently merged.
- The value is plausible for both beneficiary and organization.
- The boundary is narrow enough to investigate and broad enough for multiple concepts.

**Gate O:** advance only when the opportunity is explicit, scoped, evidence-linked, and strategically relevant. Otherwise revise or stop the opportunity.

## Create genuinely different concepts

Generate a set that includes the current state and alternatives using different value mechanisms, such as process change, service, partnership, policy, manual support, acquisition, or technology.

For each concept, create a concept card:

| Field | Required content |
| --- | --- |
| Concept | One-sentence mechanism |
| Beneficiary/value | Value created and for whom |
| Required behavior | Adoption or organizational change |
| Enablers | Capabilities, data, partners, assets |
| Constraints | Legal, ethical, safety, operational, financial |
| Novelty | What differs from current practice |
| Reversibility | Cost and consequence of backing out |
| Fatal assumptions | Beliefs that could end this concept |

Concepts that differ only in feature surface count as one concept family.

**Gate C:** advance only when business as usual and at least two credible non-status-quo concept families can be compared against the same opportunity criteria. If only the favored concept exists, return to concept creation; if no second mechanism remains credible after exploration, record why before narrowing.

## Define the validation burden

Create an assumption-to-evidence plan for each surviving concept:

| Assumption | Category | Fatal? | Current evidence | Test | Metric | Threshold | Owner/date | Failure action |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |

Cover value, usability, feasibility, viability, adaptability, ethics, law, safety, data, organizational readiness, and stakeholder impact where material.

Order tests by:

~~~text
fatality × uncertainty × cost of learning late
~~~

Use the cheapest credible evidence first, but require stronger evidence as the development commitment grows. Define thresholds and failure actions before observing results.

## Evaluate concepts, not enthusiasm

At each review:

1. update the evidence and assumption states;
2. compare concepts against the same criteria;
3. retain contrary and stakeholder-impact evidence;
4. reassess strategic fit and timing;
5. decide **advance**, **revise**, **hold**, **combine**, or **stop**;
6. record who decided, on what evidence, and what becomes authorized.

A validation result authorizes only the next commitment level. Evidence for the opportunity does not automatically validate a concept; evidence for one concept does not invalidate the opportunity.

## Issue the Opportunity Evaluation Charter

Deliver:

1. front-end operating frame;
2. signal and opportunity record;
3. opportunity statement and value logic;
4. interested-party map;
5. concept portfolio and comparison;
6. validation backlog with thresholds;
7. review history and current decision.

Close through this decision table:

| Decision | Required state | Authorization |
| --- | --- | --- |
| `advance_to_development` | Opportunity and Gate C pass; selected concept has resolved every fatal assumption with evidence at the required commitment level | Defined development commitment only |
| `advance_conditionally` | No fatal assumption is merely planned; remaining conditions are bounded, owned, dated, and enforceable before exposure | Development limited by those conditions |
| `hold_for_evidence` | Opportunity remains plausible but any fatal assumption is unresolved or only has a future test | Validation work only |
| `revise_and_revalidate` | Mechanism, beneficiary, scope, or value logic must change and could plausibly recover | Revised concept/opportunity validation only |
| `stop_concept` | Selected concept fails a fatal requirement but another concept or the opportunity survives | Work on surviving alternatives only |
| `stop_opportunity` | The opportunity/value premise fails or no credible concept remains | No further commitment under this charter |

The decision record names evidence, authority, commitment ceiling, conditions, and reopen trigger. A planned test never counts as resolved evidence.

Foundation: [ISO 56007:2023](https://www.iso.org/standard/75068.html).
