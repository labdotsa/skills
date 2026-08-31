# Issuer issue contract

Read before creating, publishing, repairing, or auditing an issue queue.

## Canonical local representation

The default issue root is `issues/`. Keep it flat and place exactly one issue in each Markdown file:

```text
issues/
  0000-first-observable-outcome.md
  0001-next-observable-outcome.md
```

Use lowercase kebab-case after a four-digit, monotonically allocated ID. Start a new queue at `0000`; otherwise allocate
the maximum existing numeric ID plus one. Do not infer the next ID from file count, fill gaps, or renumber history.

Do not place `README.md`, indexes, decision records, drafts, or supporting artifacts inside an Orchestrator issue root.
Some consumers recursively treat every Markdown file as executable work and key state by filename stem.

Completeness is not an issue-count target. Before materializing, reconcile every accepted source row to one or more
`Source` sections or to an explicit out-of-scope, deferred-authority, or external-evidence disposition. Never silently
drop accepted scope because the graph is large; partition it into named batches or continue with stable IDs.

## Completion ledger

The final handoff must assign every normalized source row one terminal disposition. A complete graph claim is valid only
when no accepted row is unmapped and every row is one of:

| Disposition | Use |
| --- | --- |
| `FULLY_ISSUED` | All accepted implementation outcomes for the row are emitted and validated. |
| `COVERED_BY` | A duplicate or overlapping row is fully covered by the named issue ID. |
| `PARTIALLY_ISSUED` | Safe independent work is emitted, but a remainder is unresolved. |
| `BLOCKED` | No safe issue can be emitted until a named authority, input, or external fact exists. |
| `PARKED` | The user or repository explicitly deferred or excluded the row. |

The handoff report must call out `PARTIALLY_ISSUED`, `BLOCKED`, and `PARKED` as incomplete. For each such row include:
source ID and outcome, disposition, issued issue IDs (or `none`), exact reason, smallest missing user input/authority/
evidence, two to four concrete options and trade-offs, one explicitly labeled recommended pattern and rationale, and the
resulting issue or scope change after selection. Include dependent issue IDs when known. Never invent an authority; use
`No safe recommendation; authority required` when appropriate. If none are incomplete, write `Incomplete: none`.

The compact report may stay in the handoff response. If persisted, keep it outside the Orchestrator issue root (for
example `.issuer/coverage/<run-id>.md`), because queue consumers parse every Markdown file in that root as executable
work. Preserve source and Issuer IDs so a later run resumes unresolved rows without duplicating issued work.

## Required Markdown shape

Every local issue contains:

1. one H1 title;
2. exact scalar fields `Status`, `Type`, and `Priority`;
3. `## Source` with accepted authority or traceable requirement/scenario/finding IDs;
4. `## What to build` describing one end-to-end outcome;
5. `## Acceptance criteria` with unchecked task-list items;
6. `## Verification` with observable proof;
7. `## Blocked by` with relative Markdown links or the exact no-blocker sentence.

Canonical scalar values:

| Field | Values | Meaning |
| --- | --- | --- |
| `Status` | `Todo`, `Done` | Durable queue state; runtime orchestration state remains external |
| `Type` | `AFK`, `HITL` | Whether implementation can complete without live human authority |
| `Priority` | `P0`, `P1`, `P2`, `P3` | Release impact, not creation order |

Use `Status: Todo` for newly ready work. Keep blocked, split, superseded, and parked planning records outside an
Orchestrator issue root: its Markdown parser treats every non-Done AFK file as executable work. Orchestrator queues
should contain AFK issues only.

Dependency links use the exact file target:

```markdown
## Blocked by

- [Define the canonical policy](./0000-define-the-canonical-policy.md)
```

For a root issue:

```markdown
## Blocked by

None — can start immediately.
```

Plain titles, numeric prose, remote URLs, ranges, and umbrella references are not executable local edges. Assign IDs in
topological order, require each blocker to exist, and reject cycles, self-dependencies, forward edges, and AFK work that
depends on HITL authority.

## Acceptance and verification

An issue is ready only when every criterion:

- names observable public, user, operational, data, or contract behavior;
- has one unambiguous pass condition;
- traces to accepted source authority;
- can be proven in the available repository/environment;
- does not conceal an unresolved product, UX, API, security, data, or lifecycle choice.

Verification may name focused tests, type/static checks, build or boot checks, migration drift/rehearsal, browser evidence,
or manual observation according to risk. A source test alone cannot prove deployed, migration, route, or user-journey
behavior. Evidence requiring an unavailable human or external authority makes a ticket HITL or waiting unless an
authorized fixture supplies the same proof.

## Sizing test

Keep one issue when its changes are inseparable from one observable outcome. Split when any of these can be accepted,
integrated, reverted, or deferred independently:

- separate user outcomes or journeys;
- unrelated acceptance criteria;
- distinct public contracts;
- multiple migrations that can preserve compatibility through expand–contract;
- independent packages or blast-radius batches;
- optional polish, cleanup, analytics, documentation, or later-phase behavior.

Do not split solely by technical layer. Do not keep a broad issue merely because all work shares a feature name.

## Remote publication

Repository tracker instructions override generic API mechanics. Preserve the canonical Issuer ID in each remote body so a
retry can find and reconcile an existing issue rather than create a duplicate.

Publish transactionally where the tracker permits:

1. validate every canonical body and the complete DAG;
2. search for existing open or closed issues with the same Issuer ID and source identity;
3. create only missing issues without dependency edges;
4. attach every issue to its parent when applicable;
5. wire native blocking relationships in a second pass;
6. apply `ready-for-agent` or its configured equivalent only to validated AFK issues;
7. verify the remote graph and report partial publication precisely.

Do not silently overwrite edited remote issues during reconciliation. Stop when identity conflicts or partially completed
external mutations require authority.
