# Collection hero SEO audit

## Scope

- Domain: `https://skills.lab.sa/`
- Goal: make the Skills and Recipe collection pages immediately understandable to people and search engines, then move visitors into the relevant catalog.
- Market assumption: English-language, global product and agent-tooling audiences. No geographic claim or ranking guarantee is introduced.
- Templates reviewed: Skills collection (`/`) and Recipe collection (`/recipes/`).

## Findings and resolution

| System | Finding | Impact | Resolution |
| --- | --- | --- | --- |
| Content | The collection headings were expressive but did not plainly identify agent skills or agent workflow recipes. | The primary page intent was slower to understand and weakly aligned with likely informational and navigational queries. | Shipped literal, unique H1 copy for both collections. |
| Content | Supporting copy described LAB's process without clearly naming what a visitor could browse or install. | The page value and next step were ambiguous. | Shipped concise descriptions covering the artifact, product disciplines, and expected action. |
| Structure | Recipe actions sat in a detached right-side block beneath an oversized headline. | The conversion path was visually separated from the promise. | Added a shared action slot directly after the description, matching the hierarchy used by [lab.sa](https://lab.sa/). |
| Metadata | Visible collection copy and SEO metadata were separately maintained. | Copy could drift across H1, description, Open Graph, Twitter, and structured data. | Added one typed copy source consumed by both hero components and SEO projections. |
| Responsive UX | CTA placement did not follow LAB's adjacent-desktop, stacked-mobile pattern. | Actions consumed excessive space and were harder to scan. | Shipped 48px actions in one row on wider screens and full-width stacking on phones. |

## Copy decision

The shipped copy uses a JTBD structure paired with the 4Cs: name the resource, state who it serves, explain what it enables, and offer a direct action.

| Version | Headline | Single changed dimension | Hypothesis |
| --- | --- | --- | --- |
| Primary | Open-source agent skills for digital product teams. | Baseline | Explicit artifact, openness, and audience should maximize clarity and qualified catalog visits. |
| Variant A | Reusable agent skills for digital product teams. | Hook: reuse instead of openness | Reuse may appeal more to implementation-focused visitors but loses the verifiable open-source differentiator. |
| Variant B | Agent skills for product research, design, development, and marketing. | Hook: discipline coverage | Discipline keywords may improve relevance but produce a longer, less memorable H1. |

The Recipe collection follows the same decision: `Agent workflow recipes for product delivery.`

## Claims and quality audit

- `Open-source` is supported by the public repository and source links.
- `Reusable`, `skills`, `workflows`, and `recipes` describe visible catalog content.
- Product disciplines match the catalog's research, design, development, and marketing pillars.
- No performance, ranking, adoption, or outcome claim was invented.
- Copy score: 92/100. Clarity 5/5, relevance 5/5, value 4/5, credibility 5/5, persuasion 4/5, tone 5/5, inclusivity 5/5, accessibility 5/5, localization 4/5.
