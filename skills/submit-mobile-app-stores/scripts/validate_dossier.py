#!/usr/bin/env python3
"""Validate the structural core of a mobile-store submission dossier."""
import json
import sys
from pathlib import Path

FIELDS = ("schema_version", "submission", "account", "commerce", "app_identity", "build", "listing", "privacy", "content", "review", "testing", "distribution", "automation", "approvals", "submission_log")
TRACKS = {"apple": {"testflight_internal", "testflight_external", "production"}, "google_play": {"internal", "closed", "open", "production"}}

def scalar(value):
    return value.get("value") if isinstance(value, dict) and "value" in value else value

def main():
    if len(sys.argv) != 2:
        print("usage: validate_dossier.py <dossier.json>", file=sys.stderr); return 2
    try:
        data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr); return 2
    errors = [f"missing top-level field: {key}" for key in FIELDS if key not in data]
    if data.get("schema_version") != 1: errors.append("schema_version must be 1")
    submission = data.get("submission", {})
    if not isinstance(submission, dict): errors.append("submission must be an object"); submission = {}
    store, intent, track = map(scalar, (submission.get("store"), submission.get("intent"), submission.get("track")))
    if store not in TRACKS: errors.append(f"submission.store must be one of {sorted(TRACKS)}")
    elif track not in TRACKS[store]: errors.append(f"submission.track must be one of {sorted(TRACKS[store])}")
    if intent not in {"testing", "production"}: errors.append("submission.intent must be testing or production")
    if intent == "production" and track != "production": errors.append("production intent requires production track")
    if intent == "testing" and track == "production": errors.append("testing intent cannot use production track")
    if isinstance(data.get("listing"), dict) and not isinstance(data["listing"].get("locales"), list): errors.append("listing.locales must be an array")
    for key in ("approvals", "submission_log"):
        if key in data and not isinstance(data[key], list): errors.append(f"{key} must be an array")
    if errors:
        print("\n".join(f"error: {e}" for e in errors), file=sys.stderr); return 1
    print(f"valid structural dossier: {sys.argv[1]}"); return 0

if __name__ == "__main__":
    raise SystemExit(main())
