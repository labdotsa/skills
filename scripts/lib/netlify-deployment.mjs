import { createHash } from "node:crypto";
import { cp, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";

const contextProfiles = Object.freeze({
  production: "canonical",
  "deploy-preview": "preview",
  "branch-deploy": "preview",
});

export function resolveNetlifyPublication(context, configuredProfile) {
  const expected = contextProfiles[context];
  if (!expected) throw new Error(`Unsupported Netlify context: ${String(context)}`);
  if (configuredProfile !== expected) {
    throw new Error(`Netlify ${context} must use the ${expected} publication profile, received ${String(configuredProfile)}`);
  }
  return expected;
}

export function createNetlifyDeployRecord({
  publicationManifest,
  context,
  configuredProfile,
  commitRef,
  deployId,
  deployUrl,
  generatedAt,
}) {
  const profile = resolveNetlifyPublication(context, configuredProfile);
  if (!publicationManifest || publicationManifest.schemaVersion !== 1) {
    throw new Error("Netlify deployment requires a schema-v1 publication manifest");
  }
  if (publicationManifest.profile?.name !== profile) {
    throw new Error(`Publication manifest profile must be ${profile}`);
  }
  if (publicationManifest.workingTreeDirty !== false) {
    throw new Error("Netlify deployment requires a clean publication manifest");
  }
  if (!isSha(publicationManifest.sourceRevision) || publicationManifest.sourceRevision !== commitRef) {
    throw new Error("Publication source revision must match the Netlify commit reference");
  }
  if (!/^[0-9a-f]{64}$/.test(publicationManifest.packageLockSha256 ?? "")) {
    throw new Error("Publication manifest requires the package-lock SHA-256 digest");
  }
  if (typeof deployId !== "string" || deployId.length < 3) throw new Error("Netlify deploy ID is required");
  const deploymentUrl = normalizedHttpsOrigin(deployUrl);
  if (!isIsoTimestamp(generatedAt)) throw new Error("Netlify deploy record requires an ISO timestamp");
  const files = validateFiles(publicationManifest.files);

  return deepFreeze({
    schemaVersion: 1,
    provider: "netlify",
    generatedAt,
    context,
    providerDeployId: deployId,
    providerDeploymentUrl: deploymentUrl,
    sourceRevision: publicationManifest.sourceRevision,
    packageLockSha256: publicationManifest.packageLockSha256,
    profile: structuredClone(publicationManifest.profile),
    validation: { command: "npm run validate:netlify", status: "pass" },
    routes: files.filter((file) => file.path.endsWith(".html")).map((file) => file.path),
    files,
  });
}

export async function materializeNetlifyPublication({ repositoryRoot, publicationManifest }) {
  const root = path.resolve(repositoryRoot);
  if (root === path.parse(root).root) throw new Error("Netlify publication repository root is too broad");
  const stagingDirectory = path.join(root, ".artifacts/netlify-publication");
  const publishDirectory = path.join(root, "site");
  const files = validateFiles(publicationManifest?.files);
  const entries = await readdir(stagingDirectory, { recursive: true, withFileTypes: true });
  if (entries.some((entry) => !entry.isDirectory() && !entry.isFile())) {
    throw new Error("Netlify staged publication must not contain links or special files");
  }
  const actualPaths = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(stagingDirectory, path.join(entry.parentPath, entry.name)).split(path.sep).join("/"))
    .sort(compareCodePoints);
  const expectedPaths = [...files.map((file) => file.path), "publication-manifest.json"].sort(compareCodePoints);
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error("Netlify staged publication files do not match its manifest");
  }
  const stagedManifest = JSON.parse(await readFile(path.join(stagingDirectory, "publication-manifest.json"), "utf8"));
  if (JSON.stringify(stagedManifest) !== JSON.stringify(publicationManifest)) {
    throw new Error("Netlify staged publication manifest changed before materialization");
  }
  await verifyFiles(stagingDirectory, files);
  await rm(publishDirectory, { recursive: true, force: true });
  await cp(stagingDirectory, publishDirectory, { recursive: true, force: true });
  await verifyFiles(publishDirectory, files);
  return Object.freeze({ publishDirectory, filesMaterialized: files.length });
}

function validateFiles(value) {
  if (!Array.isArray(value) || value.length === 0) throw new Error("Publication file manifest is required");
  const seen = new Set();
  return value.map((file) => {
    if (!file || typeof file.path !== "string" || !file.path || file.path.startsWith("/") || file.path.includes("..")) {
      throw new Error("Publication file paths must be safe artifact-relative paths");
    }
    if (seen.has(file.path)) throw new Error(`Duplicate publication file ${file.path}`);
    seen.add(file.path);
    if (!Number.isInteger(file.bytes) || file.bytes < 0 || !/^[0-9a-f]{64}$/.test(file.sha256 ?? "")) {
      throw new Error(`Invalid publication file evidence for ${file.path}`);
    }
    return structuredClone(file);
  });
}

function normalizedHttpsOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error("Netlify deployment URL must be an HTTPS origin", { cause: error });
  }
  if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Netlify deployment URL must be an HTTPS origin");
  }
  return url.href;
}

function isSha(value) {
  return typeof value === "string" && /^[0-9a-f]{40}$/.test(value);
}

function isIsoTimestamp(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

async function verifyFiles(directory, files) {
  for (const file of files) {
    const bytes = await readFile(path.join(directory, file.path));
    if (bytes.byteLength !== file.bytes || createHash("sha256").update(bytes).digest("hex") !== file.sha256) {
      throw new Error(`Netlify publication file differs from its manifest: ${file.path}`);
    }
  }
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
