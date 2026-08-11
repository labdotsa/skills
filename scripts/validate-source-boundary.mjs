import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = process.env.SOURCE_BOUNDARY_ROOT
  ? path.resolve(process.env.SOURCE_BOUNDARY_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const excludedCompatibilityRoots = new Set([
  ".artifacts",
  ".git",
  ".github",
  ".svelte-kit",
  "coverage",
  "deprecated",
  "docs",
  "dist",
  "incubator",
  "node_modules",
  "output",
  "recipes",
  "site",
  "skills",
  "src",
  "static",
  "templates",
  "test",
  "tmp",
]);
const legacyApplicationBasenames = new Set([
  "app.js",
  "catalog.js",
  "copy.js",
  "index.html",
  "recipe.html",
  "recipe.js",
  "recipes.html",
  "recipes.js",
  "skill.html",
  "styles.css",
  "theme.js",
]);

async function exists(relativePath) {
  try {
    await access(path.join(repositoryRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function filesUnder(relativeDirectory) {
  const directory = path.join(repositoryRoot, relativeDirectory);
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

const hasSvelteSource = await exists("src");
const hasLegacySource = await exists("website");

if (hasSvelteSource === hasLegacySource) {
  throw new Error("Exactly one application source must exist: src/ or website/");
}
if (!hasSvelteSource) throw new Error("The migration branch requires src/ as its application source");

for (const entry of await readdir(repositoryRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || excludedCompatibilityRoots.has(entry.name)) continue;
  const files = await filesUnder(entry.name);
  const legacyMatches = files.filter((filename) => legacyApplicationBasenames.has(path.basename(filename)));
  if (legacyMatches.length >= 3) {
    throw new Error(`Renamed legacy application tree detected under ${entry.name}/`);
  }
}

for (const retiredPath of [
  "scripts/build-site.mjs",
  "scripts/serve-site.mjs",
  "scripts/validate-site.mjs",
  "scripts/lib/markdown.mjs",
  "scripts/lib/recipe-catalog.mjs",
  "scripts/lib/site-catalog.mjs",
  "scripts/lib/static-site-server.mjs",
]) {
  if (await exists(retiredPath)) throw new Error(`Retired application implementation still exists: ${retiredPath}`);
}

const packageJson = JSON.parse(await readFile(path.join(repositoryRoot, "package.json"), "utf8"));
const scriptText = JSON.stringify(packageJson.scripts ?? {});
for (const retiredCommand of ["build-site.mjs", "serve-site.mjs", "validate-site.mjs", "site:watch", "parity:capture"]) {
  if (scriptText.includes(retiredCommand)) {
    throw new Error(`Application commands still reference retired legacy behavior: ${retiredCommand}`);
  }
}

for (const filename of await filesUnder("src")) {
  if (!/\.(?:svelte|ts|js|css|html)$/.test(filename)) continue;
  const source = await readFile(filename, "utf8");
  if (/\bwebsite\//.test(source) || /(?:^|["'`])\/?site\//m.test(source)) {
    throw new Error(`${path.relative(repositoryRoot, filename)} imports an application or generated-output source`);
  }
}

console.log("SvelteKit source boundary is valid.");
