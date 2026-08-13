# Handoff and claim contract

This contract applies only when a native method artifact enters the product-opportunity assessment. It does not prescribe the internal shape of the method artifact.

## Handoff wrapper

Keep the native artifact intact. Add a sidecar record:

~~~yaml
handoff_id: HND-NNN
method:
native_artifact:
native_artifact_type:
version:
status: draft | method_complete | gate_usable | stale | superseded
created_at:
evidence_cutoff:
decision_scope:
question_answered:
question_not_answered:
material_findings:
material_claim_ids:
assumptions:
unknowns:
confidence:
depends_on:
used_by:
supersedes:
method_validation:
gate_consequence:
~~~

### Handoff rules

- **method_complete** means the method's own completion criteria pass.
- **gate_usable** means the artifact also fits the gate's scope and minimum evidence.
- A method-complete artifact can remain unusable for a gate because its population, date, option, or inference differs.
- A new upstream version marks dependent handoffs **stale** until their conclusion is recomputed.
- Preserve native artifact files and prior wrappers; never flatten them into one generic report.

## Claim record

~~~yaml
claim_id: CLM-NNN
statement:
classification: fact | estimate | observation | inference | hypothesis | assumption | forecast | decision
source_or_native_record:
publication_or_observation_date:
access_date:
geography:
segment:
unit_and_measurement_definition:
method:
confidence: high | medium | low | indeterminate
limitations:
conflicting_claim_ids:
used_by:
~~~

## Evidence behavior

Commercial behavior often strengthens through:

~~~text
opinion
< reported past event
< observed behavior
< operational data or workflow access
< signed commitment
< payment
< repeated use
< renewal
~~~

This is an ordinal prompt, not a numeric scale. Context, selection, validity, and method fitness can reverse the apparent strength.

## Gate-usable handoff check

A handoff is gate-usable only when:

1. the native artifact passes its own method checks;
2. every material finding links to current claims or records;
3. scope, unit, definitions, option, and evidence cutoff match the gate;
4. contradictions and missing evidence remain visible;
5. assumptions are not promoted into facts;
6. downstream dependencies are declared;
7. the exact gate consequence is stated.
