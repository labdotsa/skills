import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const profiles = Object.freeze({
  "pages-project": Object.freeze({ profile: "pages-project", basePath: "/skills" }),
  "pages-root": Object.freeze({ profile: "pages-root", basePath: "" }),
});

export function resolvePagesPublication(value) {
  const publication = profiles[value];
  if (!publication) throw new Error(`Unsupported Pages profile: ${String(value)}`);
  return publication;
}

export function validatePagesTarget(profile, configuredBasePath) {
  const publication = resolvePagesPublication(profile);
  if (configuredBasePath !== publication.basePath) {
    const target = publication.basePath || "the root base path";
    throw new Error(`${profile} requires ${target}; GitHub Pages reported ${String(configuredBasePath)}`);
  }
  return configuredBasePath;
}

export async function comparePagesPublication({ canonicalDirectory, pagesDirectory }) {
  const canonicalRoot = path.resolve(canonicalDirectory);
  const pagesRoot = path.resolve(pagesDirectory);
  const canonical = await loadPublication(canonicalRoot);
  const pages = await loadPublication(pagesRoot);
  if (canonical.manifest.profile?.name !== "canonical") {
    throw new Error("Pages comparison requires the canonical reference profile");
  }
  const expectedPages = resolvePagesPublication(pages.manifest.profile?.name);
  if (pages.manifest.profile.base !== expectedPages.basePath
    || pages.manifest.profile.indexable !== false
    || pages.manifest.profile.publishMachineSurfaces !== false
    || pages.manifest.profile.canonicalOrigin !== "https://skills.lab.sa") {
    throw new Error(`Pages comparison received an invalid ${expectedPages.profile} profile`);
  }
  if (canonical.manifest.sourceRevision !== pages.manifest.sourceRevision
    || canonical.manifest.packageLockSha256 !== pages.manifest.packageLockSha256) {
    throw new Error("Canonical and Pages publications do not share one source revision and lockfile");
  }
  if (canonical.manifest.workingTreeDirty !== false || pages.manifest.workingTreeDirty !== false) {
    throw new Error("Canonical and Pages publications must come from a clean source revision");
  }
  const canonicalMachine = canonical.manifest.files.filter((file) => isMachinePath(file.path));
  const pagesMachine = pages.manifest.files.filter((file) => isMachinePath(file.path));
  if (canonicalMachine.length === 0) throw new Error("Canonical reference omits machine surfaces");
  if (pagesMachine.length !== 0) throw new Error("Pages publication contains canonical-only machine surfaces");

  const canonicalRoutes = humanRoutes(canonical.manifest);
  const pagesRoutes = humanRoutes(pages.manifest);
  if (JSON.stringify(canonicalRoutes) !== JSON.stringify(pagesRoutes)) {
    throw new Error("Canonical and Pages publications emit different human routes");
  }
  const normalizedRoutes = [];
  for (const filename of canonicalRoutes) {
    const canonicalHtml = canonical.files.get(filename).toString("utf8");
    const pagesHtml = pages.files.get(filename).toString("utf8");
    const canonicalRecord = normalizedHtml(canonicalHtml);
    const pagesRecord = normalizedHtml(pagesHtml);
    if (JSON.stringify(canonicalRecord) !== JSON.stringify(pagesRecord)) {
      throw new Error(`${filename} differs between canonical and Pages human content`);
    }
    normalizedRoutes.push({ path: filename, ...canonicalRecord });
  }

  const canonicalBrand = brandFiles(canonical.manifest);
  const pagesBrand = brandFiles(pages.manifest);
  if (JSON.stringify(canonicalBrand) !== JSON.stringify(pagesBrand)) {
    throw new Error("Canonical and Pages publications emit different brand files");
  }
  const normalizedBrand = canonicalBrand.map((filename) => {
    const canonicalFile = canonical.files.get(filename);
    const pagesFile = pages.files.get(filename);
    if (!canonicalFile.equals(pagesFile)) throw new Error(`${filename} differs between canonical and Pages publications`);
    return { path: filename, sha256: digest(canonicalFile) };
  });
  const normalizedHumanSha256 = digest(JSON.stringify({ routes: normalizedRoutes, brand: normalizedBrand }));

  return Object.freeze({
    sourceRevision: pages.manifest.sourceRevision,
    packageLockSha256: pages.manifest.packageLockSha256,
    pagesProfile: expectedPages.profile,
    humanRoutes: Object.freeze(canonicalRoutes),
    brandFiles: Object.freeze(canonicalBrand),
    normalizedHumanSha256,
  });
}

export function createPagesDeployRecord({
  publicationManifest,
  http,
  browser,
  normalizedHumanSha256,
  workflowRunId,
  workflowRunAttempt,
  workflowRunUrl,
  generatedAt,
}) {
  if (!publicationManifest || publicationManifest.schemaVersion !== 1) {
    throw new Error("Pages deploy record requires a schema-v1 publication manifest");
  }
  const publication = resolvePagesPublication(publicationManifest.profile?.name);
  if (publicationManifest.profile.base !== publication.basePath
    || publicationManifest.profile.indexable !== false
    || publicationManifest.profile.publishMachineSurfaces !== false
    || publicationManifest.profile.canonicalOrigin !== "https://skills.lab.sa") {
    throw new Error(`Pages deploy record received an invalid ${publication.profile} profile`);
  }
  if (publicationManifest.workingTreeDirty !== false || !/^[0-9a-f]{40}$/.test(publicationManifest.sourceRevision ?? "")) {
    throw new Error("Pages deploy record requires a clean immutable source revision");
  }
  if (!/^[0-9a-f]{64}$/.test(publicationManifest.packageLockSha256 ?? "")
    || !/^[0-9a-f]{64}$/.test(normalizedHumanSha256 ?? "")) {
    throw new Error("Pages deploy record requires lockfile and normalized human digests");
  }
  if (!/^\d+$/.test(workflowRunId ?? "")) throw new Error("Pages deploy record requires a workflow run ID");
  const attempt = Number(workflowRunAttempt);
  if (!Number.isInteger(attempt) || attempt < 1) throw new Error("Pages deploy record requires a workflow run attempt");
  const runUrl = normalizedHttpsUrl(workflowRunUrl, "Pages workflow run URL");
  if (runUrl.origin !== "https://github.com" || !runUrl.pathname.endsWith(`/actions/runs/${workflowRunId}`)) {
    throw new Error("Pages workflow run URL does not match its run ID");
  }
  if (!isIsoTimestamp(generatedAt)) throw new Error("Pages deploy record requires an ISO timestamp");
  const files = validateManifestFiles(publicationManifest.files);
  if (files.some((file) => isMachinePath(file.path))) {
    throw new Error("Pages deploy record contains canonical-only machine files");
  }
  const deploymentUrl = normalizedPagesDeploymentUrl(http?.deploymentUrl, publication);
  if (http.profile !== publication.profile
    || http.sourceRevision !== publicationManifest.sourceRevision
    || http.normalizedHumanSha256 !== normalizedHumanSha256) {
    throw new Error("Pages HTTP smoke does not match the publication evidence");
  }
  if (browser?.profile !== publication.profile || browser.deploymentUrl !== deploymentUrl.href) {
    throw new Error("Pages browser smoke does not match the deployed publication");
  }
  const routes = files.filter((file) => file.path.endsWith(".html")).map((file) => file.path);
  if (http.htmlRoutesVerified !== routes.length || browser.routesVerified !== 5) {
    throw new Error("Pages smoke route evidence is incomplete");
  }

  return deepFreeze({
    schemaVersion: 1,
    provider: "github-pages",
    generatedAt,
    providerDeploymentUrl: deploymentUrl.href,
    workflowRunId,
    workflowRunAttempt: attempt,
    workflowRunUrl: runUrl.href,
    sourceRevision: publicationManifest.sourceRevision,
    packageLockSha256: publicationManifest.packageLockSha256,
    profile: structuredClone(publicationManifest.profile),
    normalizedHumanSha256,
    validation: { command: "npm run validate", status: "pass" },
    routes,
    files,
    smoke: { http: structuredClone(http), browser: structuredClone(browser) },
  });
}

async function loadPublication(directory) {
  const manifest = JSON.parse(await readFile(path.join(directory, "publication-manifest.json"), "utf8"));
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error("Pages comparison requires schema-v1 publication manifests");
  }
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceRevision ?? "")
    || !/^[0-9a-f]{64}$/.test(manifest.packageLockSha256 ?? "")) {
    throw new Error("Pages comparison requires source and lockfile provenance");
  }
  const files = new Map();
  for (const file of manifest.files) {
    if (!file || typeof file.path !== "string" || !file.path || file.path.startsWith("/") || file.path.includes("..")) {
      throw new Error("Pages comparison found an unsafe artifact path");
    }
    if (files.has(file.path)) throw new Error(`Pages comparison found duplicate ${file.path}`);
    const bytes = await readFile(path.join(directory, file.path));
    if (bytes.byteLength !== file.bytes || digest(bytes) !== file.sha256) {
      throw new Error(`${file.path} differs from its publication manifest`);
    }
    files.set(file.path, bytes);
  }
  return { manifest, files };
}

function humanRoutes(manifest) {
  return manifest.files.map((file) => file.path).filter((filename) => filename.endsWith(".html")).sort(compareCodePoints);
}

function brandFiles(manifest) {
  return manifest.files.map((file) => file.path).filter((filename) => filename.startsWith("brand/")).sort(compareCodePoints);
}

function normalizedHtml(html) {
  const visibleText = String(html)
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
  return Object.freeze({
    visibleTextSha256: digest(visibleText),
    catalogSnapshot: html.match(/\bdata-catalog-snapshot=["']([^"']+)["']/)?.[1] ?? null,
  });
}

function isMachinePath(filename) {
  return /^(?:llms(?:-full)?\.txt|LICENSE\.txt|skills\.json|recipes\.json|robots\.txt|sitemap\.xml|skills\/.+\/index\.md|recipes\/.+\/index\.md)$/.test(filename);
}

function validateManifestFiles(value) {
  if (!Array.isArray(value) || value.length === 0) throw new Error("Pages deploy record requires a file manifest");
  const seen = new Set();
  return value.map((file) => {
    if (!file || typeof file.path !== "string" || !file.path || file.path.startsWith("/") || file.path.includes("..")) {
      throw new Error("Pages deploy record contains an unsafe file path");
    }
    if (seen.has(file.path)) throw new Error(`Pages deploy record duplicates ${file.path}`);
    seen.add(file.path);
    if (!Number.isInteger(file.bytes) || file.bytes < 0 || !/^[0-9a-f]{64}$/.test(file.sha256 ?? "")) {
      throw new Error(`Pages deploy record has invalid evidence for ${file.path}`);
    }
    return structuredClone(file);
  });
}

function normalizedPagesDeploymentUrl(value, publication) {
  const url = normalizedHttpsUrl(value, "Pages deployment URL");
  if (url.pathname !== `${publication.basePath}/` || url.search || url.hash) {
    throw new Error(`Pages deployment URL does not match ${publication.profile}`);
  }
  if (publication.profile === "pages-project" && url.origin !== "https://labdotsa.github.io") {
    throw new Error("pages-project deployment URL must use labdotsa.github.io");
  }
  if (publication.profile === "pages-root" && url.origin === "https://skills.lab.sa") {
    throw new Error("pages-root must not replace the canonical Netlify origin");
  }
  return url;
}

function normalizedHttpsUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error(`${label} must use HTTPS`, { cause: error });
  }
  if (url.protocol !== "https:" || url.username || url.password) throw new Error(`${label} must use HTTPS`);
  return url;
}

function isIsoTimestamp(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
