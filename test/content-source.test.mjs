import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

test("reads each exact public source once and inventories package files deterministically", async () => {
  const { readSourceCorpus } = await import("../src/lib/server/content/read-source.server.ts");
  const repositoryRoot = await createContentFixture();
  const reads = [];
  const corpus = await readSourceCorpus({ repositoryRoot, onRead: (relativePath) => reads.push(relativePath) });

  assert.deepEqual(reads, ["LICENSE", "recipes/example/RECIPE.md", "skills/example/SKILL.md"]);
  assert.deepEqual(corpus.skills[0].packageFiles, ["SKILL.md", "references/guide.md"]);
  const exactBytes = await readFile(path.join(repositoryRoot, "skills/example/SKILL.md"));
  assert.deepEqual(Buffer.from(corpus.skills[0].source.bytes), exactBytes);
  assert.equal(
    corpus.skills[0].source.contentDigest,
    `sha256:${createHash("sha256").update(exactBytes).digest("hex")}`,
  );

  corpus.skills[0].source.bytes[0] = 0;
  assert.deepEqual(Buffer.from(corpus.skills[0].source.bytes), exactBytes);
});

test("rejects invalid UTF-8 before parsing", async () => {
  const { readSourceCorpus } = await import("../src/lib/server/content/read-source.server.ts");
  const repositoryRoot = await createContentFixture();
  await writeFile(path.join(repositoryRoot, "recipes/example/RECIPE.md"), new Uint8Array([0xc3, 0x28]));

  await assert.rejects(
    readSourceCorpus({ repositoryRoot }),
    /recipes\/example\/RECIPE\.md \[SOURCE_INVALID_UTF8\]/,
  );
});

test("rejects symlinks before they can enter a public package inventory", async () => {
  const { readSourceCorpus } = await import("../src/lib/server/content/read-source.server.ts");
  const repositoryRoot = await createContentFixture();
  await symlink("../../../LICENSE", path.join(repositoryRoot, "skills/example/references/leak.txt"));

  await assert.rejects(
    readSourceCorpus({ repositoryRoot }),
    /skills\/example\/references\/leak\.txt \[SOURCE_SPECIAL_FILE\]/,
  );
});
