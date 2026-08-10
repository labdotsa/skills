---
name: tailwind
description: >
  Design, migrate, implement, and review production Tailwind CSS systems across
  Tailwind v4 adoption, responsive breakpoint and visibility architecture, and
  localization-safe LTR/RTL layouts. Use for Tailwind configuration or migration,
  responsive component behavior, logical direction utilities, or any task that
  combines these concerns.
metadata:
  author: labdotsa
  category: frontend
---

# Tailwind Engineering

Treat Tailwind as one UI system. Resolve build architecture, responsive behavior, and directionality together instead of applying isolated class substitutions.

## Route the task

Read only the references needed for the request:

- **Tailwind v4 setup, migration, class detection, plugins, or version conflicts:** read [references/v4-adoption.md](references/v4-adoption.md).
- **Breakpoints, visibility, layout transformations, or information priority:** read [references/responsive-layout.md](references/responsive-layout.md).
- **Localization, RTL/LTR mirroring, logical spacing, positioning, borders, or corners:** read [references/localizable-layout.md](references/localizable-layout.md).

Read multiple references when concerns overlap. A responsive navigation component for an Arabic product, for example, requires both responsive and localizable layout guidance. A v3-to-v4 migration of that component requires all three.

## Shared workflow

1. Inspect the Tailwind version, build pipeline, content sources, component structure, supported widths, and supported directions.
2. Classify content by priority before changing layout or visibility.
3. Establish the mobile base without breakpoint prefixes, then add the smallest necessary set of min-width overrides.
4. Express inline direction with logical start/end utilities unless the design intentionally must not mirror.
5. Keep one Tailwind version per CSS scope and ensure the build plugin matches that version.
6. Preserve state and breakpoint modifiers when replacing utilities.
7. Validate generated CSS, keyboard and screen-reader behavior, representative viewport widths, and both `dir="ltr"` and `dir="rtl"` when localization applies.

## Invariants

- Keep the core task usable at the smallest supported width.
- Do not hide essential content or duplicate interactive controls across breakpoints.
- Do not introduce physical left/right utilities for an inline-direction intent.
- Do not mix Tailwind v3 and v4 in one bundle or DOM scope without explicit isolation.
- Do not construct class names dynamically when the Tailwind scanner cannot detect them.
- Justify physical positioning, visual reordering, and duplicated markup as explicit exceptions.

## Output contract

Report:

- the Tailwind version and relevant build assumptions;
- which reference concerns were applied;
- the responsive and directionality behavior that changed;
- any migration or compatibility risk; and
- the widths, directions, and build output used to validate the result.
