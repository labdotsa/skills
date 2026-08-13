---
name: unido-feasibility-study
description: Prepares an integrated pre-investment feasibility study using UNIDO's market, capacity, input, location, technical, organizational, implementation, financial, economic, environmental, and social logic. Use when a defined option must be tested as an operating system before investment.
metadata:
  author: labdotsa
  category: product
---

# UNIDO Feasibility Study

Test one defined investment option as a connected system. Demand determines capacity; capacity and technology determine inputs, location, organization, schedule, cost, financing, and impact. Iterate until those interfaces agree.

## Choose the study level

| Level | Purpose | Evidence standard |
| --- | --- | --- |
| Opportunity study | Screen whether further preparation is warranted | broad ranges and fatal constraints |
| Pre-feasibility | Compare technical/economic alternatives and narrow the option | sourced estimates and preliminary designs |
| Feasibility | Support an establishment and financing decision | site-/option-specific designs, quotations, schedules, models, and conditions |

State the level, decision, sponsor, option, boundary, base date, currencies, price basis, planning horizon, and required accuracy. Label conclusions no stronger than the study level.

| Level | Required artifact depth | Strongest permitted positive conclusion |
| --- | --- | --- |
| Opportunity | boundary, rough demand/resource screen, fatal-constraint register, broad range, next-study brief | further preparation warranted |
| Pre-feasibility | alternative concepts, preliminary subsystem schedules/interfaces, sourced ranges, critical tests | preferred option merits feasibility design |
| Feasibility | frozen site/option basis, representative evidence/quotations, integrated implementation and financing model, resolved or enforceable conditions | establishment/financing decision support |

If evidence cannot meet the chosen level, downgrade the study explicitly or return `insufficient_basis`; do not keep the title and weaken the meaning.

## Freeze the project design basis

Create:

~~~yaml
product_or_service_and_quality:
target_market_and_sales_program:
capacity_and_ramp:
delivery_or_production_process:
location_and_service_area:
technology_and_data:
inputs_and_suppliers:
staffing_and_organization:
implementation_date:
regulatory_environmental_social_constraints:
currency_inflation_tax_financing:
alternatives_retained:
~~~

No subsystem may silently use a different volume, quality, schedule, or location.

## Develop the subsystems

### Market analysis, marketing, and capacity

Produce demand scenarios by segment, competitive supply, price/route assumptions, achievable sales program, production/service program, and capacity alternatives. Reconcile market penetration with sales and implementation capability.

**Gate M:** the proposed capacity follows from a defensible sales program rather than technical ambition.

### Materials, inputs, and supply

Create an input schedule:

| Input | Specification | Consumption per output | Ramp volume | Supplier/source | Lead time | Price/currency | Loss/contingency |
| --- | --- | ---: | ---: | --- | --- | --- | --- |

Test availability, quality, logistics, seasonality, concentration, storage, substitution, and working capital.

### Location and site/service footprint

Compare locations against market access, input access, labor, utilities, logistics, regulation, environmental/social constraints, resilience, expansion, and total delivered cost. Show critical site conditions and off-site infrastructure.

### Technology, engineering, data, and infrastructure

Compare feasible alternatives:

| Alternative | Output/quality | Capacity | Inputs | Maturity | Integration | Capex | Opex | License/IP | Risk |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- |

Develop process flow, material/data flow, layout or architecture, equipment/software/service requirements, utilities, quality controls, maintenance, security, and failure recovery.

**Gate T:** representative conditions support the required output, quality, throughput, and control.

For Gate M, Gate T, and every other decision-critical subsystem, keep a gate record:

| Gate | Required evidence | Result | Interface affected | Recovery route | Reopen evidence |
| --- | --- | --- | --- | --- | --- |

Use `pass`, `pass_with_condition`, `fail`, or `insufficient`. A failed market gate routes to demand/sales-program repair, capacity reduction, option redesign, or stop. A failed technical gate routes to representative testing, technology/process redesign, different capacity/quality basis, or stop. An insufficient gate downgrades the study level or blocks the investment conclusion. Rerun every affected interface before reopening.

### Organization and human resources

Map governance, operating roles, staffing by phase, skills, shifts/service coverage, recruitment, training, contractors, overheads, and decision rights. Link headcount and timing to capacity and implementation.

### Implementation

Build a dependency-based schedule for design, permits, financing, procurement, build/configuration, recruitment, testing, commissioning, launch, and ramp.

| Milestone | Predecessor | Owner | Duration/range | Cash commitment | Acceptance evidence |
| --- | --- | --- | --- | ---: | --- |

Identify critical path, long-lead items, stage gates, contingency, and point of no return.

### Financial and economic analysis

Translate physical schedules into investment, operating cost, revenue, working capital, financing, tax, financial statements/cash flows, and decision indicators. Compare financial return to broader economic/social impact when relevant; do not conflate investor cash with societal value.

### Environmental, social, legal, and institutional conditions

Identify permits, standards, contracts, data/privacy, safety, labor, environmental impacts, affected communities, governance, and monitoring obligations. Treat unresolved approvals or unacceptable impacts as feasibility conditions, not footnotes.

## Reconcile interfaces

Build the interface register:

| Upstream decision | Downstream consequence | Inconsistency found | Resolution | Owner |
| --- | --- | --- | --- | --- |

At minimum reconcile:

~~~text
sales program ↔ capacity ↔ technology
capacity ↔ inputs ↔ location ↔ logistics
technology ↔ staffing ↔ quality ↔ maintenance
implementation ↔ capex ↔ financing ↔ revenue start
operations ↔ working capital ↔ cash
legal/environmental conditions ↔ design ↔ schedule ↔ cost
~~~

When one subsystem changes, rerun every affected schedule. A collection of individually plausible chapters is not a feasible project.

## Compare alternatives and sensitivity

Keep viable technology, location, capacity, phasing, make/buy/partner, and financing alternatives visible until evidence narrows them. Compare the whole system.

Stress demand/ramp, price, utilization, input cost, delay, capex, yield/quality, staffing, working capital, financing, and major risks. Identify break-even conditions and fatal combinations.

## Deliver the Integrated Feasibility Study

Deliver the study-level statement, design basis, subsystem schedules, alternative appraisals, interface register, implementation plan, financial/economic analysis, environmental/social/legal conditions, sensitivities, unresolved conditions, and recommendation.

| Status | Controlling system state |
| --- | --- |
| `feasible` | Feasibility-level evidence; all material gates pass; interfaces reconcile; downside and financing remain acceptable |
| `feasible_with_conditions` | Every material gate is `pass` or `pass_with_condition`; every condition is enforceable, owned, dated, funded, and reflected across interfaces without changing the design basis |
| `prefeasible_more_design_needed` | Opportunity/pre-feasibility work supports further preparation, or any material gate requires redesign/retest/recomputation before establishment/financing |
| `infeasible_option` | A material gate fails and no credible redesign within the option boundary repairs it |
| `insufficient_basis` | Design basis, subsystem evidence, or interface reconciliation is missing or below the claimed study level |

State the exact conditions and the subsystem changes that require recomputation.

Foundations: [UNIDO Manual for the Preparation of Industrial Feasibility Studies](https://www.unido.org/publications/ot/9639595) and [UNIDO COMFAR](https://www.unido.org/learning-resources/computer-model-feasibility-analysis-and-reporting-comfar).
