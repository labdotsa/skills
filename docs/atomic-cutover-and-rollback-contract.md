# Atomic SvelteKit cutover and rollback contract

Status: accepted human decision for
[Define the single-source migration, cutover, and rollback proof](https://github.com/labdotsa/skills/issues/13),
recorded on 2026-08-11.

This contract implements the user's selected **atomic source cutover**. It operates inside the
[single-source ADR](adr/0001-single-source-static-discovery-site.md), the
[existing-prototype acceptance](existing-prototype-acceptance.md), the
[portable static-hosting contract](portable-static-hosting-contract.md), and the
[executable parity harness](discovery-site-parity-harness.md).

## Decision

The legacy Discovery Site remains the live baseline on the default branch while the complete SvelteKit replacement is
built and proved on one isolated migration branch. The migration branch never commits `website/` and `src/` as two
application sources: its first source-boundary commit removes `website/` while introducing the SvelteKit shell and
switching all application commands to `src/`.

After the complete route set, machine surfaces, quality gates, and both host profiles pass from one head revision, the
migration pull request is squash-merged into the default branch as **one reviewed cutover commit**. That commit:

- adds the complete SvelteKit `src/`, `static/`, configuration, component, domain, and test source;
- removes `website/`, its browser scripts/style source, and every obsolete page-assembly implementation;
- switches build, preview, validation, and deployment commands to the SvelteKit/shared pipeline;
- removes tracked generated `site/` bytes and makes `site/` a reproducible ignored Publication Artifact;
- updates repository instructions, contributor guidance, deployment configuration, and the changelog together;
- contains no compatibility application tree, provider-specific frontend, or hand-maintained generated page.

Immediately before merge, the exact deployed legacy revision receives a permanent annotated tag and a checksummed
release bundle. Rollback redeploys that immutable artifact and reverts the cutover commit; it never restores a legacy
folder beside `src/` on the new revision.

## Source states

Only these states are valid:

| State | Default branch | Migration branch | Deployed canonical site |
| --- | --- | --- | --- |
| Before migration | `website/` is the sole application source; no `src/` | not created | legacy artifact |
| During implementation | unchanged legacy source | `src/` is sole application source; `website/` absent | default-branch legacy artifact |
| Pre-cutover proof | unchanged legacy source | complete, green SvelteKit source at one immutable head | legacy canonical; migration deploy previews/backup proof only |
| After cutover | `src/` is sole application source; `website/` absent | merged by one squash commit | SvelteKit artifacts from the cutover commit |
| Rolled back | revert commit restores the tagged legacy revision as the sole source | retained only as historical branch evidence | tagged legacy artifact |

Generated outputs, screenshots, release archives, Git tags, CI artifacts, and provider deploy records are evidence—not
application sources. A local worktree may check out one revision at a time. Do not copy `website/` into the migration
branch, mount it under another name, import from it, or keep it as a fallback.

## Immutable legacy baseline

### Freeze point

Choose `LEGACY_BASE_SHA` only after the default branch is clean and all existing content, output, browser, and
repository gates pass. Freeze new Discovery Site source changes during final proof. Source Content changes that must
land afterward require rebasing the migration branch and rerunning the complete matrix; do not manually transplant
generated HTML.

Create and push an annotated tag whose immutable name contains the short SHA:

```text
discovery-site-pre-sveltekit-<short-sha>
```

The tag points directly to `LEGACY_BASE_SHA`, is never moved or reused, and records the cutover issue, validation run,
timestamp, and full SHA in its annotation. The tag is the durable source rollback boundary even if provider deploy
history or ordinary CI artifacts expire.

### Release bundle

From a clean checkout of the tag, run the locked legacy installation/build/parity commands and publish a GitHub Release
with the same name. Its assets are:

```text
legacy-site.tar.gz
parity-captures.tar.gz
legacy-test-results.tar.gz
legacy-manifest.json
SHA256SUMS
```

`legacy-site.tar.gz` contains the exact tracked Publication Artifact served at cutover. `legacy-manifest.json` records:

- full commit SHA and tag;
- Node/npm versions and `package-lock.json` SHA-256;
- build and validation commands;
- sorted route/file manifest with size and SHA-256;
- Skill and Recipe source/catalog digests;
- canonical origin and legacy deployment URLs;
- parity viewport/theme settings and test counts;
- creation timestamp and workflow run URL.

`SHA256SUMS` covers every release asset. CI extracts the archive into a temporary directory, validates every digest,
serves it through the parity server, and smoke-tests root, Skill, Recipe, asset, and not-found paths before the bundle
is accepted. A tag without a verified release bundle does not satisfy the rollback gate.

## Migration-branch discipline

Create one migration branch from `LEGACY_BASE_SHA`. The first committed change on that branch is the source-boundary
slice: delete `website/`, introduce the SvelteKit shell under `src/`, and make every application command resolve through
the new configuration. From that commit onward, branch validation rejects any reintroduction of:

- `website/` or a renamed copy of it;
- legacy page templates, global browser modules, or the legacy global stylesheet;
- an executable copy of the old catalog, Markdown, Recipe, or page-assembly model;
- a provider-specific component/route tree;
- hand-edited HTML under `site/`;
- imports or copy steps that read application markup/style/script from the baseline tag or release bundle.

Implementation tickets may create ordinary reviewable commits on this isolated branch. Each ticket uses a vertical
public behavior test and keeps the branch's one-source invariant. Those commits remain useful review history in the
pull request, but the default branch receives their combined result as one squash commit.

The legacy tag, release bundle, deployed site, parity contract, and captures are read-only comparison oracles. They are
never mounted as build inputs for the SvelteKit application.

## Generated-output policy

The legacy default branch continues committing `site/` until cutover so its existing freshness contract remains
unchanged. The atomic cutover commit switches to the final policy:

- `/site/` is ignored and contains only a local/provider build result;
- CI and each host run `npm ci`, validation, and the appropriate publication-profile build from source;
- artifacts record source SHA, profile, lockfile digest, and route/file manifest;
- no pull request includes generated SvelteKit HTML or hashed asset churn;
- `npm run validate` creates isolated temporary outputs for canonical and `pages-project` checks and fails on stale or
  hand-maintained publication files;
- Pages uploads the job's `pages-project` artifact; Netlify publishes the job's canonical artifact.

The cutover commit updates `.gitignore`, `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, workflows, validators, and hosting
configuration together. Removing tracked `site/` does not remove the public site; it removes generated bytes from
source control while both providers continue building them from the same source revision.

## Cutover pull request

The migration pull request targets the frozen legacy base and remains unmerged until all implementation tickets
through deployment proof are complete. Its final head is immutable during approval. Any code or Source Content change
invalidates approval and reruns every required job.

### Required diff proof

The final diff must show:

- `website/` deleted and `src/` added;
- no tracked `site/` output;
- one `package-lock.json` and exact direct dependency versions;
- no runtime presentation CDN or legacy asset URL;
- no old page builder, duplicate parser/domain model, or obsolete browser behavior script;
- thin repository commands importing the same server/domain implementation as routes;
- locally owned shadcn-svelte primitives feeding `shared/` and `site/` components;
- canonical and Pages-project provider configuration selecting profiles only;
- current repository/contributor/deployment documentation.

A source-exclusivity check fails if both `website/` and `src/` exist, if neither exists, if `site/` is tracked after
cutover, or if an obsolete module remains reachable from a script, build, test, or import graph.

### Required validation proof

All evidence comes from the same final head and lockfile:

1. clean `npm ci` on the supported Node/npm pair;
2. `svelte-check`, unit, component, static-output, link/asset, and dependency-boundary checks;
3. complete canonical and `pages-project` prerender builds in separate output directories;
4. exact dynamic-route, alias, 404, sitemap, robots, JSON, LLM, and metadata validation;
5. parity journeys and captures at 1280 × 720, 390 × 844, and the 366 px overflow boundary;
6. light, dark, system, reduced-motion, keyboard, screen-reader-semantic, and storage-denial checks;
7. enforced accessibility, asset, JavaScript/hydration, font, LCP, INP, and CLS budgets;
8. normalized cross-profile manifest comparison proving one human component/content graph;
9. Netlify deploy-preview and GitHub Pages backup smoke tests from the exact head;
10. extraction and smoke test of the legacy rollback release bundle.

The pull request links the baseline tag/release, final head SHA, validation workflow, normalized artifact manifests,
deploy URLs, parity evidence, and rollback dry-run. An approval without those immutable pointers is not cutover
approval.

## Merge and deployment sequence

1. Freeze Discovery Site source/content changes and confirm the migration head is based on `LEGACY_BASE_SHA`.
2. Create, push, build, checksum, and smoke-test the permanent legacy tag/release bundle.
3. Mark the final migration head immutable and complete the full validation/deploy-preview matrix.
4. Review the complete legacy-to-SvelteKit diff and approve the one-source deletion/addition boundary.
5. Squash-merge the migration pull request as one cutover commit; do not use a merge commit that brings intermediate
   migration ancestry onto the default branch.
6. Build both publication profiles again from the cutover commit and compare them with the approved head manifests.
7. Deploy and smoke the noncanonical GitHub Pages backup first.
8. Unlock/promote the Netlify canonical artifact from the same cutover commit, then run canonical deep-link, metadata,
   theme, interaction, and asset smoke tests.
9. Record provider deploy IDs, timestamps, smoke results, and final manifests in the cutover evidence record.
10. End the source freeze only after both hosts are green.

No DNS migration is required: `skills.lab.sa` remains the canonical Netlify origin and Pages remains the noindex backup.
If Netlify cannot hold production promotion until the Pages proof completes, its deploy remains a preview and the
legacy production deploy stays published.

## Rollback contract

### Automatic rollback triggers

Rollback starts immediately when post-deploy smoke tests find any of these on the canonical host:

- root or a cataloged Skill/Recipe route is unavailable or serves incomplete HTML;
- local JavaScript, CSS, font, image, or hydration assets fail to load;
- the canonical/indexability profile is wrong, including production `noindex` or backup indexability;
- theme initialization prevents rendering or produces a persistent hydration/runtime failure;
- catalog/source digests or visible route content differ from the approved cutover artifact;
- a critical keyboard, navigation, install/copy, or mobile-overflow journey is unusable;
- both hosts were not built from the recorded cutover SHA and lockfile.

Noncritical cosmetic differences that passed the accepted threshold create a roll-forward defect; they do not justify
keeping a broken canonical deployment live while someone debates a fix.

### Deployment rollback

1. Stop further production promotion and preserve failed deploy logs/artifacts.
2. Netlify atomically republishes its last verified legacy deploy or the verified `legacy-site.tar.gz` contents.
3. GitHub Pages reruns the legacy deployment workflow at the permanent tag or uploads the verified legacy archive.
4. Run the legacy smoke subset and confirm canonical/backup roles, deep links, assets, and theme behavior.
5. Record the rollback deploy IDs and incident reason before reopening traffic/change flow.

Provider history is an optimization, not the rollback source of truth. The permanent tag and checksummed release bundle
must be sufficient if a provider's retained deploy is unavailable.

### Repository rollback

Create a normal revert commit of the single cutover commit and review it. Do not force-push, reset the default branch,
move the legacy tag, or copy `website/` beside `src/`. Because the cutover is one squash commit, its revert restores the
legacy source, tracked artifact policy, scripts, and documentation as one coherent state.

Fixes continue on the isolated migration branch. A second cutover follows the same baseline/update/proof process and
receives a new immutable tag/release name if the legacy base changed.

## TDD and audit matrix

Each implementation slice adds one public assertion before its code. The final cutover proof includes these dedicated
tests:

| Gate | Failing condition | Passing evidence |
| --- | --- | --- |
| Source exclusivity | both/neither application trees or a reachable legacy module | exactly one accepted source tree for the checked revision |
| Generated output | tracked/edited SvelteKit output or provider publishing stale bytes | clean builds reproduce isolated manifested artifacts from source |
| Baseline integrity | missing/mutable tag, digest mismatch, expired-only evidence | annotated tag plus extracted checksummed release bundle passes smoke tests |
| Atomic diff | partial deletion, compatibility implementation, multiple default-branch migration commits | one reviewed squash commit replaces the complete source boundary |
| Cross-profile identity | host-specific components/content or unexplained normalized differences | canonical and project manifests agree outside allowed profile fields |
| Rollback drill | archive cannot deploy/serve or revert leaves a mixed source state | temporary deployment and revert simulation both restore the legacy contract |
| Post-deploy smoke | route, asset, metadata, theme, or interaction failure | both provider records point to the cutover SHA and pass the shared smoke suite |

The rollback drill runs before merge in temporary directories/environments; it does not alter the live default branch
or canonical deployment.

## Downstream ownership

- **Publish the implementation tracer-ticket graph** incorporates this branch/squash/tag/artifact boundary into every
  implementation ticket and native dependency edge.
- **Cut over to the sole SvelteKit application shell** creates the migration branch's first source-exclusive commit.
- Feature, content, SEO, LLM, and quality tickets build only on that SvelteKit branch state.
- **Deploy the root build to Netlify** and **Deploy the project-base build to GitHub Pages** prove the same immutable
  head without selecting different application code.
- **Finalize the single-source Discovery Site cutover** creates the legacy tag/release, confirms the complete evidence
  matrix, squash-merges the one cutover commit, removes tracked output/obsolete paths, and records or executes rollback.

No additional human policy choice remains. A person reviews the final pull request and production promotion as an
ordinary release control, but the architecture, source boundary, artifact policy, order, rollback triggers, and
recovery procedure are fixed by this contract.

## Resolution

The selected option is **A: atomic cutover**. The default branch changes from the complete legacy source state to the
complete SvelteKit source state in one reviewed squash commit. The old implementation survives only in its permanent
pre-cutover tag, checksummed release bundle, and provider history. It never coexists with `src/` as an accepted or
reachable application source.
