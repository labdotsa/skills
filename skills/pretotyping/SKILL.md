---
name: pretotyping
description: Tests whether a target market will take consequential action before a product is built by creating the smallest ethical simulation of the value proposition. Use for fake-door, concierge, Wizard-of-Oz, infiltrator, provincial, or other demand pretotypes with precommitted thresholds.
metadata:
  author: labdotsa
  category: product
---

# Pretotyping

Answer **Should we build this?** before **Can we build this?** Seek market behavior with skin in the game, using the smallest believable representation of the promised value.

## Convert the idea into a numeric market hypothesis

Write:

~~~text
Market Engagement Hypothesis:
[specific market] will [specific observable engagement]
with [specific offer] because [value mechanism].

XYZ Hypothesis:
At least X% of Y exposed eligible prospects
will do Z within T,
under conditions C.
~~~

Define:

- eligibility and exposure;
- numerator behavior and denominator;
- time window;
- offer, price, friction, and disclosure;
- threshold, stop line, and next decision.

Clicks, compliments, and contact details count only when they are the predeclared scarce behavior. Prefer money, time, data, access, reputation, workflow change, or repeated use when proportionate.

## Choose the pretotype mechanism

Select by the uncertainty—not by novelty:

| Technique | Simulates | Best used when | Main distortion |
| --- | --- | --- | --- |
| Fake door | Availability before fulfillment | Test whether people attempt access or purchase | Curiosity may exceed real demand |
| Concierge | Service delivered manually | Test end-to-end value and willingness to engage | High-touch service may inflate value |
| Wizard of Oz / Mechanical Turk | Automation performed by humans | Test interaction and outcome before technology | Participants may assume scalable automation |
| Pinocchio | Non-functional form/experience | Test context, use ritual, or desirability | Weak behavioral consequence |
| Infiltrator | Offer placed in an existing channel | Test choice in a realistic environment | Channel effects may dominate |
| Provincial | Narrow real deployment | Test one segment, site, or use case | Local success may not generalize |
| One-night stand | Temporary real service | Test time-bound demand or operations | Event novelty may inflate engagement |

Use the least product needed to reproduce the decision the market would face.

## Design the minimum believable reality

Create the Pretotype Spec:

~~~yaml
target_population:
recruitment_or_traffic_source:
offer_and_price:
experience_shown:
manual_or_fake_components:
truthful_disclosure:
value_actually_delivered:
participant_commitment:
data_collected:
duration:
capacity_limit:
refund_or_recovery:
ethical_legal_safety_controls:
~~~

Preserve the economically important friction. A free concierge test cannot validate a paid self-serve offer without an explicit inference boundary.

Disclose enough that consent is meaningful. Never fabricate customer evidence, hide charges, expose private data, create unsafe reliance, or claim a nonexistent capability. Use staged or synthetic environments for high-risk domains.

## Pre-register the decision

Before exposure, freeze:

| Item | Required value |
| --- | --- |
| Primary metric | One decision-controlling behavior |
| Baseline | Current observed rate or unknown |
| Sample/exposures | Fixed denominator or stop rule |
| Pass line | Result that advances |
| Gray zone | Result that repeats or narrows |
| Stop line | Result that contradicts |
| Guardrails | Ethics, safety, complaints, refunds, quality |
| Decision consequence | What may be funded next—and what remains unauthorized |

Include diagnostic measures, but keep them from replacing the primary metric after results appear.

## Run an exposure ledger

Record every eligible exposure:

| ID | Eligibility | Offer/version | Source | Behavior | Time | Commitment | Drop-off/refusal | Exception |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Keep denominator integrity:

- do not replace refusals;
- do not stop immediately after enough successes unless the rule allows it;
- version material offer changes;
- separate organic, paid, friendly, and partner traffic;
- retain failure and complaint records.

## Read behavior and alternative explanations

Apply the frozen rule, then test:

1. Did the participant value the intended outcome or the novelty/high-touch service?
2. Did the observed segment and channel match the hypothesis?
3. Did payment occur, clear, repeat, or get refunded?
4. Could the manual implementation deliver the promised value?
5. Did any guardrail invalidate the result?

Issue:

~~~text
advance_to_next_assumption
repeat_under_same_protocol
narrow_segment_or_offer
revise_mechanism
stop_concept
invalid_experiment
~~~

A pass authorizes the next learning investment, never the full product by itself.

## Deliver the Behavioral Experiment Record

Deliver the numeric hypothesis, technique rationale, Pretotype Spec, pre-registration, exposure ledger, result, guardrails, alternative explanations, and decision.

The record passes when the behavior was consequential and counted exactly as declared, the simulated experience preserves the key choice, ethical boundaries are intact, and the result produces the precommitted action.

Foundations: [Alberto Savoia](https://www.albertosavoia.com/) and the [Pretotyping Manifesto](https://pretotyping.ch/).
