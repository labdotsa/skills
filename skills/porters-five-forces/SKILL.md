---
name: porters-five-forces
description: Diagnoses how rivalry, entrants, substitutes, buyers, and suppliers divide economic value within a defined industry. Use when assessing industry attractiveness, profit pressure, structural change, or structural positions with durable bargaining power.
metadata:
  author: labdotsa
  category: product
---

# Porter's Five Forces

Analyze industry profitability, not a list of competitors. The five forces explain who can take value, why, and how the structure may change.

## Draw the industry boundary

Complete the boundary test:

| Question | Required answer |
| --- | --- |
| Product/service scope | What output is sold? |
| Customer scope | Which buyer groups participate? |
| Geography | Where does competition occur? |
| Value-chain position | Which activity earns the revenue being analyzed? |
| Time horizon | Current structure and relevant future period |
| Profit measure | Margin, return, price-cost spread, or another economic outcome |

Test adjacent boundaries. If force conclusions reverse when one product, geography, or value-chain layer changes, analyze those arenas separately.

Map the value chain and estimate where revenue, cost, and profit pools sit. Keep complements distinct from substitutes and suppliers distinct from rivals.

## Diagnose each force from drivers

Create a driver record for every force:

| Driver | Evidence | Mechanism affecting price/cost/investment | Direction | Strength | Change signal |
| --- | --- | --- | --- | --- | --- |

### Rivalry among existing competitors

Inspect number and balance of rivals, growth, fixed or storage costs, differentiation, switching costs, capacity increments, strategic stakes, exit barriers, and competitive dimensions. State whether rivalry dissipates value through price, service, marketing, capacity, innovation, or another cost.

### Threat of entry

Inspect economies of scale, demand-side benefits, switching costs, capital, incumbency advantages, channels, regulation, expected retaliation, and the capabilities of likely entrants. Judge the threat from barriers plus entrant motivation—not from the absence of current startups.

### Threat of substitutes

Start from the buyer’s underlying need. Identify different ways to complete it, including internal work, manual work, outsourcing, delay, and adjacent categories. Compare price-performance and switching friction.

### Buyer power

Segment buyers when concentration, purchase size, differentiation, switching, information, backward integration, price sensitivity, or product impact differs. Explain how buyers capture value: lower price, more service, risk transfer, or delayed payment.

### Supplier power

Define critical input groups. Inspect concentration, uniqueness, switching, substitutes for inputs, importance of the industry to suppliers, forward integration, labor/capability scarcity, and pass-through ability. Explain the margin mechanism.

## Assign force judgments

Use **high**, **medium**, **low**, or **indeterminate** only after recording:

~~~yaml
force:
dominant_drivers:
countervailing_drivers:
economic_mechanism:
evidence_scope:
current_strength:
direction_of_change:
confidence:
~~~

A count of favorable and unfavorable bullets is not a force rating. The dominant economic mechanism controls.

## Read the system

Build an interaction table:

| Force interaction | Reinforcing or offsetting mechanism | Profit consequence | Strategic significance |
| --- | --- | --- | --- |

Look for structures such as:

- substitutes increasing buyer power;
- new technology lowering entry barriers while strengthening suppliers;
- regulation raising entry barriers while increasing compliance cost;
- excess capacity intensifying rivalry and buyer leverage;
- consolidation moving value to buyers or suppliers.

Describe the current profit pool, the likely structural change, and who gains or loses value.

## Derive positioning choices

For each strategic response, state which force it changes or avoids:

| Choice | Force mechanism addressed | Capability/commitment | Likely reaction | Evidence needed |
| --- | --- | --- | --- | --- |

Separate:

- positioning within the structure;
- actions that may reshape the structure;
- attractive growth with poor structural profitability;
- a good company position inside an unattractive industry.

## Judge attractiveness against an economic hurdle

Set the hurdle before the verdict. Prefer sustainable return on invested capital relative to cost of capital and credible alternative arenas. When those data do not exist, use an explicit proxy—durable price–cost spread, cash contribution after required investment, or bargaining capture—and label the inference bounded.

Create the bridge:

| Dominant force mechanism | Interaction | Profit-pool effect | Position available? | Hurdle consequence | Confidence |
| --- | --- | --- | --- | --- | --- |

Growth, market size, or a count of low forces cannot substitute for the hurdle. Indeterminate evidence on a dominant force prevents an unqualified attractiveness finding.

## Deliver the structural thesis

Deliver the boundary and value chain, five force driver records, force judgments, interaction map, structural-change outlook, profit-pool thesis, and positioning implications.

| Status | Controlling condition |
| --- | --- |
| `structurally_attractive` | Evidence-backed force system supports returns above the stated hurdle through the horizon, with no dominant force indeterminate |
| `conditionally_attractive` | The hurdle can be met only from a bounded position, capability, segment, or scenario whose condition is explicit |
| `structurally_unattractive` | Dominant mechanisms keep a competent participant below the hurdle and no credible position changes that conclusion |
| `boundary_or_evidence_insufficient` | Boundary sensitivity, missing profit benchmark, or indeterminate dominant force could reverse the finding |

Each conclusion names the mechanism and evidence; a five-part scorecard alone does not pass.

Foundation: [Harvard Business School Institute for Strategy and Competitiveness](https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx).
