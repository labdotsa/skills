import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("prerenders the complete Recipe reading journey from one typed view", async ({ page }) => {
  await page.goto("/recipes/functional-prototype/");

  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("LAB Recipes");
  await expect(page.getByRole("heading", { level: 1, name: "Functioning Prototype" })).toBeVisible();
  await expect(page.locator("[data-lab-hero]")).toHaveCount(1);
  await expect(page.getByText("Outcome", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("complementary", { name: "Recipe details" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Recipe contents" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Foundation" })).toHaveAttribute(
    "href",
    "#content-conversation-foundation-layer",
  );
  await expect(page.getByRole("heading", { level: 2, name: "Foundation" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Information Gathering" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 4, name: "Digging Deeper" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Visuals" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Planning" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Implementation" })).toBeVisible();
  await expect(page.locator("blockquote").filter({ hasText: "Handoff · Foundation → Visuals" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Skills and tools required by this Recipe" })).toBeVisible();
  await expect(page.locator("[data-recipe-requirements-table] tbody tr")).toHaveCount(8);
  await expect(page.getByText("npx skills add mattpocock/skills --skill wayfinder")).toBeVisible();
  await expect(page.getByText("Use $imagegen in Codex")).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse Recipe source on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/labdotsa/skills/tree/master/recipes/functional-prototype",
  );
  await expect(page.locator("h1")).toHaveCount(1);
});

test("keeps deep links, current contents, focus, and reduced motion synchronized", async ({ page }) => {
  await page.addInitScript(() => {
    window.recipeScrolls = [];
    Element.prototype.scrollIntoView = function scrollIntoView(options) {
      window.recipeScrolls.push({ id: this.id, options });
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/recipes/functional-prototype/#content-conversation-planning-layer");

  const contents = page.getByRole("navigation", { name: "Recipe contents" });
  await expect(contents.getByRole("link", { name: "Planning" })).toHaveAttribute("aria-current", "location");

  const visuals = contents.getByRole("link", { name: "Visuals", exact: true });
  await visuals.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#content-conversation-visuals-layer$/);
  await expect(page.getByRole("heading", { level: 2, name: "Visuals" })).toBeFocused();
  await expect(visuals).toHaveAttribute("aria-current", "location");
  expect(await page.evaluate(() => window.recipeScrolls.at(-1))).toEqual({
    id: "content-conversation-visuals-layer",
    options: { behavior: "auto", block: "start" },
  });
});

test("updates current contents as the reading viewport moves", async ({ page }) => {
  await page.goto("/recipes/functional-prototype/");

  await page.getByRole("heading", { level: 2, name: "Planning" }).evaluate((heading) => {
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 120);
  });

  await expect(page.getByRole("navigation", { name: "Recipe contents" }).getByRole("link", { name: "Planning" })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("exposes exactly-once busy, success, and reset feedback for Recipe copies", async ({ page }) => {
  await page.addInitScript(() => {
    let finishCopy;
    window.recipeClipboardWrites = 0;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => {
          window.recipeClipboardWrites += 1;
          return new Promise((resolve) => {
            finishCopy = resolve;
            window.finishRecipeCopy = () => finishCopy();
          });
        },
      },
    });
  });
  await page.goto("/recipes/functional-prototype/");

  const installCopy = page.getByRole("button", { name: "Copy wayfinder install command" });
  await installCopy.click();
  await installCopy.click({ force: true });
  await expect(installCopy).toHaveAttribute("aria-busy", "true");
  await expect(installCopy.locator('[data-icon="busy"]')).toBeVisible();
  expect(await page.evaluate(() => window.recipeClipboardWrites)).toBe(1);

  await page.evaluate(() => window.finishRecipeCopy());
  await expect(page.getByRole("button", { name: "Copy wayfinder install command: copied" })).toBeVisible();
  await expect(page.getByText("wayfinder install command copied", { exact: true })).toHaveCount(1);
  await expect(installCopy).toHaveAttribute("data-copy-state", "idle", { timeout: 2500 });

  const promptCopy = page.getByRole("button", { name: "Copy prompt" }).first();
  await promptCopy.click();
  await expect(promptCopy).toHaveAttribute("aria-busy", "true");
  await page.evaluate(() => window.finishRecipeCopy());
  await expect(page.getByText("Prompt copied", { exact: true })).toHaveCount(1);
  await expect(promptCopy).toHaveAttribute("data-copy-state", "idle", { timeout: 2500 });
});

test("falls back after clipboard denial and announces a recoverable Recipe copy failure", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new DOMException("Denied", "NotAllowedError"); } },
    });
    window.recipeFallbackSucceeds = true;
    document.execCommand = () => window.recipeFallbackSucceeds;
  });
  await page.goto("/recipes/functional-prototype/");

  await page.getByRole("button", { name: "Copy wayfinder install command" }).click();
  await expect(page.getByRole("button", { name: "Copy wayfinder install command: copied" })).toBeVisible();
  await expect(page.getByText("wayfinder install command copied", { exact: true })).toHaveCount(1);

  await page.evaluate(() => { window.recipeFallbackSucceeds = false; });
  const promptCopy = page.getByRole("button", { name: "Copy prompt" }).first();
  await promptCopy.click();
  await expect(promptCopy).toHaveAttribute("data-copy-state", "error");
  await expect(page.getByText("Copy failed. Select and copy the command manually.", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Copy failed. Select and copy the command manually.", { exact: true })).toBeVisible();
});

test("serves recipe.html as the same canonical Recipe screen and view model", async ({ page }) => {
  await page.goto("/recipes/functional-prototype/");
  const canonicalSnapshot = await page.locator("[data-recipe-page]").getAttribute("data-catalog-snapshot");
  const canonicalPhases = await page.locator("[data-recipe-phase]").evaluateAll((phases) =>
    phases.map((phase) => phase.getAttribute("data-recipe-phase")),
  );

  const response = await page.goto("/recipe.html");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Functioning Prototype" })).toBeVisible();
  await expect(page.locator("[data-recipe-page]")).toHaveAttribute("data-catalog-snapshot", canonicalSnapshot ?? "");
  expect(await page.locator("[data-recipe-phase]").evaluateAll((phases) =>
    phases.map((phase) => phase.getAttribute("data-recipe-phase")),
  )).toEqual(canonicalPhases);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/",
  );
});

test("has no unsuppressed WCAG A or AA axe violations", async ({ page }) => {
  await page.goto("/recipes/functional-prototype/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("keeps Recipe contents and code usable at 320px and 366px without page overflow", async ({ page, isMobile }) => {
  test.skip(isMobile, "sets exact narrow regression widths in the desktop browser project");

  for (const width of [320, 366]) {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/recipes/functional-prototype/");

    await expect(page.getByRole("navigation", { name: "Recipe contents" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Implementation" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.getByRole("region", { name: /^Copy prompt content / }).first()).toHaveAttribute("tabindex", "0");
  }

  await page.setViewportSize({ width: 800, height: 800 });
  await page.goto("/recipes/functional-prototype/");
  await expect(page.locator("[data-recipe-step]").first().locator("div").first()).toHaveCSS("position", "sticky");
});

test("hydrates without content fetches, unsafe URLs, console errors, or remote presentation requests", async ({ page }) => {
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

  await page.goto("/recipes/functional-prototype/");

  expect(await page.locator('[data-recipe-page] a[href]').evaluateAll((links) =>
    links.filter((link) => /^(?:javascript|data|vbscript):/i.test(link.getAttribute("href") ?? "")).length,
  )).toBe(0);
  expect(failures).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(catalogRequests).toEqual([]);
  expect(remotePresentationRequests).toEqual([]);
});

test("matches representative light and dark Recipe reading views", async ({ page, isMobile }) => {
  await page.goto("/recipes/functional-prototype/");
  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveScreenshot("recipe-detail-light.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Switch to dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile) await page.keyboard.press("Escape");

  await expect(page).toHaveScreenshot("recipe-detail-dark.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });
});

test("matches the same Recipe journey, alias, deep links, and visuals at the Pages project base", async ({ page, isMobile }) => {
  await page.goto("http://127.0.0.1:4174/skills/recipes/functional-prototype/#content-conversation-foundation-layer");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByRole("heading", { level: 1, name: "Functioning Prototype" })).toBeVisible();
  const recipesPath = await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "LAB Recipes" }).evaluate(
    (link) => new URL(link.href).pathname,
  );
  expect(recipesPath).toBe("/skills/recipes/");
  await expect(page.getByRole("navigation", { name: "Recipe contents" }).getByRole("link", { name: "Foundation", exact: true })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/",
  );
  await expect(page).toHaveScreenshot("recipe-detail-light.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Switch to dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if (isMobile) await page.keyboard.press("Escape");
  await expect(page).toHaveScreenshot("recipe-detail-dark.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    maxDiffPixelRatio: 0.005,
  });

  const aliasResponse = await page.goto("http://127.0.0.1:4174/skills/recipe.html");
  expect(aliasResponse?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 2, name: "Implementation" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://skills.lab.sa/recipes/functional-prototype/",
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("prerenders the complete Recipe, requirements, prompts, deep links, and alias", async ({ page }) => {
    await page.goto("/recipes/functional-prototype/#content-conversation-implementation");

    await expect(page.getByRole("heading", { level: 2, name: "Implementation" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 4, name: "Clear Things Up" })).toBeVisible();
    await expect(page.getByText("npx skills add mattpocock/skills --skill tdd")).toBeVisible();
    await expect(page.getByText("Based on the current screen structure in @artifacts", { exact: false })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Recipe contents" }).getByRole("link", { name: "Implementation", exact: true })).toHaveAttribute(
      "href",
      "#content-conversation-implementation",
    );

    const aliasResponse = await page.goto("/recipe.html");
    expect(aliasResponse?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 2, name: "Foundation" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Implementation" })).toBeVisible();
  });
});
