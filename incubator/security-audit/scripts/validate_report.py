#!/usr/bin/env python3
"""Validate the consistency of a structured security-audit report.

This checks report bookkeeping and evidence relationships.  It does not prove
that evidence is true, fresh, or cryptographically independent.
"""

from __future__ import annotations

import json
import errno
import math
import os
import re
import stat
import sys
from pathlib import Path
from typing import Any

MAX_BYTES = 1_048_576
MAX_DEPTH = 20
MAX_RECORDS = 500
MAX_NODES = 10_000
MAX_ERRORS = 100
HEX64 = re.compile(r"^[0-9a-fA-F]{64}$")

VALID_AUDIT_STATUS = {"complete", "partial", "blocked"}
VALID_COVERAGE_STATES = {"planned", "reviewed", "blocked", "deferred", "out_of_scope"}
VALID_VALIDITY = {"candidate", "confirmed", "needs_validation", "rejected"}
VALID_REPRODUCTION = {"reproduced", "not_reproduced", "not_run", "blocked"}
VALID_FIX = {"not_requested", "proposed", "unverified", "verified", "failed", "inconclusive"}


class ReportInputError(ValueError):
    """The input cannot be safely treated as a JSON report."""


def _reject_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReportInputError(f"duplicate JSON key {key!r}")
        result[key] = value
    return result


def _reject_nonfinite(value: str) -> Any:
    raise ReportInputError(f"non-finite JSON number {value!r} is not allowed")


def _parse_integer(value: str) -> int:
    digits = value.lstrip("-")
    if len(digits) > 4_300:
        raise ReportInputError("JSON integer exceeds the 4300-digit safety limit")
    return int(value)


def _parse_float(value: str) -> float:
    parsed = float(value)
    if not math.isfinite(parsed):
        raise ReportInputError(f"non-finite JSON number {value!r} is not allowed")
    return parsed


def _is_text(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _is_list(value: Any) -> bool:
    return isinstance(value, list)


def _nonempty_evidence(value: Any) -> bool:
    return isinstance(value, list) and bool(value) and all(
        _is_text(item) or (isinstance(item, dict) and bool(item)) for item in value
    )


def _add(errors: list[str], message: str) -> None:
    if len(errors) < MAX_ERRORS:
        errors.append(message)


def _require_map(errors: list[str], value: Any, path: str) -> dict[str, Any] | None:
    if not isinstance(value, dict):
        _add(errors, f"{path} must be an object")
        return None
    return value


def _result(errors: list[str], value: Any, path: str, status: str | None = None) -> dict[str, Any] | None:
    result = _require_map(errors, value, path)
    if result is None:
        return None
    actual = result.get("status")
    if status is not None and actual != status:
        _add(errors, f"{path}.status must be {status!r}")
    elif not _is_text(actual):
        _add(errors, f"{path}.status must be a non-empty string")
    if not _is_text(result.get("source_state")):
        _add(errors, f"{path}.source_state must be a non-empty string")
    if not _is_text(result.get("environment")):
        _add(errors, f"{path}.environment must be a non-empty string")
    if not _nonempty_evidence(result.get("evidence")):
        _add(errors, f"{path}.evidence must contain at least one observation")
    return result


def _within_limits(value: Any) -> tuple[bool, str | None]:
    """Walk bounded JSON iteratively, before report fields are interpreted."""
    stack: list[tuple[Any, int]] = [(value, 0)]
    nodes = 0
    while stack:
        current, depth = stack.pop()
        nodes += 1
        if nodes > MAX_NODES:
            return False, f"report exceeds maximum JSON node budget ({MAX_NODES})"
        if depth > MAX_DEPTH:
            return False, f"report exceeds maximum nesting depth ({MAX_DEPTH})"
        if isinstance(current, dict):
            stack.extend((item, depth + 1) for item in current.values())
        elif isinstance(current, list):
            stack.extend((item, depth + 1) for item in current)
    return True, None


def validate_report(report: Any) -> list[str]:
    """Return human-readable consistency errors; an empty list means valid."""
    errors: list[str] = []
    root = _require_map(errors, report, "report")
    if root is None:
        return errors
    within_limits, limit_error = _within_limits(root)
    if not within_limits:
        _add(errors, limit_error or "report exceeds safety limits")
        return errors

    status = root.get("audit_status")
    source_state = root.get("source_state")
    if not isinstance(status, str) or status not in VALID_AUDIT_STATUS:
        _add(errors, "audit_status must be complete, partial, or blocked")
    if not _is_text(source_state):
        _add(errors, "source_state must be a non-empty string")

    coverage = root.get("coverage")
    findings = root.get("findings")
    final_review = _require_map(errors, root.get("final_review"), "final_review")
    if not _is_list(coverage):
        _add(errors, "coverage must be a list")
        coverage = []
    if not _is_list(findings):
        _add(errors, "findings must be a list")
        findings = []
    if len(coverage) + len(findings) > MAX_RECORDS:
        _add(errors, f"coverage and findings exceed maximum record limit ({MAX_RECORDS})")
        return errors

    ids: set[str] = set()
    coverage_states: list[str] = []
    for index, unit in enumerate(coverage):
        path = f"coverage[{index}]"
        unit_map = _require_map(errors, unit, path)
        if unit_map is None:
            continue
        unit_id = unit_map.get("id")
        if not _is_text(unit_id):
            _add(errors, f"{path}.id must be a non-empty string")
        elif unit_id in ids:
            _add(errors, f"duplicate id {unit_id!r}")
        else:
            ids.add(unit_id)
        unit_state = unit_map.get("state")
        if not isinstance(unit_state, str) or unit_state not in VALID_COVERAGE_STATES:
            _add(errors, f"{path}.state is not a valid coverage state")
        else:
            coverage_states.append(unit_state)
            if unit_state == "reviewed" and not _nonempty_evidence(unit_map.get("evidence")):
                _add(errors, f"{path}.evidence is required for reviewed coverage")

    confirmed_ids: set[str] = set()
    findings_by_id: dict[str, dict[str, Any]] = {}
    for index, finding in enumerate(findings):
        path = f"findings[{index}]"
        finding_map = _require_map(errors, finding, path)
        if finding_map is None:
            continue
        finding_id = finding_map.get("id")
        if not _is_text(finding_id):
            _add(errors, f"{path}.id must be a non-empty string")
        elif finding_id in ids:
            _add(errors, f"duplicate id {finding_id!r}")
        else:
            ids.add(finding_id)
            findings_by_id[finding_id] = finding_map
        finding_state = finding_map.get("source_state")
        if not _is_text(finding_state):
            _add(errors, f"{path}.source_state must be a non-empty string")
        elif _is_text(source_state) and finding_state != source_state:
            _add(errors, f"{path}.source_state does not match report.source_state")
        validity = finding_map.get("validity")
        if not isinstance(validity, str) or validity not in VALID_VALIDITY:
            _add(errors, f"{path}.validity is not valid")
        if not _is_text(finding_map.get("discovered_by")):
            _add(errors, f"{path}.discovered_by must identify the discovering investigator")
        independent = finding_map.get("independent_validation")
        reproduction = finding_map.get("reproduction")
        independent_map: dict[str, Any] | None = None
        if validity == "confirmed":
            if _is_text(finding_id):
                confirmed_ids.add(finding_id)
            if reproduction is None:
                _add(errors, f"{path}.reproduction is required for confirmed findings")
        elif finding_map.get("severity") is not None:
            _add(errors, f"{path}.severity must be null unless validity is confirmed")

        if validity == "confirmed":
            independent_map = _require_map(errors, independent, f"{path}.independent_validation")
            if independent_map is not None:
                if independent_map.get("source_state") != finding_state:
                    _add(errors, f"{path}.independent_validation.source_state must match finding source_state")
                if not HEX64.fullmatch(str(independent_map.get("report_sha256", ""))):
                    _add(errors, f"{path}.independent_validation.report_sha256 must be 64 hex characters")
                if independent_map.get("fresh_context") is not True:
                    _add(errors, f"{path}.independent_validation.fresh_context must be true")
                if not _is_text(independent_map.get("reviewer")):
                    _add(errors, f"{path}.independent_validation.reviewer is required")
                if independent_map.get("outcome") != "passed":
                    _add(errors, f"{path}.independent_validation.outcome must be passed")
                if not _nonempty_evidence(independent_map.get("evidence")):
                    _add(errors, f"{path}.independent_validation.evidence is required")
                if independent_map.get("reviewer") == finding_map.get("discovered_by"):
                    _add(errors, f"{path}.independent_validation.reviewer must differ from discovered_by")
        finding_final_review = finding_map.get("final_review")
        if validity == "confirmed":
            finding_final_map = _require_map(errors, finding_final_review, f"{path}.final_review")
            if finding_final_map is not None:
                final_status = finding_final_map.get("status")
                allowed_partial = (
                    isinstance(status, str)
                    and status in {"partial", "blocked"}
                    and isinstance(final_status, str)
                    and final_status in {"pending", "unavailable"}
                )
                if final_status != "passed" and not allowed_partial:
                    _add(errors, f"{path}.final_review.status must be passed for confirmed findings")
                if final_status == "passed" and not _is_text(finding_final_map.get("reviewer")):
                    _add(errors, f"{path}.final_review.reviewer is required for confirmed findings")
                if final_status == "passed" and finding_final_map.get("source_state") != finding_state:
                    _add(errors, f"{path}.final_review.source_state must match finding.source_state")
                elif final_status != "passed" and finding_final_map.get("source_state") is not None and finding_final_map.get("source_state") != finding_state:
                    _add(errors, f"{path}.final_review.source_state must match finding.source_state")
                final_reviewer = finding_final_map.get("reviewer")
                discoverer = finding_map.get("discovered_by")
                validator = (independent_map or {}).get("reviewer")
                if final_status == "passed" and _is_text(final_reviewer) and (final_reviewer == discoverer or final_reviewer == validator):
                    _add(errors, f"{path}.final_review.reviewer must be distinct from discoverer and validator")
        if reproduction is not None:
            reproduction_map = _require_map(errors, reproduction, f"{path}.reproduction")
            if reproduction_map is not None:
                reproduction_status = reproduction_map.get("status")
                if not isinstance(reproduction_status, str) or reproduction_status not in VALID_REPRODUCTION:
                    _add(errors, f"{path}.reproduction.status is not valid")
                if reproduction_status == "reproduced":
                    if reproduction_map.get("baseline_state") != finding_state:
                        _add(errors, f"{path}.reproduction.baseline_state must match finding.source_state")
                    for field in ("environment",):
                        if not _is_text(reproduction_map.get(field)):
                            _add(errors, f"{path}.reproduction.{field} is required when reproduced")
                    if not _nonempty_evidence(reproduction_map.get("evidence")):
                        _add(errors, f"{path}.reproduction.evidence is required when reproduced")
                elif isinstance(reproduction_status, str) and reproduction_status in {"not_run", "blocked"} and not _is_text(reproduction_map.get("blocker")):
                    _add(errors, f"{path}.reproduction.blocker is required for {reproduction_status}")

        fix = finding_map.get("fix")
        if fix is not None:
            _validate_fix(errors, path, finding_map, fix)

    if final_review is not None:
        reviewed_ids = final_review.get("reviewed_ids")
        if not isinstance(reviewed_ids, list) or not all(_is_text(item) for item in reviewed_ids):
            _add(errors, "final_review.reviewed_ids must be a list of string IDs")
            reviewed_ids = []
        elif len(set(reviewed_ids)) != len(reviewed_ids):
            _add(errors, "final_review.reviewed_ids must not contain duplicates")
        if _is_text(source_state) and final_review.get("source_state") != source_state:
            _add(errors, "final_review.source_state does not match report.source_state")
        if status == "complete":
            if final_review.get("status") != "passed" or not _is_text(final_review.get("reviewer")):
                _add(errors, "complete report requires a passed final_review with a reviewer")
            if not confirmed_ids.issubset(set(reviewed_ids)):
                _add(errors, "final_review.reviewed_ids omits one or more confirmed findings")
            if not set(reviewed_ids).issubset(confirmed_ids):
                _add(errors, "final_review.reviewed_ids contains an ID that is not confirmed")

    if status == "complete":
        forbidden = {"planned", "blocked", "deferred"}
        if forbidden.intersection(coverage_states):
            _add(errors, "complete report cannot contain planned, blocked, or deferred coverage")
        if any(
            isinstance(item.get("validity"), str)
            and item.get("validity") in {"candidate", "needs_validation"}
            for item in findings_by_id.values()
        ):
            _add(errors, "complete report cannot contain candidate or needs_validation findings")
        global_reviewer = final_review.get("reviewer") if final_review is not None else None
        for finding_id in confirmed_ids:
            item = findings_by_id.get(finding_id)
            item_review = item.get("final_review") if item is not None else None
            if isinstance(item_review, dict) and item_review.get("status") == "passed" and item_review.get("reviewer") != global_reviewer:
                _add(errors, f"complete final_review reviewer must match {finding_id}.final_review reviewer")
    return errors


def _validate_fix(errors: list[str], path: str, finding: dict[str, Any], fix: Any) -> None:
    fix_path = f"{path}.fix"
    fix_map = _require_map(errors, fix, fix_path)
    if fix_map is None:
        return
    fix_status = fix_map.get("status")
    if not isinstance(fix_status, str) or fix_status not in VALID_FIX:
        _add(errors, f"{fix_path}.status is not valid")
    artifact = fix_map.get("patch_artifact")
    if artifact is not None and isinstance(fix_status, str) and fix_status in {"proposed", "unverified", "verified", "failed", "inconclusive"}:
        checks = fix_map.get("artifact_checks")
        if not isinstance(checks, list) or not checks or any(not isinstance(item, dict) or item.get("status") != "passed" or not _nonempty_evidence(item.get("evidence")) for item in checks):
            _add(errors, f"{fix_path}.artifact_checks must contain passed checks with evidence when a patch artifact is delivered")
    if fix_status != "verified":
        return
    if finding.get("validity") != "confirmed":
        _add(errors, f"{fix_path}.status verified requires a confirmed finding")
    authored_by = fix_map.get("authored_by")
    independent_reviewer = fix_map.get("independent_reviewer")
    if not _is_text(authored_by) or not _is_text(independent_reviewer) or authored_by == independent_reviewer:
        _add(errors, f"{fix_path} requires distinct authored_by and independent_reviewer")
    final_source = fix_map.get("final_source_state")
    if not _is_text(final_source):
        _add(errors, f"{fix_path}.final_source_state is required")
    baseline = _result(errors, fix_map.get("baseline_result"), f"{fix_path}.baseline_result", "reproduced")
    original = _result(errors, fix_map.get("original_attack_result"), f"{fix_path}.original_attack_result", "passed")
    if baseline is not None:
        if baseline.get("source_state") != finding.get("source_state"):
            _add(errors, f"{fix_path}.baseline_result.source_state must match finding.source_state")
        if _is_text(final_source) and baseline.get("source_state") == final_source:
            _add(errors, f"{fix_path}.baseline_result must differ from final_source_state")
    if original is not None and _is_text(final_source) and original.get("source_state") != final_source:
        _add(errors, f"{fix_path}.original_attack_result.source_state must match final_source_state")
    if original is not None and baseline is not None and original.get("environment") != baseline.get("environment"):
        _add(errors, f"{fix_path}.original_attack_result.environment must match baseline environment")
    bypasses = fix_map.get("bypass_results")
    if not isinstance(bypasses, list) or not bypasses:
        _add(errors, f"{fix_path}.bypass_results requires at least one result")
        bypasses = []
    classes: set[str] = set()
    baseline_env = baseline.get("environment") if baseline else None
    for index, bypass in enumerate(bypasses):
        result = _result(errors, bypass, f"{fix_path}.bypass_results[{index}]", "passed")
        if result is not None:
            bypass_class = result.get("class")
            if not _is_text(bypass_class):
                _add(errors, f"{fix_path}.bypass_results[{index}].class is required")
            elif bypass_class in classes:
                _add(errors, f"{fix_path}.bypass_results has duplicate class {bypass_class!r}")
            else:
                classes.add(bypass_class)
            if baseline_env is not None and result.get("environment") != baseline_env:
                _add(errors, f"{fix_path}.bypass_results[{index}].environment must match baseline environment")
            if _is_text(final_source) and result.get("source_state") != final_source:
                _add(errors, f"{fix_path}.bypass_results[{index}].source_state must match final_source_state")
    legitimate = _result(errors, fix_map.get("legitimate_behavior_result"), f"{fix_path}.legitimate_behavior_result", "passed")
    project_checks = fix_map.get("project_checks")
    if not isinstance(project_checks, list) or not project_checks:
        _add(errors, f"{fix_path}.project_checks requires at least one result")
        project_checks = []
    for index, check in enumerate(project_checks):
        result = _result(errors, check, f"{fix_path}.project_checks[{index}]", "passed")
        if result is not None and baseline_env is not None and result.get("environment") != baseline_env:
            _add(errors, f"{fix_path}.project_checks[{index}].environment must match baseline environment")
        if result is not None and _is_text(final_source) and result.get("source_state") != final_source:
            _add(errors, f"{fix_path}.project_checks[{index}].source_state must match final_source_state")
    if legitimate is not None and baseline_env is not None and legitimate.get("environment") != baseline_env:
        _add(errors, f"{fix_path}.legitimate_behavior_result.environment must match baseline environment")
    if legitimate is not None and _is_text(final_source) and legitimate.get("source_state") != final_source:
        _add(errors, f"{fix_path}.legitimate_behavior_result.source_state must match final_source_state")
    if fix_map.get("blockers") not in ([], None):
        _add(errors, f"{fix_path}.blockers must be empty for a verified fix")


def _load_report(path: Path) -> Any:
    fd: int | None = None
    try:
        flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0) | getattr(os, "O_NONBLOCK", 0)
        fd = os.open(path, flags)
        metadata = os.fstat(fd)
    except OSError as exc:
        if fd is not None:
            os.close(fd)
        if getattr(exc, "errno", None) == errno.ELOOP:
            raise ReportInputError("report path must be a regular file (symlinks and special files are not accepted)") from exc
        raise ReportInputError(f"cannot read report path: {exc.strerror or 'unavailable'}") from exc
    if stat.S_ISLNK(metadata.st_mode) or not stat.S_ISREG(metadata.st_mode):
        if fd is not None:
            os.close(fd)
        raise ReportInputError("report path must be a regular file (symlinks and special files are not accepted)")
    size = metadata.st_size
    if size > MAX_BYTES:
        os.close(fd)
        raise ReportInputError(f"report exceeds maximum size of {MAX_BYTES} bytes")
    try:
        chunks: list[bytes] = []
        remaining = MAX_BYTES + 1
        while remaining:
            chunk = os.read(fd, min(65_536, remaining))
            if not chunk:
                break
            chunks.append(chunk)
            remaining -= len(chunk)
        data = b"".join(chunks)
    except OSError as exc:
        raise ReportInputError(f"cannot read report: {exc.strerror or 'unavailable'}") from exc
    finally:
        if fd is not None:
            os.close(fd)
    if len(data) > MAX_BYTES:
        raise ReportInputError(f"report exceeds maximum size of {MAX_BYTES} bytes")
    try:
        return json.loads(
            data.decode("utf-8"),
            object_pairs_hook=_reject_duplicate_keys,
            parse_constant=_reject_nonfinite,
            parse_int=_parse_integer,
            parse_float=_parse_float,
        )
    except (UnicodeDecodeError, ValueError, RecursionError, ReportInputError) as exc:
        raise ReportInputError(f"malformed JSON report: {exc}") from exc


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(f"usage: {Path(argv[0]).name} report.json", file=sys.stderr)
        return 2
    try:
        report = _load_report(Path(argv[1]))
    except ReportInputError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    errors = validate_report(report)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("valid report")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
