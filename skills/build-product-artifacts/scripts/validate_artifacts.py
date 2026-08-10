#!/usr/bin/env python3
"""Validate the mechanical integrity of a Markdown product-artifact tree."""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import unquote


IGNORED_DIRS = {".git", ".svelte-kit", "build", "dist", "node_modules"}
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
DECISION_RE = re.compile(
    r"^\|\s*[^|]+\|\s*(D-\d{3,})\s*\|\s*([^|]+?)\s*\|", re.IGNORECASE
)
REQUIREMENT_RE = re.compile(
    r"^\s*[-*]\s+\*\*([A-Z][A-Z0-9]{1,11}-\d{3,}):?\*\*", re.IGNORECASE
)
TABLE_REQUIREMENT_RE = re.compile(
    r"^\|\s*([A-Z][A-Z0-9]{1,11}-\d{3,})\s*\|", re.IGNORECASE
)
ALLOWED_DECISION_STATUSES = {"proposed", "accepted", "rejected", "superseded"}
PLACEHOLDER_RE = re.compile(r"\b(?:TODO|TBD|FIXME)\b|\[TODO[^\]]*\]", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="Artifact root containing Markdown files")
    parser.add_argument(
        "--fail-placeholders",
        action="store_true",
        help="Treat TODO/TBD/FIXME markers as errors",
    )
    return parser.parse_args()


def markdown_files(root: Path) -> list[Path]:
    return sorted(
        path
        for path in root.rglob("*.md")
        if not any(part in IGNORED_DIRS for part in path.relative_to(root).parts)
    )


def local_link_target(raw_target: str) -> str | None:
    target = raw_target.strip()
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1]
    target = target.split(maxsplit=1)[0]
    if not target or target.startswith(("#", "http://", "https://", "mailto:", "app://")):
        return None
    return unquote(target.split("#", 1)[0])


def check_links(path: Path, text: str, errors: list[str]) -> None:
    for raw_target in LINK_RE.findall(text):
        target = local_link_target(raw_target)
        if not target:
            continue
        resolved = (path.parent / target).resolve()
        if not resolved.exists():
            errors.append(f"{path}: unresolved link: {raw_target}")


def check_fences(path: Path, text: str, errors: list[str]) -> None:
    active: tuple[str, int] | None = None
    for line_number, line in enumerate(text.splitlines(), start=1):
        match = re.match(r"^\s*(`{3,}|~{3,})", line)
        if not match:
            continue
        marker = match.group(1)
        signature = (marker[0], len(marker))
        if active is None:
            active = signature
        elif signature[0] == active[0] and signature[1] >= active[1]:
            active = None
    if active is not None:
        errors.append(f"{path}: unbalanced {active[0] * active[1]} code fence")


def collect_ids(
    path: Path,
    text: str,
    definitions: dict[str, list[str]],
    errors: list[str],
) -> None:
    for line_number, line in enumerate(text.splitlines(), start=1):
        decision = DECISION_RE.match(line)
        if decision:
            identifier = decision.group(1).upper()
            status = decision.group(2).strip().lower()
            definitions[identifier].append(f"{path}:{line_number}")
            if status not in ALLOWED_DECISION_STATUSES:
                errors.append(
                    f"{path}:{line_number}: invalid decision status '{decision.group(2).strip()}'"
                )
            continue

        requirement = REQUIREMENT_RE.match(line) or TABLE_REQUIREMENT_RE.match(line)
        if requirement:
            identifier = requirement.group(1).upper()
            if not identifier.startswith("D-"):
                definitions[identifier].append(f"{path}:{line_number}")


def main() -> int:
    args = parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        print(f"error: artifact root is not a directory: {root}", file=sys.stderr)
        return 2

    files = markdown_files(root)
    if not files:
        print(f"error: no Markdown artifacts found under {root}", file=sys.stderr)
        return 2

    errors: list[str] = []
    warnings: list[str] = []
    definitions: dict[str, list[str]] = defaultdict(list)

    for path in files:
        text = path.read_text(encoding="utf-8")
        check_links(path, text, errors)
        check_fences(path, text, errors)
        collect_ids(path, text, definitions, errors)
        if args.fail_placeholders and PLACEHOLDER_RE.search(text):
            errors.append(f"{path}: contains TODO/TBD/FIXME placeholder")

    for identifier, locations in sorted(definitions.items()):
        if len(locations) > 1:
            errors.append(
                f"duplicate definition {identifier}: " + ", ".join(locations)
            )

    index = root / "README.md"
    if not index.exists():
        warnings.append(f"{root}: no README.md artifact index")

    for warning in warnings:
        print(f"warning: {warning}")
    for error in errors:
        print(f"error: {error}", file=sys.stderr)

    if errors:
        print(
            f"FAILED: {len(errors)} error(s), {len(warnings)} warning(s), {len(files)} Markdown file(s)",
            file=sys.stderr,
        )
        return 1

    print(
        f"OK: {len(files)} Markdown file(s), {len(definitions)} unique defined ID(s), "
        f"{len(warnings)} warning(s)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
