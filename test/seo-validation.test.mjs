import assert from "node:assert/strict";
import test from "node:test";

const canonicalProfile = {
  name: "canonical",
  indexable: true,
  canonicalOrigin: "https://skills.lab.sa",
};

const canonical = "https://skills.lab.sa/skills/example/";
const validHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Example — LAB Skills</title>
    <meta name="description" content="Complete example instructions.">
    <meta name="robots" content="index,follow">
    <meta property="og:title" content="Example — LAB Skills">
    <meta property="og:description" content="Complete example instructions.">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://skills.lab.sa/brand/social.png">
    <meta property="og:image:alt" content="LAB Skills preview">
    <meta property="og:site_name" content="LAB Skills">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Example — LAB Skills">
    <meta name="twitter:description" content="Complete example instructions.">
    <meta name="twitter:image" content="https://skills.lab.sa/brand/social.png">
    <link rel="canonical" href="${canonical}">
    <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","url":"${canonical}"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"LAB Skills"}]}]}</script>
  </head>
  <body><header><nav><a href="../../">Skills</a></nav></header><main><h1>Example</h1></main><footer>LAB</footer></body>
</html>`;

test("validates a complete canonical document and returns its normalized SEO record", async () => {
  const { validateSeoDocument } = await import("../scripts/lib/seo-validation.mjs");
  const record = validateSeoDocument({
    filename: "skills/example/index.html",
    html: validHtml,
    profile: canonicalProfile,
    expectedCanonical: canonical,
    structuredData: "required",
  });

  assert.equal(record.title, "Example — LAB Skills");
  assert.equal(record.description, "Complete example instructions.");
  assert.equal(record.canonicalUrl, canonical);
  assert.deepEqual(record.schemaTypes, ["WebPage", "BreadcrumbList", "ListItem"]);
});

test("rejects missing, duplicated, invalid, unsafe, and profile-inconsistent SEO", async () => {
  const { validateSeoDocument } = await import("../scripts/lib/seo-validation.mjs");
  const validate = (html, overrides = {}) => validateSeoDocument({
    filename: "skills/example/index.html",
    html,
    profile: canonicalProfile,
    expectedCanonical: canonical,
    structuredData: "required",
    ...overrides,
  });

  assert.throws(() => validate(validHtml.replace(/<meta name="description"[^>]+>/, "")), /description.*exactly once/i);
  assert.throws(() => validate(validHtml.replace("</title>", "</title><title>Duplicate</title>")), /title.*exactly once/i);
  assert.throws(() => validate(validHtml.replaceAll(canonical, "http://example.test/unsafe/")), /canonical.*expected/i);
  assert.throws(() => validate(validHtml.replace("../../\">Skills", "javascript:alert(1)\">Skills")), /unsafe.*href/i);
  assert.throws(() => validate(validHtml.replace("<main>", "<div>")), /main landmark/i);
  assert.throws(() => validate(validHtml.replace("index,follow", "noindex,follow")), /canonical profile.*index,follow/i);
  assert.throws(() => validate(validHtml.replace('"WebPage"', '"Recipe"')), /forbidden schema type/i);
  assert.throws(() => validate(validHtml.replace('"@context"', '"broken":')), /valid JSON/i);

  const backupProfile = { ...canonicalProfile, name: "preview", indexable: false };
  assert.throws(() => validate(validHtml, { profile: backupProfile }), /preview.*noindex,follow/i);
});

test("rejects duplicate canonical titles and descriptions across clean routes", async () => {
  const { validateUniqueCanonicalMetadata } = await import("../scripts/lib/seo-validation.mjs");
  const first = { filename: "index.html", title: "Repeated", description: "Repeated summary", canonicalUrl: "https://skills.lab.sa/" };
  const second = { filename: "skills/example/index.html", title: "Repeated", description: "Repeated summary", canonicalUrl: canonical };

  assert.throws(() => validateUniqueCanonicalMetadata([first, second]), /duplicate canonical title/i);
  assert.throws(
    () => validateUniqueCanonicalMetadata([first, { ...second, title: "Unique" }]),
    /duplicate canonical description/i,
  );
});

test("rejects unreachable clean routes and navigation to compatibility aliases", async () => {
  const { validateCanonicalLinkGraph } = await import("../scripts/lib/seo-validation.mjs");
  const home = { filename: "index.html", links: ["./skills/example/"] };
  const skill = { filename: "skills/example/index.html", links: ["../../"] };
  const alias = { filename: "recipe.html", links: ["./"] };

  assert.doesNotThrow(() => validateCanonicalLinkGraph([home, skill, alias]));
  assert.throws(() => validateCanonicalLinkGraph([{ ...home, links: [] }, skill, alias]), /unreachable from.*home/i);
  assert.throws(
    () => validateCanonicalLinkGraph([{ ...home, links: ["./recipe.html"] }, skill, alias]),
    /links to compatibility alias/i,
  );
});
