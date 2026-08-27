# Diagnostic matrix

Use this matrix to turn subjective feedback into testable system hypotheses. Start with rendered evidence. Select only rows supported by the target surface.

| Observed symptom | Inspect | Likely system fault | High-leverage correction | Verify |
| --- | --- | --- | --- | --- |
| “Everything competes” | headings, actions, saturated color, borders, elevation | too many elements share the strongest emphasis | assign one dominant action and reduce emphasis by role | first-glance reading order matches task priority |
| “Nothing stands out” | title/body contrast, action placement, group separation | roles are too similar or the primary intent is not represented | increase relative contrast and place the primary action with its decision context | users can identify page purpose and next action without scanning every control |
| “It feels cramped” | line length, control insets, stack gaps, edge proximity | internal and external spacing are conflated | separate inset, item, group, and section rhythms | related items remain close while groups become legible |
| “It feels empty” | oversized gaps, weak content measures, unanchored controls | space lacks a grouping job or content width is unconstrained | tighten related regions and give empty space a structural boundary | wide layouts retain intentional alignment without scattered islands |
| “Too many cards” | repeated border/radius/shadow combinations | containment is being used instead of hierarchy or whitespace | keep chrome only for interactive, elevated, or independently grouped regions | scanning improves after decoration is removed |
| “Looks generic” | stock gradients, interchangeable cards, default iconography | decoration is carrying identity instead of product meaning | foreground real content, domain structure, purposeful imagery, or signature interaction | the interface remains identifiable in grayscale or without ornamental effects |
| “Dense data is hard to scan” | column alignment, labels, row rhythm, truncation, actions | data and controls lack stable comparison axes | align comparable values, de-emphasize metadata, reveal secondary actions contextually | users can compare key values row by row and reach full content |
| “The form is exhausting” | sectioning, label clarity, help/error placement, action hierarchy | fields are presented as an undifferentiated sequence | group by decision, reduce competing text, keep feedback adjacent to its field | reading order, error recovery, and submit intent remain obvious |
| “Mobile is a squeezed desktop” | fixed widths, multi-column persistence, toolbars, overflow | layout scales without recomposing | stack or reorder by task priority; wrap or collapse secondary controls | no content loss, two-axis scrolling, or displaced primary action at narrow width |
| “Wide screens feel broken” | unlimited measures, edge-to-edge rows, distant labels/actions | containers lack purposeful maximums or grid anchors | bound reading measures and align regions on shared tracks | related content stays perceptually connected at wide width |
| “Dark mode is muddy” | surface steps, translucent layers, low-chroma text, shadows | light-mode values were inverted rather than re-authored by role | establish dark surface and text roles, then validate computed pairs | layers, focus, borders, and text remain distinguishable without glow or excess contrast |
| “Interactions feel unfinished” | hover, pressed, focus-visible, disabled, loading, errors | components define a rest state but not a state system | specify every applicable state with shape, text, icon, or motion cues | keyboard and pointer paths expose consistent, non-color-only feedback |
| “RTL/localization breaks it” | physical properties, directional icons, fixed labels, truncation | geometry or content assumptions are encoded locally | use logical properties and stress with long strings and actual direction state | semantic reading/focus order survives direction and content expansion |
| “Animation feels cheap” | unrelated easing, long travel, layout thrash, no reduced-motion path | motion decorates instead of explaining state change | use short causal transitions and a reduced-motion equivalent | change remains understandable with motion reduced or disabled |
| “The page changed but still looks inconsistent” | one-off values and component variants | symptoms were edited locally while shared roles stayed contradictory | consolidate repeated decisions at the narrowest shared layer | affected components agree without forcing unrelated surfaces to change |

## Prioritize findings

Use four priority bands:

- **Blocker:** content, control, focus, or state becomes unavailable or misleading.
- **High:** task hierarchy, error recovery, or responsive composition materially impairs use.
- **Medium:** repeated system inconsistency increases scanning or comprehension cost.
- **Low:** localized polish with limited effect on task completion or system coherence.

For each finding, record `evidence -> consequence -> root-cause hypothesis -> correction -> verification`. Combine findings only when the same system fault explains them. Keep disagreements or unknown states visible.

## Avoid false diagnosis

- A low-density interface is not automatically clearer; inspect task frequency and comparison needs.
- A large heading is not automatically dominant; surrounding color, placement, and whitespace may overpower it.
- More contrast is not always better; reserve the strongest contrast for content and actions that need it.
- Consistency is not sameness; deliberate exceptions need a user or content reason.
- A screenshot cannot establish keyboard behavior, responsive transitions, live states, or semantic correctness.
