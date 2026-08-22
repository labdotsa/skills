# Working templates

## Strategy brief

```yaml
assignment:
  branch: create | audit | localize | experiment
  store: apple | google | both
  devices: []
  locales: []
  listing: default | custom
app:
  category: ""
  maturity: ""
  monetization: ""
audience:
  segment: ""
  context: ""
  source_or_keyword: ""
  desired_outcome: ""
  objection: ""
alternative: ""
differentiator: ""
primary_metric: ""
quality_guardrails: []
available_evidence: []
missing_inputs: []
```

## Claim ledger

| ID | Claim | Audience | Supporting state | Evidence / source | Qualification | Locale | Owner | Expiry risk | Status |
|---|---|---|---|---|---|---|---|---|---|
| C1 |  |  |  |  |  |  |  |  | verified / hypothesis / blocked |

## Storyboard

| Position | Persuasion job | Headline | Support | Product state | Visual hook/focus | Claim IDs | Qualification | Locale notes |
|---|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |  |

After drafting, perform three reads:

1. **Thumbnail read:** inspect only reduced first-frame and search-row scale.
2. **No-copy read:** hide overlays and infer the product/job from visual evidence.
3. **Headline-only read:** read headlines in order and verify a cumulative argument.

## Audit rubric

Score each dimension 0–2 and cite visible evidence.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Intent match | unclear | category clear | audience/job and outcome clear |
| First-frame proof | decorative | product visible | product state proves the claim |
| Message hierarchy | competing or illegible | readable | instantly scannable and focused |
| Sequence | random | grouped | objection-aware progression |
| Differentiation | generic | feature distinction | meaningful alternative distinction |
| Product fidelity | misleading or stale | plausible | current and representative |
| Trust | risky or unsupported | neutral | appropriate, auditable proof/control |
| Localization | broken or default | translated | transcreated and locally evidenced |
| Accessibility | tiny or low contrast | readable | resilient type, contrast, color independence, alt text where supported |
| Testability | monolithic | partially modular | isolated hypotheses and reusable system |

Do not use the total as conversion evidence. Use it to prioritize observable weaknesses.

## Recommendation register

| Priority | Observation | Consequence | Recommended change | Dependency / assumption | Verification |
|---|---|---|---|---|---|
| P0–P3 |  |  |  |  |  |

## Experiment plan

```yaml
hypothesis:
  audience_source_locale: ""
  variable: ""
  control: ""
  treatment: ""
  reason: ""
measurement:
  primary: ""
  quality_guardrails: []
  value_guardrails: []
  diagnostic_cuts: []
design:
  platform: apple_ppo | google_store_listing_experiment | targeted_cohort
  allocation: ""
  planned_duration: ""
  stopping_rule: ""
  confidence_output: ""
decision:
  ship_if: ""
  reject_if: ""
  replicate_if: ""
```

## Final QA matrix

| Check | Store/device/locale | Result | Evidence | Owner / action |
|---|---|---|---|---|
| Current UI and claims |  | pass/fail |  |  |
| Thumbnail comprehension |  | pass/fail |  |  |
| Crop and safe zones |  | pass/fail |  |  |
| Contrast and text size |  | pass/fail |  |  |
| RTL and translation expansion |  | pass/fail |  |  |
| Personal data and permissions |  | pass/fail |  |  |
| Store-specific requirements |  | pass/fail |  |  |
| Alt text where supported |  | pass/fail |  |  |
