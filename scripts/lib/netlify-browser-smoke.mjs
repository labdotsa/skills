import { chromium } from "@playwright/test";

export async function smokeNetlifyBrowser({ origin, profile }) {
  const deploymentOrigin = normalizeOrigin(origin);
  if (!new Set(["canonical", "preview"]).has(profile)) {
    throw new Error(`Netlify browser smoke requires canonical or preview profile, received ${String(profile)}`);
  }
  const manifestResponse = await fetch(new URL("/publication-manifest.json", deploymentOrigin), {
    headers: { "accept-encoding": "identity" },
  });
  if (manifestResponse.status !== 200) throw new Error("Netlify browser smoke cannot load the publication manifest");
  const manifest = await manifestResponse.json();
  const routes = representativeRoutes(manifest.files);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const remotePresentationRequests = [];
  const errors = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== deploymentOrigin.origin && ["font", "image", "script", "stylesheet"].includes(request.resourceType())) {
      remotePresentationRequests.push(request.url());
    }
  });
  page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText ?? "request failed"}`));
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/status (?:of |code: )?404|\b404\b/i.test(message.text())) errors.push(message.text());
  });
  await page.addInitScript(() => {
    window.__netlifyThemeAtDomContentLoaded = null;
    document.addEventListener("DOMContentLoaded", () => {
      window.__netlifyThemeAtDomContentLoaded = {
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
      const response = await page.goto(new URL(route.pathname, deploymentOrigin).href, { waitUntil: "networkidle" });
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
    await page.goto(deploymentOrigin.href, { waitUntil: "networkidle" });
    const firstPaint = await page.evaluate(() => window.__netlifyThemeAtDomContentLoaded);
    if (JSON.stringify(firstPaint) !== JSON.stringify({ theme: "dark", color: "#09090b" })) {
      throw new Error(`Netlify theme first paint is ${JSON.stringify(firstPaint)}`);
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
    if (remotePresentationRequests.length > 0) {
      throw new Error(`Netlify requested runtime presentation assets from another origin: ${remotePresentationRequests.join(", ")}`);
    }
    if (errors.length > 0) throw new Error(`Netlify browser errors: ${errors.join("; ")}`);
  } finally {
    await context.close();
    await browser.close();
  }

  return Object.freeze({
    origin: deploymentOrigin.href,
    profile,
    routesVerified: routes.length,
    interactionsVerified: ["theme-first-paint", "keyboard-skip-link", "copy", "responsive-navigation"],
    remotePresentationRequests: 0,
  });
}

function representativeRoutes(files) {
  if (!Array.isArray(files)) throw new Error("Netlify browser smoke requires publication files");
  const html = files.filter((file) => file?.path?.endsWith(".html"));
  const largest = (pattern) => html
    .filter((file) => pattern.test(file.path))
    .sort((left, right) => right.bytes - left.bytes || compareCodePoints(left.path, right.path))[0]?.path;
  const skill = largest(/^skills\/[^/]+\/index\.html$/);
  const recipe = largest(/^recipes\/[^/]+\/index\.html$/);
  for (const required of ["index.html", "recipes/index.html", "404.html", skill, recipe]) {
    if (!required || !html.some((file) => file.path === required)) throw new Error(`Netlify publication omits representative route ${String(required)}`);
  }
  return Object.freeze([
    { id: "home", pathname: "/" },
    { id: "skill", pathname: `/${skill.slice(0, -"index.html".length)}` },
    { id: "recipe-index", pathname: "/recipes/" },
    { id: "recipe", pathname: `/${recipe.slice(0, -"index.html".length)}` },
    { id: "not-found", pathname: "/__netlify-browser-smoke-not-found__" },
  ]);
}

async function requireCount(locator, expected, label) {
  if (expected === 1) await locator.first().waitFor({ state: "visible" });
  const count = await locator.count();
  if (count !== expected) throw new Error(`${label} count is ${count}; expected ${expected}`);
}

function normalizeOrigin(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Netlify browser smoke origin must be an HTTPS origin");
  }
  return url;
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
