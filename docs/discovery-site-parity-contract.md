# Discovery Site parity contract

Status: current-state inventory

Snapshot: 2026-08-11

Source issue: [#2 Inventory the current Discovery Site parity contract](https://github.com/labdotsa/skills/issues/2)

This document records the observable Discovery Site contract before the SvelteKit rebuild. It is evidence for later
architecture decisions, not a requirement to preserve accidental implementation details. Each item is classified as:

- **Preserve** — user-visible behavior, public content, or a compatibility contract that the parity release must keep.
- **Retire** — a legacy implementation surface that the accepted single-source architecture replaces.
- **Decide** — a policy choice owned by a later Wayfinder ticket.

The snapshot contains six stable Skills and one draft Recipe. `npm run validate` passes all nine Node tests and validates
the generated output for those seven entries.

## Source and publication model

| Surface | Current owner | Current role | Rebuild disposition |
| --- | --- | --- | --- |
| [Stable Skills](../skills/) | `skills/<name>/SKILL.md` plus package files | Canonical Skill Source Content and package inventory | **Preserve** as Source Content |
| [Recipes](../recipes/) | `recipes/<slug>/RECIPE.md` | Canonical Recipe discovery metadata and workflow source | **Preserve** as Source Content |
| Legacy `website/` templates and scripts | Four HTML templates, six browser scripts, one stylesheet, one image | Former editable application source | **Retired** atomically when SvelteKit became the sole application source |
| Legacy `scripts/build-site.mjs` | Build-time orchestration and page rendering | Former page assembler | **Retired**; preserve required behavior in shared modules and thin commands |
| [Generated site](../site/) | Reproducible output | Committed Publication Artifact and Netlify publish directory | **Decide** whether it remains committed after cutover; never treat it as source |
| [Generated documentation catalog](catalog.md) | [Catalog generator](../scripts/generate-catalog.mjs) | Human-readable list derived from stable Skills | **Preserve** as a generated view over the shared model |

The current build removes and recreates only generated Skill detail directories, then overwrites known site files. It
does not treat `site/` as an authoring location. A source-preview redirect sends direct filesystem opens of the home and
Recipe-index templates to their generated equivalents.

### Current duplication and coupling to remove

- Global header, desktop/mobile navigation, footer, theme controls, and toast markup are repeated across all four HTML
  templates.
- Catalog validation and Skill-domain behavior existed in both the legacy `scripts/lib/site-catalog.mjs` build model
  and `website/catalog.js` browser model.
- Home-directory behavior in legacy `website/app.js` and Recipe-index behavior in `website/recipes.js` separately
  implemented filtering, category counts, rows, empty states, and `/` search.
- Category labels and category-to-LAB-pillar mappings are repeated across browser and build modules.
- The Recipe catalog is derived from `RECIPE.md`, but the complete Recipe reading page is independently hand-authored in
  legacy `website/recipe.html`. The source and visible workflow could therefore drift.
- Legacy `scripts/build-site.mjs` mixed filesystem reads, domain relationships, Markdown rendering, SEO,
  HTML assembly, asset copying, sitemap/robots generation, and stale-output checking.
- Legacy `website/styles.css` was a 4,213-line global cascade shared by every page.
- Page-wide scripts locate controls through global IDs and `data-*` selectors instead of component ownership.

All of these implementation duplications are **Retire** items. The rebuild must retain one content/domain pipeline and
replace them with owned shadcn-svelte primitives and reusable LAB components, as required by the
[accepted single-source ADR](adr/0001-single-source-static-discovery-site.md).

## Public route and output inventory

All HTML uses relative internal links and is intended to work from a static host and direct filesystem preview.

| Public output | Content and behavior | Current canonical | Disposition |
| --- | --- | --- | --- |
| `/` (`index.html`) | Hero, collection install command, Skills/Recipes tabs, search, category filters, counts, rows, and footer | `https://skills.lab.sa/` | **Preserve** the experience and public content; improve the initial no-JavaScript HTML |
| `/404.html` | Byte-for-byte copy of the home page, including its home canonical | Home canonical | **Retire** this false not-found experience; replace it with an intentional prerendered 404 contract |
| `/recipes.html` | Recipe hero, workflow explanation, searchable/filterable Recipe directory | `https://skills.lab.sa/recipes.html` | **Preserve** through parity; later URL changes are **Decide** |
| `/recipe.html` | Manually authored Functioning Prototype Recipe with contents navigation, four phases, prompts, handoffs, and final gate | `https://skills.lab.sa/recipe.html` | **Preserve** through parity; derive it from Recipe Source Content in the rebuild |
| `/skills/<name>/` | One generated detail route per stable Skill, emitted physically as `skills/<name>/index.html` | `https://skills.lab.sa/skills/<name>/` | **Preserve** every stable route and its readable HTML |
| `/skills.json` | Versioned public Skill catalog | None declared | **Preserve** schema version 1 unless an explicit versioned migration is accepted |
| `/recipes.json` | Versioned public Recipe catalog | None declared | **Preserve** schema version 1 unless an explicit versioned migration is accepted |
| `/sitemap.xml` | Home, Recipe index, Recipe detail, and every Skill detail canonical | N/A | **Preserve** complete coverage; fix policy and host awareness later |
| `/robots.txt` | Allows all crawlers and points at the canonical-domain sitemap | N/A | **Decide** crawler and alternate-host policy |
| `/.nojekyll` | Empty GitHub Pages compatibility marker | N/A | **Preserve** only while required by the selected Pages publication mechanism |
| Shared JS/CSS/image files | Global interaction scripts, stylesheet, and copied `og.png` | N/A | **Retire** legacy bundles; preserve required presentation and interaction behavior |

The copied `/og.png` artifact is not referenced by current metadata; pages use `https://lab.sa/thumbnail.png` instead.
Whether the rebuild adopts a locally owned social image is **Decide**.

## Metadata and crawl contract

Every current template declares English document language, UTF-8, a responsive viewport, light/dark color-scheme
support, a description, an Open Graph type/title/description/URL/image, a large-image Twitter card, a canonical URL,
and a document title.

| Page type | Title/description source | Open Graph type | Canonical behavior |
| --- | --- | --- | --- |
| Home | Fixed LAB Skills copy | `website` | Fixed root canonical |
| Recipe index | Fixed LAB Recipes copy | `website` | Fixed `/recipes.html` canonical |
| Recipe detail | Fixed Functioning Prototype copy | `article` | Fixed `/recipe.html` canonical |
| Skill detail | Skill name and description from catalog data | `article` | Generated `/skills/<name>/` canonical |
| Not found | Duplicated home metadata | `website` | Incorrectly canonicalizes to home |

**Preserve:** complete prerendered titles, descriptions, social metadata, canonical URLs, semantic content, internal
links, sitemap coverage, and crawlable Skill instructions. **Decide:** canonical production origin, alternate-host
indexation, legacy aliases, structured-data vocabulary, crawler policy, and measurement. Current gaps to address later
include no JSON-LD, no LLM-specific discovery surface, no raw Recipe/Skill discovery policy, and an invalid 404 canonical.

## Catalog contracts

### Skill catalog schema version 1

The public Skill catalog is built from each stable `SKILL.md` frontmatter and package tree. Entries are sorted by name.

- Root fields: `schemaVersion`, `installCommand`, `repositoryUrl`, `skills`.
- Skill fields: `index`, `name`, `description`, `category`, `files`, `resources`, `detailUrl`, `sourceUrl`, `fileUrl`.
- `files` contains every package file in stable order with `SKILL.md` first.
- `resources` counts files under `references`, `scripts`, `assets`, and `evals`.
- Missing descriptions fall back to `Description unavailable.`; missing categories fall back to `general`.
- Names are unique, required string fields are non-empty, and every file link must resolve in the repository.
- The install base is `npx skills add labdotsa/skills`; per-Skill commands append `--skill <name>`.

The home page embeds the same catalog JSON that is written to `skills.json`; validation requires byte-equivalent data.

### Recipe catalog schema version 1

The public Recipe catalog is built from each `recipes/<slug>/RECIPE.md`.

- Root fields: `schemaVersion`, `recipes`.
- Recipe fields: `index`, `slug`, `title`, `description`, `category`, `status`, `conversations`, `relatedSkills`,
  `detailUrl`, `sourceUrl`.
- The directory name and frontmatter name must match lowercase kebab-case.
- The title comes from the first Markdown H1, conversations are counted from `## Conversation` headings, and related
  Skill names come from Recipe frontmatter.
- `detailUrl` must be a local `./` path without parent traversal and must resolve in the generated output.

Identical Recipe data is embedded in the home and Recipe-index pages and is also written to `recipes.json`.

### Markdown rendering and safety

Skill instructions were rendered at build time by legacy `scripts/lib/markdown.mjs`. The supported subset
includes headings with stable duplicate-safe IDs, paragraphs, emphasis, strong text, deletion, inline/fenced code,
links, images, horizontal rules, blockquotes, ordered/unordered/task lists, and tables.

- Frontmatter is removed from visible instructions.
- Raw HTML and code are escaped.
- `http`, `https`, `mailto`, fragments, and resolved relative links are allowed.
- Other explicit schemes resolve to `#`.
- Relative Skill links resolve to encoded GitHub source URLs.
- Fenced code blocks receive a language label and copy control.

These safety and rendering results are **Preserve** contracts. The parser implementation itself is **Retire** if a
replacement can prove equivalent or intentionally improved behavior.

## Interaction contract

| Interaction | Observable behavior to preserve | Legacy implementation to retire |
| --- | --- | --- |
| Theme | System/light/dark resolution; default `system`; persistence under `labs-color-theme`; system-change and cross-tab synchronization; immediate color-scheme and theme-color updates | Global `theme.js`, repeated controls, runtime Lucide icon URLs |
| Mobile navigation | Native keyboard-operable disclosure with service, Skills, Recipe, and theme actions | Repeated `<details>` markup in every template |
| Home directory | Skills/Recipes tab switch; category filters; case-insensitive search; counts; empty state; clear-and-refocus; `/` focuses search | Global DOM state and client-created rows |
| Recipe index | Case-insensitive title/description/category/status search; category filters; counts; empty state; clear-and-refocus; `/` focuses search | Separate duplicate Recipe directory script |
| Copy | Clipboard API with textarea fallback; busy/loading state; success icon; live toast; reset to idle | Delegated global click listener and runtime icon CDN |
| Skill sections | Instructions and package contents collapse only when they overflow; accessible expanded state; resize correction | Global height measurement and `data-*` hooks |
| Recipe reading | Sticky step-number rail; right-side contents navigation; scroll/click/hash/resize synchronization; `aria-current="location"` | DOM restructuring and page-specific scrollspy script |
| Direct source preview | Home and Recipe-index source templates redirect to generated equivalents when opened from `file:` | Source-template preview redirects |

The initial home and Recipe indexes currently contain empty list containers and depend on JavaScript to create rows,
even though catalog data is embedded. The rebuild should preserve enhanced filtering while improving the base contract:
complete human- and crawler-readable entries must exist in prerendered HTML.

## Accessibility and visual baseline

### Semantic and keyboard baseline

- English document language, landmarks, one page H1, descriptive navigation labels, breadcrumbs on Skill pages, and
  skip links are present.
- Result counts and copy feedback use polite live regions.
- Category filters expose pressed state; directory tabs expose selected state; collapsibles expose expanded state.
- Decorative icons and indices are hidden from assistive technology; action buttons have accessible labels.
- Search has a visible label treatment, and `/` focuses search unless an input or textarea already owns focus.
- The Recipe scrollspy exposes the current location; copy controls expose busy state while working.

These outcomes are **Preserve**. The current hand-authored ARIA and selector topology is not.

### Recorded visual baseline

[Design QA](../design-qa.md) is the current visual evidence ledger. Its primary viewports are 1280 × 720 and
390 × 844, with additional 366 px narrow-screen checks and larger full-view comparisons. The accepted baseline includes:

- light and dark themes;
- full-width shared page frames and LAB typography/tokens;
- no horizontal overflow;
- consistent command/code surfaces and copy-control geometry;
- mobile navigation and readable long-form Recipe layouts;
- sticky Recipe contents and step indices;
- package contents before related recommendations on every Skill page;
- no console errors or warnings in the recorded browser passes.

Preserve the visual hierarchy, content, responsive behavior, and interaction states for the parity release. Exact legacy
CSS selectors and the 4,213-line cascade are **Retire**.

## Runtime assets and outbound dependencies

| Origin | Current use | Disposition |
| --- | --- | --- |
| `lab.sa` | LAB logo, favicon, Apple touch icon, social image, three font stylesheets, company/service/legal links, contact destination | **Decide** which brand assets must be locally owned; preserve intentional outbound navigation |
| `unpkg.com/lucide-static@latest` | Theme, copy, loading, and success icons | **Retire**; use bundled `@lucide/svelte` icons with no runtime icon CDN |
| `github.com/labdotsa/skills` | Skill/Recipe source, raw file, and package links | **Preserve** source attribution and encoded paths |
| `skills.sh` | External Skill references in the Functioning Prototype Recipe | **Preserve** while the Recipe continues to reference those external Skills |
| LAB social profiles | Footer navigation | **Preserve** unless content policy changes |

The current static app has no package dependencies and no request-time backend. Netlify runs
`npm run build && npm run validate` on Node 22 and publishes `site/`. The repository contains a validation workflow but
no GitHub Pages deployment workflow. Static portability is **Preserve**; provider-specific application code is
**Retire/out of scope** for the shared baseline.

## Existing verification coverage

The completion gate is `npm run validate`. It currently proves:

- stable Skill directory structure and lifecycle rules;
- generated documentation and site freshness;
- parity between embedded and JSON catalogs;
- existence of every package file, Recipe detail output, and generated Skill directory;
- required shared assets, navigation, Recipe structure, copy targets, related content, sitemap entries, and absence of
  personal absolute paths;
- catalog validation/filter/command behavior, Markdown rendering/safety, Recipe derivation, and theme resolution through
  nine Node tests.

At inventory time, gaps included no component tests, browser automation, automated accessibility run, internal-link
crawl, visual regression suite, Core Web Vitals budget, alternate-base build, or deployed-host smoke test. The
[executable parity harness](discovery-site-parity-harness.md) now covers representative browser interactions, fixed-
viewport captures, public route serving, and static output contracts. The remaining gaps belong to later quality and
deployment tickets; they are not evidence that the legacy site is broken.

## Migration ledger

| Preserve for parity | Retire during migration | Decide before cutover |
| --- | --- | --- |
| Source Content, copy, visual hierarchy, responsive states, current public Skill routes, current Recipe URLs, catalog v1 outputs, safe rich content, search/filter/theme/copy/collapse/scrollspy behavior, static HTML, relative-link portability, source attribution | `website/` templates and global scripts, hand-maintained Recipe detail duplication, global CSS cascade, duplicate domain/browser models, empty client-rendered initial directories, false home-page 404, source-preview redirects, runtime Lucide CDN, mixed page assembly in the build script | Canonical production host/origin, alternate-host indexation, legacy URL duration, committed `site/` policy, local ownership of LAB brand assets/fonts/social image, structured data, LLM/crawler surfaces, analytics and performance budgets |

This inventory intentionally does not choose the undecided policies. It provides the current-state evidence required by
Wayfinder issues #3 through #13 and the implementation graph beginning at issue #15.
