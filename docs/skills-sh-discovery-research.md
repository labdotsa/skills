# skills.sh discovery and indexing research

Researched on 2026-08-12 against current first-party skills.sh documentation, the official `vercel-labs/skills` source repository at commit [`c6f69c6`](https://github.com/vercel-labs/skills/tree/c6f69c631292444cc541ac6d91e2226b0ff247da), the live skills.sh surfaces, and the public `labdotsa/skills` repository.

## Recommendation

Do not restructure the repository or add a registry manifest to solve this. The current repository is public, uses the CLI's standard `skills/<name>/SKILL.md` layout, and the latest CLI discovers all six stable skills. The missing skills.sh listing is therefore most likely an unseeded or failed asynchronous telemetry-ingestion event, not a catalog-layout defect.

Run one legitimate remote install of the published repository with the latest CLI and telemetry enabled, then verify owner-scoped search, the repository page, and the badge. If the listing remains absent after allowing for asynchronous ingestion, file a focused ingestion bug in `vercel-labs/skills` with the evidence listed below. Do not generate repeated artificial installs: skills.sh treats installs as the adoption signal used for discovery and ranking.

## How listing works now

skills.sh does not document a publisher submission form, registration endpoint, repository topic, release convention, or manifest as the way to enter its public leaderboard. Its FAQ says skills appear automatically when users run `npx skills add <owner/repo>` and that the resulting aggregate install count determines their place in the rankings. [skills.sh FAQ: listing and leaderboard](https://skills.sh/docs/faq#how-do-i-get-my-skill-listed-on-the-leaderboard)

The official CLI documentation says install telemetry is enabled by default and is used to rank skills; `DISABLE_TELEMETRY=1` opts out. [skills.sh CLI reference: telemetry](https://skills.sh/docs/cli#telemetry) The current CLI source also recognizes `DO_NOT_TRACK`, sends telemetry to the skills.sh ingestion service, and makes telemetry failures non-fatal to installation. [Official telemetry implementation](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/telemetry.ts#L1-L2), [opt-out and delivery logic](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/telemetry.ts#L86-L88), [non-blocking request logic](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/telemetry.ts#L139-L190)

For GitHub sources, an install event is emitted only after the CLI normalizes the remote source and positively confirms that the repository is public. A local-path install is not a usable publication signal, and an unknown or private GitHub visibility result is deliberately not sent. The event contains the source, selected skill names, agents, and each skill's repository-relative `SKILL.md` path. [Official GitHub install-telemetry path](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/add.ts#L1783-L1834)

Consequently, merely making a GitHub repository public is insufficient. Likewise, `--list`, a local install from `.`, a copied skill outside the remote installation flow, telemetry opt-out, or a failed visibility check may leave skills.sh without the install event that seeds the listing. The first two points follow directly from the CLI's install-event placement and remote-path checks; the absence of a published ingestion service source means the server-side scheduling and acceptance rules cannot be independently verified.

## Ranking, search, and curated status

The default leaderboard view is all-time installs. The API also exposes `trending` for recent growth and `hot` for a current-hour comparison with the same hour on the previous day. Skill detail records define `installs` as the total deduplicated install count. [skills.sh API: leaderboard views](https://skills.sh/docs/api#endpoints), [skills.sh API: skill detail fields](https://skills.sh/docs/api#get-api-v1-skills-source-skill)

Search matches skill name, source, or description. Single-word queries use fuzzy matching; multi-word queries use semantic search, and an `owner` filter limits results to GitHub repositories owned by one account. [skills.sh API: search](https://skills.sh/docs/api#get-api-v1-skills-search) The public CLI calls the search service with the query and optional owner, then sorts returned results by install count. [Official CLI search implementation](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/find.ts#L86-L115)

The `Official` collection is separate from ordinary discovery: it is a curated set of first-party makers teaching users about their own technology. It is not the normal listing path for a general public skills repository. [skills.sh API: curated skills](https://skills.sh/docs/api#get-api-v1-skills-curated)

No official source found in this research states a minimum install count, guarantees an ingestion time, or documents a public re-index command. An official issue provides a useful observation—not a service-level guarantee—that one valid repository appeared automatically about 2.5 hours after its first real install, without maintainer action. [Resolved indexing report, `vercel-labs/skills#1840`](https://github.com/vercel-labs/skills/issues/1840#issuecomment-5151162309)

## Current state of `labdotsa/skills`

The GitHub repository is public and its default branch is `master`. The stable catalog is flat under `skills/`, which is one of the standard locations searched by the CLI. [Public repository](https://github.com/labdotsa/skills), [official skill-discovery rules](https://github.com/vercel-labs/skills/tree/c6f69c631292444cc541ac6d91e2226b0ff247da#skill-discovery)

A read-only smoke check on 2026-08-12 used:

```console
DISABLE_TELEMETRY=1 npx -y skills@latest add labdotsa/skills --list
```

The latest CLI cloned the public repository and found all six stable skills:

- `build-product-artifacts`
- `copywriting`
- `deconstruct`
- `information-architecture`
- `seo-engine`
- `tailwind`

This validates CLI discoverability without creating an install or claiming a telemetry event. The standard discovery implementation explicitly searches `skills/` and parses child `SKILL.md` directories. [Official discovery source](https://github.com/vercel-labs/skills/blob/c6f69c631292444cc541ac6d91e2226b0ff247da/src/skills.ts#L247-L317)

At the same observation time, the legacy public search endpoint returned no `labdotsa` results for the six skill names, the [repository page](https://skills.sh/labdotsa/skills) resolved to a not-found response, and the [badge](https://skills.sh/b/labdotsa/skills) rendered `resource not found`. A guessed three-segment skill URL can render a generic fallback even before search indexing, so it should not be treated alone as proof that a skill is listed. A comparable installable-but-missing case remains documented in the official tracker. [`vercel-labs/skills#1683`](https://github.com/vercel-labs/skills/issues/1683)

## Concrete next steps

1. Confirm that `DISABLE_TELEMETRY` and `DO_NOT_TRACK` are unset in the environment that will perform the smoke install.
2. From a normal maintainer or real user project—not CI created to inflate counts—perform one remote install with the latest CLI. To seed every published skill in one event:

   ```sh
   npx skills@latest add labdotsa/skills --all --agent codex -y
   ```

   If `--all` is unsuitable for the operator's agent setup, install the six skills explicitly from `labdotsa/skills`; the important properties are a real remote install, a successful target-agent installation, and telemetry remaining enabled.
3. Check each signal after ingestion has had time to run:

   ```sh
   npx skills@latest find copywriting --owner labdotsa
   npx skills@latest find build-product-artifacts --owner labdotsa
   ```

   Also check [the repository page](https://skills.sh/labdotsa/skills) and [the badge endpoint](https://skills.sh/b/labdotsa/skills). There is no documented ingestion SLA, so record the install timestamp and timezone rather than promising a specific wait.
4. If the owner-filtered searches remain empty, open a bug through the [official issue chooser](https://github.com/vercel-labs/skills/issues/new/choose). Describe it as “public repo installs successfully but is absent from skills.sh search,” not as a routine submission. Include:

   - `https://github.com/labdotsa/skills`, its public visibility, and default branch;
   - the exact `skills@latest` version and complete `--list` output showing all six names;
   - the exact real install command, successful output, timestamp, and timezone;
   - confirmation that both telemetry opt-out variables were unset;
   - the owner-filtered search responses, repository-page status, and badge text;
   - a link to the comparable open report [`#1683`](https://github.com/vercel-labs/skills/issues/1683), while noting that other reports have resolved asynchronously.
5. After the repository is listed, add the documented skills.sh badge to `README.md`. The official badge form is `[![skills.sh](https://skills.sh/b/owner/repo)](https://skills.sh/owner/repo)`. [skills.sh badge documentation](https://skills.sh/docs#badge)
6. Optionally add a root `skills.sh.json` after listing to group the six skills on the repository page. This file changes only presentation; it does not affect CLI discovery or indexing, and skills.sh reads it only after the telemetry service has seen the repository. [skills.sh repository-page customization](https://skills.sh/docs/customize#what-this-is-for), [when customization appears](https://skills.sh/docs/customize#when-changes-appear)

## Discovery improvements after indexing

Because search uses names, sources, and descriptions, keep each `SKILL.md` description concrete about the user's task and likely search vocabulary. Promote canonical per-skill commands such as `npx skills add labdotsa/skills --skill copywriting` and link to the eventual skills.sh detail pages. Real adoption is the documented ranking lever; GitHub topics, releases, repository stars, `metadata.category`, and a skills.sh-specific manifest are not documented indexing or ranking inputs and should not be presented as fixes.

The practical conclusion is narrow: one genuine, telemetry-enabled remote install is the supported publication trigger. If that trigger has already succeeded and `labdotsa` still has no searchable entries, the next move is an evidence-rich ingestion bug—not a repository redesign.
