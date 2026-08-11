import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("prerenders the complete Recipe index from the shared Catalog", async ({ page }) => {
  const catalogRequests = [];
  page.on("request", (request) => {
    if (/\/(?:skills|recipes)\.json$/.test(new URL(request.url()).pathname)) catalogRequests.push(request.url());
  });

  await page.goto("/recipes/");

  await expect(page.getByRole("heading", { level: 1, name: /LAB Recipes turn focused skills into complete delivery/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse the recipes" })).toHaveAttribute("href", "#recipe-catalog");
  await expect(page.getByRole("link", { name: "Explore skills" })).toHaveAttribute("href", "/#catalog");
  await expect(page.getByRole("heading", { level: 2, name: "Recipes" })).toBeVisible();
  await expect(page.getByText("1 sequenced playbook, maintained in source.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toHaveAttribute(
    "href",
    "/recipes/functional-prototype/",
  );
  await expect(page.getByText("Foundation → Visuals → Planning → Implementation")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://skills.lab.sa/recipes/");
  expect(catalogRequests).toEqual([]);
});

test("serves recipes.html as the same canonical Recipe-index screen", async ({ page }) => {
  await page.goto("/recipes/");
  const canonicalSnapshot = await page.locator("[data-recipe-index]").getAttribute("data-catalog-snapshot");

  const response = await page.goto("/recipes.html");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: /LAB Recipes turn focused skills into complete delivery/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toHaveAttribute(
    "href",
    "/recipes/functional-prototype/",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://skills.lab.sa/recipes/");
  await expect(page.locator("[data-recipe-index]")).toHaveAttribute("data-catalog-snapshot", canonicalSnapshot ?? "");
});

test("filters Recipe phases locally and clears back to a focused complete index", async ({ page }) => {
  const catalogRequests = [];
  page.on("request", (request) => {
    if (/\/(?:skills|recipes)\.json$/.test(new URL(request.url()).pathname)) catalogRequests.push(request.url());
  });
  await page.goto("/recipes/");

  const search = page.getByRole("searchbox", { name: "Search recipes" });
  await search.fill("VISUALS");
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toBeVisible();
  await expect(page.getByText("1 of 1 recipes")).toBeVisible();

  await search.fill("nothing-in-this-library");
  await expect(page.getByText("No recipe matches that search.")).toBeVisible();
  await expect(page.getByText("0 of 1 recipes")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");

  const category = page.getByRole("button", { name: "Product delivery 01" });
  await category.click();
  await expect(category).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toBeVisible();

  await page.getByRole("heading", { level: 1 }).click();
  await page.keyboard.press("/");
  await expect(search).toBeFocused();
  expect(catalogRequests).toEqual([]);
});

test("has no unsuppressed WCAG A or AA axe violations", async ({ page }) => {
  await page.goto("/recipes/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("keeps the complete Recipe index usable at 320px with reduced motion", async ({ page, isMobile }) => {
  test.skip(isMobile, "sets an exact narrow regression width in the desktop browser project");
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/recipes/");

  await expect(page.getByRole("heading", { level: 1, name: /LAB Recipes/ })).toBeVisible();
  await expect(page.getByText("Foundation → Visuals → Planning → Implementation")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const transitionDuration = await page.getByRole("link", { name: "Open Functioning Prototype recipe" }).evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration) || 0,
  );
  expect(transitionDuration).toBeLessThanOrEqual(0.01);
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

  await page.goto("/recipes/");

  expect(await page.locator('[aria-label="Recipe workflow"] svg').evaluateAll(
    (icons) => icons.length > 0 && icons.every((icon) => icon.getAttribute("aria-hidden") === "true"),
  )).toBe(true);
  expect(failures).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(catalogRequests).toEqual([]);
  expect(remotePresentationRequests).toEqual([]);
});

test("matches the representative light and dark Recipe-index views", async ({ page, isMobile }) => {
  await page.goto("/recipes/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveScreenshot("recipe-index-light.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: /Use dark appearance|Dark/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile) await page.keyboard.press("Escape");

  await expect(page).toHaveScreenshot("recipe-index-dark.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });
});

test("matches the same Recipe index and alias at the Pages project base", async ({ page, isMobile }) => {
  await page.goto("http://127.0.0.1:4174/skills/recipes/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1, name: /LAB Recipes/ })).toBeVisible();
  const recipePath = await page.getByRole("link", { name: "Open Functioning Prototype recipe" }).evaluate(
    (link) => new URL(link.href).pathname,
  );
  expect(recipePath).toBe("/skills/recipes/functional-prototype/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://skills.lab.sa/recipes/");
  await expect(page).toHaveScreenshot("recipe-index-light.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: /Use dark appearance|Dark/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile) await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("recipe-index-dark.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  const aliasResponse = await page.goto("http://127.0.0.1:4174/skills/recipes.html");
  expect(aliasResponse?.status()).toBe(200);
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://skills.lab.sa/recipes/");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the complete Recipe index, phases, and navigation available", async ({ page }) => {
    await page.goto("/recipes/");

    const recipePath = await page.getByRole("link", { name: "Open Functioning Prototype recipe" }).evaluate(
      (link) => new URL(link.href).pathname,
    );
    expect(recipePath).toBe("/recipes/functional-prototype/");
    await expect(page.getByText("Foundation → Visuals → Planning → Implementation")).toBeVisible();
    await expect(page.getByText("Filtering needs JavaScript; the complete Recipe directory remains available below.")).toBeVisible();
    await expect(page.getByText("No recipe matches that search.")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Browse the recipes" })).toHaveAttribute("href", "#recipe-catalog");
  });
});
