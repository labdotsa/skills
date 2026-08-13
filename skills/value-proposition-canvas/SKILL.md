---
name: value-proposition-canvas
description: Builds and updates Strategyzer's Customer Profile, Value Map, and fit evidence for one customer in one circumstance. Use when jobs, pains, gains, and proposed value mechanisms need explicit fit and a validation backlog.
metadata:
  author: labdotsa
  category: product
---

# Value Proposition Canvas

Fit is correspondence between an observed customer profile and a designed value map. Build the customer side from evidence before making the offer look attractive.

## Freeze one customer context

Record:

~~~yaml
customer_segment:
user_role:
buyer_payer_approver:
circumstance_or_trigger:
job_context:
geography_channel_period:
evidence_cutoff:
~~~

Create separate canvases when roles, circumstances, buying paths, or economics differ. A composite “customer” produces false fit.

## Build the Customer Profile

Use episodes, observation, behavior, and operational evidence. Label unsupported items **hypothesis**.

### Customer jobs

Capture what the customer is trying to accomplish:

| Job | Functional / emotional / social | Circumstance | Importance evidence | Current hire |
| --- | --- | --- | --- | --- |

Separate core progress from enabling tasks, buying jobs, and consumption jobs.

### Pains

Capture undesirable outcomes, obstacles, and risks before, during, and after the job:

| Pain | Trigger/cause | Consequence | Severity evidence | Frequency | Current mitigation |
| --- | --- | --- | --- | --- | --- |

### Gains

Capture required, expected, desired, and surprising outcomes:

| Gain | Outcome direction | Importance evidence | Current satisfaction | Threshold if known |
| --- | --- | --- | --- | --- |

Rank jobs, pains, and gains by customer evidence—not team preference. Preserve contradictions and low-confidence items.

**Profile complete when:** every high-ranked item traces to a customer episode or is explicitly marked as a hypothesis.

## Design the Value Map independently

List only elements the option will actually provide.

### Products and services

| Element | Role in completing the job | Delivery boundary |
| --- | --- | --- |

### Pain relievers

| Reliever | Pain ID addressed | Mechanism | Expected magnitude | Proof needed |
| --- | --- | --- | --- | --- |

### Gain creators

| Creator | Gain ID addressed | Mechanism | Expected outcome | Proof needed |
| --- | --- | --- | --- | --- |

Rank by expected customer value and strategic focus. A value map is allowed to ignore low-priority pains and gains; it should not claim to address everything.

## Trace fit item by item

Build the fit map:

| Customer item | Value-map response | Mechanism | Evidence state | Gap/tradeoff |
| --- | --- | --- | --- | --- |

Use:

~~~text
evidenced fit
= customer item is evidenced
+ response exists
+ mechanism is plausible
+ customer behavior supports the value
~~~

Classify each link:

- **unaddressed:** important customer item has no response;
- **claimed:** response exists, customer item or mechanism untested;
- **problem-solution fit evidence:** customer behavior supports the problem and proposed mechanism;
- **market fit evidence:** repeated purchase/use/retention supports the offer in market;
- **overreach:** value claim exceeds product or evidence.

Surface orphan offer elements that consume cost or complexity without addressing a ranked customer item.

## Stress the proposition

Create a stress register:

| Check | Finding/evidence | Fit link affected | Severity | Action |
| --- | --- | --- | --- | --- |
| Priority | Does the option focus on the highest-value customer items? | | | `retain / revise / test / exclude` |
| Differentiation | Does it improve a tradeoff relative to current hires? | | | |
| Credibility | What proof, trust, or risk reversal is required? | | | |
| Adoption | What new effort, anxiety, or habit does the offer create? | | | |
| Economics | Is value meaningful to the payer and viable to deliver? | | | |
| Exclusion | Which customer or circumstance should this not serve? | | | |

Turn every critical claimed link into a test with metric, threshold, and failure action.

Route each test to the method capable of observing it. After a result, attach evidence to the exact fit link and change its state; if the test violated its protocol, repair and rerun without changing the link. A contradicted customer item revises the profile; a contradicted response/mechanism revises the Value Map; repeated purchase/use/retention can upgrade only the tested context to market-fit evidence.

## Deliver the Value Proposition Canvas

Deliver the frozen context, ranked Customer Profile, ranked Value Map, item-level fit map, orphan/gap analysis, tradeoffs, evidence states, Stress Register, and thresholded Validation Backlog with metric, pass/fail line, recovery, and target method.

| Status | Weakest controlling link | Permitted handoff |
| --- | --- | --- |
| `market_fit_evidenced` | Critical links have problem-solution evidence plus repeated purchase/use/retention in the frozen context | optimize/scale only within the evidenced boundary; monitor retention |
| `problem_solution_fit_evidenced` | Critical customer items and value mechanisms have behavioral support, but repeated market behavior is not established | test purchase, use, and retention |
| `fit_hypothesis` | Customer profile is credible, but one or more critical response/mechanism links remain claimed | execute the Validation Backlog before a fit claim |
| `customer_profile_only` | Customer items are supportable but the Value Map or its links are not | design/revise the Value Map, then test links |
| `revise_value_map` | A critical response/mechanism is contradicted while the customer item survives | change response/mechanism and retest; preserve the profile |
| `no_fit` | A critical customer item is absent/contradicted or no credible response survives | stop this proposition/context or return to discovery |

The verdict applies only to the frozen customer context and names the weakest critical link.

Foundation: [Strategyzer Value Proposition Canvas](https://www.strategyzer.com/library/the-value-proposition-canvas).
