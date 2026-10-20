# Competitor growth investigation

Use when a query competitor appears to gain or lose search visibility and the team needs a
response decision. The shared SEO engine owns context, permissions, evidence, confidence, and
output naming. This reference owns anomaly triage and causal hypotheses.

## Trigger and inputs

Require three to five competitors selected by query overlap, priority topics, comparison windows,
locale/device, and an alert rule calibrated to the dataset. Prefer domain and URL-level visibility,
keyword movement, fixed rank tracking, SERP captures, page content, and release or campaign context.
Use modeled provider metrics only as directional estimates. Do not assume competitor revenue.

## Procedure

1. Freeze competitor set, topics, windows, source tools, and data cutoff. Record whether metrics
   are observed, modeled, sampled, or reported.
2. Calculate absolute and relative movement for each competitor and topic. Apply the agreed alert
   rule; record rows below it as `not_applicable` rather than investigating noise.
3. For alerts, identify the pages and queries responsible. Separate branded from non-branded
   movement and check whether the same change appears in an independent source.
4. Test competing hypotheses: new content, existing-page ranking gains, seasonality, brand lift,
   new product/category templates, migration, or data artifact. Keep multiple hypotheses when
   evidence does not discriminate.
5. Read representative winning pages and current SERPs. Record observed format, intent, entities,
   links, and gaps. Do not infer a cause from a URL, title, or traffic chart alone.
6. Map the affected topic to the business goal and decide `monitor`, `update`, `create`,
   `investigate`, or `no_action`. Separate visibility observations from business impact.
7. Assign confidence, owner, next check, and an approval boundary for any content, product,
   positioning, or outreach response.

## Output fields

Return one row per alert with: `competitor`, `topic`, `status`, `movement`, `pages`, `queries`,
`brand_split`, `hypotheses`, `supporting_evidence`, `contradicting_evidence`, `response`,
`confidence`, `owner`, and `next_check`.

Statuses are `checked`, `blocked`, `deferred`, or `not_applicable`. Include thresholds, windows,
source limitations, and a short verdict. A competitor movement can be real and still require no
response.

## Evidence and fallback limits

Use first-party data for the site's response decision when available. If competitor pages cannot be
read, keep the driver hypothesis open. If only sampled keywords are available, describe coverage
as partial. If the comparison window crosses a migration, campaign, or provider change, split the
analysis rather than averaging it. Never infer customer demand, revenue, or product quality from
modeled competitor traffic.
Record the source date and query coverage with each alert. Preserve disagreement between sources
as an explicit contradiction. Treat a response as a hypothesis with a measurement window, not as
a forecast.

## Acceptance

The run passes when every alert above the declared rule has page/query evidence, at least one
alternative cause was considered, modeled metrics are labeled, and the response is tied to a
named business topic. No response is valid when movement is seasonal, branded, artifact-driven,
irrelevant, or unsupported.

## Failure and limits

If page or query data is unavailable, mark the row `blocked` and state the smallest resolving
source. If only one modeled provider shows a broad step change, treat data artifact as unresolved.
Do not turn traffic estimates into revenue claims, rank movement into causality, or an alert into
permission to publish, contact, or change the product.
