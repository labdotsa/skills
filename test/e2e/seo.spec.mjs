import { expect, test } from "@playwright/test";

test("prerenders complete social metadata and truthful JSON-LD from the visible page model", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://skills.lab.sa/");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "LAB Skills — public agent protocols and delivery playbooks",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "LAB Skills");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "Agent Skills for Digital Product Teams — LAB Skills",
  );
  const homeGraph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(homeGraph["@graph"].map((node) => node["@type"])).toEqual(["WebSite", "CollectionPage", "ItemList"]);
  expect(homeGraph["@graph"][2].itemListElement).toHaveLength(32);

  await page.goto("/skills/tailwind/");

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://skills.lab.sa/skills/tailwind/",
  );
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/skills/tailwind/index.md",
  );
  const skillGraph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(skillGraph["@graph"].map((node) => node["@type"])).toEqual([
    "WebPage",
    "BreadcrumbList",
    "SoftwareSourceCode",
  ]);
  expect(skillGraph["@graph"][2].name).toBe("tailwind");
  expect(JSON.stringify(skillGraph)).not.toContain('"Recipe"');
});

test("keeps Recipe, alias, backup, and not-found metadata aligned with canonical policy", async ({ page }) => {
  await page.goto("/recipes/");
  const indexGraph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(indexGraph["@graph"].map((node) => node["@type"])).toEqual(["CollectionPage", "ItemList"]);
  expect(indexGraph["@graph"][1].itemListElement[0].url).toBe(
    "https://skills.lab.sa/recipes/functional-prototype/",
  );

  await page.goto("/recipes/functional-prototype/");
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/index.md",
  );
  const canonicalGraph = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(canonicalGraph)["@graph"].map((node) => node["@type"])).toEqual([
    "WebPage",
    "BreadcrumbList",
  ]);

  await page.goto("/recipe.html");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/",
  );
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/index.md",
  );
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toBe(canonicalGraph);

  await page.goto("http://127.0.0.1:4174/skills/recipes/functional-prototype/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/",
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);

  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});

test("serves canonical machine surfaces and the social image only from the intended profile", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toBe("application/xml; charset=utf-8");
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain("https://skills.lab.sa/skills/seo-engine/");
  const canonicalUrls = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const canonicalUrl of canonicalUrls) {
    const page = await request.get(new URL(canonicalUrl).pathname);
    expect(page.status(), canonicalUrl).toBe(200);
    expect(page.headers()["content-type"], canonicalUrl).toBe("text/html; charset=utf-8");
  }

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toBe("text/plain; charset=utf-8");
  expect(await robots.text()).toBe(
    "User-agent: *\nAllow: /\nSitemap: https://skills.lab.sa/sitemap.xml\n",
  );

  const socialImage = await request.get("/brand/social.png");
  expect(socialImage.status()).toBe(200);
  expect(socialImage.headers()["content-type"]).toBe("image/png");

  for (const filename of ["sitemap.xml", "robots.txt"]) {
    const backup = await request.get(`http://127.0.0.1:4174/skills/${filename}`);
    expect(backup.status()).toBe(404);
  }
});
