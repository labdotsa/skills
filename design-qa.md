# Design QA

## Visual truth

- User references include `Screenshot 2026-08-11 at 12.22.16 PM.png`, `Screenshot 2026-08-11 at 12.25.36 PM.png`, `Screenshot 2026-08-11 at 12.25.52 PM.png`, `Screenshot 2026-08-11 at 12.26.37 PM.png`, and the narrow step crop `Screenshot 2026-08-11 at 12.43.14 PM.png`, in addition to the preceding full-width recipe review set.
- Browser-rendered implementation captures: `lab-recipe-right-rail-final.jpg`, `lab-recipe-consistent-blocks-final-2.jpg`, `lab-recipe-research-install-final-3.jpg`, `lab-recipe-step-stable-desktop.jpg`, `lab-recipe-step-stable-mobile.jpg`, `lab-recipe-code-surfaces-dark.jpg`, and `lab-recipe-code-surfaces-light.jpg` in the temporary QA workspace, plus the prior home and skill full-width captures.
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
- Command, prompt, Markdown, and legacy command panels resolve to the same `#18181b` surface; outer and copy-control borders resolve to `#3f3f46`/`#52525b` in light mode and `#a1a1aa` in dark mode.
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
| P1 | Code-related panels used a mix of `var(--code)`, `#18181b`, and unrelated inherited border tokens, producing subtly different fills and border contrast. | Added one code-surface token set for commands, prompts, Markdown blocks, toolbars, and copy controls, with inverse border contrast per theme. | Computed dark and light checks return the same `rgb(24, 24, 27)` background for command and prompt layers; dark borders are `rgb(161, 161, 170)` and light borders are `rgb(63, 63, 70)`. |

## Final findings

- P0: none.
- P1: none.
- P2: none.
- P3: none that block fidelity or reading flow.
- Automated checks: site build, generated-site contract, repository validation, and all nine tests pass.

final result: passed
