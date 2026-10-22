# Structured report contract

`assets/report.json` is a safe partial starter. It has no findings and uses an
explicit illustrative source marker. Replace that marker before reporting an
audit result.

The optional validator at `scripts/validate_report.py` checks bookkeeping and
relationships between records. Run it with:

```sh
python3 scripts/validate_report.py report.json
```

Exit status `0` means the shape is internally consistent. Status `1` means the
JSON is readable but inconsistent. Status `2` means the input is malformed,
unreadable, too large, or called incorrectly. The reader is bounded to 1 MiB,
20 levels of nesting, 10,000 JSON nodes, and 500 combined coverage and finding
records. It rejects duplicate JSON keys, non-finite numbers, symlinks, and
special files.

The contract has five top-level records:

- `audit_status`: `complete`, `partial`, or `blocked`.
- `source_state`: the exact source identifier for this report.
- `coverage`: one current state per stable unit ID (`planned`, `reviewed`,
  `blocked`, `deferred`, or `out_of_scope`). A `reviewed` unit includes
  non-empty evidence.
- `findings`: records based on `assets/finding.yaml` with a required
  `source_state`, `validity`, and `discovered_by` provenance field.
- `final_review`: coordinator record containing `status`, `reviewer`,
  `source_state`, and `reviewed_ids`.

Confirmed findings require independent validation with the same source state,
a 64-character report hash, fresh context, reviewer ID, passed outcome, and
evidence. A finding marked `reproduced` must identify a matching baseline,
environment, and evidence. `not_run` and `blocked` reproduction states need an
explicit blocker.

`complete` is a reporting claim, not a claim that the application is secure. It
requires no planned, blocked, or deferred coverage; no candidate or
`needs_validation` finding; a passed final review; and review IDs covering all
confirmed findings. Complete reports use one final coordinator identity: the
global final-review reviewer must match each confirmed finding's passed
per-finding final-review reviewer. Partial and blocked reports may retain
pending or unavailable per-finding final reviews.

Verified fixes require a confirmed finding, different patch author and
independent reviewer, vulnerable baseline reproduction, a final source state,
the original attack passing on that final state, at least one distinct bypass
class passing, legitimate behavior passing, and non-empty project checks. Each
runtime result must carry the same environment and relevant source state.
Patch artifact syntax/applicability checks are separate from runtime security
verification. A supplied artifact needs passed artifact checks before a
proposal is delivered. A valid unverified proposal is allowed when runtime
testing is blocked.

The validator checks consistency only. It does not execute targets, fetch
network resources, follow paths, establish cryptographic independence, or prove
that evidence is true, current, or sufficient for the stated security claim.
