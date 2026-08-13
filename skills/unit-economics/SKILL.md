---
name: unit-economics
description: Builds contribution, acquisition, retention, lifetime value, payback, capacity, and working-capital economics for one revenue-bearing unit and its cohorts. Use when testing whether an additional customer, account, order, transaction, site, or usage unit creates or destroys value.
metadata:
  author: labdotsa
  category: product
---

# Unit Economics

Choose the economic unit and contribution boundary before calculating ratios. The model must show the cash and capacity consequences of adding one more unit.

## Declare the unit contract

Complete:

~~~yaml
economic_unit:
customer_and_payer:
segment_channel_geography:
cohort_definition:
currency_and_tax:
time_period:
revenue_recognition:
cash_collection:
gross_margin_boundary:
contribution_boundary:
acquisition_boundary:
retention_event:
~~~

Examples of different units: one customer-month, order, completed transaction, occupied seat, monitored site, or active marketplace pair. Do not divide costs measured per customer by revenue measured per transaction without an explicit bridge.

## Build the per-unit contribution waterfall

Create one line per driver:

| Line | Amount/range | Basis | Variable / step-fixed / fixed | Source | Confidence |
| --- | ---: | --- | --- | --- | --- |
| Recognized revenue | | | | | |
| refunds/discounts/tax excluded | | | | | |
| cost of revenue | | | | | |
| gross profit | | | | | |
| incremental acquisition | | | | | |
| onboarding/implementation | | | | | |
| service/support/operations | | | | | |
| partner/payment/incentive | | | | | |
| contribution | | | | | |

Use:

~~~text
gross profit = recognized revenue − cost of revenue

contribution = gross profit
             − incremental acquisition
             − onboarding/service/support/operating costs
             − other costs caused by the unit
~~~

Keep unavoidable fixed corporate overhead outside unit contribution but show the volume required to cover it.

## Model acquisition by cohort and channel

Calculate:

~~~text
fully loaded acquisition cost
= sales and marketing spend
+ acquisition labor and commissions
+ tools, incentives, trials, failed implementations
divided by newly acquired units from that spend
~~~

Define attribution period and include failed acquisition attempts. Separate paid, organic, partner, founder-led, and expansion cohorts when economics differ.

## Model retention as a curve

Build a cohort table by age:

| Cohort | Acquired | Activated | M1 retained | M3 | M6 | M12 | Expansion/contraction |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |

Use the retention event declared in the unit contract. Avoid converting a short or immature window into a confident lifetime.

Calculate LTV from the explicit expected contribution stream:

~~~text
LTV = Σ [probability active at t × contribution at t] / (1 + discount rate)^t
~~~

Use simple steady-state shortcuts only when churn, margin, timing, and cohort behavior justify them; show both the shortcut and its assumptions.

## Branch by business mechanism

### Subscription/account

Model activation, recurring revenue, expansion, contraction, churn, service step-costs, and acquisition payback.

### Transaction/commerce

Model order frequency, basket, take rate or margin, refunds, payment fees, fulfillment, incentives, fraud/loss, and repeat behavior.

### Marketplace

Model both sides, match/fill rate, liquidity, subsidies, disintermediation, payment flow, and the side that constrains volume.

### Asset/location/service contract

Model installation or asset cash, utilization, maintenance/failure, field service, replacement, contract length, salvage/redeployment, and capacity.

## Put time, cash, and capacity back in

Calculate:

- simple and cohort-adjusted payback;
- working-capital need and collection/payment timing;
- break-even volume for fixed and step-fixed costs;
- implementation, inventory, support, compute, or field capacity;
- cash required to acquire and activate a cohort before its contribution returns.

A high LTV/CAC ratio can coexist with a fatal cash trough or operational bottleneck.

## Stress kill conditions

Run coherent bear/base/bull cohorts and threshold solves for price, frequency/utilization, variable cost, activation, retention, expansion, CAC, support, failure/rework, and capacity.

Create:

| Driver | Base | Break-even/kill value | Evidence range | Decision consequence |
| --- | ---: | ---: | --- | --- |

Keep segments and channels separate when blending would hide a losing cohort.

Aggregate only after assigning each material cohort one of: `include`, `separate_strategy`, `repair`, or `exclude_with_reason`. A losing strategic cohort controls the venture verdict unless it can be operationally excluded without breaking volume, channel, or fixed-cost assumptions.

## Audit the model

The model fails if:

- units or periods do not reconcile;
- contribution omits a cost caused by the unit;
- CAC excludes failed acquisition inside the boundary;
- LTV uses revenue instead of contribution/gross profit;
- retention is assumed without a visible curve or declared model;
- cash timing and capacity are absent;
- ratios cannot be rebuilt from driver lines.

When a check fails, open a defect with the affected schedule, cause, outputs invalidated, repair, owner, and retest result. Repair the formula, boundary, or source; rerun all dependent schedules, scenarios, and checks; then reissue the model version. Until every material defect closes, the only valid status is `model_invalid`.

## Deliver the Unit Economics Model

Deliver the unit contract, contribution waterfall, acquisition cohorts, retention curves, LTV, payback, working capital, capacity, fixed-cost break-even, sensitivities, and economic kill conditions.

| Status | Controlling condition |
| --- | --- |
| `unit_positive_and_scalable` | All checks pass; every required strategic cohort remains positive through the declared bear case; payback, cash, capacity, and fixed-cost coverage stay within thresholds |
| `unit_positive_cash_or_capacity_constrained` | Contribution is positive for the live cohort(s), but a declared cash, payback, capacity, maturity, or fixed-cost condition blocks scale |
| `unit_negative` | A required cohort remains negative at credible drivers or crosses a kill condition with no executable repair |
| `evidence_insufficient` | A decision-critical driver lacks a defensible range or cohorts are too immature to judge the threshold |
| `model_invalid` | Any material unit, boundary, contribution, cohort, cash, capacity, or rebuild check remains failed |
