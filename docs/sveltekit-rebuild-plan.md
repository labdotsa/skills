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
      shared/                    product-neutral CopyButton, CodePanel, PageFrame, ThemeToggle
      site/                      every Discovery Site-aware component
        common/                  InstallCommand, PageHead
        shell/                   SiteShell, SiteHeader, MobileNav, SiteFooter
        directory/               DiscoveryPage, workbench, filters, rows, empty state
        skill/                   SkillPage, hero, package directory, related Skills
        recipe/                  Recipe pages, navigation, phases, steps, handoffs
        rich-content/            typed RichDocument renderers
        not-found/               useful shared-shell 404 screen
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

Use three component layers with a strict inward dependency direction:

1. `ui/` contains owned shadcn-svelte primitives. These are low-level accessibility and interaction building blocks.
2. `shared/` contains product-neutral LAB compositions reused by multiple site features.
3. `site/` contains all product-aware screens, shell, common compositions, and feature folders. Route components receive
   loader data and select one `site/` screen; they contain no product styling or interaction logic.

Recommended component ownership:

| Component | Layer | Responsibility |
| --- | --- | --- |
| `SiteShell` | `site/shell` | Header, main landmark, footer, toast host, page-wide tokens |
| `PageFrame` | `shared` | One responsive gutter and width contract |
| `ThemeToggle` | `shared` | System/light/dark preference and accessible labeling |
| `CopyButton` | `shared` | Clipboard fallback, loading/success state, live feedback |
| `CodePanel` | `shared` | Shared toolbar, code surface, copy control, wrapping policy |
| `InstallCommand` | `site/common` | Prompt, install string, copy control, optional source link |
| `DirectoryWorkbench` | `site/directory` | Query, category, active directory, result count |
| `CatalogRow` | `site/directory` | Shared Skill/Recipe/related-item row anatomy |
| `RichDocument` | `site/rich-content` | Typed rich-document composition and editorial prose styling |
| `PackageDirectory` | `site/skill` | Skill package files and source links |
| `RecipeNav` | `site/recipe` | Contents navigation and current-section state |
| `RecipePhase` | `site/recipe` | Numbered phase header, steps, and handoff notice |
| `RecipeStep` | `site/recipe` | Sticky index and composable step content |

Components should receive data and callbacks; they should not read content files or fetch their own route data. Prefer typed variants such as `kind: "skill" | "recipe"` and `pillar: Pillar` to expanding collections of boolean props. Use Svelte snippets for optional component regions where a fixed data prop becomes awkward.

The exact dependency rules, Svelte 5 composition APIs, reuse thresholds, shadcn acquisition/update policy, route
ceiling, and vertical validation sequence are accepted in the
[component-system contract](component-system-contract.md).

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
- `sonner`
- `tooltip`

Do not add `navigation-menu` initially: the service navigation is a list of links, not a composite menu. The exact
primitive and dependency boundary is governed by the
[LAB design-system and dependency contract](lab-design-system-dependency-contract.md).

`CatalogRow`, `InstallCommand`, `CodePanel`, recipe sections, and the editorial reading layout remain custom LAB components, but they must compose the shadcn primitives instead of introducing separate control, focus, overlay, or state conventions. Use `@lucide/svelte` for interface icons and remove runtime icon-CDN requests.

The current shadcn-svelte setup uses the SvelteKit CLI with Tailwind, a `components.json` file, and CSS-variable
theming. The accepted design-system contract keeps the existing storage-safe system/light/dark behavior in one locally
owned theme service; `mode-watcher@1.1.0` is not adopted because its published bootstrap and mounted component perform
unguarded storage access.

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

For Markdown, parse once into the accepted typed rich-document union and render through Svelte components. Preserve the
current visible escaping of raw HTML and reject unsafe URL schemes and broken local targets. Source-derived HTML and
`{@html}` are forbidden; see the shared content pipeline contract.

Use `/recipes/` and `/recipes/[slug]/` as the canonical Recipe routes. Preserve `recipes.html` and `recipe.html` as
generated compatibility pages during and after parity because GitHub Pages has no general redirect engine. The aliases
render from the same Recipe model and canonicalize to the clean routes; they are not a second content source.

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

Use one adapter configuration with a validated publication profile:

```js
import adapter from "@sveltejs/adapter-static";
import { publicationProfile } from "./src/lib/config/publication-profile.js";

const publication = publicationProfile(process.env.PUBLICATION_PROFILE);

export default {
  kit: {
    adapter: adapter({
      pages: "site",
      assets: "site",
      strict: true
    }),
    paths: {
      base: publication.base,
      relative: true
    }
  }
};
```

Use `$app/paths.resolve()` for internal routes and `asset()` for files in `static/`. Do not hand-build root-relative URLs.

Do not configure an adapter fallback. Prerender an explicit `/404.html` page with route-local
`trailingSlash = "never"` so both hosts receive a useful, noindex artifact-root error document while the adapter keeps
strict route enumeration enabled. The root layout uses `trailingSlash = "always"`; the `.html` compatibility routes
override it with `"never"` so their physical filenames remain exact.

### GitHub Pages

Use a custom GitHub Actions workflow, not branch-based Jekyll publishing:

1. Validate and build on `master`.
2. Select `PUBLICATION_PROFILE="pages-project"` for the `labdotsa.github.io/skills/` backup URL, or `"pages-root"`
   only for an explicitly root-mounted Pages deployment.
3. Derive canonical origin, base path, indexability, and machine-surface policy from that closed profile tuple.
4. Emit `noindex,follow` in every Pages HTML file and omit duplicate non-HTML machine endpoints unless the account-root
   `labdotsa.github.io/robots.txt` can be controlled; a nested `/skills/robots.txt` is not authoritative.
5. Upload `site/` with `actions/upload-pages-artifact`.
6. Deploy it with `actions/deploy-pages` from a job with `pages: write` and `id-token: write`.
7. Configure the custom domain in repository Pages settings when using Actions; do not rely on a committed `CNAME` file.

### Netlify

Keep the deployment static:

```toml
[build]
command = "npm run build"
publish = "site"

[build.environment]
NODE_VERSION = "24.19.0"

[context.production.environment]
PUBLICATION_PROFILE = "canonical"

[context.deploy-preview.environment]
PUBLICATION_PROFILE = "preview"

[context.branch-deploy.environment]
PUBLICATION_PROFILE = "preview"
```

Do not add `@sveltejs/adapter-netlify` unless the product later requires runtime SSR, functions, form actions, or non-prerendered endpoints.

### One artifact or two

The same byte-for-byte artifact works when both hosts serve the app from the same URL base and publication policy. A normal GitHub project site serves from `/skills`, while Netlify serves from `/`, and the backup is non-indexable, so those targets run the same source revision under different validated publication profiles. They are distinct generated artifacts, never distinct application sources.

Netlify at `https://skills.lab.sa` is the canonical production origin. Its platform hostname redirects to that origin;
deploy previews and the GitHub Pages backup emit `noindex,follow` while carrying canonical tags on `skills.lab.sa`.

## Build-output policy

Keep committing `site/` on the legacy default branch while parity is being proved. The one atomic cutover commit removes
tracked generated bytes, adds `/site/` to `.gitignore`, and makes CI/each host build its Publication Artifact from the
same source revision. That commit updates `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, workflows, validators, and the
changelog together. See the [atomic cutover and rollback contract](atomic-cutover-and-rollback-contract.md).

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
- Produce and verify the permanent pre-cutover tag and checksummed legacy release bundle.
- Squash the completed migration branch into one reviewed default-branch cutover commit, then prove both profiles again.
- Remove tracked `site/` and every obsolete generator/source path in that same commit; no compatibility implementation
  may remain reachable.

Exit: the same source revision is deployed successfully to both providers.

### Phase 5 — post-cutover verification

- Record both provider deploy IDs, manifests, smoke results, and the rollback dry-run.
- Confirm repository instructions, contributor documentation, validators, and release notes describe only SvelteKit.
- Remove obsolete generator tests only when their public contracts are covered by route/output tests.
- Add Storybook later only if the component inventory justifies a separate workshop; it is not a cutover dependency.

Exit: no legacy architecture is required to build, validate, preview, or deploy.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Base-path failures on Pages | Build both canonical and `pages-project` profiles in CI; use `resolve()` and `asset()` everywhere. |
| Visual drift while replacing 4,200 lines of CSS | Migrate by vertical slice and use the existing QA viewports as screenshot baselines. |
| Unsafe Markdown HTML | Preserve visible escaping through the typed rich-document renderer; never pass Source Content to `{@html}`. |
| Missing dynamic pages | Export `entries()` and keep adapter-static `strict: true`. |
| shadcn styling erases LAB identity | Treat shadcn as owned primitives and map its semantic tokens to LAB variables. |
| Tailwind misses data-driven classes | Use static variant maps or CSS variables; never concatenate class fragments. |
| Generated-output churn | Keep `site/` committed only through parity, then move deployment artifacts to CI. |
| URL changes break Pages links | Preserve existing URLs in the first release and generate legacy aliases before later cleanup. |
| Provider-specific features split the architecture | Keep the production surface inside the common static-host capability set. |

## Accepted decisions

1. `src/` is the sole application source; `skills/` and `recipes/` remain canonical Source Content; shared domain and
   build-time readers live under `src/lib`; `site/` is generated only. See
   [ADR 0001](adr/0001-single-source-static-discovery-site.md).
2. Netlify owns canonical `https://skills.lab.sa`; GitHub Pages remains a non-indexable `/skills/` backup; clean Recipe
   routes are canonical and the current `.html` routes remain generated aliases. See
   [ADR 0002](adr/0002-canonical-origin-and-public-urls.md).
3. The canonical production build must satisfy the crawl, indexation, metadata, structured-data, internal-linking,
   content-intent, Core Web Vitals, measurement, and regression requirements in the
   [technical SEO contract](technical-seo-contract.md).
4. Canonical LLM discovery uses one proposal-compatible `/llms.txt`, exact Markdown mirrors, versioned catalogs,
   stable canonical identifiers, content digests, explicit MIT context, and an audited permissive crawler policy. The
   Pages backup omits duplicate machine endpoints. See the [LLM discovery contract](llm-discovery-contract.md).
5. One build-scoped Catalog snapshot reads exact Source Content bytes once, uses strict YAML/runtime schemas and one
   Markdown AST, resolves relationships once, and derives all human and machine projections. Rich content is rendered
   through typed Svelte components without source `{@html}`. See the
   [shared content pipeline contract](content-pipeline-contract.md).
6. One SvelteKit route graph produces validated canonical, preview, and Pages publication profiles; every real route is
   prerendered, dynamic entries are explicit, URL construction is base-aware, and a real static `404.html` replaces an
   SPA fallback. See the [portable static-hosting contract](portable-static-hosting-contract.md).
7. The component system has exactly three layers: owned shadcn primitives in `ui/`, product-neutral compositions in
   `shared/`, and every product-aware screen/feature component in `site/`; routes remain data/selection adapters. See
   the [component-system and shadcn ownership contract](component-system-contract.md).
8. One Tailwind v4 Vite pipeline maps the preserved LAB palette into shadcn semantics; one storage-safe local theme
   service, bundled Lucide imports, local licensed assets, nine initial primitives, six supporting runtime packages,
   exact direct versions, and one npm lockfile govern every host build. See the
   [LAB design-system and dependency contract](lab-design-system-dependency-contract.md).
9. The current functioning Discovery Site is the approved representative product prototype. The full end-to-end
   revamp replaces its implementation with the accepted SvelteKit/component architecture while preserving its product
   direction and contract-bounded behavior. No parallel throwaway UI is required. See the
   [existing-prototype acceptance](existing-prototype-acceptance.md).
10. The migration stays isolated while legacy remains live, then one reviewed squash commit atomically replaces
    `website/` with `src/`, removes tracked `site/`, and switches every command/deployment. A permanent annotated tag,
    checksummed release bundle, rollback drill, and normal revert make the boundary recoverable. See the
    [atomic cutover and rollback contract](atomic-cutover-and-rollback-contract.md).

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
