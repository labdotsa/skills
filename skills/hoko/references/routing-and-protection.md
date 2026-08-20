# Routing and protection

Read this before configuring device/country routing, expiry, password protection, or cloaking.

## Resolution model

Document the intended branch table before mutation:

| Condition    | Destination                     | Fallback | Test evidence |
| ------------ | ------------------------------- | -------- | ------------- |
| Expired      | expired URL or Hoko expiry page | none     |               |
| iOS          | iOS destination                 | default  |               |
| Android      | Android destination             | default  |               |
| Country code | country destination             | default  |               |
| Otherwise    | default HTTPS destination       | none     |               |

Hoko documents this precedence:

1. password gate;
2. expiration;
3. iOS/Android routing;
4. geo routing;
5. default destination;
6. cloaked presentation.

An expired link does not continue to device or geo targeting. Use uppercase ISO 3166-1 alpha-2 keys for geo mappings. Device and country detection are best-effort. Verify the current details in [Create links](https://hoko.to/docs/links/post).

## Protection boundaries

- Password protection gates the Hoko redirect; it does not authorize the destination application.
- Expiry controls the link's public resolution, not access to a destination URL someone already knows.
- Cloaking uses an iframe and can fail when the destination blocks framing or later changes its security policy.
- Geo and device routing are presentation/marketing decisions, not security boundaries.
- Never put credentials, private tokens, or sensitive customer data into any destination URL.

## Test matrix

Test before publishing and after any live-rule change:

- direct default destination;
- active short-link redirect;
- each iOS and Android branch;
- every country override plus unknown-country fallback;
- just-before and just-after expiry;
- expired URL or Hoko expiry page;
- incorrect and correct password behavior, including a fresh browser;
- cloaking on desktop/mobile, navigation, forms, cookie behavior, and accessibility;
- UTM/referral preservation on every branch; and
- analytics attribution for representative branches.

Use real devices or reliable test infrastructure where user-agent, location, cookie, or iframe behavior matters. Record untestable branches instead of claiming they passed.

## Rollback

Keep the prior destination and rule set before mutation. Define who can restore them, how quickly, and whether cached previews or printed QR placements create additional recovery work.
