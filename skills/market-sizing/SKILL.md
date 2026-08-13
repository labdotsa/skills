---
name: market-sizing
description: Builds reproducible TAM, SAM, and reachable-market models from explicit market equations, bottom-up counts, top-down cross-checks, operating constraints, and reconciliation. Use when estimating accounts, users, demand, spend, or revenue opportunity under uncertainty.
metadata:
  author: labdotsa
  category: product
---

# Market Sizing

Treat every market number as an equation with units. A market is not “large”; it is a defined population multiplied through a defined demand and value model for a defined period.

## Fix the estimand

Create the boundary card:

| Dimension | Required definition |
| --- | --- |
| Decision | What the size will approve, reject, prioritize, or constrain |
| Customer/use case | Who has what qualifying need |
| Counting unit | account, site, user, asset, event, transaction, or spend |
| Geography/segment | Included and excluded populations |
| Period | Snapshot or annual flow; base year |
| Value basis | price, spend, economic value, or volume |
| Currency/tax | Currency, exchange-date convention, tax inclusion |
| Market layer | TAM, SAM, reachable market, or forecast |

Write one dimensional equation:

~~~text
annual market value
= eligible units
× qualifying events per unit per year
× value per event
~~~

Adapt the factors, but show units cancelling through the equation. If the decision owner cannot approve the boundary, return **market_definition_unresolved**.

## Build the bottom-up model

Create a driver table; one row per input:

| Driver | Value/range | Unit | Source/date | Transformation | Assumption class | Confidence |
| --- | ---: | --- | --- | --- | --- | --- |

Count from observable units such as establishments, licenses, installed assets, procedures, transactions, or named accounts.

1. Start from the smallest defensible countable population.
2. Remove duplicates, inactive records, and units outside the boundary.
3. Split segments whenever eligibility, usage, or value differs materially.
4. Apply frequency and value drivers at the matching segment level.
5. retain unrounded calculations; round presentation only.

**Bottom-up check:** another analyst can reconstruct every multiplier and filter without guessing.

## Build an independent top-down cross-check

Start from an authoritative aggregate that is broader than the target. Apply filters sequentially:

| Filter order | Starting population | Filter definition | Rate/range | Remaining units | Evidence |
| ---: | ---: | --- | ---: | ---: | --- |

Use a published market estimate only after rebuilding its scope, unit, period, price basis, and lineage. A publisher’s TAM is an input, not an answer.

**Top-down check:** each filter corresponds to a stated inclusion rule and no filter repeats a reduction already applied elsewhere.

## Separate TAM, SAM, and reachable capacity

Calculate each layer through a different constraint set:

~~~text
TAM = all units with the defined need under the stated value basis

SAM = TAM constrained by the actual offer:
      product scope, regulation, language, data, integration,
      channel, geography, service capability

reachable units per period
= min(serviceable SAM units available in the period,
      qualified leads per period × conversion,
      sales throughput per period,
      implementation throughput per period)
  × retained share at the horizon

reachable market value
= reachable units per period × value per unit in the same period
~~~

Normalize every term inside `min(...)` to the same unit and period before comparing it. Reachable units can never exceed serviceable SAM units.

For multi-sided models, size each side and model the limiting side. For new categories, show demand volume separately from monetizable revenue.

## Reconcile instead of averaging

Create a reconciliation worksheet:

| Driver or boundary | Bottom-up treatment | Top-down treatment | Variance | Cause | Resolution |
| --- | --- | --- | ---: | --- | --- |

Classify every material variance as:

~~~text
boundary | coverage | duplication | period | definition
price | usage | informal activity | transformation | source quality
~~~

Set materiality relative to the decision before reconciling. Resolve, bound, or leave each variance explicitly blocking. Use a range when the methods remain valid but irreducibly uncertain.

## Stress the decision drivers

Produce:

- bear, base, and bull cases with internally coherent assumptions;
- one-way sensitivity for each material driver;
- a break-even or threshold solve for the decision-critical variable;
- a short statement identifying which two or three drivers explain most of the range.

Avoid assigning identical percentage changes to unrelated drivers. Scenarios describe plausible joint states; sensitivities isolate one driver.

## Run model checks

| Check | Passing condition |
| --- | --- |
| Units | Every equation resolves to the declared output unit |
| Boundary | Included and excluded populations are mutually consistent |
| Duplication | No account, site, transaction, or value is counted twice |
| Time | Stock and flow measures are not mixed |
| Value | Price, spend, and economic value are not silently substituted |
| Reconciliation | Every material method variance is resolved or bounded |
| Reachability | SOM/reachable case derives from access and capacity, not an arbitrary TAM share |
| Traceability | Every driver is sourced or labeled as an assumption |

## Deliver the Market Sizing Model

Include the boundary card, equations, driver table, bottom-up build, top-down filter chain, TAM/SAM/reachable layers, reconciliation worksheet, scenarios, sensitivities, confidence range, and blocking unknowns.

Close through the controlling model state:

| Status | Required state | Permitted use |
| --- | --- | --- |
| `decision_usable` | All material checks pass; remaining ranges do not cross the decision threshold; reachability derives from evidenced access/capacity | Use for the stated decision and boundary |
| `bounded_range_only` | Checks pass, but one or more bounded drivers or reconciled variances cross the decision threshold | Compare scenarios or set research/operating hurdles; do not publish one point forecast |
| `insufficient_evidence` | A material unit/boundary/duplication/time/value check fails, a variance is unbounded, or a decision-critical driver lacks even a defensible range | Repair definitions or evidence before using the number |

Precision in formatting never upgrades weak inputs.
