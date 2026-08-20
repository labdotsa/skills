# Embedded click implementation

Use this playbook to implement Hoko attribution in an owned website. It is based on Hoko's live first-party documentation and script behavior, verified on 2026-08-20:

- [Browser attribution script](https://hoko.to/docs/track/analytics-js)
- [Embedded click tracking](https://hoko.to/docs/track/embedded-click)
- [Lead endpoint](https://hoko.to/docs/track/lead)
- [Sale endpoint](https://hoko.to/docs/track/sale)
- [OpenAPI contract](https://hoko.to/openapi.json)

Re-check those sources before publishing an integration because browser and API contracts can change outside this skill.

## Select exactly one browser script

### Redirect-only attribution

Use the unscoped script when visitors first reach the site through a Hoko redirect and the site only needs to persist the appended `hoko_id`:

```html
<script src="https://hoko.to/analytics.js" defer></script>
```

The live script reads `hoko_id` from the current page query string and writes a first-party `hoko_id` cookie for 90 days with `path=/`, `SameSite=Lax`, and `Secure` on HTTPS. It makes no tracking request by itself.

### Embedded click attribution

Use the short-ID script when loading an owned page should itself record a click for a known Hoko link without redirecting:

```html
<script
  src="https://hoko.to/SHORT_ID/analytics.js?utm_source=site&utm_medium=owned&utm_campaign=signup&ref=hero"
  defer
></script>
```

Replace `SHORT_ID` with the path segment from the dedicated Hoko short URL. The link's configured destination hostname must cover the page hostname.

The embedded script also handles `hoko_id` from normal redirects. Do **not** install `https://hoko.to/analytics.js` beside it.

Supported embedded-script query parameters are exactly:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `ref`
- `referral`, used only when `ref` is absent

Encode values with `URL`/`URLSearchParams`; do not concatenate untrusted strings.

## Host-verification invariant

Hoko records the embedded click only when both:

1. the browser `Origin` or `Referer` identifies an allowed host; and
2. the current page URL sent by the signed capture uses an allowed host.

The allowed boundary is the Hoko link's destination hostname or a genuine subdomain. If the link targets `example.com`, `www.example.com` and `shop.example.com` are allowed. If it targets `shop.example.com`, a child such as `checkout.shop.example.com` is allowed, while `example.com` and `blog.example.com` are not. An expired link uses the expiry destination hostname as the boundary.

If either check fails or no usable Origin/Referer exists, Hoko returns a no-op script and creates no click. Fix the Hoko destination or page placement; do not work around host verification.

## Framework-neutral installation

Build the URL through platform APIs and install the script once on each deliberately tracked page:

```ts
const HOKO_SHORT_ID = "replace-with-real-short-id";

export function buildHokoEmbeddedScriptUrl(input: {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  referral?: string;
}) {
  const url = new URL(
    `https://hoko.to/${encodeURIComponent(HOKO_SHORT_ID)}/analytics.js`,
  );
  url.searchParams.set("utm_source", input.source);
  url.searchParams.set("utm_medium", input.medium);
  url.searchParams.set("utm_campaign", input.campaign);
  if (input.content) url.searchParams.set("utm_content", input.content);
  if (input.term) url.searchParams.set("utm_term", input.term);
  if (input.referral) url.searchParams.set("ref", input.referral);
  return url.toString();
}
```

For a client-rendered application, use a keyed loader to prevent duplicate execution for one logical page view:

```ts
export function installHokoEmbeddedScript(src: string) {
  const id = "hoko-embedded-click";
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing?.src === src) return;
  existing?.remove();

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.defer = true;
  document.head.append(script);
}
```

Call it only after deciding that the current route represents a new click to record. A SPA route change is not automatically a new campaign click.

## SvelteKit placement

The package includes two reusable samples:

- [`assets/sveltekit/HokoEmbeddedClick.svelte`](../assets/sveltekit/HokoEmbeddedClick.svelte) installs one script when the owning page mounts, preserves incoming supported campaign values, disables development tracking, and removes the script when that page unmounts.
- [`assets/sveltekit/hoko-embedded.ts`](../assets/sveltekit/hoko-embedded.ts) owns deterministic URL construction and the duplicate-script element ID.
- [`assets/sveltekit/hoko-conversions.server.ts`](../assets/sveltekit/hoko-conversions.server.ts) keeps `HOKO_API_KEY` and conversion calls server-only and returns classified outcomes without throwing into a completed signup flow.
- [`evals/embedded-click-assets.test.ts`](../evals/embedded-click-assets.test.ts) verifies the published URL builder against the supported parameter contract and unresolved-input behavior.

Copy and adapt them into the application; do not import from an installed skill at runtime.

Put the component in each tracked `+page.svelte`, not a reused root layout. This makes a SvelteKit client navigation into the page a deliberate embedded click and prevents unrelated routes from being tracked:

```svelte
<!-- src/routes/signup/+page.svelte -->
<script lang="ts">
	import { PUBLIC_HOKO_SIGNUP_SHORT_ID } from '$env/static/public';
	import HokoEmbeddedClick from '$lib/analytics/HokoEmbeddedClick.svelte';
</script>

<HokoEmbeddedClick
	shortId={PUBLIC_HOKO_SIGNUP_SHORT_ID}
	campaign="website-signup"
	content="signup-page"
/>
```

```svelte
<!-- src/routes/pricing/+page.svelte -->
<script lang="ts">
	import { PUBLIC_HOKO_PRICING_SHORT_ID } from '$env/static/public';
	import HokoEmbeddedClick from '$lib/analytics/HokoEmbeddedClick.svelte';
</script>

<HokoEmbeddedClick
	shortId={PUBLIC_HOKO_PRICING_SHORT_ID}
	campaign="website-pricing"
	content="pricing-page"
/>
```

The short IDs are public identifiers, not API secrets. Resolve them from links created in the intended Hoko workspace/collection and put them in the deployment's public configuration. Use one dedicated link per route when `/signup` and `/pricing` must remain distinguishable; share a link only when combining their click stream is intentional. Both Hoko link destinations must cover the deployed hostname under Hoko's host-verification rule.

Do not guess short IDs, destinations, collection, or campaign naming. Resolve them through Hoko MCP, REST, or the dashboard and record the mapping. Verify the component's mount/unmount behavior with the application's actual Svelte/SvelteKit versions and client-navigation mode; the supplied sample is source to adapt, not a precompiled dependency.

Run the packaged deterministic eval after adapting the helper:

```bash
npx tsx --test path/to/hoko/evals/embedded-click-assets.test.ts
```

Then add a browser test in the target application that navigates into, away from, and back to each tracked route and counts actual Hoko script/capture requests. A library-independent unit eval cannot prove a target application's router lifecycle, CSP, hostname, or network behavior.

## Cookie handoff

The Hoko script URL-encodes the cookie value. Browser code that must read it should decode the exact cookie value:

```ts
export function readHokoClickId(cookie = document.cookie) {
  const prefix = "hoko_id=";
  const row = cookie.split("; ").find((item) => item.startsWith(prefix));
  return row ? decodeURIComponent(row.slice(prefix.length)) : null;
}
```

Prefer server frameworks reading the request cookie directly. In a SvelteKit form action or endpoint:

```ts
const clickId = event.cookies.get("hoko_id") ?? "";
```

The cookie is intentionally readable and is sent to the same-site application server. Do not forward the entire Cookie header to Hoko.

## Server-only conversion adapter

Never call Hoko's lead or sale endpoint directly from public browser code because it would expose the `conversionsWrite` API key. Put the provider call in a server-only module:

```ts
type HokoLead = {
  clickId: string;
  eventName: string;
  customerExternalId: string;
  customerName: string;
  customerEmail?: string | null;
  customerAvatar?: string | null;
  metadata?: Record<string, unknown>;
};

type HokoResult =
  | { ok: true; status: 201; data: unknown | null }
  | {
      ok: false;
      kind: "missing-attribution" | "configuration" | "network" | "http";
      status?: number;
      retryable: boolean;
    };

export async function trackHokoLead(input: HokoLead): Promise<HokoResult> {
  const apiKey = process.env.HOKO_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, kind: "configuration", retryable: false };
  }

  try {
    const response = await fetch("https://hoko.to/api/track/lead", {
      method: "POST",
      signal: AbortSignal.timeout(5_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (response.status === 201) {
      return {
        ok: true,
        status: 201,
        data: await response.json().catch(() => null),
      };
    }

    return {
      ok: false,
      kind: "http",
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
    };
  } catch {
    return { ok: false, kind: "network", retryable: true };
  }
}
```

This response classification does not authorize automatic mutation retries. Hoko's public conversion contract does not document an idempotency key. Before retrying, use an application-owned durable ledger/outbox keyed by the durable signup/order/invoice event. Record pending, accepted Hoko response IDs, terminal rejection, and uncertain delivery states; reconcile uncertain states before another send.

For SvelteKit, use `$env/dynamic/private` or another server-only secret boundary instead of `process.env` when appropriate. The active Bindlink pattern also treats a missing `hoko_id` as an observable skip for campaigns that require direct attribution and logs only safe context.

## Application success flow

Use the application's authoritative success event:

```ts
export const actions = {
  default: async (event) => {
    // 1. Authenticate/authorize as required.
    // 2. Validate the form.
    // 3. Persist the real signup/lead first.
    const customer = await createCustomerFromValidatedForm(event);

    // 4. Record Hoko attribution server-side.
    const clickId = event.cookies.get("hoko_id");
    const tracking: HokoResult = clickId
      ? await trackHokoLead({
          clickId,
          eventName: "Sign up",
          customerExternalId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
        })
      : { ok: false, kind: "missing-attribution", retryable: false };

    // 5. Persist/queue the tracking outcome for reconciliation.
    await recordTrackingOutcome(customer.id, tracking);
    return { success: true };
  },
};
```

`createCustomerFromValidatedForm` and `recordTrackingOutcome` are application responsibilities, not Hoko functions. Replace them with the project's service/repository calls. The missing-cookie branch deliberately skips tracking; it does not send `clickId: ""`. Use deferred attribution only when the product explicitly chooses and tests it. Unless tracking is contractually required for the primary transaction, do not fail a completed signup or payment only because Hoko is unavailable.

## Lead and sale invariants

Lead requests require `clickId`, `eventName`, `customerExternalId`, and `customerName`. An empty click ID invokes Hoko's documented deferred tracking against customer history and fails if no prior lead exists; do not use empty string accidentally.

Sale requests require `customerExternalId`, integer `amount`, and `customerName`. Attribution priority is `leadEventName` → `clickId` → most recent customer lead. If none is available, the request fails. Hoko documents the integer constraint but not the monetary unit; obtain and preserve the source system's verified convention rather than guessing.

## CSP and privacy

An embedded integration generally needs Hoko allowed by:

- `script-src https://hoko.to` for the script;
- `connect-src https://hoko.to` for signed capture requests.

Merge these origins into the site's existing CSP; do not weaken other directives. Do not use a referrer policy that prevents both usable Referer and Origin for the capture. Confirm the observed headers in the target browser instead of assuming policy behavior.

Before production, confirm tracking authority, consent/cookie requirements, privacy notice, data minimization, and retention for the operating jurisdictions. The full current page URL is captured; keep secrets and sensitive personal data out of URLs and query strings.

## Required verification

Use a production-like HTTPS environment whose hostname is inside the Hoko destination boundary.

1. Open browser developer tools with an empty `hoko_id` cookie.
2. Load the tracked page without `hoko_id` in its URL.
3. Confirm one embedded script request and its subsequent signed capture request to Hoko.
4. Confirm a first-party `hoko_id` cookie exists and is scoped to `/`.
5. Confirm one new click appears for the intended Hoko link with the expected full page destination and UTM/referral values.
6. Reload once and verify whether another click is expected by the product's page-view definition; prevent accidental duplicate injection.
7. Navigate away and back using SvelteKit client navigation; confirm exactly one new script/capture for the new route entry and no capture on unrelated routes.
8. Visit through the normal Hoko short link with a different `hoko_id`; confirm redirect attribution replaces the cookie.
9. Load the embedded page again without a URL `hoko_id`; confirm the embedded click does not replace that redirect cookie.
10. Complete a real test lead through the application server and confirm HTTP `201`, returned lead/customer IDs, ledger state, and Hoko reporting.
11. Verify no API key appears in page source, browser requests to the application, logs, or built client assets.

Also test a disallowed hostname or deliberately mismatched destination and confirm no click is created.

## Troubleshooting

| Symptom                              | Check                                                                     | Corrective action                                                              |
| ------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Script loads but no click appears    | Hoko destination hostname, current page hostname, Origin/Referer          | Align the destination boundary and deploy on HTTPS; do not bypass verification |
| No script request                    | Route predicate, CSP `script-src`, ad blocker, JavaScript                 | Fix placement/CSP and record client blocking as a limitation                   |
| Script request but no signed capture | CSP `connect-src`, browser console/network, no-op response conditions     | Allow Hoko connections and verify host/referrer inputs                         |
| No `hoko_id` cookie                  | JavaScript execution, cookie policy, HTTPS, signed capture                | Resolve browser/CSP/consent constraints and retest                             |
| Cookie changes unexpectedly          | Both scripts installed, URL contains `hoko_id`, duplicate loaders         | Keep only the embedded script and preserve documented redirect precedence      |
| Lead returns `400`                   | Required fields, lengths, email/avatar formats, accidental empty click ID | Validate against current OpenAPI and choose deferred tracking explicitly       |
| Lead returns `401`/`403`             | Secret configuration and `conversionsWrite` scope                         | Rotate/configure a least-privilege server key                                  |
| Lead returns `429`                   | Rate-limit headers and application delivery ledger                        | Back off with jitter; reconcile before retrying                                |
| Duplicate leads/sales                | Provider/webhook retries and missing application idempotency              | Deduplicate by durable business event before sending                           |

Do not declare completion from cookie presence alone. Completion requires a Hoko click plus a server-side conversion test when conversions are part of the requested workflow.
