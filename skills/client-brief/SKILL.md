---
name: client-brief
description: Researches a prospective or current client from incomplete intake details and public evidence, then produces a sourced client brief for qualification, discovery, proposal preparation, or engagement planning. Use when a team needs to understand who a client is, how the organization is positioned, what may have triggered its request, and which questions still require direct discovery.
metadata:
  author: labdotsa
  category: product
---

# Client Brief

Turn a client inquiry into an evidence-backed pre-engagement brief. Reduce avoidable discovery questions without treating public research as a substitute for direct client conversation.

## Establish the assignment

Collect whatever intake is available:

~~~yaml
client_name:
website:
contact_name:
contact_role:
contact_email_domain:
linkedin_url:
country_or_market:
request_summary:
requested_service:
submitted_materials:
known_constraints:
output_path: client-brief.md
~~~

Proceed from partial intake when at least one usable identity signal exists. Preserve the client's own request separately from later interpretation. Treat supplied confidential material according to its access restrictions and never expose it through external searches.

Define the brief's decision context before researching: qualification, discovery preparation, proposal preparation, account planning, or another named decision. Use it to control research depth and relevance.

## Resolve the client identity

Distinguish the following rather than assuming they are interchangeable:

| Identity | Evidence to seek |
| --- | --- |
| Brand | Public-facing name, products, and website |
| Operating organization | Entity delivering the offer or employing the contact |
| Legal entity | Registered name and jurisdiction when relevant and publicly verifiable |
| Website operator | Organization named in terms, privacy, copyright, or domain records |
| Requester | Person who submitted the inquiry and their evidenced or claimed relationship |
| Related organizations | Parent, subsidiary, affiliate, franchise, or similarly named organization |

Resolve names, domains, geography, and organizational relationships before deep research. Record competing matches when ambiguity remains. Do not merge entities because their names resemble one another, and do not attribute a personal profile to the requester without corroborating identity signals.

Stop with `identity_ambiguous` when the ambiguity would materially change the brief. State the minimum information needed to proceed.

## Research in evidence order

Start with sources closest to the organization: its official website, product and service pages, about and leadership pages, policies, newsroom, case studies, careers, public reports, and submitted material. Then seek independent evidence appropriate to the geography and decision: official registries, regulators, procurement records, reputable reporting, trade sources, professional profiles, app stores, technical documentation, and other public records.

Prefer primary sources for identity, ownership, leadership, regulated status, official offers, and current policies. Use independent sources to test positioning, reputation, market context, and consequential company claims. Trace syndicated reporting to its earliest accessible origin so repeated copies do not count as independent corroboration.

For time-sensitive claims, capture both the publication date and the period the source describes. Set a visible research cutoff date. Stop when the decision-relevant sections are supported or remaining searches repeatedly reproduce the same evidence; do not browse merely to make the source list longer.

Use only public or legitimately accessible information. Do not bypass access controls, acquire leaked data, infer protected or sensitive personal traits, or assemble irrelevant personal details. Route sanctions, legal, financial, security, or reputational concerns to qualified human review rather than issuing a definitive clearance judgment.

## Separate evidence from interpretation

Classify every material statement:

~~~text
verified_fact      directly supported by suitable evidence
company_claim      asserted by the organization but not independently established
third_party_report attributed to an external source and bounded by its method
inference          reasoned interpretation from cited observations
hypothesis         plausible explanation requiring client validation
unresolved         material conflict or missing evidence
~~~

Attach sources to factual claims near the claim and preserve a source ledger for auditability. Give each material inference its supporting observations and an alternative explanation where one is plausible. Use calibrated language such as “suggests,” “appears,” and “may” instead of presenting an inference as fact.

Never fabricate company size, revenue, ownership, customers, market share, technology, budget, urgency, decision authority, or intent. Record `not_found` when suitable evidence is unavailable. Keep contradictory evidence visible and explain whether the likely cause is timing, scope, naming, source quality, or a genuinely unresolved conflict.

Assign `high`, `medium`, `low`, or `indeterminate` confidence to decision-relevant findings based on directness, source fitness, independence, consistency, recency, and identity certainty. A polished narrative does not raise confidence.

## Interpret the commercial situation

Build only the analysis the available evidence supports:

- Explain the organization's offer, audiences, business or operating model, footprint, maturity signals, and public positioning.
- Identify direct, indirect, internal, or non-consumption alternatives only when relevant to the request; label the choice set provisional without customer evidence.
- Separate the client's explicit request from hypotheses about the underlying trigger, desired outcome, urgency, stakeholders, and constraints.
- Connect possible LAB engagement areas to observed needs or stated requests, not generic service capabilities.
- State dependencies, delivery risks, conflicts, and assumptions that could change qualification or scope.

Do not turn an ordinary brief into full due diligence, competitive analysis, market sizing, or customer discovery. Recommend a deeper method when that work is decision-critical and outside the evidence available here.

## Convert gaps into discovery questions

Generate a short, prioritized set of questions that public research cannot answer reliably. Favor questions about:

1. desired outcome and success measure;
2. trigger and timing;
3. users, buyers, approvers, and decision process;
4. current approach and consequences;
5. constraints, dependencies, budget ownership, and evidence access;
6. contradictions or assumptions that could materially change the engagement.

For each question, state why it matters or which hypothesis it tests. Omit questions already answered credibly by the intake or public evidence.

## Deliver `client-brief.md`

Adapt section depth to the decision, but preserve this minimum structure:

~~~markdown
# Client Brief: [Client]

## Brief status
- Resolved organization:
- Decision context:
- Research cutoff:
- Overall confidence:
- Critical uncertainties:

## Executive summary

## Request context
### What the client stated
### Interpretation and hypotheses

## Identity and organization

## Offer and operating model

## Market position and alternatives

## Relevant signals and developments

## Implications for LAB
### Potential engagement areas
### Risks, dependencies, and assumptions

## Recommended discovery questions

## Evidence ledger
| ID | Claim | Classification | Source | Source date | Confidence | Limitation |
| --- | --- | --- | --- | --- | --- | --- |

## Sources
~~~

Keep the executive summary concise and decision-oriented. Link sources directly where the output format permits. Do not hide uncertainty in footnotes or the source list.

End with one status:

| Status | Controlling condition |
| --- | --- |
| `ready_for_outreach` | Identity and request context are sufficiently clear for the stated decision |
| `ready_with_questions` | The brief is useful, but named discovery questions remain material |
| `identity_ambiguous` | The organization or requester's relationship cannot be resolved safely |
| `evidence_insufficient` | Public and supplied evidence cannot support a meaningful brief |
| `risk_review_required` | A material concern requires qualified human review before proceeding |

State which evidence and uncertainty control the status, and identify the next human action.
