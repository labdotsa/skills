import { expect, test } from "@playwright/test";
import { loadRepresentativeRoutes } from "../quality/load-routes.mjs";

const profiles = [
  { name: "canonical", origin: "http://127.0.0.1:4173", root: ".artifacts/e2e", basePath: "" },
  { name: "pages-project", origin: "http://127.0.0.1:4174", root: ".artifacts/e2e-pages", basePath: "/skills" },
];

test("publishes an explicit hydration-ready marker within the deterministic budget", async ({ page, browserName }) => {
  await page.addInitScript(() => {
    window.__qualityLongTasks = [];
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver((list) => {
          window.__qualityLongTasks.push(...list.getEntries().map((entry) => ({
            startTime: entry.startTime,
            duration: entry.duration,
          })));
        }).observe({ type: "longtask", buffered: true });
      } catch {}
    }
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  const timing = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const hydrated = performance.getEntriesByName("lab-hydrated")[0];
    return {
      hydrationMs: hydrated.startTime - navigation.domContentLoadedEventStart,
      longestTaskMs: Math.max(
        0,
        ...window.__qualityLongTasks
          .filter((entry) => (
            entry.startTime < hydrated.startTime
            && entry.startTime + entry.duration > navigation.domContentLoadedEventStart
          ))
          .map((entry) => entry.duration),
      ),
    };
  });
  expect(timing.hydrationMs).toBeLessThanOrEqual(500);
  if (browserName === "chromium") expect(timing.longestTaskMs).toBeLessThanOrEqual(100);
});

test("every representative route survives hydration in both publication profiles", async ({ page }) => {
  for (const profile of profiles) {
    const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
    for (const route of routes) {
      const errors = [];
      const catalogRequests = [];
      const remotePresentationRequests = [];
      page.removeAllListeners();
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push({ kind: "console", text: message.text(), url: message.location().url });
        }
      });
      page.on("pageerror", (error) => errors.push({ kind: "page", text: error.message, url: page.url() }));
      page.on("requestfailed", (request) => {
        errors.push({ kind: "request", text: request.failure()?.errorText, url: request.url() });
      });
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (/\/(?:skills|recipes)\.json$/.test(url.pathname)) catalogRequests.push(request.url());
        if (url.origin !== profile.origin && ["font", "image", "script", "stylesheet"].includes(request.resourceType())) {
          remotePresentationRequests.push(request.url());
        }
      });

      const response = await page.goto(`${profile.origin}${route.pathname}`, { waitUntil: "networkidle" });
      expect(response?.status(), `${profile.name} ${route.pathname} status`).toBe(route.id === "not-found" ? 404 : 200);
      await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
      await expect(page.locator("main#main-content")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(catalogRequests, `${profile.name} ${route.pathname} duplicate Catalog requests`).toEqual([]);
      expect(remotePresentationRequests, `${profile.name} ${route.pathname} remote presentation requests`).toEqual([]);
      expect(
        errors.filter((error) => !isExpectedNotFoundConsole(error, profile, route)),
        `${profile.name} ${route.pathname} hydration errors`,
      ).toEqual([]);
    }
  }
});

test("representative content reflows with reduced motion and WCAG text spacing", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "quality-chromium-desktop", "one pinned Chromium project owns exact reflow widths");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const profile of profiles) {
    const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
    for (const width of [320, 366, 390, 1280]) {
      await page.setViewportSize({ width, height: width < 1000 ? 844 : 720 });
      for (const route of routes) {
        await page.goto(`${profile.origin}${route.pathname}`, { waitUntil: "networkidle" });
        expect(await hasPageReflow(page), `${profile.name} ${route.pathname} at ${width}px`).toBe(true);
        const motion = await page.locator("a, button").first().evaluate((element) => {
          const style = getComputedStyle(element);
          const durations = [...style.transitionDuration.split(","), ...style.animationDuration.split(",")];
          return Math.max(...durations.map((value) => value.endsWith("ms")
            ? Number.parseFloat(value)
            : Number.parseFloat(value) * 1000));
        });
        expect(motion, `${profile.name} ${route.pathname} reduced-motion duration`).toBeLessThanOrEqual(0.01);
      }
    }

    await page.setViewportSize({ width: 320, height: 844 });
    for (const route of routes) {
      await page.goto(`${profile.origin}${route.pathname}`, { waitUntil: "networkidle" });
      await page.addStyleTag({ content: `
        body { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        p { margin-block-end: 2em !important; }
      ` });
      expect(await hasPageReflow(page), `${profile.name} ${route.pathname} with WCAG text spacing`).toBe(true);
      await expect(page.locator("main#main-content")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
    }
  }
});

test("prerendered representative journeys remain useful without JavaScript", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "quality-chromium-desktop", "one pinned Chromium project owns no-JavaScript evidence");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
    colorScheme: "dark",
  });
  const page = await context.newPage();
  try {
    for (const profile of profiles) {
      const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
      for (const route of routes) {
        const response = await page.goto(`${profile.origin}${route.pathname}`, { waitUntil: "load" });
        expect(response?.status(), `${profile.name} ${route.pathname} no-JavaScript status`).toBe(route.id === "not-found" ? 404 : 200);
        await expect(page.locator("main#main-content")).toBeVisible();
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("main a[href]").first()).toBeVisible();
        expect(await hasPageReflow(page), `${profile.name} ${route.pathname} no-JavaScript reflow`).toBe(true);
        await expect(page.locator("html")).not.toHaveAttribute("data-hydrated", "true");
      }
    }
  } finally {
    await context.close();
  }
});

test("theme first paint and interaction survive denied storage", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "quality-chromium-desktop", "one pinned Chromium project owns first-paint evidence");
  for (const profile of profiles) {
    const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(Storage.prototype, "getItem", {
        configurable: true,
        value() { throw new DOMException("Storage read denied", "SecurityError"); },
      });
      Object.defineProperty(Storage.prototype, "setItem", {
        configurable: true,
        value() { throw new DOMException("Storage write denied", "SecurityError"); },
      });
      window.__themeAtDomContentLoaded = null;
      document.addEventListener("DOMContentLoaded", () => {
        window.__themeAtDomContentLoaded = {
          theme: document.documentElement.dataset.theme,
          color: document.querySelector('meta[name="theme-color"]')?.content,
        };
      }, { once: true });
    });
    try {
      const homePath = profile.basePath ? `${profile.basePath}/` : "/";
      await page.goto(`${profile.origin}${homePath}`, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f8f8f6");
      expect(await page.evaluate(() => window.__themeAtDomContentLoaded)).toEqual({ theme: "light", color: "#f8f8f6" });

      await page.getByRole("button", { name: "Switch to dark appearance" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0b0b0c");
      expect(errors, `${profile.name} denied-storage errors`).toEqual([]);
    } finally {
      await context.close();
    }
  }
});

test("forced colors preserves visible focus and operable navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "quality-chromium-desktop", "one pinned Chromium project owns forced-colors evidence");
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  for (const profile of profiles) {
    const homePath = profile.basePath ? `${profile.basePath}/` : "/";
    await page.goto(`${profile.origin}${homePath}`, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    const focusStyle = await skip.evaluate((element) => {
      const style = getComputedStyle(element);
      return { width: Number.parseFloat(style.outlineWidth), style: style.outlineStyle };
    });
    expect(focusStyle.width).toBeGreaterThanOrEqual(2);
    expect(focusStyle.style).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main-content")).toBeFocused();
    await expect(page.getByRole("searchbox", { name: "Search skills" })).toBeVisible();
    expect(await hasPageReflow(page)).toBe(true);
  }
});

test("critical interactions acknowledge input within the deterministic budget", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "quality-chromium-desktop", "one pinned Chromium project owns interaction timing");
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => new Promise((resolve) => {
          window.__finishQualityCopy = resolve;
        }),
      },
    });
  });

  for (const profile of profiles) {
    const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
    const home = routes.find((route) => route.id === "home");
    const skill = routes.find((route) => route.id === "skill");
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${profile.origin}${home.pathname}`, { waitUntil: "networkidle" });

    await acknowledgeWithinBudget(page,
      () => page.getByRole("searchbox", { name: "Search skills" }).fill("tailwind"),
      () => expect(page.getByText("1 of 34 skills")).toBeVisible(),
      `${profile.name} search`);
    await acknowledgeWithinBudget(page,
      () => page.getByRole("button", { name: "Switch to dark appearance" }).click(),
      () => expect(page.locator("html")).toHaveAttribute("data-theme", "dark"),
      `${profile.name} theme`);
    await page.getByRole("link", { name: "Recipes", exact: true }).first().click();
    await expect(page.getByRole("searchbox", { name: "Search recipes" })).toBeVisible();
    await page.goBack({ waitUntil: "networkidle" });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "networkidle" });
    await acknowledgeWithinBudget(page,
      () => page.getByRole("button", { name: "Open navigation" }).click(),
      () => expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeVisible(),
      `${profile.name} Sidebar`);
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${profile.origin}${skill.pathname}`, { waitUntil: "networkidle" });
    const disclosure = page.getByRole("button", { name: /^Expand / }).first();
    const collapseName = (await disclosure.getAttribute("aria-label")).replace(/^Expand /, "Collapse ");
    await acknowledgeWithinBudget(page,
      () => disclosure.click(),
      () => expect(page.getByRole("button", { name: collapseName })).toHaveAttribute("aria-expanded", "true"),
      `${profile.name} disclosure`);
    const copy = page.getByRole("button", { name: "Copy install command" });
    await acknowledgeWithinBudget(page,
      () => copy.click(),
      () => expect(copy).toHaveAttribute("aria-busy", "true"),
      `${profile.name} copy`);
    await page.evaluate(() => window.__finishQualityCopy());
  }
});

function isExpectedNotFoundConsole(error, profile, route) {
  return route.id === "not-found"
    && error.kind === "console"
    && error.url === `${profile.origin}${route.pathname}`
    && /status of 404|status code: 404|\b404\b/.test(error.text);
}

async function hasPageReflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}

async function acknowledgeWithinBudget(page, action, assertion, label) {
  const started = await page.evaluate(() => performance.now());
  await action();
  await assertion();
  const elapsed = await page.evaluate((value) => performance.now() - value, started);
  expect(elapsed, `${label} acknowledgement`).toBeLessThanOrEqual(200);
}
