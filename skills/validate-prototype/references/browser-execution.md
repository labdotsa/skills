# Browser execution

Use this reference to select and operate the required browser mechanism.

## Routing

1. Discover repository instructions and existing browser commands without changing dependencies.
2. Prefer repository-native Playwright when its configuration, fixtures, accounts, and target are usable.
3. Fall back to the built-in interactive browser when Playwright is absent, broken outside the granted scope, or unsuitable for exploratory work.
4. If both are usable, assign repeatable assertions to Playwright. Add one built-in-browser exploration only when it can reveal evidence not already covered.
5. If neither can operate the rendered target, stop as `blocked`.

Other automated tests, screenshots, DOM dumps, static HTML, component previews, source review, or HTTP calls can support readiness and diagnosis. They cannot replace the browser gate.

## Playwright behavior

- Run project-defined commands and configurations. Do not invent a parallel harness.
- Use user-facing locators such as roles, labels, and visible text.
- Isolate state with existing fixtures or contexts. Do not share mutable accounts across parallel scenarios.
- Start with a critical smoke journey before running broader suites.
- Use configured traces, videos, screenshots, console capture, network capture, accessibility scans, and semantic snapshots proportionately.
- Preserve the project's controlled visual environment. Never update a baseline to make validation pass.
- Do not install packages or browser binaries during validation.

## Built-in browser behavior

- Record the target URL, browser identity when available, viewport, role, locale, fixture, and preconditions.
- Navigate and interact through the visible UI rather than directly mutating application state.
- Capture the visible result after each decision-changing action.
- Record console and network evidence when the tool exposes it. Mark those channels unavailable rather than inferring them when it does not.
- Restart from a known state for reproductions. Do not rely on unexplained residual cookies, storage, or navigation history.

## Evidence budget

For a pass, record the scenario, revision, configuration, final observable outcome, and one compact proof when useful.

For a failure or blocker, record:

- minimal step sequence and state preconditions;
- before/after visible state or screenshot;
- console exception and stack when available;
- failed request, status, and safely redacted response when available;
- semantic or accessibility state when relevant;
- trace only when it helps reproduce or diagnose the failure.

Never persist credentials, tokens, secret headers, full authenticated storage state, personal data, or production records in evidence.
