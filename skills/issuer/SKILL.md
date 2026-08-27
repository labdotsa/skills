---
name: issuer
description: Compile accepted plans, specifications, product artifacts, or confirmed findings into a bounded dependency graph of independently implementable issues. Use when Codex needs to create implementation issues or tickets, prepare an AFK backlog, slice work for Orchestrator, publish issues to a configured tracker, or audit an issue queue for implementation readiness; do not use for open-ended discovery or ordinary single-change implementation.
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

## Gate the input

Select one accepted release slice before decomposition. Prefer one to three must-work journeys and no more than ten
new active AFK issues. Park later scope instead of compiling the whole product backlog.

Classify every material input as one of:

- accepted fact or decision — implementation may rely on it;
- reversible working assumption — implementation may rely on it only when the assumption is explicit and cheap to
  reverse;
- blocking decision, missing authority, or external fact — implementation must not rely on it.

Default to AFK-only output. Batch critical blocking choices into one concise user request before issuing dependent work.
Keep noncritical unresolved work parked. Create HITL records only when explicitly requested, keep them outside an
Orchestrator AFK issue root, and never label them ready for an agent.

## Slice executable work

Each issue must deliver one narrow, observable outcome through only the affected boundaries. It must be independently
understandable, implementable, reviewable, integratable, and verifiable.

- Split independent outcomes, unrelated acceptance criteria, alternative implementations, and separable risk.
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

Use `--max-active 0` only when repository policy deliberately disables the default active-queue cap. Use `--allow-hitl`
only for a non-Orchestrator mixed queue.

For a real tracker, validate the same canonical bodies in an untracked temporary directory before publishing. Create all
issues first, then attach parent and blocking relationships in a second pass so retries can reconcile stable Issuer IDs.
Apply an AFK-ready label only after validation. Never close or modify a parent unless the user explicitly requests it.

## Finish

Report the issued or audited slice, destination, ready frontier, parked scope, validation result, and any genuine authority
blocker. In Audit mode, distinguish formatting incompatibility from semantic unreadiness. Commit only when requested.
