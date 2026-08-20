---
name: submit-mobile-app-stores
description: Prepare, validate, and execute Apple App Store, TestFlight, and Google Play testing or production submissions. Use when gathering submission information, auditing launch readiness, uploading builds or metadata with Fastlane, or completing store-console submission through a browser.
metadata:
  author: labdotsa
  category: engineering
---

# Submit Mobile App Stores

Build one evidence-backed submission dossier, then use it to prepare, validate, or execute the requested store workflow. Never guess a legal attestation, privacy/data disclosure, content-rating answer, export classification, regulated-feature declaration, territory, price, tester audience, or release decision.

## Establish the target and authority

Identify the store; testing or production intent; track; app and platform; version/build; locales, countries, price, and release mode; requested action; and authorized actor. Treat preparation as reversible. Uploading, inviting testers, submitting, changing availability/pricing, or releasing are external mutations. Confirm the exact target and obtain explicit authorization immediately before the first requested mutation.

## Read only the needed references

1. Always read [submission-dossier.md](references/submission-dossier.md) and create or update the dossier.
2. For App Store or TestFlight, read [apple.md](references/apple.md).
3. For Google Play, read [google-play.md](references/google-play.md).
4. Before Fastlane, API, browser, submission, release, or monitoring work, read [execution.md](references/execution.md).
5. For uncertain, time-sensitive, conditional, or challenged requirements, use [research-basis.md](references/research-basis.md) and re-check current official documentation and the live console.

## Build the dossier

Discover existing facts before questioning the user: inspect manifests, build settings, entitlements/permissions, Fastfiles, metadata, privacy artifacts, data-safety material, release notes, assets, CI, and credential *references*. Query store state read-only when authorized access exists.

For every field record value, source, evidence, scope, requiredness/applicability, sensitivity, validation state, and `checked_at`. Classify missing items as user facts/attestations, agent-generated drafts awaiting approval, reproducibly derived facts, or runtime gates.

After discovery, always produce a **Missing Information Register** containing every unresolved `required`, applicable `required_if`, and `runtime_gate` field for the selected route. Each row must state the store section, missing information, why it is needed, who can answer it, whether the agent can generate or derive a draft, accepted input format, sensitivity, and whether it blocks preparation, upload, review, testing, or release.

Ask the user to provide every unresolved user-owned item. Group questions into short coherent rounds—identity/access, app/build, privacy/content/compliance, listing/assets, testing, then commerce/distribution/release—so the user can answer accurately. After every response, update the dossier and register, derive or generate authorized material, validate it, and ask the next unresolved round. Continue until no required or applicable conditional item is missing, or report the exact blockers and owners. Do not silently omit an unanswered field or interpret silence as `not_applicable`.

Never request or commit raw private keys, tokens, banking/tax data, passwords, recovery codes, or reviewer credentials; ask the user to configure them in a secret manager/keychain/CI or the official console and provide only a reference or completion status.

Run `python3 scripts/validate_dossier.py <dossier.json>` from this skill directory for the canonical JSON shape. Structural validity does not prove truthful attestations or policy compliance.

## Gate readiness

Do not call a route ready until all applicable requirements are verified or explicitly waived where permitted. Verify account/roles/agreements; signed exact artifact and current technical gates; complete metadata/assets; privacy/data/SDK/tracking/encryption/content/audience/account-deletion/reviewer-access declarations; tester and review gates; countries/pricing/products/release controls; regional rules; and human approval of attestations and the final diff.

Test the release artifact, validate links and reviewer access, keep services available, inspect console warnings, and select the exact tested build. A rebuilt binary is a different artifact.

## Execute safely

Prefer Fastlane/API for supported, reproducible, least-privileged actions. Use the built-in browser for bootstrap, agreements, identity/financial setup, console-only questionnaires, production-access applications, and unsupported fields. Browser navigation never authorizes accepting terms or attesting for the user.

Before mutation show account/team, app/package, store/track, version/build/digest, metadata/asset diff, tester or territory audience, price, rollout/release timing, declarations, adapter, first mutation, and stopping point. Stop on mismatch, unexpected diff, new questionnaire, judgment-bearing warning, role failure, agreement change, rejection, or ambiguous release control.

Afterward record actor, time, action, immutable build IDs, edit/submission/release IDs, status, safe console link, and redacted output. Poll only when requested. Preserve reviewer messages in the private record, fix the owning source/dossier, rerun gates, and obtain approval before resubmission.

## Completion output

Report route and mode, readiness by gate, exact artifact/version/build, mutations, current status, blockers and owners, evidence paths, and next authorized action. Never describe an upload as a submission, a submission as approval, approval as release, or testing availability as production availability.
