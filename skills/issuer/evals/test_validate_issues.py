from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


VALIDATOR = Path(__file__).parents[1] / "scripts" / "validate_issues.py"


def body(
    identifier: str,
    *,
    status: str = "Todo",
    issue_type: str = "AFK",
    blocker: str = "None — can start immediately.",
    checked: bool = False,
) -> str:
    mark = "x" if checked else " "
    return f"""# Deliver observable behavior

Status: {status}
Type: {issue_type}
Priority: P1
Issuer ID: {identifier}

## Source

- Accepted scenario SCN-001

## What to build

Deliver one observable outcome.

## Acceptance criteria

- [{mark}] The outcome is observable.

## Verification

- Run the focused public-behavior check.

## Blocked by

{blocker}
"""


class ValidateIssuesTests(unittest.TestCase):
    def run_validator(self, files: dict[str, str], *args: str) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for name, text in files.items():
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(text, encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(VALIDATOR), str(root), *args],
                check=False,
                capture_output=True,
                text=True,
            )

    def test_accepts_valid_graph_and_historical_id_gap(self) -> None:
        result = self.run_validator(
            {
                "0000-first-outcome.md": body("0000"),
                "0002-second-outcome.md": body(
                    "0002",
                    blocker="- [Deliver observable behavior](./0000-first-outcome.md)",
                ),
            }
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("2 issue(s)", result.stdout)

    def test_rejects_plain_text_dependency(self) -> None:
        result = self.run_validator(
            {"0000-first-outcome.md": body("0000", blocker="- Earlier ticket")}
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("relative Markdown .md link", result.stderr)

    def test_rejects_afk_dependency_on_hitl(self) -> None:
        result = self.run_validator(
            {
                "0000-human-decision.md": body("0000", issue_type="HITL"),
                "0001-agent-work.md": body(
                    "0001",
                    blocker="- [Deliver observable behavior](./0000-human-decision.md)",
                ),
            },
            "--allow-hitl",
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("AFK issue cannot depend on HITL", result.stderr)

    def test_rejects_done_issue_with_unchecked_criteria(self) -> None:
        result = self.run_validator(
            {"0000-finished-outcome.md": body("0000", status="Done")}
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("Done issues must have every acceptance criterion checked", result.stderr)

    def test_enforces_active_queue_limit(self) -> None:
        files = {
            f"{number:04d}-outcome-{number}.md": body(f"{number:04d}")
            for number in range(3)
        }
        result = self.run_validator(files, "--max-active", "2")
        self.assertEqual(result.returncode, 1)
        self.assertIn("maximum is 2", result.stderr)


if __name__ == "__main__":
    unittest.main()
