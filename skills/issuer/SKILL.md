---
name: issuer
description: Compile all accepted plans, specifications, product artifacts, or confirmed findings into a complete dependency-ordered graph of independently implementable issues, with a completion ledger for unresolved scope and missing authority. Use when Codex needs to create all implementation issues or tickets, prepare an AFK backlog, slice work for Orchestrator, publish issues to a configured tracker, report what remains unissued, or audit an issue queue for implementation readiness; do not use for open-ended discovery or ordinary single-change implementation.
metadata:
  author: labdotsa
  category: product-delivery
---

# Issuer

Compile product truth into executable work. Do not turn unresolved authority into implementation instructions.

## Select the mode

- **Issue** — create or publish ready work. This is the default when the user asks to make issues or tickets.
- **Draft** — propose a graph without writing or publishing when the user asks to review the breakdown first.
- **Audit** — inspect an existing queue without changing it unless the user also requests repair.

Do not add a mandatory approval checkpoint in Issue mode. Ask only when a missing choice would materially change money,
permissions, lifecycle, public behavior, architecture, scope, or destructive/external action.

## Establish authority and destination

1. Read repository instructions, the configured tracker contract, domain vocabulary, accepted decisions, relevant
   artifacts, current issue inventory, and worktree status.
2. Resolve the destination in this order: explicit user request, repository convention, named downstream consumer,
   then the local default `issues/`.
3. When Orchestrator is the downstream consumer, require local issue Markdown. If a repository mandates remote-only
   tracking, report the incompatible authorities instead of silently creating a second source of truth.
4. Preserve existing conventions when they are structurally safe. Never rename, renumber, delete, close, or rewrite
   existing issues merely to impose Issuer defaults.
5. Read [issue-contract.md](references/issue-contract.md) before issuing, publishing, repairing, or auditing files.

## Preserve complete scope

Build a scope ledger from the entire accepted conversation and every relevant artifact before decomposing. Record each
in-scope requirement, journey, workflow, rule, constraint, phase deliverable, explicit request, and source identifier.
Normalize duplicate or overlapping rows first; cite every source row covered by one outcome instead of issuing duplicate
work.

1. Honor an explicit user or repository boundary such as a release, phase, package, or issue-count cap. Otherwise treat
   all accepted scope in the conversation as in scope.
2. Emit every accepted implementation outcome. Never infer a limit from one to three journeys, a fresh context window,
   a token budget, a writer count, or the size of the current queue. A journey is a coverage view, not an issue-count
   limit; one journey may produce many issues and one inseparable issue may cover several journeys.
3. If the graph is large, partition it into named batches while retaining every batch and stable IDs. Materialize all
   batches at the resolved destination and summarize counts in chat; continue across turns only when the destination
   itself cannot hold the output. Never silently stop after a small number of issues because the response is long.
4. Before writing or publishing, reconcile every ledger row to one or more issue `Source` entries, an explicit
   out-of-scope decision, or a specific unresolved-authority/external disposition. Do not finish with an unmapped
   accepted row.

Classify every material input as one of:

- accepted fact or decision — implementation may rely on it;
- reversible working assumption — implementation may rely on it only when the assumption is explicit and cheap to
  reverse;
- blocking decision, missing authority, or external fact — implementation must not rely on it.

Default to AFK-only output. Batch critical blocking choices into one concise user request before issuing dependent work.
Park only unresolved authority/external work or scope the user explicitly deferred. Do not park accepted work merely
because the graph is large. Create HITL records only when explicitly requested, keep them outside an Orchestrator AFK
issue root, and never label them ready for an agent.

## Slice executable work

Each issue must deliver one narrow, observable outcome through only the affected boundaries. It must be independently
understandable, implementable, reviewable, integratable, and verifiable.

- Split independent outcomes, unrelated acceptance criteria, alternative implementations, and separable risk.
- Prefer a vertical tracer bullet: cross every layer required by the outcome, but do not manufacture unaffected layers.
- Use one fresh context window as a sizing test for each issue, not as a reason to merge unrelated outcomes or cap the
  number of issues.
- Do not force schema, API, UI, or tests into work that does not need those layers.
- Add preparatory work only when it can land green and is necessary to unlock observable behavior.
- Model wide mechanical changes as expand → bounded migrations → contract. Keep the old form valid until every migration
  lands; make contract depend on all migrations.
- Add dependency `A → B` only when B cannot be accepted or integrated before A. Shared subject matter is not a blocker.
- Order identifiers topologically so every blocker has a lower identifier. Reject cycles and AFK dependencies on HITL.
- State non-goals or boundaries when an adjacent behavior is likely to be absorbed accidentally.
- Preserve source requirement, scenario, decision, or finding identifiers instead of rewriting their meaning.

Write acceptance criteria as observable outcomes, not implementation steps. Give every criterion a proportionate proof
seam. Include exact repository-native commands only when discovered and stable; otherwise state the manual or public
evidence contract. Mention likely files only when a path or boundary is itself authoritative.

## Materialize and validate

For the local default:

1. Write one issue per file under `issues/` using `0000-kebab-case-title.md`.
2. Allocate `max(existing numeric ID) + 1`, padded to four digits. Never recycle or renumber an ID.
3. Start from [issue-template.md](assets/issue-template.md), removing irrelevant optional sections.
4. Keep indexes and other Markdown outside the issue root because queue consumers may parse every `.md` as an issue.
5. Validate before handoff:

   ```sh
   python3 <issuer-skill-dir>/scripts/validate_issues.py <issues-root>
   ```

The validator is unlimited by default. Pass `--max-active N` only when an explicit queue cap is part of the request or
repository policy; pass `--max-active 0` to state that unlimited behavior deliberately. Use `--allow-hitl` only for a
non-Orchestrator mixed queue. Scheduling capacity belongs to Orchestrator.

For a real tracker, validate the same canonical bodies in an untracked temporary directory before publishing. Create all
issues first, then attach parent and blocking relationships in a second pass so retries can reconcile stable Issuer IDs.
Apply an AFK-ready label only after validation. Never close or modify a parent unless the user explicitly requests it.

## Close the completion ledger

Do not report completion from the issue count alone. Assign every normalized scope-ledger row exactly one terminal
disposition:

- `FULLY_ISSUED` — every accepted implementation outcome for the row is present, linked, and validated;
- `COVERED_BY` — the row is a duplicate or overlap and names the Issuer issue that fully covers it;
- `PARTIALLY_ISSUED` — safe independent work was issued, but a remainder is waiting on a decision, authority, or
  external evidence;
- `BLOCKED` — no safe implementation issue can be emitted until the named authority or external fact is supplied;
- `PARKED` — explicitly deferred or out of scope by the user or repository boundary.

`PARTIALLY_ISSUED`, `BLOCKED`, and `PARKED` are incomplete and must never be described as fully issued. For each
incomplete row, show the source ID and outcome, disposition, issued issue IDs (or `none`), the exact reason, the
specific missing input or authority, two to four concrete options with their trade-offs, one `Recommended pattern`
with a short rationale, and what will be issued or changed after the user chooses. Include dependent issue IDs when
known. Do not ask for generic “more detail”; ask for the smallest decision or evidence that unblocks the row.

Recommend a reversible, least-risk option that follows existing repository conventions. If authority is genuinely
required, say `No safe recommendation; authority required` rather than inventing policy. Batch related choices into one
request, but keep independent decisions separate. When no rows are incomplete, state `Incomplete: none` explicitly.

Use this compact report (full issue bodies remain at the destination):

```text
## Completion ledger
| Source | Disposition | Issues | Why / missing input | Recommended pattern |
| ... | ... | ... | ... | ... |

## User decisions needed
1. <source>: <option A>; <option B>; <option C>. Recommended: <option> — <rationale>.
```

On a follow-up, preserve source and Issuer IDs and resume only unresolved rows; do not regenerate already-issued work.

## Finish

Report the complete scope count, fully issued count, incomplete completion ledger, source-coverage reconciliation,
destination, ready frontier, validation result, and any genuine authority blocker. In Audit mode, distinguish formatting
incompatibility from semantic unreadiness. Commit only when requested.

## Compose with adjacent skills

- Use `build-product-artifacts` upstream when product truth, vocabulary, journeys, or decisions are incomplete. Preserve
  its accepted artifact identifiers in each issue's `Source`; do not recreate product discovery in Issuer.
- Retain the vertical tracer-bullet and expand–contract ideas from `to-issues` and `to-tickets`, but do not inherit
  their mandatory granularity quiz, single `tickets.md` local output, or tracker-only assumption.
- Give Orchestrator a flat local AFK issue root. Let Orchestrator select the dependency-ready frontier, lease resources,
  and manage runtime state; Issuer must not pre-truncate the graph to match writer capacity.
- Use `wayfinder` for unresolved discovery and fog-of-war. Issuer may record that work as parked, but only after
  distinguishing it from accepted, issueable scope.
