import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { smokePagesBrowser } from "./lib/pages-browser-smoke.mjs";
import { createPagesDeployRecord } from "./lib/pages-deployment.mjs";
import { smokePagesHttp } from "./lib/pages-smoke.mjs";

const [profile, deploymentUrl, expectedSourceRevision, workflowRunId, normalizedHumanSha256] = process.argv.slice(2);
if (!workflowRunId) {
  throw new Error("Usage: npm run pages:smoke -- <pages-project|pages-root> <deployment-url> <source-sha> <workflow-run-id> <normalized-human-sha256>");
}

const http = await smokePagesHttp({
  deploymentUrl,
  profile,
  expectedSourceRevision,
  expectedNormalizedHumanSha256: normalizedHumanSha256,
});
const browser = await smokePagesBrowser({ deploymentUrl, profile });
const manifestResponse = await fetch(new URL("publication-manifest.json", deploymentUrl), {
  headers: { "accept-encoding": "identity" },
});
if (manifestResponse.status !== 200) throw new Error("Pages deploy record cannot reload the publication manifest");
const publicationManifest = await manifestResponse.json();
const workflowRunAttempt = requiredEnvironment("GITHUB_RUN_ATTEMPT");
const workflowRunUrl = `${requiredEnvironment("GITHUB_SERVER_URL")}/${requiredEnvironment("GITHUB_REPOSITORY")}/actions/runs/${workflowRunId}`;
const record = createPagesDeployRecord({
  publicationManifest,
  http,
  browser,
  normalizedHumanSha256,
  workflowRunId,
  workflowRunAttempt,
  workflowRunUrl,
  generatedAt: new Date().toISOString(),
});
const evidenceDirectory = path.resolve(".artifacts/deployments");
await mkdir(evidenceDirectory, { recursive: true });
const evidencePath = path.join(evidenceDirectory, `pages-${workflowRunId}-${workflowRunAttempt}.json`);
await writeFile(evidencePath, `${JSON.stringify(record, null, 2)}\n`);
console.log(`GitHub Pages deployed smoke passed: ${evidencePath}`);
console.log(JSON.stringify(record));

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Pages smoke requires ${name}`);
  return value;
}
