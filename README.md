# Skills

Public, reusable playbooks from the labdotsa team, packaged as portable agent skills.

This repository is intentionally small at the start. Stable skills will be published as flat directories under [`skills/`](skills/); drafts and retired material live outside that installable catalog.

## Website

Explore the collection at [skills.lab.sa](https://skills.lab.sa/). The site includes generated indexes for protocols and [recipes](https://skills.lab.sa/recipes.html), beginning with a functioning-prototype delivery path that combines LABs and external skills through focused chat handoffs. Every push to `master` rebuilds the site on Netlify; the GitHub Pages workflow maintains a secondary mirror.

For a local file preview, run `npm run site:build` and open `site/index.html`. Use `npm run site:watch` while editing skills or website source to keep the generated preview current.

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
| [`website/`](website/) | Editable source for the discovery experience |
| [`site/`](site/) | Generated GitHub Pages output; do not edit directly |

## Website architecture

The discovery site remains a zero-dependency static application. `website/` owns the skill and recipe indexes, detail-page sources, presentation, browser behavior, and social image. `scripts/build-site.mjs` derives discovery data from `skills/*/SKILL.md` and `recipes/*/RECIPE.md`, then writes the deployable pages plus one detail route per skill to `site/`. Each skill detail route renders its `SKILL.md` at build time, including headings, lists, tables, links, task lists, blockquotes, and fenced code without requiring browser-side dependencies.

Catalog data has an explicit, versioned contract shared by the generator, validation scripts, and browser model. `npm run validate` checks skill structure, generated-file freshness, catalog integrity, package-file links, and browser-model behavior.

## Lifecycle

- **Incubating:** The workflow is still being shaped. It uses `DRAFT.md`, never `SKILL.md`.
- **Stable:** The workflow is proven, documented, and available under `skills/<name>/SKILL.md`.
- **Deprecated:** The skill is no longer installed. Its migration note is retained under `deprecated/`.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Proposals and feedback are welcome, but published skills should come from real, repeatable work rather than generic prompt generation.

## License

[MIT](LICENSE)
