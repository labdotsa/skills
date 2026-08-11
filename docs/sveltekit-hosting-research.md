# SvelteKit discovery-site hosting research

Researched on 2026-08-11 against current official documentation. The Svelte, Tailwind, shadcn-svelte, GitHub, and Netlify documentation is rolling documentation unless a version is stated below.

## Recommendation

Rebuild the discovery site as one **static-first SvelteKit application** using Svelte 5, Tailwind CSS v4, and selectively copied shadcn-svelte primitives. Use `@sveltejs/adapter-static` for both hosts, keep every public page and endpoint prerenderable, and produce two artifacts from the same source:

- GitHub project Pages: `BASE_PATH="/skills"` (or `"/<repository-name>"` generally).
- Netlify and root-mounted custom domains: `BASE_PATH=""`.

This is simpler than switching adapters and preserves feature parity. Netlify explicitly supports `adapter-static` for fully static SvelteKit sites; `adapter-netlify` is only needed when the application gains request-time SSR or functions. GitHub Pages is a static host, so those server-only features cannot be part of a dual-host baseline. [SvelteKit static adapter](https://svelte.dev/docs/kit/adapter-static), [Netlify's SvelteKit guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/sveltekit/), [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

The later [portable static-hosting contract](portable-static-hosting-contract.md) accepts this architecture while
replacing the loose `BASE_PATH`/indexability inputs below with one validated `PUBLICATION_PROFILE` tuple. It also
supersedes the original fallback recommendation with an explicit prerendered `404.html` page. Treat that contract as
normative; examples below remain the evidence trail that led to it.

Use the existing `site/` directory as generated output to preserve the repository convention. Treat `src/` as the only application source and `site/` strictly as a reproducible Publication Artifact. The later single-source constraint supersedes an alongside migration: parity comparisons must use the base branch, deployed artifact, screenshots, and QA records rather than keeping `website/` and `src/` as simultaneous authoring trees. The legacy `scripts/build-site.mjs` and `scripts/validate-site.mjs` implementations were retired by the source cutover; current commands live in [`package.json`](../package.json).

## Verified stack guidance

### SvelteKit and static generation

`adapter-static` prerenders a SvelteKit application to HTML, CSS, and JavaScript. Set `export const prerender = true` in the root layout module and leave SSR enabled; SvelteKit warns that `ssr = false` saves an empty shell instead of fully rendered HTML. Keep the adapter's default `strict: true` so the build fails when a route was not made available in the output. [Static site generation](https://svelte.dev/docs/kit/adapter-static), [page options](https://svelte.dev/docs/kit/page-options)

Dynamic routes such as `/skills/[name]` must either be found through links on prerendered pages or declare an `entries()` function. The latter is the safer contract for this repository: generate skill and recipe parameters from the same catalog readers used by the site. SvelteKit also permits prerendered `+server` routes, which suits `skills.json`, `recipes.json`, `sitemap.xml`, and `robots.txt`. Form actions cannot be prerendered. [Prerender entries and dynamic routes](https://svelte.dev/docs/kit/page-options#entries)

For extensionless static routes, prefer `trailingSlash = "always"` so `/a/` emits `/a/index.html`; SvelteKit notes this is required on hosts that do not serve `/a.html` for `/a`. This matches the current canonical Skill URLs and the accepted clean Recipe routes. The current `recipes.html` and `recipe.html` URLs remain physical compatibility pages canonicalizing to `/recipes/` and `/recipes/functional-prototype/`; do not depend on Netlify-only rewrites because GitHub Pages must serve the same aliases. [SvelteKit trailing-slash guidance](https://svelte.dev/docs/kit/page-options#trailingSlash)

### Tailwind CSS v4

The official SvelteKit setup installs `tailwindcss` and `@tailwindcss/vite`, registers plugins as `[tailwindcss(), sveltekit()]`, imports `@import "tailwindcss"` in the global CSS file, and imports that file once in the root layout. Tailwind v4 uses CSS-first theme variables, which are a good home for the existing site's color, typography, spacing, radius, and shadow tokens. [Tailwind's SvelteKit guide](https://tailwindcss.com/docs/installation/framework-guides/sveltekit), [theme variables](https://tailwindcss.com/docs/theme)

Two constraints should be accepted explicitly:

- Tailwind v4 targets modern browsers: Chrome 111+, Safari 16.4+, and Firefox 128+. [Compatibility](https://tailwindcss.com/docs/compatibility)
- Tailwind scans source as text. Component variants must map props to complete class strings rather than construct fragments such as `bg-${color}-500`. [Class detection](https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names)

### shadcn-svelte and component ownership

Current shadcn-svelte supports Svelte 5 and Tailwind v4. Its CLI adds editable source code rather than a sealed UI package, and its docs describe the components as a composable code-distribution system. Initialize it against the global CSS file and add only the primitives the site actually uses. [SvelteKit installation](https://shadcn-svelte.com/docs/installation/sveltekit), [shadcn-svelte principles](https://shadcn-svelte.com/docs), [Tailwind v4 migration](https://shadcn-svelte.com/docs/migration/tailwind-v4)

Keep three component layers so copied primitives do not become the application architecture:

```text
src/lib/
  components/
    ui/          # shadcn-svelte primitives; locally owned, minimally adapted
    shared/      # product-neutral compositions: CopyButton, ThemeToggle, SearchField
    site/        # discovery-site sections: SiteHeader, CatalogRow, SkillArticle
  content/       # catalog/recipe view models and shared transforms
  server/        # build-time repository readers and Markdown rendering
src/routes/      # thin route loading, metadata, and page composition
```

The shadcn CLI can overwrite locally edited primitives during updates, so changes should be reviewed through version-control diffs rather than applied blindly. [shadcn-svelte update warning](https://shadcn-svelte.com/docs/migration/tailwind-v4#6-update-your-colors-optional)

## Base paths and portable URLs

GitHub project Pages is mounted at `https://<owner>.github.io/<repository-name>`, while an owner site named `<owner>.github.io` is mounted at the root. SvelteKit therefore requires `kit.paths.base` to match the repository name for ordinary project Pages. Netlify normally serves the same app at the root. [GitHub Pages site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [SvelteKit's GitHub Pages guidance](https://svelte.dev/docs/kit/adapter-static#github-pages)

Use an environment-controlled base and leave `paths.assets` empty; the latter is for a separate absolute asset origin, not the Pages repository prefix.

```js
// svelte.config.js — illustrative target configuration
import adapter from '@sveltejs/adapter-static';

const base = process.env.BASE_PATH ?? '';

export default {
  kit: {
    adapter: adapter({
      pages: 'site',
      assets: 'site',
      strict: true
    }),
    paths: { base, relative: true }
  }
};
```

`paths.relative` already defaults to `true` and makes generated asset paths more portable, but it does not make hard-coded root-relative links safe. Generate route hrefs with `resolve()` and static-file URLs with `asset()` from `$app/paths`; these APIs apply the configured base path and require SvelteKit 2.26 or newer. [Path configuration](https://svelte.dev/docs/kit/configuration#paths), [`$app/paths`](https://svelte.dev/docs/kit/%24app-paths)

Omit the adapter `fallback` option. SvelteKit generates it through its SPA fallback machinery and skips the adapter's strict dynamic-route check whenever a fallback exists, which weakens the fully prerendered contract. Instead, prerender an explicit `/404.html` page with route-local `trailingSlash = "never"`; it emits the artifact-root `404.html` that GitHub Pages and Netlify automatically display for unresolved paths. The document must contain useful `noindex` content, omit a canonical, and remain outside navigation and the sitemap. This correction supersedes the earlier fallback recommendation while preserving a real host-level `404` response for unknown URLs. [Adapter fallback](https://svelte.dev/docs/kit/adapter-static#fallback), [GitHub Pages custom 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site), [Netlify custom 404 handling](https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling)

The canonical origin is a separate build concern from the base path. The accepted policy sets `SITE_ORIGIN=https://skills.lab.sa` for both builds, makes the root Netlify artifact indexable, and makes the `/skills` GitHub Pages artifact non-indexable. Canonical links, Open Graph metadata, structured data, robots, and the sitemap derive from those build inputs. Because a project-level `/skills/robots.txt` is not authoritative for the `labdotsa.github.io` host, Pages isolation relies on HTML `noindex`; duplicate non-HTML machine endpoints are omitted unless account-root robots control is available.

## Deployment shapes

### GitHub Pages

Use a custom GitHub Actions Pages workflow because the project has a build step. The official flow is checkout, install/build, upload the generated directory with `actions/upload-pages-artifact`, then deploy it in a dependent job with `pages: write`, `id-token: write`, and the `github-pages` environment using `actions/deploy-pages`. Select **GitHub Actions** as the Pages publishing source. Copy current action major versions from GitHub's maintained template when implementing rather than freezing versions from this research note. [Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

The build job should set:

```yaml
env:
  BASE_PATH: /${{ github.event.repository.name }}
  # SITE_ORIGIN: https://${{ github.repository_owner }}.github.io
```

Omit `BASE_PATH` when the Pages deployment uses a root-mounted custom domain. Upload `site/`. SvelteKit says `.nojekyll` is needed when publishing built files without GitHub Actions; retaining the existing file is harmless if branch publishing remains a supported fallback. [SvelteKit GitHub Pages example](https://svelte.dev/docs/kit/adapter-static#github-pages)

### Netlify

Commit a root `netlify.toml` so deployment settings travel with the repository:

```toml
[build]
command = "npm run build"
publish = "site"
```

Do not set `BASE_PATH` for the normal root-mounted Netlify site. Netlify's file configuration overrides conflicting UI values, making the checked-in configuration the reusable source of truth. Pin the build Node version with the repository's normal Node-version mechanism or Netlify's documented `NODE_VERSION` setting. [Netlify SvelteKit deployment](https://docs.netlify.com/build/frameworks/framework-setup-guides/sveltekit/), [file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [build dependencies](https://docs.netlify.com/build/configure-builds/manage-dependencies/)

## Migration and verification sequence

1. Establish SvelteKit as the sole application source on the migration branch; configure Tailwind v4, shadcn-svelte, Lucide Svelte, and `adapter-static` output to `site/`, retiring `website/` as an authoring tree in the same integration change.
2. Extract design tokens from the existing CSS and map every interactive surface onto locally owned shadcn primitives and LAB components.
3. Consolidate catalog and recipe behavior into one shared source model consumed by server-only loaders and thin repository commands. Implement explicit dynamic-route `entries()` and prerendered JSON/XML/text endpoints from that model.
4. Port shared shell, theme, copy, catalog row, directory, Markdown article, related-content, and recipe sections into the three component layers above. Keep routes thin.
5. Preserve existing public URLs, metadata, JSON shapes, sitemap entries, theme behavior, copy behavior, and Markdown output before considering an information-architecture change.
6. Replace the current generated-file validator with equivalent SvelteKit output-contract tests, then run two CI builds: root (`BASE_PATH=""`) and project subpath (`BASE_PATH="/skills"`). Check both with a static server and an internal-link/asset crawl.
7. Add the Pages workflow and `netlify.toml`; deploy previews first, then switch the canonical domain only after output and visual parity are accepted.

The important architectural boundary is static portability: content can be read from the repository during the build, and client interactions can hydrate normally, but request-time filesystem access, form actions, authentication, and server endpoints would require a Netlify-specific runtime and would no longer ship unchanged to GitHub Pages.
