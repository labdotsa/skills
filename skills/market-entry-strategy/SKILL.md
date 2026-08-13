---
name: market-entry-strategy
description: Designs entry modes and sequencing for an already bounded beachhead by comparing direct, distributor/agent, licensing, franchising, partnership, joint-venture, acquisition, and owned-operation routes. Use when the question is how to enter a chosen geography, segment, or channel while controlling evidence, capital, compliance, and reversibility.
metadata:
  author: labdotsa
  category: product
---

# Market Entry Strategy

Treat entry as a sequence of commitments. Select the mode that can prove access and delivery while preserving the control, economics, and reversibility the opportunity requires.

## Write the entry thesis

Complete:

~~~yaml
target_geography_and_beachhead:
target_customer_and_buyer:
initial_job_or_use_case:
offer_and_position:
current_alternatives:
why_now:
advantage_mechanism:
proof_needed:
investment_limit:
time_horizon:
~~~

If the segment, offer, and access hypothesis are not bounded, return **entry_thesis_unformed**.

## Map two routes

Draw separately:

~~~text
route to customer:
awareness → evaluation → trust → procurement → payment → renewal

route to delivery:
supply/input → localization → implementation → service → support → compliance
~~~

Name the actor controlling each transition, the required capability, evidence available, and failure consequence. Market access without delivery is not entry readiness.

## Compare entry modes as control systems

Predeclare decision gates before scoring modes:

| Gate | Required control/threshold | Veto condition |
| --- | --- | --- |
| Customer and data control | | route hides evidence needed for the next commitment |
| Capital and cash exposure | | exceeds authorized loss or funding capacity |
| Compliance and authority | | license, legal, safety, or data path cannot operate |
| Delivery and quality | | no credible capability/SLA route |
| Economics | | route cannot reach the required contribution/payback |
| Reversibility | | lock-in precedes proof without compensating scarce value |

Build one option for each credible mode:

| Mode | Speed | Capital | Customer/data control | Margin | Local knowledge | Compliance/load | Reversibility |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Direct export/digital/direct sales | | | | | | | |
| Agent or distributor | | | | | | | |
| Licensing or franchising | | | | | | | |
| Commercial/implementation partner | | | | | | | |
| Joint venture | | | | | | | |
| Acquisition or owned subsidiary | | | | | | | |

For each mode, complete:

| Field | Required content |
| --- | --- |
| Value exchange | What each party contributes and receives |
| Decision rights | price, customer, product, brand, data, service |
| Economics | margin, fees, fixed cost, working capital, tax |
| Dependencies | permits, IP, systems, exclusivity, key people |
| Failure route | termination, customer continuity, data/IP return |
| Learning quality | What evidence the mode reveals or hides |

Eliminate or reconfigure modes that fail a veto. Select among survivors based on the predeclared requirements, not the average column score. A partner-led route may be fast while obscuring customer evidence or weakening unit economics.

## Design the beachhead motion

Choose the narrowest initial geography × segment × use case × channel that supports:

- concentrated reachable demand;
- repeatable problem and offer;
- sufficient local supply/capability;
- manageable compliance;
- observable acquisition, delivery, and retention;
- expansion adjacency if the proof succeeds.

Define position against the actual alternative and specify localization across product, language, service, pricing, contracts, tax, data, standards, and trust.

## Build the proof ladder

Stage commitments:

| Stage | Question | Minimum action | Evidence gate | Capital at risk | Pass / invalid / hold / reconfigure / exit consequence |
| --- | --- | --- | --- | ---: | --- |
| Access | Can qualified buyers be reached? | Real outreach/channel test | Meetings or qualified exposures | | |
| Problem/offer | Will buyers engage with this offer? | Concrete offer/pilot ask | Signed, paid, or resource commitment | | |
| Delivery | Can value be delivered locally? | Narrow real pilot | SLA/outcome/adoption threshold | | |
| Economics | Can repeatable contribution survive the route? | Cohort economics | contribution, payback, capacity | | |
| Retention/expansion | Does value persist and travel? | Renewal/adjacent test | renewal and repeatability | | |
| Scale | Can the chosen mode expand without losing control? | Controlled rollout | stable quality, cash, risk | | |

Freeze each threshold before the stage. Record every result as `pass`, `invalid_evidence`, `hold_and_retest`, `reconfigure_mode`, or `exit`. Each result updates the route map, selected mode, capital authorization, and eligibility for the next stage. Passing one stage authorizes only the next commitment.

## Validate the selected control architecture

If a partner controls customer access, fulfillment, licensing, or another critical transition, run the partner branch. Before exclusivity or structural dependence:

Before exclusivity or structural dependence:

1. source multiple candidates;
2. verify legal standing, capability, reputation, incentives, conflicts, and customer access;
3. run a named-account or bounded fulfillment pilot;
4. require customer, pipeline, service, and financial data needed for learning;
5. measure activation, conversion, delivery quality, margin, and concentration;
6. define termination, transition, non-circumvention, IP, and data rights.

Choose exclusivity only when the partner contributes a scarce asset whose value exceeds the lost option.

If direct or owned operation controls the critical transitions, replace the partner artifact with an Owned-Capability Validation Record: capability, capacity, compliance evidence, fixed/working capital, hiring or supplier dependency, service threshold, failure route, and exit/redeployment value. Do not invent a partner requirement for a direct mode.

## Set triggers and contingencies

| Signal | Trigger | Action | Owner |
| --- | --- | --- | --- |
| Access slower than planned | | switch/narrow channel | |
| Delivery quality fails | | narrow category or pause | |
| CAC/payback fails | | change mode/price/segment | |
| Partner concentration rises | | diversify or internalize | |
| Regulation changes | | pause/localize/restructure | |
| Retention fails | | stop expansion and revisit value | |

Predefine exit conditions and recoverable assets.

## Deliver the Market Entry Strategy

Always deliver the entry thesis, dual route map, mode gates/options, current evidence, and verdict. Add only the status-appropriate handoff below.

| Status | Controlling condition | Permitted handoff |
| --- | --- | --- |
| `enter_staged` | A mode passes all vetoes and the next proof-ladder stage has a bounded commitment and valid gate | selected-control validation, staged plan, triggers, and expansion logic |
| `enter_conditionally` | A mode survives only with named, owned, enforceable conditions before exposure | condition-resolution plan; expansion only after conditions and stage gates pass |
| `mode_rework` | Access/delivery may be viable but the current control, economics, or reversibility architecture fails | mode repair/recomparison; no expansion plan |
| `hold_for_access_evidence` | No route has valid evidence that qualified buyers or required delivery inputs are reachable | access/delivery evidence plan; no selected mode or expansion plan |
| `do_not_enter` | Every credible mode fails a fatal gate or the entry thesis no longer survives | exit/avoidance record and recoverable assets; no selected control validation or expansion plan |

Foundation: [U.S. International Trade Administration market-entry guidance](https://www.trade.gov/selecting-international-markets).
