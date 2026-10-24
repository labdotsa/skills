# UX primitive contracts

Use this reference when a visual refactor needs a reusable design decision, when a team is extracting a shared rule from research, or when a one-off correction should become a durable product convention.

These are **decision and behavior contracts**, not a replacement component library. A token stores a value, a semantic role names a product meaning, a component implements a UI object, and a primitive states what must remain true for people using that object. A primitive can therefore apply to CSS, native controls, voice prompts, remote navigation, spatial UI, or a service handoff.

## Source synthesis

The contracts synthesize the durable parts of the recommended readings and current first-party guidance:

- [The Design of Everyday Things](https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/) supplies conceptual models, signifiers, mappings, feedback, and error framing.
- [Designing Interfaces, 3rd edition](https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/) supplies context-first pattern reasoning across mobile, web, desktop, cognition, forms, wayfinding, and UI systems.
- [Lean UX, 3rd edition](https://www.oreilly.com/library/view/lean-ux-3rd/9781098116293/) supplies outcomes, assumptions, hypotheses, experiments, collaborative research, and learning loops.
- [Just Enough Research, 2nd edition](https://abookapart.com/blogs/press/just-enough-research-2nd-edition-is-now-available.html) and [Interviewing Users, 2nd edition](https://rosenfeldmedia.com/books/interviewing-users-second-edition/) supply evidence discipline, interviewing, synthesis, and impact.
- [The Designing for Growth Field Book](https://cup.columbia.edu/book/the-designing-for-growth-field-book/9780231187893/) supplies opportunity framing, criteria, ideation, prototyping, feedback, and learning launches.
- [This Is Service Design Doing](https://www.oreilly.com/library/view/this-is-service/9781491927175/titlepage01.html) supplies journey, stakeholder, system, service-blueprint, co-creation, and service-prototyping methods.
- [Laws of UX](https://lawsofux.com/) supplies compact lenses for cognitive load, grouping, recognition, attention, target acquisition, and predictable behavior. Use individual laws as hypotheses, not universal proof.
- [Nielsen Norman Group’s usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) supplies a diagnostic vocabulary for visibility, consistency, control, prevention, recognition, flexibility, and recovery.
- [GOV.UK Design System](https://design-system.service.gov.uk/) supplies tested task, content, form, error, and service patterns. Adapt them to the product, audience, and jurisdiction.
- [Inclusive Components](https://inclusive-components.design/) supplies accessible component reasoning for semantic structure, disclosure, navigation, forms, and resilient states.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) supply web accessibility requirements and widget behavior; [Apple HIG](https://developer.apple.com/design/human-interface-guidelines) and [Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3) supply current platform conventions.

Apple HIG is an essential baseline for core design work, including non-Apple products. Read its current [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) guidance, which covers purpose, agency, responsibility, familiarity, flexibility, simplicity, craft, and delight. Preserve those transferable principles, then adapt controls, navigation, input, typography, motion, and feedback to the target platform and its standards. Do not treat Apple-specific chrome or conventions as web requirements. The books explain durable reasoning; standards and platform guidance remain authoritative for current implementation details.

## The primitive contract

Every selected primitive must answer these six questions:

1. **Trigger:** What observed risk or decision makes it relevant?
2. **Intent:** What user outcome does it protect?
3. **Invariant:** What must remain true across components, states, themes, widths, locales, and input modes?
4. **Boundary:** What does it not authorize or solve?
5. **Proof:** What rendered, behavioral, human, or product evidence would verify it?
6. **Adapter:** What changes for the target surface without changing the underlying intent?

Start with one framing primitive, two to four behavior/composition primitives, and one proof primitive. Add another only when a risk trigger or repeated consumer justifies it. This keeps the library usable instead of turning it into a checklist.

## Primitive library

### Evidence and framing

| ID | Primitive | Trigger | Invariant | Proof |
| --- | --- | --- | --- | --- |
| E1 | **Context frame** | The complaint, audience, or task is unclear. | Name the actor, goal, context, constraints, success condition, affected surface, and non-goals before proposing a solution. Keep assumptions visibly provisional. | A reviewer can restate the target user and task without solution language; each material assumption has a source or owner. |
| E2 | **Outcome hypothesis** | A change needs prioritization or measurement. | State: “We believe **change** for **user/context** will improve **observable outcome**, measured by **signal**, without harming **guardrail**.” Do not confuse output shipped with outcome achieved. | Baseline or proxy exists, the guardrail is named, and the next experiment could falsify the hypothesis. |
| E3 | **Journey slice** | A task crosses screens, channels, devices, roles, or handoffs. | Model one actor completing one meaningful task from entry through result, including handoffs, interruption, failure, recovery, and escalation. | The slice has an entry condition, transitions, end condition, and at least one realistic failure path. |
| E4 | **Evidence loop** | A visual opinion or design-thinking exercise could outrun user evidence. | Move through observe → frame → prototype or refactor → test → decide. Label observations, inferences, and unknowns separately; never turn preference into proof. | Every major change has evidence, a stated assumption, or an explicit research question and a next check. |

### Cognition and control

| ID | Primitive | Trigger | Invariant | Proof |
| --- | --- | --- | --- | --- |
| C1 | **Conceptual model** | People cannot predict what a control, screen, or status means. | Names, grouping, sequence, and feedback should match the user’s task model; expose the product’s state rather than making people infer hidden rules. | A representative user can predict the next action and explain the result in the product’s language. |
| C2 | **Signifier and mapping** | A control is missed, misread, or used incorrectly. | Make the available action perceivable and map location, order, shape, and language to the expected result. Do not make a basic action depend on an obscure gesture or command. | First-use observation shows the intended affordance and the path from control to result without trial-and-error detours. |
| C3 | **Status and feedback** | Actions are asynchronous, delayed, destructive, or multi-step. | Every meaningful action communicates current state, acknowledgement, result, and next available action; feedback remains understandable without color or motion. | Loading, success, failure, retry, and completion are directly observable for the primary journey. |
| C4 | **Recognition and disclosure** | Screens are dense, intimidating, or full of secondary options. | Keep primary choices visible in context; defer secondary detail until it is useful; preserve discoverability and a clear route back. | People can identify page purpose and next action without scanning every option, while secondary tasks remain findable. |
| C5 | **Error prevention and recovery** | Errors are frequent, costly, or hard to undo. | Constrain invalid input when safe, validate near the cause, preserve entered work, explain the problem in user language, and provide a concrete recovery path. | A realistic mistake can be corrected without losing unrelated work or restarting the entire journey. |
| C6 | **Reversibility and control** | The system can trap, commit, delete, navigate, or interrupt users. | Provide undo, cancel, pause, back, exit, or an equivalent safe escape; make irreversible consequences explicit before commitment. | The user can stop or recover from the critical action, and focus or context is retained after cancellation. |

### Composition and visual system

| ID | Primitive | Trigger | Invariant | Proof |
| --- | --- | --- | --- | --- |
| V1 | **Hierarchy ladder** | Everything competes or nothing stands out. | Assign relative emphasis by task priority using order, proximity, measure, type, contrast, and action placement; reserve the strongest treatment for the dominant intent. | A first glance identifies purpose, primary action, supporting information, and low-priority detail in that order. |
| V2 | **Grouping and rhythm** | The interface feels cramped, empty, or fragmented. | Tighten items that belong together; increase separation between groups; encode relationships consistently with inset, item gap, group stack, and section stack roles. | Related content remains perceptually connected while unrelated sections separate at narrow and wide widths. |
| V3 | **Measure and wayfinding** | Reading is tiring or users lose their place. | Bound text by language-appropriate measure; align related regions on stable tracks; provide predictable landmarks, labels, and routes through the information. | People can scan, compare, and return to the correct place without relying on memory or arbitrary visual decoration. |
| V4 | **Containment budget** | The design has card, border, radius, or shadow overload. | Every container must communicate interaction, independent grouping, layering, or elevation. Use whitespace or dividers for ordinary grouping; remove chrome with no distinct job. | Removing nonfunctional chrome does not remove meaning, state, or operability; scanning becomes clearer. |
| V5 | **Responsive composition** | A desktop arrangement is squeezed onto a smaller surface or a wide view scatters content. | Recompose by task priority when content pressure changes: stack, wrap, move, collapse, disclose, or intentionally scroll. Preserve semantic DOM and focus order. | At narrow, transition, and wide widths there is no content loss, ambiguous wrapping, displaced primary action, or accidental two-axis scroll. |

### State and interaction

| ID | Primitive | Trigger | Invariant | Proof |
| --- | --- | --- | --- | --- |
| I1 | **State set** | A component looks finished only in its rest state. | Define applicable rest, hover, focus-visible, pressed/selected, disabled, loading, empty, success, warning, and error states. Communicate differences with shape, text, icon, position, or motion as well as color. | Each applicable state is reachable and distinguishable by the required input modes and assistive technology. |
| I2 | **Input contract** | A task must work with touch, pointer, keyboard, switch, voice, remote, wearable, or spatial input. | Declare required input modes and make primary actions reachable, perceivable, cancellable, and recoverable in each one. Do not treat a visual affordance as an interaction contract by itself. | The critical journey completes with every in-scope modality, or the unsupported modality is explicitly recorded as a boundary. |
| I3 | **Continuity and persistence** | Users resize, rotate, refresh, background, lose connection, change posture, or resume later. | Preserve task state when safe; otherwise explain what was lost, why, and how to recover. Treat multi-window, process recreation, offline, and interrupted sessions as normal conditions where the surface supports them. | A fresh interruption test shows preserved context or a clear recovery route without duplicate submission or silent data loss. |
| I4 | **Causal motion** | Animation adds delay, distraction, or uncertainty. | Use motion to explain state, hierarchy, spatial relationship, or causality; keep it brief, interruptible, and optional through reduced-motion settings. | The interaction remains understandable and usable with motion reduced or disabled. |

### Inclusion, adaptation, and resilience

| ID | Primitive | Trigger | Invariant | Proof |
| --- | --- | --- | --- | --- |
| A1 | **Semantic foundation** | Visual styling or custom widgets obscure structure. | Prefer native semantics and controls; provide accurate names, roles, values, heading order, labels, and relationships before styling. | A semantic snapshot or assistive-technology pass exposes the same purpose, order, and state as the visual UI. |
| A2 | **Perception without exclusion** | Text, controls, media, or status rely on a single sensory channel. | Support contrast, text resizing, zoom/reflow, captions or transcripts, non-color cues, readable focus, and legible text over media. Validate computed values after themes, opacity, overlays, and gamut mapping resolve. | Applicable WCAG criteria and representative theme/media states are checked; automated results are not presented as full conformance. |
| A3 | **Operability and focus** | Keyboard, switch, screen reader, voice, remote, or alternate input cannot reach or understand the task. | Keep focus visible, ordered, stable, and escapable; expose equivalent actions; avoid focus traps, gesture-only basics, and timing that cannot be extended or disabled. | The critical journey works through each required alternate input and retains focus/context after state changes. |
| A4 | **Localization and direction** | Long strings, translation, locale formatting, or RTL expose layout assumptions. | Use logical geometry and actual locale/direction state; allow labels, errors, numbers, dates, and mixed content to expand without hiding meaning or changing semantic order. | Long realistic strings and RTL/LTR runs show no clipped task-critical content, reversed meaning, or displaced action. |
| A5 | **Platform adapter** | One visual system spans different devices or interaction models. | Preserve the cross-platform intent, then adapt controls, navigation, focus, gestures, touch targets, typography, motion, and feedback to the target platform’s current HIG or design system. Record deliberate departures and their user benefit. | The design passes the target platform’s conventions and accessibility guidance without forcing a web, mobile, voice, TV, wearable, or spatial model onto another surface. |
| A6 | **Resilience envelope** | Slow network, offline use, timeout, permission denial, power loss, tracking loss, or peripheral failure can occur. | Define loading, empty, stale, offline, timeout, denial, retry, recovery, reset, and support handoff states. Treat performance, battery, thermal load, and physical context as UX constraints. | The product returns to a safe, comprehensible state after each applicable fault, with no silent loss or duplicate action. |
| A7 | **Ethical agency** | Conversion, consent, privacy, billing, cancellation, or defaults can steer people unfairly. | Make choices, costs, data use, cancellation, refusal, and consequences clear and symmetrical. Do not hide controls, preselect consequential choices, or add friction to exit. | Representative users can explain the choice, decline without penalty, cancel, and recover from a mistaken commitment. |

### Validation and governance

| ID | Primitive | Trigger | Invariant | Proof |
| --- | --- | --- | --- | --- |
| T1 | **Critical-path proof** | A change affects a must-work journey. | Exercise the smallest representative journey on the changed surface with behavior, visual thesis, and relevant state evidence. | The journey passes its behavior invariants and declared visual relationship at the target revision and environment. |
| T2 | **Risk-triggered pressure test** | A change touches a dimension that can fail elsewhere. | Expand only on evidence: shared layout → narrow/transition/wide; locale → long strings/RTL; auth → roles/session; browser API → relevant engines; integration → failure/retry/recovery; shared primitive → representative consumer and exception. | Every triggered cell is `passed`, `failed`, `untested`, or `not applicable` with a reason; no Cartesian matrix is implied by default. |
| T3 | **Decision ledger** | Several findings or stakeholders need alignment. | Record `evidence → consequence → hypothesis → correction → verification`, plus confidence, owner, residual risk, and whether the claim is observed, inferred, or unknown. | Another maintainer can reproduce why the change was selected and what remains unresolved. |
| T4 | **Change boundary** | A visual fix could expand into flow, copy, architecture, or accessibility certification. | Tie every source change to the authorized visual thesis and preserve behavior, content meaning, contracts, analytics, and test hooks. Hand off product strategy, brand creation, native UI, architecture, and formal conformance work. | The diff contains no unrelated workflow or dependency change; adjacent needs are named rather than silently absorbed. |

## Composition recipes

Select a small set; these are starting points, not mandatory checklists.

| Surface | Start with | Add when the risk exists |
| --- | --- | --- |
| Public/content website | E1, C1, C2, V1, V3, A1, A2, A6, T1 | A4 for localization; A7 for consent/cancellation; T2 for performance or shared components |
| Responsive web app/PWA | E1, E3, C3, C5, V1, V5, I1, I2, A1–A4, A6, T1 | I3 for offline/resume; T2 for browser, network, auth, or integration risks |
| Native iOS/iPadOS or Android | E1, C1, C3, C6, V5, I1–I3, A3, A5, A6, T1 | A4 for localization; T2 for orientation, fold/posture, multi-window, process recreation, or platform-specific input |
| Desktop workflow | E1, C1, C3, C6, V3, I1–I3, A3, A5, T1 | T2 for window resize, scaling, keyboard shortcuts, long-running work, or multiple OS targets |
| Voice/conversational | E1, E3, C1, C3, C5, C6, I2, I3, A5, A6, A7, T1 | T2 for recognition variance, silence, interruption, no-screen operation, privacy, or escalation |
| TV/10-foot, wearable, XR, kiosk, game, or IoT | E1, E3, C3, C6, I2, I3, A3, A5, A6, T1 | V5 for physical composition; A4 for language/direction; T2 for distance, movement, fatigue, peripherals, power, or tracking |
| Cross-channel service | E1–E4, C1, C3, C5, C6, V3, I3, A6, A7, T1–T3 | Add the surface recipe for every channel and verify handoffs rather than duplicating screen-level fixes |

## Mapping to the existing system

Keep responsibilities distinct:

| Layer | Owns | Example |
| --- | --- | --- |
| Token/primitive value | Raw reusable value | `space-3`, body line-height, border color, transition duration |
| Semantic role | Product meaning across themes and components | `surface-raised`, `text-secondary`, `action-primary`, `focus-ring` |
| UX primitive | Observable decision and behavior contract | `V1 hierarchy ladder`, `I1 state set`, `A4 localization and direction` |
| Component | Concrete implementation | Button, form field, table, dialog, navigation rail |
| Journey/service | End-to-end user outcome | Sign up, compare plans, submit a claim, recover after offline |

When a primitive exposes a repeated visual decision, correct the narrowest responsible layer in this order: reuse an existing semantic role; correct its application; refine the role; add a role only for a repeated product meaning; add a local exception only when collateral change is unacceptable. Never add a token to conceal an unresolved conceptual or state problem.

## Source-to-primitive map

| Source | Strongest contribution | Primitive IDs |
| --- | --- | --- |
| Norman, *The Design of Everyday Things* | Mental models, signifiers, mappings, feedback, error framing, human responsibility | C1–C3, C5–C6 |
| Tidwell, Brewer, Valencia, *Designing Interfaces* | Context, cognition, forms, wayfinding, patterns, systems, multi-channel interfaces | E1, C1–C4, V1–V5, I2 |
| Gothelf and Seiden, *Lean UX* | Outcomes, assumptions, hypotheses, experiments, collaborative research, design systems | E2, E4, T1–T3 |
| Hall, *Just Enough Research*; Portigal, *Interviewing Users* | Research questions, interviews, synthesis, impact, evidence quality | E1, E4, T3 |
| Liedtka, Ogilvie, Brozenske, *Designing for Growth Field Book* | Opportunity framing, criteria, ideation, prototypes, feedback, learning launches | E1–E2, E4, T1–T3 |
| Stickdorn et al., *This Is Service Design Doing*; Kalbach, *Mapping Experiences* | Journeys, handoffs, ecosystems, service blueprints, co-creation, service prototypes | E3–E4, C1, I3, A6, T1–T3 |
| Laws of UX | Cognitive load, grouping, recognition, attention, target acquisition, predictable behavior | C1–C4, V1–V3, I2 |
| Nielsen Norman Group heuristics | Visibility, consistency, control, recognition, prevention, flexibility, recovery | C2–C6, V1, I1, I3, A7 |
| GOV.UK Design System | Task-led content, plain labels, forms, errors, progressive disclosure, service patterns | C1–C5, V1, V3, A1, A4 |
| Inclusive Components | Semantic structure, disclosure, navigation, forms, resilient states, inclusive interaction | I1–I2, A1–A4, A6 |
| W3C WCAG 2.2 and ARIA APG | Perception, operation, semantics, names, states, keyboard and widget behavior | I1–I2, A1–A4, T1–T2 |
| Apple HIG; Material 3; other target-platform guidance | Transferable design principles plus target-native input, navigation, layout, state, accessibility, continuity, and adaptation | I2–I4, A3, A5–A6, T2 |

## Anti-patterns

- **Primitive inflation:** adding a named primitive for every component variant instead of correcting a shared role or behavior.
- **Checklist execution:** marking a primitive complete without observing the target surface or identifying a proof condition.
- **Book literalism:** copying an older implementation detail when current platform, accessibility, or browser guidance differs.
- **Universal UI:** applying a web pattern to touch, keyboard, remote, voice, wearable, or spatial interaction without an adapter.
- **Decorative abstraction:** creating tokens for gradients, shadows, or spacing before clarifying grouping, hierarchy, state, or task intent.
- **Research theatre:** producing personas, maps, or canvases with no decision, owner, evidence, or next test.
- **Conformance overclaim:** treating a scanner, a few contrast pairs, or a successful happy path as proof of complete usability or accessibility.
