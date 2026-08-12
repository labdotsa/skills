import assert from "node:assert/strict";
import test from "node:test";
import {
  MANUAL_CHECK_IDS,
  REPRESENTATIVE_SCOPES,
  validateFieldEvidence,
  validateManualEvidence,
} from "../scripts/lib/quality-evidence.mjs";

test("records unavailable field data without inventing Web Vitals", () => {
  const evidence = validateFieldEvidence({
    schemaVersion: 1,
    origin: "https://skills.lab.sa",
    checkedAt: "2026-08-12T00:00:00.000Z",
    source: "Chrome UX Report",
    status: "no-data",
    reason: "The SvelteKit revision is not deployed, so field data cannot be attributed to it.",
  });

  assert.equal(evidence.status, "no-data");
  assert.equal("lcpMs" in evidence, false);
  assert.throws(() => validateFieldEvidence({ status: "no-data" }), /schemaVersion|origin|reason/i);
});

test("accepts only complete passing manual evidence for every representative scope", () => {
  const coverage = REPRESENTATIVE_SCOPES.map((scope) => ({
    scope,
    status: "pass",
    journey: "Navigate, inspect, and recover through the representative page.",
    expected: "Content, focus, and announcements remain understandable and operable.",
    actual: "Matched the expected behavior without loss of content or operation.",
    issue: null,
  }));
  const evidence = {
    schemaVersion: 1,
    testedRevision: "2075ac21a90cb36f0bdb34844d75258164aa75e5",
    checks: MANUAL_CHECK_IDS.map((id) => ({
      id,
      status: "pass",
      tester: "Human tester",
      testedAt: "2026-08-12T00:00:00.000Z",
      environment: id === "nvda-browser" ? "Windows 11, NVDA, Firefox" : "macOS, Safari/Chrome",
      coverage,
    })),
  };

  assert.equal(validateManualEvidence(evidence).checks.length, MANUAL_CHECK_IDS.length);
  assert.throws(
    () => validateManualEvidence({ ...evidence, checks: evidence.checks.map((check, index) => index === 0 ? { ...check, status: "pending" } : check) }),
    /pending|manual quality evidence/i,
  );
});
