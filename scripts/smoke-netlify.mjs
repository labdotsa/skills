import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { smokeNetlifyBrowser } from "./lib/netlify-browser-smoke.mjs";
import { smokeNetlifyHttp } from "./lib/netlify-smoke.mjs";

const [profile, origin, expectedSourceRevision, deployId] = process.argv.slice(2);
if (!deployId || !/^[A-Za-z0-9_-]+$/.test(deployId)) {
  throw new Error("Usage: npm run netlify:smoke -- <canonical|preview> <https-origin> <source-sha> <deploy-id>");
}

const http = await smokeNetlifyHttp({ origin, profile, expectedSourceRevision });
const browser = await smokeNetlifyBrowser({ origin, profile });
const report = Object.freeze({
  schemaVersion: 1,
  provider: "netlify",
  providerDeployId: deployId,
  generatedAt: new Date().toISOString(),
  http,
  browser,
});
const evidenceDirectory = path.resolve(".artifacts/deployments");
await mkdir(evidenceDirectory, { recursive: true });
const evidencePath = path.join(evidenceDirectory, `netlify-${deployId}-smoke.json`);
await writeFile(evidencePath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Netlify deployed smoke passed: ${evidencePath}`);
console.log(JSON.stringify(report));
