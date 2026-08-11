# Discovery Site shared content and publication pipeline contract

This note resolves GitHub issue [#9](https://github.com/labdotsa/skills/issues/9) for the planned fully prerendered
SvelteKit Discovery Site. It defines one safe build-time pipeline that reads Skill and Recipe Source Content once,
validates it once, and derives every human and machine representation without a second content model.

The words **must**, **should**, and **may** distinguish release requirements, evidence-backed recommendations, and
optional behavior. A **project decision** is an accepted LAB policy that must not drift through incidental
implementation.

## Non-negotiable invariants

1. `skills/<name>/SKILL.md` plus its package files and `recipes/<slug>/RECIPE.md` are the only authored content sources.
2. One immutable `CatalogSnapshot` is the build input for Svelte pages, catalog JSON, `/llms.txt`, exact Markdown
   mirrors, sitemap/SEO models, and generated `docs/catalog.md`.
3. Filesystem access and content parsing are build-time, server-only operations. Browser bundles receive only validated,
   serializable view models.
4. Markdown is data. The build never imports, evaluates, fetches, expands, or executes source content, code fences,
   HTML, links, scripts, or prompt instructions.
5. Raw source bytes and normalized semantic values remain distinct. Exact mirrors and their digests use raw bytes;
   pages and catalogs use validated normalized values.
6. Publication, routing, SEO, and component layers may project the shared snapshot, but may not reinterpret frontmatter,
   rescan Markdown with regular expressions, or reconstruct relationships.
7. Invalid public content fails the build with actionable diagnostics. Missing metadata never becomes an invented
   fallback such as `Description unavailable.` or `general`.

These decisions implement the ownership boundary in
[ADR 0001](adr/0001-single-source-static-discovery-site.md), the canonical identity and route boundary in
[ADR 0002](adr/0002-canonical-origin-and-public-urls.md), the [technical SEO contract](technical-seo-contract.md), and
the [LLM discovery contract](llm-discovery-contract.md).

## Evidence and current-state audit — 2026-08-11

The existing implementation proves behavior worth preserving, but not the future architecture:

- [skill-catalog.mjs](../scripts/lib/skill-catalog.mjs) contains an ad hoc frontmatter scalar parser, walks Skill
  packages, invents missing description/category fallbacks, and returns a Skill-only model.
- Legacy `scripts/lib/recipe-catalog.mjs` reused that parser but extracted Recipe titles, conversation
  counts, and related Skill names with separate regular expressions. Skill and Recipe catalogs have separate version 1
  validators.
- Legacy `scripts/build-site.mjs` reread Skill sources, derived related rows, rendered Markdown, constructed
  URLs, serializes catalogs, and assembles HTML in one command. Routes and generators therefore do not consume one
  validated snapshot.
- Legacy `scripts/lib/markdown.mjs` correctly escaped raw HTML and fenced code and neutralized explicit unsafe
  schemes. Existing tests lock those safety outcomes, but the hand-written parser is not a full CommonMark/GFM parser.
- Current catalog tests require stable source ordering, `SKILL.md` first in package inventories, matching Recipe
  directory/frontmatter names, one-based catalog positions, unique names, and identical embedded/public JSON.

The official Agent Skills specification requires YAML frontmatter followed by Markdown, requires `name` and
`description`, and permits `license`, `compatibility`, `metadata`, and `allowed-tools`. It also requires the Skill name
to match its parent directory ([Agent Skills specification](https://agentskills.io/specification)). The replacement
must accept and preserve those standard fields rather than narrowing the format to the fields the legacy parser happens
to understand.

## Canonical read boundary

### Filesystem ownership

All filesystem discovery and byte reads live below `src/lib/server/content/`. SvelteKit treats `$lib/server` and
`.server` modules as server-only and rejects imports from browser-facing code, which makes this a real build boundary
rather than a naming convention
([SvelteKit server-only modules](https://svelte.dev/docs/kit/server-only-modules)).

```text
skills/** and recipes/** and LICENSE
  -> src/lib/server/content/read-source.server.ts
  -> src/lib/server/content/build-catalog.server.ts
  -> immutable CatalogSnapshot
       -> src/lib/domain/ projections and selectors
       -> +page.server.ts / +server.ts prerender consumers
       -> thin repository scripts through the same public server API
```

Routes import a `getCatalogSnapshot()` or narrowly scoped selector from `$lib/server/content`; components import only
serializable types and pure selectors from `$lib/domain`. Repository commands run the same TypeScript modules through
the project's one TypeScript runner. No route calls `fs`, no component parses Markdown, and no script retains a
JavaScript compatibility copy of the domain model.

SvelteKit `+page.server` loaders run only on the server, while universal `+page` loaders may also run in the browser
([SvelteKit loading data](https://svelte.dev/docs/kit/load)). Therefore Source Content must enter pages through server
loaders. The root layout keeps `prerender = true` and SSR enabled; `adapter-static` then writes the prerendered site as
static files, and strict mode detects pages or endpoints left out of the artifact
([static adapter](https://svelte.dev/docs/kit/adapter-static)). Dynamic Skill and Recipe routes export explicit
`entries()` values from the shared snapshot instead of relying only on link crawling; SvelteKit documents explicit
entries as the remedy when a prerenderable parameterized route is not otherwise reached
([page options](https://svelte.dev/docs/kit/page-options)).

### Allowed read set

The reader accepts an explicit repository root and may read only:

- direct directories under `skills/` containing `SKILL.md`;
- every regular package file below an accepted stable Skill directory, for inventory and source links;
- direct directories under `recipes/` containing `RECIPE.md`;
- the root `LICENSE` needed by the accepted machine-publication contract.

The reader must use `lstat`/`realpath` containment checks, reject symlinks and special files in the public corpus, reject
paths outside those roots, and report unreadable files. It must not read `site/`, `website/`, `incubator/`, `deprecated/`,
unrelated untracked files outside the allowed roots, user home paths, environment secrets, or remote URLs. Directory
entries are sorted by their portable POSIX relative path before any parsing begins. A file intentionally placed inside
a stable Skill package is Source Content and must pass the same containment, file-kind, inventory, and publication
checks whether or not the local worktree has committed it yet; only tracked files from the clean deployment checkout
can reach production.

Each primary Markdown source becomes an immutable `SourceFile`:

```ts
type SourceFile = Readonly<{
  relativePath: `skills/${string}/SKILL.md` | `recipes/${string}/RECIPE.md`;
  bytes: Uint8Array;
  text: string;
  contentDigest: `sha256:${string}`;
}>;
```

Read bytes once. Reject a UTF-8 BOM, NUL, and invalid UTF-8 by decoding with a fatal decoder. Do not normalize line
endings, trim whitespace, or re-encode before storing `bytes` or calculating the digest. `text` is the decoded parsing
view; `bytes` remains the exact mirror and digest authority. SHA-256 is calculated directly over `bytes` with Node's
`createHash('sha256')` and lower-case hexadecimal output
([Node crypto API](https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options),
[Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final)).

## Required build-time dependencies

The cutover should add the smallest explicit toolset below. These are build/dev dependencies; the generated site has no
request-time content runtime.

| Dependency | Required role | Boundary |
| --- | --- | --- |
| `yaml` | Parse one YAML 1.2 frontmatter document with strict diagnostics and source positions | server/build only |
| `zod` | Define runtime source, domain, and public-output schemas and infer their TypeScript types | shared domain; validation runs at build time |
| `unified`, `remark-parse` | Parse Markdown once into mdast rather than using regex extractors | server/build only |
| `remark-gfm` | Add the existing tables, task lists, strikethrough, and autolink behavior | server/build only |
| [`tsx`](https://tsx.is/) | Let thin Node repository commands import the same TypeScript source without a compiled shadow tree | dev command only |

The `yaml` package defaults to YAML 1.2 and its core schema, checks unique keys, reports errors/warnings on a parsed
document, and exposes line counters and AST guards
([YAML package documentation](https://eemeli.org/yaml/)). Zod validates unknown input at runtime, returns typed data,
and exposes structured issue paths; Zod 4 can also derive Draft 2020-12 JSON Schema from the same schema if a published
schema artifact is later accepted
([Zod basics](https://zod.dev/basics), [Zod JSON Schema](https://zod.dev/json-schema)). Remark parses Markdown into
mdast, and `remark-gfm` adds the GitHub-flavored syntax already present in the parity contract
([remark](https://github.com/remarkjs/remark), [remark-gfm](https://github.com/remarkjs/remark-gfm)).

The pipeline does **not** need `gray-matter` (the owned delimiter splitter plus `yaml` already covers the boundary),
`mdsvex` (Source Content must not compile as Svelte), `rehype-raw`, a second Markdown renderer, a browser Markdown
parser, DOM emulation, or a browser sanitizer. It also does not need a JSON canonicalization package: catalog objects
are not signed or hashed, and their stable pretty-printed bytes are controlled by an explicit projection and serializer.
RFC 8785 JCS is a different whitespace-free canonical format and must not be claimed unless the project adopts it
intentionally ([RFC 8785](https://www.rfc-editor.org/rfc/rfc8785.html)).

## Parse, normalize, and validate exactly once

The build must run these stages in order. Each stage consumes only the previous stage's output and returns a new
immutable value.

1. **Discover** — enumerate direct Skill/Recipe directories and sorted package files inside the allowed roots.
2. **Read** — read each primary file as bytes once; validate file kind, containment, and UTF-8; compute the exact-byte
   SHA-256 digest.
3. **Split frontmatter** — require an opening `---` at byte zero and a closing delimiter line; retain byte offsets for
   frontmatter and body. Do not use a regex that can consume a later horizontal rule.
4. **Parse YAML** — call `parseDocument` for exactly one YAML 1.2 document with `strict: true`, `uniqueKeys: true`,
   `stringKeys: true`, `merge: false`, `resolveKnownTags: false`, core schema, and no custom tags. Reject parser errors
   and warnings, merge keys, explicit non-core tags, and non-string mapping keys. Resolve ordinary anchors/aliases only
   through `toJS({ maxAliasCount: 50 })`, then require an acyclic JSON-shaped value; over-budget expansion fails. YAML
   1.2 defines its representation and core schema, while the project restrictions deliberately keep frontmatter
   portable and unambiguous
   ([YAML 1.2.2](https://yaml.org/spec/1.2.2/)).
5. **Validate source schema** — validate the resulting unknown value with the appropriate Zod input schema. Do not
   coerce numbers/booleans to strings or supply business fallbacks.
6. **Normalize identity** — derive `kind` and slug from the containing root, trim only source-defined scalar metadata,
   normalize category/status vocabulary, and require declared names to match directory names. Preserve the original
   raw bytes separately.
7. **Parse Markdown body** — parse the body once with `remark-parse` plus `remark-gfm`; derive title, outline, Recipe
   stages/steps, visible plain-text summary inputs, and the sanitized rich-document view from that same mdast.
8. **Resolve relationships** — resolve local Recipe-to-Skill references against the complete validated identity map,
   validate external/built-in references without fetching them, derive inverse Skill-to-Recipe links, and apply the
   deterministic related-entry ranking.
9. **Attach route and publication identity** — use the accepted route/origin policy to derive IDs, canonical URLs,
   base-relative page hrefs, Markdown URLs, source URLs, aliases, license URLs, and sitemap membership. Content never
   supplies its own canonical origin.
10. **Validate the graph** — reject duplicate IDs, duplicate output paths, missing local targets, orphan published
    entries, route collisions, unsafe URLs, and inconsistent representation/license relationships.
11. **Project outputs** — create public catalog DTOs, page view models, rich documents, SEO models, `llms.txt` rows,
    raw mirrors, sitemap entries, and generated documentation rows from the frozen snapshot.
12. **Validate and serialize** — validate every public DTO again at the output boundary, serialize deterministically,
    and assert cross-surface agreement before writing any Publication Artifact.

CommonMark explicitly includes raw HTML nodes, and GFM adds tables, task lists, strikethrough, autolinks, and disallowed
raw-HTML rules. GitHub applies additional sanitization after GFM-to-HTML conversion, so merely selecting a GFM parser is
not an HTML safety boundary
([CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/),
[GFM specification](https://github.github.com/gfm/)). The owned rich-document transformation in stage 7 is the safety
boundary described below.

## Discriminated domain model

The domain uses a closed discriminated union so Skill-only and Recipe-only fields cannot leak into one another:

```ts
type CatalogEntry = Skill | Recipe;

type EntryBase = Readonly<{
  kind: "skill" | "recipe";
  slug: string;
  title: string;
  description: string;
  category: string;
  source: SourceFile;
  document: RichDocument;
  outline: readonly OutlineItem[];
}>;

type Skill = EntryBase & Readonly<{
  kind: "skill";
  name: string;
  lifecycle: "stable";
  license?: string;
  compatibility?: string;
  metadata: Readonly<Record<string, string>>;
  allowedTools?: string;
  extensions: Readonly<Record<string, unknown>>;
  packageFiles: readonly PackageFile[];
  resourceCounts: ResourceCounts;
}>;

type Recipe = EntryBase & Readonly<{
  kind: "recipe";
  name: string;
  status: "draft" | "stable";
  author: string;
  outcome: string;
  stages: readonly RecipeStage[];
  skillRequirements: readonly SkillRequirement[];
}>;
```

`CatalogSnapshot` owns these route-independent domain entries and a separate immutable `PublicationGraph` that maps
them to accepted canonical IDs, URLs, aliases, and output paths. Publication identity therefore cannot leak into source
parsing or relationship rules, while every downstream projection still consumes one build snapshot.

The Skill input schema accepts every standard Agent Skills field. Known optional fields remain typed; unknown top-level
fields are preserved in `extensions` but are not rendered or published until a contract defines them. Skill `metadata`
remains a string-to-string map as specified. Repository policy additionally requires `metadata.category` for every
stable Skill.

Recipes are a repository-owned format. Their source schema validates `name`, `description`, `metadata.author`,
`category`, `status`, `outcome`, `conversation-layers`, the current compatibility `detail-url`, and complete Skill
requirement objects. The first Markdown H1 is the Recipe title. `## Conversation - …`, `### Step - …`, and nested
headings are recognized from mdast nodes, not a second text scan. Declared conversation layers must match the derived
stage slugs in source order. A malformed or empty Recipe is a build error, not an entry silently dropped from the
catalog.

### Relationships

`SkillRequirement` is itself discriminated:

```ts
type SkillRequirement =
  | { kind: "local"; name: string; skillId: string; source: "labdotsa/skills"; url: string }
  | { kind: "external"; name: string; source: string; url: string }
  | { kind: "builtin"; name: string; source: string; availability: "built-in" };
```

- A `local` relationship must resolve to one stable Skill in the snapshot; missing targets fail the graph.
- An `external` relationship needs a valid explicit HTTPS URL and source label but is never fetched during validation.
- A `builtin` relationship records availability without inventing a URL.
- Recipe-to-Skill declarations are authoritative. Skill-to-Recipe relationships are their derived inverse.
- Same-kind recommendations are derived by the documented rule: same category first, then canonical slug, excluding the
  current entry, with a fixed limit supplied by the view-model selector. There is no keyword similarity, randomness,
  filesystem-order tie-break, or network enrichment.
- Public `relatedSkills` compatibility arrays preserve declared names in source order. Site links use only resolved
  local relationships, so an external name never masquerades as a local detail page.

## Source, domain, publication, and view-model separation

| Layer | Contains | Must not contain |
| --- | --- | --- |
| Source | Raw bytes, decoded text, source path, parsed unknown frontmatter, mdast | canonical URLs, UI labels, HTML |
| Domain | Validated discriminated entries, relationship graph, typed rich document, digest | provider base path, Svelte components, serialized JSON |
| Publication identity | stable IDs, canonical/Markdown/source/license URLs, base-relative hrefs, aliases, output paths | source parsing or presentation state |
| Public DTO | catalog schema v2 fields and exact stable ordering | raw body, mdast, UI-only state, private paths |
| Page view model | page title/description, navigation items, package rows, related rows, Recipe stages, `RichDocument` | filesystem handles, unvalidated strings, parsing functions |
| Client state | search text, selected filters, expanded state, copy feedback | the canonical catalog, source bytes, relationship derivation |

`CatalogSnapshot` contains readonly domain maps by kind/slug, a separate publication graph keyed by canonical ID, and
pre-sorted arrays for publication. It exposes narrow pure selectors such as `skillPage(name)`, `recipePage(slug)`,
`skillCatalogV2()`, `recipeCatalogV2()`, `llmsRows()`, `sitemapEntries()`, and `markdownMirror(id)`. A selector returns a
projection; it cannot mutate or reread the snapshot.

Page data must be plain serializable values because SvelteKit serializes server-load data into prerendered output.
Large raw Markdown bytes stay on the server side and feed exact `+server.ts` responses directly; they are not duplicated
inside hydrated page data. Complete directory rows and article content still render into initial HTML, while interactive
components hydrate only their local state.

## Safe rich content and URL policy

### Structural sanitizer

`remark-parse` plus `remark-gfm` produces mdast. An owned `toRichDocument()` transformer accepts only a closed node
union needed by the parity contract: root, text, paragraph, headings, emphasis/strong/delete, block quote, ordered and
unordered lists, disabled task items, thematic break, inline code, fenced/indented code, links, images, and tables.

- Raw `html` nodes become escaped text nodes so visible source is preserved without becoming markup.
- Unknown node types fail with `CONTENT_UNSUPPORTED_NODE`; they are not passed through.
- Text, code, language labels, alt text, titles, and table cells remain strings rendered through normal Svelte
  interpolation.
- Heading IDs come from one owned duplicate-safe slugger. Generated IDs use a reserved prefix such as `content-` and
  are checked for uniqueness to prevent DOM clobbering.
- Task-list controls are always disabled semantic checkboxes; Source Content cannot create form submissions.
- Images contain only validated `src`, `alt`, and optional title values. Source Content cannot set event handlers,
  `style`, arbitrary classes, `srcset`, or embedded markup.

Svelte components recursively render the typed `RichNode` union. Source-derived HTML strings and `{@html}` are forbidden.
Svelte explicitly warns never to render unsanitized values through `{@html}`
([Svelte `{@html}` documentation](https://svelte.dev/docs/svelte/@html)). This structural approach also makes headings,
code blocks, tables, notices, and copy controls reusable components instead of opaque injected markup.

If a future syntax-highlighting or diagram library returns HTML, it must remain opt-in, run after Markdown validation,
pass through an explicit `rehype-sanitize` allowlist after the final unsafe transform, and receive a dedicated threat
model and tests. The official sanitizer documentation notes both allowlist schemas and DOM-clobbering risk
([rehype-sanitize](https://github.com/rehypejs/rehype-sanitize)). That contingency does not justify adding raw HTML or a
sanitizer dependency now.

### URL classes

Every Markdown link/image and every frontmatter URL is parsed with the platform `URL` implementation, then classified
before entering a rich or public model. The WHATWG URL Standard defines the parser and serializer used by web-platform
implementations ([URL Standard](https://url.spec.whatwg.org/)). String-prefix checks are insufficient.

| Input class | Link policy | Image policy |
| --- | --- | --- |
| `#fragment` | allow after validating/resolving the generated heading ID | reject |
| explicit `https:` | allow; serialize the parsed URL | allow |
| explicit `http:` | preserve for parity, mark external; project-owned URLs must be HTTPS | allow for parity, but project-owned assets must be HTTPS |
| explicit `mailto:` | allow only a non-empty address; strip headers not explicitly accepted | reject |
| relative path | resolve lexically against the containing Source Content path; require root containment and a known package file | allow only a known repository image file |
| protocol-relative `//host/path` | reject; require an explicit scheme | reject |
| `javascript:`, `data:`, `vbscript:`, `file:`, `blob:` or any other scheme | reject | reject |

Relative source references resolve to the validated repository source/package URL, never to an invented site route.
Path normalization must reject traversal outside the owning Skill/Recipe directory before URL encoding. A missing
repository-relative target is an error. External links are syntax-checked only: builds do not perform DNS, HTTP,
redirect, content-type, or availability checks, keeping results deterministic and preventing server-side request
forgery. Links added by application components use the route projection and SvelteKit base-path helpers, not the
Markdown resolver.

The sanitizer fails the build on unsafe schemes rather than replacing them with `#`; this makes a security defect visible
to the author. Raw HTML remains visible as escaped text, preserving the current parity test. Fenced code always renders
as text even when its language is `html`, `svelte`, `sh`, or `javascript`.

## One snapshot, every representation

The following projections must be pure functions of the same frozen snapshot and publication policy:

| Consumer | Projection | Required agreement |
| --- | --- | --- |
| Svelte index pages | complete ordered catalog-card view models | initial HTML contains every public entry and link |
| Skill/Recipe detail pages | entry, rich document, package/stage model, relationships, SEO | title, description, route, outline, and relations match the catalog |
| `/skills.json`, `/recipes.json` | Zod-validated schema v2 DTOs | identity/license/digest fields match exact mirrors and HTML |
| `/llms.txt` | ordered Skill/Recipe rows and contract preamble | each published entry appears once and links its catalog Markdown URL |
| Markdown mirrors | untouched `SourceFile.bytes` | response bytes equal repository source bytes and digest input |
| `/LICENSE.txt` | untouched root license bytes | license URLs and SPDX expression agree |
| sitemap/SEO | canonical indexable route records | HTML-only canonical set matches head/JSON-LD policy |
| `docs/catalog.md` | stable Skill summary rows | names/descriptions/source links match the Skill model |

The catalog v2 item contract comes from the [LLM discovery contract](llm-discovery-contract.md): clean canonical HTML
URL as `id`, identical `canonicalUrl`, exact `markdownUrl`, public `sourceUrl`, `MIT` license expression/URL, and the
exact-byte `contentDigest`. Existing human-facing version 1 fields remain where their meaning is still accepted.
`schemaVersion: 2` is the only published version after cutover; the site must not publish parallel v1/v2 endpoints.

The route policy accepted in #10 supplies canonical origin, base path, clean paths, aliases, and host indexability.
Therefore content parsing never reads `metadata.detail-url` as canonical authority. During migration, the current Recipe
field is validated and mapped to an accepted legacy alias; canonical identity comes from the route policy. If #10
changes the exact alias, only that projection changes.

Public JSON is UTF-8 without a BOM, formatted with two spaces, LF line endings, and exactly one final newline. Projection
functions construct object keys in a fixed documented order and arrays in canonical entry order. JSON object names must
be unique and network JSON must be UTF-8 under RFC 8259
([RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html)). Before serialization, Zod validates a JSON-only value: no
`undefined`, `NaN`, infinities, dates, maps, sets, functions, or class instances.

Inline JSON in HTML, if still needed, is serialized from the same DTO and escapes `<` as `\u003c` so source text cannot
terminate the script element. Prefer server-rendered Svelte props and markup over a duplicate inline full-catalog block;
client filtering must not perform a second catalog fetch.

## Determinism, digests, and freshness

Canonical entry order is ASCII code-point order by normalized slug, with `kind` used only when two collections are
intentionally merged (`skill` before `recipe`). Do not use locale-sensitive comparison, filesystem enumeration order,
object-key enumeration as business order, insertion timestamps, or randomness. Package paths use POSIX separators,
`SKILL.md` first, then code-point order.

Recipe stages, Skill requirements, and explicitly authored relationships preserve validated source order. Derived
recommendations use their documented category/slug rule. Public one-based `index` values are assigned only after the
final canonical array is built.

The `sha256:` digest is exclusively the fingerprint of exact primary Markdown response bytes, not normalized text,
frontmatter, the rich AST, package contents, or a catalog item. A change to any source byte changes the digest; a change
only to rendering, routes, or metadata projection does not. The build must not publish mtime, build time, deploy time,
or Git checkout time as content freshness. This preserves the distinction established by the
[LLM discovery contract](llm-discovery-contract.md).

Two clean builds from the same tracked source revision and identical publication inputs must produce byte-identical
machine files and equivalent HTML apart from build tooling artifacts explicitly excluded by contract. A reproducibility
test builds in two temporary directories with perturbed directory enumeration and timezone/locale settings, then
compares the public route manifest, JSON, text, XML, and exact mirrors.

## Cache and invalidation policy

The initial implementation should favor correctness over a persistent cache:

- build one snapshot promise per command/build invocation and share it across all server loaders and endpoint generators;
- never cache across separate builds or source revisions;
- never put an unkeyed snapshot in browser code or a long-lived dev module that survives source changes;
- on any relevant change, rebuild the complete small catalog rather than partially mutating the graph.

Relevant inputs are `skills/**`, `recipes/**`, root `LICENSE`, content/domain/server pipeline modules, schema version,
route/publication policy, canonical origin, base path, repository URL, indexability, and renderer/slugger policy. The dev
Vite integration must watch those paths, clear the in-process snapshot, and trigger a server reload. Add/remove/rename,
package inventory changes, and relationship changes invalidate the whole graph.

If profiling later proves parsing expensive, a parsed-document cache may use a key containing the exact source digest,
parser and sanitizer contract version, source kind, and route-independent schema version. Relationship, route, SEO,
catalog, and publication projections still rebuild from the complete set. Cache hits must be observationally identical
to clean builds and are covered by the same public-output tests. File mtimes alone are never valid cache keys.

## Error taxonomy and diagnostics

All pipeline failures become `ContentDiagnostic` values and are reported together in stable source/path/code order when
safe to continue. Each diagnostic contains a stable code, severity, portable relative source path, line/column or field
path when known, a concise message, and one concrete repair hint. Never expose an absolute personal path in CI output or
public artifacts.

| Family | Example codes | Meaning |
| --- | --- | --- |
| Discovery/I/O | `SOURCE_UNREADABLE`, `SOURCE_SPECIAL_FILE`, `SOURCE_OUTSIDE_ROOT` | allowed source could not be safely read |
| Encoding/boundary | `SOURCE_INVALID_UTF8`, `SOURCE_BOM`, `FRONTMATTER_MISSING`, `FRONTMATTER_UNCLOSED` | bytes cannot enter parsing safely |
| YAML | `YAML_SYNTAX`, `YAML_DUPLICATE_KEY`, `YAML_ALIAS_LIMIT`, `YAML_TAG` | frontmatter is ambiguous or outside the accepted subset |
| Source schema | `SKILL_SCHEMA`, `RECIPE_SCHEMA`, `IDENTITY_MISMATCH`, `CATEGORY_INVALID` | parsed values violate source contracts |
| Markdown/structure | `CONTENT_UNSUPPORTED_NODE`, `RECIPE_TITLE`, `RECIPE_STAGE_MISMATCH`, `HEADING_ID_COLLISION` | body cannot form the required rich/domain model |
| URL/safety | `URL_INVALID`, `URL_UNSAFE_SCHEME`, `URL_OUTSIDE_PACKAGE`, `SOURCE_LINK_MISSING` | a URL cannot enter a page/public DTO safely |
| Relationships | `RELATIONSHIP_MISSING`, `RELATIONSHIP_DUPLICATE`, `RELATIONSHIP_KIND` | graph cannot resolve deterministically |
| Identity/routing | `DUPLICATE_ID`, `ROUTE_COLLISION`, `PUBLICATION_PATH` | two entities or representations claim the same identity/path |
| Output | `PUBLIC_SCHEMA`, `CROSS_SURFACE_DRIFT`, `MIRROR_DIGEST_MISMATCH`, `NONDETERMINISTIC_OUTPUT` | a projection disagrees with the frozen snapshot |

Parser exceptions are wrapped with the appropriate code and original cause. Zod issue paths map to source field paths.
Warnings are reserved for non-contractual author guidance; security, identity, missing metadata, broken local relations,
and public-output disagreements are errors. A generator writes nothing when the snapshot is invalid, preventing a
partially refreshed Publication Artifact.

## Migration from version 1 without dual models

The migration is an atomic implementation replacement, not a period with two accepted pipelines:

1. Capture current v1 Skill/Recipe JSON and representative rendered Markdown as test fixtures only.
2. Implement source readers, schemas, rich documents, relationships, and v2 projections under `src/lib/` with failing
   public-interface tests first.
3. Build one new snapshot and compare its preserved v1 human fields, ordering, package inventory, resource counts,
   Recipe stage count, relationships, escaping, and unsafe-scheme behavior to the fixtures.
4. Add the accepted v2 identity/license/digest fields and route-policy changes in the same projection. Intentional deltas
   are asserted explicitly rather than hidden in a broad snapshot replacement.
5. Switch SvelteKit loaders, endpoints, `docs/catalog.md`, validation, and repository commands to the new API in one
   cutover. Remove `scripts/lib/skill-catalog.mjs`, `recipe-catalog.mjs`, `site-catalog.mjs`, `markdown.mjs`, and their
   generator imports in that same accepted change.
6. Publish only schema v2 after cutover. Keep v1 fixture readers in tests only until parity acceptance, then remove them;
   never ship a `/v1`, `skills-v1.json`, embedded v1 catalog, or legacy browser model.

The source files do not need migration merely because the parser changes. Standard Skill fields that the old parser
ignored become typed without rewriting `SKILL.md`. The current Recipe `detail-url` remains accepted as legacy-route
input until #10 owns its retirement. Generated `site/` and `docs/catalog.md` remain outputs and are never imported to
seed the new snapshot.

## Vertical public-interface TDD matrix

Each row is a vertical slice. Begin with a failing assertion against the public API or generated artifact, implement the
smallest end-to-end path through the shared snapshot, then keep that assertion while advancing. Private helper snapshots
cannot substitute for public-output proof.

| Slice | First failing proof | Passing public interface |
| --- | --- | --- |
| 1. Source boundary | a fixture symlink/outside path is read | allowed roots load; symlinks, invalid UTF-8, and outside paths fail with stable diagnostics |
| 2. Frontmatter | folded descriptions/arrays or duplicate keys are misread | YAML 1.2 fixtures parse; duplicate keys/tags/aliases fail; all standard Skill fields survive |
| 3. Discriminated model | a Recipe can masquerade as a Skill | Zod schemas and exhaustive selectors preserve kind-specific invariants |
| 4. Markdown safety | raw `<script>`, unsafe schemes, or HTML fences enter markup | generated HTML shows escaped source/code, contains no executable source HTML, and rejects unsafe URLs |
| 5. Recipe structure | title/stages/requirements are regex-derived or drift | one mdast yields title, outline, stages, counts, and validated requirements |
| 6. Relationships | missing local Skill silently disappears | local/external/built-in relations classify correctly; missing/duplicate local targets fail; inverse links agree |
| 7. Skill detail tracer | loader rereads one Skill | explicit route entry, page view, package rows, rich content, relationship rows, and SEO come from one snapshot |
| 8. Recipe detail tracer | Recipe source and visible workflow disagree | explicit route entry renders every validated stage/step from the same Recipe model |
| 9. Catalog v2 | old JSON lacks identity/license/digest | both DTO schemas pass; preserved fields/order and accepted v2 additions are exact |
| 10. Exact mirrors | output uses normalized text | response bytes equal source bytes and SHA-256 equals the catalog digest |
| 11. Discovery/SEO | llms/sitemap/head reconstruct identities | each projection consumes shared IDs and cross-surface URL/count/description assertions pass |
| 12. No-JS catalog | rows exist only after hydration/fetch | prerendered HTML contains every catalog row/link and client filtering needs no second catalog request |
| 13. Base matrix | route strings are hand-concatenated | root and project-base builds expose equivalent models with only policy-owned href/output differences |
| 14. Determinism | shuffled reads change bytes/order | two isolated builds have identical route manifests and machine-output bytes |
| 15. Failure atomicity | invalid content leaves partial output | build reports sorted diagnostics, exits nonzero, and writes no mixed-revision artifact |

Permanent adversarial fixtures include raw/inline HTML, event attributes, DOM-clobbering names, duplicate headings,
`javascript:` with mixed case/whitespace/encoding, `data:` images, protocol-relative URLs, encoded traversal, missing
relative targets, YAML duplicate keys/alias expansion/tags, invalid UTF-8, duplicate identities, route collisions, and broken
local relationships. CommonMark/GFM fixtures cover nested lists, block quotes, tables, task lists, autolinks, code
fences, reference links, images, and Unicode text.

The completion gate runs unit/schema tests, component/render tests for the typed rich document, both static builds,
static public-output validation, and the existing parity/end-to-end checks. `bun run test` and `bun run typecheck` must
cover these modules once the typed foundation exists; `npm run validate` remains the repository-wide compatibility gate
until the command policy is intentionally consolidated.

## Downstream ownership

- **#17 — shared Catalog implementation:** owns the filesystem reader, YAML/Zod schemas, mdast-to-`RichDocument`
  sanitizer, URL classifier, relationships, snapshot/selectors, v2 DTOs, thin TypeScript commands, and rows 1–10 and 14–15
  of the matrix.
- **#18 — Skill directory:** owns complete prerendered Skill rows and local client filtering from Skill index view models;
  it must not add a browser catalog/parser.
- **#19 — Skill details:** owns Skill route entries and component rendering of Skill page/rich/package/related models.
- **#20 — Recipe index:** owns complete prerendered Recipe rows and navigation from Recipe index view models.
- **#21 — Recipe details:** owns Recipe route entries and component rendering of the shared stage/step/rich model.
- **#22 — technical SEO:** owns head, JSON-LD, canonical graph, sitemap, aliases, and 404 projections over shared route and
  content identity; it does not parse content.
- **#23 — LLM discovery:** owns publishing `/llms.txt`, exact Markdown/license mirrors, public catalogs, alternates,
  crawler surfaces, and cross-representation tests from the existing snapshot.
- **#10 — route research:** finalizes clean paths, aliases, base paths, output filenames, and host-specific publication
  policy consumed by this pipeline.
- **#16 — atomic SvelteKit cutover:** introduces the server/domain directory boundary and removes the legacy application
  and generator sources in one migration.
- **#24–#26 — quality/deployment:** reuse the route manifest and public validators for both artifacts; they do not fork
  content models or provider-specific pipelines.

## Decision summary

- Read exact Source Content bytes once inside `$lib/server`; build one frozen `CatalogSnapshot` per invocation.
- Parse strict YAML 1.2 with `yaml`, validate runtime boundaries with Zod, and parse Markdown once with unified,
  `remark-parse`, and `remark-gfm`.
- Preserve all official optional Agent Skills fields and isolate repository-specific Skill and Recipe validation.
- Use a discriminated Skill/Recipe domain model, resolve declared local/external/built-in relationships once, and derive
  inverse/recommendation relationships deterministically.
- Convert mdast to an allowlisted typed `RichDocument`; render it with Svelte components and never inject
  source-derived HTML.
- Reject unsafe/ambiguous URLs and broken local targets without fetching remote content.
- Derive pages, JSON v2, `/llms.txt`, exact mirrors, license, sitemap/SEO, and `docs/catalog.md` from the same snapshot.
- Hash exact raw Markdown bytes with SHA-256; never claim build timestamps as content freshness.
- Use stable source/relationship ordering and explicit serializers; keep cache scope to one build until evidence justifies
  content-addressed parsed-document caching.
- Replace v1 generators atomically, keep their outputs only as migration fixtures, and never publish parallel models.
