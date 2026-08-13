# Accessibility, performance, and interaction quality contract

## Status

Accepted planning contract for Wayfinder decision [#12](https://github.com/labdotsa/skills/issues/12).

This document defines the proof required before the SvelteKit Discovery Site can replace the legacy implementation. It is a release contract, not a claim that the current legacy site already passes every gate.

## Outcomes

The rebuilt site must:

- conform to WCAG 2.2 Level AA across its public routes and supported states;
- preserve the approved interaction contract with or without a mouse, with reduced motion, and at narrow or zoomed layouts;
- render useful, navigable content before hydration and remain readable when JavaScript is unavailable;
- apply the selected theme before first paint without a hydration mismatch or a storage failure;
- stay within explicit JavaScript, CSS, font, and Core Web Vitals budgets;
- prove shared component behavior once and route composition at representative vertical slices;
- produce equivalent quality evidence for the canonical root profile and the GitHub project-base profile.

Automated checks reduce risk but do not prove WCAG conformance. The release therefore requires both automated and recorded manual evidence.

## Normative language

`MUST`, `MUST NOT`, `SHOULD`, and `MAY` are used normatively. WCAG requirements are identified separately from stricter LAB project policy so a project budget is never represented as a web standard.

## Test surfaces

### Every generated public route

Every canonical route, catalog-derived detail route, legacy alias, machine endpoint, and `404.html` MUST pass the static-output checks that apply to its media type:

- file exists in both publication profiles;
- internal URLs resolve under the active base path;
- HTML has one descriptive `h1`, a valid language, unique title, landmark structure, and no duplicate element IDs;
- interactive elements have an accessible name and native or correct ARIA semantics;
- local scripts, styles, fonts, and images resolve with the expected MIME type;
- no private path, runtime CDN, mixed-content URL, or provider-specific application branch appears;
- canonical, robots, sitemap, and machine-surface behavior matches the SEO, LLM, and hosting contracts.

### Representative browser routes

The full browser matrix runs against these deterministic page classes:

1. home and Skill directory;
2. the generated Skill detail with the largest rendered document;
3. Recipe index;
4. the generated Recipe detail with the largest rendered document;
5. the explicit static 404 page.

"Largest" is selected from the build-scoped Catalog snapshot by rendered text length, with ID as the stable tie-breaker. This prevents the suite from silently keeping an easy fixture as content grows. Legacy `.html` aliases receive navigation, metadata, and target-equivalence checks; they do not duplicate the complete canonical-route suite.

### Required states

The representative routes collectively cover:

- first load, client navigation, reload, and direct deep link;
- default, focus-visible, hover where available, disabled, empty, loading, success, and error states that the product exposes;
- all-content and filtered directory states;
- closed and open Sheet/Collapsible states;
- Tabs selection and keyboard movement;
- copy success, copy denial/unavailability, live announcement, and reset;
- system, light, dark, invalid, unavailable, and throwing theme-storage states;
- reduced and no-preference motion;
- JavaScript enabled and disabled.

## Accessibility gates

### Semantic and compile-time gate

`svelte-check --fail-on-warnings` MUST pass. Svelte compiler accessibility warnings MUST NOT be suppressed globally. A local suppression requires the same evidence and expiry as any other exception below.

Generated HTML MUST pass a standards-based HTML validator. The validator is supplemented—not replaced—by assertions for heading order, landmarks, unique IDs, form labels, link destinations, button types, image alternatives, table structure where present, and valid ARIA relationships.

### Automated accessibility gate

Playwright MUST run the lockfile-pinned `@axe-core/playwright` on each representative route and required interactive state. The planning baseline is `4.13.0`, using `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa` tags. There MUST be zero serious or critical violations and zero unsuppressed A/AA violations of any impact. Every `incomplete` result is manually adjudicated and recorded; it cannot be silently discarded. Best-practice findings are reported and triaged but do not become WCAG claims.

Rules MUST be scoped to the full document. Components that appear only after opening or interaction are scanned in that state. A scan of an idle home page is insufficient.

### Keyboard gate

Every journey MUST be completable with keyboard alone. Tests and manual review prove:

- the first repeated-content bypass link becomes visible on focus and moves focus to the main region;
- `Tab` and `Shift+Tab` follow reading order and never enter hidden content;
- visible focus is never fully obscured and has at least 3:1 contrast against adjacent colors;
- `Enter`, `Space`, arrow keys, `Home`, `End`, and `Escape` follow native behavior or the WAI-ARIA Authoring Practices pattern for the relevant widget;
- a modal Sheet contains focus while open, closes with `Escape`, and restores focus to its trigger;
- Tabs, Collapsible, Tooltip, and menu/navigation compositions expose correct names, states, and relationships;
- `/` focuses search only when focus is not already in an editable control or IME composition. Because it is a single-character shortcut, the site MUST provide a visible way to turn off the shortcut; otherwise the implementation MUST use a modifier shortcut. It never inserts or steals input unexpectedly;
- clearing search returns focus to the search field;
- no keyboard trap exists.

LAB policy gives focus indicators a solid outline or ring at least 2 CSS pixels thick, normally with a 2-pixel offset, while retaining the contrast and non-obscuring requirements above. The dimensions are a project policy, not a claim about the WCAG AA minimum.

### Screen-reader gate

Before cutover—and after any later semantic primitive or navigation change—the complete representative journeys MUST be manually tested with:

- VoiceOver with the current Safari on a supported macOS release; and
- NVDA with the current Firefox or Chrome on a supported Windows release.

The evidence records date, OS, browser, assistive-technology version, tester, route/profile, journey, expected announcement, actual result, and issue link for any failure. It verifies landmarks and heading navigation, page titles, link purpose, form names/descriptions, current navigation, search result counts, Tabs, Sheet focus, Collapsible state, copy status, error status, code/install content, and the 404 recovery path.

### Contrast, resize, target, and reflow gate

The rebuilt site MUST satisfy these WCAG 2.2 AA boundaries:

- normal text contrast is at least 4.5:1; large text is at least 3:1;
- meaningful non-text boundaries, states, and focus indicators are at least 3:1;
- content remains usable at 200% text resize;
- at a 320 CSS-pixel viewport, or the equivalent 400% zoom check, content reflows without two-dimensional page scrolling except for content covered by the WCAG reflow exceptions;
- pointer targets meet the WCAG 2.2 AA 24 by 24 CSS-pixel minimum or a documented criterion exception.

The WCAG text-spacing test injects line height `1.5`, paragraph spacing `2em`, letter spacing `0.12em`, and word spacing `0.16em`; no content or functionality may be clipped, overlap, or disappear.

LAB project policy is stricter for primary icon-only controls: they SHOULD expose at least a 44 by 44 CSS-pixel hit area on coarse pointers. This 44-pixel policy is not presented as a WCAG AA requirement.

The full token matrix MUST be checked in light, dark, forced-colors, focus, selected, muted, error, and disabled states. Information MUST NOT depend on color alone.

### Status and content gate

Search counts, empty results, copy success/failure, and other non-focus-changing outcomes MUST use an appropriate live status without repeating announcements. Errors MUST identify the affected operation and recovery. Icon-only buttons MUST have contextual accessible names; decorative Lucide icons MUST be hidden from the accessibility tree.

Rich Skill and Recipe content MUST retain meaningful headings, lists, links, quotations, inline code, and code-block names through the typed renderer. Generated visual structure cannot flatten the accessible document outline.

## Interaction and resilience gates

### Reduced motion

With `prefers-reduced-motion: reduce`:

- non-essential spatial movement, smooth scrolling, parallax, looping decoration, and delayed entrance effects are removed;
- state changes remain immediately understandable without animation;
- busy/copy/theme feedback retains a static equivalent;
- no essential information, focus change, or completion signal is lost.

The normal-motion project verifies that any retained motion uses named design tokens and does not block input. The reduced-motion project verifies behavior, not only the computed media query.

### Theme stability

The theme service MUST pass this matrix before hydration and after navigation:

| Stored value | OS preference | Expected first paint and state |
| --- | --- | --- |
| absent | light | light |
| absent | dark | dark |
| `light` | either | light |
| `dark` | either | dark |
| invalid | light or dark | matching system value; invalid value is ignored |
| read throws | light or dark | matching system value; page remains operational |
| write throws | either | selected theme applies for the session without crashing |

Automated tests MUST inspect the first rendered frame for the correct `data-theme`, console hydration errors, and a theme-color mismatch. They also cover reload, client navigation, system-preference change when no explicit choice exists, and cross-tab storage synchronization. The no-JavaScript document MUST remain readable in the CSS/system fallback theme.

### Responsive and overflow

The pinned visual projects remain 1280 by 720 and 390 by 844. Functional checks additionally run at 366 CSS pixels and the 320 CSS-pixel reflow boundary. Every representative route and open/filtered/error state asserts:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Long unbroken names, URLs, install commands, fenced code, long headings, and local/remote badges are included. Code regions MAY scroll on their own; the page MUST NOT gain horizontal overflow. A manual 400% zoom pass checks sticky headers, focused controls, dialogs/sheets, and fixed feedback that an automated width assertion cannot prove.

### No-JavaScript and hydration

Every public route MUST return its primary heading, description, catalog/detail content, install text, navigation links, canonical metadata, and recovery links in prerendered HTML. Disabling JavaScript MUST NOT turn a route into an empty shell or hide source content. Directory filtering MAY degrade to showing all entries. Clipboard, theme choice, and client-side filtering MAY require JavaScript, but equivalent content and navigation remain available.

Hydration MUST NOT fetch a second copy of the Catalog or replace server-rendered content. Playwright fails on hydration warnings, uncaught page errors, failed local asset requests, and unexpected console errors.

In the pinned, unthrottled Chromium runner, the interval from `DOMContentLoaded` to the root hydration-ready marker MUST be at most 500 milliseconds, with no hydration task longer than 100 milliseconds. The timing project runs serially so concurrent browser engines cannot throttle one another, and its long-task window is bounded to `DOMContentLoaded` through the hydration-ready mark. Search, tab, Sheet, disclosure, theme, and copy-busy actions MUST acknowledge input visibly within 200 milliseconds in the same runner. These are deterministic LAB regression budgets, not field INP measurements.

### Shared component behavior

Locally owned primitives are tested through their public Svelte APIs. At minimum, Button, Input, Tabs, Sheet, Collapsible, Breadcrumb, Separator, Sonner, and Tooltip prove applicable keyboard behavior, focus, names/relationships, disabled state, snippets, event/callback forwarding, attributes, and class merging. Shared CopyButton, ThemeToggle, search/filter controls, result status, navigation, and rich-content components prove product behavior once.

Feature and route tests then prove composition and data flow. They MUST NOT duplicate primitive internals or assert private classes. A regression fixed in a reusable component receives a component-level test plus the smallest vertical route test that would have caught the user-visible failure.

## Performance and asset gates

### Project transfer budgets

The following are LAB release budgets, not standards. Values are measured from a clean production build with source maps excluded and compression reported as gzip bytes:

| Resource | Maximum initial transfer per representative route |
| --- | ---: |
| JavaScript, all initial chunks | 120 KiB gzip and 375 KiB raw |
| CSS, all initial stylesheets | 35 KiB gzip |
| Fonts loaded before or during the initial route | 300 KiB WOFF2 transferred |
| Initially rendered images and logo | 100 KiB transferred |
| Total cold-route transfer | 500 KiB transferred |
| Initial requests | 30 |

Both root and project-base artifacts MUST pass. A shared chunk is counted once per cold route load. Lazy resources are reported separately and MUST be attached to the interaction that needs them. The test follows redirects and uses browser request records plus built-file sizes, so duplicated chunks or fonts cannot disappear from the report.

No route MAY load runtime presentation assets from a CDN or third-party origin. All application scripts, styles, fonts, brand assets, and Lucide SVG output are locally bundled. Local resources MUST return success, correct MIME types, immutable hashed names where generated, and appropriate caching headers where the host permits them. Images have intrinsic dimensions or an equivalent stable aspect ratio. Font preloads are allowed only when the font is used above the fold and measurement proves the preload beneficial.

### Lab Core Web Vitals gate

The existing technical SEO budgets remain authoritative. Lighthouse runs three times with the pinned mobile configuration for home, largest Skill detail, Recipe index, largest Recipe detail, and 404. The median run MUST satisfy:

- Performance score at least 0.90;
- Accessibility score 1.00;
- SEO score at least 0.90 for canonical indexable routes; the intentional non-indexable 404 and `noindex` backup profiles record the score without applying this indexability-only threshold;
- Best Practices score at least 0.95;
- LCP at most 2.5 seconds;
- CLS at most 0.1;
- TBT at most 350 milliseconds as the project regression ceiling. Chrome's 200-millisecond fast target remains the optimization goal; the release ceiling is calibrated above the measured 200–320-millisecond SvelteKit detail-page baseline so shared-runner variance does not turn an unchanged application into a false failure.

TBT is a lab responsiveness proxy and MUST NOT be reported as INP. Release evidence separately records field Core Web Vitals when eligible traffic exists: mobile and desktop p75 LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1 over the available 28-day field window. Field data is authoritative for a Core Web Vitals assessment; a new deployment without sufficient field data is marked unavailable, not failed or invented.

The lab gate is run on production assets served by the same static server configuration used for QA. CI hardware variance MAY trigger one infrastructure rerun of the complete three-run set. Teams MUST NOT cherry-pick a favorable run or average away a regression.

## Browser, visual, and host matrix

### Pull-request blocking matrix

| Gate | Root profile | Project-base profile | Browser/state |
| --- | --- | --- | --- |
| Build, static crawl, links, assets, metadata | yes | yes | generated files |
| Unit and component behavior | yes | source-equivalent | DOM/browser runner |
| Full interaction and axe journeys | yes | yes | pinned Chromium desktop and mobile |
| Critical navigation, keyboard, focus, and hydration smoke | yes | yes | current Playwright Firefox and WebKit desktop |
| Screenshots | yes | yes | pinned Chromium, light/dark, desktop/mobile |
| Reduced motion and 320-pixel overflow | yes | yes | pinned Chromium |
| Lighthouse and transfer budgets | yes | yes | pinned Chromium/mobile lab profile |
| No-JavaScript content/navigation | yes | yes | pinned Chromium |

The exact browser and operating-system versions are stored with the CI artifact. A dependency/browser update refreshes the environment deliberately; it does not silently rewrite baselines.

### Visual regression

The existing capture journeys become Playwright `toHaveScreenshot` assertions. Baselines use pinned Chromium, deterministic local fonts and data, reduced motion, hidden caret, and settled font loading. Required views are the representative route classes in light and dark at 1280 by 720 and 390 by 844, plus open Sheet and meaningful empty/error states.

Pixel differences fail at `maxDiffPixelRatio: 0.005`. A baseline update requires a human-visible image diff and an explanation in the change. The baseline command MUST NOT run automatically in validation.

## CI commands and evidence

The SvelteKit foundation MUST expose stable scripts for these independently runnable gates:

```text
typecheck             Svelte/type/compiler warnings
test                  domain and unit tests
test:component        primitive and shared-component behavior
test:e2e              representative interaction matrix
test:a11y             axe state matrix
test:visual           pinned screenshot comparison
test:static           both-profile crawl, URL, asset, and no-leak checks
test:performance      transfer budgets and three-run Lighthouse medians
validate:automated    repository validation plus every deterministic blocking gate above
validate              automated validation plus the human release-evidence ledger
```

Names MAY be implemented as npm scripts or thin repository scripts. CI runs `npm run validate:automated`; `npm run validate` remains the single release-completion command and additionally verifies current human evidence. CI publishes, for both profiles:

- route/static-crawl and asset manifests;
- axe and HTML validation reports;
- Playwright traces/screenshots on failure;
- reviewed visual diffs;
- resource budget tables and Lighthouse reports;
- browser/tool versions;
- the manual keyboard, zoom, forced-colors, and screen-reader release checklist.

The cutover commit cannot pass by skipping a missing script. Until the foundation introduces a listed command, its absence is an explicit implementation blocker.

## Failure, exception, and regression policy

Deterministic failures block immediately. There is no blanket axe-rule disable, browser-project skip, screenshot regeneration, or performance retry used to make a change green.

A proven tool false positive is suppressed only at the narrowest rule/route/state and records:

- the observed result and why it is false;
- a manual or independent test proving the intended requirement;
- owner, tracking issue, tool version, and expiry date no later than 30 days;
- removal criteria.

An actual WCAG A/AA failure cannot be waived for release. A temporary project-budget exception MAY be approved for at most 14 days when it includes measured impact, owner, expiry, remediation issue, and an unchanged user-accessibility result. No exception may authorize a second source, a runtime CDN, an empty prerendered shell, or a profile-specific frontend.

Every escaped regression adds the lowest-level automated test that reproduces it and, where applicable, a representative route assertion. Manual evidence is repeated when the defect involved assistive technology, zoom/reflow, forced colors, first-paint theme, or motion perception.

## Vertical TDD implementation order

Each implementation ticket follows red-green-refactor against a user-visible slice:

1. add the smallest failing domain/component/static/browser assertion;
2. implement through `ui -> shared -> site -> route` ownership without bypass markup;
3. make the target slice pass in both publication profiles;
4. run its axe, keyboard, overflow, theme/motion, asset, and size assertions;
5. refactor only while public behavior remains green;
6. run the cumulative `npm run validate` gate and attach evidence.

The parity harness remains the starting regression oracle. These gates extend it; they do not replace the approved prototype, content, URL, SEO, LLM, design-system, or atomic-cutover contracts.

## Downstream ownership

- SvelteKit foundation/cutover owns scripts, pinned tool versions, CI jobs, both profile builds, and the static crawler.
- Catalog and content-pipeline work owns deterministic largest-route selection and complete prerendered content.
- Component and feature tickets own primitive/public behavior, keyboard paths, state coverage, and route-level axe scans.
- SEO/LLM tickets own canonical, robots, sitemap, structured-data, and machine-surface assertions.
- Quality ticket #24 owns the cumulative cross-browser, screen-reader, visual, transfer-budget, Lighthouse, and manual release evidence.
- Deployment tickets own provider headers/caching, deployed smoke checks, and profile equivalence.
- Final cutover cannot close until every blocking automated gate and the recorded manual release checklist pass at the same immutable source revision.

## Primary references

- [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Playwright emulation](https://playwright.dev/docs/emulation)
- [axe-core tags and API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axecore-tags)
- [Svelte compiler accessibility warnings](https://svelte.dev/docs/svelte/compiler-warnings)
- [Web Vitals](https://web.dev/articles/vitals)
- [How Core Web Vitals thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [Lab and field data differences](https://web.dev/articles/lab-and-field-data-differences)
- [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)
