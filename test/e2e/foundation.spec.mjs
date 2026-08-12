import { expect, test } from "@playwright/test";

test("renders the complete server-prerendered shell without remote presentation assets", async ({ page }) => {
  const remotePresentationRequests = [];
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4173" && ["document", "font", "image", "script", "stylesheet"].includes(request.resourceType())) {
      remotePresentationRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Open-source agent skills for digital product teams." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse agent skills" })).toHaveAttribute("href", "#catalog");
  await expect(page.getByRole("link", { name: "Explore workflow recipes" })).toHaveAttribute("href", "/recipes/");
  await expect(page.locator("[data-lab-hero]")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Skills", exact: true }).first()).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Recipes", exact: true }).first()).toHaveAttribute("href", "/recipes/");
  await expect(page.getByText("6 of 6 skills")).toBeVisible();
  await expect(page.locator("[data-catalog-snapshot]")).toHaveAttribute("data-catalog-snapshot", /^sha256:[0-9a-f]{64}$/);
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.locator("[data-site-header] [data-lab-wordmark]")).toHaveAttribute("data-variant", "mark");
  await expect(page.locator('img[src*="brand/logo.svg"]').first()).toBeVisible();
  expect(pageErrors).toEqual([]);
  expect(remotePresentationRequests).toEqual([]);
});

test("skip navigation moves focus to the main landmark", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();
});

test("theme selection persists across reloads", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Switch to dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("copy control reports success", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Copy install command" }).click();
  await expect(page.getByRole("button", { name: "Copy install command: copied" })).toBeVisible();
  await expect(page.getByText("Install command copied")).toBeVisible();
});

test("unknown routes return the useful prerendered 404", async ({ page }) => {
  const response = await page.goto("/missing-route");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "This page is not in the library." })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});

test("foundation has no horizontal page overflow", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("directory rows reveal their pillar treatment and clickable affordance on hover", async ({ page }) => {
  await page.goto("/");
  const row = page.getByRole("link", { name: "Open build-product-artifacts skill" });
  const resting = await row.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    rail: getComputedStyle(element, "::before").transform,
    cursor: getComputedStyle(element).cursor,
  }));

  await row.hover();

  const active = await row.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    rail: getComputedStyle(element, "::before").transform,
  }));
  expect(resting.cursor).toBe("pointer");
  expect(active.background).not.toBe(resting.background);
  expect(active.rail).not.toBe(resting.rail);
});

test("skills and recipes use direction-aware navigation without moving the shell", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await page.evaluate(() => {
    window.localStorage.removeItem("test-navigation-direction");
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value(update) {
        window.localStorage.setItem("test-navigation-direction", document.documentElement.dataset.navigationDirection ?? "");
        const updateCallbackDone = Promise.resolve().then(update);
        return {
          finished: updateCallbackDone,
          ready: Promise.resolve(),
          updateCallbackDone,
          skipTransition() {},
          types: new Set(),
        };
      },
    });
  });

  await page.getByRole("link", { name: "Recipes", exact: true }).first().click();
  await expect(page).toHaveURL(/\/recipes\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Agent workflow recipes for product delivery." })).toBeVisible();
  expect(await page.evaluate(() => window.localStorage.getItem("test-navigation-direction"))).toBe("forward");

  await page.goto("/recipes/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await page.evaluate(() => {
    window.localStorage.removeItem("test-navigation-direction");
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value(update) {
        window.localStorage.setItem("test-navigation-direction", document.documentElement.dataset.navigationDirection ?? "");
        const updateCallbackDone = Promise.resolve().then(update);
        return {
          finished: updateCallbackDone,
          ready: Promise.resolve(),
          updateCallbackDone,
          skipTransition() {},
          types: new Set(),
        };
      },
    });
  });
  await page.getByRole("link", { name: "Skills", exact: true }).first().click();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem("test-navigation-direction"))).toBe("backward");
  await expect(page.getByRole("heading", { level: 1, name: "Open-source agent skills for digital product teams." })).toBeVisible();

  expect(await page.evaluate(() => window.localStorage.getItem("test-navigation-direction"))).toBe("backward");
});

test("the shared shell keeps breathing room before the footer", async ({ page }) => {
  await page.goto("/");
  const gap = await page.evaluate(() => {
    const finalSection = document.querySelector("#catalog");
    const footer = document.querySelector("[data-site-footer]");
    if (!finalSection || !footer) return 0;
    return footer.getBoundingClientRect().top - finalSection.getBoundingClientRect().bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(64);
});

test("all hero families share one layout and responsive title contract", async ({ page }) => {
  const routes = ["/", "/recipes/", "/skills/build-product-artifacts/", "/recipes/functional-prototype/"];
  const desktopSignatures = [];

  for (const route of routes) {
    await page.goto(route);
    const hero = page.locator("[data-lab-hero]");
    await expect(hero).toHaveCount(1);
    desktopSignatures.push(await hero.evaluate((element) => {
      const title = element.querySelector("[data-lab-hero-title]");
      const support = element.querySelector("[data-lab-hero-support]");
      if (!(title instanceof HTMLElement) || !(support instanceof HTMLElement)) return null;
      const titleStyle = getComputedStyle(title);
      return {
        fontSize: titleStyle.fontSize,
        lineHeight: titleStyle.lineHeight,
        maxWidth: titleStyle.maxWidth,
        supportDisplay: getComputedStyle(support).display,
      };
    }));
  }

  expect(new Set(desktopSignatures.map((signature) => JSON.stringify(signature))).size).toBe(1);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileSignatures = [];
  for (const route of routes) {
    await page.goto(route);
    mobileSignatures.push(await page.locator("[data-lab-hero]").evaluate((element) => {
      const title = element.querySelector("[data-lab-hero-title]");
      const support = element.querySelector("[data-lab-hero-support]");
      if (!(title instanceof HTMLElement) || !(support instanceof HTMLElement)) return null;
      const titleStyle = getComputedStyle(title);
      return {
        fontSize: titleStyle.fontSize,
        lineHeight: titleStyle.lineHeight,
        maxWidth: titleStyle.maxWidth,
        supportDisplay: getComputedStyle(support).display,
      };
    }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  expect(new Set(mobileSignatures.map((signature) => JSON.stringify(signature))).size).toBe(1);
});

test("mobile Sidebar closes with Escape and restores trigger focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation behavior");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeVisible();
  await expect(page.locator('[data-slot="sidebar"][data-mobile="true"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeHidden();
  await expect(trigger).toBeFocused();
});
