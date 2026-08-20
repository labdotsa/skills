# Apple App Store and TestFlight

Re-check [upcoming requirements](https://developer.apple.com/news/upcoming-requirements/), [required properties](https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties), roles, agreements, and live app state before execution.

## Shared prerequisites

- Active Developer Program membership, 2FA, Team ID, app access, sufficient role, and accepted agreements; paid apps/IAP additionally need Account Holder-approved paid agreement and completed banking/tax.
- Explicit Bundle ID, app record, SKU, language/platforms, capabilities/entitlements, and extension/watch/App Clip IDs.
- Correctly signed distribution archive; unique version/build; exact digest; current Xcode/SDK; validation, upload and processing; verified encryption/export answer. Do not use Internal Only when external/production reuse is intended.

## Production inventory

- App level: localized name, language, IDs, categories, age rating, rights, privacy policy, EULA, Kids choice, Game Center/App Clip, accessibility declarations.
- Version/locale: description, keywords, Support URL, screenshots, version, copyright, review info; What's New for updates; optional subtitle, promotional text, Marketing URL/previews; platform-specific assets.
- Assets: all live required device wells/form factors, 1–10 valid screenshots per required well, qualifying previews and required icons/art. Validate live dimensions and formats.
- Privacy/compliance: code/SDK/backend data map; App Privacy purposes/linkage/tracking; policy/choices; ATT/IDFA; deletion/login behavior; privacy manifests, domains, required-reason APIs/SDK signatures; export classification; current rating; ads/children/UGC/rights and every regulated-feature rule.
- Review: real contact, persistent credentials via secret reference, exact MFA/location/hardware/QR/fixture steps, notes/attachments, available backend and purchases.
- Commerce/distribution: price/tax/base storefront/overrides/dates, territories, products, regional fields, business/private distribution, preorder, release mode/date and phased release.

Select the processed exact build, resolve blockers, review the final submission, then submit only when authorized. Track Ready for Review, Waiting for Review, In Review, Pending Developer Release, Ready for Distribution, rejection/removal, and actual availability separately.

## TestFlight internal

Create/select an internal group and eligible App Store Connect users (current limit 100); process build/export compliance; add build; provide What to Test; choose distribution. Internal-only builds cannot move externally. Builds expire after 90 days.

## TestFlight external

Complete Beta App Description, feedback email, What to Test, Beta App Review contact, sign-in/credentials/instructions/notes and conditional attachments. Create groups, choose build, invite emails or configure public link criteria/cap (current total limit 10,000). The first external-group build requires Beta App Review; later builds may. Record notification choice, review/distribution state and expiry.

## Browser/human gates

Use official UI and an authorized person for enrollment/identity, agreements, tax/banking, DSA trader and legal/regional attestations, unresolved questionnaires and unsupported properties.

Primary references: [workflow](https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow), [submit](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app), [TestFlight](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview), [Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), and [API](https://developer.apple.com/documentation/appstoreconnectapi).
