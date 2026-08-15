# Identity and roles

## Prefixes identify resources, not business roles

Use the prefix to identify the table or stable resource that owns the identity:

```text
entity_01J...   shared party identity
invoice_01J...  invoice resource
```

Do not encode mutable or combinable roles into the root ID:

```text
client_01J...   // wrong when the same entity can also be a vendor
vendor_01J...   // a separate identity would force duplication
```

Instead, model the shared root and roles separately:

```sql
create table entity (
  workspace_id text not null,
  id text primary key,
  unique (workspace_id, id)
);

create table client (
  workspace_id text not null,
  entity_id text not null,
  primary key (workspace_id, entity_id),
  foreign key (workspace_id, entity_id)
    references entity (workspace_id, id)
);

create table vendor (
  workspace_id text not null,
  entity_id text not null,
  primary key (workspace_id, entity_id),
  foreign key (workspace_id, entity_id)
    references entity (workspace_id, id)
);
```

Use separate role tables when roles have distinct fields, lifecycle, permissions, or access paths. Use an `entity_role` junction only when all roles share those semantics. A role prefix is appropriate only when the role itself is an independently addressable resource with its own identity and lifecycle.

## Strengthen role-specific references

A column named `vendor_id` typed as `entity` proves only that the entity exists. If a fact requires vendor membership, reference the role relation:

```sql
foreign key (workspace_id, vendor_id)
  references vendor (workspace_id, entity_id)
```

Apply the same rule to `client_id`, `approver_id`, or other role-specific references. Keep the root entity FK as well when the database or ORM benefits from direct navigation, but avoid redundant constraints that can disagree. Ensure parent uniqueness supports every composite FK.

## Polymorphic references

Choose a controlled representation:

- **Common root** — store one prefixed root ID when all targets share identity and authorization.
- **Separate columns** — store `entity_id`, `invoice_id`, and a checked discriminator when the target set is small and integrity is critical.
- **Registry** — store `target_id` plus a registry row that owns target kind, tenant, and lifecycle when many kinds must be addressed uniformly.
- **Opaque external reference** — use tagged text only when the owning service validates existence and replay behavior.

Never treat `prefix → table name` routing as a foreign key. Resolve the prefix through the registry, scope the query by tenant, authorize the target, and handle missing or retired resources explicitly.
