import { chromium } from "@playwright/test";

export async function smokePublicationBrowser({ deploymentUrl, profile, basePath, providerLabel }) {
  const deployment = normalizeDeploymentUrl(deploymentUrl, basePath, providerLabel);
  const manifestResponse = await fetch(new URL(mountedPath(basePath, "publication-manifest.json"), deployment.origin), {
    headers: { "accept-encoding": "identity" },
  });
  if (manifestResponse.status !== 200) throw new Error(`${providerLabel} browser smoke cannot load the publication manifest`);
  const manifest = await manifestResponse.json();
  const routes = representativeRoutes(manifest.files, basePath, providerLabel);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const escapedBaseRequests = [];
  const remotePresentationRequests = [];
  const errors = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    const presentation = ["document", "font", "image", "script", "stylesheet"].includes(request.resourceType());
    if (url.origin !== deployment.origin && presentation) remotePresentationRequests.push(request.url());
    if (basePath && url.origin === deployment.origin && !withinBase(url.pathname, basePath)) {
      escapedBaseRequests.push(request.url());
    }
  });
  page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText ?? "request failed"}`));
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/status (?:of |code: )?404|\b404\b/i.test(message.text())) errors.push(message.text());
  });
  await page.addInitScript(() => {
    window.__publicationThemeAtDomContentLoaded = null;
    document.addEventListener("DOMContentLoaded", () => {
      window.__publicationThemeAtDomContentLoaded = {
        theme: document.documentElement.dataset.theme,
        color: document.querySelector('meta[name="theme-color"]')?.content,
      };
    }, { once: true });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });

  try {
    for (const route of routes) {
      const response = await page.goto(new URL(route.pathname, deployment.origin).href, { waitUntil: "networkidle" });
      const expectedStatus = route.id === "not-found" ? 404 : 200;
      if (response?.status() !== expectedStatus) {
        throw new Error(`${route.pathname} returned ${response?.status()}; expected ${expectedStatus}`);
      }
      await requireCount(page.locator("main#main-content"), 1, `${route.pathname} main landmark`);
      await requireCount(page.locator("h1"), 1, `${route.pathname} h1`);
      if (await page.locator("html").getAttribute("data-hydrated") !== "true") {
        throw new Error(`${route.pathname} did not hydrate`);
      }
      if (!await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)) {
        throw new Error(`${route.pathname} has horizontal overflow`);
      }
    }

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(deployment.href, { waitUntil: "networkidle" });
    const firstPaint = await page.evaluate(() => window.__publicationThemeAtDomContentLoaded);
    if (JSON.stringify(firstPaint) !== JSON.stringify({ theme: "dark", color: "#09090b" })) {
      throw new Error(`${providerLabel} theme first paint is ${JSON.stringify(firstPaint)}`);
    }
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    if (!await skip.evaluate((element) => element === document.activeElement)) throw new Error("Skip link did not receive keyboard focus");
    await page.keyboard.press("Enter");
    const main = page.locator("main#main-content");
    if (!await main.evaluate((element) => element === document.activeElement)) throw new Error("Skip link did not focus main content");

    const copy = page.getByRole("button", { name: "Copy install command" }).first();
    await copy.click();
    await requireCount(page.getByRole("button", { name: "Copy install command: copied" }), 1, "copy success state");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "networkidle" });
    const navigationTrigger = page.getByRole("button", { name: "Open navigation" });
    await navigationTrigger.click();
    await requireCount(page.getByRole("dialog", { name: "LAB Skills" }), 1, "mobile navigation dialog");
    await page.keyboard.press("Escape");
    if (!await navigationTrigger.evaluate((element) => element === document.activeElement)) {
      throw new Error("Mobile navigation did not restore trigger focus");
    }
    if (escapedBaseRequests.length > 0) {
      throw new Error(`${providerLabel} escaped its publication base: ${escapedBaseRequests.join(", ")}`);
    }
    if (remotePresentationRequests.length > 0) {
      throw new Error(`${providerLabel} requested runtime presentation assets from another origin: ${remotePresentationRequests.join(", ")}`);
    }
    if (errors.length > 0) throw new Error(`${providerLabel} browser errors: ${errors.join("; ")}`);
  } finally {
    await context.close();
    await browser.close();
  }

  return Object.freeze({
    deploymentUrl: deployment.href,
    profile,
    routesVerified: routes.length,
    interactionsVerified: ["theme-first-paint", "keyboard-skip-link", "copy", "responsive-navigation"],
    escapedBaseRequests: 0,
    remotePresentationRequests: 0,
  });
}

function representativeRoutes(files, basePath, providerLabel) {
  if (!Array.isArray(files)) throw new Error(`${providerLabel} browser smoke requires publication files`);
  const html = files.filter((file) => file?.path?.endsWith(".html"));
  const largest = (pattern) => html
    .filter((file) => pattern.test(file.path))
    .sort((left, right) => right.bytes - left.bytes || compareCodePoints(left.path, right.path))[0]?.path;
  const skill = largest(/^skills\/[^/]+\/index\.html$/);
  const recipe = largest(/^recipes\/[^/]+\/index\.html$/);
  for (const required of ["index.html", "recipes/index.html", "404.html", skill, recipe]) {
    if (!required || !html.some((file) => file.path === required)) {
      throw new Error(`${providerLabel} publication omits representative route ${String(required)}`);
    }
  }
  return Object.freeze([
    { id: "home", pathname: `${basePath}/` },
    { id: "skill", pathname: `${basePath}/${skill.slice(0, -"index.html".length)}` },
    { id: "recipe-index", pathname: `${basePath}/recipes/` },
    { id: "recipe", pathname: `${basePath}/${recipe.slice(0, -"index.html".length)}` },
    { id: "not-found", pathname: mountedPath(basePath, "__publication-browser-smoke-not-found__") },
  ]);
}

async function requireCount(locator, expected, label) {
  if (expected === 1) await locator.first().waitFor({ state: "visible" });
  const count = await locator.count();
  if (count !== expected) throw new Error(`${label} count is ${count}; expected ${expected}`);
}

function normalizeDeploymentUrl(value, basePath, providerLabel) {
  let url;
  try {
    url = new URL(value);
  } catch (error) {
    throw new Error(`${providerLabel} browser smoke requires an HTTPS deployment URL`, { cause: error });
  }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== `${basePath}/` || url.search || url.hash) {
    throw new Error(`${providerLabel} browser smoke requires an HTTPS deployment URL at ${basePath || "the root"}/`);
  }
  return url;
}

function mountedPath(basePath, relativePath) {
  return `${basePath}/${relativePath}`.replace(/\/{2,}/g, "/");
}

function withinBase(pathname, basePath) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
