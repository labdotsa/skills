import { expect, test } from "@playwright/test";
import { loadRepresentativeRoutes } from "../quality/load-routes.mjs";

const profiles = [
  { name: "canonical", origin: "http://127.0.0.1:4173", root: ".artifacts/e2e", basePath: "" },
  { name: "pages-project", origin: "http://127.0.0.1:4174", root: ".artifacts/e2e-pages", basePath: "/skills" },
];

test("pins equivalent representative light and dark publication views", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const profile of profiles) {
      const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
      await page.goto(`${profile.origin}${routes.find((route) => route.id === "home").pathname}`, { waitUntil: "networkidle" });
      await page.evaluate((selectedTheme) => localStorage.setItem("labs-color-theme", selectedTheme), theme);
      for (const route of routes) {
        const response = await page.goto(`${profile.origin}${route.pathname}`, { waitUntil: "networkidle" });
        expect(response?.status()).toBe(route.id === "not-found" ? 404 : 200);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${route.id}-${theme}.png`, {
          animations: "disabled",
          caret: "hide",
          fullPage: true,
        });
      }
    }
  }
});

test("pins the meaningful empty directory state", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const profile of profiles) {
      const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
      const home = routes.find((route) => route.id === "home");
      await page.goto(`${profile.origin}${home.pathname}`, { waitUntil: "networkidle" });
      await page.evaluate((selectedTheme) => localStorage.setItem("labs-color-theme", selectedTheme), theme);
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("searchbox", { name: "Search skills" }).fill("nothing-in-this-library");
      await expect(page.getByText("No item matches that search.")).toBeVisible();
      await page.evaluate(() => document.activeElement?.blur());
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("[data-directory-enhanced]")).toHaveScreenshot(`home-empty-${theme}.png`, {
        animations: "disabled",
        caret: "hide",
      });
    }
  }
});

test("pins the open mobile navigation state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "visual-mobile", "the Sheet is a mobile-only visual state");
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const profile of profiles) {
      const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
      const home = routes.find((route) => route.id === "home");
      await page.goto(`${profile.origin}${home.pathname}`, { waitUntil: "networkidle" });
      await page.evaluate((selectedTheme) => localStorage.setItem("labs-color-theme", selectedTheme), theme);
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`home-sheet-${theme}.png`, {
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });
      await page.keyboard.press("Escape");
    }
  }
});
