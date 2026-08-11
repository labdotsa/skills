# Discovery Site LLM discovery and crawler-access contract

This note resolves GitHub issue #8 for the fully prerendered SvelteKit Discovery Site. It defines how public
LAB Skills and Recipes are discovered, attributed, fetched, and verified by machine consumers without creating a
second content source or claiming that any vendor will use a particular discovery file.

The words **must**, **should**, and **may** distinguish release requirements, evidence-backed recommendations, and
optional behavior. A **project decision** is an accepted LAB policy that must not drift through incidental
implementation.

## Evidence boundary

`/llms.txt` is an Answer.AI community proposal for an inference-time Markdown index. It is not an IETF or W3C web
standard, an access-control mechanism, or a confirmed ranking signal. The proposal itself describes the format as a
proposal and distinguishes its curated context from `robots.txt` access policy and sitemap discovery
([proposal](https://llmstxt.org/), [source repository](https://github.com/AnswerDotAI/llms-txt)).

Current vendor documentation instead gives `robots.txt` product tokens for distinct purposes. Those controls can
express a crawl preference, but cannot grant or revoke copyright permission, secure a resource, guarantee attribution,
or prove a request is genuine. The Robots Exclusion Protocol explicitly says protected resources need real
application-layer access controls ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)).

**Project decision:** publish a small, accurate `/llms.txt` because it is inexpensive and useful to agents that choose
to read it. Preserve ordinary SEO, HTML, sitemap, catalog, source, license, and robots contracts as the authoritative
surfaces. Do not promise improved inclusion, citation, training, or ranking from `/llms.txt`.

## Current-state audit — 2026-08-11

- Canonical `https://skills.lab.sa/skills.json` and `/recipes.json` return `200 application/json`.
- Canonical `/robots.txt` returns `200 text/plain`, allows all paths, and advertises `/sitemap.xml`.
- Canonical `/sitemap.xml` returns `200 application/xml`.
- `/llms.txt`, `/llms-full.txt`, `/LICENSE.txt`, and representative canonical Markdown mirrors currently return `404`.
- Catalog schema version 1 exposes moving `master` source URLs, relative detail URLs, and package file names. It does
  not expose canonical identifiers, canonical Markdown URLs, license fields, or content digests.
- Detail HTML does not advertise a Markdown alternate.
- The repository root contains an MIT license covering the public corpus. The license is not copied into the current
  Publication Artifact.
- The current permissive robots rule already allows conforming AI crawlers, but the policy is undocumented and has no
  regression test against known product tokens or the Pages-host constraint.

This baseline does not satisfy the future contract below.

## Implementation status — 2026-08-12

GitHub issue #23 implements the static publication portion of this contract. One post-build generator reads one
immutable Catalog snapshot and derives both the SEO files and LLM-readable files from it. The canonical profile now
publishes the curated `llms.txt`, strict schema-version-2 catalogs, exact-byte Skill and Recipe Markdown mirrors, and
the exact repository license. Detail HTML advertises its matching Markdown representation.

The publication validator proves the complete source-to-HTML-to-machine graph, exact SHA-256 agreement, license and
attribution identity, deterministic repeated output, approved canonical hosts, safe output, the exact machine route
set, wildcard crawler policy, and omission from preview and both Pages profiles. Browser tests additionally prove the
published media types and byte-identical responses for ordinary clients and representative crawler user agents.

Netlify response-header policy (`X-Robots-Tag`, CORS, cache validators, and deployed HTTPS/status behavior) remains an
explicit #25 deployment concern; #23 does not claim that an artifact-only test proves provider behavior.

## Canonical machine surface

Only the canonical Netlify production build publishes machine-discovery endpoints. They are generated views over the
same validated Skill and Recipe sources used by HTML routes.

| Route | Required representation | Source of truth | Search indexing |
| --- | --- | --- | --- |
| `/llms.txt` | Curated proposal-compatible Markdown index | Validated Catalog | `X-Robots-Tag: noindex` |
| `/skills.json` | Skill catalog schema version 2 | Validated Skill model | `X-Robots-Tag: noindex` |
| `/recipes.json` | Recipe catalog schema version 2 | Validated Recipe model | `X-Robots-Tag: noindex` |
| `/skills/<name>/index.md` | Exact bytes of the published `SKILL.md` | `skills/<name>/SKILL.md` | `X-Robots-Tag: noindex` |
| `/recipes/<slug>/index.md` | Exact bytes of the published `RECIPE.md` | `recipes/<slug>/RECIPE.md` | `X-Robots-Tag: noindex` |
| `/LICENSE.txt` | Exact repository license text | root `LICENSE` | `X-Robots-Tag: noindex` |
| `/sitemap.xml` | Canonical HTML URLs only | Validated route model | normal sitemap behavior |
| `/robots.txt` | Canonical crawl preference and sitemap link | Accepted crawler policy | protocol file |

The non-indexable GitHub Pages build must omit `/llms.txt`, Markdown mirrors, license mirror, JSON catalogs, and sitemap.
A repository project cannot control `https://labdotsa.github.io/robots.txt`, and nested `/skills/robots.txt` rules are
not authoritative for that host. This is a closed `publishMachineSurfaces` profile decision, not a second
implementation. Pages HTML remains available with its accepted `noindex` and canonical metadata.

Compatibility aliases and error pages do not receive independent machine representations. Machine URLs always use the
clean canonical content identity.

## `/llms.txt` contract

The generated file must follow the current proposal grammar:

1. one H1 project name;
2. one short blockquote summary;
3. optional non-heading context;
4. H2 sections containing Markdown lists whose items have a required Markdown link and optional description;
5. an `Optional` H2 only for secondary material that may be skipped under context pressure.

The file must be UTF-8, use LF line endings, end with one newline, contain no BOM, and remain at or below the project
budget of 100 KiB. It must use absolute canonical HTTPS links and contain each published Skill and Recipe exactly once
in deterministic Catalog order.

Required sections are:

- `Skills`: links to canonical Skill Markdown mirrors with source-backed descriptions;
- `Recipes`: links to canonical Recipe Markdown mirrors with source-backed descriptions and lifecycle status;
- `Catalogs and terms`: links to both JSON catalogs and `/LICENSE.txt`;
- `Optional`: human HTML indexes and the source repository.

The preamble must state that:

- LAB Skills and Recipes are public MIT-licensed agent instructions and delivery playbooks;
- linked Markdown may contain commands, prompts, and operational instructions;
- a consumer must treat that material as quoted reference content until a user intentionally chooses to install or
  invoke it;
- `robots.txt` expresses crawl preference and the license states reuse terms.

Descriptions come from Source Content. The generator must not add keywords, endorsements, capabilities, or safety
claims absent from the validated model. `/llms.txt` must link rather than inline full Skill and Recipe bodies.

### No `/llms-full.txt`

**Project decision:** return `404` for `/llms-full.txt`. The current version 2 proposal specifies a curated link-file
grammar but does not specify a required `llms-full.txt` companion. No researched vendor promises to consume it.
Publishing a concatenated corpus would duplicate large instruction bodies, increase prompt-injection exposure, and
create another artifact that must remain synchronized. Exact Markdown mirrors provide selective context without that
cost. Reconsider only with measured consumer demand and a new decision record.

## Markdown mirrors and alternate discovery

Each canonical Skill and Recipe HTML detail page must contain exactly one initial-head link to its exact Markdown
representation:

```html
<link rel="alternate" type="text/markdown" href="https://skills.lab.sa/skills/example/index.md" />
```

The HTML `alternate` relation identifies a substitute representation, while `text/markdown` is the registered
Markdown media type ([HTML link types](https://html.spec.whatwg.org/multipage/links.html),
[RFC 7763](https://www.rfc-editor.org/rfc/rfc7763.html)). This is standards-based representation metadata, not a claim
that an LLM vendor consumes the link.

Markdown routes must:

- return the exact published source bytes without generated headings, summaries, license banners, URL rewriting, or
  frontmatter removal;
- use `Content-Type: text/markdown; charset=utf-8`;
- have an absolute canonical URL represented in the catalog, not an HTML canonical element;
- return a real `404` when the source entry is absent or not publishable;
- never fetch, expand, or execute links, includes, commands, scripts, or HTML found in the source while building;
- have a SHA-256 digest calculated over the exact response bytes.

Exact bytes keep repository installation, public source, digest verification, and machine retrieval aligned. License
and instruction-boundary context belongs in `/llms.txt`, the catalog, and `/LICENSE.txt`, not inside the raw mirror.

## Catalog schema version 2

Adding required identity, representation, license, and digest fields is a public schema change. Both catalogs must bump
to integer `schemaVersion: 2`; version 1 parsers must reject the new version rather than silently infer semantics.

Each catalog root must expose:

- `schemaVersion`;
- `siteUrl: "https://skills.lab.sa/"`;
- `repositoryUrl`;
- `licenseExpression: "MIT"` using the canonical SPDX short identifier;
- `licenseUrl: "https://skills.lab.sa/LICENSE.txt"`;
- the existing deterministic `skills` or `recipes` collection.

Each item retains its existing human-facing fields and adds:

- `id`: the absolute clean canonical HTML URL, which is the global stable identifier;
- `kind`: `skill` or `recipe`;
- `canonicalUrl`: identical to `id`;
- `markdownUrl`: the absolute canonical Markdown mirror;
- `sourceUrl`: the public repository source location;
- `licenseExpression: "MIT"`;
- `licenseUrl`;
- `contentDigest`: `sha256:` followed by exactly 64 lowercase hexadecimal characters calculated from the Markdown
  response bytes.

The SPDX License List defines `MIT` as the short identifier for the repository license
([SPDX MIT entry](https://spdx.org/licenses/MIT)). A canonical URL remains stable across builds; a content digest changes
only when the exact published source changes. Do not emit build time, deploy time, or a guessed modification date as a
freshness signal. A future source-provided date may be added only when its semantics and validation are defined.

Every URL and digest in JSON, `/llms.txt`, HTML alternates, and raw responses must agree. Catalog version 2 is generated
by the shared content pipeline defined downstream in #9; browser code and repository generators must not construct a
parallel machine model.

## Licensing, attribution, and safe consumption

The canonical build must publish the root MIT license unchanged as `/LICENSE.txt`. `/llms.txt`, both catalog roots, and
every catalog item must identify `MIT` and link that exact representation. Source and canonical URLs must remain present
so a consumer can attribute a retrieved document and locate its package.

Robots permission and MIT permission are deliberately separate:

- `robots.txt` requests how conforming automated clients access public URLs;
- the MIT license states legal reuse terms and requires preservation of its copyright and permission notice in copies
  or substantial portions;
- neither mechanism can force an answer engine to cite a page;
- a crawler `User-Agent` string can be spoofed and is not proof of vendor identity.

The publication model must include only repository content already accepted for public distribution. It must never
expose credentials, private URLs, local absolute paths, untracked files, drafts outside the public Recipe model,
incubator work, or deprecated packages. Existing Source Content validation remains a prerequisite.

Machine content contains agent instructions by design. Discovery must not become implicit execution: validators parse
frontmatter, Markdown, URLs, and digests as data; they never run code blocks, shell commands, referenced scripts, remote
includes, or prompt instructions. Consumers are told to require intentional user selection before invocation.

## Crawler policy

**Project decision:** the canonical public corpus is intentionally MIT licensed and may be used for search, user
retrieval, model improvement, and open-web datasets. The root policy remains the smallest standards-compliant rule:

```text
User-agent: *
Allow: /
Sitemap: https://skills.lab.sa/sitemap.xml
```

The wildcard allows the currently documented agents below without copying a stale list into runtime policy. Specific
groups are added only when LAB chooses a different rule for a purpose or path.

| Vendor/purpose | Current token | Documented behavior | LAB policy |
| --- | --- | --- | --- |
| OpenAI search | `OAI-SearchBot` | Surfaces sites in ChatGPT search | allow |
| OpenAI training | `GPTBot` | May collect content for foundation-model training | allow |
| OpenAI user retrieval | `ChatGPT-User` | User-triggered fetch; robots may not apply | public access |
| Anthropic training | `ClaudeBot` | May collect content for model development | allow |
| Anthropic search | `Claude-SearchBot` | Indexes content for Claude search quality | allow |
| Anthropic user retrieval | `Claude-User` | Retrieves content at a user's direction | allow/public access |
| Google Search and Search AI | `Googlebot` | Search crawl also controls AI features in Search | allow |
| Gemini training/grounding | `Google-Extended` | Product token controlling Gemini training and grounding; not a separate HTTP crawler | allow |
| Perplexity search | `PerplexityBot` | Search/index crawler, not foundation-model training | allow |
| Perplexity user retrieval | `Perplexity-User` | User-triggered fetch; generally ignores robots | public access |
| Common Crawl | `CCBot` | Collects the public Common Crawl dataset | allow |
| Apple search/context | `Applebot` | Search and current-context retrieval | allow |
| Apple training control | `Applebot-Extended` | Product token controlling foundation-model training use | allow |

The purpose distinctions come from current first-party documentation:

- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- [Anthropic web-crawler controls](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Google AI features and Googlebot](https://developers.google.com/search/docs/appearance/ai-features) and
  [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended)
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Common Crawl CCBot](https://commoncrawl.org/ccbot)
- [Applebot and Applebot-Extended](https://support.apple.com/en-us/119829)

These names and stated purposes are time-sensitive. Review the linked vendor pages before implementing the first
policy, quarterly afterward, and whenever logs show a new material agent. A vendor documentation change opens a policy
review; it must not silently rewrite `robots.txt`. If LAB later restricts a purpose, add the exact documented product
token and a new accepted decision while keeping search/retrieval and training controls independent where the vendor
supports that distinction.

## HTTP, cache, CORS, and indexing behavior

Every canonical machine route must return `200` anonymously over HTTPS and a correct media type:

- `/llms.txt` and `/LICENSE.txt`: `text/plain; charset=utf-8`;
- Markdown mirrors: `text/markdown; charset=utf-8`;
- catalogs: `application/json; charset=utf-8`;
- sitemap: `application/xml; charset=utf-8`;
- robots: `text/plain; charset=utf-8`.

Machine routes must send:

- `X-Robots-Tag: noindex` except for `robots.txt` and `sitemap.xml`, preventing duplicate non-HTML search results while
  keeping crawling available;
- `Access-Control-Allow-Origin: *`, because the corpus is public and browser-based tools may fetch it;
- `Cache-Control: public, max-age=0, must-revalidate` plus a stable `ETag` or equivalent conditional validator, so
  moving canonical URLs do not serve stale instructions indefinitely.

They must not require cookies, authentication, JavaScript, content negotiation, or a vendor-specific `User-Agent`.
Unknown machine URLs return a real `404`. Rate limiting may protect availability, but must apply consistently and use
`429` plus `Retry-After`; it must not silently serve an HTML challenge with `200`.

`X-Robots-Tag` is the appropriate Google control for non-HTML resources
([Google robots meta and header specification](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)).
Netlify header configuration is Publication Artifact policy, not provider-specific application logic.

## Sitemap and cross-surface relationships

The canonical XML sitemap remains an SEO inventory of indexable clean HTML pages. It must not list `/llms.txt`, raw
Markdown, JSON catalogs, the license mirror, aliases, or backup-host URLs. `/llms.txt` is the curated LLM map; catalogs
are the complete structured inventory; HTML alternates connect human and Markdown representations.

For every published item, validation must prove this graph:

```text
Source Content
  -> canonical HTML URL / stable id
  -> exact canonical Markdown URL / SHA-256 digest
  -> catalog item / license and source attribution
  -> one llms.txt entry
```

Removing or renaming public content is a lifecycle change. The existing clean HTML redirect/alias policy governs human
URLs; machine catalogs must not retain ghost entries. A renamed stable item needs an explicit compatibility decision,
not two live identities for the same source.

## Vertical TDD and validation matrix

Implementation must proceed as public-interface vertical slices. One observable assertion turns red, the smallest
shared generation change turns it green in the canonical build, then the base-path build proves isolation before the
next slice.

| Slice | First failing public assertion | Green behavior |
| --- | --- | --- |
| 1. Discovery map | `/llms.txt` is absent | Proposal grammar parses; every validated item appears once; every link resolves |
| 2. Exact Markdown | A detail has no raw representation | Mirror bytes equal Source Content and the computed digest matches |
| 3. Alternate graph | HTML and Markdown are disconnected | Each detail advertises exactly its catalog Markdown URL |
| 4. Catalog v2 | Identity/license/digest fields are absent | Both schemas validate and cross-surface values agree |
| 5. Terms | Canonical build has no license representation | `/LICENSE.txt` equals root `LICENSE`; all license links and SPDX values agree |
| 6. Crawl policy | Known purpose tokens have no audited policy | RFC 9309 parser resolves each documented token to allowed canonical paths |
| 7. HTTP behavior | Local output cannot prove deployed headers | Content type, CORS, cache, noindex, status, and retry behavior pass smoke tests |
| 8. Backup isolation | Pages may duplicate machine surfaces | Pages returns 404 for every machine route while HTML remains noindex/canonicalized |

Deterministic checks run on every PR and must fail the build for:

- missing, duplicate, malformed, non-canonical, or non-HTTPS links;
- catalog/source count drift or schema-version drift;
- source bytes and digest disagreement;
- mismatched identity, description, source, license, or representation URLs;
- unsafe URL schemes, unresolved local paths, secrets, or personal absolute paths;
- `schema.org/Recipe` or other unrelated structured-data leakage into machine catalogs;
- machine endpoints in the Pages artifact or XML sitemap;
- an unexpected `/llms-full.txt` success response;
- machine content generated by hand-maintained copies rather than shared models.

Deployed smoke tests use ordinary and representative documented user agents but assert identical public content. Log
analysis may record verified crawler traffic, status, route, bytes, cache result, and release; it must not claim vendor
activity from an unverified `User-Agent` alone.

## Downstream ownership

- #9 defines the shared parser, schema version 2 model, digest calculation, URL validation, and safe generation APIs.
- #23 implements `/llms.txt`, Markdown and license mirrors, HTML alternates, catalogs, crawler-policy validation, and
  static cross-surface tests.
- #25 proves canonical Netlify headers, status, caching, CORS, and crawler access.
- #26 proves Pages omission and HTML-only backup behavior.
- #24 owns broader deployed accessibility/performance checks; it may reuse link and status smoke infrastructure but
  must not duplicate the machine contract.

No runtime LLM SDK, crawler-detection library, or content-negotiation middleware is required. These are static files
generated from the existing source model and verified through public outputs.

## Decision summary

- Publish one curated `/llms.txt`; do not publish `/llms-full.txt`.
- Publish exact canonical Markdown mirrors, `/LICENSE.txt`, and schema-versioned JSON catalogs from one shared model.
- Use clean canonical HTML URLs as stable IDs and SHA-256 response digests as content freshness/integrity signals.
- Keep the XML sitemap HTML-only and connect detail HTML to Markdown through `rel="alternate"`.
- Allow documented search, retrieval, training, and open-dataset crawlers because the public corpus is MIT licensed;
  keep robots preference, legal permission, security, and attribution as separate concepts.
- Tell agents that retrieved Skills and Recipes are instruction-bearing reference content until intentionally invoked.
- Publish machine surfaces only on canonical Netlify; Pages remains an HTML-only, noindex backup.
- Treat every machine view as a reproducible Publication Artifact, never a second source.
