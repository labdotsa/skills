---
name: customer-discovery
description: Tests customer, problem, buyer, and value hypotheses through behavioral interviews, observation, operational evidence, and escalating commitments. Use when recruitable customer cases must establish or synthesize problem behavior, buying roles, access, or problem-solution evidence.
metadata:
  author: labdotsa
  category: product
---

# Customer Discovery

Run discovery as repeated hypothesis contact with the field:

~~~text
hypothesis → eligible case → behavioral episode → evidence update → next sample/test
~~~

The unit of evidence is an episode or observed behavior, not an interview count.

## Set the discovery board

Create one row per falsifiable belief:

| ID | Customer/role | Context | Expected behavior/problem | Consequence | Current alternative | Evidence that supports | Evidence that rejects |
| --- | --- | --- | --- | --- | --- | --- | --- |

Include hypotheses for user, buyer, payer, approver, blocker, urgency, value, access, and current alternatives. Select the few beliefs whose failure would change the segment, problem, or next investment.

## Recruit for contrast

Build a recruitment matrix:

| Dimension | Cases needed |
| --- | --- |
| Role | user, buyer, approver, implementer, blocker |
| Outcome | successful, struggling, abandoned, switched, never adopted |
| Relationship | current, former, lost prospect, non-customer |
| Context | size, workflow, geography, frequency, constraint |
| Evidence stance | likely support and likely disconfirming cases |

Define eligibility before recruitment. Record source, referral chain, refusals, no-shows, and exclusions. Friendly or convenience participants remain visible as a sampling limitation.

## Conduct one episode interview

Choose a specific recent occurrence—not a general opinion. Move chronologically:

1. **Before:** what was normal before the episode?
2. **Trigger:** what happened that made the issue salient?
3. **Response:** what did the person do first, then next?
4. **Alternative:** what tools, people, workarounds, or delay were used?
5. **Consequence:** what time, money, risk, emotion, or coordination changed?
6. **Decision system:** who influenced, approved, paid, blocked, implemented?
7. **Outcome:** what happened, and what remains unresolved?

Use prompts such as “show me,” “walk me through,” “what happened next,” and “what did that cost.” Request artifacts or observation when consent and privacy permit.

Keep solution reactions in a separate section. Stated willingness, compliments, and feature requests do not replace past behavior.

## Write the episode record immediately

Use:

~~~yaml
participant_and_eligibility:
episode_date_and_context:
trigger:
timeline:
actions_and_alternatives:
consequences:
stakeholders_and_authority:
money_or_resource_commitment:
artifacts_or_observation:
verbatim_language:
contradictions:
researcher_inferences:
hypotheses_supported:
hypotheses_weakened:
new_questions:
~~~

Label each entry **observed**, **reported**, or **inferred**. Keep recordings, notes, consent state, and instrument version linked.

**Session complete when:** the record contains one reconstructable episode or an explicit failed-session record. A failed session is excluded from hypothesis support and pattern/saturation counts. Classify it and repair the source:

| Failure | Route |
| --- | --- |
| Participant was ineligible | repair screener or recruitment channel; recruit a replacement under the original rule |
| Eligible participant had no relevant episode | change recency/event eligibility or route the session to exploratory needs research |
| Instrument stayed hypothetical/solution-led | repair the guide and interviewer calibration; do not reinterpret answers as episodes |
| Recording/consent/data integrity failed | exclude affected evidence and follow the approved recovery/escalation process |

## Synthesize in batches

After each batch, create an episode matrix:

| Case | Context | Trigger | Behavior | Alternative | Consequence | Buyer path | Commitment | Contradiction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Cluster by repeated circumstance → behavior → consequence, not by memorable quotes. Compare positive and negative cases. Update every hypothesis to:

~~~text
supported | weakened | rejected | unknown
~~~

For each state, cite episode IDs, scope, contrary cases, and confidence. Never use a vote count without checking case relevance and independence.

## Adapt the next sample

Choose the next case to discriminate between explanations:

| Current ambiguity | Next case |
| --- | --- |
| User reports pain; buyer does not act | Recruit buyer/approver |
| One segment shows strong consequence | Recruit contrasting segment |
| Enthusiasts dominate | Recruit former, failed, or non-adopters |
| Interview claim lacks behavioral proof | Observe workflow or request operational artifact |
| Pattern may be channel-specific | Recruit through another channel |

Stop a qualitative discovery cycle only when:

1. new eligible cases no longer change the decision-relevant pattern;
2. disconfirming cases have been deliberately sought;
3. role and segment gaps are explicit;
4. remaining uncertainty is routed to another method rather than called “saturation.”

## Escalate to behavior

When ethical and proportionate, ask for stronger commitment:

~~~text
follow-up time
< introduction
< workflow access
< data or implementation effort
< signed pilot
< payment
< repeated use
< renewal
~~~

Record the exact ask, denominator of eligible exposures, acceptances, refusals, conditions, and selection effects. Match the ask to concept maturity; never imply a product exists when it does not.

## Route the next field decision

Let the current hypothesis state determine the next move:

| Evidence state | Next action | Handoff condition |
| --- | --- | --- |
| Mechanism unclear; eligible episodes still change the pattern | continue contrasting qualitative cases | next case discriminates between explanations |
| Role, segment, or channel explains contradictions | change the recruitment cell, not the question until contrasted | revised boundary has explicit membership evidence |
| Reported behavior lacks consequence or proof | observe work or request a consented artifact | operational record is linked to the episode |
| Problem/role pattern is stable but demand remains unknown | run a proportionate commitment test | exact ask and denominator are preregistered |
| Repeated eligible cases contradict the problem or buyer hypothesis | revise segment/problem or reject it | old hypothesis and evidence remain visible |
| Sample cannot support the intended claim | issue insufficiency and route to an appropriate design | no prevalence or fit claim is promoted |

## Deliver the Customer Discovery Dossier

Deliver the hypothesis board and history, recruitment matrix, episode records, synthesis matrix, candidate ICPs with membership evidence, stakeholder/buying map, alternatives, consequences, contradictions, commitments, sample boundary, and next evidence plan.

| Status | Controlling condition | Permitted next action |
| --- | --- | --- |
| `problem_evidence_supported` | Eligible episodes across the required roles/contrasts show a stable problem mechanism and consequence; contrary cases are bounded | test demand/value or the next named hypothesis |
| `segment_or_problem_revise` | Evidence supports a different circumstance, role, segment, or problem formulation | rewrite the board and recruit against the new boundary |
| `problem_rejected` | Repeated eligible cases contradict consequence, urgency, or ownership and no credible narrower case survives | stop this problem/segment hypothesis |
| `insufficient_evidence` | Eligibility, episode quality, role coverage, independence, or sample boundary cannot support the intended conclusion | repair/recruit/reroute; make no fit claim |

State exactly which episodes and behaviors justify the finding.

Foundation: [NSF I-Corps customer discovery](https://www.nsf.gov/funding/information/faq-i-corpstm-team-solicitation).
