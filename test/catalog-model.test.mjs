import assert from "node:assert/strict";
import test from "node:test";

await import("../website/catalog.js");
const Catalog = globalThis.LabsCatalog;

const catalog = {
  schemaVersion: 1,
  installCommand: "npx skills add labdotsa/skills",
  repositoryUrl: "https://github.com/labdotsa/skills",
  skills: [
    {
      name: "tailwind",
      description: "A composed Tailwind workflow.",
      category: "frontend",
      files: ["SKILL.md", "references/v4-adoption.md"],
      detailUrl: "./skills/tailwind/index.html",
      sourceUrl: "https://github.com/labdotsa/skills/tree/main/skills/tailwind",
      fileUrl: "https://github.com/labdotsa/skills/blob/main/skills/tailwind/SKILL.md",
    },
    {
      name: "copywriting",
      description: "A writing workflow.",
      category: "content",
      files: ["SKILL.md"],
      detailUrl: "./skills/copywriting/index.html",
      sourceUrl: "https://github.com/labdotsa/skills/tree/main/skills/copywriting",
      fileUrl: "https://github.com/labdotsa/skills/blob/main/skills/copywriting/SKILL.md",
    },
  ],
};

test("validates and returns a supported catalog", () => {
  assert.equal(Catalog.validateCatalog(catalog), catalog);
  assert.throws(() => Catalog.validateCatalog({ ...catalog, schemaVersion: 2 }), /Unsupported catalog schema/);
});

test("filters across names, descriptions, categories, and package files", () => {
  assert.deepEqual(Catalog.filterSkills(catalog.skills, { query: "v4" }).map(({ name }) => name), ["tailwind"]);
  assert.deepEqual(
    Catalog.filterSkills(catalog.skills, { category: "content" }).map(({ name }) => name),
    ["copywriting"],
  );
});

test("builds install commands and direct package-file links", () => {
  assert.equal(Catalog.commandForSkill(catalog, "tailwind"), "npx skills add labdotsa/skills --skill tailwind");
  assert.equal(
    Catalog.fileUrl(catalog, catalog.skills[0], "references/v4-adoption.md"),
    "https://github.com/labdotsa/skills/blob/main/skills/tailwind/references/v4-adoption.md",
  );
});
