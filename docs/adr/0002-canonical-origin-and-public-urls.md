---
status: accepted
---

# Use Netlify as the canonical origin and Pages as a backup

Netlify owns the canonical production origin at `https://skills.lab.sa`. GitHub Pages remains an accessible static backup
at `https://labdotsa.github.io/skills/`. Both deployments are generated from the same SvelteKit source; their
environment-specific Publication Artifacts differ only in base-path and indexability metadata.

## Canonical route policy

The human-facing canonical routes are:

- `/`
- `/skills/<name>/`
- `/recipes/`
- `/recipes/<slug>/`

The first SvelteKit release also emits `/recipes.html` and `/recipe.html` as physical compatibility aliases so existing
GitHub Pages and external links continue to resolve. `/recipes.html` canonicalizes to `/recipes/` and `/recipe.html`
canonicalizes to `/recipes/functional-prototype/`. These aliases are generated views, never separate content sources.
They remain until a later evidence-backed removal decision.

Public machine-readable routes such as `/skills.json`, `/recipes.json`, `/sitemap.xml`, and `/robots.txt` keep their
current paths. Any later LLM-discovery routes join this same route model rather than creating another catalog.

The canonical origin never includes a deployment base path. Internal links and assets include the active build base,
while canonical, Open Graph, structured-data, and sitemap URLs always resolve against `https://skills.lab.sa`.

## Duplicate-host policy

- Netlify production at `skills.lab.sa` is indexable and publishes the canonical sitemap.
- The Netlify platform hostname redirects to `skills.lab.sa` once its final hostname is known. Deploy previews emit
  `noindex,follow` and never become canonical.
- GitHub Pages remains browsable at the `/skills/` project path but every HTML page emits `noindex,follow` and a canonical
  URL on `skills.lab.sa`.
- The Pages robots file allows HTML crawling so crawlers can observe `noindex` and canonical metadata, while preventing
  alternate-host catalog and machine-discovery endpoints from being indexed.
- Not-found pages emit `noindex` and no self-canonical. Query strings and fragments never create distinct canonicals.

Builds therefore accept separate `BASE_PATH`, `SITE_ORIGIN`, and `SITE_INDEXABLE` inputs without changing application
source. The root Netlify build uses an empty base and is indexable. The Pages build uses `/skills`, shares the canonical
origin, and is not indexable.

## Consequences

Clean Recipe routes become the internal-link and sitemap targets immediately, while the current `.html` URLs remain
functional compatibility surfaces. Search engines receive one production origin, and GitHub Pages remains useful for
availability and deployment verification without competing in search results.
