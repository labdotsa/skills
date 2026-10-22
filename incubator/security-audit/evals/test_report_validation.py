#!/usr/bin/env python3
"""Regression tests for the structured audit-report contract."""

from __future__ import annotations

import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "validate_report.py"
sys.path.insert(0, str(SCRIPT.parent))
from validate_report import MAX_BYTES, validate_report  # noqa: E402


def finding(*, validity: str = "confirmed", source: str = "commit-final", finding_id: str = "SEC-001") -> dict:
    return {
        "id": finding_id,
        "discovered_by": "hunter-1",
        "source_state": source,
        "validity": validity,
        "severity": "high" if validity == "confirmed" else None,
        "independent_validation": {
            "source_state": source,
            "report_sha256": "a" * 64,
            "fresh_context": True,
            "reviewer": "reviewer-1",
            "outcome": "passed",
            "evidence": ["validator traced the source path"],
        },
        "reproduction": {
            "status": "not_run",
            "blocker": "runtime was outside the authorized static-only scope",
        },
        "final_review": {
            "status": "passed",
            "reviewer": "coordinator-1",
            "source_state": source,
        },
        "fix": {"status": "not_requested"},
    }


def complete_report() -> dict:
    return {
        "audit_status": "complete",
        "source_state": "commit-final",
        "coverage": [{"id": "boundary-auth", "state": "reviewed", "evidence": ["authorization path traced"]}],
        "findings": [finding()],
        "final_review": {
            "status": "passed",
            "reviewer": "coordinator-1",
            "source_state": "commit-final",
            "reviewed_ids": ["SEC-001"],
        },
    }


def verified_fix() -> dict:
    report = complete_report()
    report["source_state"] = "commit-vulnerable"
    report["findings"][0]["source_state"] = "commit-vulnerable"
    report["findings"][0]["independent_validation"]["source_state"] = "commit-vulnerable"
    report["findings"][0]["final_review"]["source_state"] = "commit-vulnerable"
    report["final_review"]["source_state"] = "commit-vulnerable"
    report["findings"][0]["fix"] = {
        "status": "verified",
        "authored_by": "patch-author",
        "independent_reviewer": "fix-reviewer",
        "final_source_state": "commit-final",
        "baseline_result": {
            "status": "reproduced",
            "source_state": "commit-vulnerable",
            "environment": "sandbox-1",
            "evidence": ["baseline exploit reached the sink"],
        },
        "original_attack_result": {
            "status": "passed",
            "source_state": "commit-final",
            "environment": "sandbox-1",
            "evidence": ["original exploit was rejected"],
        },
        "bypass_results": [
            {
                "status": "passed",
                "source_state": "commit-final",
                "environment": "sandbox-1",
                "evidence": ["alternate encoding was rejected"],
                "class": "alternate-encoding",
            }
        ],
        "legitimate_behavior_result": {
            "status": "passed",
            "source_state": "commit-final",
            "environment": "sandbox-1",
            "evidence": ["authorized request still succeeded"],
        },
        "project_checks": [
            {
                "status": "passed",
                "source_state": "commit-final",
                "environment": "sandbox-1",
                "evidence": ["unit and static checks passed"],
            }
        ],
        "blockers": [],
    }
    return report


class ReportValidationTests(unittest.TestCase):
    def assertInvalid(self, report: dict, text: str) -> None:
        errors = validate_report(report)
        self.assertTrue(any(text in error for error in errors), errors)

    def test_complete_requires_final_review(self) -> None:
        report = complete_report()
        report["final_review"] = {"status": "pending", "source_state": "commit-final", "reviewed_ids": []}
        self.assertInvalid(report, "passed final_review")

    def test_complete_rejects_unresolved_severity(self) -> None:
        report = complete_report()
        report["findings"][0]["validity"] = "candidate"
        self.assertInvalid(report, "severity must be null")
        self.assertInvalid(report, "candidate or needs_validation")

    def test_duplicate_ids_and_omitted_final_ids(self) -> None:
        report = complete_report()
        report["coverage"][0]["id"] = "SEC-001"
        self.assertInvalid(report, "duplicate id")
        report = complete_report()
        report["final_review"]["reviewed_ids"] = []
        self.assertInvalid(report, "omits one or more confirmed")

    def test_stale_validation_source_and_hash(self) -> None:
        report = complete_report()
        report["findings"][0]["independent_validation"]["source_state"] = "old-source"
        self.assertInvalid(report, "match finding source_state")
        report["findings"][0]["independent_validation"]["source_state"] = "commit-final"
        report["findings"][0]["independent_validation"]["report_sha256"] = "short"
        self.assertInvalid(report, "64 hex")

    def test_reproduced_requires_baseline_and_evidence(self) -> None:
        report = complete_report()
        reproduction = report["findings"][0]["reproduction"]
        reproduction["status"] = "reproduced"
        reproduction["baseline_state"] = "old-source"
        self.assertInvalid(report, "baseline_state must match")
        reproduction["baseline_state"] = "commit-final"
        self.assertInvalid(report, "environment is required")
        self.assertInvalid(report, "evidence is required")

    def test_verified_fix_requires_all_runtime_gates(self) -> None:
        report = verified_fix()
        report["findings"][0]["fix"]["legitimate_behavior_result"]["status"] = "failed"
        self.assertInvalid(report, "legitimate_behavior_result.status must be 'passed'")

    def test_untrusted_enum_shapes_return_errors_without_tracebacks(self) -> None:
        for field, value in (("audit_status", []), ("validity", {}), ("coverage_state", [])):
            report = complete_report()
            if field == "coverage_state":
                report["coverage"][0]["state"] = value
            elif field == "validity":
                report["findings"][0][field] = value
            else:
                report[field] = value
            errors = validate_report(report)
            self.assertTrue(errors)
            self.assertTrue(all(isinstance(error, str) for error in errors))

    def test_confirmed_finding_requires_source_bound_reviews_and_distinct_people(self) -> None:
        report = complete_report()
        finding_record = report["findings"][0]
        finding_record["independent_validation"]["reviewer"] = finding_record["discovered_by"]
        self.assertInvalid(report, "reviewer must differ from discovered_by")
        finding_record["independent_validation"]["reviewer"] = "reviewer-1"
        finding_record["final_review"]["reviewer"] = "reviewer-1"
        self.assertInvalid(report, "distinct from discoverer and validator")
        finding_record["final_review"]["reviewer"] = "coordinator-1"
        finding_record["final_review"]["source_state"] = "stale-source"
        self.assertInvalid(report, "final_review.source_state must match")

    def test_confirmed_finding_requires_reproduction_record(self) -> None:
        report = complete_report()
        del report["findings"][0]["reproduction"]
        self.assertInvalid(report, "reproduction is required")

    def test_reviewed_coverage_requires_evidence(self) -> None:
        report = complete_report()
        del report["coverage"][0]["evidence"]
        self.assertInvalid(report, "evidence is required for reviewed coverage")

    def test_passed_finding_review_requires_exact_source_and_complete_coordinator(self) -> None:
        report = complete_report()
        del report["findings"][0]["final_review"]["source_state"]
        self.assertInvalid(report, "final_review.source_state must match")
        report = complete_report()
        report["findings"][0]["final_review"]["reviewer"] = "other-coordinator"
        self.assertInvalid(report, "must match SEC-001.final_review reviewer")

    def test_partial_confirmed_finding_may_have_pending_final_review(self) -> None:
        report = complete_report()
        report["audit_status"] = "partial"
        report["final_review"] = {
            "status": "pending",
            "reviewer": None,
            "source_state": "commit-final",
            "reviewed_ids": [],
        }
        report["findings"][0]["final_review"] = {
            "status": "pending",
            "reviewer": None,
            "source_state": "commit-final",
        }
        self.assertEqual(validate_report(report), [])

    def test_duplicate_review_ids_and_empty_evidence_are_rejected(self) -> None:
        report = complete_report()
        report["final_review"]["reviewed_ids"] = ["SEC-001", "SEC-001"]
        self.assertInvalid(report, "reviewed_ids must not contain duplicates")
        report["final_review"]["reviewed_ids"] = ["SEC-001"]
        report["findings"][0]["independent_validation"]["evidence"] = [{}]
        self.assertInvalid(report, "independent_validation.evidence is required")

    def test_verified_fix_requires_original_attack_environment(self) -> None:
        report = verified_fix()
        report["findings"][0]["fix"]["original_attack_result"]["environment"] = "different-sandbox"
        self.assertInvalid(report, "original_attack_result.environment")

    def test_json_duplicate_keys_nonfinite_numbers_special_files_and_limits(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            duplicate = root / "duplicate.json"
            duplicate.write_text('{"audit_status":"partial","audit_status":"blocked"}', encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), str(duplicate)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertIn("duplicate JSON key", result.stderr)
            nonfinite = root / "nonfinite.json"
            nonfinite.write_text('{"audit_status":"partial","value":NaN}', encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), str(nonfinite)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertIn("non-finite", result.stderr)
            huge_integer = root / "huge-integer.json"
            huge_integer.write_text('{"n":' + ("7" * 5000) + "}", encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), str(huge_integer)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertIn("malformed JSON", result.stderr)
            self.assertNotIn("Traceback", result.stderr)
            overflow = root / "overflow.json"
            overflow.write_text('{"audit_status":"partial","source_state":"x","coverage":[],"findings":[],"final_review":{"status":"pending","source_state":"x","reviewed_ids":[]},"n":1e999}', encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), str(overflow)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertIn("non-finite", result.stderr)
            fifo = root / "report.pipe"
            try:
                fifo.mkfifo()
            except (AttributeError, OSError):
                fifo = None
            if fifo is not None:
                result = subprocess.run([sys.executable, str(SCRIPT), str(fifo)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 2)
                self.assertIn("regular file", result.stderr)
            target = root / "target.json"
            target.write_text("{}", encoding="utf-8")
            link = root / "link.json"
            try:
                link.symlink_to(target)
            except (AttributeError, OSError):
                link = None
            if link is not None:
                result = subprocess.run([sys.executable, str(SCRIPT), str(link)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 2)
                self.assertIn("regular file", result.stderr)
            too_many = complete_report()
            too_many["coverage"] = [{"id": str(index), "state": "reviewed"} for index in range(501)]
            self.assertInvalid(too_many, "maximum record limit")

    def test_verified_fix_rejects_drift_and_same_reviewer(self) -> None:
        report = verified_fix()
        fix = report["findings"][0]["fix"]
        fix["independent_reviewer"] = fix["authored_by"]
        self.assertInvalid(report, "distinct authored_by")
        fix["independent_reviewer"] = "fix-reviewer"
        fix["baseline_result"]["source_state"] = "commit-final"
        self.assertInvalid(report, "must differ from final_source_state")

    def test_verified_fix_rejects_duplicate_bypass_classes_and_wrong_source(self) -> None:
        report = verified_fix()
        fix = report["findings"][0]["fix"]
        fix["bypass_results"].append(copy.deepcopy(fix["bypass_results"][0]))
        self.assertInvalid(report, "duplicate class")
        fix["bypass_results"][1]["class"] = "different-class"
        fix["bypass_results"][1]["source_state"] = "old-source"
        self.assertInvalid(report, "bypass_results[1].source_state")
        fix["original_attack_result"]["source_state"] = "old-source"
        self.assertInvalid(report, "original_attack_result.source_state")

    def test_patch_artifact_needs_passed_artifact_checks(self) -> None:
        report = complete_report()
        report["findings"][0]["fix"] = {
            "status": "unverified",
            "patch_artifact": "patch.diff",
            "artifact_checks": [],
        }
        self.assertInvalid(report, "artifact_checks")

    def test_partial_source_only_and_runtime_verified_reports_are_valid(self) -> None:
        self.assertEqual(validate_report(complete_report()), [])
        self.assertEqual(validate_report(verified_fix()), [])
        partial = {
            "audit_status": "partial",
            "source_state": "illustrative-template-source",
            "coverage": [],
            "findings": [],
            "final_review": {"status": "pending", "source_state": "illustrative-template-source", "reviewed_ids": []},
        }
        self.assertEqual(validate_report(partial), [])

    def test_malformed_oversized_and_deep_json_are_safe_cli_errors(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            malformed = root / "malformed.json"
            malformed.write_text("{", encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), str(malformed)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            oversized = root / "oversized.json"
            oversized.write_bytes(b"{" + b"a" * MAX_BYTES + b"}")
            result = subprocess.run([sys.executable, str(SCRIPT), str(oversized)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            deep = {"audit_status": "partial", "source_state": "x", "coverage": [], "findings": [], "final_review": {}}
            cursor = deep
            for _ in range(25):
                cursor["nested"] = {}
                cursor = cursor["nested"]
            deep_file = root / "deep.json"
            deep_file.write_text(json.dumps(deep), encoding="utf-8")
            result = subprocess.run([sys.executable, str(SCRIPT), str(deep_file)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn("nesting depth", result.stderr)


if __name__ == "__main__":
    unittest.main()
