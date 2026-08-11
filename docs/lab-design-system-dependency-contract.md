# LAB design-system and dependency contract

Status: accepted planning contract for issue #6. Researched on 2026-08-11 against the current repository, first-party
project documentation, upstream source, and package-registry metadata. This contract operates inside the
[single-source ADR](adr/0001-single-source-static-discovery-site.md), the accepted
[component-system contract](component-system-contract.md), and the
[portable static-hosting contract](portable-static-hosting-contract.md).

## Decision

The Discovery Site has one design-token graph, one Tailwind CSS v4 compilation path, one theme service, one bundled
icon package, and one npm lockfile. Both Netlify and GitHub Pages build those same sources. Provider profiles may change
base-aware asset URLs and indexability metadata; they may not select a different theme, stylesheet, font service,
component registry, or dependency graph.

The component dependency direction remains:

```text
routes → site/ → shared/ → ui/ → headless packages/native elements
```

`ui/` owns the locally copied shadcn-svelte primitive source, `shared/` owns product-neutral LAB compositions, and
`site/` owns every product-aware screen and feature. Tokens and the class-merging utility sit below all three layers.
No layer may introduce a second visual system to work around the layer beneath it.

The implementation uses:

- Tailwind CSS v4 through `@tailwindcss/vite`, imported once from `src/app.css`;
- CSS custom properties for LAB source values and shadcn semantic aliases, exposed to utilities through `@theme inline`;
- a small locally owned theme service that preserves the existing `labs-color-theme` contract;
- direct, static imports from bundled `@lucide/svelte` icon subpaths;
- locally served, provenance-recorded fonts and brand assets only;
- nine initial shadcn-svelte primitives and six supporting runtime packages listed below;
- exact direct dependency versions plus the committed npm lockfile and `npm ci`.

Runtime CDN assets, remote font stylesheets, `@latest` imports, the Tailwind Play CDN, a PostCSS Tailwind pipeline,
legacy `website/styles.css`, global page-specific CSS bundles, and provider-specific design dependencies are forbidden.

## Current-state audit

The legacy source makes the migration requirements concrete:

- `website/styles.css` is a 4,213-line global cascade. Its root contains the LAB color, width, radius, and font values,
  while later regions repeat local code-panel colors and use durations from 160 ms through 680 ms.
- Light/dark colors are selected with `html[data-theme="dark"]`. `website/theme.js` defaults to `system`, stores
  `system | light | dark` under `labs-color-theme`, reacts to operating-system changes only in system mode, synchronizes
  storage changes across tabs, updates `color-scheme` and `theme-color`, and tolerates unavailable storage.
- Three CSS files load from `lab.sa` at runtime. Only IBM Plex Sans Arabic and Maax Unicase are referenced by the
  cascade; GT America Arabic is imported but unused.
- LAB logos, favicons, touch icons, and the social image are requested from `lab.sa` at runtime even though an unused
  `website/og.png` already exists locally.
- theme, copy, busy, and success icons are fetched from `unpkg.com/lucide-static@latest`; footer social icons are
  separately hand-authored SVGs.
- `package.json` currently has only Playwright as a development dependency and `package-lock.json` is the sole lockfile.

These are evidence for behavior and visual values, not permission to retain their implementation. The remote asset
requests, duplicated SVGs, global cascade, and browser-wide scripts retire with `website/`, as required by ADR 0001.

## One Tailwind pipeline

`src/app.css` is the only global stylesheet entry point. `vite.config.ts` registers `@tailwindcss/vite` once and the
stylesheet begins with one `@import "tailwindcss"`. There is no `tailwind.config.*`, PostCSS Tailwind plugin,
`@tailwind` v3 directive, Sass design-token layer, CSS-in-JS runtime, or separate shadcn stylesheet. Tailwind recommends
its Vite plugin for SvelteKit and describes the generated CSS as zero-runtime
([Tailwind Vite installation](https://tailwindcss.com/docs/installation/using-vite)).

The allowed styling locations are:

| Location | Owns |
| --- | --- |
| `src/app.css` | Tailwind import, font faces, LAB raw values, shadcn aliases, `@theme inline`, reset/base rules, named motion, selection, and rich-document rules shared by every page |
| `ui/` primitive source | Token-driven primitive variants and headless state selectors |
| `shared/` components | Product-neutral composition layout using complete utilities |
| `site/` components | Feature layout and bounded scoped CSS for editorial prose, sticky rails, pseudo-elements, or behavior not clear as utilities |
| route components | No product styling |

`@apply` component classes, copied utility bundles, and a second global component sheet are rejected. Variant maps use
complete literal class strings. A category or pillar may select a closed typed variant or set `--lab-accent`; it may
not construct `bg-${value}` or another class fragment. Tailwind theme variables create utility APIs, and `@theme inline`
is the documented mechanism when a theme variable refers to another CSS variable
([theme variables](https://tailwindcss.com/docs/theme),
[color variable references](https://tailwindcss.com/docs/colors#referencing-other-variables)).

## Token graph

### Raw LAB values

Raw values receive a `--lab-*` prefix so shadcn's `--muted` background semantic cannot collide with the legacy
`--muted` text color. These values preserve the recorded palette while making their roles explicit.

| LAB token | Light | Dark | Legacy source / purpose |
| --- | --- | --- | --- |
| `--lab-canvas` | `#fafafa` | `#09090b` | `--background` |
| `--lab-ink` | `#09090b` | `#fafafa` | `--foreground` |
| `--lab-surface` | `#f4f4f5` | `#18181b` | `--surface` |
| `--lab-surface-raised` | `#ffffff` | `#101010` | `--surface-raised` |
| `--lab-surface-strong` | `#e4e4e7` | `#27272a` | `--surface-strong` |
| `--lab-text-muted` | `#3f3f46` | `#d4d4d8` | legacy muted text |
| `--lab-text-subtle` | `#71717a` | `#a1a1aa` | legacy subtle text |
| `--lab-border` | `#e4e4e7` | `#27272a` | default boundary |
| `--lab-border-strong` | `#a1a1aa` | `#52525b` | emphasized/input boundary |
| `--lab-main` | `#b5afff` | `#b5afff` | primary LAB accent |
| `--lab-research` | `#00bfff` | `#00bfff` | Research pillar |
| `--lab-design` | `#f9c431` | `#f9c431` | Design pillar |
| `--lab-development` | `#ff6b6b` | `#ff6b6b` | Development pillar; not a destructive alias |
| `--lab-marketing` | `#01a26b` | `#01a26b` | Marketing pillar |
| `--lab-on-accent` | `#18181b` | `#18181b` | content on LAB pillar colors |
| `--lab-code` | `#18181b` | `#f4f4f5` | code surface |
| `--lab-code-ink` | `#f4f4f5` | `#18181b` | code content |
| `--lab-selection` | `rgb(129 140 248 / 25%)` | same | selection highlight |
| `--lab-focus-ring` | `#6d5ce7` | `#b5afff` | accessible focus distinction; deliberately stronger than the light brand fill |
| `--lab-danger` | `#dc2626` | `#f87171` | destructive action, distinct from the Development category |
| `--lab-on-danger` | `#ffffff` | `#18181b` | destructive foreground |

The light focus ring has a 4.64:1 contrast ratio against the canvas and the dark ring has 9.99:1; this is an intentional
semantic addition rather than changing `--lab-main`. `--lab-text-subtle` remains a recorded parity value, but normal
body text uses `--lab-text-muted`; issue #12 must reject any use of subtle text that misses the applicable contrast
requirement.

Layout and shape values are also named once:

| Token | Value |
| --- | --- |
| `--lab-content-max` | `64rem` (`1024px`) |
| `--lab-site-max` | `80rem` (`1280px`) |
| `--lab-radius-control` | `0.4375rem` (`7px`) |
| `--lab-radius-field` | `0.5rem` (`8px`) |
| `--lab-radius-panel` | `1rem` (`16px`) |
| `--lab-font-body` | `"IBM Plex Sans Arabic", ui-sans-serif, system-ui, sans-serif` |
| `--lab-font-display` | `"Maax Unicase", "Arial Black", ui-sans-serif, sans-serif` when licensed; otherwise the same stack without Maax |
| `--lab-font-mono` | `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace` |

### shadcn semantic aliases

shadcn primitives consume standard semantic names, never raw pillar names unless a LAB variant explicitly requests a
pillar. The aliases are:

| shadcn semantic | LAB source |
| --- | --- |
| `--background`, `--foreground` | canvas, ink |
| `--card`, `--card-foreground` | raised surface, ink |
| `--popover`, `--popover-foreground` | raised surface, ink |
| `--primary`, `--primary-foreground` | main, on-accent |
| `--secondary`, `--secondary-foreground` | surface, ink |
| `--muted`, `--muted-foreground` | surface, text-muted |
| `--accent`, `--accent-foreground` | surface-strong, ink |
| `--destructive`, `--destructive-foreground` | danger, on-danger |
| `--border` | border |
| `--input` | border-strong |
| `--ring` | focus-ring |
| `--radius` | radius-field |

`primary` is the LAB brand action, not the current page's category. `development` never aliases `destructive`. `card`
and `popover` share a color but retain separate semantic variables so they can diverge later without changing component
APIs.

### CSS shape

The implementation follows this single graph; values are shown in hex to preserve parity rather than accepting a
generated neutral OKLCH theme:

```css
@import "tailwindcss";

@custom-variant dark (&:where(html[data-theme="dark"], html[data-theme="dark"] *));

:root {
  --lab-canvas: #fafafa;
  --lab-ink: #09090b;
  /* remaining light LAB values */
  --background: var(--lab-canvas);
  --foreground: var(--lab-ink);
  --card: var(--lab-surface-raised);
  --card-foreground: var(--lab-ink);
  --popover: var(--lab-surface-raised);
  --popover-foreground: var(--lab-ink);
  --primary: var(--lab-main);
  --primary-foreground: var(--lab-on-accent);
  --secondary: var(--lab-surface);
  --secondary-foreground: var(--lab-ink);
  --muted: var(--lab-surface);
  --muted-foreground: var(--lab-text-muted);
  --accent: var(--lab-surface-strong);
  --accent-foreground: var(--lab-ink);
  --destructive: var(--lab-danger);
  --destructive-foreground: var(--lab-on-danger);
  --border: var(--lab-border);
  --input: var(--lab-border-strong);
  --ring: var(--lab-focus-ring);
  --radius: var(--lab-radius-field);
}

html[data-theme="dark"] {
  /* only the dark LAB values from the table above */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-subtle: var(--lab-text-subtle);
  --color-border-strong: var(--lab-border-strong);
  --color-research: var(--lab-research);
  --color-design: var(--lab-design);
  --color-development: var(--lab-development);
  --color-marketing: var(--lab-marketing);
  --color-code: var(--lab-code);
  --color-code-foreground: var(--lab-code-ink);
  --font-sans: var(--lab-font-body);
  --font-display: var(--lab-font-display);
  --font-mono: var(--lab-font-mono);
  --radius-sm: var(--lab-radius-control);
  --radius-md: var(--lab-radius-field);
  --radius-lg: var(--lab-radius-panel);
  --container-content: var(--lab-content-max);
  --container-site: var(--lab-site-max);
}
```

Only variables that should create utilities enter `@theme`; metadata and behavior-only values remain ordinary custom
properties. Generated shadcn base colors are discarded, not layered under LAB values.

## Theme service

Theme is a locally owned product-neutral service under `src/lib/theme/`, mounted once by `SiteShell`, and consumed by
`shared/ThemeToggle.svelte` and the root `Toaster`. It is not route state and never lives in a module-global mutable
object during SSR.

The accepted contract is exact:

1. `ThemePreference` is the closed union `system | light | dark`; any missing or invalid value normalizes to `system`.
2. The storage key remains `labs-color-theme`, preserving existing users' choices.
3. A small inline bootstrap in `src/app.html` runs before application CSS is painted. It safely reads storage, resolves
   `system` with `matchMedia('(prefers-color-scheme: dark)')`, and atomically sets `html[data-theme]`,
   `html[data-theme-preference]`, `style.colorScheme`, and the matching `meta[name="theme-color"]` value.
4. Every storage access is guarded. Denied, unavailable, or quota-failing storage falls back to a non-persistent system
   preference and never prevents rendering.
5. The hydrated service adopts the bootstrapped values, then registers one media-query listener and one `storage`
   listener. System changes apply only while preference is `system`; a relevant storage event normalizes `newValue` and
   updates the current tab without writing it back.
6. A user choice updates the DOM first and then attempts persistence. The `system` choice is stored literally rather
   than removing the key, so cross-tab intent is unambiguous.
7. Theme changes update the resolved `theme-color` (`#f4f4f5` light, `#09090b` dark) and disable color transitions for
   the mutation frame. There is no light-to-dark animation.
8. Teardown removes both listeners. Client navigation must not add duplicate listeners.
9. `ThemeToggle` exposes three explicit shadcn `Button` choices inside a visibly labelled group, reports the selected
   preference with `aria-pressed`, exposes the resolved theme in status text, and retains native keyboard operation
   without a parallel select/toggle implementation or JavaScript-specific ARIA inventions.

The bootstrap and hydrated service share the same truth-table fixtures for normalization and resolution. The tiny
bootstrap serialization is the only deliberate duplication; it exists solely to execute before hydration and remains
inside the one owned theme subsystem.

`mode-watcher` is deliberately not an initial dependency. Its current `1.1.0` package does provide no-flash injection,
system tracking, and cross-tab persistence through Runed, and shadcn-svelte recommends it, but its published source
reads and writes `localStorage` without the guards required by the recorded legacy contract. Replacing the robust
existing behavior with that failure mode is not accepted. This decision may be revisited only after an upstream release
passes the same public tests; a second concurrent theme engine is never allowed.
([shadcn-svelte dark mode](https://shadcn-svelte.com/docs/dark-mode/svelte),
[mode-watcher source](https://github.com/svecosystem/mode-watcher),
[Runed cross-tab persistence](https://runed.dev/docs/utilities/persisted-state))

## Lucide Svelte policy

`@lucide/svelte` is the sole interface-icon package. Lucide provides standalone, typed Svelte components and documents
that only imported icons are included in the final bundle
([Lucide Svelte](https://lucide.dev/guide/svelte)).

Rules:

- Import the concrete icon from its subpath, for example `@lucide/svelte/icons/copy`; never use a wildcard/barrel
  namespace, the dynamic icon loader, string-to-icon lookup, `lucide-static`, or a runtime URL.
- The component that owns the meaning imports the icon. A bounded compile-time map is permitted only for a closed typed
  variant and must list every concrete import.
- Use `currentColor`, CSS sizing, and a LAB default stroke width of `1.75`; do not fork SVG path data to change color or
  size. Brand marks are assets, not Lucide icons.
- Decorative icons explicitly receive `aria-hidden="true"` and cannot be the only state cue. A text-labeled button does
  not label its child icon.
- An icon-only control places its accessible name on the control, preferably as visible-on-focus or `sr-only` text;
  Tooltip is supplemental and never the only name. The interactive wrapper is at least 44 by 44 CSS pixels on coarse
  pointers.
- A standalone meaningful icon receives adjacent visible text. Busy icons accompany `aria-busy`, a textual state, and
  a polite live message; reduced-motion mode renders the busy mark without rotation.

Lucide's accessibility guidance hides icons by default, prefers visible text, puts an icon-button name on the control,
and recommends a 44×44 target
([Lucide accessibility](https://lucide.dev/guide/accessibility)). Explicit attributes remain required so an upstream
default cannot silently change LAB semantics.

## Local fonts and brand assets

Every visual asset required to understand or render the site ships in the Publication Artifact and resolves through
SvelteKit's base-aware `asset()` API. Outbound company, source, and social links remain external navigation; they are not
runtime presentation dependencies.

### Fonts

- Self-host IBM Plex Sans Arabic Regular 400, Medium 500, SemiBold 600, and Bold 700 as WOFF2 under
  `src/lib/assets/fonts/ibm-plex-sans-arabic/`. Acquire the exact files from the official
  `@ibm/plex-sans-arabic@1.1.0` package, retain its OFL-1.1 license alongside the files, and reference them with relative
  `url()` values from `src/app.css` so Vite emits fingerprinted, base-aware assets. Declare `font-display: swap`. IBM
  publishes Plex under the SIL Open Font License
  ([IBM Plex repository](https://github.com/IBM/plex),
  [license](https://github.com/IBM/plex/blob/master/LICENSE.txt)).
- Load only those four faces; the legacy CSS's 100–300 and unused language subsets do not enter the artifact. Use the
  complete Arabic-capable WOFF2 faces so future Arabic content does not silently fall back while Latin text does not.
- Maax Unicase is a commercial 205TF face. A file being fetchable from `lab.sa` is not redistribution evidence. The
  public repository may include its Bold WOFF2 only after the owner records a web/redistribution license covering both
  `skills.lab.sa` and `labdotsa.github.io` in the private compliance record; the repository records only a non-sensitive
  provenance note. Until then `--lab-font-display` uses `"Arial Black", ui-sans-serif, sans-serif`. The published OTF
  is never converted without explicit license permission
  ([205TF Maax Unicase](https://www.205.tf/maax-unicase),
  [font licensing overview](https://www.monotype.com/font-licensing-explained-designers-and-brands)).
- GT America Arabic is removed because the audited source imports it but never references it.
- Do not preload a font in the first slice. Add one preload later only if route-wide measurement proves it improves LCP
  without unused bytes and the generated asset reference stays correct in both base-path builds; all faces otherwise
  load through CSS.

`font-display: swap` gives an extremely small block period and an ongoing swap period
([CSS Fonts definition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display)).
Fallback stacks must be measured in screenshot and CLS tests; local hosting does not waive the performance contract.

### Brand and social assets

Move approved source bytes into `static/brand/` with stable lowercase names: the LAB SVG logo, favicon SVG, Apple touch
icon, and canonical social image. Record origin, license/ownership, media type, pixel dimensions where applicable, and
SHA-256 in `static/brand/README.md`. Adopt the existing local `website/og.png` only if it matches the accepted social
image; otherwise replace it from the approved LAB original during the atomic migration.

The validator fails any UI image, icon, font, stylesheet, manifest, preload, or CSS `url()` whose host is external. It
also fails unresolved root-relative assets in the `/skills` Pages build. The SEO contract still requires the canonical
social-image metadata URL to be absolute; that URL points to the locally deployed canonical asset, not `lab.sa`.

## Motion contract

Motion has named values rather than scattered literals:

| Token | Value | Use |
| --- | --- | --- |
| `--motion-duration-fast` | `160ms` | micro feedback |
| `--motion-duration-standard` | `180ms` | control color/opacity |
| `--motion-duration-emphasis` | `220ms` | small transforms/surfaces |
| `--motion-duration-disclosure` | `240ms` | ordinary expand/collapse |
| `--motion-duration-editorial` | `620ms` | the one long reading-surface reveal, only when parity evidence requires it |
| `--motion-ease-standard` | `ease` | ordinary state changes |
| `--motion-ease-expressive` | `cubic-bezier(0.22, 1, 0.36, 1)` | disclosure/rail movement |
| `--motion-ease-linear` | `linear` | progress indicators only |

New components choose from these tokens. The legacy 200 ms, 680 ms, and page-local duplicates collapse into the nearest
semantic value after screenshot validation. Keyframes are named for user-visible intent (`copy-progress`,
`sheet-enter`, `sheet-exit`), live beside their owner, and use transform/opacity where possible.

`tw-animate-css` is not installed initially. It would introduce a broad second animation vocabulary when this site
needs a small audited set. shadcn source that assumes it is rewritten to the LAB tokens during acquisition.

All non-essential animation and spatial transition is opt-in through `motion-safe:`. Under
`prefers-reduced-motion: reduce`, smooth scrolling becomes `auto`, decorative transforms/animations are removed,
disclosures resolve immediately while retaining focus/state semantics, and busy state uses static icon plus text.
Tailwind provides both `motion-safe` and `motion-reduce` variants for this media preference
([Tailwind reduced-motion variants](https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion)).

## Initial shadcn primitive inventory

The full end-to-end revamp starts with exactly these owned primitives because each has an identified public behavior:

| Primitive | Immediate owner/use | Supporting package |
| --- | --- | --- |
| `button` | actions, theme/copy controls, link variants | `tailwind-variants`, `clsx`, `tailwind-merge` |
| `input` | directory search | native element plus class utilities |
| `tabs` | Skills/Recipes directory switch | `bits-ui` |
| `sheet` | accessible mobile navigation overlay | `bits-ui`, Lucide close icon |
| `collapsible` | overflowing Skill instructions/package sections | `bits-ui` |
| `breadcrumb` | Skill and Recipe hierarchy | native links plus Lucide separator |
| `separator` | visible/semantic section boundaries | `bits-ui` |
| `sonner` | copy success/failure live feedback host | `svelte-sonner` |
| `tooltip` | supplemental hints for unfamiliar icon-only controls | `bits-ui` |

Do not initially add `navigation-menu`: the current desktop service navigation is a simple list of links, not a
composite menu. Do not add `card`, `label`, `select`, `spinner`, `dropdown-menu`, `command`, forms packages, carousel,
drawer, table, or a second toast library until a failing vertical-slice test proves a behavior that native HTML or the
nine primitives cannot satisfy. `CatalogRow`, `CodePanel`, `InstallCommand`, Recipe sections, and reading layouts stay
LAB compositions in `shared/` or `site/`, never registry primitives.

The supporting runtime package set is therefore exactly:

1. `@lucide/svelte`
2. `bits-ui`
3. `svelte-sonner`
4. `tailwind-variants`
5. `clsx`
6. `tailwind-merge`

shadcn-svelte describes itself as open component code built on Bits UI and Tailwind rather than a sealed component
library; copied files become repository-owned source
([shadcn-svelte principles](https://shadcn-svelte.com/docs),
[current Button source](https://shadcn-svelte.com/docs/components/button)).

## Version and lockfile governance

### Reviewed compatibility baseline

Registry versions observed on 2026-08-11 form the implementation baseline, not a license to use future `latest` tags:

| Package/tool | Baseline | Placement |
| --- | --- | --- |
| Node.js | `24.19.0` LTS | checked runtime file and both CI hosts |
| npm | `11.17.0` | `packageManager` field / CI |
| `svelte` | `5.56.8` | dev dependency |
| `@sveltejs/kit` | `2.70.2` | dev dependency |
| `@sveltejs/adapter-static` | `3.0.10` | dev dependency |
| `@sveltejs/vite-plugin-svelte` | `7.3.0` | dev dependency |
| `vite` | `8.2.1` | dev dependency |
| `typescript` | `6.0.3` | dev dependency; TypeScript 7 is outside Kit's current peer range |
| `tailwindcss` / `@tailwindcss/vite` | `4.3.3` / `4.3.3` | dev dependencies, kept on the same version |
| `shadcn-svelte` | `1.5.0` | pinned dev-only acquisition CLI |
| `@lucide/svelte` | `1.31.0` | runtime dependency |
| `bits-ui` | `2.18.1` | runtime dependency |
| `svelte-sonner` | `1.1.1` | runtime dependency |
| `tailwind-variants` | `3.3.1` | runtime dependency |
| `clsx` | `2.1.1` | runtime dependency |
| `tailwind-merge` | `3.6.0` | runtime dependency |
| `svelte-check` | `4.7.5` | dev dependency |
| `@playwright/test` | retain locked `1.62.1` initially | dev dependency; issue #12 owns later browser-tool upgrades |

All direct versions are exact in `package.json`; transitive versions are exact in `package-lock.json` v3. The repo keeps
one package manager and one lockfile: npm and `package-lock.json`. `bun.lock`, `pnpm-lock.yaml`, and `yarn.lock` are not
accepted. Local development and every CI/deploy job use `npm ci`, which requires `package.json` and the lockfile to agree
and does not rewrite either
([npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)).

An implementation PR may move a baseline version only when peer ranges require a newer compatible patch and it records
the reason. It may not silently downgrade the architecture to fit an older package. Node, npm, Vite, the Svelte plugin,
Svelte, Kit, TypeScript, and Tailwind are upgraded as one compatibility cohort. Tailwind core and its Vite plugin always
share the exact version.

### Upgrade policy

- Review dependency updates monthly and security advisories immediately. Automated tooling may open a PR but never
  merge or rewrite owned primitives without review.
- Patch/minor changes still run the complete component, dual-build, output, and browser gates. Major changes require an
  explicit migration note and representative primitive diff.
- Commit `package.json`, `package-lock.json`, copied primitive changes, and required migration code together. A lockfile-
  only drift commit fails validation.
- CI audits for multiple lockfiles, unpinned direct dependencies, URL/git dependencies, lifecycle-script additions,
  unexpected licenses, and runtime packages not in the approved set.
- Run `npm audit` as advisory evidence; a finding is triaged by reachability and shipped code, not auto-fixed with a
  forced major upgrade. A reachable high/critical runtime issue blocks release until patched, removed, or explicitly
  risk-accepted by a human.

## shadcn acquisition and update workflow

`components.json` is committed with `typescript: true`, style `new-york`, Tailwind CSS at `src/app.css`, and aliases
`$lib`, `$lib/utils`, `$lib/components`, `$lib/components/ui`, and `$lib/hooks`. The neutral `baseColor` is only a CLI
schema input; generated color values never replace the LAB graph. The file is required only for the CLI and controls
where copied source lands
([components.json](https://shadcn-svelte.com/docs/components-json)).

For the initial acquisition:

1. Start from a clean branch and exact lockfile.
2. Invoke the pinned local CLI, never `npx ...@latest`: `npm exec -- shadcn-svelte add <one-component>`.
3. Add one primitive for the next vertical slice, inspect every created file/dependency, and reject unrelated registry
   additions.
4. Adapt raw colors, radii, motion, icon imports, and public props to this contract without moving product concerns
   into `ui/`.
5. Add the public behavior test, run the Svelte autofixer on each changed Svelte file, and commit source plus lockfile.

For an update, generate the same registry item at the pinned proposed CLI version in an isolated temporary worktree,
diff it against the owned component, review upstream behavior/security changes, and hand-merge. `add --overwrite`,
`add --all`, and bulk neutral-theme application are prohibited. The shadcn migration guide itself warns that overwrite
replaces component files and recommends committing first
([Tailwind v4 migration](https://shadcn-svelte.com/docs/migration/tailwind-v4),
[Svelte 5 migration](https://shadcn-svelte.com/docs/migration/svelte-5)).

Upgrading `bits-ui` may deliver headless fixes, but owned wrapper behavior and variants remain LAB's responsibility.
Record the upstream registry URL/version and the last reviewed date in each primitive's local README or provenance
manifest; do not paste an upstream snapshot with no traceability.

## Runtime network prohibition

The UI must render, theme, hydrate, and remain usable with external network requests blocked. The static-output and
browser validators fail any runtime request for:

- JavaScript, CSS, fonts, icons, images, manifests, workers, or source maps from a third-party origin;
- `unpkg`, jsDelivr, esm.sh, Google Fonts, Tailwind Play CDN, or `lab.sa` presentation assets;
- a provider-specific component or stylesheet selected by hostname;
- an icon, font, or theme dependency whose URL contains `latest`.

Allowed external requests are deliberate user navigation to LAB services, GitHub source, skills.sh, and social
profiles. Conditional analytics remains governed by the SEO contract and is not a design-system dependency. A future
analytics approval cannot authorize CDN UI assets.

## Vertical TDD and validation matrix

Each slice begins with a failing public assertion, implements through `ui → shared → site`, passes in both canonical
and Pages builds, and then refactors. Tests inspect behavior and generated assets, not private class snapshots.

| Slice | Failing public evidence | Required pass |
| --- | --- | --- |
| 1. CSS pipeline | Build with a sentinel utility/token | Exactly one Tailwind import/plugin emits it; no PostCSS/config/legacy CSS path or unresolved class fragment |
| 2. token graph | Render a LAB Button/Card/CodePanel fixture in both themes | Computed standard semantics resolve to the table, pillar and destructive colors remain distinct, focus ring is visible |
| 3. theme bootstrap | First-paint tests for no value, each valid value, invalid value, dark/light OS, and unavailable storage | Correct attributes, `color-scheme`, `theme-color`, no flash, no console error, no hydration mismatch |
| 4. theme lifecycle | Change OS, select each preference, dispatch cross-tab storage, and navigate repeatedly | System-only OS reaction, persistence, cross-tab sync, one listener pair, correct accessible control |
| 5. primitive tracer | Operate Button, Input, Tabs, Sheet, and Collapsible with keyboard and pointer | Native props/ref forwarding, disabled state, focus restoration/trap where applicable, correct ARIA, token variants |
| 6. feedback tracer | Drive CopyButton idle → busy → success/failure → reset through Sonner | Text/live feedback, no duplicate toast, static reduced-motion busy state, no runtime icon request |
| 7. icon bundle | Build representative pages and inspect output/import graph | Only statically imported Lucide icons ship; no wildcard/dynamic loader/inline duplicate/CDN; icon controls are named |
| 8. font/assets | Block external network and load root plus deep routes in both bases | Required WOFF2/brand files return `200`, licenses/provenance exist, no layout overflow, social image is locally deployed |
| 9. motion | Exercise Sheet, Collapsible, copy, smooth scroll, and Recipe rail with normal/reduced preferences | Named tokens only; reduced mode removes non-essential/spatial motion without hiding state or breaking focus |
| 10. dependency boundary | Analyze manifests, locks, imports, and browser requests | Exact approved direct set, one lockfile, no forbidden layer imports, runtime network allowlist clean |
| 11. full route revamp | Run the parity browser matrix at 1280×720, 390×844, and 366px in light/dark/reduced states | Every route uses the same shell/tokens/components, complete SSR HTML remains usable, no horizontal overflow or console errors |
| 12. publication equivalence | Build `canonical` and `pages-project` from one commit/lockfile | Same human component/asset graph after URL normalization; base-aware local assets, no host-specific design branch |

Completion commands include `svelte-check`, the Svelte autofixer for changed components, component tests, existing Node
tests, Playwright parity tests, both static builds, the static asset/network crawl, and `npm run validate`. Issue #12 may
tighten accessibility and performance budgets but may not remove any row above.

## Migration risks and downstream ownership

| Risk | Required handling / owner |
| --- | --- |
| 4,213-line cascade hides accidental dependencies | #11 fixes the baseline; #16 and #18–#21 migrate complete journeys and remove legacy CSS only after named theme/viewport captures pass |
| Maax license does not permit public redistribution or both hosts | Default to the deterministic open/system display stack; #16 records license evidence when available and #24 proves the accepted hierarchy with the fallback—never fetch the font remotely as a workaround |
| shadcn neutral defaults erase LAB identity | #16 installs the token graph before primitives; #18–#21 accept only token-driven local source |
| theme flashes or fails in hardened storage | #16 implements bootstrap truth-table tests; #12 adds browser first-paint/storage-denial evidence |
| Tailwind misses data-driven classes | #18–#21 use closed literal variant maps or `--lab-accent`; static scan rejects interpolation |
| hidden icon/font CDN survives in rich content or metadata | #22/#24 crawl HTML, CSS, manifests, and browser requests in both bases |
| excessive primitive/dependency acquisition | #16 starts with the exact nine; later tickets add one only with a failing public test and update this contract |
| headless/CLI update overwrites owned APIs | Isolated generation plus hand-merge policy; no overwrite command |
| package cohort becomes incompatible | #16 pins the reviewed baseline and lock; #12/CI runs peer/install/type/build gates before merge |
| provider artifact diverges visually | #24 compares normalized output/assets; #25/#26 smoke the same immutable commit on each host |

Downstream boundaries are:

- **#11** accepts the functioning Discovery Site as the product prototype and requires the full SvelteKit revamp to
  reproduce it through this component/token system; it does not invent a second prototype or visual direction.
- **#12** adds accessibility, forced-colors, performance, bundle-size, first-paint, and dependency-security release
  thresholds on top of this mandatory matrix.
- **#13/#27** use the user's selected atomic cutover and rollback artifact; the cutover cannot retain `website/` or a
  remote asset path as a fallback source.
- **#16** owns project scaffolding, pinned dependencies, `components.json`, the CSS/token graph, theme bootstrap, local
  assets, and the initial primitive acquisition.
- **#18–#21** own the route-visible shared/site compositions and any additional primitive request justified by a failing
  vertical test.
- **#22** owns canonical metadata/social URLs while referencing the same local assets.
- **#24** owns dual-base static/network/dependency validation and normalized artifact comparison.
- **#25/#26** select publication profiles only; they cannot select design dependencies or CDN fallbacks.

Reopen this contract only if an accepted user journey cannot be expressed through the layered component system and the
approved common static-host capability set, or if authoritative license/security evidence makes an approved dependency
unshippable. Convenience, generated defaults, or a provider-specific optimization is not sufficient.

## Primary references

- [Tailwind CSS Vite installation](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind color variable references](https://tailwindcss.com/docs/colors#referencing-other-variables)
- [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode)
- [Tailwind reduced-motion variants](https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion)
- [shadcn-svelte principles](https://shadcn-svelte.com/docs)
- [shadcn-svelte SvelteKit installation](https://shadcn-svelte.com/docs/installation/sveltekit)
- [shadcn-svelte theming](https://shadcn-svelte.com/docs/theming)
- [shadcn-svelte dark mode](https://shadcn-svelte.com/docs/dark-mode/svelte)
- [shadcn-svelte `components.json`](https://shadcn-svelte.com/docs/components-json)
- [shadcn-svelte Button source](https://shadcn-svelte.com/docs/components/button)
- [Lucide Svelte](https://lucide.dev/guide/svelte)
- [Lucide accessibility](https://lucide.dev/guide/accessibility)
- [mode-watcher source](https://github.com/svecosystem/mode-watcher)
- [Runed persisted-state behavior](https://runed.dev/docs/utilities/persisted-state)
- [IBM Plex source and OFL](https://github.com/IBM/plex)
- [205TF Maax Unicase](https://www.205.tf/maax-unicase)
- [CSS `font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display)
- [npm clean install](https://docs.npmjs.com/cli/v11/commands/npm-ci/)

## Decision summary

- One CSS entry and Tailwind v4 Vite pipeline expose the recorded LAB palette through shadcn semantics and `@theme
  inline`; raw LAB and category meaning remain explicit.
- One locally owned, storage-safe theme service preserves system/light/dark, no-flash initialization, the existing key,
  OS tracking, cross-tab synchronization, and metadata updates; `mode-watcher` is not accepted at its current behavior.
- Bundled static Lucide imports replace every runtime icon URL, with explicit icon accessibility and bundle rules.
- IBM Plex is self-hosted from its licensed official package; unused GT America is removed; Maax is local only with
  proven redistribution rights and otherwise has a deterministic fallback.
- Nine shadcn primitives and six runtime support packages are the exact initial scope. Source is locally owned and
  updates are isolated, pinned, reviewed, and hand-merged.
- Named motion tokens and `motion-safe` make reduced motion a first-class state; no broad animation package is added.
- Exact direct versions, one npm lockfile, `npm ci`, dual-base builds, runtime-network denial, and vertical public tests
  keep the same design system reproducible on Netlify and GitHub Pages.
