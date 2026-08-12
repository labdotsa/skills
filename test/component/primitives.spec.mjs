import { expect, test } from "@playwright/test";

test("Button and Input expose callbacks, state, attributes, binding, and class merging", async ({ page }) => {
  await page.goto("/");

  const increment = page.getByRole("button", { name: "Increment" });
  await increment.click();
  await expect(page.getByText("Count 1")).toBeVisible();
  expect(await increment.evaluate((button) => getComputedStyle(button).height)).toBe("44px");
  await expect(page.getByRole("button", { name: "Unavailable" })).toBeDisabled();

  const input = page.getByRole("textbox", { name: "Component input" });
  await input.fill("Public API");
  await expect(page.getByText("Public API")).toBeVisible();
});

test("Tabs and Collapsible follow keyboard state while Breadcrumb and Separator keep semantics", async ({ page }) => {
  await page.goto("/");

  const overview = page.getByRole("tab", { name: "Overview" });
  const details = page.getByRole("tab", { name: "Details" });
  await overview.focus();
  await page.keyboard.press("ArrowRight");
  await expect(details).toBeFocused();
  await expect(details).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveText("Details panel");

  const disclosure = page.getByRole("button", { name: "Component disclosure" });
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await disclosure.click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Disclosed content")).toBeVisible();

  await expect(page.getByRole("navigation", { name: "Component breadcrumb" })).toContainText("Current page");
  await expect(page.getByRole("separator")).toHaveAttribute("data-orientation", "horizontal");
});

test("Sheet restores focus, Tooltip names help, and Sonner announces feedback", async ({ page }) => {
  await page.goto("/");

  const sheetTrigger = page.getByRole("button", { name: "Open component sheet" });
  await sheetTrigger.click();
  const sheet = page.getByRole("dialog", { name: "Component sheet" });
  await expect(sheet).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(sheetTrigger).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("pointer-events", "auto");

  const help = page.getByRole("button", { name: "Component help" });
  await page.keyboard.press("Tab");
  await expect(help).toBeFocused();
  await expect(page.getByRole("tooltip")).toHaveText("Helpful component detail");

  await page.getByRole("button", { name: "Notify success" }).click();
  await expect(page.getByText("Component saved")).toBeVisible();
});
