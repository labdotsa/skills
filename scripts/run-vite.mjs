import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { publicationProfile } from "../src/lib/config/publication-profile.ts";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [command, profileName] = process.argv.slice(2);

if (command !== "dev" && command !== "preview") throw new Error("Expected Vite dev or preview command");
const profile = publicationProfile(profileName);
const result = spawnSync(process.execPath, [path.join(repositoryRoot, "node_modules/vite/bin/vite.js"), command], {
  cwd: repositoryRoot,
  stdio: "inherit",
  env: { ...process.env, PUBLICATION_PROFILE: profile.name },
});

process.exit(result.status ?? 1);
