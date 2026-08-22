# Integrated quality system

Use these disciplines together. Do not improve one local metric by making comprehension, accessibility, truthfulness, privacy, resilience, or downstream quality worse.

## Copy, claims, and persuasion

- Use the audience's vocabulary; front-load answers; prefer concrete words, active voice, descriptive headings, and destination-specific links.
- Connect capability → consequence → mechanism → evidence → boundary.
- Maintain a claim ledger with exact wording, express or implied meaning, evidence, scope, owner, approval, expiry, and every placement or variant.
- Make qualifications unavoidable in the natural reading path. Fine print must not contradict the net impression.
- Name actions by their result. State prerequisites, cost, commitment, and what happens next.
- Use AIDA, PAS, FAB, 4Ps, or story formulas only as hypothesis prompts after the brief and evidence pack. Never force service content, pricing, checkout, incidents, errors, or legal wording into a sales formula.
- Remove fabricated proof, fake scarcity, hidden sponsorship, atypical testimonials presented as expected, and unsupported comparative or quantified claims.

## Information architecture and interaction

- Organize navigation and page composition around user language, jobs, workflow stages, audience segments, life situations, or product families—not the organization chart.
- Separate modes: overview pages orient, detail pages explain, comparison pages evaluate, transaction pages commit, documentation teaches, and error/status pages recover.
- Use semantic landmarks, one page-identifying H1, hierarchical headings, native controls, descriptive links, and DOM order that matches meaning.
- Keep primary and secondary actions visually distinct. Repeat an action after meaningful proof or at a natural decision point, not mechanically after every section.
- Design for keyboard, touch, screen readers, zoom, text spacing, reduced motion, forced colors, long content, virtual keyboards, and third-party failure.

## Accessibility and localization

- Target WCAG 2.2 AA across the complete process, responsive variants, and embedded third parties; verify manually as well as automatically.
- Meet text and non-text contrast, visible/unobscured focus, reflow at 320 CSS px, target-size or spacing requirements, and non-color communication.
- Provide persistent labels, useful hints, grouped controls, preserved values, linked error summaries and inline errors, announced async status, and an unambiguous success state.
- Permit password managers, paste, and autofill. Avoid a cognitive test or CAPTCHA as the only route.
- Set valid language and direction metadata. Use logical geometry, isolate bidirectional inserts, and test both RTL and long translations.
- Localize metadata, errors, accessibility names, legal text, system states, currency, dates, numbers, plurals, availability, and claims—not only body copy.

## Frontend delivery and resilience

- Return meaningful public content, metadata, headings, links, pricing or material terms, and instructions in initial server-rendered or static HTML; progressively enhance.
- Use real `<a href>` navigation, correct HTTP statuses, stable URLs, intentional canonical/noindex behavior, and canonical-only sitemaps.
- Make forms server-validated, abuse-resistant, resilient to refresh/retry, and safe against duplicate submission. Preserve recoverable user work.
- Validate and encode untrusted input, protect state changes, constrain uploads and redirects, avoid client secrets, and apply least privilege to third parties.
- Test missing JavaScript, blocked third parties, API timeouts, slow networks, stale caches, expired content, missing assets, denied consent, analytics failure, and partial data.

## Search and machine readability

- Align unique titles with visible headings and page purpose. Write accurate page-specific descriptions without relying on fixed character-count folklore.
- Ensure canonical pages are internally discoverable through crawlable links. Use `robots.txt` for crawl control, not dependable de-indexing.
- Make structured data match visible, source-backed facts and the page's true primary entity. Validation creates eligibility, not ranking or display guarantees.
- Return real 404/410 for unavailable pages, permanent redirects only to close replacements, and correct 5xx for temporary failure. Avoid blanket-home redirects.

## Performance

- Measure p75 field LCP, INP, and CLS by device and route family; use lab tools to diagnose and prevent regressions.
- Improve LCP through TTFB, initial discoverability, right-sized media, and reduced render blocking. Never lazy-load the LCP image.
- Improve INP through less JavaScript, smaller tasks and DOMs, reduced layout thrashing, controlled third parties, yielding, and immediate feedback.
- Improve CLS by reserving space, avoiding insertion above content, using compatible font metrics, and animating transforms or opacity.
- Establish budgets for JavaScript, CSS, fonts, media, requests, and third parties. Do not hydrate static prose without a demonstrated need.

## Privacy, analytics, experimentation, and security

- Inventory fields, cookies, storage, SDKs, tags, parameters, logs, recipients, transfers, retention, and purpose. Minimize collection and make notices match actual behavior.
- Where consent is required, block non-essential behavior before choice; make reject as available as accept; separate purposes; preserve withdrawal controls; verify at the network and storage layers.
- Never send recognizable personal information through analytics URLs, titles, search terms, form values, campaign parameters, events, or dimensions.
- Define events by trigger, deduplication, consent, properties, owner, retention, and corresponding server outcome.
- For experiments, predefine hypothesis, eligibility, randomization unit, primary outcome, guardrails, horizon, and stop rule. Validate assignment, sample ratio, telemetry, consent, and downstream effects.
- Treat HTTPS, HSTS, CSP, content-type protection, referrer policy, frame controls, permissions policy, dependency governance, and vulnerability response as a maintained system.
- Perform jurisdiction- and sector-specific legal review where needed. This skill is not legal advice.

## Maintainability

- Build from documented primitives, composites, templates, tokens, and typed content while retaining editorial flexibility.
- Document anatomy, variants, states, semantics, responsive and locale behavior, content constraints, ownership, deprecation, and migration.
- Avoid copied page forks, arbitrary CSS/JavaScript, token bypasses, disconnected metadata, premature abstractions, missing states, and campaigns that cannot expire centrally.

