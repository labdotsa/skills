# SvelteKit discovery-site rebuild plan

Status: wayfinding

Canonical planning map: [Wayfind the single-source SvelteKit Discovery Site rebuild](https://github.com/labdotsa/skills/issues/1)

Current-state evidence: [Discovery Site parity contract](discovery-site-parity-contract.md)

## Recommendation

Rebuild the discovery experience as a fully prerendered SvelteKit application using Svelte 5, TypeScript, Tailwind CSS v4, locally owned shadcn-svelte primitives, and Lucide Svelte icons. Every interface surface should be a reusable LAB component composed on that foundation.

Keep `skills/*/SKILL.md` and `recipes/*/RECIPE.md` as the content sources. SvelteKit should replace the HTML templating and browser-wide DOM scripts, not the catalog domain model or the repository's validation discipline.

Use `@sveltejs/adapter-static` for both GitHub Pages and Netlify. The site has no user-specific or runtime-only data, so the Netlify adapter would add functions and provider coupling without creating product value.

## Why rebuild

The existing implementation has good static-host properties and a strong validation contract, but composition has become expensive:

- Four HTML templates repeat the global header, navigation, footer, SEO markup, and controls.
- Browser behavior is split across page-wide scripts that query global DOM IDs and data attributes.
- `website/styles.css` is more than 4,200 lines and contains several layers of later overrides for the same surfaces.
- `scripts/build-site.mjs` mixes content loading, page assembly, SEO, Markdown rendering, related-content selection, and output concerns.
- There are unit tests for the catalog, Markdown subset, recipe model, and theme model, but no component, route, accessibility-flow, or visual-regression coverage.

The SvelteKit migration should preserve the current design and public behavior first. Visual redesign can follow after parity, when the system has stable component boundaries.

## Target architecture

```text
skills/                         source content; unchanged
recipes/                        source content; unchanged
scripts/
  generate-catalog.*            thin command importing the shared source model
  validate-skills.*             thin command importing the shared source model
src/
  app.html
  app.css                       Tailwind import, LAB/shadcn tokens, global prose rules
  lib/
    components/
      ui/                        locally owned shadcn-svelte source components
      shell/                     SiteHeader, MobileNav, SiteFooter, PageFrame
      catalog/                   DirectoryWorkbench, filters, rows, empty state
      content/                   MarkdownContent, CodePanel, PackageDirectory
      recipe/                    RecipeNav, RecipePhase, RecipeStep, notices
      shared/                    CopyButton, ThemeToggle, InstallCommand, Eyebrow
    domain/                      types and pure filtering/relationship functions
    server/                      filesystem-backed content readers
  routes/
    +layout.svelte               global shell, theme watcher, toast host
    +layout.ts                   prerender and trailing-slash policy
    +page.server.ts              home catalog data
    +page.svelte
    skills/[name]/
      +page.server.ts            load and entries()
      +page.svelte
    recipes/
      +page.server.ts
      +page.svelte
      [slug]/
        +page.server.ts          load and entries()
        +page.svelte
    skills.json/+server.ts       prerendered public catalog contract
    recipes.json/+server.ts      prerendered public recipe contract
    sitemap.xml/+server.ts
    robots.txt/+server.ts
static/
  .nojekyll
  og.png
tests/
  e2e/
```

There must be one implementation of catalog parsing, validation, relationships, Markdown transformation, and view-model construction. SvelteKit routes and repository commands consume that shared source; neither side owns a copy or compatibility implementation. `site/` contains only reproducible Publication Artifacts.

## Component boundaries

Use three layers:

1. `ui/` contains owned shadcn-svelte primitives. These are low-level accessibility and interaction building blocks.
2. `shared/`, `shell/`, `catalog/`, `content/`, and `recipe/` contain branded LAB components with typed product vocabulary.
3. Route components arrange product sections and receive data from route loaders.

Recommended shared components:

| Component | Responsibility |
| --- | --- |
| `SiteShell` | Header, main landmark, footer, toast host, page-wide tokens |
| `PageFrame` | One responsive gutter and width contract |
| `ThemeToggle` | System/light/dark preference and accessible labeling |
| `CopyButton` | Clipboard fallback, loading/success state, live feedback |
| `CodePanel` | Shared toolbar, code surface, copy control, wrapping policy |
| `InstallCommand` | Prompt, install string, copy control, optional source link |
| `DirectoryWorkbench` | Query, category, active directory, result count |
| `CatalogRow` | Shared skill/recipe/related-item row anatomy |
| `MarkdownContent` | Sanitized generated HTML and editorial prose styling |
| `PackageDirectory` | Skill package files and source links |
| `RecipeNav` | Contents navigation and current-section state |
| `RecipePhase` | Numbered phase header, steps, and handoff notice |
| `RecipeStep` | Sticky index and composable step content |

Components should receive data and callbacks; they should not read content files or fetch their own route data. Prefer typed variants such as `kind: "skill" | "recipe"` and `pillar: Pillar` to expanding collections of boolean props. Use Svelte snippets for optional component regions where a fixed data prop becomes awkward.

## shadcn-svelte scope

shadcn-svelte is the owned primitive foundation for the component system. Its CLI copies component source into the repository, which makes LAB-specific styling and composition possible without introducing a sealed parallel UI library.

The initial primitive inventory should cover at least:

- `button`
- `input`
- `tabs`
- `sheet` for mobile navigation
- `collapsible`
- `breadcrumb`
- `separator`
- `sonner` or one local toast implementation
- `tooltip`
- `navigation-menu` where its behavior matches the service navigation

`CatalogRow`, `InstallCommand`, `CodePanel`, recipe sections, and the editorial reading layout remain custom LAB components, but they must compose the shadcn primitives instead of introducing separate control, focus, overlay, or state conventions. Use `@lucide/svelte` for interface icons and remove runtime icon-CDN requests.

The current shadcn-svelte setup uses the SvelteKit CLI with Tailwind, a `components.json` file, and CSS-variable theming. Its dark-mode guide uses `mode-watcher`; adopting it can replace the custom early theme script while retaining system preference and preventing a theme flash.

## Tailwind strategy

Use Tailwind v4's Vite plugin and CSS-first configuration:

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-body);
  --font-display: var(--font-heading);
  --font-mono: var(--font-code);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--main-lab);
  --color-research: var(--research-lab);
  --color-design: var(--design-lab);
  --color-development: var(--development-lab);
  --color-marketing: var(--marketing-lab);
}
```

Preserve the LAB semantic variables as the source of truth and map shadcn's `background`/`foreground`, `primary`/`primary-foreground`, `muted`, `border`, `input`, and `ring` variables onto them. Do not accept the generated neutral theme unchanged.

Use utilities for layout, spacing, typography, responsive rules, and simple states. Keep small component-scoped CSS blocks for distinctive pseudo-elements, complex editorial prose, sticky recipe rails, and animations. Avoid recreating the present cascade with a large `@apply` component sheet.

Do not build Tailwind class names dynamically from catalog data. Map category and pillar values to complete static classes, or set a CSS custom property such as `--lab-accent` on the component boundary.

## Content and routing

Set these at the root layout:

```ts
export const prerender = true;
export const trailingSlash = "always";
```

Keep SSR enabled so prerendering writes complete, indexable HTML. Use `entries()` on `skills/[name]` and `recipes/[slug]` so every content route is generated even if a future UI filter stops linking to one.

Read repository files only in server-only loaders during the build. Return serializable view models to pages. The browser should receive the catalog data it needs directly from the page load rather than parsing inline JSON or fetching a second copy after hydration.

Continue producing `skills.json` and `recipes.json` as prerendered endpoints because they are useful public contracts and validation targets.

For Markdown, preserve the current safe behavior during the first pass. The current renderer escapes raw HTML and rejects unsafe URL schemes. If it is later replaced with a CommonMark pipeline, add explicit HTML sanitization before using Svelte's `{@html}`.

Preserve current public URLs during parity. After cutover, a separate decision can move `recipes.html` and `recipe.html` to `/recipes/` and `/recipes/[slug]/`. GitHub Pages has no general redirect engine, so legacy aliases must remain generated pages if URLs change.

## SEO and LLM discovery

Every public page must be complete in prerendered HTML, carry a unique title and description, expose a self-consistent canonical URL, and participate in crawlable internal navigation. The rebuild must explicitly decide and validate:

- canonical-domain and duplicate-host policy;
- sitemap, robots, 404, legacy URL, and status-code behavior;
- Open Graph and social metadata;
- JSON-LD that matches visible content and the selected page intent;
- heading structure, breadcrumbs, descriptive links, and content depth;
- LCP, INP, CLS, asset, and hydration budgets;
- Search Console and analytics baselines where access is available;
- stable JSON and raw-content discovery surfaces for Skills and Recipes;
- evidence-backed `llms.txt` or equivalent conventions, AI crawler directives, attribution, and licensing context;
- automated checks that machine-readable output matches the same Catalog and Source Content as human pages.

LLM-friendly output must not become a second content source. Text, JSON, sitemap, structured data, and any LLM discovery files are generated views over the same validated model.

## Static-host configuration

Use one adapter configuration with an environment-specific base path:

```js
import adapter from "@sveltejs/adapter-static";

const base = process.env.BASE_PATH ?? "";

export default {
  kit: {
    adapter: adapter({
      pages: "site",
      assets: "site",
      fallback: "404.html",
      strict: true
    }),
    paths: {
      base,
      relative: true
    }
  }
};
```

Use `$app/paths.resolve()` for internal routes and `asset()` for files in `static/`. Do not hand-build root-relative URLs.

### GitHub Pages

Use a custom GitHub Actions workflow, not branch-based Jekyll publishing:

1. Validate and build on `master`.
2. Set `BASE_PATH="/skills"` for the normal `labdotsa.github.io/skills/` project URL.
3. Set `BASE_PATH=""` if the repository has its own root custom domain such as `skills.lab.sa`.
4. Upload `site/` with `actions/upload-pages-artifact`.
5. Deploy it with `actions/deploy-pages` from a job with `pages: write` and `id-token: write`.
6. Configure the custom domain in repository Pages settings when using Actions; do not rely on a committed `CNAME` file.

### Netlify

Keep the deployment static:

```toml
[build]
command = "npm run build"
publish = "site"

[build.environment]
NODE_VERSION = "22"
BASE_PATH = ""
```

Do not add `@sveltejs/adapter-netlify` unless the product later requires runtime SSR, functions, form actions, or non-prerendered endpoints.

### One artifact or two

The same byte-for-byte artifact works when both hosts serve the app from the same URL base, typically `/`. A normal GitHub project site serves from `/skills`, while Netlify serves from `/`, so those targets should run the same source build twice with different `BASE_PATH` values.

Choose one canonical production origin for SEO. Alternate provider URLs can carry canonical tags pointing to `https://skills.lab.sa/`; preview deployments should not become competing indexed copies.

## Build-output policy

There are two viable policies:

1. Keep committing `site/` during migration. This minimizes repository-process changes and lets the existing stale-output check protect parity, but hashed SvelteKit assets will create noisy diffs.
2. Recommended after cutover: treat `site/` as a generated CI artifact, add it to `.gitignore`, and deploy the artifact produced by each host. GitHub Pages Actions and Netlify both build from source, so committed compiled output is no longer required.

Use policy 1 until route, visual, and validation parity is reached. Switch to policy 2 in an explicit follow-up that updates `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, the validation workflow, and the changelog together.

## Validation and quality gates

Preserve the current nine unit tests, then add:

- `svelte-check` for type and compile-time accessibility checks.
- Vitest tests for catalog filtering, relationship selection, view-model creation, and interaction state.
- Component tests for tabs, filters, copy state, theme toggle, and collapsible content.
- Playwright tests for home, recipes, skill detail, recipe detail, 404 behavior, keyboard search, theme persistence, copy feedback, and mobile navigation.
- Static-output tests asserting every catalog entry has a generated route, JSON contracts match route data, canonical URLs are valid, no personal paths leak, and sitemap entries resolve.
- Screenshot baselines at the existing 1280 × 720 and 390 × 844 QA viewports.
- An overflow assertion and a reduced-motion pass.

Keep `npm run validate` as the one completion gate. A target script set is:

```json
{
  "dev": "vite dev",
  "build": "npm run catalog && vite build",
  "preview": "vite preview",
  "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "validate": "bash scripts/validate-skills.sh && node scripts/generate-catalog.mjs --check && npm run check && npm test && npm run build && node scripts/validate-site.mjs"
}
```

## Migration sequence

### Phase 0 — lock the contract

- Record the current routes, metadata, catalog schemas, keyboard behavior, theme behavior, and screenshots.
- Add tests for any behavior currently enforced only by string searches in `validate-site.mjs`.
- Decide whether the first release preserves `.html` recipe URLs; default to yes.

Exit: current implementation has a route/behavior parity checklist.

### Phase 1 — establish the single source without redesign

- Add SvelteKit, Svelte 5, TypeScript, adapter-static, Tailwind v4, and checks.
- Initialize shadcn-svelte, Lucide Svelte, and the agreed supporting libraries.
- Establish LAB/shadcn theme tokens and fonts.
- Mechanically lift the current pages into the SvelteKit source, then delete `website/` and retire it as an authoring location in the same integration change.
- Use the base branch, deployed artifact, screenshots, and QA records for comparison; do not retain a second active application tree.
- Create the root shell, theme handling, and static-host configuration entirely under the new source boundary.

Exit: SvelteKit is the only application source and produces a parity-oriented Publication Artifact on both base paths.

### Phase 2 — migrate the domain and routes

- Move catalog, recipe, relationship, and Markdown behavior into one shared source model consumed by thin route and repository entry points.
- Add prerendered home, skill detail, recipe index, recipe detail, JSON, sitemap, robots, and 404 outputs.
- Add dynamic route `entries()` and output-contract tests.

Exit: all content and metadata are generated from repository sources with no duplicated catalog data.

### Phase 3 — extract components by vertical slice

- Migrate the global shell.
- Migrate the home directory and filters.
- Migrate skill detail.
- Migrate recipe index and detail.
- Replace global DOM scripts with local Svelte state and actions.
- Delete CSS only after its owning surface has moved and passed screenshots.

Exit: visual and interaction parity at desktop and mobile, with no legacy script required.

### Phase 4 — deployment cutover

- Add the GitHub Pages Actions workflow and verify both root and `/skills` builds.
- Update Netlify to publish the SvelteKit static output.
- Verify deep links, 404s, assets, canonical URLs, sitemap, theme initialization, and cache behavior on both providers.
- Remove any remaining obsolete generator entry points after both live smoke tests pass; no obsolete module may remain an accepted source.

Exit: the same source revision is deployed successfully to both providers.

### Phase 5 — repository cleanup

- Decide and document whether `site/` remains committed.
- Update repository instructions and contributor documentation.
- Remove obsolete generator tests and replace string-based checks with route/output tests.
- Add Storybook only if the component inventory is large enough to justify a separate workshop.

Exit: no legacy architecture is required to build, validate, preview, or deploy.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Base-path failures on Pages | Build both `BASE_PATH=""` and `BASE_PATH="/skills"` in CI; use `resolve()` and `asset()` everywhere. |
| Visual drift while replacing 4,200 lines of CSS | Migrate by vertical slice and use the existing QA viewports as screenshot baselines. |
| Unsafe Markdown HTML | Preserve the current escaping contract or adopt an explicit sanitizer before `{@html}`. |
| Missing dynamic pages | Export `entries()` and keep adapter-static `strict: true`. |
| shadcn styling erases LAB identity | Treat shadcn as owned primitives and map its semantic tokens to LAB variables. |
| Tailwind misses data-driven classes | Use static variant maps or CSS variables; never concatenate class fragments. |
| Generated-output churn | Keep `site/` committed only through parity, then move deployment artifacts to CI. |
| URL changes break Pages links | Preserve existing URLs in the first release and generate legacy aliases before later cleanup. |
| Provider-specific features split the architecture | Keep the production surface inside the common static-host capability set. |

## Decisions to make before implementation

1. Will GitHub Pages use `skills.lab.sa` at the root or the default `/skills` project path?
2. Should `recipes.html` and `recipe.html` remain public URLs for the first release? Recommended: yes.
3. Should generated `site/` remain committed after cutover? Recommended: no, but change that only after parity.
4. Is visual parity the release requirement, or is a redesign included? Recommended: parity first.
5. Which provider owns the canonical production domain, and which is preview/backup?

## Primary references

- [SvelteKit static site generation and GitHub Pages](https://svelte.dev/docs/kit/adapter-static)
- [SvelteKit page options, prerendering, entries, and trailing slashes](https://svelte.dev/docs/kit/page-options)
- [SvelteKit base paths and path resolution](https://svelte.dev/docs/kit/$app-paths)
- [SvelteKit project structure](https://svelte.dev/docs/kit/project-structure)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)
- [shadcn-svelte SvelteKit installation](https://www.shadcn-svelte.com/docs/installation/sveltekit)
- [shadcn-svelte theming](https://www.shadcn-svelte.com/docs/theming)
- [shadcn-svelte dark mode](https://www.shadcn-svelte.com/docs/dark-mode/svelte)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Netlify SvelteKit guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/sveltekit/)
