# Public-facing web pages: copy, design, and engineering research

Researched on 2026-08-20 against primary standards, regulator guidance, browser and search-engine documentation, public design systems, original UX research, and live first-party pages. This covers homepages, campaign landing pages, product and feature pages, pricing, about, contact and lead generation, signup, and documentation–marketing hybrids.

## Executive summary

A strong public page helps a specific visitor make a specific decision with the least avoidable uncertainty. Its job is not merely to look polished or maximize clicks. It must:

1. identify what is offered, for whom, and why it matters;
2. expose the information and proof required for the decision;
3. make the next action clear without concealing alternatives or material terms;
4. work with keyboards, assistive technology, small screens, zoom, slow networks, failed scripts, and reduced motion;
5. render meaningful HTML that browsers, search engines, link unfurlers, and users can understand;
6. respect consent and minimize data collection; and
7. produce evidence that the page works without confusing correlation with causation.

The recurring failure mode is local optimization: copy is optimized for cleverness, design for spectacle, development for component novelty, SEO for keywords, and experimentation for a single conversion event. The better unit of work is the complete visitor decision journey. Optimize comprehension, confidence, task completion, accessibility, speed, truthfulness, and long-term outcomes together.

## How to read this research

Evidence labels distinguish what the sources establish from professional synthesis:

- **Standard / regulator** — normative requirements or regulator guidance.
- **First-party guidance** — official browser, search-engine, government design-system, or company documentation.
- **Original research** — the organization publishing the result conducted the research.
- **Observed** — directly visible on the cited live page on the research date.
- **Inference** — a reusable recommendation synthesized from evidence or observation. It is not a proven conversion effect.

No page deconstruction below proves that a pattern caused conversion, revenue, trust, or retention. Live pages are mutable, personalized, localized, and sometimes experiment variants. Causal claims require a controlled experiment or a defensible quasi-experimental design.

## The governing model: intent, evidence, action

Before writing or laying out a page, record:

| Question | Required answer |
|---|---|
| Audience | The primary visitor, their context, prior knowledge, and accessibility/language needs |
| Intent | The question or job that brought them here |
| Promise | The concrete outcome offered, with scope and qualification |
| Evidence | What would make that promise credible: product UI, specimen, mechanism, customer, number, policy, comparison, or documentation |
| Objections | The material reasons a suitable visitor might not proceed |
| Primary action | The next meaningful step, not merely a button label |
| Alternatives | The correct routes for visitors who are not ready or do not fit |
| Success | Task and downstream-quality measures, plus harm guardrails |
| Constraints | Legal, privacy, accessibility, performance, localization, operational, and technical limits |

**Inference:** A useful default narrative is **orient → demonstrate → substantiate → resolve → act**. It is a diagnostic sequence, not a mandatory visual template. Different intents may start at pricing, a technical answer, a comparison, or contact information.

## Copywriting and content design

### Good practice

- Put the primary purpose in the page title, H1, and opening copy using the visitor's vocabulary. GOV.UK advises front-loading titles, headings, and sentences because users scan and because the beginning carries more information. [First-party guidance: GOV.UK content design](https://www.gov.uk/guidance/content-design/writing-for-gov-uk)
- Write for the reading level and context the audience actually has. Prefer common, concrete words, active voice, short sentences, descriptive headings, and lists only where they make scanning easier. Plain language is not simplification of the underlying truth. [First-party guidance: USWDS plain language](https://designsystem.digital.gov/documentation/plain-language/)
- Make link text describe its destination or action. “Read security documentation” communicates more out of context than “Learn more”; WCAG requires link purpose to be determinable from the link text or its programmatic context. [Standard: WCAG 2.2, link purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- Pair every important claim with the best available substantiation: an interactive or static product specimen, named mechanism, exact scope, dated number, attributed quotation, detailed case, independent certification, or policy. State limitations beside the claim.
- Keep mutable claims owned, dated, and reviewable. Pricing, availability, performance, customer counts, regulatory status, and product screenshots become misinformation when abandoned.
- Use CTA labels that name the resulting action: “Create account,” “Compare plans,” “Book a demo,” or “Download the guide.” The surrounding copy should state prerequisites, cost, commitment, and what happens next.
- Treat microcopy as interface logic. Labels, hints, errors, empty states, consent text, button states, and confirmations must agree with actual system behavior.

### Common mistakes

- A category-free slogan that forces visitors to infer what the product is.
- Benefit claims with no mechanism or evidence: “revolutionary,” “seamless,” “best-in-class.”
- Feature inventories that never connect capabilities to user jobs or constraints.
- Repeating the same generic CTA after every section.
- Social proof without attribution, context, date, or permission; fabricated reviews, counters, scarcity, and endorsements are deceptive, not “conversion copy.” The FTC identifies fake scarcity, disguised advertising, hidden terms, and interfaces that steer or obstruct as dark patterns. [Regulator: FTC dark-pattern report](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf)
- Hiding price qualifiers, renewal, taxes, seat limits, eligibility, or cancellation until after commitment.
- Writing for an internal org chart rather than visitor tasks.
- Publishing AI-generated copy without fact ownership, source verification, voice editing, or legal review where material.

### Copy diagnostic

After reading only the title, H1, opening paragraph, headings, CTA labels, prices, captions, and form labels, can a new visitor answer: **what is this, is it for me, what is different, why should I believe it, what does it cost or require, and what happens if I act?** If not, the page is not scan-complete.

Do not design toward the famous “F pattern.” Nielsen Norman Group's original eye-tracking synthesis describes F-scanning as one response to weak formatting, low commitment, and efficiency pressure, alongside layer-cake, spotted, marking, bypassing, and committed reading patterns. Use descriptive front-loaded headings, meaningful links, chunks, and visual grouping so visitors can use the stronger patterns; in right-to-left Arabic, the observed F shape mirrors. [Original research: Nielsen Norman Group reading patterns](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)

## Information architecture and page composition

### Shared structure

- Give every page one dominant intent and a small set of legitimate secondary routes. A public page may serve multiple audiences, but it should name or visibly segment them rather than blend incompatible messages.
- Use an informative `<title>`, one page-identifying H1, hierarchical headings, landmarks, and a skip link. Headings are an outline for scanning and assistive navigation, not a font-size system. [WAI: page structure tutorial](https://www.w3.org/WAI/tutorials/page-structure/)
- Put decision-critical facts where the decision is made. Do not send price, billing period, data use, compatibility, availability, or cancellation through tooltip scavenger hunts.
- Sequence detail progressively: concise orientation first, direct routes to deeper evidence, and complete information for evaluators. “Short” is not the universal goal; low information cost is.
- Keep navigation labels stable and task-oriented. Mobile navigation must not erase important routes merely to preserve a visual composition.
- Use breadcrumbs for genuine hierarchy, not decoration. Provide a useful footer as a recovery and trust surface: major routes, legal/privacy, accessibility, status/support, locale, and organizational identity.
- Treat category and listing pages as comparison interfaces. Keep corresponding decision attributes in consistent positions and reveal enough research-backed detail to prevent needless pogo-sticking without turning every card into the full detail page. [Original research: Nielsen Norman Group list entries](https://www.nngroup.com/articles/list-entries/)

### Visual and interaction design

- Establish hierarchy through size, spacing, grouping, contrast, and reading order. Decoration should support—not compete with—the decision.
- Show the thing being sold. Prefer real interface states, product photographs, document excerpts, before/after artifacts, diagrams, or inventory specimens over generic illustration. Label simulations and concept imagery.
- Keep text readable under zoom and reflow. WCAG requires content to work at 400% zoom at an equivalent 320 CSS-pixel width without two-dimensional scrolling except where two dimensions are essential. [Standard: WCAG reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Meet at least WCAG AA contrast: 4.5:1 for normal text and 3:1 for large text; interactive components and meaningful graphics need 3:1 non-text contrast. [Standard: text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- Preserve a visible keyboard focus indicator and never let sticky headers, cookie banners, or overlays fully obscure the focused item. WCAG 2.2 adds focus-not-obscured requirements. [Standard: focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- Make pointer targets at least 24 × 24 CSS pixels or provide the spacing allowed by WCAG 2.2; larger targets are preferable for important actions. [Standard: target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Do not require hover, precise dragging, device motion, or a single pointer gesture when an accessible alternative is possible. [Standard: WCAG input modalities](https://www.w3.org/WAI/WCAG22/#input-modalities)
- Honor `prefers-reduced-motion`; avoid non-essential autoplay and give users pause/stop controls for moving content that begins automatically and lasts more than five seconds. [Standard: pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- Reserve space for images, embeds, banners, and asynchronously loaded components so content does not jump. Never move a CTA as a user is about to activate it.

### Design anti-patterns

- Hero copy rendered inside an image or video, invisible to selection, translation, search, forced colors, and screen readers.
- Carousels for unrelated messages, especially with autoplay, tiny controls, or no pause.
- Scroll hijacking, excessive parallax, cursor replacement, and motion required to reveal essential content.
- Low-contrast gray text, thin type over imagery, gradients that make contrast unknowable, or focus outlines removed for aesthetics.
- Desktop art direction merely squeezed into mobile; critical comparison tables become unreadable and sticky elements consume the viewport.
- Modal interruptions before the visitor understands the page; multiple simultaneous banners, chat widgets, and nags.
- Cards where only an invisible portion is clickable, nested interactive controls, or ambiguous repeated “Learn more” links.

## Accessibility is a release requirement

Target **WCAG 2.2 Level AA** as the baseline, while recognizing that conformance testing alone does not guarantee usability. WCAG is organized around content being perceivable, operable, understandable, and robust. [Standard: WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Minimum implementation contract:

- valid language metadata (`lang`, and `dir` where needed), meaningful document title, landmarks, logical heading structure, skip link, and DOM order matching reading order;
- complete keyboard access with no trap, a visible non-obscured focus state, sensible focus management for dialogs/errors, and no hover-only information;
- text alternatives for meaningful images; empty `alt` for decorative images; captions/transcripts for relevant media;
- controls whose accessible name, role, value, and state are programmatically available; prefer native HTML before ARIA. The first ARIA rule is to use native HTML when it supplies the required semantics and behavior. [W3C: ARIA in HTML](https://www.w3.org/TR/html-aria/)
- no information conveyed only by color, position, sound, or animation;
- browser zoom, text enlargement, increased spacing, high contrast/forced colors, reduced motion, and 320 CSS-pixel reflow without lost content or function;
- status and validation messages exposed to assistive technology without unexpected focus theft;
- authentication that supports password managers and paste; blocking autofill or paste can fail WCAG 2.2 accessible authentication. [Standard: accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)

Automated checks are useful but incomplete. WAI's evaluation guidance explicitly combines tools with human evaluation. Test keyboard-only behavior and representative screen-reader flows, and include disabled users in usability research. [WAI: evaluating accessibility](https://www.w3.org/WAI/test-evaluate/)

## Responsive and resilient behavior

- Start from content priority, not named device breakpoints. Let layouts change where content no longer fits; test narrow width, landscape, zoom, long translations, large text, and virtual keyboards.
- Use flexible grids, logical properties, intrinsic sizing, `min()`/`max()`/`clamp()` where appropriate, and responsive images. Avoid fixed heights on text containers.
- Preserve source order across breakpoints. CSS visual reordering can create a different keyboard and screen-reader sequence.
- Art-direct only when crop meaning changes; otherwise provide responsive candidates with `srcset` and `sizes`. Supply width and height to reserve aspect ratio. [MDN: responsive images](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Multimedia)
- Core content and links should remain available when optional JavaScript, embeds, analytics, chat, personalization, or recommendation services fail. Progressive enhancement starts from functional HTML. [MDN: graceful degradation and progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- Define loading, empty, partial, timeout, offline, and error states for every asynchronous region. A blank pricing widget is a business and accessibility failure.

## Engineering and implementation

### HTML and component contract

- Render meaningful, crawlable HTML for the initial response whenever practical. Use real anchors for navigation and buttons for actions. Do not place click handlers on generic containers.
- Each URL should represent stable content and work with browser back/forward, opening in a new tab, copying, and deep linking.
- Keep components deep enough to centralize semantics, behavior, accessibility, analytics naming, and error handling—not so generic that their interface hides page meaning.
- Keep content separate from presentation while preserving editorial constraints: required proof, character stress tests, ownership, locale, expiry date, and legal qualifiers.
- Avoid shipping a client framework for static prose and decoration alone. Add JavaScript where interaction needs it, split by route/component, and defer non-critical third parties.
- Use CSP, HTTPS, secure dependency practices, output encoding, server-side validation, CSRF protection for state changes, and safe redirect handling. OWASP's cheat-sheet series provides implementation-level controls for XSS, CSRF, CSP, validation, and related web risks. [Primary security guidance: OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- External links opened in a new tab need safe `rel` behavior and should not surprise users; avoid forcing new tabs unless context justifies it.
- Use one document-level `main`; reserve `nav` for major navigation, `article` for independently distributable content, and `section` for thematic groups normally identified by headings. Use links to navigate and buttons to initiate actions. [Standard: WHATWG sections](https://html.spec.whatwg.org/dev/sections.html), [semantics](https://html.spec.whatwg.org/dev/semantics.html)

### Performance and Core Web Vitals

Measure field performance by page type and meaningful segment, not only a laboratory score. Google's current “good” thresholds at the 75th percentile are **LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1**. [First-party guidance: Core Web Vitals thresholds](https://web.dev/articles/vitals)

Practical priorities:

1. Make the LCP resource discoverable in initial HTML; do not lazy-load it. Compress and correctly size images, preload only truly critical resources, and reduce server response delay. [web.dev: optimize LCP](https://web.dev/articles/optimize-lcp)
2. Reduce main-thread blocking: ship less JavaScript, break up long tasks, avoid repeated synchronous work, and keep third-party tags under explicit budgets. [web.dev: optimize INP](https://web.dev/articles/optimize-inp)
3. Reserve dimensions for media and dynamic regions; stabilize font loading and never inject content above existing content without user initiation. [web.dev: optimize CLS](https://web.dev/articles/optimize-cls)
4. Use modern image formats where supported, responsive sources, appropriate quality, and native lazy loading for below-fold images. Lazy loading must not hide content from print, search, or no-script fallbacks when those matter.
5. Subset and self-host fonts when licensing permits, keep families/weights few, use sensible fallbacks, and choose a `font-display` strategy based on the actual brand/readability tradeoff.
6. Cache immutable fingerprinted assets for a long time; set deliberate HTML/API caching and invalidation. Compression and HTTP protocol support are necessary but do not excuse excess bytes.
7. Delay analytics, chat, heatmaps, A/B clients, and embeds until allowed and needed. A tag manager is not a performance budget.

Recommended budgets must be product-specific. A defensible starting gate for a mostly static public page is: no regression in field CWV; compressed initial HTML under 100 KB; critical-path CSS under 50 KB; route-owned initial JavaScript under 150 KB compressed; no unapproved third party; and no image delivered at more than roughly twice its rendered linear dimensions. These byte figures are **inference**, not web standards—set them from audience devices, networks, and an existing baseline.

## Search, sharing, and machine readability

- Give each indexable page a unique, descriptive title and visible H1. Google may generate title links from multiple sources and snippets primarily from page content; metadata influences but does not guarantee presentation. [Google: title links](https://developers.google.com/search/docs/appearance/title-link), [Google: snippets](https://developers.google.com/search/docs/appearance/snippet)
- Provide a stable canonical URL, correct indexability, meaningful internal links, HTTP status codes, sitemap where useful, and redirects for moved content. Do not canonicalize distinct localized or product content to a generic page. [Google: canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- Make essential content and links present in rendered HTML. Google can render JavaScript, but client rendering introduces additional failure modes; test the rendered output with URL Inspection and Rich Results Test. Use fingerprinted resource URLs because Googlebot caches aggressively. [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- Return truthful HTTP status codes: `200` for valid content, server-side `301`/`308` for permanent moves, and `404`/`410` for missing content. Avoid SPA soft 404s. `robots.txt` controls crawling, not reliable removal from results; an indexable blocked URL may still appear without a snippet. Permit crawling and use `noindex` metadata or `X-Robots-Tag` when removal is intended. [Google: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [robots meta tags](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- Add structured data only for supported types, matching visible page truth. JSON-LD is Google's recommended format, but markup only creates eligibility, not a guaranteed rich result. [Google: structured-data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- Supply representative social preview metadata and images; test the actual unfurl. Keep important words out of the preview image because crops and accessibility vary.
- Do not create doorway pages, hidden text, keyword-stuffed headings, fake FAQ content, or markup for absent/review-manipulated content. SEO should improve retrieval and understanding, not distort the page.

## Forms, signup, and lead generation

- Ask only for data necessary for the stated task. Know the operational or legal reason for each question, mark optional fields explicitly, and explain sensitive requests. [WAI: accessible forms](https://www.w3.org/WAI/tutorials/forms/), [GOV.UK: question pages](https://design-system.service.gov.uk/patterns/question-pages/)
- Give every control a persistent visible label programmatically associated with it. A placeholder is an example or hint, not a label. Group related controls with `fieldset` and `legend`. [WAI: form labels](https://www.w3.org/WAI/tutorials/forms/labels/)
- Use the correct input type and autocomplete token; permit paste and password managers. Accept harmless formatting variation rather than imposing brittle name, phone, or address assumptions.
- Validate on the server. Client validation may provide faster feedback but must not be the only enforcement. Avoid errors while the user is still typing unless research demonstrates the need.
- On invalid submission, preserve values; prefix the page title with “Error”; focus an error summary linking to fields; provide concise, specific inline messages associated with each input; never communicate the problem through color alone. [GOV.UK: validation](https://design-system.service.gov.uk/patterns/validation/), [WAI: form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)
- For consequential submissions, provide a review/edit step and a precise final action label. Confirmation should state completion, reference if applicable, next steps and timing, and support. [GOV.UK: check answers](https://design-system.service.gov.uk/patterns/check-answers/), [confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/)
- Make duplicate submission safe, show a pending state, and define retry behavior. Never erase input after a network error.

## Privacy, consent, commercial fairness, and security

- Inventory every first- and third-party request, cookie, storage write, identifier, purpose, recipient, retention period, and legal basis before deployment. Minimize collection and document ownership.
- In jurisdictions requiring it, do not set or read non-essential cookies before valid consent. ICO guidance says analytics cookies are not strictly necessary; describe purposes and third parties. [Regulator: ICO cookies guidance](https://ico.org.uk/media2/kz0doybw/guidance-on-the-use-of-cookies-and-similar-technologies-1-0.pdf)
- Refusal must be as easy as acceptance, and interfaces must not visually privilege consent. Consent must be freely given, specific, informed, unambiguous, and affirmative. [Regulator: CNIL cookies and trackers](https://www.cnil.fr/en/cookies-and-other-tracking-devices-cnil-publishes-new-guidelines)
- Provide granular choices where purposes differ, no prechecked boxes, a durable record of consent state/version, and an always-discoverable withdrawal route. Stop future collection after withdrawal.
- Disclose controller, purpose, required/optional status and consequences, recipients, rights, and transfers before collection as applicable. [Regulator: CNIL information for individuals](https://www.cnil.fr/en/rights-and-obligations)
- Show total price, billing cadence, renewal or trial end, cancellation, and material limits adjacent to commitment. Obtain informed affirmative agreement and make cancellation easy. [Regulator: FTC subscription enforcement policy](https://www.ftc.gov/news-events/news/press-releases/2021/10/ftc-ramp-enforcement-against-illegal-dark-patterns-trick-trap-consumers-subscriptions)
- Never use preselected add-ons, fake timers or scarcity, confirmshaming, disguised advertisements, sneaked costs, hidden cancellation, or repeated coercive prompts after refusal.

Exact legal duties depend on jurisdiction, audience, data flow, and sector. This is a strong product baseline, not jurisdiction-specific legal advice.

## Analytics and experimentation

Create a measurement plan before instrumentation:

- define the visitor decision and funnel in domain language;
- choose one primary task metric and downstream quality metrics (activation, qualified lead, retained use, cancellation/refund, support burden), not clicks alone;
- include guardrails for accessibility failure, errors, latency, privacy refusal/withdrawal, complaints, accidental enrollment, reversals, and inequitable segment effects;
- define event names, properties, identity rules, consent requirements, retention, sampling, bot/internal-traffic handling, owner, and version;
- validate events against actual server outcomes. A button click is not a submitted form, paid order, or successful activation.

For experiments, pre-register hypothesis, population, unit of randomization, primary metric, minimum detectable effect or sample rationale, stopping rule, duration, exclusions, and guardrails. Check assignment and telemetry before reading outcomes. Report uncertainty and practical effect, not merely a thresholded p-value. A/B tests are suitable for specific variant effects, not proof of a whole strategy or explanation of *why* it worked. [UK Government: Test and Learn guidance](https://www.gov.uk/government/publications/the-magenta-book/guidance-for-using-test-and-learn-approaches)

Do not test deception, missing disclosures, unequal consent, inaccessible variants, or obstructed cancellation. A conversion “winner” that harms downstream quality or protected/assistive-technology segments does not ship.

## Localization and internationalization

- Internationalize the data and layout model before translation: Unicode, locale-aware dates/numbers/currency/plurals, time zones, names and addresses, text expansion, bidirectional text, and locale fallback.
- Set the document language and mark language changes. Use `dir="rtl"` at the appropriate root and CSS logical properties; do not mirror media, icons, charts, or controls whose direction has semantic meaning without review. [W3C Internationalization: structural markup and text direction](https://www.w3.org/International/questions/qa-html-dir)
- Avoid concatenated UI fragments. Give translators whole messages with context, variables, screenshots, character constraints, and plural/select variants.
- Keep text out of raster images and videos, or provide localized alternatives. Design for expansion rather than truncating translations.
- Use stable locale URLs and `hreflang` for alternate localized versions; let users change language and preserve their destination. Do not force language solely from IP. [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- Localize claims, evidence, price/tax/availability, legal text, support channels, forms, validation, metadata, structured data, and social previews—not only body copy.
- Run linguistic, functional, visual, accessibility, and legal review in representative locales, including RTL and long-string pseudo-locales.
- Use ECMA-402/`Intl` or an equivalent locale-aware library for dates, numbers, currency, lists, and plural-sensitive messages rather than hand-built string templates. Unicode CLDR supplies the underlying locale data used by many platforms. [Standard: ECMA-402](https://tc39.es/ecma402/), [Unicode CLDR](https://cldr.unicode.org/)
- For user-supplied text of unknown direction, use `dir="auto"` or isolate inline runs with `<bdi>` so punctuation and surrounding order remain stable. Do not use CSS alone to set semantic base direction. [W3C: inline bidirectional markup](https://www.w3.org/International/articles/inline-bidi-markup/)

## Browser, device, and failure-state QA

An emulated viewport is not a device strategy. Automate critical smoke journeys across Chromium, Firefox, and WebKit projects, desktop and mobile profiles, then manually verify high-risk flows on current iOS Safari and Android Chrome. Playwright documents that its device profiles emulate viewport, user agent, screen size, scale, touch, locale, and related settings; that remains emulation. [First-party tooling guidance: Playwright browsers](https://playwright.dev/docs/browsers), [device emulation](https://playwright.dev/docs/emulation)

Test continuously around layout breakpoints, not only at named device widths. At minimum cover 320, 375/390, 768, 1024, 1280, and 1440 CSS pixels; portrait and landscape; 200% text enlargement; 400% zoom/reflow; keyboard-only; reduced motion; forced colors; and representative screen readers. Exercise navigation, disclosure/menu/dialog behavior, every CTA, form error/success, consent choice/withdrawal, downloads, media, and locale switching.

Failure fixtures belong in the test suite: JavaScript disabled or an enhancement bundle rejected, slow network, missing image/font, third-party blocked, API timeout, empty result, partial data, duplicate submit, stale cache, expired campaign, consent denied, and analytics unavailable. Release with no uncaught console errors, failed critical requests, broken internal links, duplicate IDs, invalid label associations, or unexplained severe automated accessibility findings. Visual regression baselines should include interactive states, long copy, RTL, and narrow/wide layouts; review intentional diffs individually.

## Page-type playbooks

| Page type | Primary job | Must answer / show | Frequent failure |
|---|---|---|---|
| Homepage | Route mixed visitors and establish the product/category | What, for whom, differentiated outcome, credible demonstration, major audience/task routes, trust and next actions | Trying to explain the entire company in one undifferentiated scroll |
| Campaign landing page | Continue a specific promise from an ad/email/referral | Message match, offer, qualification, evidence, material terms, focused action, fallback/navigation appropriate to risk | Removing all exits while hiding context; measuring raw leads instead of qualified outcomes |
| Product / feature | Help visitors understand capability and fit | User job, mechanism, realistic product state, setup/constraints, integration/security links, related features, CTA | Decorative screenshots and feature adjectives with no task narrative |
| Pricing | Support comparison and buying-mode choice | Exact price, currency, unit, period, tax/usage/seat qualifications, plan audience, included limits, add-ons, comparison, contact path | “Contact us” everywhere; ambiguous “from”; annual price shown without cadence; unavailable full comparison |
| About | Establish identity and accountability | Purpose, origin, current factual snapshot, leadership/ownership, dated milestones, press/careers/contact routes | Manifesto without verifiable facts or accountable people |
| Contact / sales | Route the request and set expectations | Channel options, geography/language, availability, response expectation, requested data and why, privacy, emergency/support alternative | One long form for every request; no confirmation or response time |
| Signup | Create an account with minimum friction and informed consent | Value/context, minimal fields, identity alternatives, password-manager support, terms at commitment, errors and recovery, verification next step | Forced marketing opt-in, password rules revealed late, blocked paste, JS failure leaves no usable explanation |
| Docs–marketing hybrid | Help an evaluator or developer complete a real task | Task routes, concept plus executable example, version/prerequisites, copyable code, errors/limits, API/reference links, support | Marketing claims where an answer should be; stale snippets; examples detached from constraints |

## Deconstruction of exemplary public pages

These are specimens, not universal templates. **Observed** describes the live official page on 2026-08-20. **Inference** identifies a reusable hypothesis. The linked page proves structure/content, not business effect.

### Linear homepage — workflow narrative

**Observed:** [Linear](https://linear.app/) uses a category-and-audience H1, a concise qualifier, realistic product UI, and sections that follow a product-development workflow from intake and planning through building, review, and monitoring. Each section joins outcome copy, UI evidence, and deeper routes; customer quotations and changelog freshness appear later. Self-serve, sales, app, and download actions coexist.

**Inference:** A complex product homepage can be a guided job sequence rather than a bag of feature cards. Believable domain data makes UI evidence stronger. **Caution:** the page is long and visually dense; repeated motion and media require performance, reduced-motion, and cognitive-load testing.

### Vercel homepage — umbrella promise with use-case lanes

**Observed:** [Vercel](https://vercel.com/) leads with an umbrella platform claim and self-serve/sales CTAs, then partitions proof into major use cases with named customer evidence and compact capability lists. A “recently shipped” area signals freshness; a deep footer acts as a sitemap.

**Inference:** A broad platform needs a current organizing promise followed by a few recognizable evaluation lanes. **Caution:** rotating or visually composed hero sentences can become awkward when flattened by extraction, translation, no-script rendering, or assistive navigation.

### GitHub pricing — layered decision detail

**Observed:** [GitHub pricing](https://github.com/pricing) states plan audience and price/unit/period, uses inheritance language, and distinguishes self-serve from sales actions. Add-ons, a calculator, and full comparison follow summary cards. During text-crawl observation, several dynamic feature regions emitted reload errors while core plan content remained.

**Inference:** Layer pricing as decision summary → add-ons/estimator → complete comparison, and server-render the core facts so component failure does not erase the offer. **Caution:** trial promotion and a very large comparison surface increase information and maintenance cost.

### Linear and Slack feature indexes — routing rather than over-selling

**Observed:** [Linear features](https://linear.app/features) groups terse feature summaries by lifecycle and links to detail. [Slack features](https://slack.com/features) expands into task questions and security/data answers, includes sales/self-serve actions, and exposes region/language selection.

**Inference:** A feature index should route exploration; deep pages can persuade with mechanisms and evidence. Put high-stakes security claims beside detailed, maintained trust material rather than leaving them as broad marketing assertions.

### Airbnb About — maintained facts and chronology

**Observed:** [Airbnb About](https://news.airbnb.com/about-us/) combines origin and present-scale prose, named founders and roles, a dated “fast facts” snapshot, and a year-by-year timeline.

**Inference:** About pages serve journalists, candidates, partners, and customers better when identity narrative is paired with accountable people, dated facts, and chronology. **Caution:** first-party scale figures remain first-party claims and may need external validation for due diligence.

### HubSpot contact sales — channel and locale choice

**Observed:** [HubSpot contact sales](https://offers.hubspot.com/contact-sales) exposes chat, demo form, and telephone routes; numbers are organized by region/language; the form states its intended outcome and retains legal/privacy/security/accessibility links.

**Inference:** Contact should support channel preference and geography while explaining what happens after collection. **Caution:** unavailable synchronous channels need a clear asynchronous fallback and response-time expectation.

### GitHub signup — identity choice and field-level help

**Observed:** [GitHub signup](https://github.com/signup) offers Google and Apple identity paths plus email, marks required fields, places username constraints near the field, asks region explicitly, and states that JavaScript is required.

**Inference:** Keep signup to a few recognized identity routes plus an owned path; explain constraints at the field. **Caution:** JavaScript-only signup is a resilience risk, and a country picker requires keyboard, screen-reader, and focus testing that text observation cannot verify.

### Stripe Docs — documentation as product proof

**Observed:** [Stripe Docs](https://docs.stripe.com/) routes by task/product. Articles combine concepts, dashboard/API paths, language variants, request/response examples, constraints, notes, and cross-links. Its [price-management guidance](https://docs.stripe.com/products-prices/manage-prices) recommends lookup keys rather than hard-coded price IDs and caching to limit latency and rate-limit pressure.

**Inference:** Developer pages persuade through successful task completion. Lead with the job, combine conceptual and executable paths, keep constraints near code, and connect displayed commercial data to a single source of truth.

### Tailwind Plus — inventory as evidence

**Observed:** [Tailwind Plus](https://tailwindcss.com/plus) shows categorized inventory and counts, use-case-named templates, production-like specimens, and pricing that states one-time payment, tax qualification, individual/team scope, and seat limits near the offer.

**Inference:** For catalog products, browseable architecture and actual specimens substantiate value better than “professionally designed” adjectives. License scope and payment terms belong at the decision point.

### Apple iPhone — inspiration plus purchase logistics

**Observed:** [Apple iPhone](https://www.apple.com/iphone/) combines model merchandising, comparison, buying help, trade-in/carrier topics, ecosystem routes, and linked legal footnotes, with imagery carrying much of the narrative.

**Inference:** A high-consideration physical-product family page must support inspiration, comparison, and transaction logistics. **Caution:** media-heavy motion-led storytelling is expensive to reproduce responsibly; verify source order, alt text, reduced motion, responsive crops, payload, and LCP rather than copying the surface treatment.

## End-to-end production workflow

1. **Discover:** interview customers/support/sales, inspect search and behavioral data under a valid privacy basis, collect vocabulary and objections, and identify page intent.
2. **Brief:** record the governing model above, page owner, evidence inventory, measurement plan, legal constraints, performance budget, locales, and expiry/review date.
3. **Structure:** draft the scan path and semantic outline before polished prose or comps. Map every claim to evidence and every CTA to its resulting state.
4. **Write:** produce title/description, H1/opening, headings, body, evidence captions, links, CTAs, form and error copy, confirmations, structured-data inputs, social copy, and localization notes as one system.
5. **Design:** test hierarchy in grayscale and at narrow width; use real copy/data; design loading/error/empty/consent/focus/zoom/reduced-motion/long-locale states.
6. **Build:** semantic server-rendered or statically rendered HTML where practical, progressively enhanced interaction, constrained dependencies, responsive media, secure forms, and consent-aware telemetry.
7. **Verify:** run content, accessibility, responsive, browser, performance, SEO, privacy/security, analytics, and operational reviews using the acceptance matrix below.
8. **Release:** deploy gradually when risk justifies it; monitor errors, CWV, task outcomes, lead/order quality, consent behavior, support burden, and segment harm.
9. **Maintain:** name owners and review dates for claims, screenshots, prices, legal copy, links, integrations, structured data, translations, and test assumptions. Remove stale pages or redirect intentionally.

## Measurable acceptance matrix

| Area | Release gate |
|---|---|
| Purpose | Five uninvolved target users can identify what the page offers, intended audience, primary next step, and material commitment after a short scan; record failures and revise |
| Claims | Every material claim has an owner, evidence reference, scope/qualification, and review date; no fabricated or unapproved proof |
| Content | Unique title and H1; meaningful outline; descriptive link/CTA labels; prices and constraints adjacent to decisions; no broken or placeholder copy |
| HTML | Core content, navigation, primary CTA, pricing/material terms, and form instructions exist in meaningful HTML; page remains understandable when optional JS/third parties fail |
| Accessibility | WCAG 2.2 AA audit with zero known A/AA failures; keyboard-only task pass; representative screen-reader pass; 200% text and 400%/320-CSS-pixel reflow; reduced-motion and forced-colors checks |
| Interaction | No keyboard trap; focus visible and not obscured; target size/spacing passes; dialogs and menus have native-equivalent behavior; async states and retry paths tested |
| Forms | Visible associated labels; documented purpose for every field; server validation; values preserved; linked summary plus inline text errors; safe duplicate submit; durable confirmation and next step |
| Responsive | Required task works at narrow/landscape/zoom/virtual-keyboard states and with longest supported locale; no clipped content, hidden control, accidental horizontal scroll, or source-order mismatch |
| Performance | 75th-percentile field LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 for sufficient samples; lab budgets and slow-device/network critical path pass before field data exists; no unapproved third party |
| SEO | Correct 2xx/redirect/404 behavior, indexability, canonical, unique title/H1, internal discovery, sitemap as applicable, rendered content, valid supported structured data matching visible content, and representative preview |
| Privacy | Data/third-party inventory approved; no non-essential storage or beacon before required consent; accept/reject parity; granular choice and withdrawal verified; retention/deletion and rights routes documented |
| Security | HTTPS; dependencies scanned; CSP and headers reviewed; server-side validation/output encoding/CSRF as applicable; secrets absent from client; abuse/rate-limit and safe redirect/upload behavior tested |
| Localization | Language/direction metadata, locale formats, expansion and RTL, metadata/social/structured data, forms/errors, claim availability, legal copy, and language-switch behavior reviewed in representative locales |
| Analytics | Event QA agrees with server outcomes; consent enforcement proven in network inspection; bot/internal traffic rules documented; dashboard segments errors, accessibility-relevant failures, and downstream quality |
| Operations | Named owner, rollback, monitoring/alerts, form delivery and CRM routing test, support route, expiry/review dates, and broken-link/content checks |

## Fast anti-pattern audit

Stop and investigate when any of these are true:

- a screenshot cannot tell what the company offers without the logo;
- the H1 is an adjective-rich slogan while the category appears below the fold;
- claims lack dates, definitions, scopes, or evidence;
- a CTA hides cost, renewal, data use, or what happens next;
- the mobile layout removes information available on desktop;
- content order changes visually but not in the DOM;
- focus is invisible or covered by sticky UI;
- a carousel, video, animation, chat widget, or cookie banner controls the experience;
- primary content or pricing disappears when JavaScript or an API fails;
- the LCP image is lazy-loaded or the page ships large route JavaScript for static content;
- the form asks questions no owner can justify;
- errors clear input, appear only in color, or are not announced;
- reject/withdraw/cancel is harder than accept/signup;
- a test is called successful from CTA clicks alone;
- localized pages translate words but not price, availability, form assumptions, metadata, or legal meaning;
- no one owns the page after launch.

## Evidence and source-quality ledger

| Source family | Quality and authority | Used for | Limits |
|---|---|---|---|
| W3C WAI / WCAG / ARIA | Normative web accessibility standards plus official explanatory techniques | Accessibility, semantics, forms, input, reflow, motion | Conformance does not guarantee usability; Understanding pages are informative, not normative |
| WHATWG / MDN | Living platform standard and high-quality browser documentation | HTML/CSS behavior, progressive enhancement, responsive media | MDN is explanatory and may lag edge cases; verify browser support for new features |
| web.dev / Chrome | Browser-vendor guidance grounded in web-platform telemetry | CWV definitions and optimization | Thresholds and browser behavior evolve; field context matters |
| Google Search Central | Search engine's first-party crawling/indexing guidance | Rendering, canonicals, metadata, structured data, international SEO | Describes Google, not all search engines; eligibility is not ranking or display guarantee |
| GOV.UK Design System / Content guidance | Public, researched government service patterns | Content, form validation, review, confirmation | Patterns were developed for government services; adapt language and risk to context |
| USWDS | Official US government design-system guidance | Plain language, accessible/public-service design | Not evidence that a component fits every commercial context |
| FTC / ICO / CNIL / EDPB | Regulators and enforcement/guidance bodies | Dark patterns, subscriptions, consent, privacy transparency | Jurisdiction and fact pattern matter; obtain legal advice for exact obligations |
| OWASP | Expert-maintained primary application-security guidance | Implementation controls | Threat modeling and product-specific review still required |
| UK Government evaluation guidance | Official methods guidance | Experiment design and limitations | Not a substitute for statistical review of a specific experiment |
| Live official company pages | First-party evidence of current observable implementation | Deconstruction specimens | Mutable, personalized, not independent, and no causal performance proof |

## Research limitations

- This is a broad synthesis, not a substitute for page-specific user research, threat modeling, legal advice, content verification, or an accessibility conformance report.
- Live-page observations were based on publicly retrievable content on the research date. They do not verify every breakpoint, browser, personalized variant, animation, focus order, screen-reader announcement, request payload, or field CWV distribution.
- “Best practice” is conditional. Visitor risk, decision complexity, regulation, brand maturity, traffic source, device/network distribution, and operating model can reverse a local recommendation.
- Conversion benchmarks from unrelated companies are not portable. Prefer a clear baseline, controlled changes, downstream outcomes, and harm guardrails.

## Primary reference index

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [WAI evaluation resources](https://www.w3.org/WAI/test-evaluate/)
- [WAI page structure](https://www.w3.org/WAI/tutorials/page-structure/) and [forms tutorials](https://www.w3.org/WAI/tutorials/forms/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [GOV.UK content design](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) and [Design System patterns](https://design-system.service.gov.uk/patterns/)
- [USWDS plain-language guidance](https://designsystem.digital.gov/documentation/plain-language/)
- [web.dev Core Web Vitals](https://web.dev/articles/vitals)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials) and [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [ICO cookie guidance](https://ico.org.uk/media2/kz0doybw/guidance-on-the-use-of-cookies-and-similar-technologies-1-0.pdf)
- [FTC dark-pattern report](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
