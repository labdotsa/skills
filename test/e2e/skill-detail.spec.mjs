import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("prerenders the complete Skill reading journey from one typed view", async ({ page }) => {
  await page.goto("/skills/tailwind/");

  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("LAB Skills");
  await expect(page.getByRole("heading", { level: 1, name: "tailwind" })).toBeVisible();
  await expect(page.locator("[data-lab-hero]")).toHaveCount(1);
  await expect(page.getByText("npx skills add labdotsa/skills --skill tailwind")).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse source on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/labdotsa/skills/tree/master/skills/tailwind",
  );
  await expect(page.getByRole("heading", { level: 2, name: "Skill instructions" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Tailwind Engineering" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Package contents" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Maintained files included with this skill" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "File" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open SKILL\.md source/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open references/localizable-layout.md source" })).toHaveAttribute(
    "href",
    "https://github.com/labdotsa/skills/blob/master/skills/tailwind/references/localizable-layout.md",
  );
  await expect(page.getByRole("heading", { level: 2, name: "Related skills & recipes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open related skill build-product-artifacts" })).toHaveAttribute(
    "href",
    "/skills/build-product-artifacts/",
  );
});

test("exposes copy busy, success, live feedback, and reset states", async ({ page }) => {
  await page.addInitScript(() => {
    let finishCopy;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => new Promise((resolve) => {
          finishCopy = resolve;
          window.finishInstallCopy = () => finishCopy();
        }),
      },
    });
  });
  await page.goto("/skills/tailwind/");

  const copy = page.getByRole("button", { name: "Copy install command" });
  await copy.click();
  await expect(copy).toHaveAttribute("aria-busy", "true");
  await expect(copy.locator('[data-icon="busy"]')).toBeVisible();

  await page.evaluate(() => window.finishInstallCopy());
  await expect(page.getByRole("button", { name: "Copy install command: copied" })).toBeVisible();
  await expect(page.getByText("Install command copied", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Install command copied", { exact: true })).toBeVisible();

  await expect(copy).toHaveAttribute("data-copy-state", "idle", { timeout: 2500 });
  await expect(copy).toHaveAccessibleName("Copy install command");
});

test("falls back when clipboard permission is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new DOMException("Denied", "NotAllowedError"); } },
    });
    document.execCommand = (command) => command === "copy";
  });
  await page.goto("/skills/tailwind/");

  await page.getByRole("button", { name: "Copy install command" }).click();

  await expect(page.getByRole("button", { name: "Copy install command: copied" })).toBeVisible();
  await expect(page.getByText("Install command copied", { exact: true })).toBeVisible();
});

test("announces a recoverable copy failure", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new DOMException("Denied", "NotAllowedError"); } },
    });
    document.execCommand = () => false;
  });
  await page.goto("/skills/tailwind/");

  const copy = page.getByRole("button", { name: "Copy install command" });
  await copy.click();

  await expect(copy).toHaveAttribute("data-copy-state", "error");
  await expect(page.getByText("Copy failed. Select and copy the command manually.", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Copy failed. Select and copy the command manually.", { exact: true })).toBeVisible();
});

test("collapses only overflowing sections and preserves trigger focus", async ({ page }) => {
  await page.goto("/skills/tailwind/");

  const instructions = page.getByRole("button", { name: "Expand Skill instructions" });
  await expect(instructions).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: /Package contents/ })).toHaveCount(0);
  const clippedTabStops = await page.locator('[data-overflow-disclosure] [data-slot="collapsible-content"]').first().evaluate(
    (region) => {
      const edge = region.getBoundingClientRect().bottom + 1;
      return [...region.querySelectorAll('a[href], button:not([disabled]), [tabindex]')]
        .filter((element) => element.getBoundingClientRect().bottom > edge && element.tabIndex >= 0)
        .map((element) => element.outerHTML);
    },
  );
  expect(clippedTabStops).toEqual([]);

  await instructions.click();
  await expect(page.getByRole("button", { name: "Collapse Skill instructions" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Collapse Skill instructions" })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Collapse Skill instructions" }).click();
  await expect(instructions).toBeFocused();

  await page.goto("/skills/copywriting/");
  await expect(page.getByRole("button", { name: /Package contents/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Open SKILL.md source" })).toBeVisible();
});

test("renders safe code and table surfaces through the shared RichDocument components", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await page.goto("/skills/information-architecture/");
  await page.getByRole("button", { name: "Expand Skill instructions" }).click();

  const codeCopy = page.getByRole("button", { name: "Copy code" }).first();
  await expect(codeCopy).toBeVisible();
  await codeCopy.click();
  await expect(page.getByRole("button", { name: "Copy code: copied" }).first()).toBeVisible();

  await page.goto("/skills/deconstruct/");
  await page.getByRole("button", { name: "Expand Skill instructions" }).click();
  await expect(page.getByRole("table").first()).toBeVisible();
});

test("has no unsuppressed WCAG A or AA axe violations", async ({ page }) => {
  await page.goto("/skills/tailwind/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("keeps the largest Skill resilient at narrow width and reduced motion", async ({ page, isMobile }) => {
  test.skip(isMobile, "sets an exact narrow regression width in the desktop browser project");
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/skills/build-product-artifacts/");

  await expect(page.getByRole("heading", { level: 1, name: "build-product-artifacts" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const disclosureDuration = await page.locator('[data-slot="collapsible-content"]').first().evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration) || 0,
  );
  expect(disclosureDuration).toBeLessThanOrEqual(0.01);
});

test("hydrates without content fetches, console errors, or remote presentation requests", async ({ page }) => {
  const failures = [];
  const pageErrors = [];
  const consoleErrors = [];
  const catalogRequests = [];
  const remotePresentationRequests = [];
  page.on("requestfailed", (request) => failures.push(request.url()));
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (/\/(?:skills|recipes)\.json$/.test(url.pathname)) catalogRequests.push(request.url());
    if (url.origin !== "http://127.0.0.1:4173" && ["font", "image", "script", "stylesheet"].includes(request.resourceType())) {
      remotePresentationRequests.push(request.url());
    }
  });

  await page.goto("/skills/tailwind/");
  await expect(page.locator('[aria-label="Copy install command"] svg')).toHaveAttribute("aria-hidden", "true");
  expect(failures).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(catalogRequests).toEqual([]);
  expect(remotePresentationRequests).toEqual([]);
});

test("matches the representative light and dark Skill views", async ({ page, isMobile }) => {
  await page.goto("/skills/tailwind/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveScreenshot("skill-tailwind-light.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Switch to dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile) await page.keyboard.press("Escape");

  await expect(page).toHaveScreenshot("skill-tailwind-dark.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });
});

test("matches the same Skill journey and visual baselines at the Pages project base", async ({ page, isMobile }) => {
  await page.goto("http://127.0.0.1:4174/skills/skills/tailwind/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1, name: "tailwind" })).toBeVisible();
  const relatedPath = await page.getByRole("link", { name: "Open related skill build-product-artifacts" }).evaluate(
    (link) => new URL(link.href).pathname,
  );
  expect(relatedPath).toBe("/skills/skills/build-product-artifacts/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://skills.lab.sa/skills/tailwind/");
  await expect(page).toHaveScreenshot("skill-tailwind-light.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Switch to dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile) await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("skill-tailwind-dark.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("prerenders complete instructions, package files, and related navigation", async ({ page }) => {
    await page.goto("/skills/tailwind/");

    await expect(page.getByRole("heading", { level: 3, name: "Output contract" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Open .* source/ })).toHaveCount(4);
    await expect(page.getByRole("link", { name: "View raw source" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Open related/ })).toHaveCount(3);
    await expect(page.getByRole("button", { name: /Skill instructions|Package contents/ })).toHaveCount(0);
    const instructionRegion = page.locator('[data-overflow-disclosure] [data-slot="collapsible-content"]').first();
    expect(await instructionRegion.evaluate((element) => element.scrollHeight === element.clientHeight)).toBe(true);
  });
});
