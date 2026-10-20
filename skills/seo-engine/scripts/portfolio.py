#!/usr/bin/env python3
"""Classify SEO portfolio pages from a validated JSON snapshot."""

from __future__ import annotations

import argparse
import json
import math
import sys
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit


REQUIRED_THRESHOLDS = {
    "min_clicks",
    "decline_fraction",
    "min_impressions",
    "stale_days",
    "recent_days",
}
NUMERIC_FIELDS = (
    "clicks",
    "previous_clicks",
    "impressions",
    "conversions",
    "referring_domains",
    "citation_count",
)
REQUIRED_PAGE_FIELDS = {"url", "updated_at", "protected"}


class InputError(ValueError):
    """Input does not satisfy the portfolio report contract."""


def _finite_number(value: Any, field: str, *, minimum: float = 0.0) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise InputError(f"{field} must be a finite number")
    try:
        number = float(value)
    except (OverflowError, ValueError) as exc:
        raise InputError(f"{field} must be a finite number") from exc
    if not math.isfinite(number) or number < minimum:
        raise InputError(f"{field} must be a finite number >= {minimum}")
    return number


def _valid_url(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value:
        raise InputError(f"{field} must be an absolute http(s) URL")
    if value != value.strip() or any(char.isspace() for char in value):
        raise InputError(f"{field} must be an absolute http(s) URL")
    try:
        parsed = urlsplit(value)
        parsed.hostname
    except ValueError as exc:
        raise InputError(f"{field} must be an absolute http(s) URL") from exc
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise InputError(f"{field} must be an absolute http(s) URL")
    return value


def _parse_date(value: Any, field: str) -> date:
    if not isinstance(value, str):
        raise InputError(f"{field} must be YYYY-MM-DD")
    try:
        parsed = date.fromisoformat(value)
    except ValueError as exc:
        raise InputError(f"{field} must be YYYY-MM-DD") from exc
    if parsed.isoformat() != value:
        raise InputError(f"{field} must be YYYY-MM-DD")
    return parsed


def _validate_input(payload: Any, as_of: date) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    if not isinstance(payload, dict):
        raise InputError("input must be a JSON object")
    thresholds = payload.get("thresholds")
    if not isinstance(thresholds, dict) or set(thresholds) != REQUIRED_THRESHOLDS:
        raise InputError("thresholds must contain exactly min_clicks, decline_fraction, min_impressions, stale_days, recent_days")
    checked_thresholds: dict[str, float] = {}
    for name, value in thresholds.items():
        minimum = 0.0
        if name == "decline_fraction":
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise InputError("decline_fraction must be a finite number between 0 and 1")
            value_float = float(value)
            if not math.isfinite(value_float) or not 0 < value_float <= 1:
                raise InputError("decline_fraction must be a finite number between 0 and 1")
            checked_thresholds[name] = value_float
        else:
            checked_thresholds[name] = _finite_number(value, name, minimum=minimum)
    if checked_thresholds["recent_days"] >= checked_thresholds["stale_days"]:
        raise InputError("recent_days must be less than stale_days")
    pages = payload.get("pages")
    if not isinstance(pages, list):
        raise InputError("pages must be an array")
    checked_pages: list[dict[str, Any]] = []
    seen: set[str] = set()
    for index, row in enumerate(pages):
        if not isinstance(row, dict):
            raise InputError(f"pages[{index}] must be an object")
        missing = REQUIRED_PAGE_FIELDS - set(row)
        if missing:
            raise InputError(f"pages[{index}] missing required fields: {', '.join(sorted(missing))}")
        url = _valid_url(row["url"], f"pages[{index}].url")
        if url in seen:
            raise InputError(f"duplicate URL: {url}")
        seen.add(url)
        _parse_date(row["updated_at"], f"pages[{index}].updated_at")
        if _parse_date(row["updated_at"], f"pages[{index}].updated_at") > as_of:
            raise InputError(f"pages[{index}].updated_at cannot be in the future")
        if not isinstance(row["protected"], bool):
            raise InputError(f"pages[{index}].protected must be boolean")
        for field in NUMERIC_FIELDS:
            value = row.get(field)
            if value is not None:
                _finite_number(value, f"pages[{index}].{field}")
        if "equivalent_url" in row and row["equivalent_url"] is not None:
            _valid_url(row["equivalent_url"], f"pages[{index}].equivalent_url")
            if row["equivalent_url"] == url:
                raise InputError(f"pages[{index}].equivalent_url must differ from url")
        for field in ("equivalent_verified", "overlap_verified"):
            if field in row and not isinstance(row[field], bool):
                raise InputError(f"pages[{index}].{field} must be boolean")
        checked_pages.append(row)
    return {**thresholds, **checked_thresholds}, checked_pages


def _classify(row: dict[str, Any], thresholds: dict[str, float], as_of: date) -> dict[str, Any]:
    missing = [field for field in (*NUMERIC_FIELDS, "updated_at") if row.get(field) is None]
    updated = _parse_date(row["updated_at"], "updated_at")
    age_days = (as_of - updated).days
    signals: dict[str, Any] = {"age_days": age_days}
    for field in NUMERIC_FIELDS:
        signals[field] = row.get(field)
    reasons: list[str] = []
    review_required = False
    if missing:
        reasons.append("critical metrics are missing")
        return {**row, "recommendation": "investigate", "reasons": reasons, "missing": missing, "signals": signals, "review_required": True}

    protected_reasons = []
    if row["protected"]:
        protected_reasons.append("protected legal or strategic page")
    if row["conversions"] > 0:
        protected_reasons.append("has conversions")
    if row["referring_domains"] > 0:
        protected_reasons.append("has referring domains")
    if row["citation_count"] > 0:
        protected_reasons.append("has citations")
    if protected_reasons:
        reasons.extend(protected_reasons)
        review_required = True

    previous = row["previous_clicks"]
    decline = None if previous == 0 else (previous - row["clicks"]) / previous
    if decline is not None and not math.isfinite(decline):
        raise InputError(f"non-finite decline calculation for {row['url']}")
    material_decline = decline is not None and decline >= thresholds["decline_fraction"]
    low_clicks_with_impressions = row["impressions"] >= thresholds["min_impressions"] and row["clicks"] <= thresholds["min_clicks"]
    all_zero = all(row[field] == 0 for field in (*NUMERIC_FIELDS,))
    candidate = material_decline or low_clicks_with_impressions or all_zero
    stale = age_days >= thresholds["stale_days"]
    recent = age_days <= thresholds["recent_days"]
    signals.update({"decline_fraction": decline, "material_decline": material_decline, "low_clicks_with_impressions": low_clicks_with_impressions, "all_zero": all_zero, "stale": stale, "recent": recent})

    if protected_reasons and candidate and stale and not recent:
        reasons.append("weak and stale, but protected evidence requires human review")
        return {**row, "recommendation": "investigate", "reasons": reasons, "missing": [], "signals": signals, "review_required": True}
    if recent:
        reasons.append("recently edited page is excluded from weak-page retirement")
        return {**row, "recommendation": "keep", "reasons": reasons, "missing": [], "signals": signals, "review_required": review_required}
    if not candidate:
        reasons.append("portfolio evidence is ambiguous; no safe action threshold was met")
        return {**row, "recommendation": "investigate", "reasons": reasons, "missing": [], "signals": signals, "review_required": True}
    equivalent = row.get("equivalent_url")
    has_equivalence_evidence = equivalent is not None or row.get("equivalent_verified") is not None or row.get("overlap_verified") is not None
    if has_equivalence_evidence and not (bool(equivalent) and row.get("equivalent_verified") is True and row.get("overlap_verified") is True):
        reasons.append("equivalent evidence is incomplete or lacks a verified target")
        return {**row, "recommendation": "investigate", "reasons": reasons, "missing": [], "signals": signals, "review_required": True}
    if all_zero and stale:
        if bool(equivalent):
            reasons.append("stale zero-value page has a verified equivalent target")
            return {**row, "recommendation": "consolidate", "reasons": reasons, "missing": [], "signals": signals, "review_required": True}
        reasons.append("stale page has zero observed demand, conversions, links, and citations")
        return {**row, "recommendation": "retire", "reasons": reasons, "missing": [], "signals": signals, "review_required": True}
    if not stale:
        reasons.append("page shows a recoverable demand or decline signal but is not stale")
        return {**row, "recommendation": "update", "reasons": reasons, "missing": [], "signals": signals, "review_required": review_required}
    verified = bool(equivalent) and row.get("equivalent_verified") is True and row.get("overlap_verified") is True
    if verified:
        reasons.append("stale candidate has a distinct verified equivalent target")
        return {**row, "recommendation": "consolidate", "reasons": reasons, "missing": [], "signals": signals, "review_required": True}
    reasons.append("stale candidate may recover or needs content and intent review")
    return {**row, "recommendation": "update", "reasons": reasons, "missing": [], "signals": signals, "review_required": review_required}


def build_report(payload: Any, as_of_text: str) -> dict[str, Any]:
    as_of = _parse_date(as_of_text, "as-of")
    thresholds, pages = _validate_input(payload, as_of)
    result_pages = [_classify(row, thresholds, as_of) for row in pages]
    result_pages.sort(key=lambda row: row["url"])
    return {"as_of": as_of_text, "thresholds": thresholds, "pages": result_pages}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Classify SEO portfolio pages from a JSON snapshot.", epilog="Input thresholds: min_clicks, decline_fraction, min_impressions, stale_days, recent_days. Page URL, updated_at, and protected are required; numeric metrics may be absent or null and remain unknown.")
    parser.add_argument("input", help="JSON input file; it is never modified")
    parser.add_argument("--as-of", required=True, help="fixed report date in YYYY-MM-DD format")
    args = parser.parse_args(argv)
    try:
        raw = Path(args.input).read_text(encoding="utf-8")
        payload = json.loads(raw, parse_constant=lambda value: (_ for _ in ()).throw(InputError(f"invalid JSON number: {value}")))
        report = build_report(payload, args.as_of)
    except (OSError, UnicodeError, json.JSONDecodeError, InputError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(report, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
