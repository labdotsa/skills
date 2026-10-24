# Design resource routing

**Verification date:** 2026-10-24

This note routes external design resources into the repository’s existing skill boundaries. It is advisory guidance, not an implementation plan.

## UX principles and platform references

Route [Laws of UX](https://lawsofux.com/) as a principles collection, not as a compliance standard. Route [Nielsen Norman Group’s ten usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) as broad rules of thumb that support structured evaluation. Route the [GOV.UK Design System](https://design-system.service.gov.uk/) for public-sector styles, components, and common-task patterns. Route [Inclusive Components](https://inclusive-components.design/) for accessible web-component articles; its 2017–18 publication context means current WCAG and WAI-ARIA Authoring Practices should govern exact implementation. Treat [Apple’s Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) as essential design guidance for every platform. Apply its [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) across targets, then adapt controls and behavior to the actual platform.

The existing [`ux-ui-system-refactor`](../../skills/ux-ui-system-refactor/SKILL.md) references already cite NN/g, WCAG/APG, Apple HIG, and Material 3, and organize them as invariants, proof, and adapters. Extend those references with the principles and craft material above. Do not create one skill per source.

## Repository-owned skill routing

The stable design category contains `deconstruct`, `ux-ui-system-refactor`, `usability-audit`, and `design-system`. Related repository-owned skills are `information-architecture`, `public-pages`, `tailwind`, `copywriting`, `product-diagnosis`, and `validate-prototype`.

Use `ux-ui-system-refactor` for design principles, craft review, and implementation guidance, including the rule-based checks and anti-slop checks from [Impeccable](https://github.com/pbakaus/impeccable). Use `deconstruct` when extracting a reusable interface system from an existing visual source. Keep `validate-prototype` responsible for functional journey acceptance and retesting after changes.

## Stable and proposed dedicated boundaries

The stable [`usability-audit`](../../skills/usability-audit/SKILL.md) skill provides evidence-bound heuristic review across screens, states, and journeys. It produces read-only findings and annotation artifacts. A finding preserves this chain:

`finding → task/state → heuristic → exact element or region (or observed absence) → screenshot marker/bounds + accessible locator where possible → evidence → consequence → severity/confidence → recommendation → retest`

Heuristic judgments remain hypotheses when user research is needed. The workflow must not force a violation on every screen or trigger blanket visual restyling.

The stable [`design-system`](../../skills/design-system/SKILL.md) skill covers brief-to-tokens/components work. [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) is a useful external implementation option for that boundary, not a reason to copy its catalogs into this repository.

Create a dedicated **diagram-design** skill for HTML/SVG diagram authoring when that workflow becomes a supported repository capability. [diagram-design](https://github.com/cathrynlavery/diagram-design) is an agent skill/plugin with 45 diagram types, Mermaid/draw.io/Excalidraw imports, SVG/PNG export, and brand onboarding; its code and docs are MIT.

An optional future **product-video-production** skill could define Remotion and HyperFrames adapters, the Shotcraft workflow, and Lemo style references. [HyperFrames](https://github.com/heygen-com/hyperframes) is an HTML video runtime/ecosystem with CLI/Studio, FFmpeg/Puppeteer rendering, components, and agent skills; it is Apache-2. [Remotion](https://github.com/remotion-dev/remotion) is a React video runtime with Studio, renderers, and agent skills, with special licensing considerations. [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) provides the product-page capture, shot-library, Remotion, sound, and QA workflow. [Lemo Opuscar](https://github.com/lemomo-ai/lemo-opuscar) is a film-style/directing library with 59 code-film styles, styleboards, and a plugin; code/docs are MIT while demo stills/films and other assets have separate licenses. Keep this boundary separate from interface design and generic animation review.

## Specialized creative and integration tools

Use [img2threejs](https://github.com/img2threejs/img2threejs) as a specialized procedural-3D skill: it reconstructs reference images as code-only, animation-ready Three.js scenes. It should remain separate from `deconstruct` and general image-to-code work.

Use [MCP for Blender](https://github.com/ahujasid/blender-mcp) as an optional external connector/runtime: it connects an MCP server and Blender addon for prompt-assisted modeling and scene manipulation. It is not a core design skill; add a scoped workflow skill only if Blender support is an explicit repository capability.

Penpot should follow the same rule: treat it as an external design-file tool/connector, with a scoped workflow skill only if the repository supports reading or authoring Penpot files.

[Penpot](https://github.com/penpot/penpot) is an open-source design/prototyping/collaboration platform with tokens, components, inspect, plugins, APIs, and MCP support; its repository is MPL-2.0. It is an external platform, not a repository-owned skill.

Globally available `hallmark`, `frontend-design`, `review-animations`, `remotion-best-practices`, and `visualize` are not repository-owned stable skills. They may inform workflows when available, but they should not be represented as current catalog coverage.

## Verified repository resources

All ten GitHub repositories were checked on 2026-10-24 through their public repository pages and rendered README content. The pages showed these practical classifications for the first five; the other five are classified in the sections above:

- Impeccable: agent design-quality skill/toolset; Apache-2.0.
- UI UX Pro Max: agent skill for design-system generation and UX guidance; MIT.
- MCP for Blender: MCP connector/runtime plus Blender addon; MIT.
- img2threejs: installable procedural Three.js reconstruction skill and harness; Apache-2.0.
- video-shotcraft: Codex/Claude skill and Remotion product-video workflow; Apache-2.0 for code/docs, with separate audio and Remotion licensing considerations.

Verification was README-only. No repository was installed or executed, no full source tree or transitive dependency audit was performed, and bundled audio, model, or runtime licenses were not exhaustively checked. Star counts and repository metadata are time-sensitive and should not be treated as design-quality evidence.
