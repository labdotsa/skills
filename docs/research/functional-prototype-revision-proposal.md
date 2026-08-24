# Functioning Prototype recipe — proposed evidence-driven revision

Date: 2026-08-23
Status: design proposal; no recipe or skill implementation is changed by this document

## Decision summary

Revise the Functioning Prototype recipe from five loosely connected conversations into a gated delivery system around one active release slice. Preserve Foundation, Visuals, Planning, Implementation, and Validate as the human-facing layers, but add explicit contracts inside and between them:

1. Foundation defines prototype acceptance before broad artifact production.
2. Visuals specify every state required by the accepted journeys, not only ideal screens.
3. Planning selects one bounded vertical slice and compiles observable acceptance scenarios before generating implementation work.
4. Implementation becomes a small deterministic loop: specify → implement → review/clean → harden → integrate.
5. Validate independently observes the integrated product, separates defects from UX hypotheses, and closes the loop through approved remediation tickets.

The unit of success becomes an independently evidenced user journey. Ticket closure, test count, coverage percentage, agent consensus, or backlog exhaustion cannot independently establish that a prototype functions.

## What to adopt from the video

Adopt:

- human-point-of-view acceptance criteria before implementation;
- deterministic tools that agents must satisfy rather than narrative claims of quality;
- focused implementation, review, hardening, and QA responsibilities;
- mutation testing to measure whether important tests detect plausible faults;
- complexity and dependency checks where the project can encode meaningful rules;
- small increments, rapid feedback, and continued restructuring;
- independent QA that converts a manual procedure into reproducible browser checks;
- human review of evidence and selective spot checks.

Adapt:

- Express the pipeline as lifecycle roles, not a required permanent agent topology. A small project may execute all roles sequentially in fresh contexts; a large project may use bounded agents.
- Treat scores as signals governed by a project quality contract. Never invent universal coverage, mutation, or complexity thresholds.
- Run expensive mutation and full-browser suites by risk tier rather than after every trivial edit.
- Use agents to form UX hypotheses, not to impersonate representative users or certify desirability.

Reject:

- “more agents” as a quality strategy by itself;
- direct handoff from scout agents to issue creation;
- a fixer approving its own visual baselines or certifying its own implementation;
- arbitrary metric targets that reward gaming rather than product risk reduction;
- exhaustive parallel exploration against shared accounts, databases, fixtures, or external services.

## Proposed recipe architecture

### Layer 1 — Foundation

#### Outcome

Establish a bounded prototype decision and its acceptance contract before expanding documentation or backlog.

#### Required artifact: `artifacts/prototype-acceptance.md`

Record:

- target user, triggering situation, and intended first value;
- one to three must-work journeys;
- externally visible outcomes for each journey;
- non-goals and parked journeys;
- environment, identity, data, service, migration, locale, device, and accessibility assumptions;
- consequential actions that must be simulated or require approval;
- evidence required to call the prototype accepted;
- unresolved HITL decisions and owners.

#### Gate

Do not enter Visuals while the primary user, must-work journeys, or expected outcomes remain materially ambiguous. Research and artifact-building may continue only to resolve those gaps.

### Layer 2 — Visuals

#### Outcome

Turn each accepted journey into a complete interaction-state model and an intentional visual direction.

#### Required artifact: journey-state coverage

For every must-work journey, specify relevant:

- entry, progress, success, and return states;
- loading, empty, partial, stale, offline, timeout, and error states;
- permission, authentication, expiry, conflict, and recovery states;
- keyboard, focus, reduced-motion, zoom/reflow, theme, mobile, long-content, localization, and RTL behavior;
- transition feedback and irreversible-action confirmation;
- source of truth for copy, data, route, and ownership.

Image generation and reverse engineering remain useful, but static happy-path screens no longer satisfy the layer. Deconstruction output must describe observable states and behavior, not only component geometry.

#### Gate

Each must-work journey has a screen/state model sufficient to write user-point-of-view acceptance scenarios. Unknown behavior becomes an explicit HITL decision rather than an implementation assumption.

### Layer 3 — Planning

#### Outcome

Select one demonstrable vertical release slice, compile its acceptance scenarios, and build a dependency-aware implementation queue.

#### Step 1: release slicing

Choose the smallest slice that crosses the necessary UI, application, domain, persistence, integration, and deployment boundaries. Keep the rest of the product parked. Recommended defaults:

- one active release slice;
- five to ten active AFK tickets at most;
- one integration-sensitive change in progress;
- explicit dependency graph and integration owner;
- no unresolved HITL dependency on the critical path.

#### Step 2: acceptance specification

For the active slice, compile:

- stable scenario IDs;
- Given/When/Then criteria expressed through user-visible behavior;
- realistic data, role, locale, viewport, and dependency preconditions;
- success, failure, and recovery examples;
- a human QA procedure that does not reveal the answer to the tester;
- evidence required per scenario;
- traceability from acceptance scenario to artifact decision and future ticket.

Gherkin is a useful representation, not the objective. Criteria must remain observable and implementation-independent.

#### Step 3: ticketing

Use `to-tickets` only after acceptance specification. Each ticket must identify the scenario or quality-contract rule it advances, its dependencies, integration risk, and the evidence required for `Implemented`, `Integrated`, and `Runtime Verified`.

#### State model

Use:

`Todo → Ready → Implemented → Integrated → Runtime Verified → Accepted`

Also permit `Blocked`, `Rejected`, and `Split/Superseded`. Moving unfinished criteria to a successor does not make the original behavior accepted.

#### Gate

The active slice has an acyclic dependency graph, executable selection order, bounded work in progress, acceptance scenarios, and no unresolved critical HITL decision.

### Layer 4 — Implementation

#### Outcome

Deliver one small coherent increment and obtain deterministic source, structural, integration, and runtime evidence before selecting more work.

#### Role A: specify

Confirm the selected ticket against its acceptance scenarios, affected boundaries, failure examples, and test strategy. If observable behavior is unclear, stop and return to Planning. Do not let the implementer silently rewrite acceptance.

#### Role B: implement

Use TDD at the narrowest meaningful boundary. Prefer a tracer bullet that crosses the complete slice before broadening. Discover repository-native commands instead of assuming Bun, a particular test runner, or a browser framework.

Required evidence:

- focused red/green test or a documented reason another proof is stronger;
- mapping from acceptance criterion to changed path and test/evidence;
- no unrelated product or architecture expansion;
- coherent change ready for independent review.

#### Role C: review and clean

Use a fresh context to inspect correctness, clarity, duplication, boundary ownership, error handling, accessibility semantics, security implications, and consistency with repository architecture. Review is evidence and feedback, not a ceremonial approval. Refactoring remains subordinate to the selected behavior and must preserve observable acceptance.

#### Role D: harden

Run the quality contract proportionate to risk:

- focused test and type/static analysis;
- changed-line and behavior-relevant coverage analysis;
- mutation testing for critical domain rules, authorization, calculations, recovery, and state transitions;
- complexity analysis on changed or newly exposed units;
- architecture/dependency-rule enforcement where rules are encoded;
- migration source/applied-ledger comparison for persistence work;
- build, boot, console, network, and critical browser smoke;
- dependency, security, and performance checks where affected.

Hardening must classify results as pass, actionable defect, accepted exception, inconclusive, or unavailable. A raw score without its risk interpretation is not acceptance evidence.

#### Role E: integrate

Serialize schema, migration, routing, authentication/session, shared contract, and deployment changes through one integration owner. Integrate into the active slice, then rerun migration drift, build, boot, and the smallest critical journey. Stop feature selection on any new P0/P1 regression.

#### Reconciliation cadence

Reconcile artifacts, scenarios, tickets, routes, schema/migrations, integrated code, and observed runtime after the earlier of:

- three completed tickets;
- ten commits;
- an integration-sensitive change;
- any P0/P1 finding;
- a material product or architecture decision.

#### Gate

An increment may become `Runtime Verified` only when deterministic evidence and the critical integrated smoke pass on the named revision and environment. It does not become `Accepted` inside Implementation.

### Layer 5 — Validate

#### Outcome

Independently determine whether the integrated slice satisfies the prototype acceptance contract from the user’s point of view.

#### Linear spine

1. Freeze revision, environment, data, roles, locales, browsers, viewports, and scenario manifest.
2. Verify readiness: services, credentials, migration state, fixtures, routes, and build identity.
3. Convert the manual QA procedure into repeatable browser scenarios where appropriate.
4. Execute functional, integration, failure/recovery, console/network, accessibility, responsive, semantic, and controlled visual checks.
5. Explore outside scripted paths using bounded risk-based charters.
6. Reproduce high-severity findings from clean state and reject flakes or environment artifacts.
7. Normalize and deduplicate findings by supported root cause.
8. Conduct owner exploration and representative-user testing for comprehension, trust, desirability, cognitive burden, and assistive-technology experience.
9. Approve confirmed findings for ticketing; leave hypotheses labeled.
10. After remediation, replay the exact failure, adjacent regressions, and all must-work journeys.

#### Optional parallel scouts

Allow parallel read-only scouts only after the coordinator freezes one shared manifest. Valid disjoint charters include:

- functional journeys and integrations;
- error, permission, recovery, and adversarial states;
- visual consistency, responsive behavior, theme, locale, and RTL;
- accessibility automation, keyboard, focus, and semantic structure;
- content, comprehension, navigation, and journey continuity;
- route, event, API, migration, and dependency wiring.

The coordinator owns evidence, duplicate resolution, severity, independent reproduction, and final synthesis. Scouts neither edit the product nor create tickets.

#### Acceptance gate

Call the slice accepted only when:

- every must-work scenario has revision-bound evidence;
- no unresolved release-blocking defect remains;
- automatic and proportionate manual accessibility evidence is complete;
- responsive and visual states were reviewed in controlled environments;
- high-severity findings were independently reproduced;
- UX hypotheses are human-confirmed, explicitly deferred, or rejected;
- untested cells and accepted risks are visible;
- approved remediation tickets trace back to evidence;
- the integrated revision, not an isolated worktree, passed.

Stop when the acceptance contract passes. Move residual work to a post-prototype backlog instead of keeping the implementation goal alive indefinitely.

## Proposed skill portfolio

### Keep and reuse

#### `build-product-artifacts`

Continue using it to create the product model. Extend its future recipe usage so `prototype-acceptance.md` and journey-state coverage are mandatory recipe outputs, without turning the skill itself into a release controller.

#### `deconstruct`

Continue using it for visual reverse engineering. The recipe should require state and behavior coverage alongside visual composition.

#### `to-tickets`

Keep ticket generation separate from discovery and validation. Invoke it only for acceptance-backed planned work or confirmed, approved validation findings.

#### `tdd`

Keep it as the implementation technique. Do not overload it with architecture, mutation, integration, or black-box acceptance responsibilities.

#### `validate-prototype`

Retain it as an independent acceptance skill. Revise it later to consume the acceptance-scenario manifest and manual QA procedure explicitly; require conversion of suitable procedures into executable browser scenarios; report conformance evidence separately from exploratory and human findings.

### Introduce: `specify-acceptance`

#### Purpose

Compile product artifacts and an active release slice into observable acceptance scenarios, failure examples, a human QA procedure, evidence requirements, and traceability before ticket generation or implementation.

#### Trigger examples

- “Write acceptance criteria for this release slice.”
- “Turn these journeys into Given/When/Then scenarios.”
- “Create a human QA procedure before implementation.”
- “Make this ticket’s expected behavior executable.”

#### Inputs

- prototype acceptance contract;
- journey/state artifacts;
- active release slice and non-goals;
- known roles, data, integrations, environments, devices, and locales;
- unresolved product decisions.

#### Outputs

- `artifacts/acceptance/scenarios.md` or an equivalent repository convention;
- stable scenario IDs and traceability ledger;
- human QA procedure;
- automation candidates and manual-only decisions;
- ambiguity and HITL register;
- evidence contract for implementation and validation.

#### Boundaries

- Do not implement code or create the delivery backlog.
- Do not prescribe internal architecture unless behavior requires a constraint.
- Do not invent expected behavior when product decisions are missing.
- Do not force Gherkin when a table or state machine is clearer.

#### Suggested resources

- `references/scenario-quality.md` — observability, independence from implementation, examples and anti-patterns;
- `references/human-qa-procedure.md` — realistic tasks, neutral wording, evidence and safety;
- `assets/acceptance-scenario-template.md` — portable scenario and traceability format;
- optional deterministic validator for duplicate IDs, missing outcomes, and broken artifact references.

### Introduce: `harden-change`

#### Purpose

Assess whether an implemented change is strongly tested, structurally controlled, integration-ready, and resistant to plausible faults using repository-native deterministic tools and risk-aware interpretation.

#### Trigger examples

- “Harden this implementation before integration.”
- “Run mutation, coverage, complexity, and architecture checks.”
- “Check whether these tests actually detect faults.”
- “Verify this change is ready to integrate.”

#### Inputs

- selected ticket and acceptance scenarios;
- diff and affected boundaries;
- repository quality contract and available commands;
- risk classification and integration surface.

#### Outputs

- hardening manifest naming revision, commands, versions, environment, and scope;
- coverage interpretation tied to behavior, not a percentage alone;
- mutation results and surviving-mutant classification;
- complexity and architecture/dependency findings;
- migration, build, boot, browser-smoke, security, dependency, and performance evidence where applicable;
- accepted exceptions and unavailable checks;
- integrate/block recommendation with reasons.

#### Boundaries

- Do not invent thresholds or install tools without authorization.
- Do not mutate production data or external systems.
- Do not equate a score with correctness.
- Do not replace independent product validation.
- Do not refactor unrelated code merely to improve a metric.

#### Suggested resources

- `references/tool-discovery.md` — mapping common ecosystems to repository-native coverage, mutation, complexity, dependency, and migration tooling;
- `references/risk-tiers.md` — when to run focused versus full hardening;
- `references/result-contract.md` — pass, defect, exception, inconclusive, unavailable;
- `assets/quality-contract-template.md` — project-owned commands, thresholds, exceptions, and evidence policy;
- optional script that validates the evidence manifest without interpreting tool results.

### Do not introduce separate permanent skills for every video role

Do not create `coder`, `cleaner`, `qa-agent`, `coverage-agent`, `complexity-agent`, or `mutation-agent` skills merely to mirror an organizational diagram. These are execution roles or tools. Permanent skills are justified only when they own a reusable decision contract:

- `specify-acceptance` owns pre-implementation behavioral truth;
- `tdd` owns the implementation feedback technique;
- ordinary review skills and repository instructions own code review;
- `harden-change` owns deterministic structural/test-strength evidence;
- `validate-prototype` owns independent integrated product acceptance.

## Proposed orchestration modes

### Sequential default

Use for small slices, shared mutable state, immature test environments, or integration-sensitive work:

`acceptance contract → specify acceptance → ticket → TDD implementation → fresh-context review → harden → integrate → validate → human checkpoint → remediate/replay`

This is the normative mode because it produces clear evidence lineage and minimizes rediscovery and state collision.

### Bounded graph mode

Use only when work divides cleanly:

```text
                         ┌─ code review ───────────┐
acceptance → implement ──┼─ test-strength review ─┼─ synthesize → integrate
                         └─ dependency/security ───┘

integrated revision → shared manifest ─┬─ functional scout ─────┐
                                       ├─ recovery scout ───────┤
                                       ├─ visual/locale scout ──┼─ reproduce/dedupe → human gate
                                       ├─ accessibility scout ──┤
                                       └─ wiring scout ─────────┘
```

Constraints:

- one coordinator and one integration owner;
- frozen input revision and manifest;
- disjoint charters and named evidence outputs;
- no shared mutable test identity or fixture unless serialized;
- no scout-to-ticket or scout-to-code path;
- no parallel integration of schema, migration, route, auth/session, or shared-contract changes;
- context and startup cost must be justified by independent work.

## Deterministic quality contract

Every adopting project should own a versioned quality contract rather than rely on commands embedded in the recipe. It should declare:

- focused and full test commands;
- type/static analysis, formatting, build, and boot commands;
- browser smoke and full journey suites;
- coverage tool, scope, threshold rationale, and exception policy;
- mutation tool, target modules, timeout/budget, and survivor policy;
- complexity tool and changed-code policy;
- enforceable dependency/architecture rules;
- migration status and drift checks;
- accessibility automation and manual evidence requirements;
- visual environment and baseline-approval policy;
- security, dependency, and performance checks by risk tier;
- evidence directory, retention, revision identity, and redaction policy.

Recommended interpretation:

- Coverage identifies unexercised behavior; it does not prove assertions are meaningful.
- Mutation testing challenges assertion strength; surviving equivalent or irrelevant mutants require classification, not blind score chasing.
- Complexity signals review and decomposition risk; low complexity does not prove good module boundaries.
- Dependency rules can enforce known architecture; they cannot discover the right architecture automatically.
- Browser automation proves repeatability in its environment; representative users establish comprehension and usability.

## Finding and evidence model

Use one evidence vocabulary across Implementation and Validate:

- scenario or rule ID;
- revision and environment identity;
- role, data, locale, browser, viewport, and state;
- current behavior, expected behavior, and minimal reproduction;
- user or system consequence;
- screenshots, traces, logs, requests, reports, and tool versions;
- affected files and commit range, labeled as observed or inferred;
- severity, confidence, status, duplicate/root-cause group, and owner;
- smallest coherent correction and observable closure condition;
- human-validation requirement;
- accepted exception or untested gap.

Never expose credentials, personal data, customer information, or unsafe production payloads in evidence bundles.

## Cost and cadence

Apply checks proportionately:

| Cadence | Minimum evidence |
|---|---|
| Every focused change | acceptance trace, focused tests, types/static checks, review |
| Integration-sensitive change | migration/dependency rules, build, boot, critical browser smoke |
| Every active-slice checkpoint | changed-scope coverage, focused mutation targets, reconciliation |
| Before slice acceptance | full critical journeys, accessibility, visual/responsive, console/network, independent validation |
| Human research round | rehearsed end-to-end prototype, neutral tasks, representative participants, observation record |

Do not run a full mutation, cross-browser, visual, and Lighthouse matrix after every copy edit unless the quality contract identifies a credible risk.

## Migration plan

### Proposal approval

Approve or revise:

- the five-layer gated architecture;
- the two proposed skill boundaries;
- the ticket state model;
- the deterministic quality-contract concept;
- default WIP and reconciliation cadence.

### Skill design

Write concrete eval scenarios before implementation:

- `specify-acceptance` must expose ambiguity rather than invent behavior and must generate neutral human tasks plus observable scenarios.
- `harden-change` must discover existing tools, avoid arbitrary thresholds, classify unavailable checks, and distinguish metrics from acceptance.
- revised `validate-prototype` must consume the scenario manifest, preserve observer/fixer separation, and distinguish automated conformance, exploratory findings, and human evidence.

### Recipe revision

Replace the current long implementation goal with shorter phase prompts and explicit entry/exit artifacts. Add `specify-acceptance` before `to-tickets`; add `harden-change` between independent review and integration; make `validate-prototype` consume the same scenario IDs and evidence contract.

### Pilot

Pilot one must-work journey in one existing prototype:

1. Freeze a small active slice.
2. Backfill acceptance scenarios and the quality contract.
3. Execute sequential mode.
4. Measure defects found before integration, defects found during Validate, escaped defects, agent/tool time, false positives, duplicated findings, and human-review burden.
5. Compare with a prior slice of similar risk.

Do not promote the revised recipe or new skills based only on static instruction review.

### Promotion

Promote when the pilot demonstrates:

- usable scenario and evidence lineage;
- fewer runtime/integration escapes;
- mutation/coverage/complexity findings that change decisions rather than create noise;
- bounded agent coordination overhead;
- reproducible validation findings;
- human reviewers can understand and approve evidence without reading entire agent histories.

## Open decisions

1. Whether `prototype-acceptance.md` belongs in `build-product-artifacts` templates or remains recipe-owned.
2. Whether acceptance scenarios should default to Markdown, Gherkin feature files, or a generated dual representation.
3. Which ecosystems the first `harden-change` references should support.
4. Whether the quality contract should be Markdown, YAML/JSON, or Markdown plus a machine-readable command manifest.
5. Which mutation targets are mandatory for the first pilot and what time budget is acceptable.
6. Whether code review uses an existing external skill or remains repository-specific.
7. Which existing prototype and journey provide the safest representative pilot.

## Proposed final recipe in one line

**Define acceptance → design complete journey states → specify observable scenarios → slice dependency-aware work → implement with TDD → independently review → deterministically harden → serialize integration → independently validate → human-confirm UX → remediate and replay → accept the journey.**
