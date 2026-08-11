import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("serves the complete canonical LLM discovery graph with exact digest agreement", async ({ request }) => {
  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(llms.headers()["content-type"]).toBe("text/plain; charset=utf-8");
  const llmsBody = await llms.text();
  expect(llmsBody).toContain("# LAB Skills\n\n>");

  const skillCatalogResponse = await request.get("/skills.json");
  const recipeCatalogResponse = await request.get("/recipes.json");
  expect(skillCatalogResponse.headers()["content-type"]).toBe("application/json; charset=utf-8");
  expect(recipeCatalogResponse.headers()["content-type"]).toBe("application/json; charset=utf-8");
  const skillCatalog = await skillCatalogResponse.json();
  const recipeCatalog = await recipeCatalogResponse.json();
  expect(skillCatalog.schemaVersion).toBe(2);
  expect(recipeCatalog.schemaVersion).toBe(2);

  for (const item of [...skillCatalog.skills, ...recipeCatalog.recipes]) {
    const markdownPath = new URL(item.markdownUrl).pathname;
    const markdown = await request.get(markdownPath);
    expect(markdown.status(), markdownPath).toBe(200);
    expect(markdown.headers()["content-type"], markdownPath).toBe("text/markdown; charset=utf-8");
    const bytes = await markdown.body();
    expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}`).toBe(item.contentDigest);
    expect(llmsBody.split(item.markdownUrl)).toHaveLength(2);

    const html = await request.get(new URL(item.canonicalUrl).pathname);
    expect(html.status(), item.canonicalUrl).toBe(200);
    expect(await html.text()).toContain(`rel="alternate" type="text/markdown" href="${item.markdownUrl}"`);
  }

  const license = await request.get("/LICENSE.txt");
  expect(license.status()).toBe(200);
  expect(license.headers()["content-type"]).toBe("text/plain; charset=utf-8");
  expect(await license.body()).toEqual(await readFile("LICENSE"));
  expect((await request.get("/llms-full.txt")).status()).toBe(404);
});

test("keeps every LLM machine endpoint out of the Pages-project publication", async ({ request }) => {
  for (const pathname of [
    "llms.txt",
    "llms-full.txt",
    "skills.json",
    "recipes.json",
    "LICENSE.txt",
    "skills/tailwind/index.md",
    "recipes/functional-prototype/index.md",
  ]) {
    const response = await request.get(`http://127.0.0.1:4174/skills/${pathname}`);
    expect(response.status(), pathname).toBe(404);
  }

  const detail = await request.get("http://127.0.0.1:4174/skills/skills/tailwind/");
  expect(detail.status()).toBe(200);
  expect(await detail.text()).toContain(
    'rel="alternate" type="text/markdown" href="https://skills.lab.sa/skills/tailwind/index.md"',
  );
});

test("serves identical public machine content to representative crawler user agents", async ({ request }) => {
  const ordinary = await request.get("/skills/tailwind/index.md");
  for (const userAgent of [
    "OAI-SearchBot",
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "Googlebot",
    "Google-Extended",
    "PerplexityBot",
    "Perplexity-User",
    "CCBot",
    "Applebot",
    "Applebot-Extended",
  ]) {
    const crawler = await request.get("/skills/tailwind/index.md", { headers: { "user-agent": userAgent } });
    expect(crawler.status(), userAgent).toBe(200);
    expect(await crawler.body(), userAgent).toEqual(await ordinary.body());
  }
});
