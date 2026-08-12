import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import {
  createNetlifyDeployRecord,
  materializeNetlifyPublication,
  resolveNetlifyPublication,
} from "./lib/netlify-deployment.mjs";

const context = process.env.CONTEXT;
const configuredProfile = process.env.PUBLICATION_PROFILE;
const profile = resolveNetlifyPublication(context, configuredProfile);
const repositoryRoot = path.resolve(".");
const stagedOutput = ".artifacts/netlify-publication";

run(process.execPath, ["scripts/build-publication.mjs", profile, stagedOutput], {
  ...process.env,
  NETLIFY_ARTIFACT: "true",
});

const publicationManifest = JSON.parse(await readFile(path.join(stagedOutput, "publication-manifest.json"), "utf8"));
const record = createNetlifyDeployRecord({
  publicationManifest,
  context,
  configuredProfile,
  commitRef: requiredEnvironment("COMMIT_REF"),
  deployId: requiredEnvironment("DEPLOY_ID"),
  deployUrl: requiredEnvironment("DEPLOY_URL"),
  generatedAt: new Date().toISOString(),
});
const evidenceDirectory = path.resolve(".artifacts/deployments");
await mkdir(evidenceDirectory, { recursive: true });
const evidencePath = path.join(evidenceDirectory, `netlify-${context}.json`);
await writeFile(evidencePath, `${JSON.stringify(record, null, 2)}\n`);
const publication = await materializeNetlifyPublication({ repositoryRoot, publicationManifest });

console.log(`Netlify ${context} publication is valid at ${publication.publishDirectory}.`);
console.log(`Netlify deploy record: ${JSON.stringify(record)}`);

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { cwd: process.cwd(), env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Netlify build requires ${name}`);
  return value;
}
