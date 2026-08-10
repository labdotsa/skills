import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertRecipeSiteCatalog,
  createRecipeSiteCatalog,
  readRecipeCatalog,
} from "../scripts/lib/recipe-catalog.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("derives recipe discovery data from RECIPE.md", async () => {
  const recipes = await readRecipeCatalog(repositoryRoot);
  const prototype = recipes.find((recipe) => recipe.slug === "functional-prototype");

  assert.ok(prototype);
  assert.equal(prototype.title, "Functioning Prototype");
  assert.match(prototype.description, /^Guide a product from early discovery/);
  assert.match(prototype.description, /implement one tested task at a time\.$/);
  assert.equal(prototype.category, "product-delivery");
  assert.equal(prototype.status, "draft");
  assert.equal(prototype.conversations, 4);
  assert.equal(prototype.detailUrl, "./recipe.html");
});

test("builds and validates the public recipe catalog", async () => {
  const recipes = await readRecipeCatalog(repositoryRoot);
  const catalog = createRecipeSiteCatalog(recipes, "https://github.com/labdotsa/skills");

  assert.equal(assertRecipeSiteCatalog(catalog), catalog);
  assert.match(catalog.recipes[0].sourceUrl, /recipes\/functional-prototype\/RECIPE\.md$/);
  assert.throws(
    () => assertRecipeSiteCatalog({ ...catalog, schemaVersion: 2 }),
    /schemaVersion 1/,
  );
});
