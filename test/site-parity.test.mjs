import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(repositoryRoot, "site");

async function readOutput(relativePath) {
  return readFile(path.join(outputDirectory, relativePath), "utf8");
}

function titleOf(html) {
  return html.match(/<title>([^<]+)<\/title>/)?.[1];
}

function canonicalOf(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
}

test("locks the public HTML route, title, canonical, and heading baseline", async () => {
  const pages = [
    {
      file: "index.html",
      title: "LAB Skills — Public agent protocols",
      canonical: "https://skills.lab.sa/",
      heading: "Working knowledge,",
    },
    {
      file: "404.html",
      title: "LAB Skills — Public agent protocols",
      canonical: "https://skills.lab.sa/",
      heading: "Working knowledge,",
    },
    {
      file: "recipes.html",
      title: "LAB Recipes — Delivery playbooks",
      canonical: "https://skills.lab.sa/recipes.html",
      heading: "LAB</span> Recipes turn focused",
    },
    {
      file: "recipe.html",
      title: "Delivering a Functioning Prototype — LABs Recipe",
      canonical: "https://skills.lab.sa/recipe.html",
      heading: "Deliver a functioning prototype.",
    },
  ];

  for (const page of pages) {
    const html = await readOutput(page.file);
    assert.equal(titleOf(html), page.title, `${page.file} title changed`);
    assert.equal(canonicalOf(html), page.canonical, `${page.file} canonical changed`);
    assert.match(html, new RegExp(`<h1[^>]*>[^]*${page.heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
});

test("emits one complete public detail route for every cataloged Skill", async () => {
  const catalog = JSON.parse(await readOutput("skills.json"));

  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.skills.length, 6);
  for (const skill of catalog.skills) {
    const html = await readOutput(`skills/${skill.name}/index.html`);
    assert.equal(titleOf(html), `${skill.name} — LAB Skills`);
    assert.equal(canonicalOf(html), `https://skills.lab.sa/skills/${skill.name}/`);
    assert.match(html, new RegExp(`<h1>${skill.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/h1>`));
    assert.match(html, /class="markdown-body"/);
    assert.match(html, /class="package-directory"/);
  }
});

test("keeps catalogs, Recipe routes, sitemap, and robots in one publication set", async () => {
  const skills = JSON.parse(await readOutput("skills.json"));
  const recipes = JSON.parse(await readOutput("recipes.json"));
  const sitemap = await readOutput("sitemap.xml");
  const robots = await readOutput("robots.txt");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(skills.schemaVersion, 1);
  assert.equal(recipes.schemaVersion, 1);
  assert.deepEqual(recipes.recipes.map(({ detailUrl }) => detailUrl), ["./recipe.html"]);
  assert.deepEqual(locations, [
    "https://skills.lab.sa/",
    "https://skills.lab.sa/recipes.html",
    "https://skills.lab.sa/recipe.html",
    ...skills.skills.map(({ name }) => `https://skills.lab.sa/skills/${name}/`),
  ]);
  assert.equal(robots, "User-agent: *\nAllow: /\nSitemap: https://skills.lab.sa/sitemap.xml\n");
});
