# Skills

Public, reusable playbooks from the labdotsa team, packaged as portable agent skills.

This repository is intentionally small at the start. Stable skills will be published as flat directories under [`skills/`](skills/); drafts and retired material live outside that installable catalog.

## Website

Explore the collection at [labdotsa.github.io/skills](https://labdotsa.github.io/skills/). The discovery site is generated from the same metadata as the repository catalog and deploys to GitHub Pages from `main`.

## Catalog

Eight stable skills are currently published. Browse the generated [catalog](docs/catalog.md) for the complete list.

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
| [`incubator/`](incubator/) | Public drafts that are not installable yet |
| [`deprecated/`](deprecated/) | Retirement and migration notes |
| [`docs/`](docs/) | Human-facing catalog and repository documentation |
| [`templates/`](templates/) | Starting point for new skills |
| [`scripts/`](scripts/) | Catalog generation and repository validation |
| [`site/`](site/) | Static GitHub Pages discovery experience |

## Lifecycle

- **Incubating:** The workflow is still being shaped. It uses `DRAFT.md`, never `SKILL.md`.
- **Stable:** The workflow is proven, documented, and available under `skills/<name>/SKILL.md`.
- **Deprecated:** The skill is no longer installed. Its migration note is retained under `deprecated/`.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Proposals and feedback are welcome, but published skills should come from real, repeatable work rather than generic prompt generation.

## License

[MIT](LICENSE)
