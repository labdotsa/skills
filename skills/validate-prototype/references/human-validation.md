# Human validation boundary

Read this reference only when acceptance includes claims that browser automation and agent observation cannot establish.

## Separate claims

Browser evidence can establish whether controls work, state changes render, journeys complete, errors recover, and detectable accessibility rules fail.

Treat the following as human-only or human-confirmed claims:

- representative users understand language, hierarchy, navigation, and next actions;
- users trust the product or consider it desirable;
- cognitive burden and perceived quality are acceptable;
- people using assistive technology can complete the journey in realistic conditions;
- an intentional visual change is aesthetically acceptable;
- ambiguous behavior matches product policy.

Record an agent-observed concern as `ux-hypothesis`, not as a proven user-research finding.

## Create a guide only when needed

When the contract requires a human-only claim, use `assets/human-test-guide.md` and define:

- the research question and decision it informs;
- the relevant participant profile;
- a realistic task that does not reveal the answer;
- the starting state and safe data;
- observable success signals;
- neutral prompts and follow-up questions;
- evidence to record and privacy limits;
- who owns the decision and whether it may be deferred.

Do not create a generic human checklist for every run. A technical browser verdict may be accepted with explicitly deferred human risk unless the acceptance contract makes that evidence mandatory.

## Accessibility boundary

Run automated accessibility checks in meaningful revealed states when supported, and preserve incomplete/manual-review results. Add proportionate keyboard, focus, zoom/reflow, forced-colors, reduced-motion, and screen-reader checks when required by the contract or risk.

Never call an automated scan proof of accessibility or WCAG conformance. Keep missing manual or lived-assistive-technology evidence visible.
