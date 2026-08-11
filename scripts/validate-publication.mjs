import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { publicationProfile } from "../src/lib/config/publication-profile.ts";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [profileName, requestedOutput] = process.argv.slice(2);
const profile = publicationProfile(profileName);
if (!requestedOutput || (requestedOutput !== "site" && !requestedOutput.startsWith(".artifacts/"))) {
  throw new Error("A safe publication output directory is required");
}

const outputDirectory = path.join(repositoryRoot, requestedOutput);
const indexHtml = await readFile(path.join(outputDirectory, "index.html"), "utf8");
const notFoundHtml = await readFile(path.join(outputDirectory, "404.html"), "utf8");
const manifest = JSON.parse(await readFile(path.join(outputDirectory, "publication-manifest.json"), "utf8"));

if (!indexHtml.includes("Working knowledge,")) throw new Error("The root page is missing its complete shell content");
if (!indexHtml.includes('<main id="main-content"')) throw new Error("The root page is missing its main landmark");
if (!indexHtml.includes('href="#main-content"')) throw new Error("The root page is missing skip navigation");
if (!indexHtml.includes('aria-label="LAB services"')) throw new Error("The root page is missing service navigation");
await validateDirectory(indexHtml, outputDirectory);
if (!indexHtml.includes(`data-publication-profile="${profile.name}"`)) {
  throw new Error("The root page was built with the wrong publication profile");
}
if (!indexHtml.includes('href="https://skills.lab.sa/"')) throw new Error("The root canonical is missing");
if (profile.indexable && !indexHtml.includes('content="index,follow"')) {
  throw new Error("The canonical profile must be indexable");
}
if (!profile.indexable && !indexHtml.includes('content="noindex,follow"')) {
  throw new Error("The backup profile must be noindex,follow");
}

if (!notFoundHtml.includes("This page is not in the library.")) throw new Error("404.html is not useful");
if (!notFoundHtml.includes('content="noindex,follow"')) throw new Error("404.html must be noindex,follow");
if (notFoundHtml.includes('rel="canonical"')) throw new Error("404.html must not emit a canonical URL");
if (manifest.profile.name !== profile.name || manifest.profile.base !== profile.base) {
  throw new Error("Publication manifest profile does not match the build");
}

for (const asset of [
  "brand/logo.svg",
  "brand/favicon.svg",
  "brand/apple-touch-icon.png",
  "brand/social.png",
  ".nojekyll",
]) {
  await access(path.join(outputDirectory, asset));
}

for (const html of [indexHtml, notFoundHtml]) {
  if (
    /<script[^>]+src=["']https?:\/\//i.test(html) ||
    /<img[^>]+src=["']https?:\/\//i.test(html) ||
    /<link[^>]+rel=["'](?:stylesheet|icon|apple-touch-icon|preload)["'][^>]+href=["']https?:\/\//i.test(html)
  ) {
    throw new Error("Publication HTML loads a runtime presentation asset from an external origin");
  }
  if (/\b(?:src|href)=["']\/(?!\/)/i.test(html)) {
    throw new Error("Publication HTML contains a root-relative local URL that can escape a project base");
  }
}

console.log(`Publication ${profile.name} is valid at ${requestedOutput}.`);

async function validateDirectory(html, directory) {
  const expectedSkillCount = Number(html.match(/data-skill-count="(\d+)"/)?.[1]);
  const expectedRecipeCount = Number(html.match(/data-recipe-count="(\d+)"/)?.[1]);
  const skillLinks = [...html.matchAll(/href="(\.\/skills\/[^"?#]+\/)" aria-label="Open [^"]+ skill"/g)].map((match) => match[1]);
  const recipeLinks = [...html.matchAll(/href="(\.\/recipes\/[^"?#]+\/)" aria-label="Open [^"]+ recipe"/g)].map((match) => match[1]);

  if (!Number.isInteger(expectedSkillCount) || skillLinks.length !== expectedSkillCount) {
    throw new Error(`The prerendered Skill directory contains ${skillLinks.length} of ${expectedSkillCount} rows`);
  }
  if (!Number.isInteger(expectedRecipeCount) || recipeLinks.length !== expectedRecipeCount) {
    throw new Error(`The prerendered Recipe directory contains ${recipeLinks.length} of ${expectedRecipeCount} rows`);
  }
  for (const href of [...skillLinks, ...recipeLinks]) {
    await access(path.join(directory, href.slice(2), "index.html"));
  }
}
