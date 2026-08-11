# Portable static-hosting contract

Status: accepted planning contract for issue #10. Researched on 2026-08-11 against the current SvelteKit, GitHub
Pages, and Netlify documentation and the SvelteKit source. This contract refines the earlier
[hosting research](sveltekit-hosting-research.md); where they differ, this document is normative.

## Decision

Ship one SvelteKit application, one route graph, one content pipeline, and one adapter configuration. Build that same
source revision under a small set of validated publication profiles. The profiles may produce different static bytes
because their URL base and indexing policy differ; they are **not** separate applications or frontend sources.

Use `@sveltejs/adapter-static` for every profile, write a complete static Publication Artifact, keep SSR enabled during
prerendering, and keep adapter `strict: true`. Netlify receives the root canonical build. GitHub Pages receives either a
`/skills` project build or a root-mounted custom-domain build. Neither host may require provider-specific application
components, loaders, route branches, or runtime functions. SvelteKit documents both fully static generation and the
project-site base-path requirement; Netlify explicitly supports `adapter-static` for static SvelteKit sites.
([adapter-static](https://svelte.dev/docs/kit/adapter-static),
[Netlify SvelteKit guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/sveltekit/))

## Invariants

1. `src/` is the only application source. `skills/` and `recipes/` are Source Content; `site/` is generated output.
2. A profile changes publication policy, never route implementation or component composition.
3. Every public page is complete, meaningful SSR HTML before hydration. `ssr = false` is forbidden.
4. Every real route is prerendered. There is no SPA fallback, catch-all rewrite, server action, request-time endpoint,
   filesystem read, Netlify function, or Edge Function in the common architecture.
5. All routes and machine projections consume the one build-scoped Catalog snapshot defined in the
   [content pipeline contract](content-pipeline-contract.md).
6. All internal route URLs and static asset URLs pass through the SvelteKit base-path APIs. A provider-specific
   frontend conditional, handwritten `/skills` prefix, or unqualified root-relative application URL fails validation.
7. Canonical identity is always rooted at `https://skills.lab.sa`; the Pages base path is deployment location, not
   canonical identity.
8. The canonical Netlify artifact is the only indexable and machine-discovery-complete artifact. Preview and Pages HTML
   is `noindex,follow` and omits duplicate non-HTML discovery surfaces.
9. Unknown paths remain unknown: both hosts return their real `404` status while displaying the same useful static
   `404.html` document.
10. Both deploy jobs build from the same immutable commit and run the same validation command.

## Publication profiles

One checked-in module owns a closed `PublicationProfile` union. Configuration reads one required
`PUBLICATION_PROFILE` value; it does not independently trust `BASE_PATH`, `SITE_ORIGIN`, or `SITE_INDEXABLE` values that
could form an invalid combination.

| Profile | Intended deployment | `paths.base` | HTML robots | Canonical origin | Machine surfaces |
| --- | --- | --- | --- | --- | --- |
| `canonical` | Netlify production | `""` | normal indexability | `https://skills.lab.sa` | complete |
| `preview` | Netlify deploy/branch preview | `""` | `noindex,follow` | `https://skills.lab.sa` | omitted |
| `pages-project` | `labdotsa.github.io/skills/` | `"/skills"` | `noindex,follow` | `https://skills.lab.sa` | omitted |
| `pages-root` | Pages root/custom-domain backup | `""` | `noindex,follow` | `https://skills.lab.sa` | omitted |

An absent or unknown profile is a build error. The profile module returns a frozen value containing at least `name`,
`base`, `canonicalOrigin`, `indexable`, and `publishMachineSurfaces`. Canonical origin has no trailing slash; base is
either empty or begins with one slash and has no trailing slash. No runtime hostname sniffing may change these values.

Netlify configuration selects `canonical` only for production context and `preview` for deploy previews and branch
deploys. The Pages workflow selects `pages-project` for the normal repository URL and `pages-root` only when its
deployment is explicitly root-mounted. Deployment tickets #25 and #26 own the exact provider configuration.

## SvelteKit configuration

The implementation shape is one configuration, not one per host:

```js
import adapter from '@sveltejs/adapter-static';
import { publicationProfile } from './src/lib/config/publication-profile.js';

const publication = publicationProfile(process.env.PUBLICATION_PROFILE);

export default {
  kit: {
    adapter: adapter({ pages: 'site', assets: 'site', strict: true }),
    paths: { base: publication.base, relative: true }
  }
};
```

The adapter `fallback` option is deliberately absent. SvelteKit describes fallback generation as SPA mode, warns of
its performance and SEO costs, and its adapter source skips the strict dynamic-route check whenever `fallback` is set.
([SPA warning](https://svelte.dev/docs/kit/single-page-apps),
[adapter source](https://github.com/sveltejs/kit/blob/main/packages/adapter-static/index.js))

The root `+layout.ts` exports:

```ts
export const prerender = true;
export const trailingSlash = 'always';
```

SSR remains enabled. The global trailing-slash rule makes extensionless routes emit portable `index.html` files.
Only the three literal `.html` routes override it with `trailingSlash = 'never'`.
([page options](https://svelte.dev/docs/kit/page-options))

## Route and prerender contract

| Route source | Logical URL | Entry rule | Physical file | Notes |
| --- | --- | --- | --- | --- |
| root page | `/` | fixed | `index.html` | Catalog landing page |
| Skill page | `/skills/[name]/` | every snapshot Skill name | `skills/<name>/index.html` | `entries()` is mandatory |
| Recipe index | `/recipes/` | fixed | `recipes/index.html` | Canonical Recipe directory |
| Recipe page | `/recipes/[slug]/` | every snapshot Recipe slug | `recipes/<slug>/index.html` | `entries()` is mandatory |
| Recipe alias | `/recipes.html` | fixed | `recipes.html` | Same view model; canonical `/recipes/` |
| Recipe alias | `/recipe.html` | fixed | `recipe.html` | Same view model; canonical `/recipes/functional-prototype/` |
| not-found document | `/404.html` | fixed | `404.html` | Useful noindex page; no canonical |

Dynamic `entries()` functions derive from the same immutable Catalog snapshot as their loaders. Link discovery may add
evidence, but it is not the completeness mechanism. Duplicate or invalid names/slugs fail before route enumeration.
Every expected entry must exist physically after build, and no stale dynamic entry may remain from a previous build.

The aliases are real prerendered pages rather than provider redirects because GitHub Pages has no general redirect
engine. They share data, components, and metadata builders with their canonical destinations; they are compatibility
outputs, never alternate content sources. They are omitted from navigation and sitemap.

## Not-found behavior

Implement `/404.html` as an ordinary prerendered Svelte page with route-local `trailingSlash = 'never'`. It uses the
shared shell and components, explains that the page does not exist, and links back to canonical catalog entry points.
It always emits `noindex,follow`, has a distinct title and description, emits no canonical and no JSON-LD entity, and is
excluded from sitemap and normal navigation.

Do not throw a prerender-time `404` to create this file: SvelteKit's prerenderer does not save error responses. Do not
set adapter `fallback`: that creates an SPA fallback and weakens strict route enumeration. The explicit page emits the
artifact-root file expected by both providers. GitHub Pages supports a publishing-root `404.html`; Netlify automatically
uses `404.html` for paths that do not resolve to a static file. Both serve it for an unknown URL while retaining the
host's `404` response status.
([GitHub Pages custom 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site),
[Netlify custom 404](https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling),
[SvelteKit prerender source](https://github.com/sveltejs/kit/blob/main/packages/kit/src/core/postbuild/prerender.js))

A direct request to `/404.html` may receive `200`; its unconditional `noindex` and omission from discovery surfaces make
that harmless. Acceptance smoke tests must separately prove that a random missing URL returns `404` on both hosts.

## URL and asset construction

- Typed internal destinations use `resolve()` from `$app/paths`, including parameter objects for dynamic routes.
- Static files use `asset()` from `$app/paths`.
- Standard links render as real `<a href>` elements in the prerendered HTML.
- Canonical, Open Graph, JSON-LD identifiers, sitemap locations, and machine-document identifiers use the canonical URL
  builder, not `resolve()`, because deployment base must never enter canonical identity.
- Source-repository and other external URLs are already absolute and do not receive the application base.
- CSS `url(...)`, manifests, preload links, icons, social images, imports, client fetches, and copyable local links are
  covered by the same audit; no hidden root-relative exception exists.
- `paths.assets` remains unset. It represents a separate absolute asset origin, not the Pages project prefix.
- `paths.relative` remains `true`, but is not accepted as a substitute for the explicit URL APIs.

`resolve()` and `asset()` apply the configured base path. The required `$app/paths` API is available in SvelteKit 2.26
and later, which therefore becomes the implementation floor.
([`$app/paths`](https://svelte.dev/docs/kit/%24app-paths),
[path configuration](https://svelte.dev/docs/kit/configuration#paths))

## Canonical, robots, sitemap, and machine output

The [canonical URL ADR](adr/0002-canonical-origin-and-public-urls.md),
[technical SEO contract](technical-seo-contract.md), and
[LLM discovery contract](llm-discovery-contract.md) remain authoritative. Routing implements them as follows:

- Canonical-profile clean pages emit self-canonicals at `https://skills.lab.sa`.
- Alias pages emit the clean destination canonical. A profile's deployment base never appears in a canonical URL.
- Pages and preview pages emit the same production canonical plus `noindex,follow`.
- Canonical `sitemap.xml` contains only clean, indexable HTML URLs at the canonical origin—never aliases, `404.html`,
  preview URLs, Pages URLs, fragments, or machine endpoints.
- Canonical `robots.txt` is artifact-root UTF-8 text and names the absolute canonical sitemap.
- A nested `/skills/robots.txt` cannot govern `labdotsa.github.io`; Pages and preview profiles therefore omit robots,
  sitemap, catalogs, raw Markdown mirrors, and `llms.txt` rather than publishing misleading or duplicate copies.
- Canonical profile prerenders every approved JSON, XML, text, and Markdown endpoint from the one Catalog snapshot.
  Noncanonical profiles exclude those endpoints through profile-driven prerender entries, not route-component forks.
- Exact endpoint names, schemas, digests, media types, and ordering remain owned by issues #8 and #9.

## Artifact matrix

Every build starts from an empty output directory. The artifact root itself is uploaded; a Pages project build must not
nest files under an additional `skills/` directory because GitHub supplies the mount point.

| Assertion | `canonical` | `preview` | `pages-project` | `pages-root` |
| --- | --- | --- | --- | --- |
| Human route file set | complete | identical | identical | identical |
| Root physical paths | yes | yes | yes | yes |
| Rendered application base | empty | empty | `/skills` | empty |
| Indexable HTML | yes | no | no | no |
| Production canonical links | yes | yes | yes | yes |
| Canonical machine surfaces | yes | no | no | no |
| `404.html` | yes | yes | yes | yes |
| Provider application code | none | none | none | none |

The human route file set, visible content model, component structure, accessible names, and interactive behavior must be
equivalent across profiles. Expected byte differences are limited to base-aware URLs, robots metadata, publication
profile data, and inclusion of canonical-only machine surfaces. Hashed assets should otherwise match when the bundler
inputs match. Validation compares normalized manifests rather than incorrectly demanding byte-identical HTML.

## Build and deployment boundary

CI builds canonical and project-base artifacts from the same checked-out commit and lockfile. Each build runs catalog
validation first, uses a clean isolated output directory, records the commit SHA and profile in its manifest, then runs
the shared static-output validator. Parallel jobs must not write the same `site/` directory.

The checked-in GitHub Pages workflow later owns checkout, dependency installation, validation, the `pages-project`
build, official Pages artifact upload, and deploy with only `pages: write` and `id-token: write` permissions. GitHub's
custom workflow documentation defines the upload/deploy job shape.
([GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages))

The checked-in Netlify configuration later owns supported Node selection, context-to-profile mapping, shared build
command, and `site/` publish directory. It must not select `adapter-netlify` or add a catch-all rewrite. Provider smoke
tests verify direct deep links, not-found status, assets, canonical/robots policy, theme, and hydrated interactions.

Whether `site/` remains committed after cutover is a repository-distribution decision, not a routing dependency. Until
that decision changes, commands must reproduce it exactly and agents must continue treating it as generated output.

## Vertical TDD implementation sequence

Each slice begins with a public output or behavior test, makes the smallest implementation pass, then refactors without
changing the contract.

1. **Profile slice:** reject absent/unknown profiles and snapshot every valid derived tuple before wiring Svelte config.
2. **Canonical shell slice:** build `/` as complete SSR HTML and assert canonical metadata, root assets, and hydration.
3. **Project-base slice:** build the same page with `pages-project`; assert `/skills` links/assets, production canonical,
   and `noindex,follow`, with no hard-coded prefix in source.
4. **Dynamic route slice:** seed two Skills and two Recipes; assert exact `entries()`, physical files, complete HTML, and
   failure on missing/stale entries.
5. **Alias slice:** assert exact `recipes.html` and `recipe.html` filenames, shared visible model, clean canonicals, and
   omission from navigation/sitemap.
6. **Not-found slice:** assert exact `404.html`, unconditional noindex/no-canonical semantics, and no adapter fallback;
   then host-smoke a random path and require status `404` plus the useful document.
7. **Machine-surface slice:** assert complete deterministic endpoints only in `canonical` and their absence from the
   other three profiles.
8. **URL-crawl slice:** crawl every HTML/CSS reference in root and project artifacts, fail broken or escaped-base local
   URLs, and separately validate all absolute canonical URLs.
9. **Artifact-equivalence slice:** compare normalized human-route manifests, metadata policy, content digests, assets,
   and hydration behavior across profiles.
10. **Provider slice:** run the same smoke suite against a Netlify deploy preview and GitHub Pages deployment, including
    direct dynamic deep links and unknown paths.

Build failure is required for an unprerendered expected route, an unexpected emitted route, invalid profile tuple,
broken local reference, wrong canonical origin, noncanonical machine endpoint, SPA fallback, or provider-only frontend
branch. The later quality-gate ticket #12 may add accessibility/performance budgets but may not weaken these assertions.

## Downstream ownership

- #11 accepts the existing functioning site as the representative product prototype; the complete SvelteKit rebuild
  uses shared shadcn-svelte/LAB components without revisiting routing.
- #12 adds accessibility, performance, interaction, and responsive gates on top of the artifact matrix.
- #16 defines the final component architecture while preserving thin routes and the shared shell used by `404.html`.
- #17 creates the SvelteKit foundation and implements the profile/configuration boundary.
- #18 implements shared content readers and explicit dynamic entries.
- #19 implements the component shell and human routes, including aliases and not-found content.
- #20 implements SEO and machine endpoints under the profile policy.
- #22 expands the shared parity/quality harness to both build profiles.
- #24 proves cutover readiness from isolated artifacts built at one commit.
- #25 owns Netlify configuration and root/profile deployment smoke tests.
- #26 owns the Pages Actions workflow, project/root modes, permissions, and deployment smoke tests.

Reopening this contract is required if a feature needs request-time state, an unbounded route space, authentication,
form actions, provider functions, a second canonical origin, or a deployment base that cannot be selected at build time.
Those changes leave the accepted common static-host capability set.

## Primary references

- [SvelteKit static adapter](https://svelte.dev/docs/kit/adapter-static)
- [SvelteKit page options and prerender entries](https://svelte.dev/docs/kit/page-options)
- [SvelteKit path configuration](https://svelte.dev/docs/kit/configuration#paths)
- [SvelteKit `$app/paths`](https://svelte.dev/docs/kit/%24app-paths)
- [SvelteKit SPA tradeoffs](https://svelte.dev/docs/kit/single-page-apps)
- [GitHub Pages site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages custom 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
- [Netlify SvelteKit guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/sveltekit/)
- [Netlify custom 404 handling](https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling)
