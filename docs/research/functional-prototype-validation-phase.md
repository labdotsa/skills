# Automated validation for functioning prototypes — primary-source research

Date: 2026-08-22

## Executive finding

The evidence supports a **hybrid validation phase**, not a fully autonomous replacement for human testing. Deterministic browser checks can cover repeatable journeys, state transitions, visual diffs, accessibility rules, and evidence capture. Focused agents can inspect separate quality dimensions and synthesize findings. However, official Playwright and W3C guidance says automated accessibility checks find only some problems, while GOV.UK usability guidance requires observation of actual or likely users. Automate broad, repeatable inspection; reserve human judgment for comprehension, trust, aesthetic coherence, usability, and lived assistive-technology experience; then normalize findings into reviewable ticket candidates.

## Browser automation and evidence

- Playwright recommends testing user-visible behavior through user-facing roles, labels, and text rather than implementation details. Its auto-waiting locators suit end-to-end scenarios expressed from the user's point of view. Sources: [Playwright best practices](https://playwright.dev/docs/best-practices), [locators](https://playwright.dev/docs/locators).
- Isolated tests get independent storage, cookies, and state, improving reproducibility and preventing cascading failures. Source: [Playwright best practices](https://playwright.dev/docs/best-practices).
- Trace Viewer exposes actions, DOM snapshots, console and network activity, screenshots, source locations, and visual diffs for debugging failed tests. Source: [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer).
- `toHaveScreenshot()` provides baseline comparison, but rendering changes with operating system, browser/version, hardware, settings, and headless mode; baseline and comparison therefore need a controlled environment. Source: [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots).
- `toMatchAriaSnapshot()` can catch regressions in semantic structure alongside pixel comparison. Source: [Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots).

Inference: every scenario should emit an evidence bundle containing the scenario ID, environment, step log, expected and actual result, screenshots, trace, console errors, failed requests, accessibility output, and candidate affected routes/components. An unsupported observation should not become a ticket automatically.

## Accessibility requires automation and people

- Playwright documents integration with `@axe-core/playwright`, including scans of UI states revealed by interaction and filtering by WCAG-tagged rules. The same page says automation finds only some common problems and recommends automated tests, manual assessment, and inclusive user testing together. Source: [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).
- Axe-core reports that it finds, on average, 57% of WCAG issues automatically and returns `incomplete` results for manual review; hidden or inactive UI must be exposed and scanned again. Sources: [Deque axe-core](https://github.com/dequelabs/axe-core), [axe-core API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md).
- W3C's WCAG-EM shape is: define scope, explore, select a representative sample, evaluate it, and report findings. It recommends structured plus random sampling where exhaustive evaluation is impractical, and involving users with disabilities. Sources: [W3C WCAG-EM](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/), [W3C evaluation overview](https://www.w3.org/WAI/test-evaluate/).

Inference: accessibility needs two outputs: machine-detected violations/incomplete checks, and a human record covering keyboard use, focus order and visibility, zoom/reflow, screen-reader task completion, understandable errors, motion, and user testing with disabled people where proportionate.

## Usability and experience cannot be proven by agents

- GOV.UK defines moderated usability testing as observing participants attempt realistic tasks, often thinking aloud, to understand what they do, think, and feel. It is useful for prototypes and built services and reveals language, layout, and task-completion problems. Source: [GOV.UK moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing).
- Tasks should set clear, believable goals, be capable of revealing problems, and avoid hinting at the answer. Participants should be actual or likely users. Source: [GOV.UK moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing).
- GOV.UK advises 4–8 participants per qualitative round and repeated rounds rather than one oversized round. Source: [GOV.UK planning user research](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service).
- Before a round, the prototype should work end-to-end, be usable and accessible in the research setting, and the task scripts should be rehearsed. Source: [GOV.UK plan a research round](https://www.gov.uk/service-manual/user-research/plan-round-of-user-research).
- Code prototypes are preferred when realistic interaction matters because they behave more like the eventual service across desktop and mobile. Source: [GOV.UK making prototypes](https://www.gov.uk/service-manual/design/making-prototypes).

Inference: agent observations about confusing copy, dead ends, hierarchy, trust, or cognitive burden are useful hypotheses. Claims that real people understand, trust, or can use the product remain `human-validation-required` until observed with representative users.

## Issue capture should be structured and gated

GitHub Issues supports templates/forms, metadata, sub-issues, dependencies, and source references; GitHub CLI can create structured issues non-interactively. Sources: [GitHub About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues), [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).

Inference: scouts should not publish issues. First normalize and deduplicate a finding ledger containing current behavior, expected behavior, reproduction sequence, affected route/state/viewport, evidence links, suspected files and commit range, severity, confidence, category, and human-validation status. A reviewer then passes approved findings to `to-tickets`.

This repository already contains a strong reusable finding contract in [`skills/public-pages/references/audit.md`](../../skills/public-pages/references/audit.md): evidence class, externally visible problem, supported root cause, consequence, smallest coherent correction, observable acceptance condition, owner, dependencies, priority, and confidence. The new phase should generalize that contract rather than invent a parallel issue vocabulary.

## Linked video

Video: [LIVE: Uncle Bob on Software Fundamentals in the Age of AI](https://www.youtube.com/watch?v=zcLPGC-tvgk), published on Matt Pocock's channel. The points below were recovered from YouTube's published English auto-caption track; timestamps link to the first-party video. Captions can contain transcription errors, so these are paraphrases.

- [07:50–09:52](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=470s): Robert C. Martin describes deterministic complexity, coverage, and mutation-testing tools after agent implementation, agents repairing failures, and human attention moving to scores and spot checks.
- [16:55–18:00](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=1015s): deterministic tools create a loop in which code changes until conformance, followed by agent handoffs for review, testing, and hardening; communication overhead remains material.
- [19:17–20:20](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=1157s): focused agents offer parallelism and smaller, cleaner contexts, but incur startup and rediscovery overhead.
- [20:21–22:48](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=1221s): the concrete pipeline is specifier → coder → cleaner → hardener → QA. The specifier produces Gherkin acceptance criteria and a human-point-of-view QA procedure; QA converts the procedure into an executable UI script with a deterministic result.
- [26:10–28:08](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=1570s): architecture still required manual interrogation, supplemented by an architecture viewer and deterministic dependency-rule checks.
- [39:28–41:36](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=2368s): small increments, feedback, and reorganization are preferred as agent-driven change becomes cheaper.

The video is practitioner experience, not controlled evidence. It supports an automated gauntlet while also exposing the boundary: module design and human-facing experience need deliberate judgment.

## Codex orchestration

- OpenAI describes multi-agent as a beta capability in which GPT-5.6 coordinates parallel subagents and synthesizes results, suited to complex work that divides cleanly into independent workstreams. It describes programmatic tool calling as suitable for bounded, tool-heavy workflows that do not need fresh judgment between every step. Source: [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model).
- The Codex app supports multiple parallel agents in separate tasks and isolated worktrees, while preserving human review of changes. Source: [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/).
- OpenAI's agent-first engineering account describes a depth-first decomposition into design, code, review, and test, followed by a loop of self-review, additional focused agent reviews, feedback, and iteration until reviewers are satisfied. Source: [Harness engineering](https://openai.com/index/harness-engineering/).
- OpenAI still recommends Codex review as an additional reviewer rather than a replacement for human review. Source: [Introducing upgrades to Codex](https://openai.com/index/introducing-upgrades-to-codex/).

Inference: use deterministic orchestration for the linear spine and subagents only for bounded, independent, read-only inspection lanes:

1. **Scope mapper** discovers routes, roles, states, risky journeys, viewports, and changed surfaces.
2. **Scenario compiler** converts intended behavior into user-oriented Given/When/Then journeys and exploratory charters.
3. **Parallel scouts** inspect functional journeys, visual/responsive behavior, accessibility, error/recovery states, content/comprehension, integrations/network, and architecture/wiring.
4. **Evidence normalizer** converts observations into one schema and rejects unsupported claims.
5. **Adversarial verifier** reruns reproductions from clean state, removes duplicates/flakes, and separates confirmed defects from UX hypotheses.
6. **Human checkpoint** lets the owner explore and log without triggering fixes; representative-user sessions cover comprehension, trust, and task success.
7. **Ticket slicer** sends only confirmed and approved findings into `to-tickets` with dependencies and evidence.
8. **Closure loop** reruns the exact failed scenario and a risk-selected regression set after implementation; visual baselines are never silently replaced.

## Recommended phase contract

Best concise name: **Validate**. It describes establishing evidence, not merely executing tests, and covers functional, visual, accessibility, UX, architecture/wiring, and human validation.

- **Input:** functioning prototype, intended journeys/decisions, changed commits or files, and repository instructions.
- **Default mode:** read-only discovery and evidence capture; no source edits and no direct issue creation.
- **Coverage:** a risk-weighted route × state × role × viewport matrix; changed surfaces are mandatory; large products use representative plus random sampling.
- **Exit artifacts:** coverage map, run manifest, evidence directory, deduplicated finding ledger, human test guide, and approved ticket slices.
- **Exit criteria:** critical journeys pass or have confirmed findings; no unexplained console/page/network failures; automated accessibility scan plus manual checklist completed; responsive/visual states reviewed in controlled environments; high-severity findings independently reproduced; human-validation hypotheses are separated; tickets trace to evidence and behavior.
- **Stop conditions:** authentication or data safety prevents testing, expected behavior is unknown, the environment invalidates evidence, or an external side effect exceeds granted authority.

### Automate

- Route/state discovery and repeatable user journeys.
- Screenshots, controlled visual comparison, traces, and console/page/network capture.
- Axe scans after meaningful UI states, ARIA snapshots, and basic keyboard checks.
- Responsive matrix runs, broken-link/dead-control checks, and loading/error/empty-state coverage.
- Reproduction verification, deduplication assistance, affected-file/commit discovery, regression reruns, and evidence packaging.

### Keep human-led or explicitly human-confirmed

- Whether users understand language, hierarchy, navigation, and next actions.
- Trust, desirability, aesthetics, and cognitive burden.
- Ambiguous expected behavior and product-policy decisions.
- Lived assistive-technology experience and usability with disabled users.
- Architectural/module quality where no enforceable rule exists.
- Acceptance of intentional visual changes and final ticket publication.

## Recommendation for the recipe

Add **Validate** after Implementation, but make it a loop back into Planning and Implementation rather than a terminal checklist. The default workflow should be linear for reproducibility, with bounded parallel scouts only after a shared scope and scenario manifest exists. Preserve a strict observer/fixer separation: validation gathers evidence; a human reviews and approves the ledger; `to-tickets` slices approved findings; implementation fixes one ticket; validation closes it by replaying the evidence-backed reproduction and adjacent regression set.
