---
name: deconstruct
description: Deconstruct UI sources into hierarchical, reusable, customizable component systems. Use when a screenshot, mockup, design file, live interface, or existing UI code must be analyzed into visual regions, responsibility boundaries, stack-native contracts, adaptive layouts, interaction states, and explicit uncertainties before implementation.
metadata:
  author: labdotsa
  category: design
---

# Deconstruct

Turn UI evidence into a responsibility tree:

`evidence -> regions -> responsibilities -> component boundaries -> contracts -> constraints`

Match the requested mode. Produce analysis and contracts for a deconstruction request; add implementation only when the user asks for code changes.

## 1. Establish the source and stack

Inspect every supplied UI source. When a project is available, inspect the nearest application manifests, configuration, lockfiles, source extensions, component conventions, design-system imports, styling system, localization setup, direction handling, and breakpoint definitions.

Choose examples in this order:

1. Use the stack explicitly requested by the user.
2. Use the detected stack and its established component, styling, and localization idioms.
3. When no application UI stack can be found or inferred, state that fact and fall back to React with TypeScript for illustrative code.

When several stacks are present, select the one containing or nearest to the target UI and cite the evidence for that selection.

**Complete when:** the response names the source type, selected stack, supporting evidence, any material ambiguity, and an explicit reason for a fallback.

## 2. Separate evidence from inference

Inventory the screen before naming components. Capture visible regions, content, whitespace, alignment, containment, repetition, hierarchy, typography, color, imagery, controls, and apparent anchors.

Classify findings as:

- **Observed** — directly supported by the source.
- **Inferred** — a likely structural or behavioral explanation.
- **Unknown** — a state or rule the source cannot establish.

Treat measurements from raster images as approximate. Identify invisible but relevant states and label their design as unknown or proposed.

**Complete when:** every visible element belongs to one region, every claimed behavior has an evidence class, and all consequential unknowns are recorded.

## 3. Build the responsibility tree

Decompose by responsibility rather than by visual node:

1. **Screen or route** — own domain state, data, validation, submission, navigation, and analytics.
2. **Layout template** — own safe areas, reading order, region flow, slots, and adaptive positioning.
3. **Composite** — combine primitives into a stable semantic unit such as a form field, notice, toolbar, or card.
4. **Primitive** — provide generic behavior such as text, icon button, input, avatar, or button; prefer the project's existing design system.
5. **Content or asset** — supply copy, icons, illustrations, and data while remaining behavior-free.

Extract a component when it has an independent responsibility, a meaningful customization contract, reuse potential, isolated behavior/state, or an established design-system counterpart. Keep one-off structure with its nearest responsible owner.

Represent layout mechanics that affect behavior—flexible spacers, scroll regions, sticky areas, overlays, and safe-area boundaries—in the tree.

**Complete when:** every node has one clear owner, every extracted boundary has a reason, and domain behavior stays above reusable presentation.

## 4. Define stack-native contracts

For each reusable component, specify:

- Level and responsibility
- Owned state versus controlled state
- Inputs, outputs, events, slots, and variants
- Content and asset injection points
- Accessibility semantics
- Reuse scope and likely file location
- Evidence supporting the boundary

Express names, types, composition, slots, events, and styling in the detected framework's conventions. Reuse existing project primitives and tokens before proposing additions. Keep code illustrative unless implementation is requested.

**Complete when:** each reusable node can be implemented from its contract while remaining free of screen-specific domain behavior, and every code example matches the selected stack.

## 5. Build the adaptive constraint map

Model available space and inline direction as independent axes.

### Space and breakpoints

Use project breakpoints and container-query conventions when present. Otherwise propose content-pressure transitions—compact, regular, and wide—and label them as inferred. Describe a layout change at each relevant transition instead of scaling the source uniformly.

Prefer intrinsic sizing, normal flow, flex/grid equivalents, wrapping, `min`/`max`/`clamp` equivalents, and bounded content widths. Reserve fixed or absolute positioning for evidence-backed overlays, deliberate overlap, or platform chrome.

Account for narrow containers, wide screens, safe areas, browser or system chrome, on-screen keyboards, zoom, dynamic type, long localized strings, and overflow.

Report a breakpoint matrix:

| Range or condition | Composition | Width/alignment | Positioning | Wrap/overflow behavior |
|---|---|---|---|---|

### Direction and localization

Express geometry with the stack's logical concepts: inline/block and start/end, or its native leading/trailing equivalents. Derive direction from the project's locale or direction state.

Preserve semantic reading and focus order while allowing visual alignment, region order, edge anchoring, controls, gestures, and directional icons to adapt. Distinguish assets that mirror from assets that remain invariant.

Report a direction matrix:

| Region or component | LTR | RTL | Invariant behavior | Directional assets |
|---|---|---|---|---|

**Complete when:** every major region has behavior for each supported project breakpoint and both directions, with flexible positioning and overflow rules stated.

## 6. Inventory behavior and accessibility

Cover the relevant empty, focus, hover, pressed, disabled, loading, success, validation-error, submission-error, and keyboard-visible states. Include labels, heading structure, focus order, touch targets, contrast, reduced motion, image semantics, and error announcement behavior.

Mark state visuals absent from the source as unknown or proposed.

**Complete when:** every interactive component has applicable states and semantics, and unseen behavior remains distinguishable from evidence.

## Output contract

Return the deconstruction in this order:

1. One-line design read
2. Source and stack basis
3. Observed visual hierarchy
4. Responsibility tree
5. Component contract table
6. Stack-native composition example when useful
7. Breakpoint matrix
8. Direction matrix
9. State and accessibility inventory
10. Approximate tokens or measurements
11. Unknowns, assumptions, and material UX concerns

Finish only after every observed element maps to the tree, every reusable component has a customization contract, every code example is stack-native or an announced React/TypeScript fallback, and the adaptive constraint map covers space and direction.
