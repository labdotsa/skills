# Attribution and conversions

For implementation work, read [Embedded click implementation](embedded-click-integration.md) first. It contains the verified browser contract, server-side examples, framework placement, CSP requirements, tests, and troubleshooting procedure.

## Choose the attribution path

### Redirect attribution

Use the normal Hoko short-link redirect when the visitor can enter through the campaign link. Hoko records the click, and `/analytics.js` on the destination can persist the resulting `hoko_id` for a later conversion.

### Embedded click attribution

Use `/{shortId}/analytics.js` on a page the user controls when a Hoko click must be recorded without a redirect. Hoko validates the destination hostname/subdomain and uses a signed capture flow. JavaScript blocking prevents capture, and referrer policy can limit detail.

Redirect attribution takes precedence: a `hoko_id` arriving in the page URL replaces an older cookie; a newly generated embedded-click ID does not overwrite an existing cookie. Read the current [browser attribution](https://hoko.to/docs/track/analytics-js) and [embedded tracking](https://hoko.to/docs/track/embedded-click) behavior before implementation.

Do not install both scripts repeatedly across nested layouts. Confirm destination authority, consent/cookie obligations, and privacy notices before tracking.

## Lead capture

Hoko does not document a hosted form builder. Keep the existing form or application as the source of truth:

```text
visitor click -> attribution persisted -> form succeeds -> server records Hoko lead
```

1. Define the precise success point; do not fire on page view or submit-button click.
2. Validate and persist the application's lead first, or choose and document the required transactional ordering.
3. Let the application server read the first-party `hoko_id` cookie, or pass the value to the application's own endpoint. Never expose the Hoko API key to the browser.
4. Send the lead with a stable opaque customer external ID, intentional event name, minimum customer fields, and non-sensitive metadata.
5. Observe failures without exposing secrets or breaking the primary user outcome unless required.
6. Verify customer upsert, lead event, attribution, and funnel visibility.

See [Track lead events](https://hoko.to/docs/track/lead). Empty click IDs request deferred attribution and should be used only when that behavior is intentional and verified.

## Sales and revenue

Fire a sale from a verified server-side business event such as paid invoice, captured payment, or completed order—not from an untrusted success-page view.

- Define a stable customer external ID.
- Define event and lead-event names.
- Confirm currency and the amount unit from the current Hoko contract and the source system; do not guess whether an integer is major or minor units.
- Include a stable transaction/invoice ID in metadata when appropriate for reconciliation, but never payment credentials or unnecessary personal data.
- Design application-side idempotency. Network retries, provider webhook retries, and deployment replays must not double-count revenue.
- Verify the event against the source transaction and Hoko reporting.

See [Track sale events](https://hoko.to/docs/track/sale).

## Customer data

Customers are attributed conversion identities, not proof of the anonymous clicker's real identity. Prefer opaque external IDs over email addresses. Minimize name, email, phone, avatar, and free-form metadata. Customer records may be read, updated, or soft-deleted through scoped APIs after conversion-created upsert.

## Bindlink-derived integration pattern

Keep provider mechanics in one server-only module with explicit inputs and structured outcomes:

```text
application action: validate -> authorize -> persist outcome -> call tracking service
tracking service: normalize -> call Hoko -> classify/log result
```

Separate anonymous traffic observation from identified lead/sale events. Make missing attribution and provider failure observable skip/failure states. Never let routes duplicate key handling, payload mapping, retry logic, or safe logging.
