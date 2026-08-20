# Execution, approval, and monitoring

## Adapter and credentials

Use Fastlane/API for supported repeatable state; browser for bootstrap, questionnaires, legal/identity/financial actions, unsupported fields and visual verification. Never change adapters to bypass a gate.

Pin Fastlane in a `Gemfile`. Prefer least-privileged App Store Connect API keys and Google service accounts/workload identity with explicit Play access. Store keys, sessions, passwords and reviewer credentials outside the repo. Validate access read-only and redact secrets, tester lists and signed URLs.

## Fastlane mapping

- Apple production: `deliver` / `upload_to_app_store` for binary, metadata/assets, review data, build selection, submission and supported release controls. Download/generate metadata, inspect diff, use validation/precheck, and justify skip flags. Agreements, finance, identity, questionnaires and new/regional fields may need browser/API handling.
- TestFlight: `pilot` / `upload_to_testflight` for upload/processing, What to Test, beta review/contact data, groups/testers and distribution. Confirm internal/external, notifications, groups and API-key limitations.
- Google: `supply` / `upload_to_play_store` for AAB/APK, listings/assets, track/promotion, status, countries and staged rollout. Use validation where supported and understand review-change flags. The app and an initial manual upload are documented prerequisites.

Resolve exact options from the pinned version using `bundle exec fastlane action deliver|pilot|supply` and current official docs; never generate a production command from memory.

## Mutation checkpoint

Present account/team, store/app/package, intent/track, version/build/SHA-256, metadata/assets diff, testers/countries, price/products, release/rollout/date, approved declarations, adapter, first mutation, and stopping point. Require fresh approval if any changes.

## Browser procedure

Verify official hostname, account/team, app/package, actor role, agreements, banners and status. Save drafts sectionwise and read them back. Pause at terms, attestations, identity/financial data, irreversible choices, new questionnaires and ambiguous warnings. Reconcile final console summary to the approved dossier before the authorized final action. Capture IDs/status, not sensitive screenshots. Computer use may enter approved facts; it must not choose owner-dependent answers or accept terms for the owner.

## Monitor and remediate

Poll only when requested. Separate upload processing, beta review, app review, publishing and storefront propagation. Preserve status/time/IDs/messages; classify artifact/signing, metadata/assets, privacy/policy, access, agreement/role, commerce/region or store incident; fix the owning source; generate a new build/digest for binary changes; rerun gates and reapprove. Stop on suspension, legal escalation, account mismatch, compromised credentials or requests to misstate behavior.
