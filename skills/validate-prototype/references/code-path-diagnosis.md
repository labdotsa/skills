# Code-path diagnosis

Use this reference only after a browser-observed failure or blocker has been reproduced and captured.

## Freeze the failing state

Record:

- revision and environment identity;
- journey and step;
- route or screen;
- user role and fixture identity;
- viewport, locale, browser mechanism, and relevant flags;
- starting state, inputs, and action sequence;
- visible symptom and timing;
- console, network, accessibility, and storage signals available without exposing secrets.

Reproduce from a known state before making a source-level claim. If the symptom cannot be reproduced, preserve it as `intermittent` or `unresolved`; do not manufacture a root cause from code reading.

## Trace narrowly

Start from the runtime signal closest to the symptom and follow only the active path:

1. Find the rendered route, screen, or component.
2. Find the user event or lifecycle handler.
3. Trace validation, derived state, store transitions, effects, and guards.
4. Correlate the browser request with the client call and serialized payload.
5. Trace the server route, domain decision, authorization, and integration call when implicated.
6. Inspect persistence, migration, query, or transaction behavior only when runtime evidence crosses that boundary.
7. Trace the returned success or failure through response mapping into the rendered state.

Use logs, stack traces, request identifiers, payload shapes, state transitions, and discriminating code branches to connect the path. Avoid whole-repository audits, speculative history archaeology, or unrelated cleanup opportunities.

Inspect history only when it can answer a bounded question such as whether the failing branch changed in the target revision. Do not assign an introducing commit without supported evidence.

## Classify the cause

- `confirmed`: runtime evidence and the active code path establish a causal mechanism, or a discriminating check rules out credible alternatives.
- `suspected`: the code path plausibly explains the symptom but evidence does not establish causality.
- `unresolved`: the symptom is reproduced but the responsible mechanism remains unknown.
- `not-applicable`: use for environment issues, human-only hypotheses, or coverage gaps without a code cause.

Keep the browser defect and its diagnosis distinct. A confirmed browser defect does not become invalid because its root cause is unresolved.

A source concern without a browser-observed consequence is not a confirmed validation defect. Record it only when it explains a coverage limitation or when the user separately requested source review.

## Confirm through behavior

Define a retest condition in externally observable terms. After an authorized fix is available, replay:

1. the exact failed reproduction;
2. the nearest risk-adjacent case affected by the cause;
3. the critical smoke journey.

Do not certify a fix from the diff or a unit test alone.
