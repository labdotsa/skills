# SEO engine synthesis

The upgraded `seo-engine` remains one installable skill with eight focused workflow references. Shared context, evidence, permissions, measurement, and verification belong in one place. A family would repeat those contracts. A recipe would organize an ongoing engagement across skills and sessions, rather than supply the SEO method itself.

The inspected design router provides the same precedent: one entrypoint selects focused references by deliverable, while optional companion skills remain conditional. Separate SEO workflows therefore do not require separate installable skills.

This decision applies to the current scope. A future SEO operations recipe can compose research, copywriting, public-page implementation, release work, and recurring review if that delivery pattern becomes a separate product.

## Sources inspected

Research date: 2026-10-21. Public articles and official documentation were inspected in the built-in browser. The eight-skill bundle and both source repositories were downloaded for local inspection. No upstream scripts were executed or installed.

| Source | Retrieved state | Scope |
| --- | --- | --- |
| [Semrush article](https://www.semrush.com/blog/agentic-seo/) | Article dated 2026-09-18 | Setup architecture and all eight workflow examples |
| [Agentic SEO skills](https://github.com/crazylunatic007/agentic-seo-skills/tree/d52744340d2d6772cb1ffc88c7a375a6baa826ea) | Commit `d52744340d2d6772cb1ffc88c7a375a6baa826ea` | Downloaded `dist/all-skills.zip`; inspected every nested skill, reference, and both Python scripts |
| [Paul Vengeons article](https://x.com/VengeonsP/status/2112114728596070486) | Post dated 2026-10-19 | Four-role campaign method, question design, calibration, briefs, links, delivery checks |
| [Jev audit](https://github.com/AgriciDaniel/jev-seo/tree/55a184a3b0d09565a4c84268f725a47784e62528) | Commit `55a184a3b0d09565a4c84268f725a47784e62528` | Skill, method, judgments, evaluation, and repository documentation |
| [AEO Consultant case study](https://x.com/aeoexpert/status/2112181831239905598) | Post dated 2026-10-19 | Demand-backed prompt panel, citation classification, contribution targets, owned assets |

The user-supplied eight-workflow social summary points to the same Semrush guide. It is not independent corroboration. The two X links contain long-form articles rather than two additional downloadable skill packages.

The cloned eight-skill repository contains an MIT license, copyright 2026 Faizan Ali. The nested ZIPs omit that file. The upgraded skill retains its attribution and license text. The Jev audit also declares MIT. Its code and assets are not redistributed. Social article prose, promotional images, and case-study screenshots are not copied into the installable skill.

Local research downloads live under ignored `.artifacts/seo-research/`. Published instructions contain portable references and no machine-specific paths.

## What changed

The previous 301-line skill, introduced in `65dbe42`, provided a broad checklist and generic prompts. It covered technical SEO, content, keywords, links, schema, performance, international, local, and measurement. It lacked task-specific evidence contracts, unknown-data handling, comparable baselines, and repeatable decision procedures.

The new entrypoint routes by the user's question. Shared references define evidence joins, capability discovery, semantic judgment, and technical foundations. Each workflow specifies inputs, ordered checks, outputs, missing-data behavior, and acceptance. The portfolio helper adds deterministic local triage without a provider dependency.

| Upstream workflow | Retained method | Strengthening in this repository |
| --- | --- | --- |
| Content decline diagnosis | Filter material losses, inspect indexation first, compare rankings/demand/links/intent, primary and fallback action | Site-specific thresholds, full per-URL check accounting, technical causes do not skip the rest of the queue |
| Technical sprint triage | Group crawl symptoms by root cause, join value, estimate effort, verify live examples | Actual crawl coverage and capabilities, dependencies and capacity, implementation checks separate from rankings |
| Competitor growth investigation | Isolate winning pages and queries, split brand demand, test competing drivers | Consistent provider database and windows, modeled traffic labels, no inferred revenue or forced response |
| Search opportunity to brief | Check existing coverage before create, group by reader problem, inspect SERPs, define original value | Protect established queries, verify claims, allow no action, editorial and deployment checks remain distinct |
| Internal linking rescue | Combine contextual placements with structural findings | Sitemap/CMS/crawl reconciliation, provisional orphans under partial coverage, natural anchors and reader benefit |
| Content portfolio decisions | Join a URL inventory, protect value first, leave ambiguity for review | Explicit report date and thresholds, null preservation, reproducible helper, retirement candidates cannot execute changes |
| AI citation influence mapping | Observed prompt/citation panel, classify source types, inspect inclusion angle | Separate mentions/citations/recommendations/direct links, fixed denominators and repeated observations, honest contribution queue |
| SEO release regression guard | Comparable pre/post crawls and intended changes, root-cause grouping, re-verification | No-baseline defect mode, staging/production intent, delayed outcome checks, monitored recovery and rollback criteria |

## Writer and judge separation

The Vengeons article's useful distinction is operational. Sources supply evidence, code computes, a judge classifies meaning, and a writer produces the deliverable. That split is provider-neutral in the new skill.

The Jev audit's evaluation explicitly distinguishes repeatability and agreement with another model from accuracy against human labels. Its thresholds are not yet calibrated against a human answer key. The new judgment procedure requires representative labels, negative cases, a held-out check, error-cost review bands, and a provisional path when calibration is unavailable.

A semantic score cannot calculate arithmetic, infer missing metrics, authorize production changes, or prove that a page shipped. The final delivery check uses the actual deployed URL and relevant directives, links, locale, and instrumentation.

## Citation methods and rejected claims

The AEO case study contributes evidence-backed prompt seeds, source classification, and owned-channel planning by customer awareness. The skill retains these methods while requiring comparable panels and clear measures.

It excludes the case study's covert forum promotion and filter-evasion schedule. It also excludes incentivized review tactics, paid ranking credit, concealed reciprocal placements, and unsupported claims that citation visibility causes sales. A reported visibility percentage without a stable panel, absolute baseline, denominator, and repeated observations cannot establish a general growth rate.

The Vengeons article's fixed authority bands, exact-match anchor rules, word-count protection, compulsory title years, publishing caps, and backlink quotas are not treated as search-engine requirements. Its model prices and speed claims are mutable vendor claims, not configuration defaults.

[Google's AI-feature documentation](https://developers.google.com/search/docs/appearance/ai-features) supports ordinary search and snippet eligibility for AI Overviews and AI Mode. It documents no special AI schema or mandatory AI text file. This does not establish the requirements of every AI platform.

[Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies) identify manipulative link practices and forum spam. The new contribution queue emphasizes original evidence, relevant editorial participation, accurate listings, and disclosed sponsorship where appropriate.

## Tool and evidence limits

[Semrush's MCP documentation](https://www.semrush.com/kb/1618-mcp) describes read-only access and consumption of API units. Tool access depends on the account and available reports. The Semrush workflow guide also names limitations around starting Site Audit crawls, obtaining complete URL inventories, and rendered page content. The skill discovers current capabilities and falls back to exports or explicit partial analysis.

The supplied repositories are examples, not benchmarks of this upgrade. No live customer SEO data or paid SEO service was used to validate the new skill. Local behavioral scenarios and helper tests establish workflow decisions and deterministic contracts, not ranking or citation gains.

## Package and maintenance

The installable package is [skills/seo-engine](../../skills/seo-engine/SKILL.md). All execution instructions, helper contracts, sources, and evaluation scenarios live inside that package. This document explains the synthesis for maintainers.

Regenerate discovery metadata with `npm run catalog`. Run the helper's subprocess tests and the skill scenarios after relevant changes. Run repository validation before release. A successful helper run is not evidence that source exports are complete, tracking works, or a redirect destination is semantically equivalent.

## Validation record

Slice `SEO-1` received independent QA `SUCCESS` on 2026-10-21. The tested package contained 17 files, with package SHA-256 `525ab5acb78bed3c146848697c7e57fecc7800f7c52d8e98c23ea3a535dcacf8`. All 12 behavioral scenarios and 12 subprocess CLI tests passed. QA also inspected the generated skill page through the built-in browser.

Repository structure, catalog, boundaries, type checks, 90 unit tests, three component tests, all four publication profiles, 152 end-to-end tests, 13 browser-quality checks, five visual checks, transfer budgets, and Lighthouse route medians passed. Configured skips remained unchanged. One timing assertion required an isolated retry at the existing 200 ms limit. Ignored local test configurations avoided an occupied component-test port and reused built publication artifacts after a server-startup timeout.

The full `npm run validate` gate is not green. Two accessibility suites returned incomplete contrast results that need adjudication, and the [human website-release record](../../quality/README.md) remains pending. These results do not establish a contrast violation or provide the required human attestations. No website release was performed.
