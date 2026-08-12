const representativeFiles = Object.freeze({
  home: "index.html",
  recipeIndex: "recipes/index.html",
  notFound: "404.html",
});

export function representativeRoutes(files, basePath) {
  if (basePath !== "" && !/^\/[a-z0-9-]+$/.test(basePath)) {
    throw new Error(`Invalid publication base path: ${basePath}`);
  }
  for (const filename of Object.values(representativeFiles)) requireHtml(files, filename);

  const largestSkill = largestRenderedDocument(files, /^skills\/[^/]+\/index\.html$/);
  const largestRecipe = largestRenderedDocument(files, /^recipes\/[^/]+\/index\.html$/);
  const route = (filename) => `${basePath}/${filename.replace(/index\.html$/, "")}`;

  return Object.freeze([
    routeRecord("home", representativeFiles.home, `${basePath}/`),
    routeRecord("skill", largestSkill, route(largestSkill)),
    routeRecord("recipe-index", representativeFiles.recipeIndex, route(representativeFiles.recipeIndex)),
    routeRecord("recipe", largestRecipe, route(largestRecipe)),
    routeRecord("not-found", representativeFiles.notFound, `${basePath}/__quality-not-found__`),
  ]);
}

function largestRenderedDocument(files, pattern) {
  const candidates = [...files]
    .filter(([filename]) => pattern.test(filename))
    .map(([filename, html]) => ({ filename, length: renderedText(html).length }))
    .sort((left, right) => right.length - left.length || compareCodePoints(left.filename, right.filename));
  if (candidates.length === 0) throw new Error(`No representative route matches ${pattern}`);
  return candidates[0].filename;
}

function renderedText(html) {
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(?:script|style|template|svg)\b[^>]*>[\s\S]*?<\/(?:script|style|template|svg)>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ({
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      nbsp: " ",
    })[name])
    .replace(/\s+/g, " ")
    .trim();
}

function requireHtml(files, filename) {
  if (!files.has(filename)) throw new Error(`Missing representative route ${filename}`);
}

function routeRecord(id, filename, pathname) {
  return Object.freeze({ id, filename, pathname });
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
