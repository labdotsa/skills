# Repository instructions

This is a public Agent Skills repository. Optimize for portability, clarity, and safe reuse outside the maintainer's own environment.

## Structure

- The installable catalog is flat: `skills/<skill-name>/SKILL.md`.
- Only stable skills belong under `skills/`.
- Incubating work uses `incubator/<skill-name>/DRAFT.md` so skill installers cannot discover it.
- Deprecated work uses `deprecated/<skill-name>/README.md` and must not retain a `SKILL.md`.
- Human-facing documentation belongs under `docs/`; agent instructions belong inside the owning skill.

## Skill requirements

- Follow the Agent Skills specification.
- Make the frontmatter `name` match the parent directory exactly.
- Use lowercase letters, numbers, and hyphens for names.
- Describe what the skill does and when it should activate.
- Keep references relative to the skill root and avoid deep reference chains.
- Put optional supporting material in `references/`, `scripts/`, `assets/`, or `evals/` within the skill.
- Never include credentials, customer information, private URLs, personal absolute paths, or assumptions about the maintainer's machine.

## Repository maintenance

- Run `npm run catalog` after adding, renaming, or removing a stable skill.
- Add a `metadata.category` value for every stable skill so discovery filters stay useful.
- Keep recipe discovery metadata in `recipes/<name>/RECIPE.md`; each `metadata.detail-url` must resolve inside the generated site.
- Edit discovery-site source only under `src/` and locally served static assets under `static/`; `site/` is generated output.
- Keep routes thin and compose the site through `ui → shared → site` components under `src/lib/components/`.
- Run `npm run catalog` after changing stable skill metadata, and use `npm run dev` for the local Discovery Site.
- Run `npm run build:matrix` after changing application source, publication profiles, or static assets.
- The Pages and Netlify workflows build the same SvelteKit route graph with an explicit publication profile.
- Run `npm run validate` before considering a change complete.
- Update `CHANGELOG.md` for behavioral, lifecycle, or distribution changes.
- Keep generated catalog content synchronized with skill frontmatter.
- Keep the SvelteKit application fully prerenderable and base-path portable; skill data is generated, not hand-maintained.
- Add UI through the pinned local shadcn-svelte workflow, use concrete Lucide icon subpaths, and do not load presentation assets from runtime CDNs.
- Do not add tool-specific plugin manifests until there is at least one stable skill to distribute.

## Agent skills

### Issue tracker

Issues, Wayfinder maps, and implementation tickets live in GitHub Issues for `labdotsa/skills`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the standard `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix` vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository with a root `CONTEXT.md` and system-wide ADRs under `docs/adr/`. See `docs/agents/domain.md`.
