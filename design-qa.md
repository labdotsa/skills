# Design QA

## Visual truth

- User references include the preceding full-width recipe review set plus `Screenshot 2026-08-11 at 1.19.52 PM.png` through `Screenshot 2026-08-11 at 1.23.58 PM.png`, and the handoff/notice comparison at `1.26.25 PM` and `1.26.48 PM`.
- Browser-rendered implementation captures include the prior recipe QA set plus `lab-recipe-sticky-rail-after.jpg`, `lab-recipe-code-dark-after.jpg`, `lab-recipe-code-light-after.jpg`, `lab-recipe-section-leading-final.jpg`, `lab-recipe-handoff-notice-after.jpg`, and the combined fidelity comparison images in the temporary QA workspace.
- Desktop CSS viewport: 1280 × 720 for the final consistency pass.
- Responsive check: 390 × 844. No horizontal document overflow occurred.
- Full-view and focused comparisons were normalized into 1596 × 449 side-by-side canvases.

## States and interactions checked

- Dark home, skill detail, and recipe detail hero states.
- Full-width home hero/command and catalog frame.
- Full-width skill hero, description, installation command, and instruction frame.
- Vertical recipe hero and semantic rationale blockquote.
- Recipe navigation with duplicated delivery-map and roster summaries removed.
- Vertical planning prompts, wrapped prompt content, and copyable approval command.
- Copyable skill-install references and prompt controls; copied state reached `success` and displayed the toast.
- Icon-only prompt controls remain 38 × 38 pixels while preserving their accessible copy label in the DOM.
- Recipe skill references reuse the skill-detail installation component; the tested copy button is centered within the command and reaches its success/check state.
- Recipe contents navigation occupies the right rail on desktop and returns above the article on narrow screens.
- Phase and step headings share the same index/content columns; desktop step bodies and controls continue on that content column, while the narrow layout uses a 44 px index rail without overflow.
- Phase indices `01`–`04` and step indices use the same research-blue treatment: 23 px/600 weight/23 px line height on desktop and 20 px/600 weight/20 px line height at 366 px, with identical alignment and no overflow.
- Step indices remain pinned at the same 124 px reading offset as the sticky contents rail while their owning step is active; the narrow layout returns them to normal flow.
- Active contents links cover the complete 220 px rail width with no outer inset.
- Command, prompt, Markdown, and legacy command panels resolve to the same `#18181b` surface; outer borders resolve to `#27272a` in dark mode and `#f4f4f5` in light mode, while code-header text resolves to `#d4d4d8` and `#71717a` respectively.
- Prompt copy controls contain only the icon and accessible label; tested button and icon centers match exactly on both axes, and the control reaches success/check state with the toast visible.
- Conversation rule, phase title, step body, handoff, prototype gate, and source copy share the same desktop content-column x-position.
- All four phase handoffs now share the guidance notice anatomy: 16 px × 20 px padding, 8 px radius, no border, and the theme surface token, with zero narrow-screen overflow.
- Recipe contents links update an `aria-current="location"` state while scrolling and after clicks/hash loads; all six targets were exercised and matched their active link.
- Mobile hero, blockquote, navigation, and skill-reference layout.
- Browser console errors and warnings: none.

## Required fidelity surfaces

- Fonts and typography: LAB display and body fonts retain the established hierarchy; the full-width frames reduce forced title and paragraph wrapping without changing font tokens.
- Spacing and layout: home, skill, and recipe primary frames now use the full viewport with shared responsive gutters; recipe phases use consistent dividers instead of nested summary cards.
- Colors and tokens: service gradients and research-blue recipe accents remain mapped to LAB tokens in both themes.
- Image and icon fidelity: the live LAB mark and live icon-library assets remain in use; no placeholder or handcrafted image substitutes were introduced.
- Copy and content: duplicated phase summaries were removed while the useful on-page navigation, phase instructions, handoffs, and prototype gate remain.

## Comparison history

| Severity | Difference found | Correction | Post-fix visual evidence |
| --- | --- | --- | --- |
| P1 | Home and detail heroes were constrained by independent 1024 px, 840 px, and 760 px maximum widths. | Replaced the competing containers with one full-width LAB frame and responsive page gutters; title, description, and install command now occupy the same frame. | Home, skill, and recipe screenshots measure effectively the full 1600 px viewport with no overflow. |
| P1 | Recipe rationale was a detached side card and broke the vertical reading flow. | Rebuilt the recipe hero as a vertical stack and rendered the rationale as a semantic blockquote with the LAB research accent. | Recipe full-view comparison shows one continuous hero and blockquote. |
| P1 | Recipe phase names appeared in a delivery map, a second roster, navigation, and the actual phase sections. | Removed the delivery map and roster; retained one navigation layer and the actual separated phase sections. | DOM checks return zero `.delivery-map` and `.chat-roster` elements. |
| P1 | Step 3.2 rendered two prompt blocks side by side, clipping long code and producing visible scrollbars. | Stacked prompts vertically, matched the shared dark code-toolbar surface, and enabled readable pre-wrapping. | Focused planning comparison shows two full-width vertical prompts and no document overflow. |
| P2 | Referenced skills were small pills that linked away but could not be copied or installed directly. | Replaced every skill pill with a reusable source/install block and animated copy control; added a copyable planning approval command. | Nine recipe skill/command references are present and the tested control reached its success state. |
| P2 | Catalog rows ended with repeated LAB pillar lockups. | Removed lockup generation from both the dynamic home renderer and generated related rows, retaining only the directional arrow. | Home and skill DOM checks return zero `.row-lab-lockup` elements. |
| P1 | Prompt controls exposed a second “Copy prompt” label while install references used a different component anatomy. | Reduced prompt controls to the shared icon-only state and rebuilt skill references with the same title/source toolbar, copy slot, and code body used by prompts. | Final focused capture shows matching stacked code surfaces; computed controls are 38 × 38 pixels and the tested icon reached the check state. |
| P2 | Step indices were visually detached, the feedback note used a second accent, and the contents rail sat opposite the desired reading edge. | Sized indices to the complete heading block, mapped notes to the recipe accent, and moved the desktop contents rail to the right. | Computed index size is 23 px across a 55.5 px heading, all recipe accents resolve to research blue, and the navigation x-position is greater than the article x-position. |
| P1 | Recipe skill references still looked like generic two-row code panels and placed the copy icon in a detached top-right cell. | Reused the skill-detail install command anatomy: installation label, `$` prompt, LAB pillar stripe, inset copy button, and a separate source link. | The normalized before/after comparison shows the compact command hierarchy; the button and command vertical centers are identical and the control reaches the check state. |
| P1 | Phase titles, step titles, and step bodies used three different horizontal starts; the centered step index also floated below the title baseline. | Unified phase and step headers on the same numbered grid, aligned desktop body content to it, top-aligned step indices, and introduced a compact 44 px narrow-screen rail with safe wrapping. | Desktop checks report identical x-positions for phase title, step title, body, skill installs, and prompts; at 366 px the phase and step titles share the same x-position with no document overflow. |
| P1 | Code-related panels used a mix of `var(--code)`, `#18181b`, and unrelated inherited border tokens, producing subtly different fills and border contrast. | Added one code-surface token set for commands, prompts, Markdown blocks, toolbars, and copy controls, then tuned the requested theme contrast direction. | Computed checks return the same `rgb(24, 24, 27)` panel background; outer borders are `rgb(39, 39, 42)` in dark mode and `rgb(244, 244, 245)` in light mode. |
| P1 | The sticky contents aside provided no indication of which long recipe section was currently visible. | Added a requestAnimationFrame-throttled scrollspy with click, hash, resize, and load synchronization plus a LAB-accent active treatment and `aria-current`. | Foundation remains highlighted while step 1.2 is visible; Foundation, Visuals, Planning, Implementation, and Prototype gate each matched after navigation, with no console errors. |
| P1 | Recipe phase indices `01`–`04` remained small and gray while nested step indices such as `1.1` were larger and research-blue. | Applied one shared index selector and responsive typography treatment to phase and step indices. | Computed styles match exactly for `01`–`04` and `1.1`: research blue, 23 px/600 on desktop and 20 px/600 at 366 px, with zero horizontal overflow. |
| P1 | Prompt buttons retained invisible text beside the icon, step numbers scrolled away, active navigation remained inset, and unnumbered sections escaped the main reading column. | Removed visual button text in favor of accessible labels, introduced a durable sticky step rail, made active links full-bleed, and aligned supporting sections to the numbered content column. | Button and icon centers match exactly; the copied state and toast pass; the step index remains at 124 px while scrolling; active-link and nav widths both equal 220 px; all measured content starts at x = 171.953 px. |
| P1 | Multi-line code headers and panel borders used one contrast level in both themes. | Added separate theme tokens for header text, panel borders, dividers, and controls. | Header text computes to `rgb(212, 212, 216)` in dark mode and `rgb(113, 113, 122)` in light mode; panel borders compute to `rgb(39, 39, 42)` and `rgb(244, 244, 245)` respectively. |
| P1 | Phase handoffs were presented as loose paragraphs separated only by a rule, while nearby operational guidance used a clear notice surface. | Reused the step-guidance notice grammar for every `.phase-output`, preserving the aligned reading column. | All four handoffs compute to 16 px × 20 px padding, 8 px radius, no border, `rgb(24, 24, 27)` in dark mode and `rgb(244, 244, 245)` in light mode; the focused comparison matches the supplied notice reference. |

## Final findings

- P0: none.
- P1: none.
- P2: none.
- P3: none that block fidelity or reading flow.
- Automated checks: site build, generated-site contract, repository validation, and all nine tests pass.

final result: passed
