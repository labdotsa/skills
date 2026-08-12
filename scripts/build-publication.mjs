import { createHash } from "node:crypto";
import { rm, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { publicationProfile } from "../src/lib/config/publication-profile.ts";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [profileName, requestedOutput = "site"] = process.argv.slice(2);
const profile = publicationProfile(profileName);

if (requestedOutput !== "site" && !requestedOutput.startsWith(".artifacts/")) {
  throw new Error("Publication output must be site or a directory under .artifacts/");
}
if (requestedOutput.split(/[\\/]/).includes("..")) throw new Error("Publication output cannot escape its root");

const outputDirectory = path.join(repositoryRoot, requestedOutput);
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(path.dirname(outputDirectory), { recursive: true });

const vite = spawnSync(process.execPath, [path.join(repositoryRoot, "node_modules/vite/bin/vite.js"), "build"], {
  cwd: repositoryRoot,
  encoding: "utf8",
  env: {
    ...process.env,
    PUBLICATION_PROFILE: profile.name,
    PUBLICATION_OUTPUT: requestedOutput,
  },
});
process.stdout.write(vite.stdout);
process.stderr.write(vite.stderr);
if (vite.status !== 0) process.exit(vite.status ?? 1);

const machinePublication = spawnSync(process.execPath, [
  path.join(repositoryRoot, "node_modules/tsx/dist/cli.mjs"),
  path.join(repositoryRoot, "scripts/generate-machine-publication.ts"),
  profile.name,
  requestedOutput,
], {
  cwd: repositoryRoot,
  encoding: "utf8",
});
process.stdout.write(machinePublication.stdout);
process.stderr.write(machinePublication.stderr);
if (machinePublication.status !== 0) process.exit(machinePublication.status ?? 1);

if (!profile.name.startsWith("pages-")) {
  await rm(path.join(outputDirectory, ".nojekyll"), { force: true });
}

const files = (await filesUnder(outputDirectory))
  .map((filename) => ({
    path: path.relative(outputDirectory, filename).split(path.sep).join("/"),
    bytes: 0,
    sha256: "",
  }))
  .sort((left, right) => compareCodePoints(left.path, right.path));

for (const entry of files) {
  const bytes = await readFile(path.join(outputDirectory, entry.path));
  entry.bytes = bytes.byteLength;
  entry.sha256 = createHash("sha256").update(bytes).digest("hex");
}

const revision = spawnSync("git", ["rev-parse", "HEAD"], {
  cwd: repositoryRoot,
  encoding: "utf8",
});
const dirty = spawnSync("git", ["status", "--porcelain", "--untracked-files=no"], {
  cwd: repositoryRoot,
  encoding: "utf8",
});
const lockfile = await readFile(path.join(repositoryRoot, "package-lock.json"));
const manifest = {
  schemaVersion: 1,
  sourceRevision: revision.status === 0 ? revision.stdout.trim() : "unknown",
  workingTreeDirty: dirty.stdout.trim().length > 0,
  packageLockSha256: createHash("sha256").update(lockfile).digest("hex"),
  profile,
  files,
};

await writeFile(
  path.join(outputDirectory, "publication-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const validation = spawnSync(process.execPath, [
  path.join(repositoryRoot, "scripts/validate-publication.mjs"),
  profile.name,
  requestedOutput,
], {
  cwd: repositoryRoot,
  encoding: "utf8",
});
process.stdout.write(validation.stdout);
process.stderr.write(validation.stderr);
if (validation.status !== 0) process.exit(validation.status ?? 1);

async function filesUnder(directory) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
