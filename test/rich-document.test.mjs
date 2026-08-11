import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

function walk(nodes) {
  return nodes.flatMap((node) => [node, ...(node.children ? walk(node.children) : [])]);
}

test("turns one GFM parse into closed safe rich content", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  await writeFile(
    path.join(repositoryRoot, "skills/example/SKILL.md"),
    `---
name: example
description: Safe rich document.
metadata:
  category: testing
---
# Example
## Repeat
## Repeat
<script>alert("never execute")</script>
[Guide](references/guide.md)

\`\`\`html
<button onclick="bad()">Text</button>
\`\`\`
`,
  );
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });
  const nodes = walk(snapshot.skills[0].document.children);

  assert.deepEqual(snapshot.skills[0].outline.map((item) => item.id), ["content-example", "content-repeat", "content-repeat-2"]);
  assert.equal(nodes.some((node) => node.type === "html"), false);
  assert.equal(nodes.some((node) => node.type === "text" && node.value.includes("<script>")), true);
  assert.equal(nodes.some((node) => node.type === "code" && node.value.includes("onclick")), true);
  assert.equal(nodes.find((node) => node.type === "link").kind, "source");
  assert.match(nodes.find((node) => node.type === "link").href, /github\.com\/labdotsa\/skills\/blob\/master\/skills\/example\/references\/guide\.md$/);
});

test("fails closed on unsafe Markdown URL schemes", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  await writeFile(
    path.join(repositoryRoot, "skills/example/SKILL.md"),
    `---
name: example
description: Unsafe link fixture.
metadata:
  category: testing
---
# Example
[Never execute](JaVaScRiPt:alert%281%29)
`,
  );

  await assert.rejects(
    buildCatalogSnapshot({ repositoryRoot }),
    /skills\/example\/SKILL\.md \[URL_UNSAFE_SCHEME\]/,
  );
});

test("rejects protocol-relative, data-image, traversal, and missing package URLs", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const cases = [
    ["[protocol](//example.com/path)", /URL_UNSAFE_SCHEME/],
    ["![data](data:image/png;base64,abc)", /URL_UNSAFE_SCHEME/],
    ["[traversal](references/%2e%2e/SKILL.md)", /URL_OUTSIDE_PACKAGE/],
    ["[missing](references/missing.md)", /SOURCE_LINK_MISSING/],
  ];

  for (const [markdown, expected] of cases) {
    const repositoryRoot = await createContentFixture();
    await writeFile(
      path.join(repositoryRoot, "skills/example/SKILL.md"),
      `---\nname: example\ndescription: Unsafe URL fixture.\nmetadata:\n  category: testing\n---\n# Example\n${markdown}\n`,
    );
    await assert.rejects(buildCatalogSnapshot({ repositoryRoot }), expected);
  }
});
