# Contributing

Contributions should make a repeatable workflow clearer, safer, or more reliable.

## Before proposing a skill

A good candidate:

- Solves a problem that has appeared in real work more than once.
- Adds knowledge, constraints, or a procedure an agent would otherwise miss.
- Has a clear trigger and a checkable outcome.
- Is portable and contains no private paths, credentials, customer data, or internal-only links.

Open a skill proposal before investing in a large contribution.

## Repository conventions

- Stable skills live directly under `skills/<skill-name>/`.
- Each stable directory contains exactly one root `SKILL.md`.
- Skill names use lowercase letters, numbers, and hyphens and match their directory name.
- Each stable skill declares a broad public discovery category in `metadata.category`.
- Drafts live under `incubator/<skill-name>/DRAFT.md`; never put `SKILL.md` in `incubator/`.
- Retired skills live under `deprecated/<skill-name>/README.md`; never put `SKILL.md` in `deprecated/`.
- Optional resources stay inside the skill that owns them: `references/`, `scripts/`, `assets/`, and `evals/`.
- Keep `SKILL.md` focused. Move conditional or detailed material into referenced files.

## Adding a stable skill

1. Copy `templates/skill/` to `skills/<skill-name>/`.
2. Rename `SKILL.template.md` to `SKILL.md`.
3. Replace the template metadata and instructions.
4. Remove any unused optional directories.
5. Add realistic evaluation cases when the outcome can be tested.
6. Run `npm run catalog`, `npm run site:build`, and `npm run validate`.
7. Add a short entry under `Unreleased` in `CHANGELOG.md`.

## Changing the discovery site

- Edit source files under `website/`, never generated files under `site/`.
- Treat each `recipes/<name>/RECIPE.md` frontmatter block as the discovery source for the Recipes index; its `metadata.detail-url` must point to a generated or copied local detail page.
- Keep the site usable when opened directly from the filesystem as well as from GitHub Pages.
- Treat each skill's `SKILL.md` as the source for its rendered protocol instructions; do not duplicate that content in website templates.
- Run `npm run build` to refresh the deployable output.
- Run `npm run validate`; this checks the catalog contract and browser-model tests in addition to generated-file freshness.

## Pull request checklist

- [ ] The skill is based on a demonstrated workflow.
- [ ] The directory name matches the frontmatter `name`.
- [ ] The description says both what the skill does and when to use it.
- [ ] Instructions do not depend on undisclosed local or private context.
- [ ] Scripts are narrowly scoped, safe, and document their dependencies.
- [ ] Links resolve and sources are attributed where appropriate.
- [ ] The generated catalog is current.
- [ ] Generated GitHub Pages output is current when website source changed.
- [ ] `npm run validate` passes.

By contributing, you agree that your contribution is licensed under this repository's MIT license.
