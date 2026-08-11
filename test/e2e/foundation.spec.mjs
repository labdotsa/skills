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
  await expect(page.getByRole("heading", { level: 1, name: /Working knowledge/ })).toBeVisible();
  await expect(page.getByText("6 Skills · 1 Recipe")).toBeVisible();
  await expect(page.locator("[data-catalog-snapshot]")).toHaveAttribute("data-catalog-snapshot", /^sha256:[0-9a-f]{64}$/);
  await expect(page.locator("main#main-content")).toBeVisible();
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
  await page.getByRole("button", { name: /Use dark appearance|Dark/ }).click();
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

test("mobile Sheet closes with Escape and restores trigger focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation behavior");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeHidden();
  await expect(trigger).toBeFocused();
});
