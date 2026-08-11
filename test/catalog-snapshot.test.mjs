import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

test("builds discriminated Skill and Recipe entries from strict YAML 1.2", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });

  assert.deepEqual(snapshot.skills.map((skill) => skill.slug), ["example"]);
  assert.equal(snapshot.skills[0].kind, "skill");
  assert.equal(snapshot.skills[0].description, "Example folded description.");
  assert.equal(snapshot.skills[0].license, "MIT");
  assert.equal(snapshot.skills[0].compatibility, "Requires a test runner.");
  assert.equal(snapshot.skills[0].allowedTools, "Read Write");
  assert.deepEqual(snapshot.skills[0].extensions, { "x-fixture": "preserved" });
  assert.equal(snapshot.recipes[0].kind, "recipe");
  assert.equal(snapshot.recipes[0].title, "Example Recipe");
});

test("rejects ambiguous YAML with a stable source-relative diagnostic", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  await writeFile(
    path.join(repositoryRoot, "skills", "example", "SKILL.md"),
    "---\nname: example\nname: duplicate\ndescription: Broken\nmetadata:\n  category: testing\n---\n# Broken\n",
  );

  await assert.rejects(
    buildCatalogSnapshot({ repositoryRoot }),
    (error) => {
      assert.match(error.message, /skills\/example\/SKILL\.md \[YAML_DUPLICATE_KEY\]/);
      assert.doesNotMatch(error.message, new RegExp(repositoryRoot.replaceAll("/", "\\/")));
      return true;
    },
  );
});

test("rejects explicit YAML tags and excessive alias expansion", async () => {
  const { parseFrontmatter } = await import("../src/lib/server/content/parse-frontmatter.ts");

  assert.throws(
    () => parseFrontmatter("---\nname: !custom example\n---\n# Example\n", "skills/example/SKILL.md"),
    /skills\/example\/SKILL\.md \[YAML_TAG\]/,
  );
  assert.throws(
    () => parseFrontmatter(
      "---\na: &a [x,x,x,x,x,x,x,x,x,x]\nb: &b [*a,*a,*a,*a,*a,*a,*a,*a,*a,*a]\nc: [*b,*b,*b,*b,*b,*b,*b,*b,*b,*b]\n---\n# Example\n",
      "skills/example/SKILL.md",
    ),
    /skills\/example\/SKILL\.md \[YAML_ALIAS_LIMIT\]/,
  );
});

test("derives Recipe structure and discriminated relationships from the shared parse", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });
  const recipe = snapshot.recipes[0];

  assert.deepEqual(recipe.stages, [
    {
      id: "content-conversation-foundation",
      slug: "foundation",
      title: "Foundation",
      steps: [{ id: "content-step-begin", depth: 3, title: "Begin" }],
    },
  ]);
  assert.deepEqual(recipe.skillRequirements.map((requirement) => requirement.kind), ["local", "external", "builtin"]);
  assert.equal(recipe.skillRequirements[0].skillId, "https://skills.lab.sa/skills/example/");
  assert.equal(recipe.skillRequirements[1].url, "https://example.com/skills/external");
  assert.equal(recipe.skillRequirements[2].availability, "built-in");
  assert.deepEqual(snapshot.relationships.skillToRecipes.example, ["example"]);
});

test("rejects a missing local Skill relationship", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  const recipePath = path.join(repositoryRoot, "recipes", "example", "RECIPE.md");
  const source = await import("node:fs/promises").then(({ readFile }) => readFile(recipePath, "utf8"));
  await writeFile(recipePath, source.replace("name: example\n      source: labdotsa/skills", "name: missing\n      source: labdotsa/skills"));

  await assert.rejects(
    buildCatalogSnapshot({ repositoryRoot }),
    /recipes\/example\/RECIPE\.md \[RELATIONSHIP_MISSING\]/,
  );
});

test("rejects duplicate requirements and non-portable package names", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  const recipePath = path.join(repositoryRoot, "recipes/example/RECIPE.md");
  const recipe = await readFile(recipePath, "utf8");
  await writeFile(
    recipePath,
    recipe.replace(
      "    - name: external\n      source: example/skills\n      url: https://example.com/skills/external",
      "    - name: example\n      source: example/skills\n      url: https://example.com/skills/example",
    ),
  );
  await assert.rejects(buildCatalogSnapshot({ repositoryRoot }), /recipes\/example\/RECIPE\.md \[RELATIONSHIP_DUPLICATE\]/);

  const secondRoot = await createContentFixture();
  const skillPath = path.join(secondRoot, "skills/example/SKILL.md");
  await writeFile(skillPath, (await readFile(skillPath, "utf8")).replace("name: example", "name: Not Portable"));
  await assert.rejects(buildCatalogSnapshot({ repositoryRoot: secondRoot }), /skills\/example\/SKILL\.md \[SKILL_SCHEMA\]/);
});

test("shares one immutable snapshot promise per provider invocation", async () => {
  const { createCatalogProvider } = await import("../src/lib/server/content/index.ts");
  const repositoryRoot = await createContentFixture();
  const reads = [];
  const provider = createCatalogProvider({ repositoryRoot, onRead: (relativePath) => reads.push(relativePath) });

  const [first, second] = await Promise.all([provider.getSnapshot(), provider.getSnapshot()]);
  assert.equal(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual(reads, ["LICENSE", "recipes/example/RECIPE.md", "skills/example/SKILL.md"]);

  provider.invalidate();
  const third = await provider.getSnapshot();
  assert.notEqual(third, first);
  assert.equal(reads.length, 6);
});

test("exposes deterministic route entries and plain immutable page views", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  const original = await readFile(path.join(repositoryRoot, "skills/example/SKILL.md"), "utf8");
  await mkdir(path.join(repositoryRoot, "skills", "alpha"), { recursive: true });
  await writeFile(
    path.join(repositoryRoot, "skills", "alpha", "SKILL.md"),
    original
      .replace("name: example", "name: alpha")
      .replace("Read the [guide](references/guide.md).", "Use alpha."),
  );

  const first = await buildCatalogSnapshot({ repositoryRoot });
  const second = await buildCatalogSnapshot({ repositoryRoot });

  assert.deepEqual(first.skillEntries(), [{ name: "alpha" }, { name: "example" }]);
  assert.deepEqual(first.recipeEntries(), [{ slug: "example" }]);
  assert.deepEqual(first.catalogSummary(), { skillCount: 2, recipeCount: 1 });
  assert.equal(first.snapshotId, second.snapshotId);
  assert.equal(first.skillPage("alpha").recommendedSkills[0].slug, "example");
  assert.equal(first.skillPage("alpha").recommendedSkills[0].title, "example");
  assert.equal(first.skillPage("example").relatedRecipes[0].slug, "example");
  assert.equal(first.skillPage("example").installCommand, "npx skills add labdotsa/skills --skill example");
  assert.deepEqual(first.skillPage("example").packageFiles, [
    {
      path: "SKILL.md",
      kind: "root",
      sourceUrl: "https://github.com/labdotsa/skills/blob/master/skills/example/SKILL.md",
    },
    {
      path: "references/guide.md",
      kind: "reference",
      sourceUrl: "https://github.com/labdotsa/skills/blob/master/skills/example/references/guide.md",
    },
  ]);
  assert.deepEqual(first.skillPage("example").related.map((entry) => entry.kind), ["recipe", "skill"]);
  const recipePage = first.recipePage("example");
  assert.equal(recipePage.localSkills[0].slug, "example");
  assert.equal(recipePage.sourceUrl, "https://github.com/labdotsa/skills/tree/master/recipes/example");
  assert.equal(recipePage.fileUrl, "https://github.com/labdotsa/skills/blob/master/recipes/example/RECIPE.md");
  assert.deepEqual(recipePage.phases.map(({ id, slug, title, number }) => ({ id, slug, title, number })), [
    {
      id: "content-conversation-foundation",
      slug: "foundation",
      title: "Foundation",
      number: 1,
    },
  ]);
  assert.deepEqual(recipePage.phases[0].steps.map(({ id, title, number }) => ({ id, title, number })), [
    { id: "content-step-begin", title: "Begin", number: 1 },
  ]);
  assert.equal(recipePage.phases[0].steps[0].document.children[0].type, "paragraph");
  assert.deepEqual(recipePage.requirements.map(({ kind, name, installCommand }) => ({ kind, name, installCommand })), [
    { kind: "local", name: "example", installCommand: "npx skills add labdotsa/skills --skill example" },
    { kind: "external", name: "external", installCommand: "npx skills add example/skills --skill external" },
    { kind: "builtin", name: "imagegen", installCommand: undefined },
  ]);
  assert.equal(Object.isFrozen(recipePage), true);
  assert.equal(Object.isFrozen(recipePage.phases[0].steps[0].document), true);
  assert.equal(JSON.parse(JSON.stringify(first.skillPage("example"))).slug, "example");
  await assert.rejects(Promise.resolve().then(() => first.skillPage("missing")), /skill:missing \[PUBLICATION_PATH\]/);
});

test("changes snapshot identity when exact source bytes change", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const repositoryRoot = await createContentFixture();
  const first = await buildCatalogSnapshot({ repositoryRoot });
  const skillPath = path.join(repositoryRoot, "skills/example/SKILL.md");
  await writeFile(skillPath, `${await readFile(skillPath, "utf8")}\n`);
  const second = await buildCatalogSnapshot({ repositoryRoot });

  assert.notEqual(first.snapshotId, second.snapshotId);
  assert.notEqual(first.skills[0].source.contentDigest, second.skills[0].source.contentDigest);
});
