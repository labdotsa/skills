import { expect, test } from "@playwright/test";

test("prerenders the complete Skill directory from the shared Catalog", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("searchbox", { name: "Search skills" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open .* skill/ })).toHaveCount(6);
  for (const name of [
    "build-product-artifacts",
    "copywriting",
    "deconstruct",
    "information-architecture",
    "seo-engine",
    "tailwind",
  ]) {
    await expect(page.getByRole("link", { name: `Open ${name} skill` })).toBeVisible();
  }
});

test("filters the active directory locally and announces the result count", async ({ page }) => {
  const catalogRequests = [];
  page.on("request", (request) => {
    if (/\/(?:skills|recipes)\.json$/.test(new URL(request.url()).pathname)) catalogRequests.push(request.url());
  });
  await page.goto("/");

  const search = page.getByRole("searchbox", { name: "Search skills" });
  await search.fill("TAILWIND");

  await expect(page.getByRole("link", { name: "Open tailwind skill" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open .* skill/ })).toHaveCount(1);
  await expect(page.locator('p[aria-live="polite"]')).toHaveText("1 of 6 skills");
  expect(catalogRequests).toEqual([]);
});

test("keeps Skills as the home collection and routes Recipes through global navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search skills" }).fill("tailwind");
  await expect(page.getByRole("tab")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Recipes", exact: true }).first()).toHaveAttribute("href", "/recipes/");
  await page.getByRole("link", { name: "Skills", exact: true }).first().click();
  await page.getByRole("searchbox", { name: "Search skills" }).fill("");
  await page.getByRole("button", { name: /Product 02/ }).click();
  await expect(page.getByRole("button", { name: /Product 02/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /Open .* skill/ })).toHaveCount(2);
  await expect(page.getByText("2 of 6 skills")).toBeVisible();
  await page.getByRole("link", { name: "Recipes", exact: true }).first().click();
  await expect(page).toHaveURL(/\/recipes\/$/);
  await expect(page.getByRole("searchbox", { name: "Search recipes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toBeVisible();
});

test("links rows to clean base-aware detail routes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Open tailwind skill" })).toHaveAttribute("href", "/skills/tailwind/");
  await page.getByRole("link", { name: "Recipes", exact: true }).first().click();
  await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toHaveAttribute(
    "href",
    "/recipes/functional-prototype/",
  );
  await page.getByRole("link", { name: "Skills", exact: true }).first().click();
  await page.getByRole("link", { name: "Open tailwind skill" }).click();
  await expect(page).toHaveURL(/\/skills\/tailwind\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "tailwind" })).toBeVisible();
});

test("clears an empty result and supports the accessible search shortcut", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search skills" });
  await search.fill("nothing-in-this-library");

  await expect(page.getByText("No item matches that search.")).toBeVisible();
  await expect(page.getByText("0 of 6 skills")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("link", { name: /Open .* skill/ })).toHaveCount(6);

  await page.getByRole("heading", { level: 1 }).click();
  await page.keyboard.press("/");
  await expect(search).toBeFocused();
});

test("keeps the workbench usable at narrow widths and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("searchbox", { name: "Search skills" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Recipes", exact: true }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const descriptionHeight = await page.locator('[aria-label="Open build-product-artifacts skill"] .line-clamp-3').evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(descriptionHeight).toBeLessThanOrEqual(84);
  const transitionDuration = await page.getByRole("link", { name: "Open tailwind skill" }).evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration) || 0,
  );
  expect(transitionDuration).toBeLessThanOrEqual(0.01);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the complete Skill directory and Recipe route navigation available", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /Open .* skill/ })).toHaveCount(6);
    await expect(page.getByRole("link", { name: "Open Functioning Prototype recipe" })).toHaveCount(0);
    await expect(page.getByText("Filtering needs JavaScript; the complete Skill directory remains available below.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Recipes", exact: true }).first()).toHaveAttribute("href", "./recipes/");
  });
});
