# Check technical SEO foundations

Select checks by the affected templates, markets, and business paths. Start with important pages and representative template variants. Expand when a shared defect warrants it. Record sample size and unexplored scope.

## Crawl, indexability, and delivery

1. Verify the canonical origin, protocol, base path, and slash policy. Inspect HTTP statuses and complete redirect chains.
2. Inspect robots.txt, meta robots, X-Robots-Tag, canonical signals, sitemap membership, and CDN or authentication restrictions together.
3. Compare initial HTML with rendered content. Confirm that primary content and crawlable anchor links exist without user interaction. Check resource failures and mobile rendering where relevant.
4. Compare canonical, sitemap, redirect, and internal-link signals. Separate duplicate alternatives, intentionally excluded pages, soft 404s, and accidental conflicts.
5. Use owner index evidence when available. A 200 response and indexable directives prove neither crawling nor indexing. A robots block can prevent a crawler from seeing noindex.

Do not enforce a universal three-click limit. Prioritize discovery paths, contextual relevance, and business importance. A sitemap supplements internal discovery and does not establish an internal link.

## Content and structured data

Check that titles, descriptions, headings, main content, and landing-page intent describe the actual offer. Inspect protected queries before changing an established page. Shared query coverage alone does not prove cannibalization.

Choose structured data supported by the visible page and applicable search feature. Validate syntax, required properties, entity identity, and visible-content agreement. Eligibility is distinct from receiving a rich result. Avoid fake ratings, unsupported claims, and irrelevant FAQ markup.

For Google AI Overviews and AI Mode, ordinary search and snippet eligibility apply. [Google documents no special AI schema or mandatory AI text file](https://developers.google.com/search/docs/appearance/ai-features). Do not extend Google's requirements to every AI platform. Verify other crawlers' current documentation before changing access policies.

## Performance

Use field Core Web Vitals at the 75th percentile where available, segmented by device and page group. [Good thresholds](https://web.dev/articles/vitals) are LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1. Verify current official guidance before relying on these thresholds in a live audit.

Use lab measurements to investigate render-blocking work, image loading, interaction delays, and unstable layout. Record tool version, device, network, runs, and variability. A Lighthouse score and TBT cannot establish field INP or a field pass. Missing field data remains missing.

## International and local sites

For international pages, check language/region targeting, reciprocal and self-referencing hreflang, canonical agreement, valid locale destinations, and x-default when appropriate. Preserve valid regional alternatives. Avoid redirects that prevent access to another language.

For local businesses, verify real identity, name, address, phone, hours, service area, landing-page value, and Business Profile consistency. Use only locations the business actually serves. Keep listing changes and review responses within authorized account scope.

## Measurement and acceptance

Check organic landing-page attribution, conversion definitions, consent behavior, duplicate events, referral exclusions, and release annotations. Separate traffic metrics from qualified leads and revenue. Missing instrumentation is an owned measurement task.

For each defect, specify affected URLs or templates, observed mismatch, supported cause, priority, and the check that passes after correction. Preserve accessibility, conversion journeys, localized routes, privacy controls, and performance during SEO fixes.
