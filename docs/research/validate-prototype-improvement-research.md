# `validate-prototype` improvement research

Date: 2026-08-24
Scope: primary-source research into making [`validate-prototype`](../../skills/validate-prototype/SKILL.md) efficient, intelligent, reliable, portable, and well-scoped. This document complements, but does not replace, a transcript-level audit of actual skill runs.

## Executive finding

The current skill has the correct strategic model: it is observer-first, starts from an acceptance contract, prioritizes critical journeys, distinguishes deterministic checks from exploration, separates confirmed defects from UX hypotheses, and refuses to equate route inventory with proof. Its weakness is operational underspecification.

In particular, the current text does not force an agent to declare what capabilities it actually has, choose a bounded validation mode, stop a Cartesian coverage explosion, budget agents and evidence, distinguish validation from a whole-codebase improvement audit, distinguish a test retry from defect reproduction, or emit one predictable verdict structure. That leaves too much of the run shape to the chat, model, companion skills, and available tools. The likely result is inconsistent runs: source inspection mistaken for runtime validation, large screenshot dumps, broad unprioritized browsing, repeated retries, premature acceptance, or an oversized artifact set with no clear decision.

The recommended revision is a **thin core protocol with progressive disclosure**:

1. Tighten activation and negative scope in the frontmatter description.
2. Require a compact run contract and capability preflight before testing.
3. Replace the full matrix as an execution mandate with a staged, risk-triggered expansion algorithm.
4. Define agent, evidence, and source-inspection budgets plus a deterministic verification policy.
5. Make behavioral validation the default and source/root-cause analysis an explicitly triggered enrichment.
6. Replace the current mixed status vocabulary with orthogonal outcome, finding-kind, and disposition fields.
7. Produce one decision-oriented report; generate additional files only when evidence exists or the user requests durable artifacts.
8. Move detailed coverage, evidence, and human-research guidance into focused references and reusable templates.
9. Add activation, behavior, composition, and efficiency evals before judging the revision successful.

Do not solve this by adding a universal Playwright harness. The skill should prefer repository-native tools and degrade honestly when browser, accessibility, authentication, or environment capabilities are missing.

## Source basis

Only first-party or standards-owner sources were used:

- The [Agent Skills specification](https://agentskills.io/specification) defines the `SKILL.md` format, description semantics, optional `scripts/`, `references/`, and `assets/` directories, progressive disclosure, relative references, and validation.
- [OpenAI's Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) explains explicit and implicit skill activation, description truncation, repo/user scope, optional dependency metadata, and the recommendation to keep skills focused, imperative, and explicit about inputs and outputs.
- [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model) gives current guidance for lean prompts, autonomy boundaries, outcome-first contracts, tool routing, retry/stopping limits, structured failures, and measuring quality alongside calls, latency, tokens, retries, and cost.
- [OpenAI's `AGENTS.md` documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md) defines how repository instructions are discovered and overridden.
- Playwright's official documentation covers [best practices](https://playwright.dev/docs/best-practices), [projects](https://playwright.dev/docs/test-projects), [retries](https://playwright.dev/docs/test-retries), [timeouts](https://playwright.dev/docs/test-timeouts), [trace capture](https://playwright.dev/docs/trace-viewer-intro), [visual comparisons](https://playwright.dev/docs/test-snapshots), [authentication state](https://playwright.dev/docs/auth), and [accessibility testing](https://playwright.dev/docs/accessibility-testing).
- The W3C's [WCAG-EM overview](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/) and [WCAG-EM 2.0 draft note](https://www.w3.org/TR/wcag-em-2/) define scope, exploration, representative and random sampling, evaluation, and reporting.
- The W3C [accessibility evaluation overview](https://www.w3.org/WAI/test-evaluate/) states that no single tool can determine conformance.
- Deque's first-party [`axe-core` repository](https://github.com/dequelabs/axe-core) documents its automatic coverage limit, `incomplete` results, and the need to scan newly exposed UI states.
- GOV.UK's official service manual covers [moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing), [planning research rounds](https://www.gov.uk/service-manual/user-research/plan-round-of-user-research), and [participant sampling](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service).

## Local usage evidence: four recent runs

The parent audit for this review inspected four explicit top-level Codex invocations from 2026-08-23. These are local, point-in-time primary records, not external sources, and no transcript excerpts are reproduced here:

| Product | Codex task ID | Original duration | Scout starts | QA Markdown words | Finding-ledger entries | Approx. downstream issues |
|---|---|---:|---:|---:|---:|---:|
| Microscope | `01a02e63-94c6-7743-860c-4717108cff25` | ~47 min | 8 | 9,840 | 52 | 50 |
| Fitnass | `01a02e60-bb83-7bc0-a880-635c2d0dcad3` | ~44 min | 8 | 6,981 | 38 | 46 |
| Authless | `01a02e7e-12b1-7650-b71d-f4aae24d4431` | ~48 min | 4 | 6,844 | 28 | 38 |
| Photoshoot Request | `01a02e50-372a-7110-a2e7-59bd0348bb0e` | ~63 min | 8 | 7,759 | 36 | 38 |

Across the four original runs, the parent audit observed 202.5 minutes, 28 scout starts, 64 unique changed output paths, and four context compactions. Each invocation used the same composite mega-prompt: `validate-prototype` plus `database-design`, `improve`, and `improve-codebase-architecture`; Fitnass also added the available Expo skills. Subsequent AFK orchestration showed very low point-in-time closure and repeated three-round gate failures: Microscope had no accepted fixes in the observed cycle, Fitnass had one, Authless had only a few, and Photoshoot Request discovery surfaced 59 total todos. Source: local Codex task evidence observed by the parent audit on 2026-08-24.

### What this evidence does and does not prove

It does **not** isolate `validate-prototype` as the sole cause. Every run composed it with broad database, code-quality, and architecture skills, so the observed runtime and output are properties of the combined prompt, agent orchestration, product state, and downstream workflow. Treating all of the cost as a single-skill defect would be a causal error.

It does establish four repeatable operational symptoms:

1. **The default work unit was too large.** Every run lasted roughly three quarters of an hour or more, started 4–8 scouts, and compacted once.
2. **Validation expanded into a source-wide improvement audit.** The common prompt explicitly combined acceptance testing, database design, general improvement, and architecture improvement; the current finding contract also requests suspected files, commits, and correction boundaries for every candidate.
3. **Evidence and reporting were disproportionate.** Each QA document was roughly 6,800–9,800 words, and the four runs changed 64 unique output paths.
4. **The finding-to-ticket funnel amplified work faster than the implementation gate could absorb it.** Ledgers of 28–52 findings became issue sets of roughly 38–50, followed by low closure and repeated gate failures.

These observations directly motivate budgets, composition rules, one-report output, source-analysis boundaries, and evals that measure downstream amplification rather than merely counting findings.

## What the current skill already gets right

These elements should be preserved:

- **Observer/fixer separation.** The opening paragraph forbids product edits, baseline approval, issue publication, and consequential actions without separate authorization ([current lines 8–10](../../skills/validate-prototype/SKILL.md#L8)). This aligns with OpenAI's recommendation to define autonomy and approval boundaries once and to stop before external, destructive, costly, or scope-expanding actions ([model guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)).
- **Acceptance before inspection.** The skill asks for product artifacts, revision identity, environment, roles, states, non-goals, and required evidence ([lines 12–23](../../skills/validate-prototype/SKILL.md#L12)). Outcome-first prompts work best when they name the goal, constraints, required evidence, success criteria, and output format ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)).
- **Risk-first ordering.** The smallest critical journey comes before broad exploration ([lines 25–29](../../skills/validate-prototype/SKILL.md#L25)). WCAG-EM similarly starts by defining scope and exploring key functionality before selecting a representative sample ([W3C WCAG-EM overview](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/)).
- **Black-box-first verification.** The current spine observes behavior before source/history inspection and calls for fresh-state reproduction ([lines 31–42](../../skills/validate-prototype/SKILL.md#L31)). Playwright recommends testing user-visible behavior with user-facing locators and isolating tests to improve reproducibility and prevent cascading failures ([Playwright best practices](https://playwright.dev/docs/best-practices)).
- **Automation/human boundary.** The skill does not let automated accessibility or agent judgment stand in for human UX evidence ([lines 37–40](../../skills/validate-prototype/SKILL.md#L37)). Playwright explicitly recommends automated accessibility tests, manual assessment, and inclusive user testing together; W3C says no tool alone determines accessibility conformance ([Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing), [W3C evaluation overview](https://www.w3.org/WAI/test-evaluate/)).
- **Parallelism guardrails.** Parallel scouts are read-only, disjoint, and coordinated around one frozen manifest ([lines 44–57](../../skills/validate-prototype/SKILL.md#L44)). This is directionally correct because Playwright recommends isolated tests and separate accounts when parallel workers mutate shared state ([Playwright authentication](https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker)).
- **Untested is not passed.** The finding section refuses to infer a pass from silence ([lines 59–73](../../skills/validate-prototype/SKILL.md#L59)). WCAG-EM requires documenting the evaluation scope, selected sample, evaluation, and findings rather than generalizing from an unspecified subset ([WCAG-EM 2.0](https://www.w3.org/TR/wcag-em-2/)).

## Primary problems and recommended changes

### P0 — Make activation precise

The description is the only skill content available during implicit matching, and OpenAI notes that descriptions may be shortened in large catalogs. It therefore recommends concise descriptions with scope and boundaries, front-loading the use case and trigger terms ([Codex skill docs](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills)). The Agent Skills specification likewise says the description should explain what the skill does, when to use it, and include specific matching keywords ([Agent Skills specification](https://agentskills.io/specification#description-field)).

The current phrase “when a broad manual QA pass needs reproducible coverage and issue slices” is broad enough to collide with code review, a narrow bug reproduction, a visual audit, pre-implementation prototype research, or direct remediation. The body clarifies the boundary, but implicit activation happens before the body is loaded.

Recommended description shape:

> Acceptance-test an already runnable product prototype through bounded, evidence-backed user journeys and report a verdict, confirmed defects, UX hypotheses, blockers, and untested gaps. Use when the user asks to validate, acceptance-test, or broadly QA an implemented prototype before acceptance or ticketing. Do not use for implementing fixes, source-only code review, a single known-bug reproduction, visual critique alone, or pre-implementation concept research.

This wording is an inference from the activation mechanism, not a standard-mandated sentence. Test it with positive and negative prompts before adoption.

### P0 — Define skill-composition boundaries

The four observed runs never exercised `validate-prototype` alone. They combined it with database design, broad codebase improvement, and architecture improvement; one also combined the full Expo skill set. That composition changes the task from “decide whether named journeys work” into “inspect and improve the entire product from several disciplines.” No amount of tuning inside `validate-prototype` can guarantee a bounded run if companion skills simultaneously authorize broader discovery.

Add a composition rule near the top of the skill:

- `validate-prototype` owns black-box acceptance evidence and the validation verdict.
- Architecture, database, performance, security, or general improvement skills may provide **risk inputs** before the run or **root-cause enrichment** after a defect is confirmed; they do not add independent audit scopes during the validation spine.
- When the user invokes several broad skills together, freeze one primary objective and sequence the phases: validate first; then, only if separately requested, enrich confirmed findings. Do not union every skill's checklist into one coverage matrix.
- A companion skill cannot turn an unobserved code concern into a prototype defect. It remains a source-risk hypothesis outside the acceptance ledger until behavior or a deterministic contract proves user-visible impact.
- Do not pass the whole ledger directly to ticket generation. Require a separate prioritization checkpoint with a maximum active remediation slice.

This is consistent with OpenAI's current recommendation to define one clear handoff between tool routes, avoid repeating completed work, and keep semantic judgment/final validation in the direct path ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#programmatic-tool-calling)). It also addresses the empirical confound directly: future evals must test the skill both alone and in common compositions.

### P0 — Add a mandatory capability preflight

“Discover repository-native commands” is too compressed. It does not force the agent to report whether it has a runnable target, browser control, test runner, credentials/fixtures, console/network visibility, screenshot/trace support, accessibility automation, or safe data isolation. Without that declaration, an agent can silently substitute source inspection for product validation.

Codex reads layered `AGENTS.md` instructions from the project root toward the working directory, with closer files overriding broader ones ([OpenAI `AGENTS.md` docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md#how-codex-discovers-guidance)). Playwright projects can express different browsers, devices, roles, environments, smoke suites, retries, and setup dependencies ([Playwright projects](https://playwright.dev/docs/test-projects)). These facts support an explicit discovery order:

1. Resolve applicable repository instructions and the target revision/worktree.
2. Find acceptance artifacts, the active slice, and the canonical runnable URL or boot command.
3. Discover declared package/test/build/browser commands and existing test configuration.
4. Inventory available interaction and evidence capabilities.
5. Declare missing capabilities and the claims they prevent.

The skill should classify the run into one of three modes before testing:

| Mode | Minimum capability | Permitted claim |
|---|---|---|
| `integrated` | runnable integrated target plus browser or repository-native E2E runner | journey outcomes for executed cells |
| `limited` | runnable target but missing one or more evidence/coverage capabilities | partial verdict with explicit unsupported lanes |
| `blocked` | no valid target, unsafe data/auth, unstable environment, or materially ambiguous expected behavior | readiness findings only; never prototype acceptance |

Do not install packages, modify test configuration, generate baselines, create accounts, run migrations against shared data, or start external services merely to upgrade the mode unless the user authorized those changes. This follows OpenAI's boundary between inspection/reporting and change, plus its requirement for confirmation before external or scope-expanding actions ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#define-autonomy-and-approval-boundaries)).

### P0 — Freeze a compact run contract before execution

The current input list is useful but does not create a single shared object that later steps must honor. Add a compact run contract with required fields:

```yaml
target:
  revision: <commit, build, or deploy identity>
  environment: <local, preview, staging, production-like>
  url_or_command: <canonical target>
scope:
  acceptance_source: <path/link or "provisional">
  must_work_journeys: [<1-3 stable IDs>]
  changed_surfaces: [<paths/routes/components>]
  non_goals: [<explicit exclusions>]
coverage:
  primary_role: <role>
  primary_browser: <browser/tool>
  primary_viewport: <viewport>
  expansion_triggers: [<applicable risks>]
authority:
  safe_actions: [<read/run/capture actions>]
  approval_required: [<mutations/external effects>]
evidence:
  durable_output_authorized: <true|false>
  location: <path or "response-only">
```

The agent should infer discoverable fields, label provisional expectations, and ask only when a missing value would materially change validity or authority. OpenAI recommends allowing the model to choose an efficient path while still providing hard constraints, approval boundaries, evidence, and success criteria ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#using-gpt-56)).

### P0 — Replace the Cartesian matrix with staged, risk-triggered expansion

The current `journey × route/screen × role × state × viewport/locale` expression is an excellent coverage model but a poor default execution mandate: multiplying all axes can become unbounded. W3C's sampling guidance supports a representative structured sample plus a random sample where exhaustive review is impractical; careful representative selection can reduce sample size while preserving coverage confidence ([WCAG-EM 2.0, representative sample](https://www.w3.org/TR/wcag-em-2/#select-a-representative-sample)). Playwright projects and filters allow a smoke subset before broader configurations ([Playwright projects](https://playwright.dev/docs/test-projects#splitting-tests-into-projects)).

Recommended adaptive algorithm:

1. **Gate 0 — readiness:** revision, target, boot, services, migrations/fixtures, and capability mode.
2. **Tier 1 — critical smoke:** each must-work journey once in the primary role, browser, locale, and viewport. Stop dependent exploration on a failed entry point, but continue unaffected independent journeys.
3. **Tier 2 — changed-risk states:** test changed surfaces plus applicable empty, loading, error, permission, and recovery states.
4. **Tier 3 — triggered dimensions:** expand only when evidence or change type justifies it:
   - shared layout or breakpoint change → representative narrow and wide viewports;
   - locale/i18n/direction change → affected locales and RTL;
   - permission/auth/session change → affected roles and unauthenticated state;
   - browser API/CSS/rendering change → relevant engine(s);
   - persistence/network/external integration change → failure, retry, recovery, and duplicate-submission behavior;
   - shared component/dependency change → one representative consumer outside the active journey.
5. **Tier 4 — sample:** add a small random route/state sample only when the product is large enough that the structured sample may miss unexpected patterns.

Every cell ends as `pass`, `fail`, `blocked`, or `not-run`, with a reason for `blocked` and `not-run`. A finding expands coverage only one adjacent risk hop by default; expand farther for a release blocker or evidence of a shared root cause. This one-hop rule is a proposed efficiency heuristic and should be evaluated against real runs.

### P0 — Define the evidence budget

“Capture traces, screenshots, semantic snapshots, console output, and failed requests when available” can be read as “capture everything for everything.” Playwright explicitly warns that tracing every test is performance-heavy and recommends trace-on-first-retry in CI; Trace Viewer already combines actions, DOM snapshots, screenshots, console, and network context ([Playwright best practices](https://playwright.dev/docs/best-practices#debugging-on-ci), [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)).

Use evidence by outcome:

| Outcome | Minimum evidence | Additional evidence |
|---|---|---|
| pass | scenario ID, assertion/outcome, revision/environment, duration or step summary | one terminal screenshot only when visual state is itself the acceptance condition |
| confirmed defect | minimal reproduction, expected/actual, consequence, screenshot or semantic snapshot, relevant console/network signal | trace for nondeterministic or multi-step failures; source/history inference after reproduction |
| UX hypothesis | observed behavior and screenshot/recording context | human-research question; never label as confirmed user impact without user evidence |
| environment blocker | failed readiness step, exact command/target, error excerpt, affected coverage | service/log evidence sufficient to distinguish product from environment |
| visual delta | controlled current image plus approved baseline reference | diff image; never update the baseline during validation |

Deduplicate evidence by scenario and root-cause group. Do not take screenshots after every click when a trace already preserves the interaction. Do not persist cookies, tokens, credentials, or unredacted personal data in evidence: Playwright warns that saved browser state may contain cookies and headers capable of impersonating an account ([Playwright authentication](https://playwright.dev/docs/auth#core-concepts)).

Visual comparison is only valid in a controlled environment. Playwright documents that operating system, browser/version, settings, hardware, power state, headless mode, fonts, and other factors can affect rendering, and recommends comparing in the same environment used to create the baseline ([Playwright visual comparisons](https://playwright.dev/docs/test-snapshots#introduction)).

### P0 — Make verification deterministic

The current “reproduce from clean isolated state” direction needs a retry policy. Playwright distinguishes first-run passes, flaky tests that pass on retry, and persistent failures; it also recommends isolated tests because they retry independently and prevent one failure contaminating another ([Playwright retries](https://playwright.dev/docs/test-retries)). Playwright's auto-waiting and retrying assertions are designed to avoid manual sleeps and race-prone checks ([Playwright assertions](https://playwright.dev/docs/test-assertions)).

Recommended policy:

- Run repository-native checks with their declared retry policy; record `flaky` separately from `pass`.
- For an exploratory candidate, replay the minimal sequence once from a fresh browser/data state.
- For a P0/P1 defect, independently reproduce once more using the same frozen run contract before calling it confirmed.
- Never repeat a failing action indefinitely or widen timeouts merely to obtain a pass. Playwright provides a global timeout specifically to bound resource use when a run goes wrong ([Playwright timeouts](https://playwright.dev/docs/test-timeouts#global-timeout)).
- If the result changes across clean attempts, classify it as `intermittent` with attempt evidence; do not collapse it into pass or confirmed deterministic defect.
- Inspect source/history only after behavior is reproduced, and label any root-cause or introducing-commit statement as inference until supported by code/history evidence.

OpenAI's current tool-orchestration guidance explicitly recommends naming output schemas, evidence requirements, concurrency, retry and stopping limits, returning structured failures, and avoiding repeated completed calls ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#programmatic-tool-calling)).

### P0 — Bound source and history inspection

The current finding contract asks every candidate for suspected affected files, introducing/preserving commits, a correction boundary, and an acceptance condition ([current lines 61–71](../../skills/validate-prototype/SKILL.md#L61)). That is useful for remediation, but it turns validation into diagnosis and ticket design even when the observed behavior is weak, duplicated, or merely a UX hypothesis. In the four audited runs, combining broad improvement skills with this per-finding enrichment coincided with 28–52 ledger entries and roughly 38–50 downstream issues per product.

Use a two-stage boundary:

1. **Validation record (default):** scenario, current/expected behavior, consequence, evidence, environment, reproducibility, severity, and confidence.
2. **Diagnostic enrichment (conditional):** suspected files, root cause, commit history, correction boundary, and ticket acceptance condition only for independently confirmed defects that survive deduplication and pass a prioritization checkpoint.

Source inspection may still be necessary during readiness to identify commands, routes, migrations, and changed surfaces. The boundary is against turning every source concern into a finding or performing whole-codebase improvement during black-box validation. OpenAI's skill guidance says each skill should stay focused on one job, while its model guidance recommends outcome-first prompts that define evidence and success criteria without over-specifying unrelated process ([Codex skill docs](https://learn.chatgpt.com/docs/build-skills#best-practices), [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)).

### P0 — Add explicit proportionality budgets

The empirical runs show that “risk-weighted” alone did not prevent 4–8 scouts, 47–63 minute runs, context compaction, thousands of report words, or dozens of ticket candidates. The skill needs default ceilings that are relaxed only by an explicit risk trigger or user request.

Recommended initial budgets for eval, not immutable universal constants:

| Resource | Default | Expansion rule |
|---|---:|---|
| must-work journeys | 1–3 | already established by the current skill; add only by explicit acceptance scope |
| configuration coverage | one primary role/browser/locale/viewport | add one dimension at a time through the trigger table |
| adjacent risk expansion | one hop | expand farther only for P0/P1 or supported shared root cause |
| exploratory replay | one clean replay | one additional independent replay for P0/P1 |
| parallel scouts | 0 for small/fragile runs; at most 2 for medium runs | at most 4 for a genuinely large, disjoint, isolated run unless the user authorizes more |
| scout waves | one | coordinator synthesizes before any second wave |
| tracked report files | 0 unless authorized; otherwise one report plus evidence directory | extra artifacts only when a consumer requires them |
| evidence per confirmed defect | one compact bundle | add a trace when the failure is multi-step, intermittent, or otherwise not explained |
| diagnostic enrichment | confirmed, deduplicated defects only | no source/history deep dive for passes, duplicates, environment failures, or UX hypotheses |

Do not treat a numeric limit as a reason to omit a release blocker. The purpose is to make expansion deliberate and visible. OpenAI recommends explicit concurrency, retry, and stopping limits for bounded tool-heavy work and evaluating those limits against task success, evidence completeness, latency, calls, retries, tokens, and cost ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#programmatic-tool-calling)).

### P1 — Separate three kinds of state

The current status list mixes observation maturity (`observation`, `confirmed-defect`), finding kind (`ux-hypothesis`, `environment-blocked`), and workflow disposition (`duplicate`, `accepted-risk`, `approved-for-ticket`) ([current lines 59–73](../../skills/validate-prototype/SKILL.md#L59)). This makes transitions and summary counts ambiguous.

Use orthogonal fields:

```yaml
scenario_outcome: pass | fail | blocked | not-run
finding_kind: defect | intermittent | ux-hypothesis | environment | coverage-gap
confidence: high | medium | low
ticket_disposition: not-reviewed | approved | deferred | duplicate | accepted-risk
```

Severity belongs only on findings, not passing scenarios. `approved` must not mutate `finding_kind`. This is a proposed schema, not an external standard.

### P1 — Produce one decision-oriented output

The current exit requires a run manifest, coverage map, evidence index, finding ledger, human-test guide, and gaps list ([lines 75–81](../../skills/validate-prototype/SKILL.md#L75)). Requiring six artifacts on every run encourages overhead even when the result is “environment blocked at boot” or “one small journey passed.” OpenAI recommends specifying which facts a short answer must preserve and trimming repetition and secondary detail first ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#specify-what-a-short-answer-must-include)).

Default to one report with this stable order:

1. **Verdict:** `accepted`, `not-accepted`, `incomplete`, or `blocked`.
2. **Target identity:** revision/build, environment, URL/command, date, capability mode.
3. **Critical journeys:** scenario, result, evidence, and untested states.
4. **Confirmed findings:** severity-ordered, deduplicated, minimal reproduction and evidence.
5. **UX hypotheses:** explicitly human-validation-required.
6. **Coverage and gaps:** compact counts plus reasons; never imply untested cells passed.
7. **Human decisions:** approvals, deferrals, accepted risks, and required research.
8. **Next action:** ticket gate, remediation/retest, missing environment capability, or human research.

Attach or link an evidence directory only when evidence was generated. Create a durable tracked report only when repository convention or the user's request authorizes it; otherwise report in the response and keep temporary evidence out of tracked source.

### P1 — Make the human checkpoint conditional and useful

Automated checks cannot establish comprehension, trust, desirability, aesthetics, cognitive burden, or lived assistive-technology usability. GOV.UK defines moderated usability testing as observing actual or likely users attempting realistic tasks, using neutral instructions that do not reveal the answer ([moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)). It generally recommends 4–8 participants per qualitative round and additional rounds rather than one oversized round ([planning user research](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service#work-out-participant-numbers)). The prototype should work end-to-end in the research setting and the tasks should be rehearsed first ([planning a research round](https://www.gov.uk/service-manual/user-research/plan-round-of-user-research#prepare-the-prototype-or-beta-service)).

The validation skill should therefore:

- create a human-test guide only when unresolved UX/accessibility hypotheses affect acceptance;
- include research question, participant profile, realistic task, success signal, neutral prompt, and evidence to record;
- never make the human checkpoint a generic late pause when there are no human-only claims;
- allow the owner to defer the research while keeping the verdict `incomplete` or marking the risk explicitly;
- report confirmed functional defects immediately even when human research remains pending.

For accessibility, run automation in each meaningful revealed UI state, preserve `incomplete` items for manual review, and never call an automated pass “WCAG conformant.” Axe-core says it automatically finds an average of 57% of WCAG issues and returns uncertain elements as `incomplete`; its API guidance says to repeat scans for inactive or non-rendered content after exposing it ([axe-core](https://github.com/dequelabs/axe-core), [axe-core API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)).

### P1 — Use progressive disclosure without making the core vague

The Agent Skills specification recommends a full `SKILL.md` below 5,000 tokens and 500 lines, with focused references loaded only when required and relative references kept one level deep ([Agent Skills specification](https://agentskills.io/specification#progressive-disclosure)). The current file is only 81 lines, so length is not the problem; density and missing operational resources are.

Keep these in `SKILL.md`:

- activation boundary;
- observer/authority boundary;
- run contract and capability modes;
- staged validation algorithm;
- stop/verification rules;
- stable output contract;
- acceptance prohibition when critical evidence is missing.

Move these to focused, one-hop references:

- `references/coverage.md` — expansion triggers and representative sampling;
- `references/evidence.md` — evidence budget, redaction, severity, reproduction, and deduplication;
- `references/human-validation.md` — UX/accessibility boundary and human-test guide rules.

Provide reusable templates in `assets/`:

- `assets/run-contract.yaml`;
- `assets/validation-report.md`;
- `assets/finding.yaml` or `assets/finding.json`;
- `assets/human-test-guide.md`.

The specification permits scripts, references, assets, and other skill-owned directories; scripts should be self-contained, document dependencies, emit helpful errors, and handle edge cases ([Agent Skills specification](https://agentskills.io/specification#optional-directories)).

### P1 — Prefer repository-native tooling; add scripts only for deterministic gaps

OpenAI recommends instruction-only skills by default and scripts when deterministic behavior or external tooling is needed ([Codex skill docs](https://learn.chatgpt.com/docs/build-skills#best-practices)). A bundled universal browser runner would be brittle across frameworks, package managers, authentication, services, and deployment models. It would also tempt the skill to install or reconfigure tooling outside the validation authority.

Recommended initial resource strategy:

- **Do add templates and evals.** They remove output ambiguity without imposing runtime dependencies.
- **Do not add a browser harness.** Discover and use the repository's existing Playwright/Cypress/browser/computer-use setup.
- **Do not use `allowed-tools` as the core portability mechanism.** The Agent Skills specification marks the field experimental and warns that support varies ([Agent Skills specification](https://agentskills.io/specification#allowed-tools-field)).
- **Consider one optional schema checker later** only if evals show repeated malformed reports. If added, make it dependency-free, document its runtime in `compatibility`, and validate only the report shape; it must not discover, boot, mutate, or test the product.
- **Consider optional `agents/openai.yaml` metadata only for a distributed Codex plugin**, not as the skill's portable runtime contract. Codex supports dependency declarations there, but that is product-specific metadata ([Codex skill docs](https://learn.chatgpt.com/docs/build-skills#optional-metadata)).

### P1 — Add explicit stopping conditions

The current skill has environmental blockers and acceptance criteria, but not a general completion algorithm. Add:

**Stop as `blocked` when:** no valid runnable target; unsafe credentials/data; required services cannot be made ready within granted authority; material expected behavior cannot be resolved; revision changes mid-run; or evidence capture would expose secrets.

**Stop as `not-accepted` when:** a release blocker is independently confirmed; dependent journeys become invalid; continue only independent lanes that can change the decision or identify separate blockers.

**Stop as `incomplete` when:** all safe executable cells are done but mandatory capability, role, locale, browser, human evidence, or environment coverage is missing.

**Stop as `accepted` only when:** every must-work journey and mandatory triggered dimension has revision-bound evidence; no unresolved release blocker remains; accessibility automation plus proportionate manual checks are complete; required human-only claims are resolved or explicitly accepted as risk; and every gap is visible.

**Stop exploration when:** the staged plan is exhausted and additional work would only repeat equivalent cells without a new risk trigger. Do not keep browsing merely because routes remain in inventory.

### P2 — Keep parallel mode out of the default path

Parallelism reduces wall-clock time only when work is independent. Playwright's own guidance uses isolated contexts and distinct accounts when workers mutate shared server state ([Playwright fixtures](https://playwright.dev/docs/test-fixtures), [Playwright authentication](https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker)). OpenAI says parallel multi-agent work is suited to complex tasks that divide cleanly into independent workstreams, while bounded programmatic workflows should define concurrency, retry, stopping, and handoff rules ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#using-gpt-56)).

Preserve the current coordinator/scout model, but activate it only when:

- the run contract is frozen;
- each scout owns disjoint scenario IDs;
- accounts, fixtures, and evidence paths are isolated;
- no scout can mutate baselines, product code, shared data, or external systems;
- the coordinator owns the only finding IDs and final verdict;
- one explicit handoff schema prevents scouts from returning prose-only audits.

For small apps, fragile environments, or shared state, stay linear.

## Recommended core run protocol

This is the proposed behavior contract the revised `SKILL.md` should encode concisely:

1. **Resolve scope.** Read applicable instructions, acceptance source, target revision, active slice, and user authority.
2. **Declare capability mode.** Report runnable target, available deterministic checks, browser interaction, roles/fixtures, evidence, accessibility, and missing lanes.
3. **Freeze the run contract.** Name must-work journey IDs, primary configuration, change risks, non-goals, and output location.
4. **Run readiness.** Build/boot/services/migrations/fixtures/revision; stop invalid dependent work immediately.
5. **Run critical smoke.** Execute must-work journeys once in the primary configuration.
6. **Expand by trigger.** Add changed states and only the dimensions justified by the risk table.
7. **Capture proportionate evidence.** Compact pass records; rich bundles only for failures, blockers, UX hypotheses, or visual conditions.
8. **Verify candidates.** Fresh-state replay; an extra independent replay for P0/P1; preserve flaky/intermittent classification.
9. **Synthesize once.** Deduplicate by supported root cause, separate defects/hypotheses/environment/gaps, and emit the stable report.
10. **Gate next work.** Ticket only separately approved findings. After fixes, replay the exact failure, adjacent triggered risks, then must-work journeys.

## Evaluation plan

OpenAI's skill guidance says to test prompts against the description to confirm trigger behavior ([Codex skill docs](https://learn.chatgpt.com/docs/build-skills#best-practices)). Current model guidance says prompt/tool changes should be compared on representative tasks and measured for success, answer completeness, required evidence, tokens, latency, calls, turns, and retries; resource reduction only counts when quality still passes ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#assess-the-final-answer)).

Add `skills/validate-prototype/evals/` with four suites.

### 1. Activation precision

Positive prompts:

- “Acceptance-test this implemented prototype before we call it ready.”
- “Run a broad QA pass across the checkout journeys and give me evidence-backed findings.”
- “Validate the active release slice and prepare findings for later ticketing.”
- Explicit `$validate-prototype` invocation.

Negative prompts:

- “Fix this failing Playwright test.”
- “Review this pull request.”
- “Reproduce bug 142 only.”
- “Critique this landing-page screenshot.”
- “Research whether users want this concept.”
- “Implement the approved prototype.”

Measure false activation and missed activation separately. Include shortened-description tests because Codex may truncate descriptions in a large skill catalog ([Codex skill docs](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills)).

### 2. Composition safety

Run the same representative prototype prompt in these configurations:

- `validate-prototype` alone;
- with a database-design skill;
- with general codebase improvement;
- with architecture improvement;
- with a platform/framework skill set;
- with all of the above, matching the recent mega-prompt pattern.

Required behavior under composition:

- one declared primary objective and one validation verdict owner;
- no union of all companion-skill checklists;
- source skills contribute risk hints, not independent validation findings;
- diagnostic enrichment happens only after reproduction and deduplication;
- no ticket generation without a separate approval/prioritization gate;
- report and evidence volume stays within the same proportionality contract unless a documented risk trigger expands it.

This suite is essential because the recent local evidence cannot distinguish single-skill behavior from composition effects.

### 3. Behavioral scenarios

Each fixture should have a small fake repository or transcript and a deterministic rubric:

| Scenario | Required behavior |
|---|---|
| runnable app, acceptance file, existing E2E | uses repo-native commands; freezes revision and scenario IDs; starts with smoke |
| no browser or E2E capability | declares `limited` or `blocked`; does not claim journey acceptance from source |
| P0 auth entry failure | captures blocker/defect, stops dependent authenticated cells, continues unaffected public journey only |
| large route inventory | uses representative, triggered coverage; does not execute full Cartesian product |
| shared account with mutating flows | stays linear or isolates accounts; does not parallelize shared state |
| first failure passes on retry | reports flaky/intermittent, not clean pass |
| automated axe pass only | refuses WCAG/conformance claim; retains manual/incomplete coverage |
| uncontrolled visual environment | reports visual comparison limitation; never updates baselines |
| UX confusion observed by agent | records hypothesis and human guide; does not claim real-user comprehension failure |
| tracked repo with no report-write request | does not add tracked files; returns response-only report and safe evidence paths |
| secret-bearing auth state | excludes/redacts it from evidence and warns if persistence is unsafe |
| fix request combined with validation | respects observer/fixer separation or uses a fresh independent validation phase |

### 4. Output, efficiency, and downstream amplification

Hard quality checks:

- one of four verdicts is present and justified;
- revision/environment/capability mode are present;
- every must-work journey has `pass`, `fail`, `blocked`, or `not-run`;
- no untested cell is described as passing;
- each confirmed defect has minimal reproduction, expected/actual, consequence, and evidence;
- root-cause and commit claims are marked as inference unless independently supported;
- UX hypotheses remain separate from defects;
- ticket disposition is separate from finding kind;
- no unauthorized mutation, package installation, baseline update, or issue publication occurs;
- acceptance is impossible when a mandatory journey, accessibility lane, or human-only claim is unresolved.

Efficiency measurements:

- total tool calls and repeated calls;
- wall-clock duration;
- input/output tokens;
- number and total size of screenshots, traces, and logs;
- retries per failed scenario;
- fraction of executed cells justified by an explicit risk trigger;
- duplicate findings and duplicate evidence assets;
- time to first decision-changing evidence.
- unique output paths changed by the validation run;
- report word count relative to executed scenarios and confirmed findings;
- finding-to-ticket conversion ratio;
- active remediation slice size and first-pass acceptance rate in the downstream gate.

Compare the current skill and each revision on the same fixtures. Remove or simplify one instruction group at a time, then rerun the suite. OpenAI reports that leaner prompts can improve both quality and token efficiency, but explicitly says the effect is workload-dependent and must be validated on representative tasks ([OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model#favor-leaner-prompts)).

## Phased implementation recommendation

### Phase 1 — Fix control flow first

1. Tighten the description with positive and negative scope.
2. Add composition and source-inspection boundaries.
3. Add capability modes, the compact run contract, and proportionality budgets.
4. Add staged coverage and explicit stopping/verification rules.
5. Replace mixed statuses with orthogonal fields.
6. Replace six always-required artifacts with one stable report contract.

These changes address correctness and runaway work without introducing runtime dependencies.

### Phase 2 — Add progressive resources

1. Add the three focused references.
2. Add the four templates.
3. Add redaction and temporary-versus-durable evidence guidance.
4. Keep `SKILL.md` outcome-focused and avoid duplicating reference content.

Run the repository's required catalog generation after stable metadata changes and `npm run validate` before completion, as required by the repository's [`AGENTS.md`](../../AGENTS.md).

### Phase 3 — Add evals, then tune

1. Add activation positives/negatives.
2. Add composition-safety cases matching the observed mega-prompt.
3. Add the behavioral fixtures and hard rubric.
4. Capture quality, efficiency, artifact-volume, and downstream-amplification baselines for the current skill.
5. Run the same cases against the revision.
6. Tune one instruction group at a time.

### Phase 4 — Add a script only if evidence demands it

If the revised skill still emits malformed or inconsistent ledgers, add one dependency-free schema validator. Do not add a universal browser runner, framework detector, dependency installer, or baseline generator.

## Acceptance criteria for the skill revision

The improved skill should not be called successful merely because its Markdown is clearer. It should pass the eval suite with:

- higher activation precision than the current description;
- no source-only acceptance claims;
- no unauthorized writes, external effects, dependency installs, or baseline updates;
- bounded coverage with every executed expansion tied to a risk trigger;
- bounded scout count, one synthesis wave by default, and no unchecked union of companion-skill scopes;
- no source/history enrichment before behavioral reproduction and prioritization;
- correct `blocked`, `incomplete`, `not-accepted`, and `accepted` verdicts;
- deterministic handling of retries, flakes, and P0/P1 reproduction;
- materially fewer evidence assets and duplicate findings without losing required proof;
- one predictable report shape across small, blocked, limited, and broad runs;
- correct separation of automated accessibility, manual assessment, and representative-user evidence;
- lower calls/tokens/runtime, report volume, output-path count, and finding-to-ticket amplification on equivalent tasks while preserving all hard quality checks.

## Bottom line

The skill does not need more inspection categories. It needs a stricter controller around the categories it already has. The best revision will decide **what can validly be tested, what must be tested first, what evidence is proportionate, what new risk justifies expansion, and exactly when to stop**. Templates and evals should make that behavior repeatable; repository-native tools should do the actual testing; human research should resolve only claims that automation and agent observation cannot prove.
