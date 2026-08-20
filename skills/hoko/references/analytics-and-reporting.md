# Analytics and reporting

## Scope the question

State:

- decision to support;
- workspace and accessible collections;
- links, tags, partners, channels, or placements included;
- UTC date range and reporting timezone;
- current retention/plan constraints;
- click, lead, sale, revenue, and conversion definitions; and
- filters and exclusions.

Do not compare channels represented by one undifferentiated link unless reliable campaign values distinguish them.

## Available surfaces

The dashboard documents clicks, leads, sales/revenue, funnels, referrers, UTM values, tags, devices/browsers, locations, partners, filters, and CSV export. Dashboard exports reflect active filters.

The public Analytics API currently exposes click records with link, partner, date, pagination, and sort filters. Do not promise API access to every dashboard funnel or revenue card. Re-check the live [Analytics API](https://hoko.to/docs/analytics/get), [OpenAPI](https://hoko.to/openapi.json), and MCP tool inventory.

## Analysis sequence

1. Validate collection access and retention coverage.
2. Fetch all pages for the exact UTC interval; preserve the filter contract.
3. Check missing fields, duplicate IDs, unexpected destinations, and partial intervals.
4. Summarize reach: clicks and trend.
5. Explain traffic mix: source/UTM, referrer, device/browser, country, QR, partner, and link.
6. Add outcomes: leads, sales, revenue, click-to-lead rate, lead-to-sale rate, and revenue per click where supported.
7. Compare only like-for-like periods and placements.
8. State limitations and recommended decision, not just totals.

## Interpretation guardrails

- Clicks measure visits/reach, not intent or unique people unless the chosen metric explicitly says so.
- Device, browser, location, language, and referrer are context, not identity.
- Missing conversions may indicate instrumentation failure, not poor campaign quality.
- High click volume with low lead/sale rate can reflect traffic quality, landing-page fit, routing, or tracking gaps.
- Small partner/channel samples should not be ranked with false precision.
- Timezone, incomplete retention, inaccessible collections, browser blocking, and referrer policy can change the observed picture.

## Report contract

Return:

- scope and data freshness;
- primary KPI and supporting metrics;
- segmented table by the decision-relevant dimension;
- anomalies or instrumentation risks;
- interpretation with evidence;
- recommended action and next measurement; and
- reproducibility notes: endpoint/surface, filters, UTC range, pagination, export timestamp, and known limits.

Limit exports and customer reads to the smallest necessary scope. Avoid exposing raw visitor or customer data when aggregates answer the question.
