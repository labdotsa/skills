# Team governance

## Structure work around access

- Use a workspace for a durable team, client, or project boundary.
- Use collections where campaign organization and participant access should move together.
- Give participants the lowest collection role that supports their work.
- Use tags for classification, not as a substitute for authorization.
- Use partners for affiliate/collaborator attribution, not for internal permissions.

Test access with the actual participant role after changes. Collection visibility also scopes analytics.

## Roles and operational checks

Before inviting or changing access:

1. Identify the person and intended collections.
2. Choose the minimum role per collection.
3. Confirm owner/admin authority.
4. Apply the change.
5. Verify visible links, permitted actions, and analytics scope.
6. Record an access-review owner and date for sensitive collections.

See [Participants](https://hoko.to/help/participants) and [Security](https://hoko.to/help/security).

## Partners

Create a partner when traffic/conversions must be attributed to an affiliate or collaborator. Attach partner-specific links, use consistent channel values, and report clicks and outcomes together. Removing a partner does not delete links but removes their association; confirm reporting consequences first.

## Privacy and data minimization

Hoko attribution may process visitor/session IDs, IP-derived location, browser/device/OS, language, referrer, UTM/referral values, and page URLs. Conversion/customer records may contain names, contact fields, external IDs, transaction values, and metadata.

- Confirm authority over tracked destinations.
- Review applicable consent, cookie, privacy-notice, retention, and data-subject obligations.
- Collect only the fields needed for the stated purpose.
- Prefer opaque external IDs.
- Keep sensitive data out of URLs, slugs, UTMs, tags, and free-form metadata.
- Restrict exports by collection, date, and columns; store them only as long as necessary.
- Do not treat approximate location or device context as verified identity.

Consult Hoko's current [privacy policy](https://hoko.to/policy/privacy) and the user's legal/privacy owner for jurisdiction-specific decisions.

## Destructive and incident operations

Confirm immediately before:

- permanent tag deletion;
- collection deletion, which affects links, access/invites, and analytics visibility;
- participant removal or owner changes;
- partner/customer deletion;
- bulk link deletion; or
- live routing, password, expiry, cloaking, or destination changes.

For an exposed API key: revoke it, create a replacement with minimum scopes, update the secret store, deploy, test, and review relevant usage. For a harmful or hijacked destination: contain the live link first, preserve necessary evidence, then rotate credentials and investigate.

Follow Hoko's current [Terms of Service](https://hoko.to/policy/tos); do not facilitate spam, impersonation, unauthorized solicitation, harmful destinations, or prohibited link-chaining schemes.
