import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { readSkillCatalog } from "./lib/skill-catalog.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const siteDirectory = path.join(repositoryRoot, "site");
const repositoryUrl = "https://github.com/labdotsa/skills";
const siteUrl = "https://labdotsa.github.io/skills/";
const checkOnly = process.argv.includes("--check");

const skills = await readSkillCatalog(repositoryRoot);
const publicSkills = skills.map((skill, index) => ({
  index: index + 1,
  name: skill.name,
  description: skill.description,
  category: skill.category,
  resources: skill.resources,
  sourceUrl: `${repositoryUrl}/tree/main/skills/${skill.name}`,
  fileUrl: `${repositoryUrl}/blob/main/${skill.relativeSkillFile}`,
}));

const indexHtml = await readFile(path.join(siteDirectory, "index.html"), "utf8");
const outputs = new Map([
  ["skills.json", `${JSON.stringify({ skills: publicSkills }, null, 2)}\n`],
  ["skills-data.js", `window.SKILLS_DATA = ${JSON.stringify({ skills: publicSkills }, null, 2)};\n`],
  ["404.html", indexHtml],
  [
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc></url>\n</urlset>\n`,
  ],
  ["robots.txt", `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`],
]);

await mkdir(siteDirectory, { recursive: true });

if (checkOnly) {
  let stale = false;

  for (const [filename, expected] of outputs) {
    try {
      const current = await readFile(path.join(siteDirectory, filename), "utf8");
      if (current !== expected) {
        console.error(`site/${filename} is stale. Run \`npm run site:build\`.`);
        stale = true;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      console.error(`site/${filename} is missing. Run \`npm run site:build\`.`);
      stale = true;
    }
  }

  if (stale) process.exit(1);
  console.log(`Discovery site data is current for ${publicSkills.length} skills.`);
} else {
  for (const [filename, contents] of outputs) {
    await writeFile(path.join(siteDirectory, filename), contents);
  }
  console.log(`Built discovery site data for ${publicSkills.length} skills.`);
}
