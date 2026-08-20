# Google Play

Re-check [target API](https://developer.android.com/google/play/requirements/target-sdk), policy status, account/app dashboards, App Content, and upload validation before execution.

## Shared prerequisites

- Verified developer account, current public/contact requirements, agreement, correct permissions, and payments profile when monetized.
- App record with immutable package, app/game, free/paid, default language and distribution. A free app cannot become paid under the same package.
- AAB for new apps, unique increasing `versionCode`, `versionName`, current target/toolchain, Play App Signing/upload key, digest and processed upload. Inventory permissions/features/devices; meet current architecture/page-size rules; retain mappings/symbols.

## Listing inventory

Per locale/form factor gather title (current limit 30), short description (80), full description (4,000), category/tags, developer contacts, privacy policy, release notes; 512×512 icon, 1024×500 feature graphic, required phone and other form-factor screenshots/art, optional promo video. Record slot, dimensions, format, locale, truthful content, rights and validation. Validate current [asset specifications](https://support.google.com/googleplay/android-developer/answer/9866151).

## App Content and policy

Complete every applicable declaration: privacy/Data safety from actual code/SDK/backend flows; app access; ads; target audience; IARC; government and financial features; account deletion; sensitive/restricted permissions and API forms; news, health, medical, VPN, foreground service, exact alarm, photo/video, ad ID, SMS/call log, accessibility, packages, full-screen intent and other current triggers; Families, UGC, regulated goods, gambling, finance/crypto, dating and licensing. An authorized human approves answers whenever code, SDKs, data, features, audience or rules change.

## Testing

- Internal: current limit 100 testers via email lists/Google Groups; record release, notes, feedback and opt-in URL; configure billing/license testers separately.
- Closed: record track/countries/lists/groups/opt-in/release notes. New personal accounts after 2023-11-13 currently require 12 continuously opted-in testers for 14 days before a production-access application; verify live.
- Open: requires production access and is publicly discoverable; gather countries/cap/feedback/notes/opt-in and ensure public listing/policy readiness.

For every track record exact version code, targeting, opt-in evidence, review state and availability. Membership is not proof of opt-in.

## Production

Complete listing/App Content; select territories/devices; pricing/payments/tax/products; obtain production access; choose managed publishing, timing, staged rollout and priority; review exact changes before review/rollout. Distinguish Draft, In review, Changes not sent, Ready to publish, Publishing, Available, Rejected, Removed and Suspended. Halt regressions; a completed rollout needs a higher-version corrective release.

## Browser/human gates

Use Console and an authorized human for identity/payments bootstrap, initial app/first upload where required, signing decisions, production-access application, App Content attestations, appeals, and unsupported regional/commerce settings.

Primary references: [app setup](https://support.google.com/googleplay/android-developer/answer/9859152), [release](https://support.google.com/googleplay/android-developer/answer/9859348), [testing access](https://support.google.com/googleplay/android-developer/answer/14151465), [signing](https://support.google.com/googleplay/android-developer/answer/9842756), and [Publishing API](https://developers.google.com/android-publisher).
