# Canonical submission dossier

Use one dossier per release candidate. JSON is preferred for deterministic validation; YAML is acceptable when the project standardizes on it. Keep secrets outside the dossier.

## Field envelope

Every consequential leaf records `value`, `source` (`user`, `generated`, `derived`, `console`), `requiredness` (`required`, `required_if`, `recommended`, `optional`, `runtime_gate`), `applies_when`, scope, sensitivity, evidence, `checked_at`, status (`missing`, `drafted`, `needs_user`, `verified`, `blocked`, `not_applicable`), and approver. Never use `not_applicable` without evidence. Generated material remains drafted until factual and rights review.

## Canonical shape

```json
{
  "schema_version": 1,
  "submission": {},
  "account": {},
  "commerce": {},
  "app_identity": {},
  "build": {},
  "listing": {"locales": []},
  "privacy": {},
  "content": {},
  "review": {},
  "testing": {},
  "distribution": {},
  "automation": {},
  "approvals": [],
  "submission_log": []
}
```

### Submission and account

Record store, intent, track, new app/update, platforms/form factors, locales/territories, requested action/date, owner and approval state. Record account type/country, legal entity/person, team/developer IDs, enrollment and identity state, contacts, agreements/policy standing, users/roles/app access, D-U-N-S and organization site where applicable. Retain verification evidence, not identity documents.

### Commerce and identity

Record free/paid, merchant/paid-app agreement, payments profile, banking/tax completion, tax category, prices/effective dates, and IAP/subscription/product readiness. Never store bank/tax secrets. Record names, bundle/package ID, SKU/numeric IDs, language, app/game, platforms, categories/tags, content rights, capabilities, and private-distribution identifiers.

### Build

Record artifact path/type/SHA-256, source commit, marketing version, build number/version code, SDK/toolchain, signing mode and secret references, provisioning/certificate or Play App Signing state, entitlements/permissions/features, extensions/App Clips/wearables, architectures/page-size support, symbols/mappings, tests, validation, upload, and processing evidence.

### Listing

Per locale record title/name, subtitle/short description, description, keywords, promotional text, release notes, support/privacy/marketing/accessibility URLs, copyright, contacts, categories/tags, and all icons/screenshots/previews/video/art. Each asset records slot, device/form factor, dimensions, format, locale, truthful content description, rights, and validation.

### Privacy, content, and review

Record policy/deletion/choices URLs; first/third-party data and SDK inventories; disclosures, purposes, sharing/linkage/tracking, retention/deletion/security, ATT/ad ID, children treatment, privacy manifests/required-reason APIs; encryption/export facts and documents. Record audience, rating answers, ads, UGC/moderation, rights, news/AI, government, medical/health, finance/crypto, gambling, VPN, controlled goods, dating, licenses and territories.

Review records contain contact details, notes, feature instructions, demo-account secret reference, SSO/MFA/location/hardware/QR/fixture steps, attachments, purchase flows, and service availability. Never store reviewer passwords directly.

### Testing and distribution

Record track, groups/lists, tester references, public-link controls, opt-in URL, contacts, beta description/instructions, notifications, countries, billing/license testers, beta review, expiry, and production-access evidence. Record countries/storefronts/devices, pricing/tax, preorder/pre-registration, private distribution, release mode/date, phased/staged percentage, managed publishing, and halt/rollback plan.

### Automation, approvals, and log

Record pinned Fastlane/runtime, lane/action, API mode, secret references, permissions, metadata/assets roots, skip flags, validation results, and browser checkpoints. Approvals bind approver authority, scope, dossier digest, declarations, timestamp and supersession. Log artifact digest, build/version and store IDs, actor, adapter, diff, statuses, reviewer correspondence, remediation and rollout events.

## Readiness views

Generate four views: missing user facts/attestations by owner; generated drafts awaiting approval; runtime gates requiring current checks; and executable Fastlane/API, browser, and human-only changes. Completeness is route-specific: do not block an internal test on production-only fields unless the current console requires them.

## Missing Information Register

The register is mandatory after initial discovery and after every user response:

| ID | Store section | Missing information | Requiredness / condition | Why needed | Answer owner | Agent can derive/generate? | Accepted format | Sensitivity | Blocks | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Include every unresolved required field, every conditional field whose predicate is true or not yet known, and every runtime gate awaiting a current check. Unknown applicability is a question, not `not_applicable`. Optional and recommended fields belong in a separate opportunities list and must not obscure blockers.

Convert register rows into user questions grouped in this order when applicable:

1. account identity, agreements, roles and access;
2. app identity, source, build, signing and technical compatibility;
3. privacy, data flows, SDKs, permissions, encryption, audience, content and regulated features;
4. store copy, URLs, localization, screenshots, video and rights;
5. reviewer access, testers, groups, instructions and feedback;
6. pricing, tax status, products, countries, regional declarations, release timing and rollout.

Ask for factual inputs before offering generated drafts. Show generated copy or derived answers for approval and keep their register rows open until approved. If the user cannot answer, preserve the row as blocked with its accountable owner and the exact store stage it prevents.
