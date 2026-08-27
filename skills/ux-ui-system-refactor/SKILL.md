---
name: ux-ui-system-refactor
description: Refactor the UX/UI system of an existing web interface while preserving its behavior, content meaning, and established stack. Use for requests to polish, clean up, modernize, simplify, or improve hierarchy, spacing, typography, density, color roles, responsive composition, interaction states, accessibility indicators, localization, or visual consistency in an implemented web UI. Do not use for product-flow redesign, greenfield brand direction, native-platform UI, source-to-component deconstruction, or standalone accessibility certification.
metadata:
  author: labdotsa
  category: design
---

# UX/UI System Refactor

Improve an existing web interface as a coherent system. Preserve what the product does; change how clearly, consistently, and resiliently the interface communicates it.

## Hold the boundary

Match the user's requested mode:

- For an audit or critique, inspect and report without editing.
- For a refactor, implement and verify the authorized changes.
- For mixed work, record the original state, diagnose first, then implement the agreed or clearly requested scope.

Keep behavior, information architecture, content meaning, analytics, and public component contracts unchanged unless the user explicitly includes them. Do not activate merely because UI code exists.

Hand off or separate the work when the primary need is user-flow strategy, brand creation, source-to-component reconstruction, native-platform conventions, broad frontend architecture, or formal accessibility conformance. A visual refactor may reveal those needs; it does not silently absorb them.

## Load detail only when needed

- Read [references/diagnostic-matrix.md](references/diagnostic-matrix.md) when the complaint is vague, the UI needs an audit, or several symptoms compete for attention.
- Read [references/system-refactor.md](references/system-refactor.md) before changing shared tokens, primitives, responsive rules, themes, or several related components.
- Read [references/ux-primitives.md](references/ux-primitives.md) when turning UX or design-thinking research into reusable decision contracts, selecting a small primitive set for a refactor, or adapting a shared intent across web, mobile, desktop, voice, TV, wearable, spatial, or embedded surfaces.
- Read [references/verification.md](references/verification.md) before finalizing an implementation or making an evidence-backed quality claim.
- Run `node scripts/check-contrast.mjs <pairs.json>` when color roles change or contrast is uncertain. Feed it computed opaque `rgb(...)` or hex values, not unresolved CSS variables.

## Run the refactor loop

### 1. Freeze the contract

Name the target surface, primary user intent, requested mode, behaviors that must remain invariant, supported themes/locales/directions, relevant viewports, and explicit non-goals. Inspect repository instructions and the active diff before touching files.

When intent is ambiguous, prefer the smallest reversible visual correction supported by evidence. Stop for direction only when a change would alter product meaning, workflow, or brand identity.

### 2. Observe the rendered interface first

Use a runnable application, browser, screenshots, or supplied design evidence. Record the current hierarchy, grouping, density, alignment, reading order, state visibility, overflow, and responsive behavior before tracing source code.

Separate:

- **observed** symptoms from the rendered interface;
- **inferred** causes that source inspection may confirm;
- **unknown** states or constraints that were not available.

Do not diagnose visual quality from class names alone when rendered evidence is available.

### 3. Inspect the local system

Find the nearest theme, token source, utilities, component primitives, typography rules, breakpoints or container queries, direction handling, localization setup, and state conventions. Identify which decisions are intentional, repeated, exceptional, or accidental.

Prefer established primitives and semantic roles. Add or change a shared rule only when multiple affected decisions should move together. Avoid introducing a second styling vocabulary or replacing the design system during a local refactor.

### 4. Diagnose relationships, not decorations

Rank root causes by user consequence and visual leverage:

1. semantics, operability, state visibility, and content loss;
2. hierarchy, reading order, grouping, and primary-action clarity;
3. spatial rhythm, density, alignment, and responsive composition;
4. typography, color roles, borders, elevation, imagery, and motion;
5. product-specific character and finishing details.

Connect each proposed change to an observed symptom and a verification condition. Prefer one system correction that resolves several symptoms over isolated local tweaks.

### 5. Choose the smallest coherent correction

Write a short change thesis, for example: “reduce competing containers, establish one section rhythm, and make the primary action dominant without changing the form flow.” Then define the affected roles, components, states, and widths.

Use these decision rules:

- Hierarchy comes from relative emphasis, order, spacing, measure, and contrast; font size alone is insufficient.
- Spacing expresses relationship. Tighten items that belong together before adding larger separation between groups.
- Typography uses a small set of content roles. HTML semantics and visual roles should reinforce each other but need not share names.
- Color is role-based. Validate computed foreground/background pairs; never infer contrast from hue names or a color model.
- Containers earn their chrome through grouping, interaction, separation, or elevation. Do not box every region by default.
- Responsive design changes composition when content pressure demands it. Do not uniformly shrink a desktop arrangement.
- States must remain distinguishable without relying on color alone. Include focus-visible, disabled, loading, empty, success, and error states when applicable.
- Motion should explain change, preserve causality, and respect reduced-motion preferences.
- Distinctiveness should come from product content, structure, typography, imagery, or interaction—not interchangeable decoration.

### 6. Implement inside the existing stack

Make the smallest source changes that express the thesis. Consolidate repeated arbitrary values into existing roles where appropriate; remove obsolete exceptions only after proving they have no remaining consumer. Preserve DOM order, labels, focus behavior, event wiring, data contracts, and test hooks unless the authorized scope requires otherwise.

Keep refactoring separate from unrelated component extraction, dependency upgrades, copy rewrites, or workflow changes. If an adjacent defect blocks the requested visual outcome, report it and change it only when authorization is clear.

### 7. Verify under pressure

Revisit the rendered interface after implementation. Check the changed surface at the narrowest supported width, a transition width, and a wide width; both supported themes; keyboard focus; zoom/reflow; long or localized content; applicable RTL; reduced motion; and relevant loading, empty, success, and error states.

Scale verification to risk rather than multiplying every dimension. Use repository-native checks first. Preserve failures and unresolved gaps instead of treating build success or a clean automated scan as proof of visual quality or accessibility conformance.

## Return a decision-ready result

For an audit, report:

1. the design read and evidence available;
2. prioritized root causes, with observed/inferred/unknown status;
3. the smallest coherent change thesis;
4. affected system roles and representative corrections;
5. verification conditions, risks, and boundaries.

For an implementation, report:

1. the outcome and preserved invariants;
2. the shared system changes and material local exceptions;
3. checks run and the states or widths actually observed;
4. remaining untested conditions or adjacent product decisions.

Do not bury the result in a property-by-property inventory. Finish when the requested surface expresses a coherent hierarchy, the relevant stress conditions have evidence, and every material exception or gap is explicit.
