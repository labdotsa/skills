import assert from "node:assert/strict";
import test from "node:test";
import { createContentFixture } from "./helpers/content-fixture.mjs";

test("projects the exact canonical sitemap and root robots policy from one Catalog snapshot", async () => {
  const { buildCatalogSnapshot } = await import("../src/lib/server/content/build-catalog.server.ts");
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");
  const { createSeoPublication } = await import("../src/lib/server/seo/publication.ts");
  const repositoryRoot = await createContentFixture();
  const snapshot = await buildCatalogSnapshot({ repositoryRoot });

  const canonical = createSeoPublication(snapshot, publicationProfile("canonical"));
  const sitemap = canonical.get("sitemap.xml");
  const robots = canonical.get("robots.txt");

  assert.equal(canonical.size, 2);
  assert.equal(sitemap.contentType, "application/xml; charset=utf-8");
  assert.deepEqual([...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]), [
    "https://skills.lab.sa/",
    "https://skills.lab.sa/skills/example/",
    "https://skills.lab.sa/recipes/",
    "https://skills.lab.sa/recipes/example/",
  ]);
  assert.doesNotMatch(sitemap.body, /recipes?\.html|lastmod/);
  assert.equal(
    robots.body,
    "User-agent: *\nAllow: /\nSitemap: https://skills.lab.sa/sitemap.xml\n",
  );
  assert.equal(robots.contentType, "text/plain; charset=utf-8");
  assert.equal(Object.isFrozen(sitemap), true);

  for (const profile of ["preview", "pages-project", "pages-root"]) {
    assert.equal(createSeoPublication(snapshot, publicationProfile(profile)).size, 0);
  }
});
