import assert from "node:assert/strict";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

test("projects and filters both directory kinds through one public model", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { countSkillPillars, createDirectoryPageView, createRecipeIndexPageView, directoryCategories, filterDirectoryItems } = await import("../src/lib/domain/directory.ts");
  const snapshot = await buildCatalogSnapshot({ repositoryRoot: await createContentFixture() });
  const directory = createDirectoryPageView(snapshot.skills, snapshot.recipes);
  const recipeIndex = createRecipeIndexPageView(snapshot.recipes);

  assert.equal(Object.isFrozen(directory), true);
  assert.equal(Object.isFrozen(recipeIndex), true);
  assert.deepEqual(recipeIndex.recipes, directory.recipes);
  assert.equal("skills" in recipeIndex, false);
  assert.deepEqual(directory.skills.map((item) => item.kind), ["skill"]);
  assert.deepEqual(directory.recipes.map((item) => item.kind), ["recipe"]);
  assert.deepEqual(directory.recipes[0].phases, ["Foundation"]);
  assert.deepEqual(filterDirectoryItems(directory.skills, { query: "GUIDE.MD", category: "all" }).map((item) => item.slug), ["example"]);
  assert.deepEqual(filterDirectoryItems(directory.recipes, { query: "DRAFT", category: "all" }).map((item) => item.slug), ["example"]);
  assert.deepEqual(filterDirectoryItems(directory.recipes, { query: "FOUNDATION", category: "all" }).map((item) => item.slug), ["example"]);
  assert.deepEqual(directoryCategories(directory.skills), [
    { value: "all", label: "All", count: 1 },
    { value: "testing", label: "testing", count: 1 },
  ]);
  assert.deepEqual(countSkillPillars(snapshot.skills), [
    { pillar: "research", count: 1 },
    { pillar: "design", count: 0 },
    { pillar: "development", count: 0 },
    { pillar: "marketing", count: 0 },
  ]);
  assert.equal("source" in directory.skills[0], false);
  assert.equal("document" in directory.skills[0], false);
});
