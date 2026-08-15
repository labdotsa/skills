# Pricing Evidence Report template

Use this template when a pricing-research result enters the product-opportunity assessment as a native handoff.

## Decision and scope

~~~yaml
decision:
decision_owner:
segment:
payer:
offer_and_package:
alternatives:
geography:
currency_tax_contract:
decision_threshold:
evidence_cutoff:
~~~

## Economic frame

Record evidence for the current alternative and spend, value created, value distribution, competitive references, cost floor, and commercial or regulatory constraints. Keep economic value, perceived value, budget, competitive reference, and viable price floor separate.

## Method and design

~~~yaml
method:
research_question:
population_and_sample:
instrument:
price_points_and_assignment:
analysis_model:
acceptable_range_definition:
response_validation:
uncertainty_method:
subgroups:
exclusions:
behavioral_follow_up:
~~~

For Van Westendorp, attach the respondent-level input, analyzer output, curve data, exclusion diagnostics, range convention, and any bootstrap settings. The four price questions and calculation rules are defined in [van-westendorp.md](van-westendorp.md).

## Results

Report the price range, PMC, PME, IDP, OPP, narrower-range points when calculated, uncertainty, sample denominator, exclusions, and any non-zero intersection gaps. Include the curves or a reproducible link to them.

## Evidence reconciliation

| Price or structure hypothesis | Economic value | Stated research | Revealed behavior | Unit economics | Decision |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Investigate disagreements instead of averaging them. State whether behavior is depressed by trust, product immaturity, channel friction, or unequal terms, and whether stated acceptance is likely inflated by low consequence.

## Handoff

~~~yaml
status: price_decision_supported | directional_range_only | method_mismatch | insufficient_behavioral_evidence
question_answered:
question_not_answered:
material_claim_ids:
assumptions:
unknowns:
confidence:
depends_on:
used_by:
gate_consequence:
recommended_experiment_or_decision:
monitoring_and_invalidators:
~~~

Van Westendorp evidence normally supports `directional_range_only` unless the stated decision is explicitly limited to perceived price acceptance. Do not issue a consequential willingness or revenue decision without behavioral calibration.
