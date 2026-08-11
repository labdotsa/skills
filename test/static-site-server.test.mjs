import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createStaticSiteServer } from "../scripts/lib/static-site-server.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function startServer() {
  const server = createStaticSiteServer({ rootDirectory: path.join(repositoryRoot, "site") });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

test("serves the generated Discovery Site home page over HTTP", async (context) => {
  const { server, origin } = await startServer();
  context.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));

  const response = await fetch(`${origin}/`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(html, /<h1 id="page-title">Working knowledge,/);
});

test("serves a generated Skill directory through its public deep link", async (context) => {
  const { server, origin } = await startServer();
  context.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));

  const response = await fetch(`${origin}/skills/tailwind/`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<h1>tailwind<\/h1>/);
});

test("serves the generated not-found surface with a 404 status", async (context) => {
  const { server, origin } = await startServer();
  context.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));

  const response = await fetch(`${origin}/missing-route`);
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(html, /<h1 id="page-title">Working knowledge,/);
});
