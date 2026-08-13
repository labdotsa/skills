import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { evaluateSeoMeasurement } from "../src/lib/domain/seo-measurement.ts";
import { createPublicationServer } from "./lib/publication-server.mjs";
import { representativeRoutes } from "./lib/quality-routes.mjs";

const profiles = [
  { name: "canonical", output: ".artifacts/lighthouse/canonical", basePath: "" },
  { name: "pages-project", output: ".artifacts/lighthouse/pages-project", basePath: "/skills" },
];
const mobileSettings = Object.freeze({
  formFactor: "mobile",
  throttlingMethod: "devtools",
  throttling: Object.freeze({
    rttMs: 150,
    throughputKbps: 1_638.4,
    requestLatencyMs: 562.5,
    downloadThroughputKbps: 1_474.56,
    uploadThroughputKbps: 675,
    cpuSlowdownMultiplier: 4,
  }),
  screenEmulation: Object.freeze({ mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }),
});
const evidenceDirectory = path.resolve(".artifacts/quality/lighthouse");
const summaries = [];

for (const profile of profiles) build(profile);
await mkdir(evidenceDirectory, { recursive: true });

const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  logLevel: "silent",
});
try {
  for (const profile of profiles) {
    const rootDirectory = path.resolve(profile.output);
    const server = createPublicationServer({ rootDirectory, basePath: profile.basePath });
    await listen(server);
    try {
      const address = server.address();
      const origin = `http://127.0.0.1:${address.port}`;
      const routes = await loadRoutes(rootDirectory, profile.basePath);
      for (const route of routes) {
        const runs = [];
        const routeDirectory = path.join(evidenceDirectory, profile.name, route.id);
        await mkdir(routeDirectory, { recursive: true });
        for (let index = 0; index < 3; index += 1) {
          const result = await lighthouse(`${origin}${route.pathname}`, {
            port: chrome.port,
            output: "json",
            logLevel: "error",
            onlyCategories: ["performance", "accessibility", "seo", "best-practices"],
            ...mobileSettings,
            ignoreStatusCode: route.id === "not-found",
            maxWaitForLoad: 45_000,
          });
          if (!result?.lhr) throw new Error(`${profile.name} ${route.pathname} run ${index + 1}: Lighthouse produced no report`);
          const run = metrics(result.lhr);
          runs.push(run);
          await writeFile(path.join(routeDirectory, `run-${index + 1}.json`), `${JSON.stringify(result.lhr, null, 2)}\n`);
          console.log(`${profile.name} ${route.id} run ${index + 1}/3: ${formatRun(run)}`);
        }
        const evaluation = evaluateSeoMeasurement({ lighthouseRuns: runs });
        const seoExempt = profile.name !== "canonical" || route.id === "not-found";
        const gateFailures = evaluation.lab.failures.filter((failure) => !(seoExempt && failure === "seo"));
        summaries.push({
          profile: profile.name,
          representative: route.id,
          route: route.pathname,
          runs,
          evaluation,
          gate: {
            pass: gateFailures.length === 0,
            failures: gateFailures,
            seoExpectation: seoExempt ? "non-indexable" : "indexable",
          },
        });
      }
    } finally {
      await close(server);
    }
  }
} finally {
  await chrome.kill();
}

await writeFile(path.join(evidenceDirectory, "summary.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  lighthouseVersion: await lighthouseVersion(),
  browser: chromium.name(),
  mobileSettings,
  runPolicy: "three-sequential-mobile-runs-no-cherry-picking",
  summaries,
}, null, 2)}\n`);

const failures = summaries.filter((summary) => !summary.gate.pass);
if (failures.length > 0) {
  throw new Error(`Lighthouse quality budgets failed:\n${failures.map((summary) =>
    `${summary.profile} ${summary.route}: ${summary.gate.failures.join(", ")}`).join("\n")}`);
}
console.log(`Lighthouse medians pass for ${summaries.length} representative profile routes.`);

function metrics(lhr) {
  const score = (category) => {
    const value = lhr.categories[category]?.score;
    if (typeof value !== "number") throw new Error(`Lighthouse report is missing ${category} score`);
    return value;
  };
  const numeric = (audit) => {
    const value = lhr.audits[audit]?.numericValue;
    if (typeof value !== "number") throw new Error(`Lighthouse report is missing ${audit}`);
    return value;
  };
  return {
    performance: score("performance"),
    accessibility: score("accessibility"),
    seo: score("seo"),
    bestPractices: score("best-practices"),
    lcpMs: numeric("largest-contentful-paint"),
    cls: numeric("cumulative-layout-shift"),
    tbtMs: numeric("total-blocking-time"),
  };
}

function formatRun(run) {
  return `P ${run.performance.toFixed(2)}, A ${run.accessibility.toFixed(2)}, SEO ${run.seo.toFixed(2)}, BP ${run.bestPractices.toFixed(2)}, LCP ${Math.round(run.lcpMs)}ms, CLS ${run.cls.toFixed(3)}, TBT ${Math.round(run.tbtMs)}ms`;
}

function build(profile) {
  const result = spawnSync(process.execPath, ["scripts/build-publication.mjs", profile.name, profile.output], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  console.log(`Built ${profile.name} Lighthouse publication.`);
}

async function loadRoutes(rootDirectory, basePath) {
  const manifest = JSON.parse(await readFile(path.join(rootDirectory, "publication-manifest.json"), "utf8"));
  const htmlFiles = manifest.files.map((file) => file.path).filter((filename) => filename.endsWith(".html"));
  const files = new Map(await Promise.all(htmlFiles.map(async (filename) => [
    filename,
    await readFile(path.join(rootDirectory, filename), "utf8"),
  ])));
  return representativeRoutes(files, basePath);
}

async function lighthouseVersion() {
  const packageJson = JSON.parse(await readFile(new URL("../node_modules/lighthouse/package.json", import.meta.url), "utf8"));
  return packageJson.version;
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
