# LAB component-system and shadcn ownership contract

Status: accepted planning contract for issue #5. The human decision on 2026-08-11 selected the layered option:
`components/ui/` → `components/shared/` → `components/site/`, with every feature-specific component inside `site/`.

This contract makes that choice implementation-ready. It refines the component sketch in the
[SvelteKit rebuild plan](sveltekit-rebuild-plan.md) and operates inside the one-source boundary established by
[ADR 0001](adr/0001-single-source-static-discovery-site.md).

## Decision

The Discovery Site has one locally owned component system with a strict inward dependency direction:

```text
SvelteKit routes
      ↓
site screens and feature components
      ↓
shared product-neutral compositions
      ↓
owned shadcn-svelte primitives
      ↓
headless libraries and native web elements
```

There are exactly three component layers:

1. `ui/` owns the shadcn-svelte primitive source copied into the repository.
2. `shared/` owns product-neutral LAB compositions reused across multiple site features.
3. `site/` owns all Discovery Site vocabulary, screens, shell, and feature-specific components.

Feature folders such as `shell/`, `directory/`, `skill/`, `recipe/`, and `rich-content/` are children of `site/`, not
peer component systems. Routes load data and select a screen; they do not become a fourth component layer.

## Target tree

```text
src/lib/components/
  ui/                           locally owned shadcn-svelte source
    button/
    input/
    tabs/
    sheet/
    collapsible/
    breadcrumb/
    separator/
    sonner/
    tooltip/
  shared/                       no Skill, Recipe, route, or catalog vocabulary
    CopyButton.svelte
    CodePanel.svelte
    PageFrame.svelte
    ThemeToggle.svelte
  site/                         every product-aware component lives here
    common/
      InstallCommand.svelte
      PageHead.svelte
    shell/
      SiteShell.svelte
      SiteHeader.svelte
      MobileNav.svelte
      SiteFooter.svelte
    directory/
      DiscoveryPage.svelte
      DirectoryWorkbench.svelte
      CatalogRow.svelte
      DirectoryEmptyState.svelte
    skill/
      SkillPage.svelte
      SkillHero.svelte
      PackageDirectory.svelte
      RelatedSkills.svelte
    recipe/
      RecipeIndexPage.svelte
      RecipePage.svelte
      RecipeNav.svelte
      RecipePhase.svelte
      RecipeStep.svelte
      HandoffNotice.svelte
    rich-content/
      RichDocument.svelte
      RichBlock.svelte
      RichInline.svelte
    not-found/
      NotFoundPage.svelte
```

This is an ownership map, not a requirement to create empty files. A component enters the tree only when a vertical
slice needs it. The `src/lib/components/site/` name is unrelated to the generated artifact directory at repository-root
`site/`.

## Layer contracts

### `ui/`: owned primitives

`ui/` components provide low-level interaction, accessibility, and visual variants. They may import:

- their underlying headless package, such as Bits UI;
- other `ui/` primitives;
- shared class/variant utilities;
- types from `svelte` and `svelte/elements`;
- semantic theme variables owned by the global design-token layer.

They must not import Source Content, domain/view-model types, `$app/*`, routes, `shared/`, `site/`, analytics, business
copy, or product actions. A primitive cannot know what a Skill, Recipe, catalog, install command, or LAB pillar is.

The shadcn-svelte project describes itself as open component code and a distribution system rather than a sealed
component library. The copied files therefore become repository-owned source; `components.json` points its `ui` alias
at `$lib/components/ui`.
([shadcn-svelte principles](https://www.shadcn-svelte.com/docs),
[SvelteKit installation](https://www.shadcn-svelte.com/docs/installation/sveltekit),
[`components.json`](https://www.shadcn-svelte.com/docs/components-json))

Primitive public APIs follow these rules:

- Type wrapper props with the appropriate `svelte/elements` attribute interface and forward valid native attributes,
  handlers, references, classes, and ARIA attributes.
- Expose visual/semantic variants as closed typed unions, never dynamically assembled Tailwind fragments.
- Preserve the headless primitive's keyboard, focus, disabled, and ARIA behavior.
- Use `children: Snippet` and named typed snippets for composition rather than legacy slots.
- Keep styles token-driven; a primitive may express LAB defaults but never feature-specific layout.
- Re-export a multi-file primitive from its local `index.ts`; do not create one global barrel for all primitives.

Native semantic HTML remains valid inside LAB components when shadcn-svelte has no corresponding behavior to own.
This contract does not require wrapping every `<p>`, `<section>`, `<article>`, or `<a>` merely to claim component use.
It requires all repeated controls and interactive patterns to share the owned primitive foundation.

### `shared/`: product-neutral compositions

`shared/` combines `ui/` primitives and native elements into reusable behaviors that make sense without Discovery Site
domain vocabulary. It may know LAB design semantics, but it cannot know routes, Skill/Recipe models, catalog categories,
repository files, or canonical URLs.

Examples:

- `CopyButton` owns clipboard attempt/fallback, busy/success/reset state, accessible labeling, and feedback callback.
- `CodePanel` owns the code surface, toolbar anatomy, wrapping, optional label snippet, and copy affordance.
- `PageFrame` owns the responsive width and gutter contract.
- `ThemeToggle` owns the System/Light/Dark control while delegating theme persistence to the accepted theme service.

Shared components accept values and callback props. They never fetch, navigate, read files, derive domain relationships,
or mutate an object received through props.

### `site/`: product components and screens

`site/` is the only component layer that may import typed domain/view models, base-aware route builders, product copy,
and feature actions. It may import `shared/` and `ui/`; it cannot import `$lib/server`, access the filesystem, or parse
Source Content.

Feature ownership is explicit:

| Folder | Owns | Must not own |
| --- | --- | --- |
| `site/shell/` | Global header, service navigation, mobile sheet, footer, skip target, shell composition | Route data loading or feature-specific state |
| `site/directory/` | Skills/Recipes tabs, query/category filters, counts, rows, empty state | Separate Skill and Recipe filtering implementations |
| `site/skill/` | Skill reading hierarchy, installation, package directory, related Skills | Markdown parsing or filesystem reads |
| `site/recipe/` | Recipe index/reading hierarchy, contents tracking, phases, steps, handoffs | A hand-authored copy of Recipe Source Content |
| `site/rich-content/` | Exhaustive rendering of the closed `RichDocument` model | Raw HTML strings or `{@html}` |
| `site/common/` | Product-aware components shared by two or more features | Generic primitives that belong in `shared/` or `ui/` |
| `site/not-found/` | Useful noindex error screen composed from the common shell | Route matching or SPA fallback behavior |

Screen components (`DiscoveryPage`, `SkillPage`, `RecipeIndexPage`, `RecipePage`, `NotFoundPage`) form the public UI
entry points. Legacy `.html` aliases render the same screen component and view model as their clean route; aliases do
not receive their own component tree.

## Route ceiling

Routes are adapters between SvelteKit and the component system:

- `+page.server.ts` and `+layout.server.ts` load typed view models from server-only modules.
- `+page.ts` or `+layout.ts` owns route configuration such as prerender entries and trailing slashes.
- `+page.svelte` types `data` and renders one `site/` screen component.
- `+layout.svelte` renders the shared `SiteShell` and its typed `children` snippet.
- Route files may contain `<svelte:head>` only through the shared page-metadata contract, not repeated metadata markup.

A route component must not contain product CSS, browser effects, copied section markup, filtering logic, icon selection,
or a second implementation of component state. If a route needs more than data adaptation and screen selection, that
responsibility moves into its owning `site/` component or a pure view-model builder.

## Svelte 5 composition API

All new components use runes-mode Svelte 5 and TypeScript.

### Props and ownership

- Declare an explicit `Props` interface and destructure it with `$props()`.
- Treat incoming data as immutable. A child reports intent through typed callback props instead of mutating parent
  objects; use `$bindable` only for a true two-way form-control contract.
- Derive display state with `$derived`; do not mirror props into `$state` through `$effect`.
- Name callbacks for the user intent (`onCopy`, `onQueryChange`, `onCategorySelect`, `onClear`) rather than exposing DOM
  implementation events.
- Prefer a discriminated union such as `kind: 'skill' | 'recipe'` over related boolean flags.
- If three or more booleans alter structure or interaction, split the responsibility or replace them with one typed
  mode/variant union.

Svelte explicitly warns against mutating props and recommends callback props for communication.
([`$props`](https://svelte.dev/docs/svelte/%24props),
[Svelte best practices](https://svelte.dev/docs/svelte/best-practices))

### Snippets

Use a data prop when a component owns how information is rendered. Use a typed `Snippet` prop when the parent owns a
bounded region of markup, such as `leading`, `actions`, `meta`, or `children`. Named snippets must describe semantic
regions; an open-ended collection of slot-like escape hatches is rejected.

Snippet parameters are typed tuples and are rendered with `{@render ...}`. Legacy `<slot>`, `$$slots`, and
`<svelte:fragment>` do not enter new source.
([Svelte snippets](https://svelte.dev/docs/svelte/snippet),
[`{@render}`](https://svelte.dev/docs/svelte/%40render))

### State and context

State lives at the narrowest owner that can enforce its invariant:

- loader data and canonical identity live above components in the route/view-model boundary;
- transient control state lives in the owning component;
- multi-part component state lives in the component root and is shared with its children through the headless primitive
  or a typed, component-scoped context;
- cross-page preferences such as theme live in one shell-mounted service, never in every route;
- URL state belongs to routing only when it is intentionally shareable/bookmarkable.

Context is not a shortcut for ordinary props. If a deep component family genuinely needs it, use Svelte's typed
`createContext` API and ensure issue #6 selects a compatible Svelte version. Module-global mutable state is forbidden in
SSR/prerendered component code.
([Svelte context](https://svelte.dev/docs/svelte/context),
[SvelteKit state guidance](https://svelte.dev/docs/kit/state-management))

## Reuse and extraction thresholds

The system distinguishes reuse from responsibility. A component does not need two copies before it can own a coherent
interactive or semantic responsibility.

| Situation | Required action |
| --- | --- |
| A keyboard, focus, disclosure, copy, toast, theme, or other accessibility-sensitive behavior appears once | Give it an owning component immediately and build on an existing `ui/` primitive where available |
| The same product-neutral composition appears in two independent site features | Promote it to `shared/` |
| The same product-aware composition appears in two feature folders | Promote it to `site/common/` with a typed domain contract |
| A major page region has its own semantics, responsive rules, interaction, or test cases | Extract it inside its `site/<feature>/` folder on first use |
| Two surfaces merely look similar but have different semantics or behavior | Keep them separate; share tokens/primitives rather than inventing a generic component |
| A component accumulates unrelated state machines or requires boolean combinations to select layouts | Split by responsibility or introduce an explicit mode-specific composition |
| A one-line/native markup fragment has no independent behavior or semantic responsibility | Keep it inside its owning component; do not atomize markup for its own sake |

Extraction never moves domain knowledge down into `shared/` or `ui/`. Reuse flows upward by composition, not downward by
adding product flags to primitives.

## shadcn-svelte acquisition and update policy

The CLI is a source-acquisition tool, not a runtime dependency or an architectural layer.

1. Add a primitive only when the next vertical slice requires its behavior; do not bulk-install the catalog.
2. Configure the CLI alias to `$lib/components/ui` and the project CSS path to the single global stylesheet.
3. Inspect every generated file and dependency before accepting it.
4. Map styling onto LAB semantic tokens without placing product copy, routes, or feature layout in the primitive.
5. Add behavior tests for LAB changes and forwarding contracts; do not duplicate the headless library's entire suite.
6. Commit the copied source and lockfile changes together.

Updates happen in an isolated diff. Never blindly overwrite a locally modified primitive with `add --overwrite` or
accept a generated neutral theme wholesale. Compare upstream output, retain intentional LAB changes, run component and
route tests, and record any breaking public-prop migration. Headless behavior fixes normally arrive through their
package dependency; the repository still owns its top-layer primitive code.

Issue #6 owns the exact primitive inventory, tokens, theme package, Lucide conventions, utility packages, versions, and
update cadence. It must preserve the ownership and dependency direction in this contract.

## Icons and styling boundary

- Interface icons come from bundled `@lucide/svelte`; runtime icon URLs and copied inline SVG variants are forbidden.
- The owning component imports the icon it uses. Icons are decorative by default (`aria-hidden`); an icon-only control
  exposes a visible or programmatic accessible name through its component API.
- `ui/` owns primitive variants; `shared/` owns composition layout; `site/` owns feature layout.
- Tailwind utilities use complete statically discoverable class names and semantic tokens.
- Component-scoped CSS is reserved for behavior or presentation that utilities cannot express clearly, such as
  editorial prose, sticky rails, pseudo-elements, and named motion.
- Routes contain no component styling and there is no second global component stylesheet.

The exact token mapping and motion/theme dependency decisions remain delegated to issue #6.

## Public validation contract

Tests prove user-visible component behavior through rendered components and routes. They do not snapshot private class
lists or re-test Bits UI internals.

### Vertical TDD sequence

1. **Primitive tracer:** render one owned `Button` through a LAB composition; prove native attributes, accessible name,
   keyboard activation, disabled behavior, and variant styling contract.
2. **Shared interaction:** drive `CopyButton` through idle → busy → success/failure → reset using its public callbacks
   and live feedback; then reuse it inside `CodePanel` and `InstallCommand`.
3. **Shell slice:** render `SiteShell` with a `children` snippet; prove skip navigation, desktop/mobile navigation,
   theme control, landmarks, and focus order at mobile and desktop widths.
4. **Directory slice:** prerender complete rows, then drive tabs, query, categories, counts, empty state, clearing, and
   `/` focus through `DiscoveryPage`, not private component state.
5. **Skill slice:** load one public Skill route and prove breadcrumb, install/copy behavior, rich content, package files,
   related items, and overflow collapsibles through the route.
6. **Recipe slice:** load one Recipe route and prove navigation, phase/step rendering, copy controls, handoffs, hash
   synchronization, and current-location semantics through the route.
7. **Alias/404 slice:** prove aliases render their canonical screen components and the intentional 404 uses the same
   shell without inheriting canonical-page metadata.

Component tests may isolate a complex state machine, but Playwright route tests remain the acceptance authority. Visual
screenshots cover only named responsive/theme states and supplement—never replace—semantic assertions.

### Architecture enforcement

Because folder dependency direction is an accepted architecture contract, CI also performs a narrow static import
check:

- `ui/` cannot import `shared/`, `site/`, domain, server, routes, or `$app/*`;
- `shared/` cannot import `site/`, domain, server, routes, or `$app/*`;
- `site/` cannot import server modules or route files;
- route `.svelte` files may import screen components but cannot import `ui/` directly;
- browser bundles contain no server modules, runtime icon CDN, or parallel legacy component scripts.

This boundary check is governance evidence, not a substitute for public behavior tests. `svelte-check`, the Svelte
autofixer, repository validation, component tests, both static builds, and the browser suite all remain required.
([Svelte testing](https://svelte.dev/docs/svelte/testing),
[Svelte TypeScript](https://svelte.dev/docs/svelte/typescript))

## Migration rules

- Build the first end-to-end component path on a migration branch while the deployed/base legacy artifact remains the
  comparison oracle; do not make `website/` a second accepted source.
- The commit that introduces `src/` atomically retires `website/` as required by ADR 0001.
- Port by vertical user journey, not by creating every primitive and then every feature component horizontally.
- A legacy script is removed when its behavior is owned and proven by the corresponding component slice.
- A legacy CSS region is removed when its named light/dark/responsive states pass against the parity evidence.
- No route may land with page-specific interaction code as a temporary exception.

The user selected a full end-to-end revamp and accepted the functioning Discovery Site as the representative product
prototype. No second throwaway UI is required: implementation must exercise this architecture across the complete
route set while reproducing the accepted experience. See the
[existing-prototype acceptance](existing-prototype-acceptance.md).

## Downstream ownership

- **#6** selects exact LAB token mappings, theme initialization, Lucide usage, fonts, motion, utilities, primitive list,
  and dependency/update versions within this component boundary.
- **#11** accepts the existing functioning site as the product prototype and defines full end-to-end SvelteKit
  replacement—not a parallel prototype or a new visual direction.
- **#12** turns semantic, keyboard, screen-reader, theme, motion, responsive, hydration, and performance expectations
  into release gates.
- **#13** records the already selected atomic cutover, rollback artifact, and evidence/approval boundary.
- **#16–#24** implement the shell, shared model, human routes, SEO/LLM surfaces, and parity proof by the vertical sequence
  above.

Reopen this decision only if an accepted requirement cannot be expressed without reversing the dependency direction,
introducing a second component source, or making route-specific behavior the permanent owner of an interaction.

## Primary references

- [shadcn-svelte principles](https://www.shadcn-svelte.com/docs)
- [shadcn-svelte SvelteKit installation](https://www.shadcn-svelte.com/docs/installation/sveltekit)
- [shadcn-svelte `components.json`](https://www.shadcn-svelte.com/docs/components-json)
- [Svelte `$props`](https://svelte.dev/docs/svelte/%24props)
- [Svelte snippets](https://svelte.dev/docs/svelte/snippet)
- [Svelte `{@render}`](https://svelte.dev/docs/svelte/%40render)
- [Svelte context](https://svelte.dev/docs/svelte/context)
- [Svelte best practices](https://svelte.dev/docs/svelte/best-practices)
- [Svelte testing](https://svelte.dev/docs/svelte/testing)
- [Svelte TypeScript](https://svelte.dev/docs/svelte/typescript)
