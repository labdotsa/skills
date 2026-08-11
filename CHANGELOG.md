# Changelog

Notable repository and skill changes are documented here.

## Unreleased

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
