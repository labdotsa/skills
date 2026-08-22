---
name: public-pages
description: Designs, builds, audits, improves, releases, and operates trustworthy public website pages as one evidence-driven lifecycle spanning copy, information architecture, accessibility, frontend delivery, search, privacy, measurement, and maintenance. Use when creating or reviewing homepages, landing pages, product or feature pages, pricing, about, contact, signup, public documentation, campaign pages, or an entire public-page portfolio.
metadata:
  author: labdotsa
  category: growth
---

# Public Pages

Help a specific visitor make a specific decision with the least avoidable uncertainty. Treat copy, design, implementation, discovery, measurement, and operations as one system.

## Hard rules

1. Start from visitor intent and decision evidence, not a fashionable page template.
2. Keep claims truthful, scoped, attributable, qualified, owned, and reviewable.
3. Preserve meaningful initial HTML, accessible interaction, responsive behavior, failure recovery, and legitimate alternative routes.
4. Put price, commitment, privacy, compatibility, and other material terms where the decision is made.
5. Distinguish standards and observations from inference. Never claim that a live-page pattern caused conversion without causal evidence.
6. Treat automated checks as evidence, not proof of accessibility, comprehension, factual accuracy, legal compliance, or business impact.
7. Finish every material change with the audit loop and turn failures into owned corrective work.

## Route the task

Read each selected reference completely before acting.

| Request | Required references |
|---|---|
| Define, create, rewrite, or redesign a page | [page-models.md](references/page-models.md), then the relevant parts of [quality-system.md](references/quality-system.md) |
| Implement or review frontend delivery | [quality-system.md](references/quality-system.md) and [release-and-operations.md](references/release-and-operations.md) |
| Audit one page, flow, template, or site | [audit.md](references/audit.md), [page-models.md](references/page-models.md), and the affected quality sections |
| Plan a release, migration, campaign, or page portfolio | [release-and-operations.md](references/release-and-operations.md) and [audit.md](references/audit.md) |
| Make a consequential claim or cite a benchmark | [evidence.md](references/evidence.md) |
| Study transferable patterns from public sites | [examples.md](references/examples.md) and [evidence.md](references/evidence.md) |

For narrowly scoped work, load only the relevant quality sections. For a complete page or audit, load all five references.

## Closed-loop workflow

1. **Discover** — identify the page family, primary visitor, context, intent, source message, existing evidence, constraints, and current outcomes.
2. **Brief** — define promise, proof, objections, primary action, legitimate alternatives, material terms, success measures, harm guardrails, owner, and review trigger.
3. **Structure** — establish the semantic outline and scan path: orient → demonstrate → substantiate → resolve → act or recover. Adapt the sequence to the visitor's actual entry intent.
4. **Create** — write, design, and implement the complete experience using real content, evidence, states, and constraints.
5. **Verify** — test content, functionality, accessibility, responsive behavior, browser resilience, performance, search behavior, privacy, security, analytics, localization, and downstream delivery.
6. **Audit** — collect evidence, identify root causes, grade severity and confidence, and test the page against its brief and page-family contract.
7. **Prioritize** — stop harm first, establish missing system controls second, improve decision quality third, and optimize only after the foundations hold.
8. **Improve** — make the smallest coherent correction that resolves the diagnosed cause without shifting harm elsewhere.
9. **Re-verify** — rerun affected checks and critical journeys; record remaining risk, manual evidence, and assumptions.
10. **Operate** — monitor outcomes and guardrails, review mutable claims, maintain integrations and locales, and intentionally keep, improve, merge, redirect, or retire the page.

Repeat steps 6–10 while the page remains live.

## Output contract

Lead with the decision or delivered outcome. State the page job and audience, evidence used, important assumptions, and material risks. For implementation, identify changed files and verification performed. For an audit, use the finding and backlog contracts in `references/audit.md`; never return an unprioritized checklist dump.

