import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parse } from "yaml";
import {
  comparePagesPublication,
  createPagesDeployRecord,
  resolvePagesPublication,
  validatePagesTarget,
} from "../scripts/lib/pages-deployment.mjs";
import { smokePagesHttp } from "../scripts/lib/pages-smoke.mjs";
import { smokePagesBrowser } from "../scripts/lib/pages-browser-smoke.mjs";

const actions = Object.freeze({
  checkout: "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
  setupNode: "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
  configurePages: "actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d",
  uploadPages: "actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9",
  deployPages: "actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128",
  uploadEvidence: "actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a",
});

test("Pages deploys one explicitly selected validated publication with least-required permissions", async () => {
  const workflow = parse(await readFile(".github/workflows/pages.yml", "utf8"));
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));

  assert.equal(workflow.name, "Deploy Pages backup");
  assert.deepEqual(workflow.on.push, { branches: ["master"] });
  assert.deepEqual(workflow.on.workflow_dispatch.inputs.publication_profile, {
    description: "Backup publication profile",
    required: true,
    default: "pages-project",
    type: "choice",
    options: ["pages-project", "pages-root"],
  });
  assert.deepEqual(workflow.permissions, { contents: "read" });
  assert.deepEqual(workflow.concurrency, { group: "github-pages", "cancel-in-progress": false });

  const build = workflow.jobs.build;
  assert.deepEqual(build.permissions, { contents: "read", pages: "read" });
  assert.equal(build.outputs.publication_profile, "${{ steps.profile.outputs.name }}");
  assert.equal(build.outputs.normalized_human_sha256, "${{ steps.publication.outputs.normalized_human_sha256 }}");
  assert.deepEqual(build.steps.map((step) => step.uses).filter(Boolean), [
    actions.checkout,
    actions.setupNode,
    actions.configurePages,
    actions.uploadPages,
  ]);
  assert.deepEqual(build.steps.find((step) => step.uses === actions.checkout).with, { "persist-credentials": false });
  assert.deepEqual(build.steps.find((step) => step.uses === actions.setupNode).with, {
    "node-version-file": ".nvmrc",
    cache: "npm",
  });
  assert.deepEqual(build.steps.find((step) => step.uses === actions.uploadPages).with, {
    path: ".artifacts/pages-publication",
    "include-hidden-files": true,
    "retention-days": 1,
  });
  assert.equal(build.steps.some((step) => step.run === "npm install --global npm@11.17.0"), true);
  assert.equal(build.steps.some((step) => step.run === "npm ci"), true);
  assert.equal(build.steps.some((step) => step.run === "npx playwright install --with-deps chromium firefox webkit"), true);
  assert.equal(build.steps.find((step) => step.run === "npm run pages:build").id, "publication");

  const deploy = workflow.jobs.deploy;
  assert.equal(deploy.needs, "build");
  assert.deepEqual(deploy.permissions, { pages: "write", "id-token": "write" });
  assert.deepEqual(deploy.environment, {
    name: "github-pages",
    url: "${{ steps.deployment.outputs.page_url }}",
  });
  assert.equal(deploy.steps.find((step) => step.id === "deployment").uses, actions.deployPages);

  const smoke = workflow.jobs.smoke;
  assert.deepEqual(smoke.needs, ["build", "deploy"]);
  assert.deepEqual(smoke.permissions, { contents: "read" });
  const smokeCommand = smoke.steps.find((step) => step.run?.startsWith("npm run pages:smoke --")).run;
  assert.equal(smokeCommand.includes('"${{ needs.build.outputs.normalized_human_sha256 }}"'), true);
  assert.equal(smoke.steps.at(-1).uses, actions.uploadEvidence);
  assert.equal(packageJson.scripts["pages:build"], "npm run validate && node scripts/build-pages.mjs");
  assert.equal(packageJson.scripts["pages:smoke"], "node scripts/smoke-pages.mjs");
});

test("Pages rejects profile and configured base-path combinations that disagree", () => {
  assert.deepEqual(resolvePagesPublication("pages-project"), { profile: "pages-project", basePath: "/skills" });
  assert.deepEqual(resolvePagesPublication("pages-root"), { profile: "pages-root", basePath: "" });
  assert.equal(validatePagesTarget("pages-project", "/skills"), "/skills");
  assert.equal(validatePagesTarget("pages-root", ""), "");
  assert.throws(() => resolvePagesPublication("canonical"), /unsupported Pages profile/i);
  assert.throws(() => validatePagesTarget("pages-project", ""), /pages-project.*\/skills/i);
  assert.throws(() => validatePagesTarget("pages-root", "/skills"), /pages-root.*root/i);
});

test("Pages normalizes to the canonical human publication without copying machine surfaces", async () => {
  const fixture = await pagesComparisonFixture();
  try {
    const comparison = await comparePagesPublication({
      canonicalDirectory: fixture.canonicalDirectory,
      pagesDirectory: fixture.pagesDirectory,
    });

    assert.equal(comparison.sourceRevision, fixture.sourceRevision);
    assert.equal(comparison.packageLockSha256, fixture.packageLockSha256);
    assert.equal(comparison.pagesProfile, "pages-project");
    assert.deepEqual(comparison.humanRoutes, ["404.html", "index.html", "skills/tailwind/index.html"]);
    assert.deepEqual(comparison.brandFiles, ["brand/logo.svg"]);
    assert.match(comparison.normalizedHumanSha256, /^[0-9a-f]{64}$/);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("Pages smoke proves project-base routes, exact artifact bytes, noindex, and machine omission", async () => {
  const fixture = pagesHttpFixture("pages-project");
  const report = await smokePagesHttp({
    deploymentUrl: "https://labdotsa.github.io/skills/",
    profile: "pages-project",
    expectedSourceRevision: fixture.manifest.sourceRevision,
    expectedNormalizedHumanSha256: "4".repeat(64),
    fetchImpl: fixture.fetch,
  });

  assert.deepEqual(report, {
    deploymentUrl: "https://labdotsa.github.io/skills/",
    profile: "pages-project",
    sourceRevision: fixture.manifest.sourceRevision,
    normalizedHumanSha256: "4".repeat(64),
    filesVerified: fixture.manifest.files.length - 1,
    htmlRoutesVerified: 5,
    machineRoutesOmitted: 8,
  });
  assert.equal(fixture.requests.some((request) => request.pathname === "/skills/__pages-smoke-not-found__"), true);
  assert.equal(fixture.requests.some((request) => request.pathname === "/.nojekyll"), false);
  assert.equal(fixture.requests.every((request) => request.headers.get("accept-encoding") === "identity"), true);
});

test("Pages smoke supports an explicitly selected root custom-domain artifact without source changes", async () => {
  const fixture = pagesHttpFixture("pages-root");
  const report = await smokePagesHttp({
    deploymentUrl: "https://backup.skills.example/",
    profile: "pages-root",
    expectedSourceRevision: fixture.manifest.sourceRevision,
    expectedNormalizedHumanSha256: "4".repeat(64),
    fetchImpl: fixture.fetch,
  });

  assert.equal(report.profile, "pages-root");
  assert.equal(report.deploymentUrl, "https://backup.skills.example/");
  assert.equal(fixture.requests.some((request) => request.pathname === "/skills/tailwind/"), true);
  assert.equal(fixture.requests.some((request) => request.pathname === "/skills/skills/tailwind/"), false);
});

test("Pages records immutable workflow, artifact, comparison, and deployed smoke evidence", () => {
  const fixture = pagesHttpFixture("pages-project");
  const normalizedHumanSha256 = "4".repeat(64);
  const http = {
    deploymentUrl: "https://labdotsa.github.io/skills/",
    profile: "pages-project",
    sourceRevision: fixture.manifest.sourceRevision,
    normalizedHumanSha256,
    filesVerified: fixture.manifest.files.length - 1,
    htmlRoutesVerified: 5,
    machineRoutesOmitted: 8,
  };
  const browser = {
    deploymentUrl: "https://labdotsa.github.io/skills/",
    profile: "pages-project",
    routesVerified: 5,
    interactionsVerified: ["theme-first-paint", "keyboard-skip-link", "copy", "responsive-navigation"],
    escapedBaseRequests: 0,
    remotePresentationRequests: 0,
  };
  const record = createPagesDeployRecord({
    publicationManifest: fixture.manifest,
    http,
    browser,
    normalizedHumanSha256,
    workflowRunId: "123456",
    workflowRunAttempt: "2",
    workflowRunUrl: "https://github.com/labdotsa/skills/actions/runs/123456",
    generatedAt: "2026-08-12T03:00:00.000Z",
  });

  assert.deepEqual(record, {
    schemaVersion: 1,
    provider: "github-pages",
    generatedAt: "2026-08-12T03:00:00.000Z",
    providerDeploymentUrl: "https://labdotsa.github.io/skills/",
    workflowRunId: "123456",
    workflowRunAttempt: 2,
    workflowRunUrl: "https://github.com/labdotsa/skills/actions/runs/123456",
    sourceRevision: fixture.manifest.sourceRevision,
    packageLockSha256: fixture.manifest.packageLockSha256,
    profile: fixture.manifest.profile,
    normalizedHumanSha256,
    validation: { command: "npm run validate", status: "pass" },
    routes: ["index.html", "404.html", "skills/tailwind/index.html", "recipes/index.html", "recipes/prototype/index.html"],
    files: fixture.manifest.files,
    smoke: { http, browser },
  });
});

test("Pages browser smoke rejects a non-HTTPS or incorrectly mounted deployment before launch", async () => {
  await assert.rejects(
    smokePagesBrowser({ deploymentUrl: "http://labdotsa.github.io/skills/", profile: "pages-project" }),
    /HTTPS/i,
  );
  await assert.rejects(
    smokePagesBrowser({ deploymentUrl: "https://labdotsa.github.io/", profile: "pages-project" }),
    /\/skills\//i,
  );
});

async function pagesComparisonFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "pages-comparison-"));
  const canonicalDirectory = path.join(root, "canonical");
  const pagesDirectory = path.join(root, "pages");
  await mkdir(path.join(canonicalDirectory, "skills/tailwind"), { recursive: true });
  await mkdir(path.join(canonicalDirectory, "brand"), { recursive: true });
  await mkdir(path.join(pagesDirectory, "skills/tailwind"), { recursive: true });
  await mkdir(path.join(pagesDirectory, "brand"), { recursive: true });
  const sourceRevision = "1".repeat(40);
  const packageLockSha256 = "2".repeat(64);
  const snapshot = "sha256:" + "3".repeat(64);
  const canonicalBodies = new Map([
    ["index.html", htmlPage({ snapshot, href: "./skills/tailwind/", robots: "index,follow" })],
    ["404.html", htmlPage({ snapshot, href: "./", robots: "noindex,follow", heading: "Missing" })],
    ["skills/tailwind/index.html", htmlPage({ snapshot, href: "../../", robots: "index,follow", heading: "Tailwind" })],
    ["brand/logo.svg", "<svg><title>LAB</title></svg>\n"],
    ["robots.txt", "User-agent: *\nAllow: /\n"],
    ["skills.json", '{"schemaVersion":2}\n'],
  ]);
  const pagesBodies = new Map([
    ["index.html", htmlPage({ snapshot, href: "./skills/tailwind/", robots: "noindex,follow" })],
    ["404.html", htmlPage({ snapshot, href: "./", robots: "noindex,follow", heading: "Missing" })],
    ["skills/tailwind/index.html", htmlPage({ snapshot, href: "../../", robots: "noindex,follow", heading: "Tailwind" })],
    ["brand/logo.svg", canonicalBodies.get("brand/logo.svg")],
  ]);
  await writePublication(canonicalDirectory, canonicalBodies, {
    name: "canonical",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: true,
    publishMachineSurfaces: true,
  }, sourceRevision, packageLockSha256);
  await writePublication(pagesDirectory, pagesBodies, {
    name: "pages-project",
    base: "/skills",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  }, sourceRevision, packageLockSha256);
  return { root, canonicalDirectory, pagesDirectory, sourceRevision, packageLockSha256 };
}

async function writePublication(directory, bodies, profile, sourceRevision, packageLockSha256) {
  for (const [filename, body] of bodies) {
    const target = path.join(directory, filename);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body);
  }
  const manifest = {
    schemaVersion: 1,
    sourceRevision,
    workingTreeDirty: false,
    packageLockSha256,
    profile,
    files: [...bodies].map(([filename, body]) => ({
      path: filename,
      bytes: Buffer.byteLength(body),
      sha256: createHash("sha256").update(body).digest("hex"),
    })),
  };
  await writeFile(path.join(directory, "publication-manifest.json"), `${JSON.stringify(manifest)}\n`);
}

function htmlPage({ snapshot, href, robots, heading = "Library" }) {
  return `<!doctype html><html><head><title>${heading}</title><meta name="robots" content="${robots}"></head><body><main data-catalog-snapshot="${snapshot}"><h1>${heading}</h1><a href="${href}">Browse</a></main><script>window.base = ${JSON.stringify(href)}</script></body></html>`;
}

function pagesHttpFixture(profileName) {
  const basePath = profileName === "pages-project" ? "/skills" : "";
  const sourceRevision = "5".repeat(40);
  const bodies = new Map([
    [".nojekyll", "\n"],
    ["index.html", pagesHtml("https://skills.lab.sa/")],
    ["404.html", pagesHtml(null, "Missing")],
    ["skills/tailwind/index.html", pagesHtml("https://skills.lab.sa/skills/tailwind/", "Tailwind")],
    ["recipes/index.html", pagesHtml("https://skills.lab.sa/recipes/", "Recipes")],
    ["recipes/prototype/index.html", pagesHtml("https://skills.lab.sa/recipes/prototype/", "Prototype")],
    ["_app/immutable/app.js", "console.log('hydrated');\n"],
  ]);
  const manifest = {
    schemaVersion: 1,
    sourceRevision,
    workingTreeDirty: false,
    packageLockSha256: "6".repeat(64),
    profile: {
      name: profileName,
      base: basePath,
      canonicalOrigin: "https://skills.lab.sa",
      indexable: false,
      publishMachineSurfaces: false,
    },
    files: [...bodies].map(([filename, body]) => ({
      path: filename,
      bytes: Buffer.byteLength(body),
      sha256: createHash("sha256").update(body).digest("hex"),
    })),
  };
  const requests = [];
  const fetch = async (input, init = {}) => {
    const url = new URL(input);
    const headers = new Headers(init.headers);
    requests.push({ pathname: url.pathname, headers });
    const root = basePath || "";
    if (url.pathname === `${root}/publication-manifest.json`) {
      return pagesResponse(JSON.stringify(manifest), "application/json; charset=utf-8");
    }
    if (url.pathname === `${root}/__pages-smoke-not-found__` || isPagesMachineRequest(url.pathname, root)) {
      return pagesResponse(bodies.get("404.html"), "text/html; charset=utf-8", 404);
    }
    const filename = pagesRouteFile(url.pathname, root);
    if (filename === ".nojekyll" || !bodies.has(filename)) {
      return pagesResponse(bodies.get("404.html"), "text/html; charset=utf-8", 404);
    }
    return pagesResponse(bodies.get(filename), pagesContentType(filename));
  };
  return { fetch, manifest, requests };
}

function pagesHtml(canonical, heading = "Library") {
  const link = canonical ? `<link rel="canonical" href="${canonical}">` : "";
  return `<!doctype html><html><head><title>${heading}</title><meta name="robots" content="noindex,follow">${link}</head><body><main id="main-content"><h1>${heading}</h1></main></body></html>`;
}

function pagesRouteFile(pathname, basePath) {
  let relative = pathname.slice(basePath.length).replace(/^\//, "");
  if (!relative || relative.endsWith("/")) relative += "index.html";
  return relative;
}

function isPagesMachineRequest(pathname, basePath) {
  const relative = pathname.slice(basePath.length).replace(/^\//, "");
  return /^(?:llms\.txt|LICENSE\.txt|skills\.json|recipes\.json|robots\.txt|sitemap\.xml|skills\/.+\/index\.md|recipes\/.+\/index\.md)$/.test(relative);
}

function pagesResponse(body, contentType, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": contentType } });
}

function pagesContentType(filename) {
  if (filename.endsWith(".html")) return "text/html; charset=utf-8";
  if (filename.endsWith(".js")) return "text/javascript; charset=utf-8";
  return "application/octet-stream";
}
