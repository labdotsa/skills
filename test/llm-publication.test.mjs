import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

test("publishes one curated proposal-compatible llms.txt from the canonical Catalog snapshot", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const snapshot = await buildCatalogSnapshot({ repositoryRoot: await createContentFixture() });

  const publication = createLlmPublication(snapshot, publicationProfile("canonical"));
  const llms = publication.get("llms.txt");

  assert.equal(llms.contentType, "text/plain; charset=utf-8");
  assert.equal(llms.body.startsWith("# LAB Skills\n\n> "), true);
  assert.deepEqual([...llms.body.matchAll(/^## (.+)$/gm)].map((match) => match[1]), [
    "Skills",
    "Recipes",
    "Catalogs and terms",
    "Optional",
  ]);
  assert.match(
    llms.body,
    /\[example\]\(https:\/\/skills\.lab\.sa\/skills\/example\/index\.md\): Example folded description\./,
  );
  assert.match(
    llms.body,
    /\[Example Recipe\]\(https:\/\/skills\.lab\.sa\/recipes\/example\/index\.md\): Example recipe\. Status: draft\./,
  );
  for (const required of [
    "public MIT-licensed agent instructions and delivery playbooks",
    "commands, prompts, and operational instructions",
    "quoted reference content",
    "intentionally chooses to install or invoke it",
    "robots.txt expresses crawl preference",
    "the license states reuse terms",
    "https://skills.lab.sa/skills.json",
    "https://skills.lab.sa/recipes.json",
    "https://skills.lab.sa/LICENSE.txt",
    "https://github.com/labdotsa/skills",
  ]) assert.match(llms.body, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(llms.body.includes("Use the example."), false);
  assert.equal(llms.body.includes("\r"), false);
  assert.equal(llms.body.startsWith("\ufeff"), false);
  assert.equal(llms.body.endsWith("\n"), true);
  assert.equal(llms.body.endsWith("\n\n"), false);
  assert.equal(Buffer.byteLength(llms.body) <= 100 * 1024, true);
  assert.equal(publication.has("llms-full.txt"), false);
});

test("publishes exact-byte Markdown mirrors with the Catalog source digests", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });
  const publication = createLlmPublication(snapshot, publicationProfile("canonical"));

  for (const [filename, sourcePath, digest] of [
    ["skills/example/index.md", "skills/example/SKILL.md", snapshot.skillCatalogV2().skills[0].contentDigest],
    ["recipes/example/index.md", "recipes/example/RECIPE.md", snapshot.recipeCatalogV2().recipes[0].contentDigest],
  ]) {
    const mirror = publication.get(filename);
    assert.equal(mirror.contentType, "text/markdown; charset=utf-8");
    assert.deepEqual(Buffer.from(mirror.body), await readFile(path.join(repositoryRoot, sourcePath)));
    assert.equal(mirror.contentDigest, digest);
  }
});

test("publishes deterministic schema-v2 catalogs that agree with every mirror identity", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const snapshot = await buildCatalogSnapshot({ repositoryRoot: await createContentFixture() });
  const publication = createLlmPublication(snapshot, publicationProfile("canonical"));
  const repeatedPublication = createLlmPublication(snapshot, publicationProfile("canonical"));

  assert.deepEqual([...repeatedPublication.keys()], [...publication.keys()]);
  for (const [filename, file] of publication) {
    assert.deepEqual(Buffer.from(repeatedPublication.get(filename).body), Buffer.from(file.body));
  }

  for (const [filename, expectedBody, collection] of [
    ["skills.json", snapshot.serializeSkillCatalogV2(), "skills"],
    ["recipes.json", snapshot.serializeRecipeCatalogV2(), "recipes"],
  ]) {
    const file = publication.get(filename);
    assert.equal(file.contentType, "application/json; charset=utf-8");
    assert.equal(file.body, expectedBody);
    const catalog = JSON.parse(file.body);
    assert.equal(catalog.schemaVersion, 2);
    assert.equal(catalog.licenseExpression, "MIT");
    assert.equal(catalog.licenseUrl, "https://skills.lab.sa/LICENSE.txt");
    for (const item of catalog[collection]) {
      assert.equal(item.id, item.canonicalUrl);
      assert.equal(item.markdownUrl, `${item.canonicalUrl}index.md`);
      assert.equal(publication.get(new URL(item.markdownUrl).pathname.slice(1)).contentDigest, item.contentDigest);
    }
  }
});

test("publishes the exact repository license bytes at every catalog license URL", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });
  const publication = createLlmPublication(snapshot, publicationProfile("canonical"));
  const license = publication.get("LICENSE.txt");

  assert.equal(license.contentType, "text/plain; charset=utf-8");
  assert.deepEqual(Buffer.from(license.body), await readFile(path.join(repositoryRoot, "LICENSE")));
  assert.equal(license.contentDigest, snapshot.licenseMirror().contentDigest);
  assert.match(publication.get("llms.txt").body, /\[MIT license\]\(https:\/\/skills\.lab\.sa\/LICENSE\.txt\)/);
});

test("keeps machine publication canonical-only and omits llms-full.txt", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const snapshot = await buildCatalogSnapshot({ repositoryRoot: await createContentFixture() });

  assert.deepEqual([...createLlmPublication(snapshot, publicationProfile("canonical")).keys()].sort(), [
    "LICENSE.txt",
    "llms.txt",
    "recipes.json",
    "recipes/example/index.md",
    "skills.json",
    "skills/example/index.md",
  ]);
  for (const profile of ["preview", "pages-project", "pages-root"]) {
    assert.equal(createLlmPublication(snapshot, publicationProfile(profile)).size, 0);
  }
});
