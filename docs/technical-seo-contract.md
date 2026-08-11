# Discovery Site technical SEO and measurement contract

This note resolves the research question in GitHub issue #7 for the planned, fully prerendered SvelteKit Discovery Site.
It turns primary-source guidance into build, deployment, and operating checks for `https://skills.lab.sa` without
pretending that search placement can be guaranteed.

The words **must**, **should**, and **may** distinguish the strength of this contract:

- **Requirement — must:** a release or deployment acceptance gate.
- **Recommendation — should:** evidence-backed guidance that may be deferred with a recorded reason.
- **Project decision:** a concrete interpretation chosen for LAB Skills; change it through a later decision record, not
  through an incidental implementation detail.

## Scope, target market, and goal

**Project decision:** The first release serves a global, English-reading technical audience: developers, designers,
product practitioners, and AI-agent users looking for reusable agent instructions and delivery playbooks. The `.sa`
domain identifies LAB; it does not make Saudi Arabia the sole search market. Pages must use `lang="en"`, titles and
visible content must use the same language, and the site must not add geographic targeting. `hreflang` is unnecessary
while there is only one language version; it becomes a requirement only when genuine localized variants exist. Google
recommends `hreflang` for alternate language or regional pages, not for a single English corpus
([localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions)).

The site has one primary purpose: help people discover, evaluate, and apply public LAB Skills and Recipes. Each
indexable page type owns one intent:

| Page type | Human and search intent | Required primary content |
| --- | --- | --- |
| Home / Skill catalog | Discover stable agent Skills by need | What a Skill is, complete browsable catalog, categories, concise descriptions |
| Skill detail | Evaluate, install, and apply one named Skill | Source-backed description, install action, complete instructions, package contents, related resources |
| Recipe index | Discover sequenced delivery playbooks | What a Recipe is and a complete browsable Recipe catalog |
| Recipe detail | Understand and follow one named delivery sequence | Outcome, ordered stages or steps, participating Skills, complete source-backed guidance |
| Compatibility alias | Preserve an old inbound URL | The same content and a clear route to its clean canonical; no independent intent |
| Not found | Recover from an invalid URL | Clear not-found message and crawlable routes back into the catalog |

Content must be useful without a search engine: it must answer the stated intent, render the canonical Source Content,
and avoid invented word counts, keyword stuffing, or freshness dates. This follows Google's focus on a clear site
purpose, descriptive headings, demonstrated value, and people-first content
([people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

## Current-state audit — 2026-08-11

This is baseline evidence, not evidence that the future contract passes.

- `https://skills.lab.sa/` returns HTTP `200`. Its root `robots.txt` allows crawling and points to the canonical sitemap.
- The deployed sitemap contains the legacy `/recipes.html` and `/recipe.html` URLs rather than the accepted clean Recipe
  routes.
- `https://labdotsa.github.io/skills/` currently returns HTTP `404`; the backup is not deployed.
- The local Publication Artifact contains 10 HTML files. All 10 have a title, description, canonical, and one `h1`; none
  contains JSON-LD.
- `site/index.html` and `site/recipes.html` contain no prerendered links to Skill details. Catalog rows are inserted by
  client JavaScript, so the source HTML does not provide the crawlable discovery path required below.
- `site/404.html` duplicates the home page, canonicalizes to `/`, and has no `noindex` rule.
- No analytics tag or Core Web Vitals real-user monitoring is present.

## Crawl, status, indexation, and canonical contract

Google requires crawlable links to be real `<a href>` elements and recommends at least one internal link to every page
that matters ([link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)). Google also
recommends self-referential canonicals, absolute canonical URLs, consistent internal links, and the same canonical set
in the sitemap ([canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).
Every intended canonical is required to be publicly reachable, return `200`, and contain indexable content; eligibility
does not guarantee indexing ([Search technical requirements](https://developers.google.com/search/docs/essentials/technical)).

### URL matrix

| Surface | HTTP result | Robots meta | Canonical | In canonical sitemap |
| --- | --- | --- | --- | --- |
| `https://skills.lab.sa/` | `200` | indexable; no `noindex` | self | yes |
| `https://skills.lab.sa/skills/<name>/` | `200` | indexable; no `noindex` | self | yes |
| `https://skills.lab.sa/recipes/` | `200` | indexable; no `noindex` | self | yes |
| `https://skills.lab.sa/recipes/<slug>/` | `200` | indexable; no `noindex` | self | yes |
| `/recipes.html` | `200` compatibility page | no `noindex` on canonical production | `/recipes/` | no |
| `/recipe.html` | `200` compatibility page | no `noindex` on canonical production | `/recipes/functional-prototype/` | no |
| Unknown canonical-host URL | real `404` | `noindex` | none | no |
| Equivalent GitHub Pages HTML under `/skills/` | `200` when deployed | `noindex,follow` | matching URL on `https://skills.lab.sa` | no |
| Netlify deploy preview HTML | `200` when valid | `noindex,follow` | matching URL on `https://skills.lab.sa` | no |

**Requirements:**

1. Every catalog and detail page must be complete in the initial prerendered HTML. Filtering, copy controls, and other
   enhancement may hydrate; titles, descriptions, headings, visible primary content, JSON-LD, and catalog/detail links
   must not depend on hydration, interaction, or a second data request.
2. Every canonical page must be reachable from another canonical page through a descriptive `<a href>`. Every detail
   must be at most two link transitions from home: home to Skill detail, or home to Recipe index to Recipe detail.
3. Canonical URLs must be absolute HTTPS URLs on `skills.lab.sa`, contain no query or fragment, use the accepted trailing
   slash, and occur exactly once in valid prerendered `<head>` HTML. JavaScript must not change them.
4. Internal navigation and sitemap entries must target only clean canonical URLs. Compatibility aliases remain physical
   pages for cross-host parity, carry only their clean target as `rel="canonical"`, and are not navigation or sitemap
   targets. Do not add `noindex` to aliases on canonical production; Google recommends `rel="canonical"`, rather than
   `noindex`, for duplicates within a site.
5. The canonical sitemap must be generated from the same validated Catalog as the routes. It must contain each and only
   each indexable canonical URL once, use fully qualified URLs, remain UTF-8 encoded, and stay at or below 50 MB
   uncompressed and 50,000 URLs. Omit `lastmod` unless it reflects a verifiable significant content change; do not emit
   build time as freshness. Google treats sitemap submission as a hint, not a guarantee
   ([sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
6. Canonical production `robots.txt` must be UTF-8 plain text at `/robots.txt`, allow the HTML and assets needed to
   render every indexable page, advertise `https://skills.lab.sa/sitemap.xml`, and remain at or below Google's 500 KiB
   parsing limit. `robots.txt` controls crawling, not indexation; it must never be used to implement `noindex`
   ([robots guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro),
   [robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)).
7. Unknown URLs must return a real `404`, not a `200` home-page copy. The useful custom 404 must have `noindex` and no
   canonical. Google identifies `200` error pages as soft 404s
   ([soft-404 guidance](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)).
8. GitHub Pages and previews must remain crawlable so crawlers can observe page-level `noindex`; blocking those HTML
   paths in `robots.txt` would prevent Google from seeing the rule
   ([noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing)).

### GitHub Pages robots constraint

**Requirement and implementation constraint:** A file at `https://labdotsa.github.io/skills/robots.txt` is not an
authoritative robots file because robots rules are valid only at a host's top-level `/robots.txt`; crawlers do not check
subdirectories ([Google's robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)).
The backup's HTML-level `noindex` is therefore the enforceable control available to this repository.

Non-HTML Pages copies such as `skills.json`, `recipes.json`, and `sitemap.xml` cannot receive a meta robots rule, and
GitHub Pages cannot attach a per-file `X-Robots-Tag`. The non-indexable build must omit those duplicate machine endpoints
unless the owner of `https://labdotsa.github.io/robots.txt` adds and verifies rules for `/skills/`. This is an
indexability difference controlled by `SITE_INDEXABLE`, not a second application source. The canonical Netlify build
remains the sole publisher of those public machine contracts.

## Metadata contract

Every indexable page must have, in prerendered and valid `<head>` HTML:

- exactly one non-empty `<title>` that is descriptive, concise, page-specific, and consistent with the visible primary
  heading;
- exactly one non-empty, page-specific meta description that accurately summarizes the visible page;
- exactly one canonical as specified above;
- no `noindex` or `nosnippet`; omit `max-snippet` or use the unlimited `-1` value;
- `<meta charset="utf-8">`, a responsive viewport, and `html[lang="en"]`;
- Open Graph `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`, and `og:site_name`;
- a `twitter:card` of `summary_large_image`, with title, description, and image values consistent with Open Graph.

Titles and descriptions must be unique across canonical pages, except where exact source content genuinely prevents a
useful distinction; that exception must be explicit. Tests must not impose folklore character limits: Google says title
links and descriptions are truncated to device width and gives no fixed authoring limit. Test non-empty, accurate,
unique content instead
([title guidance](https://developers.google.com/search/docs/appearance/title-link),
[description guidance](https://developers.google.com/search/docs/appearance/snippet)).

**Project decision:** Use `og:type="website"` for home and indexes and `og:type="article"` for Skill and Recipe details.
All social URLs and images must be absolute canonical-origin HTTPS URLs, and social image endpoints must return `200`
with an image content type. The required Open Graph fields and image alt text follow the
[Open Graph protocol](https://ogp.me/).

## Structured-data contract

JSON-LD must be emitted directly in prerendered HTML, parse as JSON, use `https://schema.org`, and describe only visible,
source-backed facts. Its primary entity, URL, name, description, ordering, and relationships must match the rendered
page and shared Catalog model. Do not invent authors, dates, ratings, images, or capabilities. Google requires structured
data to represent visible content and the page's main purpose, and does not guarantee a rich result even for valid
markup ([general structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)).

**Project decision:**

| Page type | JSON-LD graph |
| --- | --- |
| Home | One `WebSite` node with `name: "LAB Skills"` and canonical root `url`; the page node may reference the catalog `ItemList` |
| Skill catalog | `CollectionPage` whose `mainEntity` is an `ItemList` containing every visible Skill in rendered order |
| Skill detail | `TechArticle` with canonical `url`/`mainEntityOfPage`, source-backed name and description, category/keywords when present, and license/source URL when visible |
| Recipe index | `CollectionPage` whose `mainEntity` is an `ItemList` containing every visible Recipe in rendered order |
| Recipe detail | `HowTo` with canonical identity and ordered `HowToStep` values generated from the same visible stage model |
| Skill and Recipe detail | A `BreadcrumbList` matching the visible, crawlable breadcrumb path |
| Alias, 404, Pages, preview | No independent primary-entity graph; aliases may repeat the target graph only if every URL identifies the canonical entity |

Schema.org defines a `TechArticle` as technical procedural or specification content, a `HowTo` as instructions that
achieve a result through steps, a `CollectionPage` as a collection page, and an `ItemList` as a list of entities
([TechArticle](https://schema.org/TechArticle), [HowTo](https://schema.org/HowTo),
[CollectionPage](https://schema.org/CollectionPage), [ItemList](https://schema.org/ItemList)). The project term Recipe
must **never** emit `schema.org/Recipe`; that type describes culinary content and would misrepresent the page.

The home `WebSite` node must live only on the canonical home page and include Google's required `name` and `url`
properties ([site-name guidance](https://developers.google.com/search/docs/appearance/site-names)). Detail breadcrumbs
must contain at least two ordered `ListItem` values with the Google-required name and position values
([breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)). Before launch,
all page-type fixtures must pass Schema Markup Validator; Google-supported features must also pass Rich Results Test
without critical errors ([Schema Markup Validator](https://validator.schema.org/),
[Rich Results Test](https://search.google.com/test/rich-results)). Semantic Schema.org validity is the gate even when a
type has no Google rich-result feature.

## Internal linking and content requirements

**Requirements:**

- Catalog cards, breadcrumbs, global navigation, related content, source links, and install actions must use meaningful
  visible labels; icon-only links need an accessible name, but an accessible name is not a substitute for useful visible
  anchor text in the main catalog.
- Home must prerender links to every current Skill. Recipe index must prerender links to every current Recipe. Detail
  pages should link to their parent collection and to source-backed related Skills or Recipes.
- A UI filter may hide rows for a person, but it must not remove the unfiltered catalog or its links from the initial
  HTML. Empty filter results must remain `noindex` client state, not new URLs.
- Each detail page must render its complete Source Content and an accurate summary. Collapsible presentation may enhance
  long content, but no core instructions may require a client fetch or be absent from source HTML.
- Heading order must communicate the source hierarchy. Each page has one clear primary `h1`; lower levels must not be
  chosen merely for visual size.
- Related links must come from explicit Recipe relationships or a deterministic, documented Catalog rule. Do not create
  keyword-stuffed cross-links solely to influence ranking.

## Core Web Vitals and performance contract

**Field requirement:** For both mobile and desktop, at least 75% of canonical-production visits must meet all three
"good" thresholds: LCP at or below `2.5 s`, INP at or below `200 ms`, and CLS at or below `0.1`. Those are Chrome's
defined Core Web Vitals thresholds
([threshold methodology](https://web.dev/articles/defining-core-web-vitals-thresholds)). Field data is authoritative;
lab data is a pre-release regression signal, not proof of field performance.

**Pre-release project guardrail:** Run Lighthouse CI in its mobile configuration three times and evaluate the median
for one fixture of every page template: home, Skill detail, Recipe index, Recipe detail, and 404. Each fixture must have:

- Lighthouse Performance and SEO scores at least `0.90`;
- LCP at or below `2.5 s`;
- CLS at or below `0.1`;
- mobile TBT at or below `200 ms` as a lab proxy, never reported as INP.

Chrome classifies Lighthouse scores from 90 to 100 as good and mobile TBT from 0 to 200 ms as fast
([performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring),
[TBT thresholds](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)). Lighthouse
cannot measure INP without real interaction; Chrome recommends TBT only as a lab proxy
([Web Vitals tools](https://web.dev/articles/vitals)). Use a pinned browser/Lighthouse version and consistent CI hardware
to reduce variance, and review the raw metrics rather than passing on score alone.

**Recommendation:** Collect canonical-production RUM with the official `web-vitals` library once an analytics endpoint
and privacy treatment are approved. Report LCP, INP, and CLS with metric ID, page type, route, device class, and release;
never include page content or personal data. Until traffic is sufficient, use PageSpeed Insights/CrUX where available
and keep lab gates active. Chrome recommends field measurement and notes that CrUX may lack page-level data for low-
traffic sites ([measurement guidance](https://web.dev/articles/vitals-measurement-getting-started),
[CrUX methodology](https://developer.chrome.com/docs/crux/methodology)).

## Measurement plan

### Search measurement — required after launch

The site owner must verify a Search Console domain property for `skills.lab.sa`, submit the canonical sitemap, and retain
the launch date and release SHA with each baseline. Credentials and DNS verification are HITL operations; their absence
does not weaken the code gates
([Search Console property setup](https://support.google.com/webmasters/answer/34592)).

Record a first stable baseline after 28 complete days, then compare rolling 28-day periods. Segment by page type, page,
query, device, and country where privacy thresholds permit. Track:

- valid indexed canonical pages against the expected Catalog route count;
- sitemap discovered and indexed URLs, exclusions, crawl errors, soft 404s, duplicate/canonical disagreements, and
  structured-data enhancement errors;
- organic impressions, clicks, and CTR by page type and query intent;
- Core Web Vitals status separately for mobile and desktop;
- branded (`LAB Skills`, named Skills/Recipes) versus non-branded discovery queries.

Search Console defines impressions, clicks, CTR, and average position, but Google recommends emphasizing impression and
click trends over position alone
([metric definitions](https://support.google.com/webmasters/answer/7042828),
[performance-analysis guidance](https://support.google.com/webmasters/answer/17010961)). Position is diagnostic, not a
release KPI. A traffic decline is an investigation trigger, not automatic proof of a code regression.

### Privacy-conscious product analytics — conditional recommendation

**Project decision:** SEO launch does not silently introduce a tracker. Product analytics may run only on the canonical
production host after the owner approves a provider and privacy treatment. It must not run on GitHub Pages, deploy
previews, local builds, or automated tests. When enabled, its provider-neutral event contract is:

| Event | When | Allowed parameters |
| --- | --- | --- |
| `page_view` | Initial load and each SvelteKit route navigation, exactly once | canonical path, title, referrer, page type, release |
| `content_select` | A catalog or related-content link is activated | content kind, stable content ID, source surface |
| `catalog_filter` | A category or status filter is committed | filter name/value, result count; no free-form text |
| `catalog_search` | A search is committed | query length and result count only; do not send raw query text |
| `install_command_copy` | An install command is copied | content kind and stable ID; do not send command text |
| `source_open` | A repository/source link is activated | content kind, stable ID, destination host |
| `not_found` | Canonical host renders the 404 | path template or redacted path; never query values |
| `web_vital` | A metric becomes reportable | metric name/value/rating/ID, page type, device class, release |

If GA4 is selected, use its automatic/history `page_view` behavior or manual page views, never both; Google's guidance
warns that combining them duplicates views
([GA4 page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views)). Map
`content_select` to GA4's recommended `select_content` event where useful. Verify initial load and client navigation in
DebugView before production. Derived product indicators are detail views per catalog visit, install-copy rate per detail
view, source-open rate per detail view, and content selections following a search/filter. Set targets only after the
28-day baseline; do not manufacture launch targets without observations.

## Automated regression and deployed smoke matrix

Apply this matrix through vertical TDD slices: add one failing public-output assertion for one observable contract row,
make the smallest shared implementation change that passes it in both builds, rerun the relevant suite, then proceed to
the next row. Tests inspect generated pages and deployed HTTP behavior rather than private component structure.

| Gate | Scope | Required assertion | Frequency |
| --- | --- | --- | --- |
| Route completeness | Both static builds | Expected canonical and alias files exist for every validated Skill/Recipe; no orphan content | Every build |
| Prerender crawl | Both static builds | Required content and `<a href>` relationships exist without executing JavaScript; every canonical route is reachable within the depth contract | Every PR |
| Metadata | Every HTML file | Exactly one required field; correct origin/indexability; canonical titles/descriptions unique; no invalid element truncates `<head>` | Every PR |
| Canonical graph | Canonical build | Canonical, internal links, Open Graph URLs, JSON-LD IDs, and sitemap agree on the clean URL | Every PR |
| Backup isolation | Pages/preview builds | Every HTML page is `noindex,follow`; canonical points to Netlify; duplicate machine endpoints are absent unless root-host robots control is verified | Every PR |
| Sitemap and robots | Canonical build | Sitemap is valid XML and equals the indexable route set; robots is UTF-8, allows rendering, and advertises that sitemap | Every PR |
| Structured data | Representative fixtures plus generated graph checks | JSON parses; type/property contract passes; model and visible-content values match; no culinary `Recipe` type | Every PR; external validators before release |
| Links and status | Generated output and preview deploy | No broken internal links/assets; aliases resolve; canonical pages `200`; unknown path true `404`; social image `200` image | Every PR locally; every deploy remotely |
| Performance | One fixture per template | Three-run median meets Lighthouse guardrails with pinned tooling | Every PR affecting UI/assets; full pre-release |
| Production indexing | Canonical deployment | URL Inspection samples see rendered content/canonical; sitemap accepted; expected page counts trend toward indexed | Launch, day 7, day 28, monthly |
| Field experience | Canonical production | Mobile and desktop p75 meet all CWV targets when sufficient data exists | Monthly and after material releases |
| Analytics QA | Canonical production when enabled | Exactly one page view per navigation, permitted parameters only, no beacons from excluded hosts | Before enablement and after navigation changes |

The build must fail for deterministic output violations. Variable Lighthouse results should fail only after the defined
three-run median misses a guardrail. Search Console, CrUX, and traffic changes create an investigation ticket with the
affected dates, pages, device, and release; they do not rewrite source or roll back automatically.

## Prioritized backlog mapped to future tickets

1. **P0 — one typed SEO model and head component:** derive titles, descriptions, canonicals, social metadata, robots,
   and JSON-LD from the validated route/content model and `SITE_ORIGIN`/`SITE_INDEXABLE`.
2. **P0 — crawlable prerendered catalogs:** server-load the Catalog so the initial HTML contains every Skill and Recipe
   link; keep client filtering as enhancement.
3. **P0 — canonical route outputs:** generate clean Recipe routes, compatibility aliases, exact canonical sitemap, real
   404, canonical robots, and non-indexable Pages/preview artifacts according to the URL matrix.
4. **P0 — static SEO verifier:** implement the deterministic route, metadata, link, sitemap, robots, JSON-LD, and backup
   assertions in one public-output test path.
5. **P1 — structured-data fixtures:** validate representative page graphs locally and retain pre-release evidence from
   Schema Markup Validator and Rich Results Test.
6. **P1 — Lighthouse CI:** pin tooling and add the five template fixtures and three-run median guardrails.
7. **P1 — deploy smoke:** verify both hosts, deep links, status codes, canonical/social URLs, assets, and Pages isolation.
8. **HITL operations:** deploy the Pages backup, verify Search Console/DNS ownership, submit the sitemap, approve any
   analytics/RUM provider and privacy treatment, and record the day-28 baseline.

Each numbered item is one future-ticket boundary. Items 1–4 are the release-blocking technical SEO tranche; items 5–7
are independently grabbable verification tickets after the SvelteKit route foundation exists; item 8 remains HITL and
must not be assigned to an autonomous implementation run.

## Official primary sources

The contract above cites claims at the point of use. These are the governing primary references:

- Crawl and index eligibility: [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical),
  [canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
  [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable),
  [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
  [robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec),
  [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), and
  [soft 404s](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors).
- Metadata and content: [valid page metadata](https://developers.google.com/search/docs/crawling-indexing/valid-page-metadata),
  [title links](https://developers.google.com/search/docs/appearance/title-link),
  [snippets and descriptions](https://developers.google.com/search/docs/appearance/snippet), and
  [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- Structured data: [Google's general policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies),
  [site names](https://developers.google.com/search/docs/appearance/site-names),
  [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), and the Schema.org
  definitions for [WebSite](https://schema.org/WebSite), [CollectionPage](https://schema.org/CollectionPage),
  [ItemList](https://schema.org/ItemList), [TechArticle](https://schema.org/TechArticle),
  [HowTo](https://schema.org/HowTo), and [BreadcrumbList](https://schema.org/BreadcrumbList).
- Social metadata: [Open Graph protocol](https://ogp.me/).
- Performance: [Core Web Vitals](https://web.dev/articles/vitals),
  [threshold methodology](https://web.dev/articles/defining-core-web-vitals-thresholds),
  [field and lab measurement](https://web.dev/articles/vitals-measurement-getting-started),
  [CrUX methodology](https://developer.chrome.com/docs/crux/methodology),
  [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), and
  [TBT](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time).
- Measurement: [Search Console metric definitions](https://support.google.com/webmasters/answer/7042828),
  [Search performance analysis](https://support.google.com/webmasters/answer/17010961), and
  [GA4 page views](https://developers.google.com/analytics/devguides/collection/ga4/views).

## Decision summary

- Netlify at `https://skills.lab.sa` is the only indexable and measurable production origin.
- GitHub Pages is a crawlable HTML backup with page-level `noindex`; a nested project `robots.txt` cannot govern it.
- All canonical content, links, metadata, sitemaps, structured data, and measurements derive from the same Catalog and
  Source Content.
- The first market is global English, with no geographic targeting or `hreflang` until real localized variants exist.
- Search Console plus deterministic output and Lighthouse gates form the launch measurement baseline. Client analytics
  and RUM are conditional on explicit provider/privacy approval and run only on canonical production.
- Core Web Vitals pass at mobile and desktop p75: LCP `<=2.5 s`, INP `<=200 ms`, CLS `<=0.1`.
- `TechArticle`, `HowTo`, `CollectionPage`/`ItemList`, `WebSite`, and `BreadcrumbList` describe visible project content;
  `schema.org/Recipe` is forbidden because a LAB Recipe is not culinary content.
