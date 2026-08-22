# Release and operations

## Portfolio discovery

Inventory public URLs and templates with page family, audience/job, owner, source of truth, legal or reputational risk, index rule, locale/version, claims, data flows, success measure, guardrails, and last review.

Identify duplicates, orphans, expired campaigns or jobs, broken links, thin generated pages, inconsistent claims, unsupported locales, dead analytics, and abandoned integrations. Decide `keep | improve | merge + 301 | retire + 404/410`. Redirect only to a close replacement.

## Evidence gate

Before polished production, require:

- governing brief and page-family contract;
- approved offer, boundaries, claims, evidence, and qualifications;
- primary action, alternatives, failure and recovery routes;
- content, legal, privacy, security, accessibility, locale, and operational constraints;
- source-of-truth and ownership model;
- success outcome, downstream quality measures, and harm guardrails;
- performance and third-party budgets;
- expiry, review date, and change triggers.

Delete, qualify, or visibly mark unresolved claims. Do not use design polish to imply unavailable proof.

## Prototype and comprehension gate

Prototype the semantic hierarchy before surface polish using real copy and representative data. Include narrow, wide, zoom, keyboard, long translation, RTL, loading, empty, error, expired, slow-network, and blocked-third-party states.

Ask representative users to identify what the page is, who it is for, why to believe it, the price or conditions, and what happens next—and to complete the intended task. Record misunderstandings and revise.

## Build gate

- meaningful initial HTML and progressive enhancement;
- shared semantic and content components;
- correct statuses, canonicals, indexing rules, and visible-truth structured data;
- resilient and idempotent forms or transactions;
- consent-aware, deduplicated instrumentation tied to server outcomes;
- performance budgets and reviewed dependencies;
- owned content, claims, translations, and integrations;
- tested failure and recovery paths.

## Pre-release evidence

| Area | Required evidence |
|---|---|
| Purpose and content | Brief match, factual claims, exact offer/price/date, scan completeness, working links, owner/source/review metadata |
| Functional | Primary and secondary paths, validation, failure/retry, back/refresh/double action, session expiry, and downstream email/CRM/payment delivery |
| Accessibility | Automated scan plus keyboard, focus, representative screen-reader journey, zoom/reflow, headings/names, contrast, errors/status, reduced motion, and forced colors |
| Responsive and browser | Narrow/wide, touch/pointer, real critical devices, Chromium/WebKit/Firefox, virtual keyboard, long and RTL text |
| Performance | Lab regression, route budgets, LCP resource path, third-party review, and field/RUM plan |
| Search | Status, rendered HTML, crawlable links, title/snippet, canonical/hreflang, index rule, sitemap/robots, redirects, and structured-data validation |
| Privacy/security/legal | Actual pre/post-choice requests, rejection/withdrawal, applicable privacy signals, PII leakage, headers/CSP, input/session/access behavior, and claim/terms approval |
| Analytics | Events fire once under correct consent, agree with server outcomes, preserve intended attribution, and populate owned dashboards/alerts |
| Operations | Owner, rollback, monitoring, support route, expiry/review triggers, and broken-link/content checks |

Name the tool, date, route/state, result, and limitation for recorded evidence. Never fabricate manual checks.

## Staged release

Release a representative slice when risk or scale justifies staging. Inspect rendered pages, critical journeys, downstream delivery, logs, field performance, consent, indexing, and structured data before scaling.

For experiments, preserve assignment, validate sample ratio and telemetry, run across relevant cycles, measure downstream quality and harms, and retain null or negative results. Do not call a before/after observation an A/B test.

## Operate and retire

Continuously monitor availability, errors, broken journeys, qualified outcomes, field performance, consent/tag drift, security, search coverage, support gaps, and mutable claims.

Trigger immediate review after changes to product, price, policy, API, brand, legal requirements, organization, evidence, vendors, incidents, or supported locales. Use risk-based schedules for facts, people, jobs, screenshots, documentation, structured data, accessibility, and integrations.

On retirement, update internal links, stop campaigns, remove the URL from sitemaps and structured data, preserve required records, clean up data collection and integrations, and return an honest close redirect or 404/410.

