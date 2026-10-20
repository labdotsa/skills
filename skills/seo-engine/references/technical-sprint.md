# Technical SEO sprint triage

Use when a current crawl or site-audit export needs to become a small, developer-ready backlog.
The shared SEO engine owns context, permissions, evidence, confidence, and output naming. This
reference owns deduplication, value ranking, and acceptance checks.

## Trigger and inputs

Require a crawl or audit export with date, scope, settings, and affected URLs, plus sprint
capacity and the business goal. Prefer Search Console or analytics value by URL, ranking data,
indexation inspection, and live rendered checks. If no crawl exists, mark the workflow `blocked`
and request a crawl or a complete equivalent export. Do not treat an audit score as a diagnosis.

## Procedure

1. Freeze crawl date, URL scope, rendering mode, filters, and sprint capacity. Normalize URLs and
   retain the original issue rows for traceability.
2. Group reported issues by shared path pattern, template, generation source, rendering path, or
   upstream directive. Keep genuinely page-level issues separate.
3. Join each group to clicks, impressions, conversions where available, ranking value, and URL
   count. Missing metrics remain unknown; issue count is not value.
4. Classify the work as `template`, `page`, `configuration`, `infrastructure`, or
   `investigative`. Record the owner role and dependencies.
5. Verify representative high-value URLs through the live rendered page, headers, status, links,
   and structured data. Mark false positives or intentional behavior as `not_applicable`.
6. Rank within the stated capacity using site-calibrated impact, effort, confidence, reach, and
   dependency. Do not use universal weights or vendor priority labels without explanation.
7. Select the smallest coherent sprint. Keep an excluded list with the reason and defer work that
   needs a separate investigation.
8. Write acceptance criteria with scope, expected state, and verification method. Do not apply
   code, robots, canonical, redirect, sitemap, or CMS changes automatically.

## Output fields

Return one row per root-cause group with: `group_id`, `status`, `issue_ids`, `url_scope`,
`affected_count`, `value_evidence`, `root_cause`, `fix_type`, `impact`, `effort`, `confidence`,
`owner`, `dependencies`, `recommended_fix`, `acceptance`, and `verification`.

Use `checked`, `blocked`, `deferred`, or `not_applicable`. Include crawl comparability, missing
data, excluded findings, sprint capacity, and dependency order. Output ticket-ready Markdown when
no issue tracker is authorized.

## Evidence and fallback limits

Use the crawl as a snapshot, not proof of current production state. If traffic or conversion joins
are incomplete, rank by the evidence that exists and disclose the gap. If live verification is
blocked, keep the issue `deferred` or `blocked` rather than upgrading crawler output to fact. A
vendor's generic severity is context, never the site's priority. Investigative work is a valid
backlog item when the next deliverable is an answer.
Record the sample URLs and verification method for each group. Preserve intentional findings with
their rationale. Do not expand a selected fix to every URL until its template or directive scope
is confirmed.

## Acceptance

The sprint passes when each selected item maps multiple symptoms to one supported cause, includes
at least one live verification, names an accountable owner, fits declared capacity, and has an
observable acceptance test. A ranking change is a later outcome measure, not implementation
acceptance.

## Failure and limits

If crawl scope, age, rendering, or authentication is unknown, mark affected groups `blocked` or
`deferred`; do not claim completeness. If a group cannot be tied to a mechanism, classify it as
`investigative`. Crawler rendering can mimic missing content, links, or schema, so verify before
escalating. Never infer revenue from traffic alone.
