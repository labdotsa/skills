# Changelog

Notable repository and skill changes are documented here.

## Unreleased

- Shipped complete prerendered Skill reading pages with typed installation, source, rich-instruction, package, and related-content components; progressive overflow disclosures; resilient clipboard feedback; axe and visual regression coverage; and browser-verified canonical/Pages-project parity.
- Shipped the prerendered SvelteKit discovery directory with one shared Skill/Recipe workbench, local query/category filtering, progressive no-JavaScript navigation, accessible keyboard controls, base-aware detail links, and responsive LAB rows.
- Replaced the ad hoc catalog parser with one exact-byte, strict YAML/Zod, GFM-to-typed-rich-content Catalog snapshot shared by SvelteKit loaders and deterministic v2/publication projections.
- Established the source-exclusive SvelteKit 5 application foundation with Tailwind CSS v4, locally owned shadcn-svelte primitives, concrete Lucide icons, reusable `ui → shared → site` components, a storage-safe theme controller, local LAB assets, a real prerendered 404, and canonical/GitHub Pages publication profiles from one route graph.
- Published and audited the dependency-aware SvelteKit implementation graph as native GitHub sub-issues, and reconciled stale downstream ticket ownership in the hosting and design-system contracts.
- Defined the WCAG 2.2 AA, keyboard and screen-reader, reduced-motion, theme, responsive/reflow, no-JavaScript, component-behavior, asset, transfer-budget, Core Web Vitals, cross-browser, visual-regression, and exception gates for the SvelteKit cutover.
- Accepted an atomic SvelteKit cutover: isolate migration work behind a one-source boundary, squash the complete replacement into one reviewed commit, move generated `site/` to CI/provider artifacts, and preserve a checksummed tagged legacy rollback release.
- Accepted the existing functioning Discovery Site as the representative prototype for a complete SvelteKit revamp, eliminating a separate throwaway UI while preserving the approved product experience and parity evidence.
- Accepted the three-layer LAB component system: locally owned shadcn-svelte primitives, product-neutral shared compositions, product-aware feature components under `site/`, thin routes, typed Svelte 5 APIs, and explicit reuse and update rules.
- Defined the portable static-hosting contract: one SvelteKit route graph, validated publication profiles, complete prerendering, base-aware URLs, exact legacy aliases, and a real static 404 for Netlify and GitHub Pages.
- Defined the single-read shared content pipeline, typed Skill/Recipe model, component-rendered rich-content boundary, deterministic publication graph, and vertical implementation gates.
- Defined canonical LLM discovery, Markdown, catalog identity, license, crawler-access, and validation contracts without introducing a second content source or treating `llms.txt` as a standard.
- Defined the Discovery Site technical SEO and measurement contract, including crawl and canonical invariants, page-intent metadata, structured data, internal linking, Core Web Vitals, analytics, and regression gates.
- Accepted the single-source SvelteKit boundary and canonical URL policy: Netlify owns `skills.lab.sa`, GitHub Pages remains a non-indexable backup, and clean Recipe routes retain generated `.html` aliases.
- Added a reproducible Discovery Site parity harness covering public output contracts, browser interactions, desktop and mobile captures, and CI artifacts.
- Rebuilt the discovery site to match LAB's current product-innovation brand system across catalog, recipe, and skill-detail pages.
- Consolidated homepage discovery into a toggleable Skills/Recipes directory, restored the original command-led hero in LAB styling, and simplified skill pages around installation, source content, and related items.
- Refined detail pages with pillar gradients, vertical installation heroes, animated copy feedback, copyable Markdown blocks, collapsible instructions and package contents, device-aware light/dark theming, and side-entering directory hover states.
- Unified home, skill, and recipe pages on a full-width LAB frame; simplified the recipe into a vertical blockquote-led reading flow with non-repetitive navigation, stacked prompts, and copyable skill-install references.
- Standardized recipe steps on one LAB accent and one reusable code surface, with icon-only copy controls, readable step indices, and right-side page navigation.
- Replaced recipe skill-reference panels with the same compact LAB-striped install command used on skill detail pages, keeping source links separate and copy controls centered inside the command.
- Stabilized recipe phase and step layouts on one numbered editorial grid, with aligned headings and bodies, top-aligned indices, safer wrapping, and a compact narrow-screen rail.
- Unified command, prompt, and Markdown code panels on one background token, with darker light-mode borders and brighter dark-mode borders across panels and copy controls.
- Added an accessible recipe scrollspy so the contents aside highlights the section currently owning the reading viewport and stays synchronized with hash navigation.
- Matched every recipe phase index (`01`–`04`) to the step-index treatment, including the shared research accent, weight, line height, and responsive size.
- Refined recipe reading mechanics with centered icon-only copy controls, sticky step-number rails, full-bleed active navigation, theme-aware code borders and headers, and one consistent content-column inset for handoffs and closing sections.
- Presented every recipe phase handoff as the same padded, rounded notice surface used for step guidance.
- Moved recipe skill-source links onto the installation metadata row, right-aligned above the full-width command with a compact narrow-screen label.
- Standardized every copy glyph on one 18 px box across single-line commands, multi-line code headers, and their loading and success states.
- Moved the AFK/HITL classification notice from the opening conversation rule to Planning step 3.1, where tickets are first classified for implementation.
- Placed package contents before related recommendations on skill pages, sized hero installation commands to their content with responsive width limits, and unified copy-control footprints across command and code headers.
- Fixed folded YAML frontmatter parsing so recipe descriptions render as their full text in discovery cards.
- Establish the initial public repository structure.
- Publish the initial skill collection: `build-product-artifacts`, `copywriting`, `deconstruct`, `information-architecture`, `seo-engine`, and `tailwind`.
- Add a searchable, filterable GitHub Pages discovery site generated from stable skill metadata.
- Redesign the discovery site as a dense, categorized skill index with install commands, deep links, and responsive detail views.
- Rebuild the catalog and discovery data automatically before every GitHub Pages deployment.
- Refine the discovery experience into a more compact, file-oriented index with the catalog visible above the fold.
- Embed generated skill data directly in `site/index.html` and commit refreshed catalog artifacts after pushes to `main`.
- Consolidate the three Tailwind entries into one `tailwind` skill with v4, responsive-layout, and localizable-layout references.
- Rebuild the discovery site as a LABs working library with a searchable catalog, persistent protocol sheet, package maps, keyboard navigation, and mobile detail views.
- Separate editable website source from generated Pages output, version the catalog data contract, add direct package-file links, and test the catalog model and generated site.
- Redirect direct filesystem previews of the editable website template to the generated catalog.
- Replace the compact split-pane catalog with spacious linked rows and generate a dedicated, source-connected detail page for every public skill.
- Add the first LABs Recipe: the four-conversation Foundation, Visuals, Planning, and Implementation path from idea to functioning prototype, with durable handoffs, mixed-source skills, copyable prompts, and a final delivery gate.
- Apply the LABs offset shadow consistently across top-level cards and render each skill's Markdown instructions directly on its detail page.
- Add a searchable Recipes index, generated directly from `recipes/*/RECIPE.md`, with full-row links to individual delivery playbooks.
- Add a persistent System, Light, and Dark appearance control across every discovery and detail page.
- Reimagine the discovery site in LAB's monochrome product language with a flask identity, editorial typography, reagent-lime interaction states, softer panels, and a responsive recipe timeline.
