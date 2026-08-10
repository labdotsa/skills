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
- Edit discovery-site source only under `website/`; `site/` is generated output.
- Run `npm run site:build` after changing stable skill metadata, recipe source, or files under `website/`.
- The Pages workflow runs `npm run build` before validation so deployed discovery data always reflects the current `skills/` directory.
- Use `npm run site:watch` when maintaining the catalog beside a local file preview.
- Run `npm run validate` before considering a change complete.
- Update `CHANGELOG.md` for behavioral, lifecycle, or distribution changes.
- Keep generated catalog content synchronized with skill frontmatter.
- Keep website source dependency-free and GitHub Pages-compatible; skill data is generated, not hand-maintained.
- Do not add tool-specific plugin manifests until there is at least one stable skill to distribute.
