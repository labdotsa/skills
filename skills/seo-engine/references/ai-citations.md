# AI citation-gap and digital PR queue

Use this workflow to measure where a site is absent from answer systems, then find evidence-backed ways to improve useful public information. A failed observation is not proof of absence.

## Inputs and evidence

Capture platform, model, market, language, device or session context, prompt, run date, clean-session method, repeat count, and result. Keep branded and unbranded prompts in separate cohorts. Record the full answer, source URLs, source labels, and whether the answer mentions, cites, recommends, or links directly to the domain.

Use unique source URLs as one denominator and repeated occurrences as another. A source appearing three times is one unique source and three occurrences. Classify sources as owned, editorial, government, academic, community, commercial, or unknown. Inspect the contribution angle and evidence quality before proposing work.

## Ordered process

1. Select prompt seeds from search queries, customer research, support questions, or other observed demand. Record each seed's source and distinct intent. Define the market and success measure, then freeze wording and sampling rules.
2. Run clean repeated sessions. Log failures, refusals, empty answers, and rate limits separately from no-mention results.
3. Extract mentions, citations, recommendations, and direct-domain links into separate fields. Do not collapse them into one visibility score.
4. Compare branded and unbranded cohorts by platform and market. Mark confidence from repeat count and result consistency.
5. Inspect repeatedly cited pages and competitor-only sources. Confirm whether the brand is mentioned, recommended, cited, linked to its own domain, or linked through another destination. Record source ownership and contribution openness.
6. Build an external contribution queue with source URL, prompt cohort, citation frequency, brand gap, inspected inclusion criteria, useful asset or correction, verified public contact when available, effort, owner, and priority. Rank relevance and feasible contribution ahead of raw frequency. Leave unknown contacts blank. Mark closed sources, competitor-owned pages, and community threads `no_outreach` when a pitch is inappropriate.
7. Map owned assets across the audience journey, including awareness, consideration, decision, onboarding, and retention. Choose relevant channels such as the website, video, or company publications. Name the evidence and expected learning for each asset.
8. Check claims and sources with the accountable editor. Add specialist review when the actual claim requires it. Prepare outreach drafts only when requested. Sending and publishing follow the run's authority contract.

## Output schema

```yaml
observation: {platform, model, market, language, observed_at, repeats, clean_session}
prompt_cohorts: [{label: branded|unbranded, prompt, runs, failures}]
visibility: {mentions: {}, citations: {}, recommendations: {}, direct_links: {}}
sources: [{url, unique, occurrences, classification, inspected_angle}]
gaps: [{question, evidence_missing, confidence, failure_or_absence}]
contribution_queue: [{source_url, prompt_cohort, occurrences, brand_gap, inclusion_criteria, asset, angle, contact, effort, priority, owner, outreach_status}]
owned_assets: [{asset, audience_stage, channel, evidence, owner, review_status}]
unknowns: []
```

## Safety and acceptance

No forum spam, filter evasion, barter for ranking credit, fake reviews, fabricated claims, or guaranteed visibility growth. A valid report shows sampling details, separates failure from absence, preserves URL and occurrence counts, and links each queue item to an inspected contribution. A citation does not prove that the source caused an answer or a sale.

## Sampling controls

Use the same prompt set for each comparison unless the report explains a change. Keep geography, language, device, account state, and safe-search settings stable. Record model version when exposed and record unknown when it is not. Do not combine snapshots from different markets into one rate.

Use repeated runs to estimate consistency. A platform error, refusal, timeout, or empty response belongs in `failures`, not in the denominator for absence. Report successful eligible observations, failed runs, and prompts without citations separately. If one run names the domain and another does not, preserve both and mark the observation uncertain. Show absolute counts alongside percentage changes. A zero baseline has no defined percentage growth.

## Queue quality

An owned asset must have a concrete contribution angle, a responsible owner, evidence requirements, and a review state. Map assets across awareness, consideration, decision, onboarding, retention, and advocacy so the queue does not become a list of generic articles. Reuse a strong asset across channels only when its audience and claims remain accurate.

Classify an external source before describing a gap. An editorial citation, an incidental mention, a recommendation, and a direct link represent different outcomes. Track unique URLs and repeated occurrences separately, then explain which outcome matters for the user's task.

## Review record

Store raw runs or immutable references where policy permits. Hash or redact personal data from prompts and sessions. Note sampling limits and any platform terms that restrict collection. A report must state whether the result is observed, inferred, or unknown.

Before adding an asset to the queue, check that it answers a real audience question and can be reviewed by a subject owner. Separate a missing source from a weak source. Do not ask an agent to manufacture authority or repeat a claim until a model cites it.

## Monitoring

Monitoring runs only when the user has configured a schedule and access. Compare like-for-like cohorts, surface material changes, and preserve the prior baseline. The monitor reports a change and asks for review. It does not contact publishers, edit pages, or schedule work by itself.
