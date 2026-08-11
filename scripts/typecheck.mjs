import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const environment = { ...process.env, PUBLICATION_PROFILE: "canonical" };

for (const [binary, arguments_] of [
  ["svelte-kit", ["sync"]],
  ["svelte-check", ["--fail-on-warnings", "--tsconfig", "./tsconfig.json"]],
]) {
  const result = spawnSync(path.join(repositoryRoot, "node_modules/.bin", binary), arguments_, {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
