---
name: assumption-mapping
description: Extracts, rewrites, maps, and sequences the beliefs that must be true for a product, service, or business concept to work. Use to identify leap-of-faith assumptions, kill risks, evidence gaps, and the next learning priority before experimentation.
metadata:
  author: labdotsa
  category: product
---

# Assumption Mapping

Map beliefs before selecting tests. The map answers: **what must be true, which belief can kill the concept, and what should be learned next?**

## Reverse the success chain

Start from the intended outcome and work backward:

~~~text
investment outcome
← sustainable economics
← repeat value and retention
← adoption and workflow change
← delivery and usable performance
← access, trust, and purchase
← meaningful customer problem
~~~

Adapt the chain to the concept. For every arrow ask, “what must be true for this transition to happen?”

Inspect customer/value, behavior/usability, technology/data, operations, business model, channel, price, legal/ethical/safety, organization, and adaptability. Add dependencies between beliefs.

**Checkpoint:** each link in the success chain has at least one explicit assumption or is supported by cited evidence.

## Rewrite assumptions as falsifiable statements

Use:

~~~text
We believe [defined actor/system]
will [observable behavior or condition]
under [circumstance]
to at least [threshold]
within [time],
because [mechanism].
~~~

Split statements joined by “and.” Replace adjectives such as easy, large, valuable, reliable, or affordable with observable measures.

Create the register:

| ID | Testable assumption | Category | Required for | Evidence now | Confidence | Dependency |
| --- | --- | --- | --- | --- | --- | --- |

Facts with strong current evidence are not testing priorities; cite them and keep them linked.

## Map importance against evidence

Place each assumption using two separate judgments:

| Axis | Question |
| --- | --- |
| Importance | If false, does the concept fail, require redesign, or merely optimize? |
| Evidence | What direct, fit, independent evidence currently supports it? |

Use the map:

~~~text
                     IMPORTANT
                         ↑
      test next          |        monitor/confirm
    weak evidence        |        strong evidence
                         |
LOW  --------------------+-------------------- HIGH EVIDENCE
                         |
      defer/delete       |        established input
                         ↓
                   LOW IMPORTANCE
~~~

Do not infer evidence strength from stakeholder confidence. Record the claim IDs or observations supporting the position.

## Identify kill risks and assumption systems

Mark:

- **fatal:** false means stop the concept or opportunity;
- **architectural:** false changes the mechanism or business model;
- **tunable:** false changes a parameter;
- **external gate:** law, safety, ethics, access, or stakeholder veto controls progression.

Build the dependency view:

| Upstream assumption | Downstream assumptions affected | Failure propagation |
| --- | --- | --- |

Test upstream beliefs first when their failure invalidates several downstream tests. Keep non-averagable external gates outside weighted scores.

## Select the next learning frontier

Rank only assumptions in the high-importance/weak-evidence area. Use an ordinal frontier; do not multiply unlabeled judgments into a pseudo-score:

| Axis | Low | Medium | High |
| --- | --- | --- | --- |
| Consequence if false | tuning only | architecture changes | concept stops or external gate fails |
| Uncertainty | direct fit evidence | bounded/indirect or mixed evidence | no fit evidence or material contradiction |
| Cost of learning late | cheap/reversible later | meaningful rework | irreversible exposure or invalidates much downstream work |

Order fatal and external gates before architectural and tunable assumptions. Within a class, prefer upstream dependencies, then higher uncertainty, then higher cost of learning late. When two remain tied, run the cheaper discriminating test or record the decision owner's rationale.

Then choose an evidence method that can actually observe the claim:

| Assumption type | Strong next evidence |
| --- | --- |
| Problem/urgency | Recent episodes, behavior, operational consequences |
| Demand/payment | Concrete offer, deposit, paid pilot, repeat purchase |
| Usability/adoption | Task observation with target users |
| Technical/data | Representative-data spike or benchmark |
| Economics | Driver model using observed price/cost/retention |
| Legal/safety | Qualified review plus control or failure test |
| Channel/access | Real acquisition or partner commitment |

Specify metric, threshold, stop rule, and decision consequence. Assumption mapping ends at a sequenced test queue; use an experiment-design skill to build the test.

## Update the map after evidence

After each test:

1. attach evidence to the assumption;
2. update support state and map position;
3. propagate failure or revision through dependencies;
4. retire disproven concepts or rewrite affected assumptions;
5. select the next frontier.

Preserve old states and rationale.

## Deliver the Assumption Map

Deliver the reverse success chain, falsifiable Assumption Register, importance/evidence map, kill-risk list, dependency view, and the status-appropriate route below.

| Status | Controlling condition | Permitted handoff |
| --- | --- | --- |
| `test_frontier_ready` | At least one high-importance weak-evidence assumption is testable with a threshold and consequence | sequenced Test Queue to an experiment-design method |
| `concept_has_unresolved_external_gate` | Law, safety, ethics, access, or stakeholder authority blocks testing or commitment | Gate Resolution Record; no experiment/commitment until authority resolves it |
| `concept_invalidated` | Credible evidence contradicts a fatal assumption and no live mechanism repair remains | stop record, or return to concept design if another mechanism survives; no Test Queue |
| `assumptions_not_testable_yet` | Statements cannot yet be made falsifiable or prerequisites prevent a credible observation | rewrite assumptions or obtain prerequisite evidence; no experiment handoff |

Foundation: [Strategyzer Testing Business Ideas](https://www.strategyzer.com/library/testing-business-ideas-book).
