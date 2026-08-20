# Capability boundaries

Read this when a request uses broad language such as “analyze my site,” “capture leads,” “build a landing page,” “connect my CRM,” or “use a branded domain.”

## Site analysis

Hoko documents link/campaign analytics and embedded click attribution on an owned page. It does not publicly document a general SEO, accessibility, performance, content-quality, security, or competitor crawler.

- If the user means Hoko-attributed site traffic, instrument redirect or embedded attribution and analyze the captured campaign data.
- If the user means a site-quality audit, use an appropriate audit capability separately and explain that Hoko can measure campaign outcomes after recommendations are deployed.

See [Embedded click tracking](https://hoko.to/docs/track/embedded-click) and [Analytics](https://hoko.to/docs/analytics/introduction).

## Lead capture

Hoko records lead events and upserts customers. It does not publicly document a hosted form/widget builder, landing-page builder, CRM pipeline, or email sender.

- Keep the user's existing form/application.
- Add Hoko attribution to the visitor journey.
- Emit a lead from the trusted success path.
- Use another authorized system for form hosting, CRM workflow, or email automation.

## Publicly undocumented or limited automation

Do not claim current public support without re-checking Hoko's sitemap, help center, OpenAPI, and MCP inventory for:

- custom branded domains rather than custom slugs on `hoko.to`;
- API management of workspaces, participants, invitations, UTM templates, billing, profile/avatar storage, or dashboard settings;
- API retrieval of general lead/sale event tables or all dashboard funnel/revenue aggregates;
- standalone customer creation outside conversion tracking;
- native webhook/Zapier catalogs; or
- hosted forms, pages, CRM, or campaign messaging.

Absence from public documentation is not proof a private/new capability does not exist. It is a boundary on what the public skill may promise.

## Rolling product facts

Plans, prices, quotas, retention, feature eligibility, schemas, MCP tools, and dashboard coverage can change. Before a plan-sensitive or schema-sensitive answer, verify:

- [Hoko homepage and pricing](https://hoko.to/);
- [Help Center](https://hoko.to/help/getting-started);
- [API docs](https://hoko.to/docs/introduction);
- [OpenAPI](https://hoko.to/openapi.json);
- `https://hoko.to/mcp`; and
- [sitemap](https://hoko.to/sitemap.xml).

State the verification date and distinguish documented capability, observed behavior, and inference.
