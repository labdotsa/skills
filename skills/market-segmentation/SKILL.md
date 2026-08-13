---
name: market-segmentation
description: Partitions a market into evidence-backed groups that differ in need, behavior, buying process, economics, or response to strategy. Use when defining an ICP, selecting a beachhead, comparing segments, or testing whether a proposed partition is measurable and actionable.
metadata:
  author: labdotsa
  category: product
---

# Market Segmentation

A useful segment predicts a different decision or response. Labels that merely describe people are not segments until they change product, channel, price, sales, service, or risk choices.

## State the segmentation decision

Complete:

~~~yaml
decision:
market_boundary:
unit_of_segmentation:
decision_horizon:
actions_that_may_differ:
available_data:
~~~

Choose the unit deliberately: organization, account, site, user, buyer, household, asset, episode, or transaction. Keep different units in separate models.

**Stop condition:** if no action could differ between groups, use descriptive analysis instead of segmentation.

## Choose discriminating variables

Build a variable dictionary:

| Variable | Definition | Type | Source | Coverage | Why it may change response | Leakage/bias risk |
| --- | --- | --- | --- | ---: | --- | --- |

Prioritize variables tied to:

- need, circumstance, behavior, trigger, or desired outcome;
- current alternative and satisfaction;
- buying authority, procurement path, urgency, and budget;
- usage, frequency, value, cost-to-serve, retention, or risk;
- constraints such as regulation, integration, location, or capability.

Use demographics or firmographics only when they proxy a measured difference or make a group reachable. Exclude variables created after the outcome being predicted.

## Construct candidate partitions

Choose the branch that matches the evidence:

### Rule-based partition

Use when domain logic or operational eligibility creates known cut points.

1. State each rule before viewing segment performance.
2. Apply rules exhaustively and resolve overlaps.
3. Keep an **unclassified** group rather than forcing a fit.
4. Test whether adjacent groups actually respond differently.

### Data-driven partition

Use when sufficient comparable records and meaningful variables exist.

1. clean, encode, scale, and document missingness;
2. compare plausible techniques such as hierarchical/k-means clustering, latent class analysis, or mixture models according to variable type and membership uncertainty;
3. compare multiple group counts;
4. inspect stability across seeds, samples, and specifications;
5. translate statistical groups into observable membership rules.

Do not name a cluster until its defining behavior and decision implication are visible.

### Qualitative provisional partition

Use when evidence consists mainly of episodes or interviews.

1. group cases by repeated context → behavior → consequence patterns;
2. preserve negative and unmatched cases;
3. label prevalence and size unknown;
4. define the quantitative or behavioral evidence needed to confirm the partition.

## Challenge every candidate segment

Complete one row per segment:

| Test | Question | Pass evidence |
| --- | --- | --- |
| Internal coherence | Are members similar on the variables that drive the decision? | Within-group pattern is visible |
| Separation | Does this group differ materially from others? | Between-group contrast changes an action |
| Measurability | Can membership and size be estimated? | Observable rule and defensible count |
| Substantiality | Can the group support the intended objective? | Size/value exceeds a stated threshold |
| Reachability | Can the organization identify and access it? | Named channels or account sources |
| Actionability | Can product, price, channel, service, or risk treatment differ? | Specific strategic consequence |
| Stability | Will the grouping persist long enough to act? | Time horizon and migration behavior understood |
| Identifiability | Can a new case be classified without hidden judgment? | Reproducible membership rule |

Merge segments that fail separation. Split segments with incompatible behaviors. Retain an **unresolved** segment when classification evidence is weak.

## Size and compare beachheads

For each surviving segment, build a segment card:

| Field | Required content |
| --- | --- |
| Membership rule | Observable inclusion and exclusion |
| Need/behavior | Decision-relevant pattern |
| Trigger/alternative | Why and when action occurs |
| Buyer path | user, buyer, payer, approver |
| Size/value | range, units, source, confidence |
| Reach | channels and acquisition constraints |
| Economics | price potential, cost-to-serve, retention risk |
| Evidence | supporting, contradicting, and missing |

Compare beachheads against criteria fixed before scoring. Show raw evidence beside weights. A high weighted score cannot override a fatal access, legal, or economic constraint.

## Validate out of sample

Before opening the holdout or new cases, set decision-relative acceptance thresholds:

| Test | Metric and threshold | Failure route |
| --- | --- | --- |
| Classification | Minimum classified share and maximum ambiguous/unresolved share | repair observable membership rules |
| Stability | Allowed movement in size, defining variables, or membership across seeds/samples/periods | reduce group count, change variables, or keep provisional |
| Separation | Minimum material difference in behavior, economics, or outcome | merge groups or reject the partition |
| Differential action | Minimum difference in response to the product, price, channel, service, or treatment | do not use the partition for that action |
| Coverage | Required representation of high-value or high-risk cases | extend the sample before closing |

Choose thresholds from the cost of misclassification and the action—not from a universal segmentation score. Test against new cases, a holdout set, a later period, or another source. Track:

- classification rate and ambiguous cases;
- stability of group size and defining variables;
- differences in behavior or outcome;
- whether the selected action performs differently by segment.

Revise membership rules when real cases repeatedly cross boundaries, then revalidate on untouched cases; do not tune and claim validation on the same holdout.

## Deliver the Segment Map

Deliver the decision frame, variable dictionary, partition method, candidate and rejected partitions, segment cards, sizing, validation results, migration/ambiguity notes, and beachhead recommendation.

| Status | Controlling condition |
| --- | --- |
| `validated_partition` | All predeclared classification, stability, separation, differential-action, and coverage thresholds pass out of sample |
| `provisional_partition` | A coherent, actionable partition exists but out-of-sample evidence is pending or a nonfatal threshold remains unresolved |
| `insufficient_evidence` | Membership cannot be reproduced, separation/action difference fails, or size/reach evidence required by the decision is absent |

The conclusion states what the segmentation changes and what it cannot yet claim.
