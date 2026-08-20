---
name: hoko
description: Plan, create, operate, integrate, and analyze Hoko links and attribution workflows, including smart routing, QR campaigns, leads, sales, partners, customers, teams, and API or MCP automation. Use for Hoko-specific campaign measurement and integrations, not general website audits or hosted form building.
metadata:
  author: labdotsa
  category: growth
---

# Hoko

Treat Hoko as an end-to-end link attribution system, not merely a URL shortener:

```text
plan -> organize -> create -> distribute -> attribute -> analyze -> govern
```

Keep the resource chain visible: workspace → collection → link → click → customer → lead/sale. Tags, UTM values, partners, routing rules, and participant roles add campaign context and control.

## Route the request

| Intent                                                         | Read                                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Campaign design, links, metadata, QR, imports, or bulk sync    | [Link and campaign workflows](references/link-campaign-workflows.md)      |
| Device/country routing, expiry, passwords, or cloaking         | [Routing and protection](references/routing-and-protection.md)            |
| Implement embedded clicks or redirect attribution in a website | [Embedded click implementation](references/embedded-click-integration.md) |
| Forms, signups, leads, sales, or customers                     | [Attribution and conversions](references/attribution-and-conversions.md)  |
| Click analysis, funnels, exports, or campaign reporting        | [Analytics and reporting](references/analytics-and-reporting.md)          |
| MCP, REST, API keys, scopes, pagination, or errors             | [API and MCP](references/api-mcp.md)                                      |
| Workspaces, collections, roles, partners, privacy, or deletion | [Team governance](references/team-governance.md)                          |
| Unclear or possibly unsupported Hoko capability                | [Capability boundaries](references/capability-boundaries.md)              |

Read [Product model](references/product-model.md) when designing a new setup, resolving ownership/access, or working across several Hoko resources.

## Preflight

Resolve only the context needed for the task:

- business outcome and decision the measurement should support;
- destination and confirmation that the user controls or may track it;
- workspace, collection, and actor permission;
- channel, placement, audience, and naming convention;
- click, lead, and sale definitions, including stable customer identity;
- current plan, retention, and feature availability when they affect the design;
- privacy, consent, and sensitive-data constraints; and
- available execution path: Hoko MCP, REST API, or dashboard.

Do not block a simple request on irrelevant context. For a multi-channel or conversion workflow, define the measurement plan before creating links.

## Choose the execution path

1. Prefer callable Hoko MCP tools. Discover their live names and schemas; do not assume a frozen tool list.
2. Otherwise use the current [OpenAPI document](https://hoko.to/openapi.json) and REST API from a trusted server environment with a least-privilege key.
3. Otherwise provide exact dashboard guidance and name the minimum scopes needed to automate later.

Never ask the user to paste an API key into chat. Never expose a key in code, logs, URLs, client bundles, or generated artifacts. Re-check Hoko's first-party docs before schema-sensitive, plan-sensitive, or security-sensitive work.

## Operating rules

- Resolve workspace, collection, and permission before reads or mutations. A collection is both an organizational and access boundary.
- Give each distinction that must be compared—channel, creative, placement, partner, or physical QR location—its own measurable link or explicit campaign value.
- Keep destination, preview, UTM, tags, partner, external ID, and tenant ID intentional and consistently named.
- Send lead and sale events only from real application success points through a trusted server path.
- Use opaque, stable external customer IDs. Do not put secrets or sensitive personal data in slugs, destinations, UTMs, tags, referrals, or metadata.
- Confirm destructive or high-blast-radius operations immediately before execution. This includes deleting tags or collections and changing a live destination, password, expiry, cloaking, or routing rule.
- Treat tracking failure as observable. Do not turn an analytics outage into a failed customer signup or purchase unless the product explicitly requires that behavior.

## Completion contract

Verify the parts that apply:

- the direct destination loads and the short link resolves;
- previews, UTM values, collection, tags, and partner are correct;
- every device, country, expiry, password, cloaking, and fallback branch works;
- the final QR scans on a real device and records the intended placement;
- attribution persists without duplicate scripts and the destination host check succeeds;
- lead/sale events use stable identities and appear in Hoko without unsafe retry behavior;
- analytics use explicit date, timezone, collection, filters, retention, and complete pagination; and
- the handoff records owner, link IDs/URLs, naming conventions, test evidence, scopes, and rollback or key-revocation steps.

Report limitations plainly. Separate observed facts from interpretation, and separate reach (clicks) from outcome quality (leads, sales, and revenue).
