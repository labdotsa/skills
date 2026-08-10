# Review Gates

## Purpose

Use gates to prevent downstream artifacts from inventing missing upstream behavior. A gate may pass with explicit open
questions, but not with concealed contradictions.

## Gate 1 — Brief fidelity

- Every material actor, offering, workflow, rule, phase, constraint, and uncertainty from the brief is represented.
- Stakeholder wording is preserved or mapped in the glossary.
- Facts, assumptions, decisions, and questions are distinguishable.

Recommended reviewers: product lead and originating stakeholder.

## Gate 2 — Domain coherence

- Actors have clear permissions and organizational relationships.
- Concepts that vary independently are modeled separately.
- Transaction types and lifecycle states are unambiguous.
- Mutable admin policy and transaction snapshots are distinguished.
- Taxonomies avoid duplicating category, service, outcome, add-on, and package concepts.

Recommended reviewers: product, operations, and engineering.

## Gate 3 — Journey completeness

- Every major actor and transaction has a main journey.
- Preconditions, alternative flows, failures, recovery, notifications, and completion exist.
- Money, schedule, revisions, disputes, and operational intervention are explicit where applicable.
- Journey actions map to valid state transitions.

Recommended reviewers: product, operations, support, and finance when money is involved.

## Gate 4 — Scope and requirements

- Requirements derive from accepted domain behavior and journeys.
- IDs are stable and unique.
- MVP inclusions and exclusions are explicit.
- Later phases do not leak into current commitments.
- Non-functional requirements cover security, privacy, accessibility, performance, observability, and recovery in
  proportion to risk.

Recommended reviewers: product and engineering leads.

## Gate 5 — Experience traceability

- Every journey step has a screen, system action, notification, or explicit off-platform owner.
- Every screen has purpose, actor, data, actions, permissions, and async states.
- Screens map to routes and owning applications.
- Empty, loading, ready, refreshing, and error are not conflated.
- Locale, RTL, accessibility, and responsive behavior are considered.

Recommended reviewers: product, design, and frontend engineering.

## Gate 6 — Architecture traceability

- Every deployable and shared package has one clear responsibility.
- Screens call explicit APIs; APIs map to domain capabilities.
- Authentication authority, authorization, private data, secrets, and vendor boundaries are explicit.
- Jobs, webhooks, retries, idempotency, and reconciliation cover asynchronous and financial behavior.
- Deployment topology can build each application with its transitive dependencies.
- Current primary sources support unstable technology assertions.

Recommended reviewers: engineering, security, platform, and operations.

## Gate 7 — Release integrity

- Artifact index and internal links resolve.
- Decision statuses and IDs are valid.
- No placeholders remain in release-quality artifacts.
- Searches find no obsolete terms from recent changes.
- Runnable artifacts pass their checks/builds.
- Diff scope contains no unrelated user work.

Only commit after the user requests it.
