# Design QA

## Visual truth

The refinement review used the supplied screenshots as the source of truth. Browser-rendered implementation captures live under the untracked `.artifacts/design-qa/` directory; the original six use a 1440 × 900 CSS viewport, while the header refinement reproduces its 526px reference width exactly.

| Reference | Pixels | Requested correction | Same-canvas evidence |
| --- | ---: | --- | --- |
| Screenshot 1 | 1824 × 346 | Replace the clipped handoff container with a compact Markdown-style blockquote. | `comparison-1-handoff.png` |
| Screenshot 2 | 2256 × 1632 | Replace the oversized two-column requirement cards with a compact table. | `comparison-2-requirements.png` |
| Screenshot 3 | 708 × 534 | Remove the redundant Outcome panel and integrate useful metadata into the Recipe hero. | `comparison-3-recipe-details.png` |
| Screenshot 4 | 2446 × 576 | Complete the directory perimeter and corner treatment. | `comparison-4-directory.png` |
| Screenshot 5 | 2382 × 1034 | Establish the home hero as one reusable LAB composition. | `comparison-5-home-hero.png` |
| Screenshot 6 | 2390 × 698 | Bring the Recipe index hero onto the same composition, rhythm, and type scale. | `comparison-6-recipes-hero.png` |
| Screenshot 7 | 526 × 194 | Move the mobile trigger to the far edge, use shadcn-svelte Sidebar, and match LAB's production logo and typography. | `header-refinement/comparison-header.png` |
| Screenshot 8 | 2216 × 1054 | Remove the redundant Reference column and make Skill and Source the reference affordances. | `requirements-responsive/comparison-desktop.png` |
| Screenshot 9 | 1112 × 1352 | Replace the clipped narrow table with the earlier compact card structure. | `requirements-responsive/comparison-responsive.png` |
| Screenshot 10 | 356 × 270 | Replace the false TypeScript label on a prose prompt with its truthful Text language. | `code-languages/comparison-code-label.png` |
| Screenshot 11 | 2356 × 1400 | Move the Recipe Contents rail from the left to the other side of the reading canvas. | `recipe-contents-right/comparison-right-rail.png` |
| Screenshot 12 | 2364 × 1392 | Replace the oversized, vague Recipe hero with direct copy and LAB-style inline actions. | `hero-copy-cta/comparison-supplied-before-after.png` |
| Screenshot 13 | 2048 × 1365 | Add directional Skills/Recipes navigation, footer spacing, hover-revealed pillar rows, an indigo/category page atmosphere, and pointer affordances. | `tmp/design-qa/home-atmosphere.png`, `tmp/design-qa/catalog-row-hover.png`, and `tmp/design-qa/skill-design-atmosphere.png` |
| Screenshots 14–17 | 1500 × 696, 1500 × 512, 1456 × 746, and 1500 × 556 | Replace four visibly different hero compositions with one shared layout and responsive type contract. | `tmp/design-qa/unified-heroes/comparison.png` |

Each comparison places the supplied reference above the implementation, separated by a LAB research-blue rule. Focused implementation crops were used for the handoff, requirements, Recipe metadata, directory, and header comparisons; the hero comparisons use complete viewport captures.

For Screenshot 11, the source visual truth is `/var/folders/sl/87qshknd4gz8bg33zgm4g_300000gn/T/TemporaryItems/NSIRD_screencaptureui_tclfKf/Screenshot 2026-08-12 at 11.47.31 AM.png`; the browser-rendered implementation is `.artifacts/design-qa/recipe-contents-right/implementation-desktop-1178x700.png`. The 2356 × 1400 Retina source was normalized to its 1178 × 700 CSS canvas and compared with a 1178 × 700 implementation capture at 1× density. The complete visible reading canvas is the important comparison region, so no smaller focused crop was needed.

For Screenshot 12, the supplied 2364 × 1392 Retina capture was normalized to its 1182 × 696 CSS canvas and compared with `.artifacts/design-qa/hero-copy-cta/implementation-recipes-1182x696.png` at 1× density. The live [lab.sa](https://lab.sa/) hero was also captured at a 1280 × 720 CSS viewport and placed with the same-size implementation in `hero-copy-cta/comparison-lab-pattern.png`. The full hero contains readable typography and actions at this size, so no additional focused crop was required.

## States and interactions checked

- Desktop light home, Skills directory, Recipe index, Recipe detail hero, compact requirements table, and in-document handoff at 1440 × 900.
- Recipe detail at 390px: the shared hero stacks, the requirements table scrolls within its own frame, and the page itself has no horizontal overflow (`scrollWidth` and `clientWidth` both 390px).
- Home and Recipe index now expose one `data-lab-hero` composition with the same accent rail, eyebrow, display-title scale, description rhythm, and optional right-side action slot.
- Recipe detail no longer repeats the generic Outcome label; its bounded details panel keeps phase, Skill, author, and source information together.
- Every handoff is a semantic `blockquote` with one complete accent rail and no decorative half-border.
- Recipe requirements render as one semantic table with eight rows, row-level copy actions, an explicit built-in state, and a locally scrollable command region.
- Skills and Recipe directories use complete rounded borders with clipped children, so search, filters, and entries read as one bounded workbench.
- Light/dark appearance, global Skills/Recipes navigation, search, filters, mobile navigation, copy actions, and deep Recipe contents remain wired to the existing interaction model.
- The mobile header was measured at 526px: the flask begins at 32px, the 44px trigger ends 32px from the far edge, and the document has zero horizontal overflow.
- Mobile navigation renders through shadcn-svelte `Sidebar.Provider`, `Sidebar.Root`, header/content/group/menu/footer primitives, and its mobile Sheet boundary. Opening gives focus to Close navigation; closing restores focus to Open navigation.
- At 1280px the mobile Sidebar is removed from layout, the desktop navigation is visible, and the document remains exactly 1280px wide.
- Display text resolves to the locally bundled Maax Unicase family; body text resolves to the locally bundled IBM Plex Sans Arabic family. The header uses LAB's standalone production flask mark rather than the previous duplicate LAB lockup.
- At 2216 × 1054, Recipe requirements render as a four-column table with no Reference column. Both Skill and Source point to the same reference URL, open a new tab with `noopener noreferrer`, and expose a 2px primary underline plus color shift on hover/focus.
- At 1112 × 1352 the table swaps to compact two-column cards; at 390 × 844 it becomes one column. Long commands scroll inside their own focusable region while the page reports zero horizontal overflow at both widths.
- Browser diagnostics contained only Vite connection messages and no warnings or errors.
- All six multiline Recipe prompt panels now render the `TEXT` label; the Recipe contains no false Swift, VB.NET, Perl, C#, or TypeScript labels. The page remains overflow-free at 390px and browser diagnostics contain no warnings or errors.
- At the 1178 × 700 normalized desktop viewport, the Recipe reading column occupies the left grid track and the 240px sticky Contents rail occupies the right grid track with a 64px gutter. At 390 × 844, Contents remains before the article in the single-column flow; both regions measure 358px and the page has zero horizontal overflow.
- Selecting Planning from the moved rail updates the hash, current-location state, and keyboard focus. A fresh browser pass contained no warnings or errors.
- The Skills and Recipe collection heroes now share literal H1 copy, one short search-intent description, and an inline two-action zone. Visible descriptions exactly match their meta, Open Graph, Twitter, and structured-data projections through one typed copy source.
- Desktop actions are adjacent and 48px high. At 390 × 844 they stack at 334px wide inside the accent rail, remain 48px high, and create no horizontal overflow. The primary Recipe action reaches `#recipe-catalog`; fresh browser diagnostics contain no warnings or errors.
- The permanent hero rail is gone. Home and Recipe surfaces now fade from LAB indigo into the canvas from the top of the shell; Skill details inherit the owning pillar color, verified on the Design Skill page.
- Skills → Recipes uses a forward direction-aware View Transition and Recipes → Skills uses its inverse; the shared header and footer remain outside the named transition, and reduced-motion users receive an immediate route change.
- Directory and related rows rest without a category rail. Pointer hover and keyboard focus reveal the full-height pillar rail and a 10% same-pillar surface tint together; global links, enabled buttons, selects, labels, and summary controls expose a pointer cursor.
- The shared main landmark contributes 64px mobile and 96px desktop padding before the footer, including routes whose final section has no route-owned bottom margin.
- All four hero families now render the same ordered anatomy: optional breadcrumb prelude, eyebrow, a `14ch` display-title measure, then a support grid containing description/actions and an optional supplemental panel. The title resolves to the same 80px/76px desktop metrics and 48px/45.6px mobile metrics on every route, while content length alone determines wrapping and height.
- The supplemental column is optional without creating an alternate hero: home uses it for installation, Skill detail for installation/source, Recipe detail for metadata/source, and Recipe index simply retains the same primary support column. All four routes remain overflow-free at 390px.

## Fidelity findings

| Severity | Difference found | Correction | Post-fix evidence |
| --- | --- | --- | --- |
| P1 | Handoff containers looked clipped because their borders terminated at the viewport crop. | Replaced the box treatment with a semantic, Markdown-style blockquote and one deliberate accent rail. | `comparison-1-handoff.png` |
| P1 | Eight Recipe requirements consumed several screens as large cards. | Consolidated the same data and actions into a compact, accessible table. | `comparison-2-requirements.png` |
| P1 | The standalone Outcome block repeated the page title and weak metadata. | Removed it and added a compact, fully bordered Recipe details panel inside the shared hero. | `comparison-3-recipe-details.png` |
| P1 | Directory surfaces mixed open edges and rounded children. | Moved the radius, border, background, and clipping to the owning workbench containers. | `comparison-4-directory.png` |
| P1 | Home, Skill, Recipe index, and Recipe detail heroes used unrelated layout rules. | Added one composable `LabHero` with typed prelude and aside slots; all four page families now share its structure. | `comparison-5-home-hero.png` and `comparison-6-recipes-hero.png` |
| P2 | Earlier controls and content surfaces still carried generic or oversized patterns. | Retained the compact Package Content table, direct light/dark toggle, LAB footer, and route-owned Skills/Recipes navigation from the preceding refinement pass. | Browser review across home, Skill, and Recipe routes. |
| P1 | The mobile trigger sat immediately beside an oversized flask-and-LAB lockup, and navigation was composed directly from Sheet. | Adopted LAB's 96px production header rhythm, standalone flask mark, exact local display/body fonts, a far-edge trigger, and the shadcn-svelte Sidebar composition. | `header-refinement/comparison-header.png` and `implementation-sidebar-open.png` |
| P1 | A collapsed desktop rendering of the mobile-only Sidebar initially extended the scrollable document beyond the viewport. | Hid that instance at the desktop navigation breakpoint while retaining Sidebar's mobile Sheet behavior below it. | Browser measurements at 526px and 1280px both report zero overflow. |
| P1 | The separate Reference column duplicated information while Skill and Source looked inert. | Removed the column and made both labels direct external links with hover, focus, new-tab, and safe-rel behavior. | `requirements-responsive/implementation-table-hover-2216x1054.png` |
| P1 | The fixed-width table clipped its command column at the 1112px reference width. | Restored a responsive card composition below 1280px, using two columns at medium widths and one at phone widths. | `requirements-responsive/comparison-responsive.png` and `implementation-cards-390.png` |
| P1 | Prose prompts were fenced as unrelated programming languages, producing labels such as TypeScript. | Corrected every Recipe prompt fence to `text` and added a rendered-language marker plus regression assertion limiting Recipe panels to Text or Shell. | `code-languages/comparison-code-label.png` |
| P1 | The Recipe Contents rail occupied the left side while the requested reading composition called for it on the opposite side. | Reversed the wide-screen grid tracks without visual-order CSS: Contents remains first in the document at narrow widths and explicitly occupies the right track from the desktop breakpoint. | `recipe-contents-right/comparison-right-rail.png` |
| P1 | The Recipe collection headline wrapped into six oversized lines, its value was abstract, and its CTAs were detached at the lower right. | Reduced the shared display scale and widened its readable measure; replaced the copy with a literal agent-workflow intent; added a shared post-description action slot modeled on lab.sa's desktop/mobile hierarchy. | `hero-copy-cta/comparison-supplied-before-after.png` and `comparison-lab-pattern.png` |
| P1 | The permanent hero rail used research cyan on the default page, page backgrounds were flat, directory rails appeared before interaction, and the final section could touch the footer. | Removed the hero rail, added one page-level indigo/category gradient, synchronized the row rail and tint to hover/focus, and moved footer spacing into the shared shell. | `tmp/design-qa/home-atmosphere.png`, `tmp/design-qa/catalog-row-hover.png`, and `tmp/design-qa/skill-design-atmosphere.png` |
| P2 | Skills and Recipes snapped between route states and several custom clickable surfaces relied on the browser's contextual cursor. | Added a reduced-motion-safe, direction-aware View Transition and one global clickable-cursor contract. | Browser interaction regression plus computed-style assertions in `test/e2e/foundation.spec.mjs`. |
| P1 | Index heroes and detail heroes placed title, description, actions, and supplemental content using different internal grids and title measures. | Rebuilt the shared `LabHero` around one invariant DOM order and responsive contract, leaving only its typed content slots optional. | `tmp/design-qa/unified-heroes/comparison.png` and the four-route desktop/mobile contract regression in `test/e2e/foundation.spec.mjs`. |

## Verification

- `npm run typecheck`: zero errors and zero warnings.
- `npm test`: 79/79 passing.
- `bash scripts/validate-skills.sh`: passed.
- `npm run catalog -- --check`: catalog current.
- `node scripts/validate-source-boundary.mjs`: passed.
- `node scripts/validate-dependencies.mjs`: passed.
- `npm run test:static`: canonical, preview, Pages-project, and Pages-root publications valid and structurally equivalent.
- `git diff --check`: passed.
- Svelte 5 autofixer reviewed the changed Svelte components; dynamic external URL notices were inspected rather than rewritten as internal routes.
- The current interaction pass also passed the four-profile publication matrix and the focused page-transition, row-hover, cursor, and footer-gap Playwright regressions.

## Final findings

- P0: none.
- P1: none.
- P2: none.
- P3: none that block fidelity, navigation, accessibility, or publication portability.

final result: passed
