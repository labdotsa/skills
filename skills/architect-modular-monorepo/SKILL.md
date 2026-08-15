---
name: architect-modular-monorepo
description: Design, audit, migrate, or evolve a product-shaped TypeScript monorepo with clearly separated deployable apps, shared serving packages, external protocol facades, background workflows, authentication and authorization boundaries, local Portless development, and provider-specific deployment such as Netlify. Use when deciding package topology, dependency direction, app versus library boundaries, shared loading/auth context, workspace infrastructure, or release independence.
metadata:
  author: labdotsa
  category: engineering
---

# Architect Modular Monorepo

Design a monorepo as a product system, not as a collection of folders. The goal is useful
independence: each shippable runtime has a clear contract, while shared behavior remains unified
until it earns a real process, origin, secret boundary, lifecycle, or ownership boundary.

This skill is a topology and operating-model blueprint. It does not prescribe `apps/`, `packages/`,
SvelteKit, Bun, Netlify, Portless, or any other tool. Infer the shape from the repository's actual
entrypoints, imports, runtime contracts, data ownership, deployment configuration, and local workflow.

## Choose the mode

- **Audit** — reconstruct the current topology and report drift. Do not mutate source files.
- **Design** — produce a target graph, package classifications, contracts, rollout, and guardrails.
- **Build or migrate** — implement the smallest complete vertical slice, keeping the workspace runnable.

If the request is ambiguous, audit first and state the evidence needed before making a structural
change.

## Operating thesis

There are four different things people casually call a “package.” Keep them distinct:

| Kind | Owns | Runs or deploys by itself? | Typical shape |
| --- | --- | --- | --- |
| **Shippable app** | A user, operator, API, docs, auth, storage, or worker experience | Yes | App entrypoint, origin, config, env, build, health, smoke, rollback |
| **Unified serving package** | Reusable domain, persistence, route-adapter, UI, or provider behavior | No; bundled into consumers | Public exports and tests, no required port or deployment |
| **Protocol facade** | A deliberate external HTTP, RPC, webhook, or machine contract | Yes, if remotely reachable | Stable auth, versioning, errors, rate limits, docs, observability |
| **Operational workflow** | A resumable import, classification, migration, publication, or repair lifecycle | Usually a CLI/job, not a web app | Manifest, run state, artifacts, locks, resume, validate, rollback |

An app may depend on many packages and still be independently runnable. “Standalone” means that a
consumer can resolve its declared transitive dependencies and exercise its primary journey without
starting unrelated products. It does not mean dependency-free, separately versioned, or extractable.

The default architecture is a modular monolith:

```text
shippable apps -> public package exports -> domain/application rules -> adapters -> owned data
       |                    |                  |                  |
       |                    |                  |                  +-- database/provider/queue
       |                    |                  +-- framework-neutral use cases and ports
       |                    +-- kernel, auth, UI, contracts, provider clients
       +-- HTTP/RPC only for external, isolated, or independently operated boundaries
```

Do not create a service just to make a diagram look distributed. Do not create a shared package
just to hide an app that has its own origin, secrets, release cadence, or runtime behavior.

## 1. Establish evidence before topology

Read repository instructions and the root context first. Then inspect, with `rg` or equivalent:

1. Root and workspace manifests, lockfiles, package manager and task-runner configuration.
2. Every package manifest, `exports` map, TypeScript path alias, and first-party import.
3. Runtime entrypoints, route trees, workers, CLIs, server hooks, and public protocol handlers.
4. Environment examples, secret readers, cookie/origin helpers, database clients, schemas, and migrations.
5. Provider/deploy files: Netlify, Vercel, Cloudflare, Docker, CI, hosting contexts, and release scripts.
6. Local-development files: Portless or proxy maps, fallback ports, process cleanup, HTTPS, and HMR setup.
7. Tests and executable architecture checks. Treat checks as policy, not incidental tooling.
8. Docs, ADRs, generated output, archives, and worktrees. Compare documentation with source.

Ignore generated or historical trees unless active configuration points to them. Common examples are
`node_modules`, `.svelte-kit`, `build`, `dist`, `.netlify`, `coverage`, `generated`, `archive`, and
runtime `runs/` directories.

Record each live unit once in an inventory:

| Unit | Kind | Entry point/origin | Direct consumers | Runtime | Data owner | Secrets | Build/deploy | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `...` | app/package/facade/workflow | `...` | `...` | `...` | `...` | `...` | `...` | path/command |

Classify conclusions as **observed**, **inferred**, or **unknown**. Never infer a deployable from a
folder name alone, and never infer authorization from a route name, cookie, or UI state.

**Inventory gate:** every live runtime, package, workflow, and release artifact appears once; every
undeclared import or documented/source mismatch is named.

## 2. Build the real dependency and runtime graph

Construct two graphs, not one:

- **Build graph:** manifests, public exports, imports, generated types, and transitive dependencies.
- **Runtime graph:** browser/client -> app -> route adapter -> use case -> repository/provider -> data,
  plus external callers, queues, webhooks, and workers.

For every edge record:

```text
consumer -> provider
edge: workspace import | in-process call | HTTP/RPC | file/artifact | database | queue
reason: reuse | external contract | failure isolation | secret boundary | scale | lifecycle
authority: source path and test/check
```

Do not treat a shared database as permission to bypass module boundaries. Shared persistence is a
runtime state boundary; it is not a substitute for a domain contract or a reason for arbitrary SQL
from every app.

**Graph gate:** the graph is acyclic at the package/layer level, every edge is declared or explicitly
classified as infrastructure, and no internal HTTP call exists merely because a local module was
inconvenient to import.

## 3. Decide whether a unit is an app or a unified serving package

Use this decision test for a proposed top-level package. Create a deployable app only when at least
one of these is real and durable:

- it needs an independently hosted origin or domain;
- it owns a materially different secret or trust boundary;
- it has an independent process lifecycle, queue, worker, or scaling profile;
- it needs an independent release, rollback, or incident blast radius;
- it serves a distinct external protocol or machine consumer;
- it has a distinct user/operator ownership boundary or compliance perimeter;
- it must remain available when a sibling app is down.

Otherwise prefer a module or a public subpath in an existing unified package. A package earns a new
subpath when two real consumers need a stable boundary. It earns a new top-level package only when
the boundary is useful to the repository, not merely because a feature directory became large.

### The shippable app contract

Every deployable app must own or explicitly inherit:

- a direct entrypoint and canonical origin;
- local `dev`, focused `dev:<app>`, check, test, build, preview/start, and deploy commands;
- a complete primary journey with declared dependencies available;
- environment/secret requirements and safe missing-configuration behavior;
- health/readiness and a smoke journey appropriate to its protocol;
- build output and provider configuration;
- logging/observability and a rollback or previous-version strategy;
- an owner and a release dependency list.

An internal package must not require a port, URL, deployed site, or sibling process to be consumed.
It should expose a narrow public API, keep tests close to the behavior, and be safe to bundle into a
consumer. If it needs a remote runtime, reclassify it as a service/protocol facade.

### A practical topology pattern

Many product monorepos converge on a shape like this, with names adapted to the product:

```text
packages/
  web/       # public product or marketing app
  auth/      # canonical registered-auth app and reusable auth library
  dashboard/ # registered product app
  ops/       # operator/admin app
  api/       # external and machine HTTP facade
  docs/      # public API/docs/LLM app, if it has its own origin
  help/      # user/agent help app, if independently served
  storage/   # guarded asset app, if it has a distinct trust boundary
  core/      # unified serving package; never a runtime by default
workflows/   # resumable operational CLIs, if they need separate lifecycle
```

This is a vocabulary, not a required catalog. A small product may have one app and one core. A
larger product may have several apps but still one shared kernel.

## 4. Shape the shared kernel by boundary

Do not put every reusable file into a flat “utils” package. Organize the unified package by the
boundary it owns. A dependable layered direction is:

```text
app route/composition
  -> route/session/action adapters (framework-specific)
  -> application/domain capabilities and repository ports
  -> concrete repository/provider adapters
  -> database/schema/queue clients
  -> framework-free primitives
```

Shared presentation is a separate branch:

```text
app route -> shared UI/components/stores
shared UI -/-> database, secrets, repositories, request-only server modules
```

Use names such as `primitives`, `domain`, `services`, `repository`, `db`, `kit`, `ui`, and
`contracts` as boundary vocabulary, not as a mandatory directory layout.

Rules:

- **Primitives** are deterministic, framework-free values/results/algorithms.
- **Domain/application** owns business decisions, policies, use cases, and repository interfaces.
- **Repository/adapter** owns persistence, provider translation, retries, idempotency, and query shape.
- **DB** owns connection setup, schema, migrations, SQL helpers, and physical naming conventions.
- **Route/kit adapters** translate HTTP/framework events into typed use-case inputs and responses.
- **UI** owns reusable presentation and interaction; it must not authorize or read persistence.
- **Contracts** contain runtime-neutral types or protocol metadata only when real consumers share them.
- **Auth** may be a deployable app plus a reusable server library when it owns a canonical identity boundary.

Apps compose; they should not become a second domain layer. Import the narrowest public subpath from
`package.json` exports. Never import another package's private `src` path, except for a documented
repository-operation exception that is itself guarded.

**Kernel gate:** each layer has a one-way dependency direction, shared behavior has an owner, and a
new abstraction is justified by at least two real consumers or one security/protocol invariant.

## 5. Select the transport deliberately

Choose transport based on the consumer and failure contract:

| Consumer or behavior | Prefer | Why |
| --- | --- | --- |
| Same-app browser mutation | Server form/action | Progressive enhancement, same-origin session, typed result |
| Same product family, shared kernel | In-process package call | No serialization or internal availability dependency |
| Independently fetched batch/detail/poll | Internal JSON route | Independent lifecycle and bounded payload |
| External developer/client | Versioned bearer HTTP/RPC | Explicit compatibility, scope, rate, and error contract |
| Provider-to-product state | Signed webhook | Provider delivery boundary and idempotent receipt |
| Public redirect/attribution | Public route/script + signed capability | Fast public path with deliberately narrow trust |
| Durable import/classification/publication | CLI/job + artifacts | Resume, validation, approval, rollback, and audit |

Do not call the API app from web/dashboard/ops merely to reuse code that is already in the kernel.
Use HTTP when the caller is external, the process is independently operated, or the boundary
provides real security, scaling, failure, or ownership value.

For public APIs, centralize route metadata, version, operation IDs, scopes, parsing, error envelopes,
OpenAPI, endpoint indexes, and machine-readable docs. Keep route files thin. For webhooks, verify the
raw body before parsing and record a provider event key before applying side effects.

## 6. Establish identity, authorization, entitlement, and context separately

Authentication proves who or what is calling. Authorization proves what that subject may access.
Entitlement proves what the account is allowed to use. Request context tells a route which valid
workspace/collection/project is currently selected. These are related, not interchangeable.

Use a policy matrix like this:

| Caller | Authentication | Authorization | Extra gate |
| --- | --- | --- | --- |
| Registered browser | Canonical session/cookie | membership + role/capability + target scope | plan/feature entitlement |
| Operator | Registered identity | separate operator role and action policy | sensitive-resource rules |
| External workspace client | hashed bearer API key | workspace scope + resource scope | origin allowlist + rate limit + plan |
| Public/embedded browser | short-lived signed capability | destination/resource binding | expiry, nonce/session, narrow action |
| Webhook provider | raw-body signature | provider/event contract | idempotent receipt |
| Background job | short-lived token + task lease | job/task ownership | lease freshness and bounded retry |

Never authorize a submitted resource because it belongs to the current page, active cookie, or a
browser-supplied role. Resolve the submitted IDs, derive their actual tenant and sub-resource scope,
then authorize those targets. A batch mutation is all-or-nothing unless partial success is explicitly
part of its contract.

### Canonical registered-auth boundary

When authentication is its own app/package, let it own the full registered lifecycle:

1. normalize identity input;
2. issue OTP/password/passkey challenge and store only a verifier/hash where applicable;
3. enforce expiry, attempt, replay, and rate limits;
4. verify the challenge and create/update the account;
5. hash and persist refresh/session material, never raw tokens;
6. write an HTTP-only, `SameSite`-appropriate session cookie;
7. bootstrap profile/account, workspace, participant, and plan state;
8. synchronize approved anonymous attribution/history when the policy allows it;
9. redirect only to a validated same-site return target.

Share cookies across sibling subdomains only when a configured parent domain matches the request. Keep
localhost, IP-like hosts, and mismatched domains host-only. Put cross-origin URL construction and safe
return validation in one auth URL module; do not rebuild it in every app.

### Workspace and operator authorization

A robust multi-tenant model commonly separates:

```text
Account/subject -> Profile -> Workspace membership/Participant -> role capabilities
                                            |
                                            +-> Workspace plan/usage/feature entitlement
Operator role -> separate Profile-linked operator policy
```

Keep role-to-capability maps centralized and testable. Resolve actual membership and target scope in
repository queries or core capabilities. Treat the active workspace/collection as a navigation aid,
not an authority. Distinguish:

- unauthenticated (`401` or auth redirect);
- authenticated but forbidden (`403`);
- authorized but plan-locked/over quota (product-specific locked response);
- valid but empty;
- invalid/missing resource (`400`/`404`);
- stale/conflicting/idempotent state (`409` or explicit result).

API keys should be shown once at creation, hashed before storage, revocable, workspace-scoped, and
checked for explicit scopes. Operator API credentials, job credentials, public signed tokens, and user
sessions are different credentials even if they use the same crypto primitive.

## 7. Use a request pipeline and loading model

Keep request-wide work in a small, composable pipeline. A useful abstract sequence is:

```text
preload/config
  -> authenticate identity/session
  -> establish request locals/context
  -> route guard and redirect policy
  -> route load/action/handler
  -> parse/validate input
  -> authorize submitted target
  -> entitlement/rate/scope checks
  -> use case
  -> repository/provider
  -> typed response
```

The exact order varies by protocol. For example, a developer API may authenticate the bearer key,
reject revoked keys, enforce origin policy, resolve workspace/plan, rate-limit, check scopes, parse
parameters, authorize resources, then query or mutate. A browser route may parse a form before the
mutation but must authorize before touching scoped data.

### Loading ownership

- **Global hook:** session validation/refresh, small identity context, safe redirects, and request
  locals. Avoid page-specific joins, expensive counts, or broad feature queries in every request.
- **App layout load:** shell-level navigation, locale/appearance, current user summary, or shared
  workspace context that truly serves every descendant.
- **Route server load:** initial authoritative data for one page or route family.
- **Form/action handler:** same-app mutation, validation, target authorization, transaction, and a
  small typed result.
- **JSON endpoint:** independently fetched batch/detail/poll data or an intentional machine contract.
- **Client state:** transient interaction, URL state, optimistic draft, and reconciliation only; never
  the source of truth for authorization, billing, permissions, or durable configuration.

For a multi-async feature, give one lifecycle owner control of loading. Use request generations or
abort signals to ignore stale responses, reconcile server truth after mutations, and model loading,
empty, locked, forbidden, and failure states explicitly. Use stable snapshots, cursors, and bounded
batches for activity or analytics; do not stream an unbounded database into the browser.

**Loading gate:** a route can be exercised from a clean checkout with only its declared app and
transitive dependencies; its server data and actions use the same authorization capability rather
than duplicating policy in the page and endpoint.

## 8. Make local multi-app development boring with Portless

When several apps need production-like origins, use a single route registry. For each app record:

```text
package path | local hostname | dev wrapper | underlying command | unique fallback port | deployable | owner
```

The registry should drive or validate the root Portless map, package-local mirrors, focused commands,
documentation, and deployment hostnames. Stable local hostnames should mirror production topology:

```text
product.localhost
auth.product.localhost
dashboard.product.localhost
api.product.localhost
ops.product.localhost
```

Rules:

- `dev` starts the intended set through Portless; `dev:<app>` starts one app.
- The Portless wrapper owns the route; the underlying `dev:app` binds a unique loopback fallback port
  and accepts `HOST`/`PORT` overrides.
- Keep one registry and test that every browser-facing app, including storage or docs when relevant,
  is mapped exactly once.
- Mirror production HTTPS/subdomain behavior locally so cookies, redirects, CORS, CSP, and HMR are
  tested under the same origin shape.
- On startup, clean only routes owned by this monorepo. Read the Portless state/route file, filter by
  exact configured hostnames/TLDs, acquire the proxy's lock, terminate owned process trees gracefully,
  escalate only after a bounded timeout, and remove dead route records.
- Never kill every Portless process, truncate a shared state file, or delete another worktree's route.
- Test concurrent app startup, app restart, HMR, auth handoff, shared/host-only cookies, CORS, and one
  app failing while siblings remain reachable.

Portless is local infrastructure, not an application dependency. A package must still build and run
under its production adapter or provider preview without Portless.

## 9. Design the deployment matrix, including Netlify

Treat deployment as a matrix, not a root-level boolean:

| App | Provider site | Package/base directory | Canonical origin | Build command | Publish/functions | Required secrets | Smoke/rollback |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `...` | `...` | `...` | `...` | `...` | `...` | `...` | `...` |

For Netlify or a similar multi-site provider:

1. Create one site per shippable app. Do not create a site for the unified core package.
2. Set the site/package directory and commit a package-local config when provider semantics are
   clearer there. If a root config has contexts, keep those contexts aligned with the same matrix.
3. Build the selected package from a clean repository with the pinned package-manager/runtime versions.
4. Materialize that package's adapter output into the provider's expected site-level publish directory;
   do not let concurrent package builds share mutable output.
5. Declare functions/server output and provider bundling exceptions per app, not globally by accident.
6. Keep framework `envDir`/workspace resolution intentional. A package may read the root environment
   contract, but it must declare which variables it actually requires.
7. Fail closed in production when required secrets, signing keys, database URLs, or origin settings are
   absent. Development fallbacks must be explicit and non-production-only.
8. Keep DNS and custom-domain ownership in the provider's domain configuration; do not pretend a build
   file creates DNS.
9. Give every site a health check, representative browser/API smoke, deploy provenance, and rollback
   target. Redeploy changed packages plus their transitive dependents.

### Shared configuration and secret contracts

Classify configuration by scope:

- **Per-app:** local origin, public branding, provider-specific function settings.
- **Shared protocol secret:** intentionally identical across auth and sibling apps for compatible
  session/cookie/signature verification.
- **Shared data access:** least-privilege runtime database/queue credentials required by a defined app set.
- **Tooling-only:** migration/admin/direct database credentials; never add them to deploy sites by habit.
- **External service:** provider API/webhook keys, each owned by the smallest boundary that uses it.

For each variable document name, owner, consumers, public/private status, local example, production
source, rotation plan, and whether it may be shared. Never expose private values through `PUBLIC_*`,
page data, client bundles, URLs, logs, or generated docs.

### Beyond Netlify

The same contract applies to Vercel, Cloudflare, Docker, Kubernetes, or a VM: one deployable has one
build entrypoint, environment contract, runtime output, health/smoke path, ownership, and rollback
story. Provider adapters belong at the app boundary; domain packages stay provider-neutral.

## 10. Treat operational workflows as first-class runtime units

Do not hide a resumable workflow inside a web request. Give imports, migrations, classification,
publication, repair, and backfills:

- a versioned manifest with resolved configuration copied into each run;
- durable run state and atomic, restrictive artifacts;
- explicit `init -> claim -> process -> apply -> status/requeue -> validate` lifecycle;
- bounded concurrency, leases/locks, idempotent apply, and resume semantics;
- dry-run/prepare mode before mutation;
- source hashes or snapshots so an old decision cannot apply to changed evidence;
- append-only audit/preimage records where rollback or reconciliation matters;
- an independent activation/rollback step for public snapshots.

Keep acquisition, classification, publication, and serving as separate owners when their change rate,
evidence, approval, or rollback requirements differ. A workflow must not silently activate public
state as a side effect of ingesting one record. If a background job is needed, give it an explicit
queue/lease contract and keep its lifecycle separate from request handling.

## 11. Turn architecture into executable guardrails

Add checks that keep the topology visible to future contributors and agents. At minimum, consider:

- workspace manifest/lockfile consistency and duplicate package names;
- public export and undeclared-import checks;
- dependency allowlists, cycle detection, and layer direction;
- no route-direct database/repository imports when route adapters are required;
- no reusable app-local UI module when a shared UI boundary is intended;
- no internal product HTTP calls when an in-process capability exists;
- no client import of server-only secrets, database clients, or authorization logic;
- every deployable in the app surface, Portless registry, provider matrix, and smoke inventory;
- every package has check/test/build commands appropriate to its kind;
- no core/internal package appears as a deployment site;
- generated/archive/output paths excluded from topology scans;
- auth/session/cookie/origin/secret contract tests;
- target-scope authorization tests where active UI context differs from submitted resource context;
- API status/envelope/scope/rate-limit and webhook signature/idempotency tests;
- build matrix and provider artifact checks.

Prefer source-contract tests for architectural rules. Make the failure name the rule, file, line, and
tracked exception. Do not weaken a guardrail to accommodate one accidental source example; fix the
source or record an explicit migration exception.

## 12. Migrate in vertical, compatibility-safe steps

When converting a single app into a multi-app monorepo:

1. inventory current routes, data, secrets, and deploy output;
2. freeze the target topology and ownership matrix;
3. extract one narrow public package boundary with characterization tests;
4. move one route family end to end, including load/action/auth and UI imports;
5. add local origin/Portless and provider build entries before splitting the next app;
6. run old and new consumers against compatible schema/protocol contracts;
7. migrate persistence with additive expand -> backfill -> switch -> contract steps;
8. deploy one site and smoke it before changing traffic or domain ownership;
9. update docs, ADRs, package exports, matrices, and guardrails together;
10. remove the old path only after dependent apps and rollback paths are verified.

For staggered releases, shared schema changes must tolerate old and new app versions. For shared
packages, rebuild/redeploy every transitive consumer. For auth, keep cookie names, signing/refresh
semantics, return URLs, and origin rules backward-compatible for the overlap window.

## 13. Deliver an auditable architecture package

For an audit or design, return:

1. **Current topology** — apps, unified packages, facades, workflows, outputs, data stores, origins.
2. **Target graph** — dependency DAG, runtime graph, allowed edges, and explicit exceptions.
3. **Classification ledger** — why each unit is shippable, unified, facade, or operational.
4. **Auth matrix** — identity, session, workspace/resource scope, operator roles, API scopes, plans,
   public signed capabilities, worker leases, cookies, origins, secrets, and failure states.
5. **Loading/transport map** — hook, layout, route load, action, JSON, API, webhook, worker, and client
   ownership for each important journey.
6. **Local-development map** — Portless hostnames, ports, commands, cleanup ownership, and test cases.
7. **Deployment matrix** — site, package directory, build, output, functions, env, domain, smoke, and
   rollback for every app; explicitly list non-deployable units.
8. **Guardrail plan** — executable checks, focused tests, full checks, and generated-output policy.
9. **Rollout** — extraction order, schema/protocol compatibility, traffic/domain changes, and rollback.
10. **Risks and unknowns** — evidence needed, drift, security concerns, and the smallest next action.

### Compact package descriptor

Use a machine-readable descriptor or equivalent table when the repository has more than a few units:

```yaml
name: dashboard
kind: app # app | package | facade | workflow
entrypoint: packages/dashboard
origin:
  production: https://dashboard.example.com
  local: https://dashboard.product.localhost
dependencies:
  workspace: [core, auth]
  runtime: [database]
boundary:
  owns: [registered-workspace-experience]
  cannot_import: [core/private, sibling/private-src]
dev:
  command: dev:dashboard
  portless_name: dashboard.product
deploy:
  provider: netlify
  site: dashboard
  build: netlify:build:dashboard
  publish: build
  health: /health
auth:
  identity: registered-session
  authorization: workspace-participant
  secrets: [AUTH_SECRET, DATABASE_URL]
checks: [check, test, build, smoke]
```

### Final checklist

- [ ] Every runtime and package has an owner and evidence.
- [ ] Apps have origins, commands, env, health, smoke, and rollback contracts.
- [ ] Unified packages have public exports and no accidental runtime dependency.
- [ ] Domain direction is acyclic; routes compose adapters instead of persistence.
- [ ] Internal product workflows are in-process unless a real remote boundary is justified.
- [ ] Authentication, target authorization, entitlement, and navigation context are separate.
- [ ] Every submitted resource is re-scoped server-side; batch writes have explicit atomicity.
- [ ] Loaders have one lifecycle owner and bounded, typed payloads.
- [ ] Portless routing is registry-driven, production-shaped, and safely cleaned.
- [ ] Every deployable has its own provider site/build/output/secrets/smoke/rollback entry.
- [ ] Workflows have resume, integrity, and rollback semantics.
- [ ] Guardrails fail with actionable evidence, and generated/history trees are excluded.
- [ ] Relevant checks were run and exact failures or unverified assumptions are reported.
