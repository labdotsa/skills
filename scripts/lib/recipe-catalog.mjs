import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseFrontmatter } from "./skill-catalog.mjs";

export const RECIPE_CATALOG_SCHEMA_VERSION = 1;

function assertString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`Recipe catalog field \`${field}\` must be a non-empty string.`);
  }
}

function titleFromMarkdown(source, fallback) {
  return source.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function conversationCount(source) {
  return [...source.matchAll(/^##\s+Conversation\b.*$/gim)].length;
}

export async function readRecipeCatalog(repositoryRoot) {
  const recipesDirectory = path.join(repositoryRoot, "recipes");
  const entries = await readdir(recipesDirectory, { withFileTypes: true });
  const recipes = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isDirectory()) continue;

    const relativeRecipeFile = path.posix.join("recipes", entry.name, "RECIPE.md");
    try {
      const source = await readFile(path.join(repositoryRoot, relativeRecipeFile), "utf8");
      const frontmatter = parseFrontmatter(source);
      if (frontmatter.name !== entry.name) {
        throw new Error(`Recipe ${entry.name} must declare a matching frontmatter name.`);
      }

      recipes.push({
        slug: entry.name,
        title: titleFromMarkdown(source, entry.name),
        description: frontmatter.description,
        category: frontmatter.metadata.category,
        status: frontmatter.metadata.status,
        conversations: conversationCount(source),
        detailUrl: frontmatter.metadata["detail-url"],
        relativeRecipeFile,
      });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  return recipes;
}

export function createRecipeSiteCatalog(recipes, repositoryUrl) {
  assertString(repositoryUrl, "repositoryUrl");
  return {
    schemaVersion: RECIPE_CATALOG_SCHEMA_VERSION,
    recipes: recipes.map((recipe, index) => ({
      index: index + 1,
      slug: recipe.slug,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      status: recipe.status,
      conversations: recipe.conversations,
      detailUrl: recipe.detailUrl,
      sourceUrl: `${repositoryUrl}/blob/master/${recipe.relativeRecipeFile}`,
    })),
  };
}

export function assertRecipeSiteCatalog(catalog) {
  if (!catalog || typeof catalog !== "object") throw new TypeError("Recipe catalog must be an object.");
  if (catalog.schemaVersion !== RECIPE_CATALOG_SCHEMA_VERSION || !Array.isArray(catalog.recipes)) {
    throw new TypeError("Recipe catalog must use schemaVersion 1 and contain a recipes array.");
  }

  const slugs = new Set();
  for (const [index, recipe] of catalog.recipes.entries()) {
    const prefix = `recipes[${index}]`;
    for (const field of ["slug", "title", "description", "category", "status", "detailUrl", "sourceUrl"]) {
      assertString(recipe[field], `${prefix}.${field}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe.slug)) {
      throw new TypeError(`${prefix}.slug must use lowercase kebab-case.`);
    }
    if (slugs.has(recipe.slug)) throw new TypeError(`Recipe catalog contains duplicate slug: ${recipe.slug}.`);
    if (!Number.isInteger(recipe.index) || recipe.index !== index + 1) {
      throw new TypeError(`${prefix}.index must match its catalog position.`);
    }
    if (!Number.isInteger(recipe.conversations) || recipe.conversations < 1) {
      throw new TypeError(`${prefix}.conversations must be a positive integer.`);
    }
    if (!recipe.detailUrl.startsWith("./") || recipe.detailUrl.includes("..")) {
      throw new TypeError(`${prefix}.detailUrl must be a local path beginning with ./.`);
    }
    slugs.add(recipe.slug);
  }

  return catalog;
}
