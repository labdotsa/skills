import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[2] / "scripts" / "portfolio.py"


def run(payload, *args):
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8") as handle:
        json.dump(payload, handle, allow_nan=False)
        handle.flush()
        return subprocess.run([sys.executable, str(SCRIPT), handle.name, *args], text=True, capture_output=True)


def base(**overrides):
    row = {"url": "https://example.com/a", "clicks": 2, "previous_clicks": 10, "impressions": 100, "conversions": 0, "referring_domains": 0, "citation_count": 0, "updated_at": "2025-01-01", "protected": False}
    row.update(overrides)
    return row


THRESHOLDS = {"min_clicks": 3, "decline_fraction": 0.8, "min_impressions": 50, "stale_days": 30, "recent_days": 7}


class PortfolioCliTests(unittest.TestCase):
    def test_retire_and_missing_are_distinct(self):
        result = run({"thresholds": THRESHOLDS, "pages": [base(), base(url="https://example.com/missing", clicks=None)]}, "--as-of", "2025-02-15")
        self.assertEqual(result.returncode, 0)
        pages = json.loads(result.stdout)["pages"]
        self.assertEqual([page["recommendation"] for page in pages], ["update", "investigate"])
        self.assertEqual(pages[1]["missing"], ["clicks"])

    def test_protected_recent_and_equivalent_gate(self):
        protected = base(url="https://example.com/protected", protected=True)
        recent = base(url="https://example.com/recent", updated_at="2025-02-10")
        overlap = base(url="https://example.com/overlap", equivalent_verified=True, overlap_verified=True)
        result = run({"thresholds": THRESHOLDS, "pages": [protected, recent, overlap]}, "--as-of", "2025-02-15")
        pages = json.loads(result.stdout)["pages"]
        self.assertEqual([page["recommendation"] for page in pages], ["investigate", "investigate", "keep"])

    def test_verified_equivalent_and_exact_boundary(self):
        equivalent = base(equivalent_url="https://example.com/target", equivalent_verified=True, overlap_verified=True)
        boundary = base(url="https://example.com/boundary", clicks=3, previous_clicks=10)
        result = run({"thresholds": THRESHOLDS, "pages": [equivalent, boundary]}, "--as-of", "2025-02-15")
        pages = json.loads(result.stdout)["pages"]
        self.assertEqual(pages[0]["recommendation"], "consolidate")
        self.assertEqual(pages[1]["recommendation"], "update")

    def test_validation_has_no_stdout(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8") as handle:
            handle.write('{"thresholds":{"min_clicks":NaN,"decline_fraction":0.8,"min_impressions":50,"stale_days":30,"recent_days":7},"pages":[]}' )
            handle.flush()
            result = subprocess.run([sys.executable, str(SCRIPT), handle.name, "--as-of", "2025-02-15"], text=True, capture_output=True)
        self.assertEqual(result.returncode, 2)
        self.assertEqual(result.stdout, "")

    def test_nonfinite_calculation_has_no_partial_report(self):
        payload = {"thresholds": THRESHOLDS, "pages": [base(clicks=1e308, previous_clicks=1e-300)]}
        result = run(payload, "--as-of", "2025-02-15")
        self.assertEqual(result.returncode, 2)
        self.assertEqual(result.stdout, "")
        self.assertIn("non-finite", result.stderr)

    def test_invalid_utf8_has_no_partial_report(self):
        with tempfile.NamedTemporaryFile("wb", suffix=".json") as handle:
            handle.write(bytes([255, 254]))
            handle.flush()
            result = subprocess.run([sys.executable, str(SCRIPT), handle.name, "--as-of", "2025-02-15"], text=True, capture_output=True)
        self.assertEqual(result.returncode, 2)
        self.assertEqual(result.stdout, "")
        self.assertIn("error:", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

    def test_duplicate_future_and_bad_boolean_rejected(self):
        duplicate = {"thresholds": THRESHOLDS, "pages": [base(), base()]}
        self.assertEqual(run(duplicate, "--as-of", "2025-02-15").returncode, 2)
        future = {"thresholds": THRESHOLDS, "pages": [base(updated_at="2025-02-16")]}
        self.assertEqual(run(future, "--as-of", "2025-02-15").returncode, 2)
        bad_bool = {"thresholds": THRESHOLDS, "pages": [base(protected=1)]}
        self.assertEqual(run(bad_bool, "--as-of", "2025-02-15").returncode, 2)

    def test_fixed_as_of_makes_output_repeatable(self):
        payload = {"thresholds": THRESHOLDS, "pages": [base()]}
        first = run(payload, "--as-of", "2025-02-15")
        second = run(payload, "--as-of", "2025-02-15")
        self.assertEqual(first.returncode, 0)
        self.assertEqual(first.stdout, second.stdout)

    def test_absent_numeric_is_unknown(self):
        row = base()
        del row["clicks"]
        result = run({"thresholds": THRESHOLDS, "pages": [row]}, "--as-of", "2025-02-15")
        self.assertEqual(result.returncode, 0)
        page = json.loads(result.stdout)["pages"][0]
        self.assertEqual(page["recommendation"], "investigate")
        self.assertIn("clicks", page["missing"])

    def test_threshold_order_and_malformed_url_rejected(self):
        bad_thresholds = {**THRESHOLDS, "recent_days": 30}
        self.assertEqual(run({"thresholds": bad_thresholds, "pages": [base()]}, "--as-of", "2025-02-15").returncode, 2)
        self.assertEqual(run({"thresholds": THRESHOLDS, "pages": [base(url="http://[bad")]}, "--as-of", "2025-02-15").returncode, 2)

    def test_zero_value_retirement_and_equivalence_review(self):
        zero = base(url="https://example.com/zero", clicks=0, previous_clicks=0, impressions=0, conversions=0, referring_domains=0, citation_count=0)
        unverified = dict(zero, url="https://example.com/unverified", equivalent_url="https://example.com/target")
        verified = dict(unverified, url="https://example.com/verified", equivalent_verified=True, overlap_verified=True)
        result = run({"thresholds": THRESHOLDS, "pages": [zero, unverified, verified]}, "--as-of", "2025-02-15")
        self.assertEqual(result.returncode, 0)
        pages = {page["url"]: page for page in json.loads(result.stdout)["pages"]}
        self.assertEqual(pages[zero["url"]]["recommendation"], "retire")
        self.assertTrue(pages[zero["url"]]["review_required"])
        self.assertEqual(pages[unverified["url"]]["recommendation"], "investigate")
        self.assertEqual(pages[verified["url"]]["recommendation"], "consolidate")

    def test_value_signals_protect_from_destructive_actions(self):
        row = base(clicks=0, previous_clicks=0, impressions=0, conversions=1, referring_domains=0, citation_count=0)
        result = run({"thresholds": THRESHOLDS, "pages": [row]}, "--as-of", "2025-02-15")
        page = json.loads(result.stdout)["pages"][0]
        self.assertEqual(page["recommendation"], "investigate")
        self.assertTrue(page["review_required"])


if __name__ == "__main__":
    unittest.main()
