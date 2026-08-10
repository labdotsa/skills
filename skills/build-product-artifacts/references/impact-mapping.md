# Change Impact Mapping

## Purpose

Use this reference for every accepted change. Start with the owning artifact, then inspect all derived consumers.

## Common impact map

| Change | Always inspect | Often inspect |
| --- | --- | --- |
| Actor or role | actors/permissions, journeys | screens, routes, API authorization, notifications, audit |
| Service, product, or category | taxonomy/catalog | discovery, provider setup, pricing, admin configuration, screens, requirements |
| Business rule or policy | owning domain/policy artifact | journey, lifecycle, admin configuration, requirements, notifications, transaction snapshots |
| Lifecycle state | state model | allowed actions, screens, jobs, notifications, API, analytics, disputes |
| Payment or monetization | payment lifecycle, decisions | checkout, refunds, payouts, accounting, provider/customer terms, integrations |
| Authentication or permissions | identity and permissions | routes, session flow, API, data policies, admin security, app boundaries |
| Application boundary | system context, monorepo | IA, routes, authentication, deployment, domains, shared packages |
| Vendor selection | integration artifact, stack, decision log | security, data flow, webhooks, jobs, operations, failure handling |
| Storage or media policy | storage integration | delivery journey, permissions, CDN, retention, disputes, malware controls |
| New screen or route | screen inventory/spec, route map | journey, IA, API route catalog, permissions, analytics |
| Phase movement | vision/phases, delivery scope | requirements, screens, architecture, integration timing, open questions |
| Design-system decision | frontend/UI architecture | monorepo, deployment scanning, branding handoff, all visual apps |

## Update algorithm

1. Write the change in one canonical sentence.
2. Identify the source-of-truth owner.
3. Record or supersede the cross-cutting decision.
4. Enumerate direct consumers from the table and repository links.
5. Search exact old terms plus conceptual synonyms using `rg`.
6. Update source artifacts before derived artifacts.
7. Re-run searches for stale terms, counts, routes, domains, and package names.
8. Confirm artifacts outside the impact set truly remain unaffected.

## High-risk propagation

Treat changes involving money, permissions, legal commitments, schedule availability, transaction state, private data,
or destructive retention as high risk. For these changes, also inspect:

- failure and recovery flows;
- audit evidence;
- idempotency and concurrency rules;
- notification timing;
- admin intervention;
- dispute behavior;
- historical transaction snapshots;
- non-functional security and recovery requirements.

## Contradiction patterns

Search for:

- old and new vendor names both presented as selected;
- an actor appearing in journeys but not permissions;
- a screen without a route or a route without an owning app;
- a lifecycle action absent from the state model;
- requirements that describe behavior excluded from the phase scope;
- UI ownership duplicated between an app and shared package;
- a future-phase assumption written as an accepted current requirement;
- a configurable rule also hard-coded elsewhere.
