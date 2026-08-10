---
name: build-product-artifacts
description: Turn rough product ideas, workshop notes, stakeholder conversations, or evolving product briefs into structured, atomized, and traceable product artifacts. Use when Codex needs to bootstrap or expand product documentation covering vision, phases, vocabulary, actors, domain models, taxonomies, journeys, workflows, business rules, platform capabilities, requirements, delivery scope, information architecture, screens, routes, technical architecture, integrations, assumptions, open questions, and decisions; update an existing artifact system after product or technical decisions change; audit artifacts for gaps and contradictions; or report the current product definition without changing it.
metadata:
  author: labdotsa
  category: product
---

# Build Product Artifacts

Convert incomplete product context into a durable source of truth. Preserve the difference between stakeholder facts,
agent assumptions, unresolved questions, and accepted decisions while keeping all affected artifacts synchronized.

## Select the operating mode

Classify the request before acting:

- **Bootstrap** — no coherent artifact system exists; create it sequentially from the brief.
- **Expand** — the foundation exists but an artifact layer such as journeys, screens, requirements, or architecture is missing.
- **Update** — a new fact or decision changes existing artifacts; perform impact analysis and update every affected owner.
- **Audit** — inspect completeness, consistency, or current state without writing unless the user also asks for changes.

Treat requests to explain, review, list, or report as Audit. Do not infer authorization to edit or commit from them.

## Establish context

1. Inspect repository instructions, the artifact index, existing decision records, and worktree status.
2. Use `rg` and `rg --files` to find current terminology, IDs, routes, vendors, phases, and references.
3. Preserve unrelated or concurrent changes. Never replace a user's artifact merely to impose this skill's default structure.
4. Read [classification-rules.md](references/classification-rules.md) before Bootstrap, Expand, or Update.
5. Read [artifact-map.md](references/artifact-map.md) for Bootstrap or when deciding which layer is missing.
6. Read [impact-mapping.md](references/impact-mapping.md) for every Update.
7. Read [review-gates.md](references/review-gates.md) before completing Bootstrap or a substantial Expand.
8. Read [artifact-writing-standards.md](references/artifact-writing-standards.md) before creating new artifact files.

Use available specialist skills for product design, information architecture, domain modeling, data, security, or a
selected technology when their trigger applies. Verify temporally unstable vendor and technology claims against current
primary documentation. Keep product facts independent from implementation choices.

## Build in dependency order

For Bootstrap, proceed in this order. For Expand, begin at the earliest missing prerequisite and reuse accepted work.

1. **Capture and classify** — extract actors, outcomes, offerings, workflows, rules, phases, constraints, uncertainties,
   and explicit technology choices. Build an internal fact/assumption/question/decision ledger.
2. **Normalize vocabulary** — establish canonical terms and identify overloaded concepts before modeling them.
3. **Establish product foundation** — define vision, boundaries, phases, principles, and glossary.
4. **Model the domain** — define actors, permissions, entities, relationships, taxonomies, configurable policies, and
   lifecycle states. Separate concepts that vary independently.
5. **Describe journeys** — create one journey per major actor and transaction type, including preconditions, main flow,
   alternatives, failures, state transitions, notifications, operational intervention, and completion.
6. **Extract platform capabilities** — identify shared authentication, payments, files, notifications, moderation,
   configuration, audit, trust, safety, and dispute responsibilities.
7. **Write requirements and delivery scope** — derive stable requirements from the domain and journeys; define explicit
   phase inclusions, exclusions, dependencies, and exit criteria.
8. **Design experience architecture** — map journeys to information architecture, screen inventory, screen contracts,
   navigation, routes, permissions, and loading/empty/ready/error states.
9. **Define technical architecture** — only after product behavior is stable enough; document deployables, packages,
   API, data, authentication authority, storage, background work, integrations, deployment, and security boundaries.
10. **Record decisions** — capture cross-cutting accepted, proposed, rejected, and superseded decisions with rationale,
    owner, date, and affected artifacts. Keep unresolved matters in open questions.
11. **Index and cross-link** — make the artifact root explain product shape, artifact ownership, and document conventions.

Do not manufacture false completeness. A rough future phase should remain an outline with visible assumptions and open
questions rather than receiving invented precision.

## Update existing artifacts

For Update mode:

1. State the new fact or decision in canonical terms.
2. Locate its owning artifact and record it in the decision log when it affects more than one concern.
3. Build an impact set using [impact-mapping.md](references/impact-mapping.md).
4. Search the full artifact tree for the old term, rule, vendor, boundary, status, or count.
5. Update owners first, then derived journeys, screens, routes, requirements, architecture, integrations, and indexes.
6. Preserve historical decisions; mark them superseded instead of deleting them.
7. Search again for stale references and contradictions.
8. Report what changed, what did not need to change, and any remaining open decision.

Never treat an amended document as sufficient evidence that all downstream artifacts are synchronized.

## Write atomized artifacts

- Give each file one primary concern and clear ownership.
- Prefer cohesive prose, tables, state diagrams, and concise lists over a single giant specification.
- Use stable, language-neutral identifiers for requirements and decisions.
- Cross-link source and derived artifacts instead of duplicating long definitions.
- Keep business rules configurable when the brief says operations/admin can change them.
- Snapshot mutable policies on transactions when later changes must not rewrite an existing agreement.
- Describe user-visible async states for every data-backed screen or meaningful section.
- Avoid presenting vendor recommendations as confirmed until stakeholders accept them.

Use the files under `assets/artifact-templates/` as starting structures, not mandatory filler. Remove irrelevant sections
rather than leaving empty headings.

## Validate before completion

1. Check semantic alignment using the appropriate gate in [review-gates.md](references/review-gates.md).
2. Run the deterministic validator from the directory containing this SKILL.md:

   ```sh
   python3 scripts/validate_artifacts.py <artifact-root>
   ```

   Add `--fail-placeholders` for a release-quality artifact set.
3. Run project-specific checks for runnable artifacts, schemas, generated clients, or diagrams.
4. Review `git diff --check`, changed-file scope, and worktree status.
5. Commit or amend only when the user explicitly requests it.

Lead the final response with the achieved artifact outcome. Mention validation, material assumptions, remaining open
questions, and the commit identifier when applicable.
