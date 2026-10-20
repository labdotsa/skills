# Establish comparable evidence

## Discover capabilities

Inspect the current tool inventory and schemas. Verify a scoped read against the intended property or project. A connector's name or connected badge does not prove that a particular report is available.

| Evidence needed | Preferred source | Fallback and limit |
| --- | --- | --- |
| Owned-site clicks, impressions, queries, pages, and position | Search Console | Dated export. Public SERPs cannot reconstruct site performance. |
| Conversions and business value | Validated analytics, CRM, or transaction records | Export plus tracking definition. Missing tracking is unknown, not zero conversions. |
| Competitor rankings, volume, links, and traffic estimates | Semrush or another licensed provider | Dated reports and public-page inspection. Label estimates and database coverage. |
| HTTP behavior, directives, links, and rendering | Current crawl and direct page checks | Crawl exports or bounded public checks. Disclose rendering and scope limits. |
| Index status | Search Console URL Inspection or verified owner data | Public directives show eligibility, not actual index membership. A `site:` query is not a complete inventory. |
| AI answers and citations | Authorized platform observations or a visibility export | Bounded manual panel. Organic rankings cannot substitute for AI citations. |
| Delivery state | Deployed URLs, release manifest, repository, and intended URL map | Archived snapshots. Missing pre-release evidence limits regression attribution. |

Semrush's [documented MCP](https://www.semrush.com/kb/1618-mcp) is read-only. As reviewed on 2026-10-21, the [workflow source](https://www.semrush.com/blog/agentic-seo/) also reports that it cannot create Site Audit projects, start crawls, return rendered page bodies, or export a complete snapshot URL inventory. Discover current capabilities rather than assuming those limits or report names persist. Use an existing project, export, or authorized crawler when required evidence is missing.

Read operations may consume paid units. Bound result counts, market database, dates, filters, pagination, retries, and total units. Reuse unchanged responses. Retry a transient read once when safe and within budget. For authentication failures, unsupported operations, or repeated failure, record the error. Use an available export or return partial work. Do not silently buy access or broaden the crawl.

## Keep a run manifest

Record these fields with the evidence, using the project's existing format:

```yaml
run_id: seo-2026-10-21-example
workflow: content-decay
scope: explicit URLs or domain and folder rules
goal: business outcome
market: country, language, device, and search type
as_of: evidence cutoff and timezone
windows: baseline and comparison start/end, inclusive convention
limits: URL cap, row cap, crawl depth, API units, and permitted spend
sources: source IDs, property/project IDs, retrieval dates, and saved artifacts
coverage: requested, retrieved, analyzed, excluded, failed, and remaining counts
authority: reads, local edits, and specifically authorized external actions
```

For each dataset, preserve the query, filters, dimensions, pagination state, row limits, units, report date, and export digest when available. An empty response, denied permission, truncated report, and observed zero are different states.

## Join without losing meaning

Use a URL mapping table. Preserve the original URL, resolved URL, declared canonical, and observed search-engine canonical separately. Remove fragments only when page-level analysis warrants it. Do not blindly strip parameters, fold path case, equate slash variants, or treat redirects as permission to merge records.

Keep dimensions consistent. Query-page rows cannot stand in for complete page totals. Search Console can omit anonymized queries and retain only top rows. Paginate within provider limits and state residual coverage. Do not sum average positions or average CTRs. Compute aggregate CTR from clicks divided by impressions. Label weighted position summaries and retain query-level distributions when they affect the diagnosis.

Check analytics event definitions, consent coverage, attribution, property timezone, sampling, thresholding, and tracking changes. Search clicks and analytics sessions are different measures. Competitor estimates do not measure actual sessions or revenue.

Choose complete, equal-length windows with comparable weekdays, market, device, and search type. Account for seasonality, holidays, partial days, data lag, and site changes. Use a relevant year-over-year comparison alongside the nearer trend when history permits. Otherwise return a provisional baseline and its limits.

Calculate deltas in code or a spreadsheet. For a previous value of zero, report absolute change and `not_defined` percentage change. Keep missing values null. A large percentage on a tiny base does not establish an incident.

## Grade evidence and confidence

Label evidence as `observed`, `measured`, `reported`, `inferred`, or `unknown`. Add `estimated: true` to modeled vendor measures even when a tool retrieved them successfully.

Use high confidence for a reproduced mechanism with suitable coverage. Use medium confidence for a supported pattern with competing explanations. Use low confidence for an incomplete hypothesis. Two dashboards derived from the same dataset share one source lineage. More sources do not resolve a contradiction automatically.

Keep a claim ledger linking each conclusion to supporting and conflicting evidence. Check the decisive alternative before recommending expensive work. When evidence cannot distinguish causes, prescribe the smallest discriminating check and leave the decision `investigate`.
