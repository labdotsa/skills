import path from "node:path";

const acceptedSchemaTypes = new Set([
  "WebSite",
  "CollectionPage",
  "ItemList",
  "ListItem",
  "WebPage",
  "BreadcrumbList",
  "SoftwareSourceCode",
]);

export function validateSeoDocument({
  filename,
  html,
  profile,
  expectedCanonical,
  structuredData,
}) {
  requireCount(filename, "doctype", html.match(/<!doctype html>/gi) ?? [], 1);
  requireCount(filename, "html lang=\"en\"", html.match(/<html\b[^>]*\blang=["']en["'][^>]*>/gi) ?? [], 1);
  requireCount(filename, "UTF-8 charset", selectTags(html, "meta", { charset: "utf-8" }), 1);
  requireCount(filename, "viewport", selectTags(html, "meta", { name: "viewport" }), 1);

  const title = textContent(singleContent(filename, "title", html, /<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/gi));
  const description = attribute(filename, "meta description", singleTag(filename, "meta description", html, "meta", { name: "description" }), "content");
  const robots = attribute(filename, "robots meta", singleTag(filename, "robots meta", html, "meta", { name: "robots" }), "content");
  if (!title) throw new Error(`${filename}: title must be non-empty`);
  if (!description) throw new Error(`${filename}: meta description must be non-empty`);

  const isNotFound = expectedCanonical === undefined;
  const expectedRobots = profile.indexable && !isNotFound ? "index,follow" : "noindex,follow";
  if (robots !== expectedRobots) {
    throw new Error(`${filename}: ${profile.name} profile must emit ${expectedRobots}`);
  }

  const canonicalTags = selectTags(html, "link", { rel: "canonical" });
  let canonicalUrl;
  if (expectedCanonical === undefined) {
    requireCount(filename, "canonical link", canonicalTags, 0);
  } else {
    requireCount(filename, "canonical link", canonicalTags, 1);
    canonicalUrl = attribute(filename, "canonical link", canonicalTags[0], "href");
    if (canonicalUrl !== expectedCanonical) {
      throw new Error(`${filename}: canonical URL ${canonicalUrl} does not match expected ${expectedCanonical}`);
    }
    validateCanonicalUrl(filename, canonicalUrl, profile.canonicalOrigin);
  }

  const requiredOpenGraph = [
    "og:title",
    "og:description",
    "og:type",
    "og:image",
    "og:image:alt",
    "og:site_name",
  ];
  if (expectedCanonical !== undefined) requiredOpenGraph.push("og:url");
  const openGraph = Object.fromEntries(requiredOpenGraph.map((property) => [property, attribute(
    filename,
    property,
    singleTag(filename, property, html, "meta", { property }),
    "content",
  )]));
  const twitter = Object.fromEntries([
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ].map((name) => [name, attribute(
    filename,
    name,
    singleTag(filename, name, html, "meta", { name }),
    "content",
  )]));

  if (openGraph["og:title"] !== title || twitter["twitter:title"] !== title) {
    throw new Error(`${filename}: social titles must match the document title`);
  }
  if (openGraph["og:description"] !== description || twitter["twitter:description"] !== description) {
    throw new Error(`${filename}: social descriptions must match the meta description`);
  }
  if (!new Set(["website", "article"]).has(openGraph["og:type"])) {
    throw new Error(`${filename}: og:type must be website or article`);
  }
  if (expectedCanonical === undefined) {
    requireCount(filename, "og:url", selectTags(html, "meta", { property: "og:url" }), 0);
  } else if (openGraph["og:url"] !== expectedCanonical) {
    throw new Error(`${filename}: og:url must match the expected canonical URL`);
  }
  if (openGraph["og:site_name"] !== "LAB Skills") {
    throw new Error(`${filename}: og:site_name must be LAB Skills`);
  }
  if (!openGraph["og:image:alt"]) throw new Error(`${filename}: og:image:alt must be non-empty`);
  if (twitter["twitter:card"] !== "summary_large_image") {
    throw new Error(`${filename}: twitter:card must be summary_large_image`);
  }
  validateSocialImage(filename, openGraph["og:image"], profile.canonicalOrigin);
  if (twitter["twitter:image"] !== openGraph["og:image"]) {
    throw new Error(`${filename}: Twitter and Open Graph images must match`);
  }

  requireCount(filename, "main landmark", html.match(/<main(?:\s|>)/gi) ?? [], 1);
  if (!(html.match(/<header(?:\s|>)/gi) ?? []).length) throw new Error(`${filename}: header landmark is missing`);
  if (!(html.match(/<footer(?:\s|>)/gi) ?? []).length) throw new Error(`${filename}: footer landmark is missing`);
  if (!(html.match(/<nav(?:\s|>)/gi) ?? []).length) throw new Error(`${filename}: navigation landmark is missing`);
  const headings = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)];
  requireCount(filename, "h1", headings, 1);
  if (!textContent(headings[0][1])) throw new Error(`${filename}: h1 must be descriptive`);

  const links = selectTags(html, "a");
  if (links.length === 0) throw new Error(`${filename}: at least one crawlable link is required`);
  for (const link of links) {
    const href = tagAttributes(link).href;
    if (href === undefined || href.length === 0) throw new Error(`${filename}: every anchor must have an href`);
    if (/^(?:javascript|data|vbscript|file):/i.test(href)) {
      throw new Error(`${filename}: unsafe anchor href ${href}`);
    }
  }

  const jsonLdTags = selectTags(html, "script", { type: "application/ld+json" }, true);
  let schemaTypes = [];
  if (structuredData === "forbidden") {
    requireCount(filename, "JSON-LD graph", jsonLdTags, 0);
  } else {
    requireCount(filename, "JSON-LD graph", jsonLdTags, 1);
    let graph;
    try {
      graph = JSON.parse(jsonLdTags[0].content);
    } catch (error) {
      throw new Error(`${filename}: JSON-LD must be valid JSON`, { cause: error });
    }
    if (graph?.["@context"] !== "https://schema.org" || !Array.isArray(graph?.["@graph"]) || graph["@graph"].length === 0) {
      throw new Error(`${filename}: JSON-LD must contain a non-empty schema.org @graph`);
    }
    schemaTypes = collectSchemaTypes(graph);
    for (const type of schemaTypes) {
      if (type === "Recipe") throw new Error(`${filename}: forbidden schema type Recipe`);
      if (!acceptedSchemaTypes.has(type)) throw new Error(`${filename}: unaccepted schema type ${type}`);
    }
    for (const value of collectUrlValues(graph)) {
      if (/^(?:javascript|data|vbscript|file):/i.test(value)) {
        throw new Error(`${filename}: unsafe structured-data URL ${value}`);
      }
    }
  }

  return Object.freeze({
    filename,
    title,
    description,
    canonicalUrl,
    schemaTypes: Object.freeze(schemaTypes),
    links: Object.freeze(links.map((link) => tagAttributes(link).href)),
  });
}

export function validateUniqueCanonicalMetadata(records) {
  assertUnique(records, "title");
  assertUnique(records, "description");
}

export function validateCanonicalLinkGraph(records) {
  const recordByFilename = new Map(records.map((record) => [record.filename, record]));
  const cleanFilenames = new Set(records
    .filter((record) => record.filename !== "404.html" && !isAlias(record.filename))
    .map((record) => record.filename));
  const adjacency = new Map([...cleanFilenames].map((filename) => [filename, new Set()]));

  for (const record of records) {
    for (const href of record.links) {
      const target = localHtmlTarget(record.filename, href);
      if (target === undefined || !recordByFilename.has(target)) continue;
      if (isAlias(target)) throw new Error(`${record.filename} links to compatibility alias ${target}`);
      if (cleanFilenames.has(record.filename) && cleanFilenames.has(target)) adjacency.get(record.filename).add(target);
    }
  }

  const depth = new Map([["index.html", 0]]);
  const queue = ["index.html"];
  for (const filename of queue) {
    for (const target of adjacency.get(filename) ?? []) {
      if (depth.has(target)) continue;
      depth.set(target, depth.get(filename) + 1);
      queue.push(target);
    }
  }
  for (const filename of cleanFilenames) {
    if (!depth.has(filename)) throw new Error(`${filename} is unreachable from the canonical home page`);
    if (depth.get(filename) > 2) throw new Error(`${filename} is more than two crawlable links from home`);
  }
}

function assertUnique(records, field) {
  const firstOwner = new Map();
  for (const record of records) {
    const previous = firstOwner.get(record[field]);
    if (previous) {
      throw new Error(`Duplicate canonical ${field}: ${previous} and ${record.filename}`);
    }
    firstOwner.set(record[field], record.filename);
  }
}

function isAlias(filename) {
  return filename === "recipes.html" || filename === "recipe.html";
}

function localHtmlTarget(filename, href) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return undefined;
  const cleanHref = href.split(/[?#]/, 1)[0];
  if (!cleanHref) return filename;
  let target = path.posix.normalize(path.posix.join(path.posix.dirname(filename), decodeURIComponent(cleanHref)));
  if (cleanHref.endsWith("/") || target === ".") target = path.posix.join(target, "index.html");
  return target;
}

function validateCanonicalUrl(filename, value, canonicalOrigin) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error(`${filename}: canonical URL must be an absolute URL`, { cause: error });
  }
  if (url.origin !== canonicalOrigin || url.protocol !== "https:" || url.search || url.hash) {
    throw new Error(`${filename}: canonical URL must be clean HTTPS on ${canonicalOrigin}`);
  }
  if (url.pathname !== "/" && !url.pathname.endsWith("/")) {
    throw new Error(`${filename}: canonical URL must use the accepted trailing slash`);
  }
}

function validateSocialImage(filename, value, canonicalOrigin) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error(`${filename}: social image must be an absolute URL`, { cause: error });
  }
  if (url.protocol !== "https:" || url.origin !== canonicalOrigin) {
    throw new Error(`${filename}: social image must use the canonical HTTPS origin`);
  }
}

function collectSchemaTypes(value, result = []) {
  if (Array.isArray(value)) {
    for (const entry of value) collectSchemaTypes(entry, result);
  } else if (value && typeof value === "object") {
    if (typeof value["@type"] === "string") result.push(value["@type"]);
    for (const entry of Object.values(value)) collectSchemaTypes(entry, result);
  }
  return [...new Set(result)];
}

function collectUrlValues(value, key, result = []) {
  if (Array.isArray(value)) {
    for (const entry of value) collectUrlValues(entry, key, result);
  } else if (value && typeof value === "object") {
    for (const [entryKey, entryValue] of Object.entries(value)) collectUrlValues(entryValue, entryKey, result);
  } else if (typeof value === "string" && ["@id", "url", "item", "codeRepository"].includes(key)) {
    result.push(value);
  }
  return result;
}

function singleTag(filename, label, html, tagName, expectedAttributes) {
  const tags = selectTags(html, tagName, expectedAttributes);
  requireCount(filename, label, tags, 1);
  return tags[0];
}

function singleContent(filename, label, html, pattern) {
  const matches = [...html.matchAll(pattern)];
  requireCount(filename, label, matches, 1);
  return matches[0][1];
}

function requireCount(filename, label, values, expected) {
  if (values.length !== expected) {
    throw new Error(`${filename}: ${label} must appear exactly ${expected === 1 ? "once" : `${expected} times`} (found ${values.length})`);
  }
}

function selectTags(html, tagName, expectedAttributes = {}, withContent = false) {
  const pattern = withContent
    ? new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, "gi")
    : new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return [...html.matchAll(pattern)]
    .map((match) => withContent ? { tag: match[0], attributes: match[1], content: match[2] } : match[0])
    .filter((entry) => {
      const attributes = tagAttributes(withContent ? entry.attributes : entry);
      return Object.entries(expectedAttributes).every(([name, value]) => attributes[name] === value);
    });
}

function tagAttributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map((match) => [
    match[1].toLowerCase(),
    decodeHtml(match[3]),
  ]));
}

function attribute(filename, label, tag, name) {
  const value = tagAttributes(tag)[name];
  if (value === undefined) throw new Error(`${filename}: ${label} must have a ${name} attribute`);
  return value;
}

function textContent(value) {
  return decodeHtml(value.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "")).trim();
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
