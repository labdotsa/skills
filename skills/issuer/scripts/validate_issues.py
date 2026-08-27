#!/usr/bin/env python3
"""Validate an Issuer Markdown issue graph."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path


FILENAME_RE = re.compile(r"^(\d{4})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$")
FIELD_RE = re.compile(
    r"^\s*(?:\*\*)?(Status|Type|Priority|Issuer ID)(?:\*\*)?\s*:\s*(.+?)\s*$",
    re.IGNORECASE | re.MULTILINE,
)
HEADING_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
DEPENDENCY_RE = re.compile(r"^\s*-\s+\[[^\]]+\]\(([^)]+\.md)\)\s*$", re.MULTILINE)
CRITERION_RE = re.compile(r"^\s*-\s+\[([ xX])\]\s+(.+?)\s*$", re.MULTILINE)
PLACEHOLDER_RE = re.compile(r"<[^>]+>|\b(?:TBD|FIXME)\b", re.IGNORECASE)
REQUIRED_SECTIONS = ("Source", "What to build", "Acceptance criteria", "Verification", "Blocked by")
ALLOWED_STATUS = {"Todo", "Done"}
ALLOWED_TYPE = {"AFK", "HITL"}
ALLOWED_PRIORITY = {"P0", "P1", "P2", "P3"}
NO_BLOCKER = "None — can start immediately."


@dataclass(frozen=True)
class Issue:
    path: Path
    number: int
    status: str
    issue_type: str
    dependencies: tuple[str, ...]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="Flat directory containing Issuer Markdown files")
    parser.add_argument(
        "--max-active",
        type=int,
        default=10,
        help="Maximum Todo AFK issues; 0 disables the limit (default: 10)",
    )
    parser.add_argument(
        "--allow-hitl",
        action="store_true",
        help="Allow HITL files for a non-Orchestrator mixed queue",
    )
    return parser.parse_args()


def section(text: str, heading: str) -> str | None:
    match = re.search(
        rf"^##\s+{re.escape(heading)}\s*$\n([\s\S]*?)(?=^##\s|\Z)",
        text,
        re.MULTILINE | re.IGNORECASE,
    )
    return match.group(1).strip() if match else None


def add_error(errors: list[str], path: Path, message: str) -> None:
    errors.append(f"{path}: {message}")


def parse_issue(path: Path, root: Path, errors: list[str]) -> Issue | None:
    relative = path.relative_to(root)
    if len(relative.parts) != 1:
        add_error(errors, path, "issue files must be directly inside the issue root")
        return None

    filename = FILENAME_RE.fullmatch(path.name)
    if not filename:
        add_error(errors, path, "filename must match 0000-kebab-case-title.md")
        return None

    text = path.read_text(encoding="utf-8")
    h1s = re.findall(r"^#\s+(.+?)\s*$", text, re.MULTILINE)
    if len(h1s) != 1:
        add_error(errors, path, f"expected exactly one H1 title; found {len(h1s)}")

    fields: dict[str, list[str]] = {}
    for key, value in FIELD_RE.findall(text):
        normalized = value.strip()
        if normalized.startswith("**"):
            normalized = normalized[2:]
        if normalized.endswith("**"):
            normalized = normalized[:-2]
        fields.setdefault(key.lower(), []).append(normalized.strip().strip("`"))
    for key in ("status", "type", "priority", "issuer id"):
        values = fields.get(key, [])
        if len(values) != 1:
            add_error(errors, path, f"expected exactly one {key.title()} field; found {len(values)}")

    status = fields.get("status", [""])[0]
    issue_type = fields.get("type", [""])[0].upper()
    priority = fields.get("priority", [""])[0].upper()
    issuer_id = fields.get("issuer id", [""])[0]
    number = int(filename.group(1))

    if status not in ALLOWED_STATUS:
        add_error(errors, path, f"Status must be one of {sorted(ALLOWED_STATUS)}")
    if issue_type not in ALLOWED_TYPE:
        add_error(errors, path, f"Type must be one of {sorted(ALLOWED_TYPE)}")
    if priority not in ALLOWED_PRIORITY:
        add_error(errors, path, f"Priority must be one of {sorted(ALLOWED_PRIORITY)}")
    if issuer_id != filename.group(1):
        add_error(errors, path, f"Issuer ID must equal filename ID {filename.group(1)}")

    headings = [value.lower() for value in HEADING_RE.findall(text)]
    for required in REQUIRED_SECTIONS:
        count = headings.count(required.lower())
        if count != 1:
            add_error(errors, path, f"expected exactly one ## {required} section; found {count}")

    for required in ("Source", "What to build", "Verification"):
        body = section(text, required)
        if body is not None and not body:
            add_error(errors, path, f"## {required} must not be empty")

    acceptance = section(text, "Acceptance criteria")
    criteria = CRITERION_RE.findall(acceptance or "")
    if not criteria:
        add_error(errors, path, "Acceptance criteria must contain at least one task-list item")
    for checked, criterion in criteria:
        if checked.lower() == "x" and status != "Done":
            add_error(errors, path, "non-Done issues cannot contain checked acceptance criteria")
        if PLACEHOLDER_RE.search(criterion):
            add_error(errors, path, f"acceptance criterion contains a placeholder: {criterion}")
    if status == "Done" and criteria and any(checked.lower() != "x" for checked, _ in criteria):
        add_error(errors, path, "Done issues must have every acceptance criterion checked")

    scrubbed = re.sub(r"^Status:\s*Todo\s*$", "", text, flags=re.IGNORECASE | re.MULTILINE)
    if PLACEHOLDER_RE.search(scrubbed):
        add_error(errors, path, "contains an angle-bracket, TBD, or FIXME placeholder")

    blocked = section(text, "Blocked by") or ""
    dependencies = tuple(DEPENDENCY_RE.findall(blocked))
    if dependencies and NO_BLOCKER in blocked:
        add_error(errors, path, "Blocked by cannot contain both dependencies and the no-blocker sentence")
    if not dependencies and blocked.strip() != NO_BLOCKER:
        add_error(errors, path, f"Blocked by must contain dependency links or '{NO_BLOCKER}'")
    linked_lines = [line for line in blocked.splitlines() if line.strip().startswith("-")]
    if len(linked_lines) != len(dependencies):
        add_error(errors, path, "every Blocked by list item must be a relative Markdown .md link")

    return Issue(path, number, status, issue_type, dependencies)


def find_cycle(edges: dict[str, tuple[str, ...]]) -> list[str] | None:
    visiting: set[str] = set()
    visited: set[str] = set()
    stack: list[str] = []

    def visit(node: str) -> list[str] | None:
        if node in visiting:
            start = stack.index(node)
            return stack[start:] + [node]
        if node in visited:
            return None
        visiting.add(node)
        stack.append(node)
        for dependency in edges.get(node, ()):
            cycle = visit(dependency)
            if cycle:
                return cycle
        stack.pop()
        visiting.remove(node)
        visited.add(node)
        return None

    for node in edges:
        cycle = visit(node)
        if cycle:
            return cycle
    return None


def main() -> int:
    args = parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        print(f"error: issue root is not a directory: {root}", file=sys.stderr)
        return 2
    if args.max_active < 0:
        print("error: --max-active cannot be negative", file=sys.stderr)
        return 2

    paths = sorted(root.rglob("*.md"))
    if not paths:
        print(f"error: no Markdown issue files found under {root}", file=sys.stderr)
        return 2

    errors: list[str] = []
    issues = [issue for path in paths if (issue := parse_issue(path, root, errors))]
    by_name = {issue.path.name: issue for issue in issues}
    by_number: dict[int, list[Path]] = {}
    for issue in issues:
        by_number.setdefault(issue.number, []).append(issue.path)
    for number, duplicates in by_number.items():
        if len(duplicates) > 1:
            errors.append(f"duplicate numeric ID {number:04d}: {', '.join(map(str, duplicates))}")

    edges: dict[str, tuple[str, ...]] = {}
    for issue in issues:
        resolved: list[str] = []
        for raw in issue.dependencies:
            target_path = (issue.path.parent / raw).resolve()
            try:
                relative = target_path.relative_to(root)
            except ValueError:
                add_error(errors, issue.path, f"dependency escapes the issue root: {raw}")
                continue
            target = by_name.get(relative.as_posix())
            if not target:
                add_error(errors, issue.path, f"dependency does not exist: {raw}")
                continue
            if target.path == issue.path:
                add_error(errors, issue.path, "issue cannot block itself")
            if target.number >= issue.number:
                add_error(errors, issue.path, f"blocker {target.path.name} must have a lower numeric ID")
            if issue.issue_type == "AFK" and target.issue_type == "HITL":
                add_error(errors, issue.path, f"AFK issue cannot depend on HITL blocker {target.path.name}")
            resolved.append(target.path.name)
        edges[issue.path.name] = tuple(resolved)

    cycle = find_cycle(edges)
    if cycle:
        errors.append("dependency cycle: " + " -> ".join(cycle))

    hitl = [issue for issue in issues if issue.issue_type == "HITL"]
    if hitl and not args.allow_hitl:
        errors.append("HITL issues are not allowed in the default AFK queue: " + ", ".join(issue.path.name for issue in hitl))

    active = [issue for issue in issues if issue.issue_type == "AFK" and issue.status == "Todo"]
    if args.max_active and len(active) > args.max_active:
        errors.append(f"active AFK queue has {len(active)} issues; maximum is {args.max_active}")

    for error in errors:
        print(f"error: {error}", file=sys.stderr)
    if errors:
        print(f"FAILED: {len(errors)} error(s), {len(issues)} parsed issue(s)", file=sys.stderr)
        return 1

    frontier = sum(
        issue.issue_type == "AFK"
        and issue.status == "Todo"
        and all(by_name[dependency].status == "Done" for dependency in edges.get(issue.path.name, ()))
        for issue in issues
    )
    print(f"OK: {len(issues)} issue(s), {len(active)} active AFK, {frontier} frontier issue(s), 0 graph errors")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
