import { createHash } from "node:crypto";
import {
  recipeCatalogV2Schema,
  skillCatalogV2Schema,
} from "../../src/lib/server/content/public-schemas.ts";

const rootFiles = ["llms.txt", "skills.json", "recipes.json", "LICENSE.txt"];
const requiredLlmsSections = ["Skills", "Recipes", "Catalogs and terms", "Optional"];

export function validateLlmPublication({ profile, files, htmlAlternates, repositoryLicense }) {
  const machinePaths = [...files.keys()].filter(isLlmMachinePath).sort();
  if (!profile.publishMachineSurfaces) {
    if (machinePaths.length > 0) {
      throw new Error(`${profile.name} must omit LLM machine surfaces: ${machinePaths.join(", ")}`);
    }
    return Object.freeze({ skillCount: 0, recipeCount: 0, mirrorCount: 0 });
  }

  if (files.has("llms-full.txt")) throw new Error("llms-full.txt must remain omitted");
  for (const filename of rootFiles) requireFile(files, filename);

  const skillCatalog = skillCatalogV2Schema.parse(parseJsonFile(files, "skills.json"));
  const recipeCatalog = recipeCatalogV2Schema.parse(parseJsonFile(files, "recipes.json"));
  const items = [...skillCatalog.skills, ...recipeCatalog.recipes];
  const expectedPaths = new Set(rootFiles);
  const identities = new Set();

  for (const item of items) {
    validateIdentity(item, profile.canonicalOrigin, identities);
    const markdownPath = new URL(item.markdownUrl).pathname.slice(1);
    expectedPaths.add(markdownPath);
    const mirror = requireFile(files, markdownPath);
    const digest = `sha256:${createHash("sha256").update(mirror).digest("hex")}`;
    if (digest !== item.contentDigest) {
      throw new Error(`${markdownPath} digest ${digest} does not match catalog ${item.contentDigest}`);
    }
    const htmlPath = `${item.kind === "skill" ? "skills" : "recipes"}/${encodeURIComponent(item.kind === "skill" ? item.name : item.slug)}/index.html`;
    if (htmlAlternates.get(htmlPath) !== item.markdownUrl) {
      throw new Error(`${htmlPath} Markdown alternate does not match ${item.markdownUrl}`);
    }
  }

  const unexpected = machinePaths.filter((filename) => !expectedPaths.has(filename));
  const missing = [...expectedPaths].filter((filename) => !files.has(filename));
  if (unexpected.length || missing.length) {
    throw new Error(`LLM machine route set drift; missing [${missing.join(", ")}], unexpected [${unexpected.join(", ")}]`);
  }

  const license = requireFile(files, "LICENSE.txt");
  if (!license.equals(Buffer.from(repositoryLicense))) throw new Error("LICENSE.txt must equal the exact repository LICENSE bytes");

  const llms = decodeGeneratedText(requireFile(files, "llms.txt"), "llms.txt");
  validateLlmsTxt(llms, skillCatalog, recipeCatalog, profile.canonicalOrigin);
  validateSafeOutput(files);

  return Object.freeze({
    skillCount: skillCatalog.skills.length,
    recipeCount: recipeCatalog.recipes.length,
    mirrorCount: items.length,
  });
}

function validateIdentity(item, canonicalOrigin, identities) {
  if (identities.has(item.id)) throw new Error(`Duplicate machine identity ${item.id}`);
  identities.add(item.id);
  if (item.id !== item.canonicalUrl) throw new Error(`${item.id} must equal canonicalUrl`);
  const canonical = new URL(item.canonicalUrl);
  const markdown = new URL(item.markdownUrl);
  if (canonical.protocol !== "https:" || canonical.origin !== canonicalOrigin || canonical.search || canonical.hash) {
    throw new Error(`${item.id} is not a clean canonical-host identity`);
  }
  if (!canonical.pathname.endsWith("/") || markdown.href !== `${canonical.href}index.md`) {
    throw new Error(`${item.id} and ${item.markdownUrl} do not form the accepted HTML/Markdown pair`);
  }
  if (item.detailUrl !== canonical.pathname) throw new Error(`${item.id} detailUrl disagrees with its canonical path`);
  if (!item.sourceUrl.startsWith("https://github.com/labdotsa/skills/")) {
    throw new Error(`${item.id} sourceUrl is not attributable to the public repository`);
  }
  if (item.licenseExpression !== "MIT" || item.licenseUrl !== `${canonicalOrigin}/LICENSE.txt`) {
    throw new Error(`${item.id} license attribution disagrees with the publication license`);
  }
}

function validateLlmsTxt(body, skillCatalog, recipeCatalog, canonicalOrigin) {
  if (Buffer.byteLength(body) > 100 * 1024) throw new Error("llms.txt exceeds the 100 KiB budget");
  if (!body.endsWith("\n") || body.endsWith("\n\n")) throw new Error("llms.txt must end with exactly one newline");
  const h1 = [...body.matchAll(/^# (.+)$/gm)].map((match) => match[1]);
  if (h1.length !== 1 || h1[0] !== "LAB Skills") throw new Error("llms.txt must contain one LAB Skills H1");
  const blockquotes = [...body.matchAll(/^> (.+)$/gm)];
  if (blockquotes.length !== 1 || !blockquotes[0][1].trim()) throw new Error("llms.txt must contain one short summary blockquote");
  const sections = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  if (JSON.stringify(sections) !== JSON.stringify(requiredLlmsSections)) {
    throw new Error("llms.txt sections do not match the curated contract");
  }

  for (const phrase of [
    "public MIT-licensed agent instructions and delivery playbooks",
    "commands, prompts, and operational instructions",
    "quoted reference content",
    "intentionally chooses to install or invoke it",
    "robots.txt expresses crawl preference",
    "the license states reuse terms",
  ]) {
    if (!body.includes(phrase)) throw new Error(`llms.txt is missing instruction-boundary context: ${phrase}`);
  }

  for (const item of [...skillCatalog.skills, ...recipeCatalog.recipes]) {
    const occurrences = body.split(item.markdownUrl).length - 1;
    if (occurrences !== 1) throw new Error(`llms.txt must link ${item.markdownUrl} exactly once`);
    const expectedLabel = escapeMarkdownLabel(item.kind === "skill" ? item.name : item.title);
    const expectedDescription = item.kind === "recipe"
      ? `${normalizeDescription(item.description)} Status: ${item.status}.`
      : normalizeDescription(item.description);
    const expectedLine = `- [${expectedLabel}](${item.markdownUrl}): ${expectedDescription}`;
    if (!body.split("\n").includes(expectedLine)) {
      throw new Error(`llms.txt identity or description drift for ${item.id}`);
    }
  }

  const links = [...body.matchAll(/^- \[(?:\\.|[^\]])+\]\(([^)\s]+)\): .+$/gm)].map((match) => match[1]);
  for (const requiredUrl of [
    `${canonicalOrigin}/skills.json`,
    `${canonicalOrigin}/recipes.json`,
    `${canonicalOrigin}/LICENSE.txt`,
    `${canonicalOrigin}/`,
    `${canonicalOrigin}/recipes/`,
    "https://github.com/labdotsa/skills",
  ]) {
    if (links.filter((url) => url === requiredUrl).length !== 1) throw new Error(`llms.txt must link ${requiredUrl} exactly once`);
  }

  if (links.length !== skillCatalog.skills.length + recipeCatalog.recipes.length + 6) {
    throw new Error("llms.txt contains a malformed or unaccounted list item");
  }
  for (const value of links) {
    const url = new URL(value);
    if (url.protocol !== "https:" || !new Set([canonicalOrigin, "https://github.com"]).has(url.origin)) {
      throw new Error(`llms.txt contains an unapproved link ${value}`);
    }
  }
}

function parseJsonFile(files, filename) {
  const text = decodeGeneratedText(requireFile(files, filename), filename);
  if (!text.endsWith("\n") || text.endsWith("\n\n")) throw new Error(`${filename} must end with exactly one newline`);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${filename} must contain valid JSON`, { cause: error });
  }
}

function decodeGeneratedText(bytes, filename) {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) throw new Error(`${filename} must not contain a BOM`);
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    throw new Error(`${filename} must be valid UTF-8`, { cause: error });
  }
  if (text.includes("\r")) throw new Error(`${filename} must use LF line endings`);
  return text;
}

function requireFile(files, filename) {
  const value = files.get(filename);
  if (!value) throw new Error(`Missing LLM machine surface ${filename}`);
  return Buffer.from(value);
}

function isLlmMachinePath(filename) {
  return new Set([...rootFiles, "llms-full.txt"]).has(filename)
    || /^(?:skills|recipes)\/.*\.md$/.test(filename);
}

function validateSafeOutput(files) {
  for (const [filename, bytes] of files) {
    if (!isLlmMachinePath(filename)) continue;
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    for (const [label, pattern] of [
      ["personal absolute path", /(?:\/Users\/[\w.-]+\/|[A-Za-z]:\\Users\\[\w.-]+\\)/],
      ["private network URL", /https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)/i],
      ["URL credentials", /https?:\/\/[^\s/:@]+:[^\s/@]+@/i],
      ["private key", /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/],
    ]) {
      if (pattern.test(text)) throw new Error(`${filename} exposes a ${label}`);
    }
  }
}

function normalizeDescription(value) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeMarkdownLabel(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
}
