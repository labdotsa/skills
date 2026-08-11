import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const builds = [
  ["canonical", ".artifacts/canonical"],
  ["pages-project", ".artifacts/pages-project"],
];

for (const [profile, output] of builds) {
  const result = spawnSync(process.execPath, ["scripts/build-publication.mjs", profile, output], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const manifests = await Promise.all(
  builds.map(async ([, output]) =>
    JSON.parse(await readFile(path.join(repositoryRoot, output, "publication-manifest.json"), "utf8")),
  ),
);
const humanFiles = manifests.map((manifest) =>
  manifest.files
    .map((file) => file.path)
    .filter((filename) => filename.endsWith(".html") || filename.startsWith("brand/"))
    .sort(),
);

if (JSON.stringify(humanFiles[0]) !== JSON.stringify(humanFiles[1])) {
  throw new Error("Canonical and Pages-project builds emitted different human route or brand asset sets");
}

console.log("Canonical and Pages-project publication profiles are structurally equivalent.");
