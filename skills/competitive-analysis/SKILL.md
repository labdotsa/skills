---
name: competitive-analysis
description: Reconstructs the customer's real choice set, profiles direct and indirect alternatives, compares tradeoffs with evidence, and tests defensible differentiation. Use when customer-level choice, substitution, or positioning against alternatives is the blocker.
metadata:
  author: labdotsa
  category: product
---

# Competitive Analysis

Analyze the decision customers make, not only companies that resemble the proposed product.

## Reconstruct the choice event

Define:

| Element | Question |
| --- | --- |
| Customer/segment | Who is choosing? |
| Trigger | What makes the choice active now? |
| Job/outcome | What progress is sought? |
| Constraints | Budget, risk, time, policy, integration, habit |
| Decision roles | user, buyer, payer, approver, blocker |
| Choice horizon | What period and geography matter? |

Build the choice set:

~~~text
direct products
indirect products
manual/internal work
service or outsourcing
combination of tools
delay or do nothing
~~~

Create a coverage record. For every category above, list the surviving alternatives or record `screened_none`, `out_of_scope` with reason, or `evidence_gap`. If the customer episode is unknown, label the set provisional and route the gap to customer discovery. A named-direct-competitor list alone cannot close coverage.

## Build evidence-backed alternative cards

Use primary evidence first: product, pricing, terms, demos, documentation, customer behavior, procurement records, win/loss data, and current-user interviews.

| Card field | Required content |
| --- | --- |
| Alternative | Product, service, internal process, or non-consumption |
| Target/context | Who it serves and when |
| Value mechanism | How it delivers the outcome |
| Offer/price | Packaging, metric, contract, switching cost |
| Route | Sales, channel, onboarding, implementation |
| Proof | Customer evidence, performance, adoption, trust |
| Tradeoffs | What improves and what worsens |
| Trajectory | Investments, expansion, retreat, or strategic direction |
| Confidence | Source quality and missing evidence |

Separate observed facts from interpretations. A marketing claim remains a claim until corroborated.

## Compare on customer decision criteria

Derive criteria from choice episodes, procurement rules, operational constraints, and economic consequences. Avoid generic feature inventories.

Create a long-form decision matrix so every surviving alternative is represented:

| Criterion | Importance evidence | Alternative | Performance/tradeoff | Supporting record | Non-compensatory? | Confidence |
| --- | --- | --- | --- | --- | ---: | --- |

For every rating, show the supporting evidence and the segment/context in which it holds. Preserve non-compensatory criteria such as regulation, safety, integration, or minimum performance.

Compare total tradeoffs:

~~~text
outcome quality + time + effort + risk + cash cost
+ switching/implementation + social/organizational consequence
~~~

## Explain advantage through a mechanism

For each claimed advantage, complete:

| Claim | Customer evidence | Enabling capability | Competitor response | Durability | Failure condition |
| --- | --- | --- | --- | --- | --- |

Classify:

- **parity requirement:** needed to enter consideration;
- **situational advantage:** wins for a bounded context;
- **defensible advantage:** supported by a capability, asset, network, cost position, switching structure, or learning loop;
- **unsupported claim:** lacks customer or operating evidence.

Features alone rarely explain durability.

## Test whitespace

A whitespace hypothesis must satisfy all five:

1. a defined segment experiences a material unresolved tradeoff;
2. current alternatives fail for an evidenced reason;
3. the proposed mechanism improves the tradeoff;
4. willingness to switch or pay is plausible;
5. the position can be delivered economically and defended long enough to matter.

Write explicit invalidators. If the space exists only because incumbents have not entered, investigate whether demand or economics are unattractive.

## Read movement, not just position

Map strategic groups or trajectories when evidence supports it:

| Alternative | Current position | Direction of travel | Capability being built | Likely effect on our position |
| --- | --- | --- | --- | --- |

Identify response scenarios: copy, bundle, discount, partner, acquire, ignore, or block access. State which response would erase the proposed advantage.

## Deliver the Competitive Landscape

Deliver the choice-event definition, alternative set, evidence cards, customer decision matrix, tradeoff analysis, advantage mechanisms, trajectory map, and whitespace verdict.

| Status | Controlling condition |
| --- | --- |
| `position_supported` | Choice-set coverage is complete enough for the decision; customer evidence supports the tradeoff; mechanism and delivery evidence support the advantage; whitespace conditions and response stress pass |
| `position_conditional` | A bounded segment/context advantage exists, but a named evidence gap, capability, economics, or response scenario could erase it |
| `no_defensible_difference` | The concept is parity, the material tradeoff does not improve, whitespace conditions fail, or a likely response erases the advantage |
| `evidence_insufficient` | Choice event/set is provisional, a material category is an evidence gap, or advantage claims lack customer/operating evidence |

The conclusion says who would choose differently, in what circumstance, why, and which invalidator would reverse it.

Foundation: [U.S. SBA market research and competitive analysis](https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis).
