import assert from "node:assert/strict";
import test from "node:test";
import { lighthouseMetrics } from "../scripts/lib/lighthouse-report.mjs";

const completeReport = () => ({
  categories: {
    performance: { score: 0.99 },
    accessibility: { score: 1 },
    seo: { score: 1 },
    "best-practices": { score: 1 },
  },
  audits: {
    "largest-contentful-paint": { numericValue: 1_500 },
    "cumulative-layout-shift": { numericValue: 0.01 },
    "total-blocking-time": { numericValue: 50 },
  },
});

test("reads every score and metric required by the release gate", () => {
  assert.deepEqual(lighthouseMetrics(completeReport()), {
    performance: 0.99,
    accessibility: 1,
    seo: 1,
    bestPractices: 1,
    lcpMs: 1_500,
    cls: 0.01,
    tbtMs: 50,
  });
});

test("reports Lighthouse runtime diagnostics when an audit is incomplete", () => {
  const report = completeReport();
  delete report.categories.performance;
  report.runtimeError = { code: "PROTOCOL_TIMEOUT", message: "DevTools session stopped responding" };

  assert.throws(
    () => lighthouseMetrics(report, "canonical /skills/example/ run 1"),
    /canonical \/skills\/example\/ run 1 is missing performance score.*PROTOCOL_TIMEOUT.*stopped responding/,
  );
});
