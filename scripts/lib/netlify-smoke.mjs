import { createHash } from "node:crypto";

const crawlerAgents = Object.freeze([
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
]);

export async function smokeNetlifyHttp({ origin, profile, expectedSourceRevision, fetchImpl = fetch }) {
  const deploymentOrigin = normalizeOrigin(origin);
  if (!new Set(["canonical", "preview"]).has(profile)) {
    throw new Error(`Netlify smoke requires canonical or preview profile, received ${String(profile)}`);
  }
  if (!/^[0-9a-f]{40}$/.test(expectedSourceRevision ?? "")) {
    throw new Error("Netlify smoke requires the expected source revision");
  }

  const request = async (pathname, headers = {}) => fetchImpl(new URL(pathname, deploymentOrigin), {
    redirect: "follow",
    headers: { "accept-encoding": "identity", ...headers },
  });
  const manifestResponse = await request("/publication-manifest.json");
  requireStatus(manifestResponse, 200, "/publication-manifest.json");
  requireContentType(manifestResponse, "application/json; charset=utf-8", "/publication-manifest.json");
  const manifest = await manifestResponse.json();
  validateManifest(manifest, profile, expectedSourceRevision);

  let htmlRoutesVerified = 0;
  let machineRoutesVerified = 0;
  let crawlerSource;
  for (const file of manifest.files) {
    const pathname = publicPath(file.path);
    const response = await request(pathname);
    requireStatus(response, 200, pathname);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength !== file.bytes || digest(bytes) !== file.sha256) {
      throw new Error(`${pathname} does not match the immutable publication manifest`);
    }

    if (file.path.endsWith(".html")) {
      htmlRoutesVerified += 1;
      requireContentType(response, "text/html; charset=utf-8", pathname);
      validateHtml(bytes.toString("utf8"), pathname, profile);
    }
    if (file.path.startsWith("_app/immutable/")) {
      requireHeader(response, "cache-control", "public, max-age=31536000, immutable", pathname);
      requireValidator(response, pathname);
    }
    if (isMachinePath(file.path)) {
      machineRoutesVerified += 1;
      validateMachineResponse(response, file.path, pathname);
      if (!crawlerSource && file.path.endsWith("/index.md")) crawlerSource = { pathname, bytes };
    }
  }

  const missing = await request("/__netlify-smoke-not-found__");
  requireStatus(missing, 404, "/__netlify-smoke-not-found__");
  requireContentType(missing, "text/html; charset=utf-8", "/__netlify-smoke-not-found__");
  validateHtml(Buffer.from(await missing.arrayBuffer()).toString("utf8"), "/__netlify-smoke-not-found__", "preview");

  let crawlerAgentsVerified = 0;
  if (profile === "canonical") {
    if (!crawlerSource) throw new Error("Canonical Netlify publication has no Markdown crawler surface");
    const unexpected = await request("/llms-full.txt");
    requireStatus(unexpected, 404, "/llms-full.txt");
    for (const userAgent of crawlerAgents) {
      const response = await request(crawlerSource.pathname, { "user-agent": userAgent });
      requireStatus(response, 200, `${crawlerSource.pathname} for ${userAgent}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.equals(crawlerSource.bytes)) {
        throw new Error(`${crawlerSource.pathname} changed for crawler ${userAgent}`);
      }
      crawlerAgentsVerified += 1;
    }
  } else {
    const skillMirror = representativeMirror(manifest.files, /^skills\/[^/]+\/index\.html$/);
    const recipeMirror = representativeMirror(manifest.files, /^recipes\/[^/]+\/index\.html$/);
    for (const pathname of [
      "/llms.txt",
      "/LICENSE.txt",
      "/skills.json",
      "/recipes.json",
      "/robots.txt",
      "/sitemap.xml",
      skillMirror,
      recipeMirror,
    ]) {
      const response = await request(pathname);
      requireStatus(response, 404, pathname);
    }
  }

  return Object.freeze({
    origin: deploymentOrigin.href,
    profile,
    sourceRevision: manifest.sourceRevision,
    filesVerified: manifest.files.length,
    htmlRoutesVerified,
    machineRoutesVerified,
    crawlerAgentsVerified,
  });
}

function representativeMirror(files, pattern) {
  const html = files.find((file) => pattern.test(file.path));
  if (!html) throw new Error(`Netlify preview has no representative route matching ${pattern}`);
  return `/${html.path.replace(/index\.html$/, "index.md")}`;
}

function validateManifest(manifest, profile, expectedSourceRevision) {
  if (!manifest || manifest.schemaVersion !== 1 || !Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error("Netlify deployment has no valid publication manifest");
  }
  if (manifest.sourceRevision !== expectedSourceRevision || manifest.workingTreeDirty !== false) {
    throw new Error("Netlify deployment source revision or clean-worktree evidence does not match");
  }
  if (!/^[0-9a-f]{64}$/.test(manifest.packageLockSha256 ?? "")) {
    throw new Error("Netlify deployment has no package-lock digest");
  }
  const expectedProfile = profile === "canonical"
    ? { name: "canonical", base: "", canonicalOrigin: "https://skills.lab.sa", indexable: true, publishMachineSurfaces: true }
    : { name: "preview", base: "", canonicalOrigin: "https://skills.lab.sa", indexable: false, publishMachineSurfaces: false };
  if (JSON.stringify(manifest.profile) !== JSON.stringify(expectedProfile)) {
    throw new Error(`Netlify deployment does not use the ${profile} root publication profile`);
  }
  const seen = new Set();
  for (const file of manifest.files) {
    if (!file || typeof file.path !== "string" || !file.path || file.path.startsWith("/") || file.path.includes("..")) {
      throw new Error("Netlify publication manifest contains an unsafe file path");
    }
    if (seen.has(file.path)) throw new Error(`Netlify publication manifest duplicates ${file.path}`);
    seen.add(file.path);
    if (!Number.isInteger(file.bytes) || file.bytes < 0 || !/^[0-9a-f]{64}$/.test(file.sha256 ?? "")) {
      throw new Error(`Netlify publication manifest has invalid evidence for ${file.path}`);
    }
  }
  const machineCount = manifest.files.filter((file) => isMachinePath(file.path)).length;
  if (profile === "canonical" && machineCount === 0) throw new Error("Canonical Netlify publication omits machine surfaces");
  if (profile === "preview" && machineCount !== 0) throw new Error("Netlify preview publishes canonical-only machine surfaces");
}

function validateHtml(html, pathname, profile) {
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(html) || !/<h1\b/i.test(html)) {
    throw new Error(`${pathname} is not useful prerendered HTML`);
  }
  const mustNoindex = profile === "preview" || pathname === "/404.html" || pathname === "/__netlify-smoke-not-found__";
  if (mustNoindex && !/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']noindex,follow["']/i.test(html)) {
    throw new Error(`${pathname} must publish noindex,follow`);
  }
  const ordinaryPage = pathname !== "/404.html" && pathname !== "/__netlify-smoke-not-found__";
  if (profile === "canonical" && ordinaryPage && /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i.test(html)) {
    throw new Error(`${pathname} must remain indexable in canonical production`);
  }
  if (ordinaryPage && !/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']https:\/\/skills\.lab\.sa\//i.test(html)) {
    throw new Error(`${pathname} must retain its skills.lab.sa canonical URL`);
  }
}

function validateMachineResponse(response, file, pathname) {
  requireContentType(response, machineContentType(file), pathname);
  requireHeader(response, "access-control-allow-origin", "*", pathname);
  requireHeader(response, "cache-control", "public, max-age=0, must-revalidate", pathname);
  requireValidator(response, pathname);
  if (!/^(?:robots\.txt|sitemap\.xml)$/.test(file)) {
    requireHeader(response, "x-robots-tag", "noindex", pathname);
  }
}

function machineContentType(file) {
  if (file.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".xml")) return "application/xml; charset=utf-8";
  return "text/plain; charset=utf-8";
}

function isMachinePath(file) {
  return /^(?:llms\.txt|LICENSE\.txt|skills\.json|recipes\.json|robots\.txt|sitemap\.xml|skills\/.+\/index\.md|recipes\/.+\/index\.md)$/.test(file);
}

function publicPath(file) {
  if (file === "index.html") return "/";
  if (file.endsWith("/index.html")) return `/${file.slice(0, -"index.html".length)}`;
  return `/${file}`;
}

function normalizeOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error("Netlify smoke origin must be an HTTPS origin", { cause: error });
  }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Netlify smoke origin must be an HTTPS origin");
  }
  return url;
}

function requireStatus(response, expected, label) {
  if (response.status !== expected) throw new Error(`${label} returned ${response.status}; expected ${expected}`);
}

function requireContentType(response, expected, label) {
  requireHeader(response, "content-type", expected, label);
}

function requireHeader(response, name, expected, label) {
  const actual = response.headers.get(name);
  if (actual !== expected) throw new Error(`${label} ${name} is ${String(actual)}; expected ${expected}`);
}

function requireValidator(response, label) {
  if (!response.headers.get("etag") && !response.headers.get("last-modified")) {
    throw new Error(`${label} has no stable cache validator`);
  }
}

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
