import { expect, test } from "@playwright/test";

test("searches the Skill directory from the keyboard", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("6 of 6 skills")).toBeVisible();
  await page.keyboard.press("/");

  const search = page.getByRole("searchbox", { name: "Search skills" });
  await expect(search).toBeFocused();
  await search.fill("tailwind");

  await expect(page.getByText("1 of 6 skills")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open tailwind skill" })).toBeVisible();
});

test("persists theme changes and announces copied commands", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const themeToggle = page.locator("[data-theme-toggle]:visible").first();
  await expect(themeToggle).toHaveAttribute("aria-label", "Switch to light mode");
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("labs-color-theme"))).toBe("light");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const copyButton = page.getByRole("button", { name: "Copy install command" }).first();
  await copyButton.click();
  await expect(copyButton).toHaveAttribute("data-copy-state", "success");
  await expect(page.getByRole("status")).toContainText("Install command copied");
});

test("filters Skills and switches to the Recipe directory", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("6 of 6 skills")).toBeVisible();

  await page.getByRole("button", { name: /Content 01/ }).click();
  await expect(page.getByText("1 of 6 skills")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open copywriting skill" })).toBeVisible();

  const recipesTab = page.getByRole("tab", { name: /Recipes/ });
  await recipesTab.click();
  await expect(recipesTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("1 of 1 recipes")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open Functioning Prototype recipe/ })).toBeVisible();

  const search = page.getByRole("searchbox", { name: "Search recipes" });
  await search.fill("missing recipe");
  await expect(page.getByText("No item matches that search.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toBeFocused();
  await expect(page.getByText("1 of 1 recipes")).toBeVisible();
});

test("opens the mobile navigation with all library destinations", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation is exercised by the mobile parity project.");
  await page.goto("/");

  const menu = page.locator("details.mobile-menu");
  const summary = menu.locator("summary");
  await expect(summary).toHaveAccessibleName("Open navigation");
  await summary.click();
  await expect(menu).toHaveJSProperty("open", true);

  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation.getByRole("link", { name: "Skills" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Recipes" })).toBeVisible();
  await expect(navigation.getByRole("button", { name: /Switch to/ })).toBeVisible();
});

test("reads and expands a generated Skill detail page", async ({ page }) => {
  await page.goto("/skills/tailwind/");

  await expect(page.getByRole("heading", { level: 1, name: "tailwind" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Skill instructions" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Package contents" })).toBeVisible();

  const instructions = page.locator("[data-collapsible]").first();
  const toggle = instructions.locator("[data-collapse-toggle]");
  await expect(toggle).toHaveAccessibleName("Show more");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveText("Show less");

  const copyButton = page.getByRole("button", { name: "Copy install command" });
  await copyButton.click();
  await expect(copyButton).toHaveAttribute("data-copy-state", "success");
});

test("searches and clears the dedicated Recipe index", async ({ page }) => {
  await page.goto("/recipes.html");

  await expect(page.getByText("1 of 1 recipes")).toBeVisible();
  await page.keyboard.press("/");
  const search = page.getByRole("searchbox", { name: "Search recipes" });
  await expect(search).toBeFocused();
  await search.fill("unknown workflow");

  await expect(page.getByText("No recipe matches that search.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toBeFocused();
  await expect(page.getByText("1 of 1 recipes")).toBeVisible();
});

test("navigates and copies from the Recipe reading flow", async ({ page }) => {
  await page.goto("/recipe.html");

  await expect(page.getByRole("heading", { level: 1, name: /Deliver a functioning prototype/ })).toBeVisible();
  const contents = page.getByLabel("Recipe contents");
  const planningLink = contents.getByRole("link", { name: /Planning/ });
  await planningLink.click();
  await expect(planningLink).toHaveAttribute("aria-current", "location");
  await expect(page).toHaveURL(/#planning$/);

  const copyButton = page.getByRole("button", { name: "Copy ticket-drafting prompt" });
  await copyButton.click();
  await expect(copyButton).toHaveAttribute("data-copy-state", "success");
  await expect(page.getByRole("status")).toContainText("Copied to clipboard");

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
