# SEO release regression guard

Use before or after a deployment, migration, redesign, or CMS change to detect SEO regressions
and verify approved fixes. The shared SEO engine owns context, permissions, evidence, confidence,
and output naming. This reference owns baseline comparability and regression classification.

## Trigger and inputs

Require a pre-release crawl or an explicitly labeled partial reconstruction, a post-release crawl,
the intended URL map/change list, and comparable scope. Prefer the same crawler, user agent,
rendering, authentication, parameter rules, and inclusion/exclusion rules on both sides. Also use
historical URL value, sitemap/robots files, field and lab performance, hreflang, analytics, and
deployment metadata where available.

## Procedure

1. Freeze baseline and post-release timestamps, URL scope, crawl settings, deployment identity,
   locale/device, and intended changes. Refuse comparison when settings are materially different.
2. Compare URL presence, status, redirects, canonical, robots/indexability, sitemap membership,
   internal links, titles/H1/meta, structured data, rendered content, locale routing, and release
   configuration. Check staging noindex/robots rules separately from intentional production rules.
3. Join changes to historical clicks, conversions, links, and strategic URL flags. Missing value
   remains unknown; traffic at risk is exposure, not a forecast.
4. Suppress downstream duplicate symptoms when a terminal status or redirect explains them. Group
   findings by root cause and label each `expected`, `expected_but_wrong`, or `unplanned`.
5. Use site value and mechanism to assign P0/P1/P2 severity. Keep delayed field metrics separate
   from deployment correctness; lab checks are interim evidence.
6. Route each finding to an owner with acceptance and verification steps. Do not roll back or apply
   production fixes automatically. After an approved fix, rerun the affected checks only after
   the new state is available.

## Output fields

Return one row per root-cause regression with: `id`, `status`, `severity`, `url_scope`,
`affected_count`, `high_value_urls`, `before`, `after`, `classification`, `root_cause`,
`expected_change`, `owner`, `acceptance`, `verification`, `confidence`, and `next_check`.

Use `checked`, `blocked`, `deferred`, or `not_applicable`. Include baseline comparability,
settings, unavailable evidence, and a one-line verdict before the detail table.

## Evidence and fallback limits

Compare the same URL identity after normalizing only documented URL differences. If redirects or
canonical targets changed by design, attach the intended map and verify the destination state. If
field performance has not matured, label lab results and schedule a field check. If a crawl cannot
render JavaScript, mark rendered-content findings provisional and verify a sample in a compatible
renderer before escalation.
Record the deployment identifier and crawl artifact locations. Preserve expected changes beside
unplanned findings. Keep traffic and ranking effects as follow-up observations with their own
measurement window.
Do not delete baseline artifacts after the run; later verification depends on the exact snapshot.

## Monitoring and recovery

Define the owner, release ID, important URLs and templates, baseline, check cadence, alert destination,
and stopping condition. Agree on absolute and relative materiality floors plus a persistence window
for noisy traffic measures. Confirmed availability or indexability incidents on important pages can
need immediate attention. Treat API failures and incomplete data as monitoring failures, not SEO loss.

Check deployment correctness when the release is available. Review mature search and conversion data
after the provider's reporting lag. Compare cohorts and seasonality before attributing a drop to the
release. Track expected URL moves through their mapped destinations. Record repair or rollback
criteria and the authorized decision owner. Verify recovery against the original failing condition.

Describe a recurring plan when useful. Create or change a scheduled job only when the user asks for
one. Configure notifications for material changes, failures, recovery, or required decisions. Preserve
the prior baseline and suppress unchanged non-actionable results.

## Acceptance

The run passes when the pre/post scopes and settings are comparable, every reported change has
before/after evidence, intended changes are labeled, duplicate symptoms are grouped, and each
selected fix has a checkable acceptance and re-verification step. Delayed ranking or CWV outcomes
must have a dated monitoring check instead of being presented as release proof.

## Failure and limits

If no baseline exists, use current crawl, sitemap, and historical data only as a partial defect
assessment. Mark it `blocked` for regression claims; absence of baseline evidence does not prove a
regression. If crawl scope differs, report the mismatch and do not interpret missing URLs as
deletions. Preserve intentional staging or production directives as expected when documented.
