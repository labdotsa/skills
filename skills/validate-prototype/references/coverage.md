# Risk-triggered coverage

Use this reference after the primary critical journey is runnable.

## Start small

Begin with:

- one to three must-work journeys;
- one primary user role;
- one primary browser mechanism;
- one representative viewport;
- one representative locale;
- the happy path plus the changed or highest-risk state.

Do not expand a dimension merely because it exists in the product.

## Expansion triggers

| Observed change or risk | Add proportionate coverage |
| --- | --- |
| layout, navigation, overlay, or responsive CSS | smallest supported mobile and representative desktop; overflow, focus, and resize state |
| copy, localization, formatting, direction, or typography | long content, another relevant locale, RTL when supported |
| authentication, authorization, tenancy, or permissions | affected roles, forbidden path, expiry or reauthentication |
| form, validation, upload, or submission | invalid, boundary, interrupted, duplicate, retry, and success feedback states |
| API, database, queue, webhook, or external integration | loading, timeout, safe error, retry, idempotency, and recovery |
| caching, state, routing, or persistence | reload, back/forward navigation, stale state, resume, and conflict |
| keyboard, semantics, motion, focus, or dynamic content | keyboard path, focus order and visibility, accessible name/state, reduced motion, revealed-state scan |
| browser-specific API or prior browser regression | one additional affected browser/project |
| theme or visual-token change | affected themes and controlled visual comparison |
| high-severity defect | exact clean-state replay plus nearest independent adjacent risk |

Tie each added cell to a named trigger in the run contract or report.

## Representative sampling

For large inventories, group equivalent routes or states by shared implementation, user consequence, and integration path. Validate the highest-risk representative from each relevant group. Add a small random sample only when it can detect incorrect grouping or undiscovered shared behavior.

Never describe unexecuted members of a representative group as passing. State what was sampled and what inference, if any, remains.

## Stop expansion

Stop when:

- every must-work journey and triggered dimension has a recorded outcome;
- a confirmed blocker makes dependent cells invalid;
- remaining cells are equivalent repetitions without a new risk trigger;
- the capability or environment makes further evidence invalid;
- continuing would exceed the user's authority or create unsafe side effects.
