# Existing Discovery Site prototype acceptance

Status: accepted human decision for
[Prototype a representative component vertical slice](https://github.com/labdotsa/skills/issues/11), recorded on
2026-08-11.

This decision operates inside the [single-source ADR](adr/0001-single-source-static-discovery-site.md), the
[parity contract](discovery-site-parity-contract.md), the
[executable parity harness](discovery-site-parity-harness.md), and the
[component-system contract](component-system-contract.md).

## Decision

The existing, working Discovery Site is the approved representative product prototype. Do not build a second
throwaway UI, solicit another visual direction, or narrow the rebuild to a demonstrator page. Rebuild the complete
experience in Svelte 5 and SvelteKit from the accepted source, content, component, design-system, routing, SEO, LLM,
and quality contracts.

“Full end-to-end revamp” means a complete implementation and architecture replacement, not an unsolicited product
redesign:

- every existing human route and intentional compatibility route moves to the SvelteKit route graph;
- every repeated control and interaction moves into the accepted `ui/` → `shared/` → `site/` component system;
- Tailwind CSS v4, locally owned shadcn-svelte source, and bundled Lucide Svelte icons replace the legacy cascade,
  repeated markup, and runtime icon URLs;
- all pages use the shared content/domain pipeline and prerender complete HTML;
- both publication profiles build the same component graph from the same revision and lockfile;
- `website/` retires when `src/` lands, and root `site/` remains generated output rather than a second source.

The approved baseline is the current generated Discovery Site represented by the last presentation revision
`557c402`, the executable parity harness introduced by `b9d49aa`, and the current tracked `site/` artifact at planning
revision `6c6baba`. Later planning commits changed contracts, not the accepted visual implementation.

## What is accepted

The user accepts the existing product direction as the design oracle for the rebuild:

| Journey or state | Accepted outcome to carry into SvelteKit |
| --- | --- |
| Shared shell | LAB header, service navigation, full-width responsive frame, footer, skip navigation, and persistent appearance control |
| Home discovery | Command-led hero, Skills/Recipes switch, query and category filtering, counts, rows, empty state, clear/refocus, and `/` search shortcut |
| Skill reading | Breadcrumb, installation command, copy feedback, rendered instructions, overflow disclosure, package contents, source links, and related Skills |
| Recipe discovery | Recipe introduction, searchable/filterable directory, counts, rows, empty state, and keyboard search behavior |
| Recipe reading | Editorial phase/step hierarchy, sticky indices, contents synchronization, prompts, install references, copy feedback, and handoff notices |
| Theme | System/light/dark preference, first-paint correctness, persistence, operating-system tracking, cross-tab synchronization, and matching browser chrome |
| Responsive behavior | The recorded desktop, mobile, and narrow-screen hierarchy with no horizontal overflow |
| Feedback | Accessible loading, success, failure, reset, and live-message behavior for copy and disclosure interactions |

This is acceptance of outcomes, not legacy implementation details. Global IDs, DOM-wide scripts, copied page chrome,
client-created initial catalogs, external icon/font requests, the 4,213-line stylesheet, and hand-maintained Recipe
duplication are explicitly not accepted architecture.

## Intentional changes are already bounded

The SvelteKit result may differ only where another accepted contract requires a correction or improvement. Current
examples are:

- complete catalog rows in prerendered HTML instead of empty client-populated containers;
- an intentional noindex 404 instead of a copy of the home page;
- clean canonical Recipe routes with generated `.html` compatibility aliases;
- canonical-host-only machine surfaces and noindex backup-host HTML;
- local licensed fonts and brand assets, bundled Lucide components, and no runtime presentation CDN;
- accessible focus, contrast, reduced-motion, semantic, and performance corrections required by the quality contract;
- one derived Recipe reading view instead of hand-authored content duplication.

These are contract-driven corrections, not permission to change the information architecture, brand direction, copy,
feature set, or interaction model opportunistically. Any additional product redesign requires a new explicit decision.

## No separate prototype branch or source

The existing site supplies the concrete product evidence. The rebuild supplies the new architecture. Keeping a second
prototype implementation alongside production would violate the one-source decision and create no new information.

Implementation therefore proceeds through complete vertical journeys on the migration branch:

1. establish the SvelteKit shell and design-system foundation;
2. render the shared Catalog from Source Content;
3. migrate home discovery, Skill reading, Recipe discovery, and Recipe reading;
4. add SEO, LLM, accessibility, performance, and dual-host output surfaces;
5. compare the resulting artifact with the immutable baseline evidence;
6. atomically cut over the sole application source under the separately accepted migration policy.

Intermediate work may exist on the isolated migration branch after its first commit has atomically removed
`website/`. It is not a second accepted application source and must never be deployed as a competing canonical product
implementation. The exact branch, squash, tag, artifact, and rollback boundary is defined by the
[atomic cutover and rollback contract](atomic-cutover-and-rollback-contract.md).

## Acceptance evidence

The new implementation is accepted by observable behavior, not by whether it reproduces legacy selectors or DOM
shape. Evidence is cumulative:

1. the parity inventory defines public content, routes, metadata, behavior, and visual outcomes;
2. the Node and Playwright parity harness exercises the representative journeys at 1280 × 720 and 390 × 844;
3. the 366 px overflow check covers the narrow-screen boundary;
4. light, dark, system, and reduced-motion states cover presentation modes;
5. component and route tests prove the new shadcn/LAB ownership boundaries through public behavior;
6. canonical and Pages-project builds prove base-aware assets and equivalent human surfaces;
7. screenshot review catches material hierarchy or spacing regressions without demanding byte- or pixel-identical CSS;
8. static-output inspection proves complete prerendered HTML, route coverage, and absence of a legacy/runtime-CDN path.

The baseline wins when it describes intended product behavior. A later accepted contract wins when it explicitly
corrects the baseline. Neither `website/` nor a screenshot becomes an ongoing source of application code.

## Resolution

The prototype question is answered **yes, using the existing product as the accepted prototype**. The complete
SvelteKit implementation must reproduce that approved experience through the new component and source architecture.
No additional prototype or visual-selection gate blocks the quality-contract research or implementation-ticket graph.

Downstream ownership remains:

- the accessibility/performance ticket defines measurable release gates over this accepted experience;
- the migration/cutover ticket records the user's selected atomic replacement and rollback proof;
- implementation tickets build the actual SvelteKit application, one vertical journey at a time;
- final parity and deployment tickets provide artifact and live-host evidence before the canonical switch.
