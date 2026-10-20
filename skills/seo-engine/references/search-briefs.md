# Search opportunity briefs

Use this workflow when a query, page, or market signal may justify a new or revised piece of content. The brief is a decision record, not an instruction to publish.

## Inputs and evidence

Collect the target domain, market, language, audience, business goal, known constraints, and intended release owner. Reuse available Search Console, analytics, crawl, CMS, and keyword evidence. Record source, query date, market, and access scope for every metric. Public-page and SERP evidence can support a provisional brief without private access.

Seek query demand, current impressions and clicks, ranking pages, conversion context, SERP features, competitor examples, and existing coverage. State unavailable measures rather than inventing them. A query export without URL or market context is insufficient for page-performance conclusions. Check protected pages before proposing a new URL.

## Ordered process

1. Define the searcher's task in plain language. Label intent as informational, commercial, transactional, navigational, or mixed.
2. Map the query to existing pages, aliases, redirects, and planned work. Flag cannibalization and gaps.
3. Compare the result set by format, freshness, firsthand evidence, depth, trust signals, and unanswered subquestions. Do not copy competitor structure.
4. Decide whether to create, update, consolidate, investigate, or take no action. A new page needs a distinct job and a clear owner. Shared queries alone do not establish harmful cannibalization.
5. Build an outline from user questions and verified evidence. Do not force a title formula, publication year, keyword density, or fixed word count.
6. Define original value: data, examples, product experience, expert review, tool, comparison, or decision aid the site can honestly provide.
7. Draft a release gate. Name the reviewer, evidence links, claims needing citation, accessibility checks, canonical URL, internal links, and measurement window.

## Brief output

Return a record with:

```yaml
opportunity: string
market: string
intent: [labels]
evidence: [{source, observed_at, finding}]
existing_coverage: [{url, role, protected, action}]
recommendation: create|update|consolidate|investigate|no_action
audience_job: string
outline: [{heading, question, evidence_needed}]
original_value: [specific contributions]
claims: [{claim, source, reviewer}]
links: {sources: [], internal_targets: []}
release_gate: [{check, owner, status}]
measurement: [{metric, baseline, window, source}]
unknowns: [string]
```

## Missing data

If missing intent, market, or existing coverage prevents a defensible URL decision, return `investigate`. Missing conversion data limits commercial prioritization but need not block a provisional brief. Do not infer demand from a single rank, an unscoped keyword volume, or an AI answer. State the smallest evidence request that resolves the decision.

## Evidence checks

Check that the query is observable in the selected market and language. Separate branded demand from category demand. Keep paid and organic results separate. Record whether a result is a feature, local pack, video, shopping result, or standard listing.

Review the current page's title, headings, canonical, structured data, links, freshness, and conversion path before creating a sibling page. A low click count can reflect a low impression count, a poor snippet, or a tracking gap. Do not call it content failure without checking those causes.

Check legal, accessibility, privacy, and brand constraints before outlining examples or claims. If the topic requires professional review, name that reviewer in the brief. If evidence conflicts, preserve both observations and explain the resolution rule.

## Editorial release gate

The editor confirms that each claim has a source or an explicit firsthand basis. The owner confirms that examples are current and permissioned. The technical reviewer confirms canonical, indexability, rendering, structured data, and internal links. The measurement owner records baseline period, comparison period, conversions, and an agreed review date.

Do not convert a draft into a release ticket until these checks have owners and statuses. A brief can recommend defer when evidence is weak, the page is protected, or the expected reader value is unclear.

## Acceptance

The brief names one reader job, one accountable URL decision, evidence with dates and markets, and a defensible original contribution. Claims have sources or an explicit reviewer. No release occurs from this workflow. Do not schedule or publish automatically. Visibility or traffic outcomes remain hypotheses, never guarantees.

## Decision notes

Explain why an existing page cannot serve the intent before proposing another URL. Note content that must be merged, retired, or linked. State what would change the decision. This keeps a search brief useful when evidence changes.
