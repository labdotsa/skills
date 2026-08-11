# Discovery Site parity harness

The parity harness makes the pre-SvelteKit Discovery Site contract executable. It complements the
[current-state inventory](discovery-site-parity-contract.md) with public-interface checks that can be rerun before and
after each migration slice.

## Setup and commands

```bash
npm ci
npx playwright install chromium
npm run parity
```

`npm run parity` rebuilds the Publication Artifact, runs the Node contract tests, exercises browser interactions at the
desktop and mobile QA viewports, and writes named reference captures.

For focused loops:

| Command | Purpose |
| --- | --- |
| `npm test` | Catalog, Markdown safety, theme, static-server, route, metadata, sitemap, and output-contract tests |
| `npm run test:e2e` | Browser interaction parity in desktop and mobile Chromium projects |
| `npm run parity:capture` | Full-page reference captures for the four representative surfaces |
| `npm run site:serve` | Serve the generated Publication Artifact at `http://127.0.0.1:4173` |
| `npm run validate` | Existing browser-independent repository and generated-output completion gate |

The GitHub validation workflow installs Chromium, runs the browser suite, regenerates captures, and uploads them as the
`parity-captures` workflow artifact. Netlify continues to use `npm run validate` without requiring a browser installation.

## Automated contract

### Static output and HTTP

- The generated home page is served as HTML at `/`.
- Directory-index deep links such as `/skills/tailwind/` resolve through the same static server used by browser tests.
- Unknown paths serve the current generated not-found surface with an HTTP 404 status.
- Home, not-found, Recipe index, Recipe detail, and every cataloged Skill detail page retain their recorded titles,
  canonicals, headings, and required content regions.
- Skill and Recipe schema version 1 catalogs, Recipe detail links, sitemap locations, and robots directives remain one
  consistent publication set.
- Markdown raw HTML, fenced code, and unsafe URL-scheme behavior remain covered through the public renderer.

### Browser behavior

- `/` focuses Skill search with `/`, filters results, switches between Skills and Recipes, clears filters, and restores
  focus.
- System theme resolution, explicit theme persistence, reload behavior, copy loading/success state, and live feedback
  are exercised.
- Mobile navigation opens through its accessible summary and exposes Skills, Recipes, and theme destinations.
- A generated Skill page renders instructions/package content, expands an overflowing region, and copies its install
  command.
- The dedicated Recipe index supports `/` search, empty state, clear, and refocus.
- The Recipe reading flow synchronizes contents navigation, copies a planning prompt, and has no horizontal document
  overflow.

All interaction tests run at 1280 × 720 and 390 × 844 except the mobile-navigation assertion, which only runs in the
mobile project.

## Reproducible captures

`npm run parity:capture` writes ignored PNG output under:

```text
tmp/parity-captures/
  desktop/
    home.png
    recipes.png
    skill-tailwind.png
    recipe.png
  mobile/
    home.png
    recipes.png
    skill-tailwind.png
    recipe.png
```

The projects use fixed 1280 × 720 and 390 × 844 viewports, light color scheme, reduced motion, disabled screenshot
animations, and full-page capture. Captures are evidence, not a second application source; the ignored local output and
CI artifact can always be regenerated from the committed source revision.

## Intentional boundaries

This ticket locks the legacy contract; it does not redesign the UI, add SvelteKit, or decide policies still owned by the
Wayfinder graph. The home-shaped legacy 404 is recorded with a real 404 status so the later intentional 404 redesign is
visible as a contract change. Exact pixel-diff approval and cross-browser coverage remain part of the later quality-gate
work rather than being inferred from these Chromium reference captures.
