import assert from "node:assert/strict";
import test from "node:test";

test("evaluates one cold route without double-counting shared resources", async () => {
  const { evaluateTransferBudget } = await import("../scripts/lib/transfer-budget.mjs");
  const report = evaluateTransferBudget({
    route: "/skills/tailwind/",
    origin: "http://127.0.0.1:4173",
    resources: [
      { url: "http://127.0.0.1:4173/skills/tailwind/", kind: "document", rawBytes: 20_000, gzipBytes: 5_000 },
      { url: "http://127.0.0.1:4173/_app/app.js", kind: "script", rawBytes: 120_000, gzipBytes: 40_000 },
      { url: "http://127.0.0.1:4173/_app/app.js", kind: "script", rawBytes: 120_000, gzipBytes: 40_000 },
      { url: "http://127.0.0.1:4173/_app/app.css", kind: "stylesheet", rawBytes: 60_000, gzipBytes: 18_000 },
      { url: "http://127.0.0.1:4173/skills/tailwind/#inline-style", kind: "stylesheet", rawBytes: 10_000, gzipBytes: 2_000, includedInDocument: true },
      { url: "http://127.0.0.1:4173/_app/regular.woff2", kind: "font", rawBytes: 72_000, gzipBytes: 72_000 },
      { url: "http://127.0.0.1:4173/brand/logo.svg", kind: "image", rawBytes: 8_000, gzipBytes: 3_000 },
    ],
  });

  assert.equal(report.pass, true);
  assert.equal(report.requests, 5);
  assert.deepEqual(report.transfer, {
    javascriptRawBytes: 120_000,
    javascriptGzipBytes: 40_000,
    cssGzipBytes: 20_000,
    fontBytes: 72_000,
    imageBytes: 8_000,
    totalBytes: 143_000,
  });
  assert.deepEqual(report.failures, []);
});

test("rejects exceeded budgets, presentation CDNs, and a runtime Catalog fetch", async () => {
  const { evaluateTransferBudget } = await import("../scripts/lib/transfer-budget.mjs");
  const report = evaluateTransferBudget({
    route: "/",
    origin: "http://127.0.0.1:4173",
    resources: [
      { url: "http://127.0.0.1:4173/", kind: "document", rawBytes: 300_000, gzipBytes: 120_000 },
      { url: "http://127.0.0.1:4173/_app/app.js", kind: "script", rawBytes: 260_000, gzipBytes: 95_000 },
      { url: "http://127.0.0.1:4173/skills.json", kind: "fetch", rawBytes: 20_000, gzipBytes: 6_000 },
      { url: "https://cdn.example.com/font.woff2", kind: "font", rawBytes: 308_000, gzipBytes: 308_000 },
    ],
  });

  assert.equal(report.pass, false);
  assert.deepEqual(report.failures, [
    "javascript-gzip",
    "javascript-raw",
    "fonts",
    "total-transfer",
    "third-party-presentation",
    "runtime-catalog-fetch",
  ]);
});
