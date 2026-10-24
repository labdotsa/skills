---
name: usability-audit
description: Evidence-bound heuristic usability review of journeys, screens, and interaction states with annotated findings. Use when auditing a prototype or interface for usability problems, mapping findings to UX heuristics, or requesting screen-level callouts. Distinct from functional acceptance, UI implementation, source deconstruction, conversion-cause research, and formal accessibility certification.
license: MIT
metadata:
  author: labdotsa
  category: design
  status: stable
---

# Usability audit

Review a rendered experience against user tasks and transferable usability principles. Produce findings that another person can locate, understand, fix, and retest. Treat principles as inspection lenses and rendered evidence as the basis for claims.

## Load the foundation

Read [ux-foundations.md](references/ux-foundations.md) for every target, including web, Android, desktop, voice, TV, wearable, kiosk, and spatial surfaces. HIG is an essential lens everywhere. Apply its principles as transferable questions, then use current target-native guidance for controls and behavior. Read [observation-and-annotations.md](references/observation-and-annotations.md) before collecting evidence or creating callouts.

Use current WCAG and WAI-ARIA Authoring Practices Guide for applicable web semantics and widgets. Do not treat any source, automated check, or a clean audit as proof of usability, accessibility conformance, or product success.

## Hold the boundary

- Audit the experience and report evidence. Do not edit source, submit consequential actions, or change live data unless explicitly authorized.
- Keep functional acceptance, visual implementation, source-to-component reconstruction, and conversion-cause investigation separate. When available, the companion workflows are `validate-prototype`, `ux-ui-system-refactor`, `deconstruct`, and `product-diagnosis`. This audit works without them.
- Do not force one violation per screen. A screen can have no supported finding, and one finding can span a sequence or state transition.
- Treat source-level causes as unknown from visuals. Label them suspected or confirmed only after authorized investigation supports that claim.
- Report audit status as `complete`, `partial`, or `blocked`; report coverage as `reviewed`, `not-reviewed`, or `unavailable`.

## Run the audit

1. Resolve audience, task, success condition, scope, target, locale, viewport, role, input mode, available states, and evidence limits. Record unknowns.
2. Observe the rendered interface first using the authorized built-in browser, supplied screenshots or recordings, or another explicitly allowed surface. Freeze the observed state before inspecting source.
3. Trace the critical journey and state changes. Record what is visible, operable, announced, interrupted, cancelled, recoverable, and missing. Do not claim behavior from a single still image.
4. For each supported finding, state the symptom and user consequence, map it to the applicable heuristic or source principle, identify the exact element or region (or missing element), and attach a screenshot ID/digest, coordinate system, marker bounds, and semantic locator when available.
5. Grade severity and confidence independently. Give a bounded recommendation and an observable retest condition. Preserve competing hypotheses when evidence cannot distinguish them.
6. Annotate supplied screenshots only when exact bounds are known. Use `node scripts/annotate.mjs input.json output.svg` for deterministic overlays. The helper preserves original PNG bytes and records their SHA-256; it never crops, resizes, fetches, or invents pixels.
7. Re-run the same task and state only against a supplied changed build or capture. Compare the retest condition to the original evidence and keep unresolved gaps explicit.

## Finding contract

Use one record per issue. Include:

- `id`, target, task, state, viewport, locale, input mode, and role;
- audit `status` and `coverage`, plus finding `disposition` and evidence limits;
- observed symptom and user consequence;
- heuristic/source and a short reason it applies;
- exact element, region, missing element, or cross-screen sequence;
- screenshot ID and digest, coordinate system, marker bounds, and semantic locator if available;
- severity and confidence as separate values;
- recommendation, owner or handoff, and observable retest condition.

Use severity such as `blocker`, `high`, `medium`, or `low`. Grade task consequence, frequency or exposure, and recoverability. Use confidence such as `high`, `medium`, or `low`, and record its evidence basis. Do not guess marker bounds. If an annotation capability is unavailable, return a `partial` audit with raw evidence and verified bounds when available. Never claim a visual highlight that was not produced.

## Return the report

Lead with scope, task, evidence, status, and the highest-impact findings. Separate observed facts, supported interpretation, and unknowns. Include a compact finding table, annotated artifact paths, retest conditions, and handoffs. State which journeys, screens, states, locales, input modes, and responsive conditions were not reviewed. Do not call the result app acceptance, WCAG conformance, or proof of improved conversion.

Use `complete` only when the agreed audit scope has evidence, every supported finding has the requested callouts and retest condition, and all exclusions are explicit. Use `partial` when useful evidence exists but an agreed state, annotation, or review remains unavailable. Use `blocked` when no authorized evidence can support the requested review. No findings can be a complete result; it does not establish that the interface is problem-free.

Track each coverage unit separately as `reviewed`, `not-reviewed`, or `unavailable`. A finding's `disposition` is `supported`, `hypothesis`, or `rejected`. Keep hypotheses and rejected candidates outside the supported-finding count. Preserve rejected evidence when it prevents a repeated false alarm.

### Resources

- [ux-foundations.md](references/ux-foundations.md): source synthesis and universal HIG lens.
- [observation-and-annotations.md](references/observation-and-annotations.md): evidence, coordinate, and annotation rules.
- [finding.yaml](assets/finding.yaml): machine-readable finding shape.
- [report.md](assets/report.md): report scaffold.
- [cases.yaml](evals/cases.yaml): decision-focused evaluation cases.
