# Link and campaign workflows

## Design before creation

Write a compact campaign contract:

```text
owner:
goal:
destination:
collection:
channel / placement:
success event:
utm convention:
tags:
partner:
externalId / tenantId:
expiry or routing needs:
```

Create one link per distinction that must be compared. Use reusable UTM templates in the dashboard when consistent values will recur. See [UTM templates](https://hoko.to/help/utm-templates).

## Create a link

1. Confirm the destination is HTTPS, owned or authorized, and safe to publish.
2. Resolve an accessible collection.
3. Choose the short slug, title, description, and preview image deliberately.
4. Add UTM/referral values, tags, partner, external ID, or tenant ID only when they have defined semantics.
5. Add routing/protection controls only when required; then read [routing and protection](routing-and-protection.md).
6. Create through MCP, REST, or dashboard.
7. Test the destination, short URL, preview, campaign values, and analytics.

The API accepts rich metadata and returns a short URL plus QR-code URL. Follow the live [create links contract](https://hoko.to/docs/links/post) rather than freezing request schemas in generated code.

## QR and offline placements

- Use a dedicated link or campaign value for each physical placement that must be compared.
- Generate the QR from the final Hoko link; Hoko's QR URL adds `qr=1` so scans can be distinguished.
- Scan the production artwork at intended size, distance, lighting, and mobile network conditions.
- Verify the resolved destination and a resulting QR-classified click.
- Preserve a readable short URL beside critical QR codes as a fallback.

Embedded tracking does not classify a click as a QR scan. See [trackable QR codes](https://hoko.to/features/trackable-qr-codes).

## Bulk import or synchronization

Use stable `externalId` values to reconcile Hoko with another system and `tenantId` only when its meaning is documented.

1. Fetch existing records by stable ID.
2. Normalize and validate all HTTPS URLs, IDs, tags, timestamps, and country codes.
3. Produce a dry-run summary: creates, updates, unchanged, rejected, and deletions.
4. Confirm overwrite and deletion scope.
5. Send bounded chunks within the live API and plan limits.
6. Record returned Hoko IDs and reconcile counts.
7. Retry only operations whose idempotency is understood.

The published hard maximum for bulk mutation is not a durable operational batch size. Respect current plan/resource limits, rate headers, payload size, and failure recovery.

## Update or remove

Before changing a live link, identify every placement that depends on its stable URL. Destination, routing, password, expiry, preview, and cloaking changes can affect active traffic immediately.

Before removal, confirm whether the user wants the Hoko resource hidden or merely the campaign stopped. Historical analytics may remain after soft deletion. Tag deletion is permanent and requires explicit confirmation.
