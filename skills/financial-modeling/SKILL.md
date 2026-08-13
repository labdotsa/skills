---
name: financial-modeling
description: Builds auditable driver-based financial models with causal schedules, integrated statements or cash views, scenarios, sensitivities, and explicit controls. Use when the required output is a whole-business or project forecast, budget, cash/runway, funding, break-even, return, or valuation model.
metadata:
  author: labdotsa
  category: product
---

# Financial Modeling

Build a transparent executable argument. Inputs flow through operational schedules into financial outputs; checks prove the model still works when assumptions change.

## Write the model specification

Before formulas, define:

| Item | Required decision |
| --- | --- |
| Decision/use | What the model must answer |
| Entity/options | Business, project, product, or compared alternatives |
| History/forecast | Actual periods, forecast horizon, granularity |
| Currency/prices | FX, inflation, nominal/real, tax |
| Accounting/cash boundary | Statements required and recognition rules |
| Scenarios | Base and decision-relevant alternatives |
| Materiality | Error/variance that changes the decision |
| Owners | Input, model, review, and approval responsibility |

List outputs first. Every modeled schedule must feed a required output.

## Lay out the model

Use this dependency order when applicable:

~~~text
control and scenario selector
→ assumptions and source register
→ timeline
→ operating schedules
→ revenue
→ direct costs
→ headcount and operating expenses
→ capex/depreciation
→ working capital
→ tax
→ financing/debt/equity
→ income statement
→ cash flow
→ balance sheet
→ decision outputs and checks
~~~

For a decision model that does not require full statements, retain only necessary schedules but preserve the same input → calculation → output separation.

## Build causal schedules

Create each schedule from physical or behavioral drivers:

| Schedule | Driver examples | Control total |
| --- | --- | --- |
| Revenue | eligible units, acquisition, activation, usage, price, churn | customer/volume bridge |
| Direct cost | volume, unit consumption, supplier price, loss/failure | cost-per-unit bridge |
| Headcount | role, start date, capacity ratio, salary, on-cost | headcount and payroll total |
| Capex | asset, timing, life, replacement | fixed-asset roll-forward |
| Working capital | billing, collection, inventory, supplier payment | receivable/inventory/payable roll-forward |
| Financing | draw, repayment, interest, fees, covenant | debt/equity balance |

Keep assumption cells separate from formulas. Use simple formulas, consistent time flow, visible units, and one source of truth per driver. Explain circularity and iteration if financing or tax requires it.

## Integrate the statements or cash bridge

For a three-statement model:

1. link revenue and expenses into the income statement;
2. roll non-cash items, capex, and working capital into cash flow;
3. roll assets, liabilities, debt, equity, and retained earnings into the balance sheet;
4. link closing cash back to the balance sheet;
5. verify the balance sheet in every period and scenario.

For a project/product cash model, build:

~~~text
opening cash
+ operating receipts
− operating payments
− capex and implementation
+ financing
− financing payments
= closing cash
~~~

Separate profitability, cash, and funding need.

## Install controls as the model is built

Create a checks panel:

| Check | Pass condition |
| --- | --- |
| Balance sheet | assets − liabilities − equity = 0 |
| Cash | cash-flow closing cash = balance-sheet cash |
| Roll-forwards | opening + additions − reductions = closing |
| Sources/uses | sources = uses |
| Signs | costs, cash outflows, and balances follow declared convention |
| Units | currency, volume, rate, and time units agree |
| Scenario | selector changes inputs, never overwrites formulas |
| No orphan inputs | each input is used or intentionally informational |
| No hard-coded formula values | material constants live in assumptions |
| Historical fit | model reproduces supplied actuals within materiality |

Show one overall error flag and the individual failures.

## Make uncertainty structural

Use:

- **scenario:** coherent joint state with its own driver set;
- **sensitivity:** isolated change to one or two drivers;
- **break-even:** solve the driver value at which the decision changes;
- **simulation:** use only when distributions, correlations, and decision need justify it.

Avoid “base ±10%” when risks have different ranges or correlations. Connect downside cases to actual operating risks and treatments.

## Interpret, challenge, and hand off

Produce the decision outputs required by the specification: cash trough, runway, funding need, break-even, margin, return, NPV/IRR where fit, covenant headroom, or option comparison.

For each conclusion, identify:

| Conclusion | Dominant drivers | Evidence quality | Downside trigger | Management action |
| --- | --- | --- | --- | --- |

Run a reviewer pass using a fresh scenario and one deliberate input shock. Before changing the input, record the schedules that should change, expected output direction and any calculable magnitude, and dependencies that should remain unchanged. Apply the shock, compare expected versus observed behavior, investigate unintended changes, restore the input, and rerun every control. Traceability alone is not proof of correct wiring.

## Deliver the financial package

Deliver the model specification, source/assumption register, causal schedules, statements or cash bridge, scenario/sensitivity outputs, checks panel, decision dashboard, limitations, and change log.

| Status | Controlling condition |
| --- | --- |
| `model_audited_for_decision` | All material controls pass; comparable actuals fit within materiality when they exist; reviewer shock behaves as expected; greenfield physical/contract/source controls reconcile; inputs support the stated decision and scenario range |
| `model_directional_only` | Model mechanics and controls pass, but bounded input uncertainty crosses the decision threshold or limits precision |
| `model_check_failed` | Any material control, actual-fit, or reviewer-shock expectation fails after retest |
| `inputs_insufficient` | A decision-critical driver has no defensible value/range, provenance, owner, or compatible definition, so even directional output is unsupported |

For a greenfield project with no comparable history, mark historical fit `not_applicable` with reason and validate opening balances, physical quantities, quotations/contracts, cross-schedule reconciliations, independent benchmarks, and reviewer shocks instead. Never invent actuals to satisfy a control.

Foundation: [FAST Standard](https://www.fast-standard.org/)—Flexible, Appropriate, Structured, and Transparent.
