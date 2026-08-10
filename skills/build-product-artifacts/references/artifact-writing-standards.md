# Artifact Writing Standards

## Ownership and structure

- Give every artifact one primary concern and an identifiable reviewer.
- Lead with the product outcome or decision, then supporting detail.
- Use headings that answer a reader's navigation question.
- Prefer tables for mappings and comparisons, diagrams for lifecycle/sequence, and prose for rationale.
- Link to canonical definitions rather than duplicating them.
- Keep exploratory visual work clearly separate from accepted production design.

## Traceability

- Use stable requirement IDs such as `CAT-001`, `BOOK-001`, or established project prefixes.
- Use monotonically increasing decision IDs such as `D-001`.
- Never recycle an identifier after deletion or supersession.
- Record source, status, rationale, owner, and affected artifacts for cross-cutting decisions.
- Preserve superseded decisions as history and point to their replacement.

## Product language

- Use the glossary's canonical term consistently.
- Separate actor, organization, role, permission, and resource relationship.
- Separate product/service type, category/use case, deliverable/outcome, add-on, and package when they vary independently.
- Describe observable behavior rather than implementation in functional requirements.
- Give policies units and boundary semantics: calendar versus business days, timezone, inclusive/exclusive deadline,
  rounding, grace periods, and precedence.

## Journeys

Include:

- actor, goal, trigger, and preconditions;
- numbered main flow;
- alternate and failure flows;
- state transitions and commitments;
- notifications and deadlines;
- operational intervention;
- completion and postconditions;
- linked requirements and open questions where useful.

## Screens

Include:

- actor and purpose;
- route/entry and permission conditions;
- authoritative information displayed;
- primary and secondary actions;
- loading, empty, ready, refreshing, error, and permission-denied behavior as applicable;
- responsive, accessibility, locale, and RTL considerations;
- related APIs without embedding vendor SDK behavior.

## Architecture and integrations

- Separate accepted selection, proposed baseline, and unresolved verification.
- Identify system of record and authority for identity, money, files, and business state.
- Keep vendor SDKs behind adapters and define webhook/retry/idempotency behavior.
- Document public/private data flow, credentials, retention, and failure recovery.
- Cite current primary documentation close to temporally unstable claims.
- Do not prescribe distributed infrastructure without a product or operational need.

## Formatting

- Use repository-relative Markdown links inside artifacts.
- Keep code fences balanced and name their language when known.
- Avoid excessive emphasis and ornamental sections.
- Wrap dense tables only when the repository formatter supports it; preserve readable source.
- Remove empty template headings and TODO markers before release.
