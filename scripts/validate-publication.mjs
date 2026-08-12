import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { publicationProfile } from "../src/lib/config/publication-profile.ts";
import {
  validateCanonicalLinkGraph,
  validateSeoDocument,
  validateUniqueCanonicalMetadata,
} from "./lib/seo-validation.mjs";
import { validateLlmPublication } from "./lib/llm-validation.mjs";
import { validateHtmlQuality } from "./lib/html-quality.mjs";

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
await validateRecipeIndexes(manifest, outputDirectory);
await validateRecipePages(manifest, outputDirectory);
await validateSkillPages(manifest, outputDirectory);
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

const htmlFiles = manifest.files
  .map((file) => file.path)
  .filter((filename) => filename.endsWith(".html"))
  .sort();
const seoRecords = [];
for (const filename of htmlFiles) {
  const html = await readFile(path.join(outputDirectory, filename), "utf8");
  validateHtmlQuality(filename, html);
  const expectedCanonical = expectedCanonicalFor(filename, profile.canonicalOrigin);
  seoRecords.push(validateSeoDocument({
    filename,
    html,
    profile,
    expectedCanonical,
    expectedAlternate: expectedMarkdownAlternateFor(filename, profile.canonicalOrigin),
    structuredData: profile.indexable && filename !== "404.html" ? "required" : "forbidden",
  }));
  await validateLocalReferences(html, filename, outputDirectory);
  validatePortablePresentationReferences(html, filename);
}

const cleanCanonicalRecords = seoRecords
  .filter((record) => !isAlias(record.filename) && record.filename !== "404.html")
  .sort((left, right) => canonicalPublicationOrder(left.filename) - canonicalPublicationOrder(right.filename)
    || compareCodePoints(left.filename, right.filename));
validateUniqueCanonicalMetadata(cleanCanonicalRecords);
validateCanonicalLinkGraph(seoRecords);
await validateMachineSurfaces(profile, manifest, cleanCanonicalRecords, seoRecords, outputDirectory);

for (const asset of [
  "brand/logo.svg",
  "brand/favicon.svg",
  "brand/apple-touch-icon.png",
  "brand/social.png",
  ".nojekyll",
]) {
  await access(path.join(outputDirectory, asset));
}
const socialImage = await readFile(path.join(outputDirectory, "brand/social.png"));
if (!socialImage.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
  throw new Error("brand/social.png is not a valid PNG social image");
}

console.log(`Publication ${profile.name} is valid at ${requestedOutput}.`);

async function validateDirectory(html, directory) {
  const expectedSkillCount = Number(html.match(/data-skill-count="(\d+)"/)?.[1]);
  const skillLinks = [...html.matchAll(/href="(\.\/skills\/[^"?#]+\/)" aria-label="Open [^"]+ skill"/g)].map((match) => match[1]);
  const recipeLinks = [...html.matchAll(/href="(\.\/recipes\/[^"?#]+\/)" aria-label="Open [^"]+ recipe"/g)].map((match) => match[1]);

  if (!Number.isInteger(expectedSkillCount) || skillLinks.length !== expectedSkillCount) {
    throw new Error(`The prerendered Skill directory contains ${skillLinks.length} of ${expectedSkillCount} rows`);
  }
  if (recipeLinks.length !== 0 || !html.includes('href="./recipes/"')) {
    throw new Error("The root page must route to Recipes without duplicating Recipe rows in the Skill directory");
  }
  for (const href of skillLinks) {
    await access(path.join(directory, href.slice(2), "index.html"));
  }
  await access(path.join(directory, "recipes", "index.html"));
}

async function validateRecipeIndexes(publicationManifest, directory) {
  const filenames = ["recipes/index.html", "recipes.html"];
  const routeCount = publicationManifest.files
    .map((file) => file.path)
    .filter((filename) => /^recipes\/[^/]+\/index\.html$/.test(filename))
    .length;
  const pages = await Promise.all(filenames.map(async (filename) => ({
    filename,
    html: await readFile(path.join(directory, filename), "utf8"),
  })));
  let expectedSnapshot;
  let expectedLabels;

  for (const { filename, html } of pages) {
    const expectedCount = Number(html.match(/data-recipe-count="(\d+)"/)?.[1]);
    const labels = [...html.matchAll(/aria-label="Open ([^"]+) recipe"/g)].map((match) => match[1]);
    const snapshot = html.match(/data-catalog-snapshot="([^"]+)"/)?.[1];
    if (!Number.isInteger(expectedCount) || labels.length !== expectedCount) {
      throw new Error(`${filename} contains ${labels.length} of ${expectedCount} Recipe rows`);
    }
    if (expectedCount !== routeCount) {
      throw new Error(`${filename} exposes ${expectedCount} rows for ${routeCount} emitted Recipe routes`);
    }
    if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
      throw new Error(`${filename} must contain exactly one primary heading`);
    }
    for (const marker of ["Search recipes", "data-recipe-phase-summary", "https://skills.lab.sa/recipes/"]) {
      if (!html.includes(marker)) throw new Error(`${filename} is missing ${marker}`);
    }
    if (!snapshot) throw new Error(`${filename} is missing its Catalog snapshot identity`);
    if (expectedSnapshot !== undefined && snapshot !== expectedSnapshot) {
      throw new Error("The canonical and compatibility Recipe indexes use different Catalog snapshots");
    }
    if (expectedLabels !== undefined && JSON.stringify(labels) !== JSON.stringify(expectedLabels)) {
      throw new Error("The canonical and compatibility Recipe indexes expose different rows");
    }
    expectedSnapshot = snapshot;
    expectedLabels = labels;
    await validateLocalReferences(html, filename, directory);
  }
}

async function validateSkillPages(publicationManifest, directory) {
  const skillPages = publicationManifest.files
    .map((file) => file.path)
    .filter((filename) => /^skills\/[^/]+\/index\.html$/.test(filename));

  if (skillPages.length === 0) throw new Error("The publication contains no Skill detail pages");
  for (const filename of skillPages) {
    const html = await readFile(path.join(directory, filename), "utf8");
    const slug = filename.split("/")[1];
    if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
      throw new Error(`${filename} must contain exactly one primary heading`);
    }
    if (!html.includes(`npx skills add labdotsa/skills --skill ${slug}`)) {
      throw new Error(`${filename} is missing its Skill-specific install command`);
    }
    for (const marker of ["Skill instructions", "data-rich-document", "Package contents", "Related skills &amp; recipes"]) {
      if (!html.includes(marker)) throw new Error(`${filename} is missing ${marker}`);
    }
    await validateLocalReferences(html, filename, directory);
  }
}

async function validateRecipePages(publicationManifest, directory) {
  const recipePages = publicationManifest.files
    .map((file) => file.path)
    .filter((filename) => /^recipes\/[^/]+\/index\.html$/.test(filename));

  if (recipePages.length === 0) throw new Error("The publication contains no Recipe detail pages");
  let compatibilityModel;
  for (const filename of [...recipePages, "recipe.html"]) {
    const html = await readFile(path.join(directory, filename), "utf8");
    const slug = filename === "recipe.html" ? "functional-prototype" : filename.split("/")[1];
    if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
      throw new Error(`${filename} must contain exactly one primary heading`);
    }
    for (const marker of [
      "data-recipe-page",
      "data-recipe-phase",
      "Recipe contents",
      "Skills used in this Recipe",
      "data-rich-document",
      `https://skills.lab.sa/recipes/${slug}/`,
    ]) {
      if (!html.includes(marker)) throw new Error(`${filename} is missing ${marker}`);
    }
    const snapshot = html.match(/data-catalog-snapshot="([^"]+)"/)?.[1];
    const phases = [...html.matchAll(/data-recipe-phase="([^"]+)"/g)].map((match) => match[1]);
    if (!snapshot || phases.length === 0) throw new Error(`${filename} is missing its typed Recipe model markers`);
    if (slug === "functional-prototype") {
      const model = JSON.stringify({ snapshot, phases });
      if (compatibilityModel !== undefined && model !== compatibilityModel) {
        throw new Error("The canonical and compatibility Recipe pages use different view models");
      }
      compatibilityModel = model;
    }
    await validateLocalReferences(html, filename, directory);
  }
}

async function validateLocalReferences(html, filename, directory) {
  const pageDirectory = path.dirname(path.join(directory, filename));
  const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) continue;
    if (reference.startsWith("/")) throw new Error(`${filename} contains a root-relative local reference`);
    const cleanReference = reference.split(/[?#]/, 1)[0];
    if (!cleanReference) continue;
    const decodedReference = decodeURIComponent(cleanReference);
    let target = path.resolve(pageDirectory, decodedReference);
    if (cleanReference.endsWith("/")) target = path.join(target, "index.html");
    const relativeTarget = path.relative(directory, target);
    if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
      throw new Error(`${filename} contains a local reference outside its publication`);
    }
    await access(target);
  }
}

function expectedCanonicalFor(filename, canonicalOrigin) {
  if (filename === "404.html") return undefined;
  if (filename === "index.html") return `${canonicalOrigin}/`;
  if (filename === "recipes.html" || filename === "recipes/index.html") return `${canonicalOrigin}/recipes/`;
  if (filename === "recipe.html") return `${canonicalOrigin}/recipes/functional-prototype/`;
  const match = filename.match(/^(skills|recipes)\/([^/]+)\/index\.html$/);
  if (match) return `${canonicalOrigin}/${match[1]}/${encodeURIComponent(match[2])}/`;
  throw new Error(`No canonical URL policy exists for emitted HTML file ${filename}`);
}

function isAlias(filename) {
  return filename === "recipes.html" || filename === "recipe.html";
}

function expectedMarkdownAlternateFor(filename, canonicalOrigin) {
  if (filename === "recipe.html") return `${canonicalOrigin}/recipes/functional-prototype/index.md`;
  const match = filename.match(/^(skills|recipes)\/([^/]+)\/index\.html$/);
  return match ? `${canonicalOrigin}/${match[1]}/${encodeURIComponent(match[2])}/index.md` : undefined;
}

function canonicalPublicationOrder(filename) {
  if (filename === "index.html") return 0;
  if (filename.startsWith("skills/")) return 1;
  if (filename === "recipes/index.html") return 2;
  return 3;
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function validatePortablePresentationReferences(html, filename) {
  if (
    /<script[^>]+src=["']https?:\/\//i.test(html) ||
    /<img[^>]+src=["']https?:\/\//i.test(html) ||
    /<link[^>]+rel=["'](?:stylesheet|icon|apple-touch-icon|preload)["'][^>]+href=["']https?:\/\//i.test(html)
  ) {
    throw new Error(`${filename} loads a runtime presentation asset from an external origin`);
  }
  if (/\b(?:src|href)=["']\/(?!\/)/i.test(html)) {
    throw new Error(`${filename} contains a root-relative local URL that can escape a project base`);
  }
}

async function validateMachineSurfaces(currentProfile, publicationManifest, canonicalRecords, allSeoRecords, directory) {
  const manifestPaths = new Set(publicationManifest.files.map((file) => file.path));
  const sitemapPath = path.join(directory, "sitemap.xml");
  const robotsPath = path.join(directory, "robots.txt");
  if (!currentProfile.publishMachineSurfaces) {
    for (const [filename, pathname] of [["sitemap.xml", sitemapPath], ["robots.txt", robotsPath]]) {
      if (manifestPaths.has(filename) || await exists(pathname)) {
        throw new Error(`${currentProfile.name} must omit canonical-only ${filename}`);
      }
    }
  } else {
    if (!manifestPaths.has("sitemap.xml") || !manifestPaths.has("robots.txt")) {
      throw new Error("Canonical publication manifest must include sitemap.xml and robots.txt");
    }
    const sitemap = await readFile(sitemapPath, "utf8");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expectedLocations = canonicalRecords.map((record) => record.canonicalUrl);
    if (new Set(locations).size !== locations.length || JSON.stringify(locations) !== JSON.stringify(expectedLocations)) {
      throw new Error("sitemap.xml must contain each clean canonical URL exactly once in publication order");
    }
    if (/\b(?:lastmod|recipes?\.html)\b/.test(sitemap)) {
      throw new Error("sitemap.xml must omit synthetic lastmod values and compatibility aliases");
    }
    if (Buffer.byteLength(sitemap) > 50 * 1024 * 1024 || locations.length > 50_000) {
      throw new Error("sitemap.xml exceeds protocol limits");
    }
    const robots = await readFile(robotsPath, "utf8");
    const expectedRobots = `User-agent: *\nAllow: /\nSitemap: ${currentProfile.canonicalOrigin}/sitemap.xml\n`;
    if (robots !== expectedRobots || Buffer.byteLength(robots) > 500 * 1024) {
      throw new Error("robots.txt does not match the root-authoritative canonical policy");
    }
  }

  const llmFiles = new Map();
  for (const filename of publicationManifest.files.map((file) => file.path)) {
    if (/^(?:llms(?:-full)?\.txt|skills\.json|recipes\.json|LICENSE\.txt)$/.test(filename)
      || /^(?:skills|recipes)\/.*\.md$/.test(filename)) {
      llmFiles.set(filename, await readFile(path.join(directory, filename)));
    }
  }
  validateLlmPublication({
    profile: currentProfile,
    files: llmFiles,
    htmlAlternates: new Map(allSeoRecords
      .filter((record) => record.alternateUrl)
      .map((record) => [record.filename, record.alternateUrl])),
    repositoryLicense: await readFile(path.join(repositoryRoot, "LICENSE")),
  });
}

async function exists(filename) {
  try {
    await access(filename);
    return true;
  } catch {
    return false;
  }
}
