# Audit and measure backlinks

## Define the evidence boundary

For each export, retain the provider, property, retrieval date, index or database, filters, requested period, row cap, and pagination coverage. Keep first-seen, last-seen, lost-at, and exported-at dates distinct. Discovery time is not necessarily publication time.

Use Search Console for the verified property's reported links, a backlink provider for its observed index and competitor comparisons, the live source page for current link properties, and analytics for observed referrals and conversions. A public crawl or Common Crawl sample supports observations within that sample. It cannot establish the whole profile.

Search Console's Links report is a sample. It can include links since removed, combines duplicates and canonical targets, and does not report `nofollow`. Its table exports and broader sample exports have different limits. Google also documents that some unavailable values export as zero. Preserve export semantics and do not treat every zero as a measured absence.

Record missing sources as unavailable. Without a backlink export, provide a public evidence review or collection plan. Do not invent total backlinks, referring domains, anchor ratios, toxicity, competitor gaps, or a profile score. Do not require paid data for a useful conditional launch plan.

## Reconcile and inspect

1. Keep the raw exports. Normalize hosts and known URL aliases into separate comparison keys while preserving original source and target URLs. Do not strip query parameters that identify different content.
2. Identify exact source-to-target duplicates, repeated sitewide placements, canonical variants, subdomains, and syndicated copies. State the chosen referring-domain grouping. Compare providers separately before joining their observed URLs.
3. Summarize the measured sample by target page, referring domain, topical relevance, placement type, anchor category, observed attributes, and new or lost status. Give the denominator and unknown count for every ratio.
4. Inspect representative live pages and all examples driving material recommendations. Describe the sample selection and coverage. Treat relevance, editorial intent, and suspicious patterns as judgments supported by page evidence.
5. For competitor gaps, use the same provider, database, period, and filters where possible. Separate brand size, content assets, partnerships, paid placements, and target-page intent before proposing imitation.

Classify anchors as branded, URL, descriptive, generic, image, or unknown when that helps the decision. Use a documented local classification, not a universal safe percentage. Language, product names, and templates can explain apparent concentration.

A burst of links can come from a launch, syndication, scraping, sitewide navigation, a real news event, or a manipulative campaign. Investigate the pages before labeling the burst harmful. A vendor's toxicity score is a signal for review, not proof of a penalty.

For lost links, check whether the source page exists, the link remains, the target moved, redirects work, and the provider changed coverage. Distinguish confirmed removal, destination breakage, temporary access failure, provider-only loss, and unknown. Propose reclamation only when it helps the reader and preserves editorial choice.

## Verify a placement

Record the observation date, source URL, placement context, visible anchor, raw `href`, actual `rel` tokens, intermediate redirect when observable, final destination, and destination accessibility. Inspect the actual listing and paid tier, not a different template.

Check source-page status, canonical, robots directives, and crawl access only with tools that expose them. State which checks were possible. A robots block is not the same as `noindex`. A source's canonical pointing elsewhere limits interpretation, rather than proving all its links worthless.

A live accessible page with no observed exclusion may be index eligible. That does not prove Google has indexed it. A missing provider or Search Console record does not prove the link is absent. Do not use `site:` results as a complete index inventory or promise that a submitted URL will be indexed.

Distinguish ordinary links with no qualification, `nofollow`, `ugc`, `sponsored`, redirects, script-only navigation, and unlinked mentions. Multiple `rel` tokens can coexist. Do not request removal of paid-link qualification to pass ranking credit.

## Assess a disavow request

Google says most sites do not need disavow. Its stated conditions require both a considerable number of spammy, artificial, or low-quality links and a manual action or a likely manual action caused by those links.

Check the user's history of link schemes and available manual-action evidence. A traffic decline, foreign-language link, low DR, or vendor toxicity label alone does not meet those conditions. Investigate other causes of a decline separately.

When the conditions are supported, propose removal attempts and a reviewed list of specific URLs or domains. Preserve the current property list before preparing a replacement because a new upload replaces it. Verify property ownership, exact URL-prefix property, scope, rationale, and recovery copy. The tool does not support Domain properties. Upload only with authority for that property and action. Without sufficient evidence, deliver an investigation queue instead of a blanket disavow file.

## Measure the chosen outcome

Establish the baseline and review window before interpreting results. Choose periods suited to the buying cycle, traffic, launch date, and crawl lag. A short review can confirm a live listing. Ranking or revenue effects need later evidence and may never occur.

| Outcome | Measures | Interpretation limits |
| --- | --- | --- |
| Editorial acquisition | Unique verified placements and referring domains to target pages, relevant coverage, retention | Raw link count inflates sitewide or syndicated exposure. A link is not a customer. |
| Outreach | Qualified contacts, sent messages, replies, accepted contributions, live links | State denominators. Accepted content may never become live or contain a link. |
| Launch and community | Relevant feedback, useful conversations, qualified visits, activated users | Votes, badges, and impressions measure platform activity. They do not establish demand or revenue. |
| Referral and commercial | Attributed sessions, agreed conversion events, customers, realized contribution, refunds | Referrer loss, consent, cross-device journeys, and attribution windows limit coverage. Do not present missing attribution as zero value. |
| Search | Target-page queries, impressions, clicks, and rankings with comparable segments | Account for seasonality, brand demand, releases, content changes, and other campaigns. Before-and-after movement does not establish causation. |
| AI visibility, when requested | Repeatable prompt panel, captured answers, mentions, citations, linked sources | Keep mentions, citations, recommendations, and visits distinct. Directory presence cannot guarantee an AI answer. |

Use stable campaign values when permitted by the destination. Preserve the canonical product destination. Do not add a tracking redirect merely to count a backlink. Never put private identifiers in tracking parameters. Check the conversion event on the real success path when access permits.

Record cash fees, recurring renewals, preparation and follow-up effort, badge or implementation work, and the opportunity cost of maintaining profiles. Separate labor estimates from observed time. Cost per qualified outcome needs a defined outcome and nonzero measured denominator. With zero measured outcomes, report the cost and zero outcomes instead of a finite cost per outcome.

Review the initial cohort before expanding. Continue channels with useful observed outcomes within agreed costs. Revise positioning or defer channels with weak fit. Defer or stop when evidence remains insufficient, the cost ceiling is reached, or the channel requires manipulative practices. A speculative SEO benefit does not justify unbounded spend.
