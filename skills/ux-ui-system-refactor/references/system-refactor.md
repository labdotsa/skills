# System-aware refactoring

Use this reference when a visual correction crosses component or token boundaries. The goal is to improve the existing system at the narrowest responsible layer, not invent a parallel system.

## Build a decision ledger

Trace each visual decision through three levels:

| Level | Examples | Refactor rule |
| --- | --- | --- |
| Primitive | color, space, type size, radius, border, shadow, duration | change only when the raw value itself is wrong across several roles |
| Semantic role | surface, text-muted, action-primary, stack-group, title-page | prefer this level when meaning stays stable across themes and components |
| Component decision | button emphasis, table row rhythm, panel containment | keep here when the behavior or visual rule belongs to one component family |

Inventory the current source of truth, consumers, exceptions, and supported modes before changing a shared value. Search usages; do not assume a token name describes every consumer correctly.

## Preserve before extending

Use this sequence:

1. Reuse a suitable existing role or primitive.
2. Correct an incorrectly applied role at the component boundary.
3. Refine a semantic role when all of its consumers should move together.
4. Add a role when a repeated product meaning has no representation.
5. Add a local exception only when a shared role would create collateral change.

Do not replace a token architecture, CSS methodology, component library, icon set, or typography stack as incidental cleanup. Record genuinely obsolete rules and remove them only after confirming there are no consumers, aliases, runtime references, or publication dependencies.

## Use a compact role vocabulary

When the project has no useful system, derive only the roles required by the target surface:

- **Space:** control inset, item gap, group stack, section stack, page gutter.
- **Type:** body, supporting, label, section title, page title, data emphasis.
- **Color:** canvas, surface, raised surface, text, secondary text, border, primary action, focus, positive, warning, danger.
- **Shape:** control, container, and fully rounded roles only when the product uses them.
- **Elevation:** separate overlay, raised interactive region, and ordinary grouping; ordinary sections may need none.
- **Motion:** immediate feedback, local state transition, and composition transition, each with a reduced-motion path.

Names should communicate meaning, not a single current value. Keep the set intentionally small until multiple real consumers prove another role.

## Typography

- Preserve the established family unless typography replacement is explicitly in scope.
- Establish roles through size, weight, line height, letter spacing, width, and surrounding space as a coordinated relationship.
- Keep reading measures bounded by content and language, not a universal character count.
- Use tabular numerals where rapid numeric comparison requires stable columns.
- Keep semantic headings in a logical outline even when visual roles differ.
- Stress labels and controls with long translations; avoid solving overflow by making essential text unreadably small.

## Color and themes

- Author in the project's existing color format. Modern perceptual spaces such as OKLCH can make systematic scales easier, but they are not a conformance result.
- Validate actual computed opaque foreground/background colors after gamut mapping, variables, opacity, overlays, and theme resolution.
- Use `scripts/check-contrast.mjs` for explicit text or UI pairs. Supply the applicable threshold from the product's accessibility target; omission defaults to `4.5`.
- Do not infer accessibility from a palette generator, design-tool label, framework class name, or passing one pair.
- Test focus, selection, disabled, destructive, placeholder, link, and text-over-image states separately when used.
- In dark themes, re-establish role relationships; do not mechanically invert or increase every contrast.

## Space, containment, and elevation

- Derive space from relationships: inside an item, between peers, between groups, and between sections.
- Repeated geometry should align to shared tracks or edges; optical exceptions should be explicit.
- Prefer whitespace or dividers for ordinary grouping. Add a surface, border, radius, or elevation when it communicates interaction, containment, layering, or separation.
- Avoid stacking borders, shadows, and tinted surfaces without separate jobs.
- Keep touch and pointer target behavior intact even when visible controls become quieter.

## Responsive composition

Use existing breakpoints or container queries. When absent, identify transitions by content pressure:

- When do labels collide or actions wrap ambiguously?
- When does comparison require a table rather than cards, or vice versa?
- Which region can move, collapse, scroll locally, or disclose on demand without losing task context?
- What must remain adjacent to the content it controls?

Prefer intrinsic sizing, normal flow, grid/flex wrapping, bounded measures, and logical properties. Treat horizontal scrolling as an intentional data-preservation strategy only for content that genuinely needs two-dimensional comparison.

Keep DOM reading and focus order semantic. Avoid using CSS reordering to repair an information-order problem.

## States and content resilience

For each changed interactive family, identify applicable rest, hover, focus-visible, pressed, selected, disabled, loading, empty, success, warning, and error states. Preserve state semantics and announcements.

Stress with:

- shortest and longest realistic content;
- missing and optional metadata;
- wrapping labels and validation messages;
- zero, one, and many records;
- slow or failed media;
- LTR and RTL when the product supports both;
- user zoom, increased text size, and reduced motion.

Add truncation only when the complete value remains available through an appropriate interaction or adjacent detail view. Never hide task-critical or error-recovery content solely to preserve geometry.

## Control exceptions

Every new arbitrary value or local override should answer:

1. Which observed problem does it solve?
2. Why is an existing semantic role insufficient?
3. Which states, themes, directions, and widths consume it?
4. How will a future maintainer know whether it is still needed?

If those answers are weak, prefer a role correction or remove the exception.
