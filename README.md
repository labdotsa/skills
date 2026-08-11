# Skills

Public, reusable playbooks from the labdotsa team, packaged as portable agent skills.

This repository is intentionally small at the start. Stable skills will be published as flat directories under [`skills/`](skills/); drafts and retired material live outside that installable catalog.

## Website

Explore the collection at [skills.lab.sa](https://skills.lab.sa/). The SvelteKit directory prerenders the complete Skill and Recipe catalog, then adds fast local search and category filtering without another content request. The dedicated `/recipes/` index exposes every workflow and phase through the same filter system while retaining `/recipes.html` as a generated compatibility page. Every Skill route includes its installation command, complete safe instructions, package files, source attribution, and deterministic related content in the initial HTML. The collection begins with a functioning-prototype delivery path that combines LABs and external skills through focused chat handoffs. Every push to `master` rebuilds the site on Netlify.

Use the checked runtime in [`.nvmrc`](.nvmrc), install with `npm ci`, and run `npm run dev` for local development. `npm run build:matrix` verifies the same fully prerendered route graph at both the canonical root and the GitHub Pages project base. `npm run test:e2e` exercises the public shell at desktop and mobile viewports.

## Catalog

Stable skills are published from the flat [`skills/`](skills/) directory. Browse the generated [catalog](docs/catalog.md) for the current list.

## Installation

Install the collection with:

```bash
npx skills@latest add labdotsa/skills
```

The skills follow the [Agent Skills specification](https://agentskills.io/specification) and remain vendor-neutral. Tool-specific plugin manifests can be added once the initial collection is ready to distribute.

## Repository layout

| Path | Purpose |
| --- | --- |
| [`skills/`](skills/) | Stable, installable skills in a flat catalog |
| [`recipes/`](recipes/) | Sequenced delivery playbooks indexed from `RECIPE.md` source |
| [`incubator/`](incubator/) | Public drafts that are not installable yet |
| [`deprecated/`](deprecated/) | Retirement and migration notes |
| [`docs/`](docs/) | Human-facing catalog and repository documentation |
| [`templates/`](templates/) | Starting point for new skills |
| [`scripts/`](scripts/) | Catalog generation and repository validation |
| [`src/`](src/) | Sole SvelteKit application source, composed as `ui → shared → site` |
| [`static/`](static/) | Locally served brand and machine-readable assets |
| [`site/`](site/) | Generated publication output; never an application source |

## Website architecture

The discovery site is one SvelteKit application in `src/`, fully prerendered with `adapter-static`. Publication profiles change only deployment facts such as the base path and indexing policy: `canonical` targets `skills.lab.sa`, while `pages-project` targets the `/skills` GitHub Pages backup. Both use the same routes, components, content, and lockfile.

The UI is built from locally owned shadcn-svelte primitives, reusable shared compositions, feature-specific site components, concrete Lucide icon imports, Tailwind CSS v4, and bundled brand/font assets. `npm run validate` checks repository structure, the one-source boundary, dependencies, types, unit behavior, both publication profiles, and public browser behavior.

## Lifecycle

- **Incubating:** The workflow is still being shaped. It uses `DRAFT.md`, never `SKILL.md`.
- **Stable:** The workflow is proven, documented, and available under `skills/<name>/SKILL.md`.
- **Deprecated:** The skill is no longer installed. Its migration note is retained under `deprecated/`.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Proposals and feedback are welcome, but published skills should come from real, repeatable work rather than generic prompt generation.

## License

[MIT](LICENSE)
