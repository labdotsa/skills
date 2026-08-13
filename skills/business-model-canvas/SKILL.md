---
name: business-model-canvas
description: Designs and compares Strategyzer Business Model Canvases as integrated systems of customer value, delivery, and value capture. Use when constructing a business-model hypothesis, comparing monetization or operating architectures, or exposing cross-block assumptions.
metadata:
  author: labdotsa
  category: product
---

# Business Model Canvas

Use the nine blocks to expose the logic of a business model on one surface. Each item is a hypothesis until evidence supports it; each block must connect to the others.

## Choose the canvas boundary

State:

| Boundary | Required decision |
| --- | --- |
| Organization/venture | Whose model is represented |
| Offer | Product/service family in scope |
| Market/geography | Where the model operates |
| Time/state | Current, launch, target, or scenario |
| Architecture | Direct, marketplace, service, license, partner-led, etc. |

Build separate canvases for materially different architectures or customer systems. Do not merge incompatible futures into one canvas.

## Populate from the customer side

Use one concise item per cell and attach evidence or assumption IDs.

### 1. Customer Segments

Name user, buyer, payer, beneficiary, and approver. Separate segments when jobs, purchase paths, value, service model, or economics differ.

### 2. Value Propositions

For each segment, state outcome, current alternative, mechanism, proof, and tradeoff. Link every proposition to a segment.

### 3. Channels

Map awareness → evaluation → purchase → delivery → support → renewal. Name who controls each transition and its cost/friction.

### 4. Customer Relationships

Specify acquisition, onboarding, success, support, retention, expansion, community, or automation model. Match intensity to price and economics.

### 5. Revenue Streams

Complete:

| Segment/payer | Value metric | Price/terms | Frequency | Collection | Renewal/expansion condition |
| --- | --- | --- | --- | --- | --- |

Distinguish price, billing, revenue recognition, and cash timing.

## Build the delivery system

### 6. Key Activities

List only activities essential to create, sell, deliver, assure, and renew the value.

### 7. Key Resources

Map data, technology, people, brand, licenses, capital, network, IP, inventory, or infrastructure to the activities they enable.

### 8. Key Partners

State the exchanged value, controlled dependency, incentives, switching route, and failure consequence. Separate supplier from channel, regulator, complementor, and strategic partner.

### 9. Cost Structure

Tie each material cost to activity, resource, partner, channel, or relationship. Classify fixed, variable, step-fixed, acquisition, implementation, working-capital, and risk costs using compatible units and periods.

## Trace the model as loops

Create a coherence table:

| Segment | Value | Channel | Relationship | Revenue | Delivery activities/resources/partners | Cost consequence |
| --- | --- | --- | --- | --- | --- | --- |

Every row must close:

~~~text
reachable segment
→ receives promised value
→ through a workable channel and relationship
→ pays through an aligned value metric
→ delivery system fulfills the promise
→ revenue exceeds the full operating consequences
~~~

Unlinked sticky notes are not a business model.

## Run propagation tests

Change one load-bearing assumption at a time:

| Shock | Blocks that must be recomputed |
| --- | --- |
| Segment or buyer changes | value, channel, relationship, revenue, service cost |
| Price metric changes | behavior, billing, data, revenue, cost, risk |
| Direct → partner route | channel, relationship, margin, data/control, partner |
| Self-serve → high-touch | activities, people, price, capacity, cost |
| Volume changes | capacity, step-costs, working capital, partner power |

Open a contradiction record instead of editing a block silently:

| Contradiction | Affected blocks/assumptions | Decision consequence | Repair or test | Owner | State |
| --- | --- | --- | --- | --- | --- |

Recompute every affected loop. Close each item as `repaired`, `routed_to_test`, or `model_invalidating`. Examples: enterprise procurement with a no-touch sales assumption; premium assurance with commodity support; usage revenue with mostly fixed high-touch delivery.

## Compare business-model architectures

Create at least one credible alternative plus business as usual when model choice is material.

Before comparison, predeclare must-pass requirements and vetoes:

| Requirement | Threshold / veto | Why material | Evidence |
| --- | --- | --- | --- |
| Customer value/demand | | | |
| Access and control | | | |
| Delivery feasibility | | | |
| Unit economics/cash | | | |
| Legal, safety, ethics | | | |
| Reversibility/adaptability | | | |

| Criterion | Model A | Model B | BAU | Evidence |
| --- | --- | --- | --- | --- |
| Customer value | | | | |
| Access/control | | | | |
| Speed/capital | | | | |
| Margin/cash | | | | |
| Scalability | | | | |
| Dependency/risk | | | | |
| Reversibility | | | | |

Expose desirability, feasibility, viability, and adaptability assumptions for each option. Eliminate or rework any architecture that fails a veto; compare surviving options against the remaining criteria. Do not select by canvas completeness or an average that hides a veto.

## Deliver Business Model Options

Deliver separate nine-block canvases, coherence loops, cross-block dependency map, contradiction register, propagation-test results, assumption register, architecture comparison, and status-appropriate handoff.

| Status | Controlling condition | Permitted handoff |
| --- | --- | --- |
| `coherent_hypothesis` | All loops close; no contradiction remains open; no must-pass veto is contradicted; unsupported requirements remain explicit hypotheses | preferred-for-testing option plus invalidators and Test Queue; not a validated model |
| `conditional_model` | Coherence exists but a named must-pass requirement needs bounded evidence or an enforceable condition | conditional preferred-for-testing option; condition/test must precede commitment |
| `model_contradiction` | An open model-invalidating contradiction or veto failure breaks one or more loops | contradiction repair/redesign record; no preferred option |
| `evidence_insufficient` | Blocks can be populated only by invention or evidence cannot distinguish the live architectures | evidence plan for the discriminating blocks; no preferred option |

Foundation: [Strategyzer Business Model Canvas](https://www.strategyzer.com/business-models-the-toolkit-to-design-a-disruptive-company).
