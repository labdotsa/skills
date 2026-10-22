# Validate findings and fixes

## Give the validator a neutral task

Use a fresh agent for each candidate. Provide the contract, exact source-state identifier, neutral suspected invariant violation, entry point and relevant paths, raw observations, permitted tools, fixture access, and execution limits. Exclude hunter deliberation, desired verdict, severity conclusion, proposed patch, and other validators' opinions.

Ask the validator to trace the path independently and look for effective guards, inaccessible code, incorrect attacker assumptions, configuration constraints, and unsupported impact. It returns its own evidence, validity decision, reproduction result, and unresolved facts. It may read the target source. It cannot alter the target or the coordinator's records.

Record the discoverer and validator IDs, exact reviewed source state, report SHA-256, and how the fresh context was established. Parent-coordinated delegation is valid when the worker cannot spawn agents itself. Label the coordinator's account as an attestation, not cryptographic proof. Check that the supplied report and target still match their recorded digests before reusing the result.

A confirmed source argument establishes each control-relevant step without relying on an unknown deployment fact. Runtime claims require actual execution evidence. If the decisive condition is unknown, use `needs_validation`. If evidence contradicts the claim, use `rejected` with the counterexample or controlling guard. Preserve disagreements until a new resolving check establishes the result.

## Reproduce safely

Record the unpatched source state, environment, fixture identities and ownership, configuration, command or HTTP interaction, expected invariant, actual result, and minimal redacted evidence. Include a legitimate comparison and a negative control when they distinguish a missing check from broken setup.

For example, an object-access test needs an attacker account, a second synthetic owner's object, an allowed same-owner request, and a denied cross-owner expectation. Observing any successful request does not establish an authorization bypass.

Record whether a request reached the relevant operation. A crash before input parsing, a dependency error, a timeout, or an unstarted service does not prove or disprove the suspected violation. Preserve `not_reproduced` separately from `rejected`.

For source-only evidence, set reproduction `not_run` or `blocked` and explain why. Never manufacture commands, response codes, logs, or sanitizer output.

## Calibrate and check the final records

The coordinator deduplicates supported root causes and assigns severity to confirmed records. Explain privileges, attacker effort, configuration conditions, affected confidentiality, integrity, and availability, and the plausible consequence. Label hypothetical chains as hypotheses until their links are supported.

A fresh final reviewer receives the consolidated records and cited raw evidence. It checks source-state consistency, line references, validity and reproduction distinctions, independent validator identity, severity rationale, duplicate handling, patch claims, redaction, coverage gaps, and report totals. It can return a record to `needs_validation` or request a narrower claim.

List the exact confirmed finding IDs checked by this reviewer. Missing, duplicated, stale, or unreviewed records keep the gate open. Include the source state for each review. A source, configuration, dependency, archive, or relevant fixture change invalidates affected prior review even when the finding ID is unchanged.

Record final review as `passed`, `pending`, or `unavailable`. A `confirmed` record without `passed` final review remains visible but prevents an audit `complete` claim. Preserve reviewer disagreements rather than averaging votes.

## Propose or apply a fix

Follow the user's selected delivery mode. Use a disposable copy for patch proposals. For authorized application, preserve unrelated staged and working changes, existing architecture, installed versions, and repository-specific rules. Do not introduce a security refactor unrelated to the finding.

Repair the missing invariant at its actual enforcement point. Add a meaningful regression test when the project supports one. Avoid brittle checks for one proof-of-concept string. Do not invent a build or test result when the environment is unavailable.

Generate a patch from the original pinned source and the intended modified copy using trusted diff tooling without target-controlled filters, helpers, or hooks. Do not handwrite hunk headers. Run a nonmutating syntax and applicability check against the pinned original. Check complete surrounding control flow, including returns, exception paths, and cleanup. Preserve the check command and result.

Artifact checks remain necessary when target execution is blocked. A malformed patch is an artifact failure, not an unverified security fix. Repair it and repeat the check before delivery. If trusted patch tooling is unavailable, provide a repair recommendation and name the missing artifact check. Do not present unchecked text as ready to apply.

## Verify closure and preserved behavior

Use a fresh verifier that did not author the patch. Supply the original finding and baseline reproduction, final source state, permitted environment, expected invariant, and legitimate behavior. Let the verifier derive bypass tests independently.

Run these gates in order:

1. Confirm that the patch applies to the recorded target and that the unpatched baseline actually triggers. If a new snapshot or fixture no longer triggers, investigate the mismatch and keep closure `inconclusive`.
2. Replay the original attack on the patched state and verify that the security invariant holds. A generic error or crash is insufficient.
3. Try distinct plausible bypass classes justified by the cause. For example, vary identity, object ownership, alternate entry point, encoding, redirect handling, or concurrent ordering. Record why an apparent variant is irrelevant. Do not satisfy this gate with repeated copies of one payload.
4. Confirm legitimate permitted behavior and relevant failure handling.
5. Run required project checks. Record exact commands, outcomes, and blockers.

Set patch status to `not_requested`, `proposed`, `unverified`, `verified`, `failed`, or `inconclusive`. `verified` requires all applicable gates, independent verification, and an exact final state. When runtime execution is blocked, a reviewed patch remains `unverified`; describe any completed source checks separately.

Record the baseline and final source manifests and the environment identity for every result. The baseline reproduction must match the vulnerable finding state. Original-attack, bypass, legitimate-behavior, and project-check results must match the final patched state under comparable fixture and environment conditions. A failed legitimate request makes the fix `failed`. A non-triggering or incomparable baseline makes closure `inconclusive`, even if the patched request also fails.

Revalidate affected findings and coverage after changes to source, configuration, dependencies, or fixtures. Do not combine baseline observations from one environment with patched results from another without proving comparability. Preserve both successful and failed attempts.

Check patch files for unrelated changes and secret-bearing context before delivery. Keep artifact parsing and applicability results separate from baseline reproduction, security closure, and regression checks. A verified local patch does not authorize committing, merging, publishing, deploying, or reporting to third parties beyond the user's existing instructions.
