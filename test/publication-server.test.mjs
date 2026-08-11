import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createPublicationServer } from "../scripts/lib/publication-server.mjs";

async function fixture(context, options = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "lab-skills-publication-"));
  await mkdir(path.join(root, "nested"));
  await writeFile(path.join(root, "index.html"), "<h1>Home</h1>");
  await writeFile(path.join(root, "nested", "index.html"), "<h1>Nested</h1>");
  await writeFile(path.join(root, "nested", "index.md"), "# Nested source\n");
  await writeFile(path.join(root, "404.html"), "<h1>Missing</h1>");
  const server = createPublicationServer({ rootDirectory: root, ...options });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  context.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));
  return `http://127.0.0.1:${server.address().port}`;
}

test("serves prerendered directory routes", async (context) => {
  const origin = await fixture(context);
  const response = await fetch(`${origin}/nested/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Nested/);
});

test("returns the prerendered 404 surface with an HTTP 404", async (context) => {
  const origin = await fixture(context);
  const response = await fetch(`${origin}/missing`);
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Missing/);
});

test("serves exact Markdown representations identically to ordinary and crawler user agents", async (context) => {
  const origin = await fixture(context);
  const ordinary = await fetch(`${origin}/nested/index.md`);
  const crawler = await fetch(`${origin}/nested/index.md`, { headers: { "user-agent": "OAI-SearchBot" } });

  assert.equal(ordinary.status, 200);
  assert.equal(ordinary.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(await ordinary.text(), "# Nested source\n");
  assert.equal(crawler.status, 200);
  assert.equal(await crawler.text(), "# Nested source\n");
});

test("mounts a Pages publication at its project base without exposing it at root", async (context) => {
  const origin = await fixture(context, { basePath: "/skills" });
  const mounted = await fetch(`${origin}/skills/nested/`);
  const unmounted = await fetch(`${origin}/nested/`);

  assert.equal(mounted.status, 200);
  assert.match(await mounted.text(), /Nested/);
  assert.equal(unmounted.status, 404);
});
