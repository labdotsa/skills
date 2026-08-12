import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function validate(root = repositoryRoot) {
  return spawnSync(process.execPath, [path.join(repositoryRoot, "scripts/validate-source-boundary.mjs")], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: { ...process.env, SOURCE_BOUNDARY_ROOT: root },
  });
}

async function fixture({
  src = false,
  website = false,
  renamed = false,
  trackedSite = false,
  siteIgnored = true,
  lockfile = true,
}) {
  const root = await mkdtemp(path.join(tmpdir(), "lab-skills-source-boundary-"));
  await writeFile(path.join(root, "package.json"), '{"scripts":{}}\n');
  await writeFile(path.join(root, ".gitignore"), siteIgnored ? "/site/\n" : "");
  if (lockfile) await writeFile(path.join(root, "package-lock.json"), '{"lockfileVersion":3}\n');
  if (src) {
    await mkdir(path.join(root, "src"));
    await writeFile(path.join(root, "src", "app.ts"), "export {};\n");
  }
  if (website) await mkdir(path.join(root, "website"));
  if (renamed) {
    await mkdir(path.join(root, "legacy-copy"));
    for (const filename of ["app.js", "catalog.js", "styles.css"]) {
      await writeFile(path.join(root, "legacy-copy", filename), "/* retired */\n");
    }
  }
  if (trackedSite) {
    await mkdir(path.join(root, "site"));
    await writeFile(path.join(root, "site", "index.html"), "<!doctype html>\n");
    spawnSync("git", ["init", "--quiet"], { cwd: root });
    spawnSync("git", ["add", "--force", "site/index.html"], { cwd: root });
  }
  return root;
}

test("accepts exactly the SvelteKit application source", () => {
  const result = validate();

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /SvelteKit source boundary is valid/);
});

test("rejects both application source trees", async () => {
  const result = validate(await fixture({ src: true, website: true }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Exactly one application source/);
});

test("rejects a missing application source", async () => {
  const result = validate(await fixture({}));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Exactly one application source/);
});

test("rejects a renamed legacy compatibility tree", async () => {
  const result = validate(await fixture({ src: true, renamed: true }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Renamed legacy application tree/);
});

test("rejects tracked generated publication output", async () => {
  const result = validate(await fixture({ src: true, trackedSite: true }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Tracked generated publication output/);
});

test("rejects generated publication output missing from the ignore policy", async () => {
  const result = validate(await fixture({ src: true, siteIgnored: false }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Generated publication output must be ignored/);
});

test("rejects a migration tree without the exact npm lockfile", async () => {
  const result = validate(await fixture({ src: true, lockfile: false }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Exactly one npm lockfile/);
});
