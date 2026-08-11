import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

test("validates the complete canonical source-to-HTML-to-machine publication graph", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const { validateLlmPublication } = await import("../scripts/lib/llm-validation.mjs");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });
  const publication = createLlmPublication(snapshot, publicationProfile("canonical"));
  const files = new Map([...publication].map(([filename, file]) => [filename, Buffer.from(file.body)]));
  const htmlAlternates = new Map(snapshot.publication.map((identity) => [identity.htmlPath, identity.markdownUrl]));

  const result = validateLlmPublication({
    profile: publicationProfile("canonical"),
    files,
    htmlAlternates,
    repositoryLicense: await readFile(path.join(repositoryRoot, "LICENSE")),
  });

  assert.deepEqual(result, { skillCount: 1, recipeCount: 1, mirrorCount: 2 });
});

test("fails closed on digest, alternate, license, safety, route-set, and profile drift", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createLlmPublication } = await import("../src/lib/server/llm/publication.ts");
  const { validateLlmPublication } = await import("../scripts/lib/llm-validation.mjs");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });
  const publication = createLlmPublication(snapshot, publicationProfile("canonical"));
  const files = new Map([...publication].map(([filename, file]) => [filename, Buffer.from(file.body)]));
  const htmlAlternates = new Map(snapshot.publication.map((identity) => [identity.htmlPath, identity.markdownUrl]));
  const repositoryLicense = await readFile(path.join(repositoryRoot, "LICENSE"));
  const validate = (overrides = {}) => validateLlmPublication({
    profile: publicationProfile("canonical"),
    files,
    htmlAlternates,
    repositoryLicense,
    ...overrides,
  });

  const corruptMirror = new Map(files);
  corruptMirror.set("skills/example/index.md", Buffer.concat([files.get("skills/example/index.md"), Buffer.from("drift")]));
  assert.throws(() => validate({ files: corruptMirror }), /digest.*does not match/i);
  assert.throws(() => validate({ htmlAlternates: new Map() }), /Markdown alternate does not match/i);
  assert.throws(() => validate({ repositoryLicense: Buffer.from("different\n") }), /exact repository LICENSE bytes/i);

  const unsafe = new Map(files);
  unsafe.set("llms.txt", Buffer.from(`${files.get("llms.txt").toString()}Local source: /Users/example/private\n`));
  assert.throws(() => validate({ files: unsafe }), /personal absolute path/i);

  const fullCorpus = new Map(files).set("llms-full.txt", Buffer.from("duplicate corpus\n"));
  assert.throws(() => validate({ files: fullCorpus }), /llms-full\.txt must remain omitted/i);
  const unexpectedMirror = new Map(files).set("skills/example/extra.md", Buffer.from("duplicate representation\n"));
  assert.throws(() => validate({ files: unexpectedMirror }), /machine route set drift/i);

  const labelDrift = new Map(files);
  labelDrift.set("llms.txt", Buffer.from(files.get("llms.txt").toString().replace("- [example](", "- [different](")));
  assert.throws(() => validate({ files: labelDrift }), /identity or description drift/i);
  assert.throws(
    () => validate({ profile: publicationProfile("pages-project") }),
    /pages-project must omit LLM machine surfaces/i,
  );
});
