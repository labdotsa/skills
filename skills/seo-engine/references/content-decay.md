# Content decay diagnosis

Use when organic clicks, impressions, rankings, or conversions fall for existing URLs and the
cause is not yet established. The shared SEO engine owns scope, permissions, evidence ledger,
confidence, and output naming. This reference owns per-URL diagnosis.

## Trigger and inputs

Require a domain, URL set or folder, business goal, comparison windows, and a materiality rule
chosen for that site. Prefer Search Console clicks, impressions, CTR, and position; ranking data;
indexation inspection; backlink and internal-link history; query demand; current SERP captures;
and page content. Use exports or manual checks when connectors are unavailable. Label vendor
estimates and sampled rankings as estimates.

## Procedure

1. Freeze the URL set, windows, locale, device, and data cutoff. Normalize URLs before joins.
2. Calculate absolute click change, percent change, impression change, CTR change, and position
   change for every URL. A missing value stays unknown; it is never treated as zero.
3. Keep URLs that pass the agreed materiality rule. Record excluded rows as `not_applicable` with
   the rule and values used.
4. For each surviving URL, check status, indexability, robots, canonical, and sitemap state first.
   If a direct defect explains the loss, record it and still mark every other URL for its own check.
5. Compare query coverage, demand trend, competitor movement, and SERP features. Separate demand
   loss, ranking loss, CTR loss, and feature displacement.
6. Compare referring domains and internal links across comparable snapshots. Confirm whether a
   same-domain URL now serves the affected queries.
7. Read the current page and representative results. Identify concrete freshness, coverage,
   intent, or format gaps. Do not infer page quality from metadata alone.
8. Assign one primary cause, any secondary cause, confidence, primary action, fallback action,
   and the check that would change the decision. Use `blocked` when a required source is missing.

## Output fields

Return one row per URL with: `url`, `status`, `clicks_before`, `clicks_after`, `click_delta`,
`http_status`, `impressions_delta`, `ctr_delta`, `position_delta`, `primary_cause`, `secondary_cause`,
`evidence_ids`, `action`, `fallback`, `confidence`, `owner`, and `next_check`.

Valid row statuses are `checked`, `blocked`, `deferred`, or `not_applicable`. Include the materiality
rule, windows, unavailable data, and a short summary of causes. A recommendation to do nothing is
valid when demand declined or evidence does not support a recoverable issue.

## Evidence and fallback limits

Prefer first-party performance and inspection data for diagnosis. Use ranking, backlink, SERP, and
AI visibility providers to explain changes, not to replace first-party outcomes. If a URL has only
one usable signal, keep the cause provisional. If query-level data is unavailable, report the
missing dimension and avoid cannibalization or CTR conclusions. If rendered content is unavailable,
do not prescribe section-level edits.
Record the evidence cutoff and source owner for every checked row. Preserve contradictory signals
in the row instead of averaging them away. Keep any proposed content change separate from the
diagnosis until its cause is supported.

## Acceptance

The run passes when every material URL has an explicit status, every checked row names evidence
for its cause, technical checks precede content recommendations, and actions do not claim ranking
outcomes. Re-run the same metrics and checks after an approved change; compare implementation
state separately from traffic outcomes.

## Failure and limits

Stop diagnosis for a URL when its required data cannot be obtained, mark it `blocked`, and name the
smallest resolving request. Do not call a sampled ranking change causal without corroboration. Do
not use a fixed click, percentage, freshness, or position threshold across sites. Keep seasonality,
CTR, demand, ranking, and technical explanations separate when signals conflict.
