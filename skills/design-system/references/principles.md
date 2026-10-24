# Design principles and authority

Use these sources as decision aids, not as copied catalogs or proof of compliance:

| Source | Use it for | Boundary |
| --- | --- | --- |
| [Laws of UX](https://lawsofux.com/) | Cognitive load, grouping, attention, predictability, and behavior-informed hypotheses | A principle collection; do not turn a named law into a universal rule without task evidence. |
| [Nielsen Norman Group heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) | Visibility, consistency, control, prevention, recognition, flexibility, and recovery | Broad inspection vocabulary; findings remain hypotheses when user evidence is missing. |
| [GOV.UK Design System](https://design-system.service.gov.uk/) | Task-led content, forms, plain language, service patterns, and inclusive public interaction | Adapt patterns to context; do not copy its visual language or assume public-sector constraints. |
| [Inclusive Components](https://inclusive-components.design/) | Semantic, resilient web component ideas and accessible interaction patterns | Older articles are useful craft guidance; current WCAG and WAI-ARIA APG govern exact implementation. |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/design-principles) | Universal design principles and platform-specific adaptations | Essential for every design-system decision, including non-Apple targets; separate principles from Apple controls. |

## HIG as a universal lens

Apply the current HIG principles—Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, and Delight—as questions for every target:

- Is the purpose and next useful action clear?
- Can the person control, interrupt, undo, decline, and recover from consequential actions?
- Are defaults, data use, costs, errors, and system responsibility understandable?
- Does the interaction use familiar concepts while preserving product-specific meaning?
- Does it flex for content, language, ability, context, and input mode?
- Is complexity removed from the user's task rather than hidden behind decoration?
- Are details, states, performance, and accessibility treated as part of craft?
- Does the experience add appropriate confidence or delight without weakening clarity?

These principles transfer across web, Android, desktop, voice, TV, wearable, kiosk, and spatial surfaces. The controls that express them do not. Use current platform guidance for navigation, focus, touch targets, safe areas, gestures, system chrome, dynamic type, keyboard shortcuts, remote focus, voice turns, and motion. Record the chosen adapter and the user benefit when departing from a platform convention.

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) and the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) are implementation authorities for applicable web semantics and widgets. Platform guidance remains authoritative for platform-specific behavior. None of these sources alone proves usability, accessibility conformance, or product success.
