---
name: design-system
description: Design or evolve a product design system from a brief, existing interface, or implementation evidence, including semantic tokens, component contracts, states, and cross-platform adaptations. Use for greenfield systems or substantial system changes; use an existing-system refactor, UI deconstruction, usability audit, information architecture, or product implementation workflow when that is the primary need.
license: MIT
metadata:
  author: labdotsa
  category: design
  status: stable
---

# Design System

Create the smallest coherent system that helps a product express its intent consistently across surfaces. A design system here means semantic roles, tokens, component contracts, variants, states, and platform adapters—not a copied component catalog or a replacement for product strategy, brand identity, information architecture, or application implementation.

## Establish the decision

Name the audience, task, target surfaces, product character, existing system, stack, locales, directions, input modes, themes, constraints, and success signal. Inspect the actual repository and rendered interface when available. Preserve working conventions and evidence; do not introduce a second styling vocabulary, dependency, or architecture just to make the system look complete.

Always read [principles.md](references/principles.md) first. Its HIG lens applies to every target, including web, Android, desktop, voice, TV, wearable, kiosk, and spatial work. Then read only the other references needed for the request:

- [token-contract.md](references/token-contract.md) for semantic roles, themes, and token evolution.
- [component-contract.md](references/component-contract.md) for ownership, variants, states, and accessibility contracts.
- [platform-adaptation.md](references/platform-adaptation.md) for cross-platform decisions and HIG adapters.

## Build and evolve the system

1. Frame the design problem and separate observations, inferences, assumptions, and unknowns.
2. Inventory existing tokens, primitives, components, states, content pressure, and platform constraints before adding anything.
3. Define a small set of principles and semantic roles tied to user intent. Prefer aliases over raw-value proliferation.
4. Specify component ownership, composition, variants, states, content limits, accessibility semantics, and input behavior.
5. Apply the Human Interface Guidelines as an essential lens for every target. Preserve transferable principles first; adapt controls, navigation, typography, safe areas, gestures, focus, motion, system chrome, and feedback to the actual surface. Do not copy Apple-only controls onto another platform.
6. Provide implementation-neutral examples or stack-native handoff details only when the repository supports them. Do not silently upgrade dependencies or redesign product flows.
7. Verify representative rendered states, responsive pressure, localization and direction, themes, reduced motion, and required input modes. Record untested conditions and deliberate departures.

For a narrow request, produce only the relevant roles, contract, or adapter. Do not impose arbitrary token counts, component inventories, or artifacts.

## Return a usable handoff

Report the design thesis, evidence and unknowns, semantic token/role decisions, component contract matrix, platform adaptations, implementation boundary, and verification conditions. Route primary concerns elsewhere: existing-system visual changes to a refactor workflow, source reconstruction to UI deconstruction, heuristic diagnosis to a usability audit, content/navigation structure to information architecture, and end-to-end journey checking to prototype validation.

Use [evals/cases.yaml](evals/cases.yaml) when evaluating changes to this skill. The cases test decisions and boundaries, not visual quality or platform compliance by themselves.
