import assert from "node:assert/strict";
import test from "node:test";

test("evaluates three-run Lighthouse medians using TBT only as a lab proxy", async () => {
  const { evaluateSeoMeasurement } = await import("../src/lib/domain/seo-measurement.ts");
  const report = evaluateSeoMeasurement({
    lighthouseRuns: [
      { performance: 0.92, seo: 0.94, lcpMs: 2_300, cls: 0.08, tbtMs: 180 },
      { performance: 0.90, seo: 0.91, lcpMs: 2_500, cls: 0.10, tbtMs: 200 },
      { performance: 0.96, seo: 0.98, lcpMs: 2_100, cls: 0.05, tbtMs: 120 },
    ],
  });

  assert.deepEqual(report.lab.median, {
    performance: 0.92,
    seo: 0.94,
    lcpMs: 2_300,
    cls: 0.08,
    tbtMs: 180,
  });
  assert.equal(report.lab.pass, true);
  assert.deepEqual(report.lab.responsiveness, {
    metric: "TBT",
    role: "lab-proxy",
    valueMs: 180,
    thresholdMs: 200,
  });
  assert.equal("inpMs" in report.lab.median, false);
  assert.equal(report.field.status, "no-data");
  assert.equal(Object.isFrozen(report), true);
});

test("reports field p75 INP separately and fails any missed accepted threshold", async () => {
  const { evaluateSeoMeasurement } = await import("../src/lib/domain/seo-measurement.ts");
  const report = evaluateSeoMeasurement({
    lighthouseRuns: [
      { performance: 0.89, seo: 0.92, lcpMs: 2_400, cls: 0.08, tbtMs: 190 },
      { performance: 0.91, seo: 0.89, lcpMs: 2_600, cls: 0.11, tbtMs: 210 },
      { performance: 0.88, seo: 0.88, lcpMs: 2_700, cls: 0.12, tbtMs: 220 },
    ],
    fieldData: {
      windowDays: 28,
      mobile: { lcpMs: 2_400, inpMs: 190, cls: 0.08 },
      desktop: { lcpMs: 2_700, inpMs: 180, cls: 0.05 },
    },
  });

  assert.equal(report.lab.pass, false);
  assert.deepEqual(report.lab.failures, ["performance", "seo", "lcpMs", "cls", "tbtMs"]);
  assert.equal(report.field.status, "reported");
  assert.equal(report.field.devices.mobile.pass, true);
  assert.equal(report.field.devices.desktop.pass, false);
  assert.deepEqual(report.field.devices.desktop.failures, ["lcpMs"]);
  assert.equal(report.field.devices.mobile.inpMs, 190);
  assert.equal(report.field.windowDays, 28);
});

test("rejects invented or incomplete measurement evidence", async () => {
  const { evaluateSeoMeasurement } = await import("../src/lib/domain/seo-measurement.ts");
  const run = { performance: 0.95, seo: 0.95, lcpMs: 2_000, cls: 0.05, tbtMs: 100 };

  assert.throws(() => evaluateSeoMeasurement({ lighthouseRuns: [run, run] }), /exactly three/i);
  assert.throws(
    () => evaluateSeoMeasurement({
      lighthouseRuns: [run, run, run],
      fieldData: { windowDays: 28, mobile: { lcpMs: 2_000, inpMs: 100, cls: 0.01 } },
    }),
    /mobile and desktop/i,
  );
});
