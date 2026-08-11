import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createPublicationServer } from "./lib/publication-server.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const builds = [
  ["canonical", ".artifacts/e2e"],
  ["pages-project", ".artifacts/e2e-pages"],
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

const host = "127.0.0.1";
const servers = [
  createPublicationServer({ rootDirectory: path.join(repositoryRoot, ".artifacts/e2e") }),
  createPublicationServer({ rootDirectory: path.join(repositoryRoot, ".artifacts/e2e-pages"), basePath: "/skills" }),
];

await Promise.all(servers.map((server, index) => new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(4173 + index, host, resolve);
})));

console.log("Serving canonical E2E publication at http://127.0.0.1:4173/");
console.log("Serving Pages-project E2E publication at http://127.0.0.1:4174/skills/");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve)))).then(() => process.exit(0));
  });
}
