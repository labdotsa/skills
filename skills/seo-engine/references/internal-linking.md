# Internal linking and orphan review

Use this workflow to find useful internal links and distinguish a true orphan from an incomplete crawl or CMS inventory.

## Inputs and evidence

Request authenticated crawl data, canonical responses, rendered links, XML sitemaps, CMS route records, redirects, and analytics/Search Console context through shared SEO data tools. Keep crawl, CMS, and sitemap inventories separate. Record crawl scope, user agent, rendering mode, exclusions, date, and access errors.

## Ordered process

1. Normalize records only for comparison. Preserve each source URL exactly in evidence. Do not rewrite query strings, case, or trailing slashes.
2. Resolve canonical, status, noindex, redirect, and access state. Exclude non-HTML and intentionally isolated routes with reasons.
3. Build a graph from crawlable source pages to canonical targets. Mark discovered pages, sitemap-only pages, CMS-only pages, and blocked pages.
4. Call a page a **verified orphan** only when it is indexable, in scope, has no qualifying internal inbound link, and crawl completeness is sufficient. A sitemap-only or CMS-only page is an orphan candidate until verified.
5. Rank candidate links by reader task, topical relationship, page value, destination availability, and editorial fit. Do not optimize a fixed anchor quota.
6. For each proposed link, name the source paragraph, exact target URL, reader rationale, and natural anchor wording. Inspect surrounding copy for factual fit.
7. Check target canonical and redirects. A link to a redirect or noncanonical URL is a repair item, not a completed opportunity.

## Output schema

```yaml
scope: {domain, market, crawled_at, completeness, exclusions}
inventories: {crawl: [], sitemap: [], cms: []}
orphan_candidates: [{url, sources_seen, reason, confidence}]
verified_orphans: [{url, proof, confidence}]
link_opportunities:
  - source_url: string
    source_paragraph: string
    target_url: string
    anchor: string
    reader_rationale: string
    evidence: []
    status: proposed|needs-review|ready
missing: []
```

## Missing data and safety

If crawl completeness, rendering, canonical, CMS, or sitemap access is unknown, stop at candidates and mark `needs-review`. Do not label a page orphan from one crawl that timed out or skipped JavaScript. Do not insert links, change CMS content, or schedule work automatically.

## Link quality checks

Prefer a link that resolves a reader question at the point it occurs. Anchor text should describe the destination in the sentence's own voice. Avoid repeated exact-match anchors, navigation stuffing, and links that interrupt a form, legal notice, or primary task.

Check source and target language, market, access requirements, and lifecycle state. A target that is unpublished, blocked, redirected, or protected needs a separate owner decision. Record whether the source paragraph is visible in server HTML or requires rendering.

Use analytics, Search Console, and conversion signals to prioritize, not to justify irrelevant links. A high-value page can need links even when it has no recent clicks. A low-value page can be a valid legal or utility endpoint and should not be deleted because it is isolated.

## Acceptance evidence

Store the crawl manifest, sitemap snapshot, CMS export, exclusion rules, and failed-request list with the report. Report counts for each inventory and the number of pages whose canonical or rendering state could not be resolved. The reviewer must be able to reproduce why a candidate became verified.

## Acceptance

Every verified orphan has reproducible proof. Every link suggestion has an inspected source paragraph, exact target, natural anchor, and reader reason. Output separates evidence from inference, reports failed sources, and preserves URL identity. Paid links, link exchanges, exact-match quotas, and automated insertion are out of scope.

## Change record

If a link is approved, record source revision, target revision, anchor text, reviewer, and validation result. Recheck after redirects, migrations, template changes, or content removal. Keep proposed links separate from links already published.
