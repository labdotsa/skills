# Verification protocol

Use this protocol after a visual-system change or before making a quality claim. Begin with the changed user intent and rendered surface; source and automated checks support that evidence but do not replace it.

## Freeze the comparison

Record:

- target route or surface and revision;
- primary intent and behavior invariants;
- changed components or roles;
- baseline evidence when available;
- primary viewport, theme, locale, and direction;
- risk-triggered dimensions and known unavailable evidence.

Do not combine observations from different revisions or silently replace a baseline after a failure.

## Verify in layers

### 1. Behavior invariants

Exercise the primary journey through the changed surface. Confirm labels, controls, navigation, validation, submission, focus movement, data display, and analytics/test hooks affected by source changes. A visual refactor is not successful if it obscures or changes behavior.

### 2. Visual thesis

Test the declared change thesis rather than asking whether the result merely “looks better.” Confirm:

- page purpose and primary action are identifiable;
- related items group together and distinct sections separate;
- repeated components share roles and states;
- alignment and measures create stable scanning paths;
- decorative treatment has a communicative job;
- the result still belongs to the product.

Compare at equivalent content, state, viewport, theme, and rendering conditions. Treat image-diff noise separately from meaningful composition changes.

### 3. Pressure conditions

Start with one representative configuration, then expand only when the change creates risk.

| Change touches | Add these checks |
| --- | --- |
| layout, width, grid, navigation | narrowest supported width, transition pressure, wide width, zoom/reflow, overflow |
| typography, labels, content measure | long strings, increased text size, heading order, truncation recovery |
| colors, surfaces, borders, elevation | every supported theme, computed contrast pairs, focus and disabled states, text over media |
| shared primitive or token | representative consumers plus at least one known exception |
| forms or actions | keyboard path, focus-visible, validation, loading, disabled, success, submission failure |
| direction or localization | real locale state, LTR/RTL geometry, directional icons, mixed content, long translations |
| motion or disclosure | reduced motion, interruption, repeated activation, focus retention |
| data collections | empty, one, many, long values, sorting/filter state, comparison and overflow |

Use the repository's existing browser, component, visual, accessibility, type, and build checks when relevant. Do not install a new test stack solely for this refactor.

### 4. Accessibility support

Check applicable semantics, labels, heading order, keyboard reachability, visible focus, state communication, target usability, zoom/reflow, reduced motion, and computed contrast. Use automated scanners as defect detectors.

Never convert a clean scanner result, a few contrast pairs, or keyboard spot checks into a claim of complete accessibility or WCAG conformance. Report assistive-technology and human-evaluation gaps explicitly.

## Record evidence honestly

Classify each relevant condition as:

- **passed:** directly exercised with the expected rendered result;
- **failed:** directly exercised with a reproducible mismatch;
- **untested:** relevant but unavailable or outside the authorized scope;
- **not applicable:** supported by a stated reason.

For a failure, preserve the route, state, viewport, theme, locale/direction, reproduction, expected relationship, actual result, user consequence, and evidence location. Do not approve a failed visual baseline merely because the new output was intentional; first confirm that it matches the refactor contract.

## Completion gate

Finish when:

1. primary behavior invariants still pass;
2. the declared visual thesis is observable in the rendered interface;
3. every risk-triggered condition is passed, failed, or explicitly untested;
4. shared-role changes have representative consumer evidence;
5. no release-blocking content loss, state ambiguity, focus loss, or overflow remains;
6. the final report distinguishes verified outcomes from judgment and remaining risk.

Build success alone is readiness evidence, not completion evidence.
