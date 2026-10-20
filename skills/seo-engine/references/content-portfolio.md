# Content portfolio decisions

Use the portfolio helper for initial triage. It is a report-only classifier. Human review must add full content, intent, business, and technical evidence before any destructive action.

## CLI contract

Run from the installed skill root, or resolve the script relative to this reference:

```sh
python3 scripts/portfolio.py snapshot.json --as-of 2026-10-21
```

`--as-of` is required and must be a fixed `YYYY-MM-DD` date. Input contains `pages` and a `thresholds` object with exactly `min_clicks`, `decline_fraction`, `min_impressions`, `stale_days`, and `recent_days`. Values are finite non-negative numbers. `decline_fraction` is greater than zero and at most one. `recent_days` must be less than `stale_days`. Choose thresholds for the site's complete observation windows before running. The example values are synthetic, not SEO recommendations.

Each page requires `url`, `updated_at`, and boolean `protected`. Numeric fields `clicks`, `previous_clicks`, `impressions`, `conversions`, `referring_domains`, and `citation_count` may be absent or `null` for unknown. Optional `equivalent_url`, `equivalent_verified`, and `overlap_verified` fields are validated when present. URLs stay exact and must be absolute HTTP(S); duplicate URLs, malformed records, future dates, invalid booleans, and non-finite numbers fail validation.

Example:

```json
{"thresholds":{"min_clicks":3,"decline_fraction":0.8,"min_impressions":50,"stale_days":90,"recent_days":14},"pages":[{"url":"https://example.com/guide","clicks":2,"previous_clicks":10,"impressions":100,"conversions":0,"referring_domains":0,"citation_count":0,"updated_at":"2025-01-01","protected":false}]}
```

The report preserves each page row, adds `recommendation`, `reasons`, `missing`, `signals`, and `review_required`, and sorts pages by exact URL. Validation errors go to stderr with exit code 2 and produce no partial report.

## Triage and review

The helper emits `keep`, `update`, `consolidate`, `retire`, or `investigate` as initial recommendations. A reviewer can separately propose `redirect`. Missing critical data, protected pages, conversions, referring domains, citations, and uncertain equivalence require review. Recent edits receive an observation hold. Destructive recommendations always set `review_required: true`.

Only use `consolidate` or `redirect` after observed full-content overlap, same search intent, a distinct verified equivalent URL, and a validated destination. Never use a homepage as fallback. If target evidence is absent, use `investigate`. Substantial impressions with low clicks or a material decline usually means `update`, because the page may be recoverable. `retire` is reserved for stale pages with complete evidence and zero clicks, impressions, conversions, referring domains, and citations. Retirement requires review of legal, strategic, user, backlink, citation, and conversion value. Nuanced decisions require content and intent evidence beyond this initial metrics report.

## Human review record

For each candidate, inspect the current page, query intent, template, canonical, status, inbound links, sitemap role, conversions, backlinks, citations, legal commitments, and recent release history. Record whether the page has unique facts, support value, customer context, or a market requirement that metrics cannot show.

For `update`, name the failing intent or evidence and the proposed revision. For `consolidate`, map claims and sections that will move. For `redirect`, verify a same-intent destination and test the redirect chain. For `retire`, record the replacement, user notice, backlink plan, and rollback. For `keep`, record why low metrics do not justify a change.

The helper's `signals` are arithmetic observations, not proof of causality. Review previous-period definitions, attribution windows, seasonality, migrations, and tracking changes. When two pages share a topic but serve different jobs, preserve both and resolve overlap through intent and navigation evidence.

## Acceptance

The reviewer records evidence, owner, destination, change type, rollback, and measurement window. The helper performs no network request, external write, redirect, deletion, or scheduling. No fixed traffic or visibility gain is promised.

## Data review checklist

Confirm clicks and impressions use matching periods and property scope.

Confirm conversion and backlink fields include the relevant attribution window.

Confirm citation counts identify source and observation date.

Confirm `updated_at` reflects the meaningful content edit.

Confirm protected status came from an accountable owner or policy.

Confirm equivalent verification names reviewer and evidence.

Confirm recent edits are not treated as stale decline.

Confirm unknown values stay unknown during review.

## Post-decision checks

After an approved change, validate canonical, status, redirect chain, sitemap, internal links, and rendered content. Record deployment or CMS change ID and rollback path. Monitor configured metrics after release. Do not infer success from rank movement alone, and do not promise fixed growth.
