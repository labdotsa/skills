# Semantic token contract

Design tokens should make repeated product meaning explicit. Start with roles, then map roles to theme values and platform output. Keep raw values private to the theme or implementation layer unless a value is itself a documented product decision.

## Layers

| Layer | Owns | Example |
| --- | --- | --- |
| Reference value | Palette, type family, scale, duration, elevation, or grid value | `blue-600`, `space-3`, `font-body` |
| Semantic role | Meaning shared by components and states | `surface-raised`, `text-secondary`, `action-primary`, `focus-ring` |
| Component role | A bounded contract for one component | `button-primary-background`, `field-error-border` |
| Platform output | Target syntax and constraints | CSS custom property, SwiftUI value, Compose token |

Use aliases to support light/dark/high-contrast themes and brand evolution. Keep contrast, focus visibility, text resizing, reduced motion, and disabled/error distinctions in the role contract. Validate resolved foreground/background pairs rather than names or source color models.

## Concrete alias example

One compact contract can map a reference value through a semantic role to a component role and then to each platform:

```text
reference: blue-600 = #2563eb; blue-400 = #60a5fa
semantic: action-primary = blue-600 (light), blue-400 (dark)
component: button-primary-background = action-primary
platform: --color-action-primary (web), AppDefinedButton.primaryBackground
          (illustrative iOS mapping), MaterialTheme.colorScheme.primary (Android)
```

Acceptance is observable: the button uses the component role in both themes, its foreground and focus roles remain distinct, and each platform output resolves to the same intended action meaning. This example does not claim a measured contrast result; compute and test the resolved pairs for the actual type, state, opacity, and theme.

## Evolution rules

- Reuse an existing role when the meaning is unchanged.
- Add a role when a repeated meaning cannot safely share an existing role.
- Add a component role when a component state needs a stable semantic distinction.
- Keep a local exception when changing a shared role would cause unrelated collateral change; document why and when to revisit it.
- Deprecate aliases deliberately and preserve a migration path; do not rename values merely for aesthetics.
- Reject alias cycles and missing references before publication; a token must resolve to a concrete value for every supported theme/platform.
- Do not share a semantic role when the user meaning, state, or contrast requirement differs merely because the values currently match.
- For breaking changes, inventory consumers, affected states/themes/platforms, migration steps, owner, and verification evidence before changing the role.

Token decisions must follow content hierarchy, interaction state, localization, and platform constraints. A large palette, arbitrary spacing scale, or one token per component is not evidence of a usable system.
