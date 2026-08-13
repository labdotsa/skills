---
name: pricing-research
description: Selects and executes fit-for-purpose pricing research for price level, metric, packaging, structure, willingness, or elasticity. Use when price level, metric, packaging, structure, or demand response is decision-blocking.
metadata:
  author: labdotsa
  category: product
---

# Pricing Research

Name the pricing decision before selecting a method. Different methods answer different questions; “willingness to pay” is not one measurement.

## Specify the pricing question

Choose one primary branch:

| Decision | Required output |
| --- | --- |
| Price metric | What unit of value or usage should be charged |
| Price level | Candidate price or range |
| Packaging | Which benefits/capabilities belong together |
| Structure | subscription, usage, transaction, outcome, license, service, hybrid |
| Fences/discounts | Who receives different terms and why |
| Elasticity | How choice/volume changes with price |
| Procurement fit | Budget, authority, contract, approval, payment timing |

Freeze segment, payer, offer, alternatives, geography, currency, tax, contract term, and decision threshold. Price research on a vague offer measures imagination.

## Build the economic frame first

Create:

| Frame element | Evidence |
| --- | --- |
| Current alternative and spend | invoices, contracts, time, risk, internal cost |
| Value created | revenue, savings, risk reduction, time, strategic option |
| Value distribution | beneficiary, buyer, payer, partner |
| Competitive references | comparable offers and total switching cost |
| Cost floor | variable/service/partner cost and required contribution |
| Constraints | budget cycle, approval limits, regulation, fairness, channel |

Estimate value as a range. Separate economic value, perceived value, budget, competitive reference, and viable price floor.

## Route to the method that answers the question

Choose from the decision topology; combine branches only in a declared sequence:

| Primary decision | First valid route | Escalate when |
| --- | --- | --- |
| Metric, buying process, reference/value language | behavioral/value interview | candidate metrics or price objects must be compared |
| Perceived acceptable range in a familiar category | Van Westendorp | a demand or revenue decision requires behavioral calibration |
| Stated response to price alone | Gabor-Granger or randomized monadic test | the curve/index must be calibrated to real behavior |
| Package and attribute tradeoffs | conjoint/discrete choice | real adoption or renewal matters |
| Consequential willingness, discounting, procurement | real offer | repeat/retention or counterfactual price response matters |
| Realized price, discount, conversion, churn | win/loss or transaction analysis | unoffered prices or causal price effect matter |
| Structure or fences | economic frame + interviews, then choice/real-offer branch | economics or behavior contradict the architecture |

Prerequisites control the route: an undefined offer returns to offer definition; no buyer/payer evidence routes to behavioral interviews; no credible price span blocks Van Westendorp/Gabor-Granger; no attribute evidence blocks conjoint; inability to fulfill truthfully blocks real offers.

| Method | Use it for | Required design | It cannot establish alone |
| --- | --- | --- | --- |
| Behavioral/value interview | language, reference points, buying process, value metric | recent purchase/budget episodes and artifacts | a market demand curve |
| Van Westendorp PSM | perceived acceptable/expensive range in a familiar category | four price-perception questions; category understanding | optimal revenue or actual purchase |
| Gabor-Granger | stated purchase probability across price levels | randomized starting point/order; defined offer | revealed behavior |
| Conjoint/discrete choice | tradeoffs among price, package, and attributes | experimental design, realistic alternatives, sample fit | actual adoption without calibration |
| Monadic price test | compare response to one price per respondent/cohort | randomized comparable exposure | long-run retention |
| Real offer/preorder/pilot | consequential willingness and negotiation | actual price, terms, denominator, fulfillment ethics | population elasticity from a tiny sample |
| Win/loss or transaction data | realized price, discount, conversion, churn | clean cohorts and selection controls | counterfactual prices never offered |

Use more than one method only when their roles are explicit—for example, interviews to define attributes, conjoint to estimate tradeoffs, and real offers to calibrate behavior.

## Design before collecting

Pre-register:

~~~yaml
decision_and_owner:
population_and_sample:
offer_and_package:
price_points_and_assignment:
currency_tax_contract:
primary_response:
analysis_model:
subgroups:
exclusions:
pass_or_choice_rule:
behavioral_follow_up:
validity_checks_and_tolerances:
~~~

Use price points that span credible refusal and acceptance. Avoid changing price together with service, contract, or channel unless the design intentionally estimates that bundle.

For B2B work, recruit buyer, payer, procurement, and user where roles differ. Capture approval thresholds, budget source, purchasing process, negotiation, implementation effort, and contract risk.

## Execute the selected branch

### Behavioral or value interview

Reconstruct a recent purchase, budget, renewal, rejection, or workaround. Record buyer/payer roles, current spend, value event, reference price, approval threshold, total switching cost, negotiation, and supporting artifacts. Output candidate value metrics, price objects, and buying constraints—not a demand curve.

### Van Westendorp

Ask when price becomes:

1. so cheap quality becomes doubtful;
2. a bargain;
3. expensive but still worth considering;
4. too expensive to consider.

Plot cumulative curves and report intersections as perception diagnostics. Keep demand/revenue claims outside the result.

### Gabor-Granger

Expose a defined offer at randomized or counterbalanced price points. Estimate stated purchase probability and a stated-demand revenue index:

~~~text
stated-demand revenue index at price p
= p × stated purchase probability at p
~~~

Report uncertainty and order/start effects.

### Conjoint or discrete choice

Define attributes and levels from customer evidence. Build realistic choice sets including current option or no-choice. Estimate utilities, attribute importance, price sensitivity, and scenario shares; test holdout prediction and design balance.

### Randomized monadic price test

Randomly assign one price to each comparable respondent or traffic cohort while holding offer, channel, contract, and timing fixed. Record assignment integrity, exposure, comprehension, primary response, and covariate balance. Estimate between-price differences with uncertainty; do not pool cohorts when instrumentation or source changed.

### Real offer

Track eligible exposures → offer viewed → negotiation/checkout → signed/paid → implemented → repeated/renewed. Preserve discounts, conditions, refunds, and failed sales in the denominator.

### Win/loss or transaction analysis

Create clean cohorts by offer, segment, channel, period, seller, discount authority, and outcome. Separate quoted, contracted, collected, renewed, and churned price. Model selection and discount endogeneity; use matching, fixed effects, experiments, or other defensible controls where feasible. Treat unoffered price points as counterfactual unknowns.

## Apply branch validity gates

| Branch defect | Result and recovery |
| --- | --- |
| Interview lacks a recent decision/budget episode | exploratory language only; recruit an eligible case |
| Van Westendorp category/offer misunderstood | invalidate the range; repair comprehension and rerun |
| Gabor-Granger order effects or non-monotonic response exceed predeclared tolerance | inspect design/data, narrow inference, or rerun; never smooth silently |
| Monadic assignment/balance fails or cohorts differ materially | invalidate causal comparison; repair randomization/cohort design |
| Conjoint design balance or holdout prediction fails | revise attributes/design/model and collect a new validation sample |
| Real-offer cohort is contaminated by unequal terms, fulfillment, or selection | separate cohorts or invalidate comparison; preserve every exposure |
| Transaction model lacks overlap or credible selection control | report association only; do not infer elasticity |

No stated branch alone can issue `price_decision_supported` for consequential willingness unless behavior is unnecessary to the stated decision and that boundary is explicit.

## Reconcile evidence

Create:

| Price/structure hypothesis | Economic value | Stated research | Revealed behavior | Unit economics | Decision |
| --- | --- | --- | --- | --- | --- |

Investigate gaps instead of averaging. Stated acceptance may exceed behavior because of politeness or low consequence; behavior may be depressed by trust, product immaturity, or channel friction.

## Deliver the Pricing Evidence Report

Deliver the pricing decision, economic frame, method rationale, instrument/design, sample and limitations, results with uncertainty, stated-versus-revealed reconciliation, unit-economic constraints, and recommended experiment or price decision.

| Status | Controlling condition | Permitted handoff |
| --- | --- | --- |
| `price_decision_supported` | Selected branch passes its validity gate, evidence matches the stated decision, economics pass, and behavioral calibration exists when consequential willingness is claimed | hand off the scoped price decision plus monitoring/invalidators |
| `directional_range_only` | Valid stated/perception evidence or bounded observational behavior narrows the choice but cannot support one price decision | hand off the range only and the calibration test; no point recommendation |
| `method_mismatch` | The branch cannot answer the named pricing question or its prerequisites fail | reroute through the topology; discard unsupported price conclusion |
| `insufficient_behavioral_evidence` | The decision requires consequential behavior but only stated, contaminated, or too-thin evidence exists | run a valid behavioral branch or hold the price decision |

State which question the study answered and which pricing questions remain open.
