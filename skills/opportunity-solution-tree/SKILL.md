---
name: opportunity-solution-tree
description: Builds and maintains Teresa Torres' Opportunity Solution Tree from one desired outcome through interview-derived opportunities, a target opportunity, multiple solutions, and assumption tests. Use to organize continuous discovery and decide what to test or prune next.
metadata:
  author: labdotsa
  category: product
---

# Opportunity Solution Tree

Use the tree to visualize discovery decisions:

~~~text
desired outcome
└── opportunity space
    └── target opportunity
        ├── solution A
        │   └── assumption test
        ├── solution B
        │   └── assumption test
        └── solution C
            └── assumption test
~~~

## Enforce prerequisites

Run preflight before tree construction:

| Prerequisite | Passing evidence |
| --- | --- |
| Target customer theory | A bounded customer or user context |
| Value theory | A reason this customer’s progress matters |
| Desired outcome | One measurable product/business outcome the team can influence |
| Story evidence | At least three relevant story-based interviews or equivalent behavioral evidence |

Use this branch:

| Preflight result | Action |
| --- | --- |
| Customer or value theory missing | route to discovery; do not create tree nodes |
| Story evidence missing | preserve complaints/signals as recruitment prompts only; do not create opportunity nodes |
| Only the desired outcome is missing | run the bounded outcome-definition step below, then repeat preflight |
| All prerequisites pass | enter tree construction |

Do not fabricate opportunities to make a balanced tree.

## 1. Set one outcome at the root

Record:

~~~yaml
metric:
unit_and_population:
baseline:
target:
deadline:
owner:
strategic_link:
team_influence:
guardrails:
~~~

Reject solution-shaped outcomes such as “launch feature X.” The root passes when progress can be measured without referring to a solution.

## 2. Map the opportunity space from stories

Extract needs, pain points, and desires from specific customer stories. Give each node:

~~~yaml
opportunity_id:
customer_wording:
parent_id:
episode_ids:
segment_or_circumstance:
frequency:
severity:
recency:
contrary_evidence:
confidence:
state: observed | hypothesis | unresolved
~~~

Group opportunities by underlying need. Test every parent-child link: the child must be a more specific manifestation of the parent, not a solution or a synonym.

Keep unattractive, contradicted, and low-confidence branches visible with status.

## 3. Choose one target opportunity

Compare opportunities using:

| Criterion | Evidence required |
| --- | --- |
| Importance | Consequence in customer stories or behavior |
| Current satisfaction | Evidence the existing way underperforms |
| Reach | Number or share of relevant customers, when measurable |
| Outcome connection | Plausible mechanism linking opportunity to root |
| Strategic fit | Why the team should address it |
| Evidence confidence | Quality and coverage of supporting stories/data |

Use numeric scoring only when inputs are comparable. Record the selection rationale and the evidence that would cause retargeting.

The target passes when the team can explain why it outranks its siblings without relying on the preferred solution.

## 4. Diverge in the solution space

Brainstorm broadly for the target opportunity, then select three meaningfully different mechanisms to explore. Draw from product, service, process, policy, partner, operational, and commercial approaches.

For each solution:

| Field | Required content |
| --- | --- |
| Mechanism | How it addresses the target opportunity |
| Expected behavior | What changes for the customer |
| Assumptions | value, usability, feasibility, viability, ethics/safety |
| Distinguishing tradeoff | Why this is not a variant of another solution |

Three visual variants of one mechanism count as one solution.

## 5. Test assumptions across the three ideas

Identify the riskiest assumption for each solution. Prefer tests that allow fair comparison across ideas.

| Test ID | Solution | Assumption | Population | Method | Metric/baseline | Pass line | Stop line | Guardrail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Set lines before exposure. After each result, choose:

~~~text
advance  = assumption supported enough for the next risk
revise   = opportunity remains, mechanism changes
hold     = test invalid or evidence inadequate
prune    = assumption contradicted or guardrail failed
retarget = target opportunity no longer merits focus
~~~

Attach result, evidence, date, owner, and rationale to the affected node.

## 6. Maintain the living tree

At each discovery review:

1. add new interview-derived opportunities;
2. update evidence and status of existing nodes;
3. inspect whether new evidence changes hierarchy;
4. re-evaluate the target opportunity;
5. advance, revise, hold, or prune solution branches;
6. preserve rejected paths as discovery memory;
7. choose the next interview or assumption test.

Keep the active frontier small: one target opportunity and three comparison solutions unless the team explicitly records why a different breadth is necessary.

## Deliver the discovery decision surface

Deliver the rendered tree, node register, Opportunity Ranking, solution assumption table, Experiment Backlog, decision history, and next discovery action.

The tree is healthy when the root is measurable, every opportunity traces to a story, the target has an explicit rationale, three mechanisms are genuinely different, each active solution has a thresholded assumption test, and failed branches remain inspectable.

Foundation: [Teresa Torres' Opportunity Solution Tree](https://www.producttalk.org/2016/08/opportunity-solution-tree/).
