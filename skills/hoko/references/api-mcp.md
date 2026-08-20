# API and MCP

## Source of truth and preference

Use Hoko's live interfaces in this order:

1. Callable Hoko MCP tools at `https://hoko.to/mcp`.
2. REST using the [OpenAPI document](https://hoko.to/openapi.json).
3. Dashboard instructions for unsupported or unavailable automation.

Discover live MCP tools and input schemas at runtime. Do not encode the researched 22-tool inventory as permanent truth.

## REST resource scopes

| Resource        | Operations                | Minimum scope                          |
| --------------- | ------------------------- | -------------------------------------- |
| Links           | list/create/upsert/delete | `linksRead` / `linksWrite`             |
| Collections     | list/create/upsert/delete | `collectionsRead` / `collectionsWrite` |
| Tags            | list/create/upsert/delete | `tagsRead` / `tagsWrite`               |
| Partners        | list/create/upsert/delete | `partnersRead` / `partnersWrite`       |
| Customers       | list/update/delete        | `customersRead` / `customersWrite`     |
| Analytics       | list clicks               | `analyticsRead`                        |
| Leads and sales | track conversions         | `conversionsWrite`                     |

Confirm current scopes in [API keys](https://hoko.to/docs/api-keys).

## Secret handling

- Ask the user to configure a key through an approved environment/secret store, never chat.
- Create separate keys by environment and purpose.
- Grant only required scopes and rotate/revoke compromised keys immediately.
- Keep conversion and customer keys server-side.
- Do not print authorization headers, dump process environments, or commit `.env` files.
- Treat browser hostname allowlists as an extra control, not secret protection; non-browser requests may lack Origin/Referer.

## Client behavior

- Validate request objects before the call.
- Use explicit timeouts and structured success/failure results.
- Respect documented pagination, rate-limit headers, and plan limits.
- On `429`, use bounded exponential backoff with jitter and honor server guidance.
- Retry only safe reads or mutations with understood idempotency.
- Do not return raw provider errors or SDK payloads directly to product UI.
- Log safe context such as operation, event name, external ID hash, status, and correlation ID—never keys or unnecessary PII.

Bulk endpoints may accept large arrays, but choose smaller recoverable chunks and reconcile every response. Treat partial success/failure explicitly if the live contract supports it.

## Mutation preflight

Before executing, show or record:

- workspace/collection;
- resource count and operation;
- creates versus overwrites versus deletes;
- destination/routing changes to live links;
- required scopes;
- dry-run validation failures; and
- rollback or reconciliation strategy.

Require user confirmation for destructive or high-blast-radius changes. Read current [errors](https://hoko.to/docs/errors) and [rate limits](https://hoko.to/docs/rate-limits) before building production automation.
