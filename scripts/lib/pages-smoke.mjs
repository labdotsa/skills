import { createHash } from "node:crypto";
import { resolvePagesPublication } from "./pages-deployment.mjs";

export async function smokePagesHttp({
  deploymentUrl,
  profile,
  expectedSourceRevision,
  expectedNormalizedHumanSha256,
  fetchImpl = fetch,
}) {
  const publication = resolvePagesPublication(profile);
  const deployed = validateDeploymentUrl(deploymentUrl, publication);
  if (!/^[0-9a-f]{40}$/.test(expectedSourceRevision ?? "")) {
    throw new Error("Pages smoke requires the expected source revision");
  }
  if (!/^[0-9a-f]{64}$/.test(expectedNormalizedHumanSha256 ?? "")) {
    throw new Error("Pages smoke requires the normalized canonical comparison digest");
  }
  const request = (pathname) => fetchImpl(new URL(pathname, deployed.origin), {
    redirect: "manual",
    headers: { "accept-encoding": "identity" },
  });
  const manifestPath = mountedPath(publication.basePath, "publication-manifest.json");
  const manifestResponse = await request(manifestPath);
  requireStatus(manifestResponse, 200, manifestPath);
  requireContentType(manifestResponse, "application/json; charset=utf-8", manifestPath);
  const manifest = await manifestResponse.json();
  validateManifest(manifest, publication, expectedSourceRevision);

  let filesVerified = 0;
  let htmlRoutesVerified = 0;
  for (const file of manifest.files) {
    if (file.path === ".nojekyll") continue;
    const pathname = publicPath(publication.basePath, file.path);
    const response = await request(pathname);
    requireStatus(response, 200, pathname);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength !== file.bytes || digest(bytes) !== file.sha256) {
      throw new Error(`${pathname} does not match the immutable Pages publication manifest`);
    }
    filesVerified += 1;
    if (file.path.endsWith(".html")) {
      requireContentType(response, "text/html; charset=utf-8", pathname);
      validateHtml(bytes.toString("utf8"), pathname, file.path === "404.html");
      htmlRoutesVerified += 1;
    }
  }

  const missingPath = mountedPath(publication.basePath, "__pages-smoke-not-found__");
  const missing = await request(missingPath);
  requireStatus(missing, 404, missingPath);
  requireContentType(missing, "text/html; charset=utf-8", missingPath);
  validateHtml(Buffer.from(await missing.arrayBuffer()).toString("utf8"), missingPath, true);

  const skillMirror = representativeMirror(manifest.files, /^skills\/[^/]+\/index\.html$/);
  const recipeMirror = representativeMirror(manifest.files, /^recipes\/[^/]+\/index\.html$/);
  const machinePaths = [
    "llms.txt",
    "LICENSE.txt",
    "skills.json",
    "recipes.json",
    "robots.txt",
    "sitemap.xml",
    skillMirror,
    recipeMirror,
  ];
  for (const relativePath of machinePaths) {
    const pathname = mountedPath(publication.basePath, relativePath);
    const response = await request(pathname);
    requireStatus(response, 404, pathname);
  }

  return Object.freeze({
    deploymentUrl: deployed.href,
    profile,
    sourceRevision: manifest.sourceRevision,
    normalizedHumanSha256: expectedNormalizedHumanSha256,
    filesVerified,
    htmlRoutesVerified,
    machineRoutesOmitted: machinePaths.length,
  });
}

function validateManifest(manifest, publication, expectedSourceRevision) {
  if (!manifest || manifest.schemaVersion !== 1 || !Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error("Pages deployment has no valid publication manifest");
  }
  if (manifest.sourceRevision !== expectedSourceRevision || manifest.workingTreeDirty !== false) {
    throw new Error("Pages deployment source revision or clean-worktree evidence does not match");
  }
  if (!/^[0-9a-f]{64}$/.test(manifest.packageLockSha256 ?? "")) {
    throw new Error("Pages deployment has no package-lock digest");
  }
  const expectedProfile = {
    name: publication.profile,
    base: publication.basePath,
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  };
  if (JSON.stringify(manifest.profile) !== JSON.stringify(expectedProfile)) {
    throw new Error(`Pages deployment does not use the ${publication.profile} publication profile`);
  }
  const seen = new Set();
  for (const file of manifest.files) {
    if (!file || typeof file.path !== "string" || !file.path || file.path.startsWith("/") || file.path.includes("..")) {
      throw new Error("Pages publication manifest contains an unsafe file path");
    }
    if (seen.has(file.path)) throw new Error(`Pages publication manifest duplicates ${file.path}`);
    seen.add(file.path);
    if (!Number.isInteger(file.bytes) || file.bytes < 0 || !/^[0-9a-f]{64}$/.test(file.sha256 ?? "")) {
      throw new Error(`Pages publication manifest has invalid evidence for ${file.path}`);
    }
    if (isMachinePath(file.path)) throw new Error(`Pages publication contains canonical-only ${file.path}`);
  }
  if (!seen.has(".nojekyll")) throw new Error("Pages publication must include .nojekyll");
}

function validateDeploymentUrl(value, publication) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error("Pages deployment URL must be an HTTPS publication base", { cause: error });
  }
  const expectedPathname = `${publication.basePath}/`;
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== expectedPathname || url.search || url.hash) {
    throw new Error(`${publication.profile} deployment URL must use ${expectedPathname} over HTTPS`);
  }
  if (publication.profile === "pages-project" && url.origin !== "https://labdotsa.github.io") {
    throw new Error("pages-project must deploy at https://labdotsa.github.io/skills/");
  }
  if (publication.profile === "pages-root" && url.origin === "https://skills.lab.sa") {
    throw new Error("pages-root must not replace the canonical Netlify origin");
  }
  return url;
}

function validateHtml(html, pathname, notFound) {
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(html) || !/<h1\b/i.test(html)) {
    throw new Error(`${pathname} is not useful prerendered HTML`);
  }
  if (!/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']noindex,follow["']/i.test(html)) {
    throw new Error(`${pathname} must publish noindex,follow`);
  }
  if (!notFound && !/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']https:\/\/skills\.lab\.sa\//i.test(html)) {
    throw new Error(`${pathname} must canonicalize to skills.lab.sa`);
  }
  if (notFound && /<link\b[^>]*\brel=["']canonical["']/i.test(html)) {
    throw new Error(`${pathname} must not publish a not-found canonical`);
  }
}

function representativeMirror(files, pattern) {
  const html = files.find((file) => pattern.test(file.path));
  if (!html) throw new Error(`Pages deployment has no representative route matching ${pattern}`);
  return html.path.replace(/index\.html$/, "index.md");
}

function publicPath(basePath, filename) {
  if (filename === "index.html") return `${basePath}/`;
  if (filename.endsWith("/index.html")) return `${basePath}/${filename.slice(0, -"index.html".length)}`;
  return mountedPath(basePath, filename);
}

function mountedPath(basePath, relativePath) {
  return `${basePath}/${relativePath}`.replace(/\/{2,}/g, "/");
}

function isMachinePath(filename) {
  return /^(?:llms(?:-full)?\.txt|LICENSE\.txt|skills\.json|recipes\.json|robots\.txt|sitemap\.xml|skills\/.+\/index\.md|recipes\/.+\/index\.md)$/.test(filename);
}

function requireStatus(response, expected, label) {
  if (response.status !== expected) throw new Error(`${label} returned ${response.status}; expected ${expected}`);
}

function requireContentType(response, expected, label) {
  const actual = response.headers.get("content-type");
  if (actual !== expected) throw new Error(`${label} content-type is ${String(actual)}; expected ${expected}`);
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}
