import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parse } from "smol-toml";
import {
  createNetlifyDeployRecord,
  materializeNetlifyPublication,
  resolveNetlifyPublication,
} from "../scripts/lib/netlify-deployment.mjs";
import { smokeNetlifyHttp } from "../scripts/lib/netlify-smoke.mjs";

const revision = "963bf7091fea024c782868a3bc983ea77c0b57d1";
const lockfileDigest = "a".repeat(64);

test("Netlify selects one locked root publication profile for every deploy context", async () => {
  const config = parse(await readFile("netlify.toml", "utf8"));
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));

  assert.deepEqual(config.build, {
    command: "npm ci && npm run netlify:build",
    publish: "site",
    environment: {
      NODE_VERSION: "24.19.0",
      NPM_VERSION: "11.17.0",
    },
  });
  assert.deepEqual(config.context, {
    production: { environment: { PUBLICATION_PROFILE: "canonical" } },
    "deploy-preview": { environment: { PUBLICATION_PROFILE: "preview" } },
    "branch-deploy": { environment: { PUBLICATION_PROFILE: "preview" } },
  });
  assert.equal(config.redirects, undefined, "static deep routes and 404 must not use redirects or rewrites");
  assert.equal(config.functions, undefined, "the shared static architecture must not ship Netlify Functions");
  assert.equal(config.edge_functions, undefined, "the shared static architecture must not ship Edge Functions");
  assert.equal(packageJson.scripts["netlify:build"], "npm run validate:netlify && node scripts/build-netlify.mjs");
  assert.equal(packageJson.scripts["netlify:smoke"], "node scripts/smoke-netlify.mjs");
});

test("Netlify serves immutable assets and revalidated public machine surfaces", async () => {
  const config = parse(await readFile("netlify.toml", "utf8"));
  const rules = Object.fromEntries(config.headers.map((rule) => [rule.for, rule.values]));
  const machineHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=0, must-revalidate",
    "X-Robots-Tag": "noindex",
  };

  assert.equal(new Set(config.headers.map((rule) => rule.for)).size, config.headers.length);
  assert.deepEqual(rules["/_app/immutable/*"], {
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  assert.deepEqual(rules["/llms.txt"], {
    ...machineHeaders,
    "Content-Type": "text/plain; charset=utf-8",
  });
  assert.deepEqual(rules["/LICENSE.txt"], rules["/llms.txt"]);
  assert.deepEqual(rules["/skills.json"], {
    ...machineHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  assert.deepEqual(rules["/recipes.json"], rules["/skills.json"]);
  assert.deepEqual(rules["/skills/*/index.md"], {
    ...machineHeaders,
    "Content-Type": "text/markdown; charset=utf-8",
  });
  assert.deepEqual(rules["/recipes/*/index.md"], rules["/skills/*/index.md"]);

  for (const [route, contentType] of [
    ["/robots.txt", "text/plain; charset=utf-8"],
    ["/sitemap.xml", "application/xml; charset=utf-8"],
  ]) {
    assert.deepEqual(rules[route], {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": contentType,
    });
  }
  assert.equal(rules["/*"], undefined, "production HTML must not receive a global noindex header");
});

test("Netlify rejects a deploy context and publication profile that disagree", () => {
  assert.equal(resolveNetlifyPublication("production", "canonical"), "canonical");
  assert.equal(resolveNetlifyPublication("deploy-preview", "preview"), "preview");
  assert.equal(resolveNetlifyPublication("branch-deploy", "preview"), "preview");
  assert.throws(() => resolveNetlifyPublication("production", "preview"), /production.*canonical/i);
  assert.throws(() => resolveNetlifyPublication("deploy-preview", "canonical"), /deploy-preview.*preview/i);
  assert.throws(() => resolveNetlifyPublication("dev", "preview"), /unsupported Netlify context/i);
});

test("Netlify records immutable validation and publication provenance", () => {
  const publicationManifest = {
    schemaVersion: 1,
    sourceRevision: revision,
    workingTreeDirty: false,
    packageLockSha256: lockfileDigest,
    profile: {
      name: "preview",
      base: "",
      canonicalOrigin: "https://skills.lab.sa",
      indexable: false,
      publishMachineSurfaces: false,
    },
    files: [
      { path: "index.html", bytes: 12_000, sha256: "b".repeat(64) },
      { path: "skills/tailwind/index.html", bytes: 18_000, sha256: "c".repeat(64) },
      { path: "_app/immutable/app.js", bytes: 4_000, sha256: "d".repeat(64) },
    ],
  };
  const record = createNetlifyDeployRecord({
    publicationManifest,
    context: "deploy-preview",
    configuredProfile: "preview",
    commitRef: revision,
    deployId: "deploy-123",
    deployUrl: "https://deploy-123--skills-lab-sa.netlify.app",
    generatedAt: "2026-08-12T02:00:00.000Z",
  });

  assert.deepEqual(record, {
    schemaVersion: 1,
    provider: "netlify",
    generatedAt: "2026-08-12T02:00:00.000Z",
    context: "deploy-preview",
    providerDeployId: "deploy-123",
    providerDeploymentUrl: "https://deploy-123--skills-lab-sa.netlify.app/",
    sourceRevision: revision,
    packageLockSha256: lockfileDigest,
    profile: publicationManifest.profile,
    validation: { command: "npm run validate:netlify", status: "pass" },
    routes: ["index.html", "skills/tailwind/index.html"],
    files: publicationManifest.files,
  });
  assert.throws(
    () => createNetlifyDeployRecord({
      publicationManifest,
      context: "deploy-preview",
      configuredProfile: "preview",
      commitRef: "e".repeat(40),
      deployId: "deploy-123",
      deployUrl: "https://deploy-123--skills-lab-sa.netlify.app",
      generatedAt: "2026-08-12T02:00:00.000Z",
    }),
    /source revision.*commit/i,
  );
});

test("Netlify materializes only the validated staged artifact into the legacy publish directory", async () => {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), "netlify-publication-"));
  const staged = path.join(repositoryRoot, ".artifacts/netlify-publication");
  const published = path.join(repositoryRoot, "site");
  const body = "<!doctype html><h1>New publication</h1>\n";
  const publicationManifest = {
    files: [{ path: "index.html", bytes: Buffer.byteLength(body), sha256: createHash("sha256").update(body).digest("hex") }],
  };
  try {
    await mkdir(staged, { recursive: true });
    await mkdir(published, { recursive: true });
    await writeFile(path.join(staged, "index.html"), body);
    await writeFile(path.join(staged, "publication-manifest.json"), `${JSON.stringify(publicationManifest)}\n`);
    await writeFile(path.join(published, "stale.js"), "legacy");

    const result = await materializeNetlifyPublication({ repositoryRoot, publicationManifest });

    assert.deepEqual(result, { publishDirectory: published, filesMaterialized: 1 });
    assert.equal(await readFile(path.join(published, "index.html"), "utf8"), body);
    assert.equal(JSON.parse(await readFile(path.join(published, "publication-manifest.json"), "utf8")).files.length, 1);
    await assert.rejects(access(path.join(published, "stale.js")), { code: "ENOENT" });
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});

test("Netlify smoke proves the canonical artifact and machine responses over public HTTP", async () => {
  const fixture = netlifyFixture("canonical");
  const report = await smokeNetlifyHttp({
    origin: "https://deploy-123--skills-lab-sa.netlify.app",
    profile: "canonical",
    expectedSourceRevision: revision,
    fetchImpl: fixture.fetch,
  });

  assert.deepEqual(report, {
    origin: "https://deploy-123--skills-lab-sa.netlify.app/",
    profile: "canonical",
    sourceRevision: revision,
    filesVerified: fixture.manifest.files.length,
    htmlRoutesVerified: 5,
    machineRoutesVerified: 8,
    crawlerAgentsVerified: 13,
  });
  assert.equal(fixture.requests.some((request) => request.pathname === "/__netlify-smoke-not-found__"), true);
  assert.equal(fixture.requests.every((request) => request.headers.get("accept-encoding") === "identity"), true);
});

test("Netlify smoke proves previews are noindex and omit canonical-only machine routes", async () => {
  const fixture = netlifyFixture("preview");
  const report = await smokeNetlifyHttp({
    origin: "https://deploy-preview-25--skills-lab-sa.netlify.app",
    profile: "preview",
    expectedSourceRevision: revision,
    fetchImpl: fixture.fetch,
  });

  assert.equal(report.machineRoutesVerified, 0);
  for (const pathname of [
    "/llms.txt",
    "/LICENSE.txt",
    "/skills.json",
    "/recipes.json",
    "/robots.txt",
    "/sitemap.xml",
    "/skills/tailwind/index.md",
    "/recipes/prototype/index.md",
  ]) {
    assert.equal(fixture.requests.some((request) => request.pathname === pathname), true, pathname);
  }
});

test("Netlify smoke rejects production HTML made non-indexable by provider behavior", async () => {
  const fixture = netlifyFixture("canonical", { forceNoindex: true });
  await assert.rejects(
    smokeNetlifyHttp({
      origin: "https://skills.lab.sa",
      profile: "canonical",
      expectedSourceRevision: revision,
      fetchImpl: fixture.fetch,
    }),
    /must remain indexable/i,
  );
});

function netlifyFixture(profileName, { forceNoindex = false } = {}) {
  const indexable = profileName === "canonical";
  const bodies = new Map([
    ["index.html", html("https://skills.lab.sa/", indexable && !forceNoindex)],
    ["404.html", html(null, false)],
    ["skills/tailwind/index.html", html("https://skills.lab.sa/skills/tailwind/", indexable)],
    ["recipes/index.html", html("https://skills.lab.sa/recipes/", indexable)],
    ["recipes/prototype/index.html", html("https://skills.lab.sa/recipes/prototype/", indexable)],
    ["_app/immutable/app.js", "console.log('hydrated');\n"],
  ]);
  if (indexable) {
    bodies.set("llms.txt", "# LAB Skills\n");
    bodies.set("LICENSE.txt", "MIT\n");
    bodies.set("skills.json", '{"schemaVersion":2}\n');
    bodies.set("recipes.json", '{"schemaVersion":2}\n');
    bodies.set("skills/tailwind/index.md", "# Tailwind\n");
    bodies.set("recipes/prototype/index.md", "# Prototype\n");
    bodies.set("robots.txt", "User-agent: *\nAllow: /\n");
    bodies.set("sitemap.xml", "<?xml version=\"1.0\"?><urlset></urlset>\n");
  }
  const manifest = {
    schemaVersion: 1,
    sourceRevision: revision,
    workingTreeDirty: false,
    packageLockSha256: lockfileDigest,
    profile: {
      name: profileName,
      base: "",
      canonicalOrigin: "https://skills.lab.sa",
      indexable,
      publishMachineSurfaces: indexable,
    },
    files: [...bodies].map(([path, body]) => ({
      path,
      bytes: Buffer.byteLength(body),
      sha256: createHash("sha256").update(body).digest("hex"),
    })),
  };
  const requests = [];
  const fetch = async (input, init = {}) => {
    const url = new URL(input);
    const headers = new Headers(init.headers);
    requests.push({ pathname: url.pathname, headers });
    if (url.pathname === "/publication-manifest.json") return response(JSON.stringify(manifest), "application/json; charset=utf-8");
    if (url.pathname === "/__netlify-smoke-not-found__" || url.pathname === "/llms-full.txt") {
      return response(bodies.get("404.html"), "text/html; charset=UTF-8", 404);
    }
    const file = routeFile(url.pathname);
    const body = bodies.get(file);
    if (body === undefined) return response(bodies.get("404.html"), "text/html; charset=utf-8", 404);
    const responseHeaders = { "Content-Type": contentType(file), ETag: `\"${manifest.files.find((entry) => entry.path === file).sha256}\"` };
    if (file.startsWith("_app/immutable/")) responseHeaders["Cache-Control"] = "public, max-age=31536000, immutable";
    if (isMachine(file)) {
      responseHeaders["Access-Control-Allow-Origin"] = "*";
      responseHeaders["Cache-Control"] = "public, max-age=0, must-revalidate";
      if (!/^(?:robots\.txt|sitemap\.xml)$/.test(file)) responseHeaders["X-Robots-Tag"] = "noindex";
    }
    return response(body, responseHeaders["Content-Type"], 200, responseHeaders);
  };
  return { fetch, manifest, requests };
}

function html(canonical, indexable) {
  const robots = indexable ? "" : '<meta name="robots" content="noindex,follow">';
  const link = canonical ? `<link rel="canonical" href="${canonical}">` : "";
  return `<!doctype html><html><head>${robots}${link}</head><body><main id="main-content"><h1>LAB Skills</h1></main></body></html>`;
}

function routeFile(pathname) {
  if (pathname === "/") return "index.html";
  if (pathname.endsWith("/")) return `${pathname.slice(1)}index.html`;
  return pathname.slice(1);
}

function response(body, type, status = 200, headers = {}) {
  return new Response(body, { status, headers: { ...headers, "Content-Type": type } });
}

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (file.endsWith(".xml")) return "application/xml; charset=utf-8";
  return "text/plain; charset=utf-8";
}

function isMachine(file) {
  return /^(?:llms\.txt|LICENSE\.txt|skills\.json|recipes\.json|robots\.txt|sitemap\.xml|skills\/.+\/index\.md|recipes\/.+\/index\.md)$/.test(file);
}
