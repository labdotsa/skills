import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(path.join(repositoryRoot, "package.json"), "utf8"));

const expectedRuntime = [
  "@lucide/svelte",
  "bits-ui",
  "clsx",
  "svelte-sonner",
  "tailwind-merge",
  "tailwind-variants",
];
const expectedDevelopment = [
  "@playwright/test",
  "@sveltejs/adapter-static",
  "@sveltejs/kit",
  "@sveltejs/vite-plugin-svelte",
  "@tailwindcss/vite",
  "@types/node",
  "shadcn-svelte",
  "svelte",
  "svelte-check",
  "tailwindcss",
  "tsx",
  "typescript",
  "unified",
  "vite",
  "yaml",
  "zod",
  "remark-gfm",
  "remark-parse",
];

assertKeys(packageJson.dependencies, expectedRuntime, "runtime dependencies");
assertKeys(packageJson.devDependencies, expectedDevelopment, "development dependencies");

for (const [name, version] of Object.entries({
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
})) {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`${name} must use an exact registry version, received ${version}`);
  }
}

for (const lockfile of ["bun.lock", "bun.lockb", "pnpm-lock.yaml", "yarn.lock"]) {
  try {
    await access(path.join(repositoryRoot, lockfile));
    throw new Error(`Unsupported second lockfile: ${lockfile}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unsupported")) throw error;
  }
}

for (const forbiddenConfiguration of ["tailwind.config.js", "tailwind.config.ts", "postcss.config.js", "postcss.config.mjs"]) {
  try {
    await access(path.join(repositoryRoot, forbiddenConfiguration));
    throw new Error(`Forbidden Tailwind configuration: ${forbiddenConfiguration}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Forbidden")) throw error;
  }
}

const appCss = await readFile(path.join(repositoryRoot, "src/app.css"), "utf8");
if ([...appCss.matchAll(/@import\s+["']tailwindcss["']/g)].length !== 1) {
  throw new Error("src/app.css must contain exactly one Tailwind import");
}
const viteConfig = await readFile(path.join(repositoryRoot, "vite.config.ts"), "utf8");
if ([...viteConfig.matchAll(/tailwindcss\(\)/g)].length !== 1) {
  throw new Error("vite.config.ts must register @tailwindcss/vite exactly once");
}
const svelteConfig = await readFile(path.join(repositoryRoot, "svelte.config.js"), "utf8");
if (!/adapter-static/.test(svelteConfig) || !/strict:\s*true/.test(svelteConfig)) {
  throw new Error("SvelteKit must use adapter-static with strict prerender validation");
}
if (/fallback\s*:/.test(svelteConfig)) {
  throw new Error("The static adapter must not weaken prerender validation with an SPA fallback");
}

for (const filename of await filesUnder(path.join(repositoryRoot, "src"))) {
  if (!/\.(?:svelte|ts)$/.test(filename)) continue;
  const source = await readFile(filename, "utf8");
  const relative = path.relative(repositoryRoot, filename);

  if (source.includes("mode-watcher") || source.includes("lucide-static") || source.includes("@latest")) {
    throw new Error(`${relative} imports a forbidden runtime design dependency`);
  }
  if (source.includes("{@html")) {
    throw new Error(`${relative} must render typed content nodes instead of source HTML`);
  }
  for (const match of source.matchAll(/from\s+["'](@lucide\/svelte[^"']*)["']/g)) {
    if (!match[1].startsWith("@lucide/svelte/icons/")) {
      throw new Error(`${relative} must import a concrete Lucide icon subpath`);
    }
  }
  if (relative.includes("src/lib/components/ui/") && /\$lib\/(?:components\/(?:shared|site)|server)|\$app\//.test(source)) {
    throw new Error(`${relative} violates the ui component boundary`);
  }
  if (relative.includes("src/lib/components/shared/") && /\$lib\/(?:components\/site|server)/.test(source)) {
    throw new Error(`${relative} violates the shared component boundary`);
  }
  if (relative.includes("src/lib/components/site/") && /\$lib\/server/.test(source)) {
    throw new Error(`${relative} violates the site component boundary`);
  }
}

console.log("Dependency and component boundaries are valid.");

function assertKeys(value, expected, label) {
  const actual = Object.keys(value ?? {}).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new Error(`Unexpected ${label}: ${actual.join(", ")}`);
  }
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));
}
