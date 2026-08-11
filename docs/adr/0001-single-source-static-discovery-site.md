---
status: accepted
---

# Use one source for the portable static Discovery Site

The Discovery Site will have one application source and one component system. GitHub Pages and Netlify may produce environment-specific Publication Artifacts, but those artifacts must be generated from the same SvelteKit source, Source Content, and shared domain logic; no legacy template tree, provider-specific frontend, duplicated catalog model, or hand-edited generated output may act as a second source.

The site remains fully prerenderable so both hosts can ship the complete experience without provider-specific runtime code. All interface surfaces compose locally owned shadcn-svelte primitives, LAB components, Tailwind design tokens, and Lucide icons.

## Ownership boundary

| Concern | Sole authoring location |
| --- | --- |
| Stable Skill Source Content | `skills/<name>/SKILL.md` and its package files |
| Recipe Source Content | `recipes/<slug>/RECIPE.md` |
| SvelteKit application and routes | `src/` |
| Pure catalog types, validation, filtering, relationships, and view models | `src/lib/domain/` |
| Build-time filesystem readers and safe rich-content transformation | `src/lib/server/` |
| Owned shadcn-svelte primitives and LAB compositions | `src/lib/components/` |
| Route loading, metadata, and page composition | `src/routes/` |
| Repository commands | Thin `scripts/` entry points importing the shared domain and server modules through the project’s one TypeScript runner |
| Static source assets | `static/` |
| Publication Artifacts | `site/` and other explicitly generated views such as `docs/catalog.md` |

Routes never parse Source Content, read the filesystem, or recreate domain rules in page components. Components never
fetch or transform repository content. Repository commands do not retain compatibility copies of the catalog or
Markdown implementation.

Provider configuration may live in root configuration files and CI workflows, but it may only select build inputs such
as base path, canonical origin, and indexability. It cannot introduce provider-specific routes, components, domain
logic, or content.

## Migration boundary

The change that introduces `src/` as the application source also removes `website/` as an authoring tree and switches
all build, preview, validation, and deployment commands to SvelteKit. There is no alongside migration in which both trees
remain accepted sources.

Parity comparisons use the base revision, deployed legacy artifact, the committed parity contract, and reproducible
browser captures. Subsequent migration work changes only the SvelteKit source. `site/` may remain committed until its
separate output-policy decision is resolved, but it remains generated and must pass freshness checks throughout.
