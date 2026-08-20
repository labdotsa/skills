# Product model

Read this when planning a Hoko setup or working across multiple resource types.

## Resource map

```text
Workspace
├── API keys
├── Participants ── roles scoped per collection
├── Collections
│   └── Links
│       ├── Tags (many)
│       ├── UTM/referral data
│       ├── Partner (optional)
│       ├── routing/protection/presentation rules
│       └── Clicks
│           └── attributed lead/sale events
└── Customers ── upserted by conversion events
```

- A workspace separates a team, client, or project.
- Every link belongs to one collection.
- Collections organize campaigns and control both participant access and analytics visibility.
- Tags classify links across a collection and support filtering/analysis.
- A partner represents an affiliate or collaborator and can be associated with a link.
- A customer is an integration identity created or updated through lead/sale tracking; it is not the same as an anonymous click visitor.

See Hoko's [getting started](https://hoko.to/help/getting-started), [collections](https://hoko.to/help/collections), and [API introduction](https://hoko.to/docs/introduction).

## Access model

Roles apply per collection and may differ for one participant across collections:

- Owner: full access plus workspace identity/settings and member management.
- Admin: manages collections/content and invitations.
- Editor: creates and edits links, tags, partners, and templates.
- Viewer: reads links and analytics.
- No access: cannot see the collection.

Resolve both the active workspace and collection before operating. Do not infer permission from workspace membership alone. See [Participants](https://hoko.to/help/participants).

## Campaign model

Choose a hierarchy that matches the reporting and access questions:

- Workspace: durable organizational boundary.
- Collection: client, campaign family, product, or access boundary.
- Link: one measurable destination/placement combination.
- Tag: cross-cutting classification such as region, channel family, or lifecycle.
- UTM/referral values: external campaign taxonomy.
- Partner: accountable affiliate or collaborator.
- External ID: stable synchronization key from another system.
- Tenant ID: caller-defined segmentation for multi-tenant integrations.

Do not use a single generic link where separate reporting matters. Do not create collections merely as visual folders when the intended users should share the same access and reporting boundary.

## Lifecycle

Editing a link retains historical analytics. Link, collection, partner, and customer deletion is documented as soft deletion; tag deletion is permanent. Customer creation is not a standalone API operation: customers are upserted by conversion events, then may be read or updated.

Plans and retention affect limits and available controls. Verify current entitlements in Hoko rather than copying quotas or prices into implementation logic.
