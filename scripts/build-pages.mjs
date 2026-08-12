import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { comparePagesPublication, resolvePagesPublication } from "./lib/pages-deployment.mjs";

const repositoryRoot = path.resolve(".");
const { profile } = resolvePagesPublication(process.env.PUBLICATION_PROFILE);
const canonicalDirectory = path.join(repositoryRoot, ".artifacts/pages-canonical-reference");
const pagesDirectory = path.join(repositoryRoot, ".artifacts/pages-publication");

run(process.execPath, ["scripts/build-publication.mjs", "canonical", ".artifacts/pages-canonical-reference"]);
run(process.execPath, ["scripts/build-publication.mjs", profile, ".artifacts/pages-publication"]);
const comparison = await comparePagesPublication({ canonicalDirectory, pagesDirectory });
const publicationManifest = JSON.parse(await readFile(path.join(pagesDirectory, "publication-manifest.json"), "utf8"));
if (process.env.GITHUB_SHA && publicationManifest.sourceRevision !== process.env.GITHUB_SHA) {
  throw new Error("Pages publication source revision does not match GITHUB_SHA");
}

const workflowRunId = process.env.GITHUB_RUN_ID ?? "local";
const workflowRunUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;
const buildRecord = Object.freeze({
  schemaVersion: 1,
  provider: "github-pages",
  stage: "build",
  generatedAt: new Date().toISOString(),
  workflowRunId,
  workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  workflowRunUrl,
  validation: { command: "npm run validate", status: "pass" },
  comparison,
  publicationManifest,
});
const evidenceDirectory = path.join(repositoryRoot, ".artifacts/deployments");
await mkdir(evidenceDirectory, { recursive: true });
const evidencePath = path.join(evidenceDirectory, `pages-build-${workflowRunId}.json`);
await writeFile(evidencePath, `${JSON.stringify(buildRecord, null, 2)}\n`);
if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `normalized_human_sha256=${comparison.normalizedHumanSha256}\n`);
}
console.log(`GitHub Pages ${profile} publication is valid at ${pagesDirectory}.`);
console.log(`Pages build record: ${JSON.stringify(buildRecord)}`);

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repositoryRoot, env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
