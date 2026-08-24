---
name: validate-prototype
description: Validate an implemented prototype or integrated release slice by exercising must-work user journeys through repository-native Playwright or an available built-in browser, then tracing browser-observed failures into the exact source path. Use for acceptance testing, broad browser QA, or evidence-backed retesting after fixes. Do not use for source-only review, implementation, isolated test repair, screenshot critique, or pre-build concept research.
metadata:
  category: product-delivery
---

# Validate Prototype

Determine whether an implemented product works from the user's point of view. Observe through a real browser, diagnose observed failures through runtime evidence and source code, and confirm through the browser again.

Remain an independent validator by default. Do not fix product code, update snapshots or visual baselines, install dependencies, create tickets, mutate production data, or perform consequential external actions unless separately authorized. When validation and fixing are requested together, preserve the original evidence, end the validation phase, make the authorized change, then begin a fresh retest phase.

## Enforce the browser gate

Exercise every journey with one of these mechanisms:

1. Use the repository's existing Playwright configuration when it is runnable and safe.
2. Otherwise use the environment's built-in interactive browser.
3. When both are available, use Playwright for repeatable scenarios and use the built-in browser for one short exploratory pass only when it adds distinct evidence.
4. When neither mechanism can exercise the rendered product, return `blocked`. Never infer acceptance from tests, source inspection, route inventory, screenshots, or build success alone.

Do not add Playwright, download browsers, replace the project's browser harness, or reconfigure the application merely to upgrade validation capability. Read [references/browser-execution.md](references/browser-execution.md) before running browser scenarios.

## Select a mode

- **Focused** is the default. Validate one to three must-work journeys in one primary configuration, then expand only when a documented risk triggers another state or dimension.
- **Release** applies only when the user explicitly requests whole-release acceptance and provides an authoritative acceptance scope, stable environment, safe fixtures, and sufficient time.
- **Retest** replays exact failed reproductions after fixes, then adjacent risk-selected cases and the critical smoke journey. Do not rebuild the original broad matrix.

Record browser capability separately from mode:

- `integrated`: the target and browser mechanism are runnable with the evidence channels required by the contract;
- `limited`: browser interaction works, but a noncritical evidence channel, role, fixture, or triggered dimension is unavailable;
- `blocked`: no valid browser journey can run, or safety, identity, target, revision, or environment validity prevents meaningful testing.

## Run the internal stages

### 1. Resolve scope and authority

Read repository instructions, the active diff and revision, the acceptance source, and the active release slice. Treat companion skills as risk hints only. Do not union their full architecture, database, framework, or improvement checklists into this run.

### 2. Preflight capabilities

Identify the runnable URL or app target, existing Playwright commands, built-in browser availability, roles, fixtures, services, evidence channels, accessibility support, and prohibited side effects. Declare the capability status before making an acceptance claim.

### 3. Freeze the run contract

Name the revision, target, mode, one to three journey IDs, expected outcomes, primary browser, role, viewport, locale, changed surfaces, risk triggers, non-goals, and write authority. Use [assets/run-contract.yaml](assets/run-contract.yaml) when a saved contract was requested.

Stop or invalidate affected results when the revision, environment identity, acceptance contract, or relevant fixture changes during the run. Never combine evidence from different revisions into one verdict.

### 4. Prove readiness

Use repository-native build, boot, fixture, migration, and health commands only as needed to make the browser target valid. Record an environment failure separately from a product defect. Do not spend the validation budget repairing infrastructure unless the user changes the assignment.

### 5. Exercise the critical journey

Run the smallest must-work journey in the primary configuration before broad exploration. Assert user-visible behavior through roles, labels, text, navigation, and externally observable outcomes. Capture concise pass evidence. Stop dependent journeys when a P0 entry point fails; continue only independent work that could change the verdict.

### 6. Expand by risk

Cover changed states first. Add one role, viewport, locale, browser, failure path, recovery path, or accessibility state only when a risk trigger justifies it. Read [references/coverage.md](references/coverage.md) for the trigger table and sampling rules. Do not execute a Cartesian coverage matrix merely because dimensions exist.

### 7. Diagnose the observed state

For each candidate defect, reproduce the exact browser state before inspecting implementation details. Capture route, role, fixture, inputs, action sequence, visible state, console output, failed requests, response data, and timing when available.

Then trace only the implicated path, such as:

`screen/component -> event handler -> validation/state -> client request -> server/domain -> persistence/integration -> response mapping -> rendered state`

Read [references/code-path-diagnosis.md](references/code-path-diagnosis.md) before source investigation. Mark the root cause `confirmed`, `suspected`, or `unresolved` and cite source locations. A source-only concern is not a prototype defect unless browser evidence exposes its user-visible consequence; classify it as a coverage gap or leave it outside the validation ledger.

### 8. Verify and synthesize once

Replay a candidate from clean state. Perform one additional independent replay for P0/P1 findings. Preserve `intermittent` when a retry passes; do not erase the first failure. Deduplicate findings by supported root cause, not similar wording.

Return one decision-oriented report using [assets/validation-report.md](assets/validation-report.md). Read [references/human-validation.md](references/human-validation.md) only when the contract contains comprehension, trust, desirability, assistive-technology, or other human-only claims.

## Control cost and artifacts

- Keep one coordinator and remain linear by default.
- Use no scouts by default. Use at most two bounded, read-only scouts only for a genuinely large scope with disjoint scenarios, isolated accounts and fixtures, and one shared frozen contract.
- Run one scout wave and one synthesis. The coordinator owns finding IDs, severity, deduplication, reproduction, and verdict.
- Keep one primary browser, role, viewport, and locale until risk triggers expansion.
- Record passes compactly. Capture screenshots, semantic state, console/network details, and traces for failures, blockers, visual conditions, or UX hypotheses; prefer traces only on failure or retry.
- Return the report in the response by default. When durable artifacts are requested, create one `qa/validation/<short-sha>/<run-id>/report.md` plus one `evidence/` directory only when evidence exists.
- Do not create implementation plans or tickets. Nominate no more than three to five root-cause groups for a later prioritization gate.
- Stop when additional execution would repeat equivalent cells without a new risk trigger.

## Report orthogonal state

Use these fields independently:

- `verdict`: `accepted | not-accepted | incomplete | blocked`
- `scenario_outcome`: `pass | fail | blocked | not-run`
- `finding_kind`: `defect | intermittent | ux-hypothesis | environment | coverage-gap`
- `root_cause_status`: `confirmed | suspected | unresolved | not-applicable`
- `ticket_disposition`: `not-reviewed | approved | deferred | duplicate | accepted-risk`

Use [assets/finding.yaml](assets/finding.yaml) for durable findings. Preserve expected versus actual behavior, minimal reproduction, user consequence, evidence, source trace, confidence, and an observable retest condition. Redact credentials, tokens, personal data, and secret-bearing browser state.

## Decide the verdict

- Return `blocked` when no valid browser mechanism or runnable safe target exists, material expectations are unresolved, revision drift invalidates the run, or evidence cannot be captured safely.
- Return `not-accepted` when a release-blocking defect is independently confirmed. Stop dependent exploration after recording the blocker.
- Return `incomplete` when all safe executable work is done but a mandatory journey, triggered dimension, role, evidence channel, or required human decision is missing.
- Return `accepted` only when every must-work journey and mandatory triggered dimension has revision-bound browser evidence, no unresolved release blocker remains, required accessibility checks are complete, and all gaps and deferred human-only risks are explicit.

Human research is not an automatic blocker for a technical browser verdict unless the acceptance contract requires a human-only claim. Automated accessibility checks never establish complete accessibility or WCAG conformance by themselves.
