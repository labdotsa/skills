import { expect, test } from "@playwright/test";

async function exposeThemeToggle(page, isMobile) {
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  return page.getByRole("button", { name: /Switch to (dark|light) appearance/ });
}

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
  await expect(page.locator("[data-desktop-navigation] .site-nav-link").nth(0)).toHaveAttribute("aria-current", "page");
  await expect(page.locator("[data-desktop-navigation] .site-nav-link").nth(1)).toHaveAttribute("href", "/recipes/");
  await expect(page.getByText("34 of 34 skills")).toBeVisible();
  await expect(page.locator("[data-catalog-snapshot]")).toHaveAttribute("data-catalog-snapshot", /^sha256:[0-9a-f]{64}$/);
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.locator('[data-site-header] a[aria-label="LAB Skills home"] [data-lab-wordmark]')).toHaveAttribute("data-variant", "mark");
  await expect(page.locator('img[src*="brand/logo.svg"]').first()).toBeVisible();
  expect(pageErrors).toEqual([]);
  expect(remotePresentationRequests).toEqual([]);
});

test("primary CTAs keep their border visually merged with every fill state", async ({ page, isMobile }) => {
  await page.goto("/");
  const primary = page.getByRole("link", { name: "Browse agent skills" });
  const secondary = page.getByRole("link", { name: "Explore workflow recipes" });
  const readSignature = async () => primary.evaluate((element) => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      background: style.backgroundColor,
      border: style.borderTopColor,
      borderWidth: style.borderTopWidth,
      height: bounds.height,
      duration: style.transitionDuration,
    };
  });
  const resting = await readSignature();
  const secondaryHeight = await secondary.evaluate((element) => element.getBoundingClientRect().height);
  expect(resting.border).toBe(resting.background);
  expect(resting.borderWidth).toBe("1px");
  expect(resting.height).toBe(secondaryHeight);
  expect(resting.duration).toBe("0.18s");

  await primary.hover();
  await page.waitForTimeout(220);
  const hovered = await readSignature();
  expect(hovered.border).toBe(hovered.background);
  if (!isMobile) expect(hovered.background).not.toBe(resting.background);
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

test("desktop header actions share one centerline without a divider", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop header alignment");
  await page.goto("/");
  const header = page.locator("[data-site-header]");
  const navigation = header.locator("[data-desktop-navigation]");
  const themeControl = header.locator("[data-desktop-theme-control]");
  const signature = await header.evaluate((element) => {
    const homeMark = element.querySelector('[aria-label="LAB Skills home"] [data-lab-wordmark-mark]');
    const links = [...element.querySelectorAll("[data-desktop-navigation] a span")];
    const toggle = element.querySelector("[data-desktop-theme-control] [data-theme-toggle] svg");
    const control = element.querySelector("[data-desktop-theme-control]");
    if (!(homeMark instanceof HTMLElement) || !(toggle instanceof SVGElement) || !(control instanceof HTMLElement)) return null;
    const centers = [homeMark, ...links, toggle].map((item) => {
      const bounds = item.getBoundingClientRect();
      return Math.round((bounds.top + bounds.height / 2) * 10) / 10;
    });
    const controlStyle = getComputedStyle(control);
    return {
      centers,
      borderInlineStartWidth: controlStyle.borderInlineStartWidth,
      paddingInlineStart: controlStyle.paddingInlineStart,
    };
  });
  await expect(navigation).toBeVisible();
  await expect(themeControl).toBeVisible();
  expect(new Set(signature?.centers).size).toBe(1);
  expect(signature?.borderInlineStartWidth).toBe("0px");
  expect(signature?.paddingInlineStart).toBe("0px");
});

test("LAB lockups center their mark and label on one axis", async ({ page }) => {
  await page.goto("/");
  const footerLockup = page.locator("[data-site-footer] [data-lab-wordmark]");
  const footerCenters = await footerLockup.evaluate((element) => [...element.children].map((child) => {
    const bounds = child.getBoundingClientRect();
    return Math.round((bounds.top + bounds.height / 2) * 10) / 10;
  }));
  expect(new Set(footerCenters).size).toBe(1);
});

test("production LAB lockup uses equal-height centered child boxes", async ({ page }) => {
  await page.goto("/");
  const lockup = page.locator('[data-site-footer] [data-lab-wordmark][data-size="production"]');
  const signature = await lockup.evaluate((element) => {
    const mark = element.querySelector("[data-lab-wordmark-mark]");
    const label = element.querySelector("[data-lab-wordmark-label]");
    if (!(mark instanceof HTMLImageElement) || !(label instanceof HTMLElement)) return null;
    const rootBounds = element.getBoundingClientRect();
    const markBounds = mark.getBoundingClientRect();
    const labelBounds = label.getBoundingClientRect();
    return {
      alignItems: getComputedStyle(element).alignItems,
      rootHeight: rootBounds.height,
      markHeight: markBounds.height,
      labelHeight: labelBounds.height,
      markCenter: markBounds.top + markBounds.height / 2,
      labelCenter: labelBounds.top + labelBounds.height / 2,
      labelPaddingTop: getComputedStyle(label).paddingTop,
    };
  });
  expect(signature).toMatchObject({
    alignItems: "center",
    rootHeight: 48,
    markHeight: 48,
    labelHeight: 48,
    labelPaddingTop: "12px",
  });
  expect(signature?.markCenter).toBeCloseTo(signature?.labelCenter ?? 0, 1);
});

test("compact LAB lockup centers equal-height mark and label boxes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "compact lockup is rendered in the mobile Sidebar");
  await page.goto("/skills/deconstruct/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const lockup = page.getByRole("dialog", { name: "LAB Skills" }).locator('[data-lab-wordmark][data-size="compact"]');
  const signature = await lockup.evaluate((element) => {
    const mark = element.querySelector("[data-lab-wordmark-mark]");
    const label = element.querySelector("[data-lab-wordmark-label]");
    if (!(mark instanceof HTMLImageElement) || !(label instanceof HTMLElement)) return null;
		const markStyle = getComputedStyle(mark);
		const rootStyle = getComputedStyle(element);
		const root = element.getBoundingClientRect();
		const markBounds = mark.getBoundingClientRect();
		const labelBounds = label.getBoundingClientRect();
		return {
			translate: markStyle.translate,
			display: rootStyle.display,
			alignItems: rootStyle.alignItems,
			markHeight: markBounds.height,
			labelHeight: labelBounds.height,
			rootCenter: root.top + root.height / 2,
			markCenter: markBounds.top + markBounds.height / 2,
			labelCenter: labelBounds.top + labelBounds.height / 2,
		};
	});
	expect(signature?.translate).toBe("none");
	expect(signature?.display).toBe("flex");
	expect(signature?.alignItems).toBe("center");
	expect(signature?.markHeight).toBe(32);
	expect(signature?.labelHeight).toBe(32);
	expect(signature?.markCenter).toBeCloseTo(signature?.rootCenter ?? 0, 1);
	expect(signature?.labelCenter).toBeCloseTo(signature?.rootCenter ?? 0, 1);
});

test("detail breadcrumbs expose the LAB, collection, and detail hierarchy", async ({ page }) => {
	for (const route of ["/recipes/functional-prototype/", "/skills/tailwind/"]) {
		await page.goto(route);
		const breadcrumb = page.locator("[data-detail-breadcrumb]");
		const list = breadcrumb.locator('[data-slot="breadcrumb-list"]');
		await expect(breadcrumb).toHaveCount(1);
		await expect(list.locator(':scope > [data-slot="breadcrumb-separator"]')).toHaveCount(2);
		await expect(list.locator(":scope > :nth-child(1)")).toHaveAttribute("data-slot", "breadcrumb-item");
		await expect(list.locator(":scope > :nth-child(2)")).toHaveAttribute("data-slot", "breadcrumb-separator");
		await expect(list.locator(":scope > :nth-child(3)")).toHaveAttribute("data-slot", "breadcrumb-item");
		await expect(list.locator(":scope > :nth-child(4)")).toHaveAttribute("data-slot", "breadcrumb-separator");
		await expect(list.locator(":scope > :nth-child(5)")).toHaveAttribute("data-slot", "breadcrumb-item");
		await expect(breadcrumb.getByRole("link", { name: "LAB", exact: true })).toHaveAttribute("href", "https://lab.sa");
	}
});

test("page atmosphere matches LAB's full-viewport linear wash", async ({ page }) => {
  const readAtmosphere = async () => page.locator("[data-site-shell]").evaluate((element) => {
    const shell = getComputedStyle(element);
    const atmosphere = getComputedStyle(element, "::before");
    return {
      image: atmosphere.backgroundImage,
      height: Number.parseFloat(atmosphere.height),
      viewportHeight: window.innerHeight,
      shellImage: shell.backgroundImage,
    };
  });

  await page.goto("/");
  const main = await readAtmosphere();
  expect(main.image).toContain("linear-gradient");
  expect(main.image).not.toContain("radial-gradient");
  expect(main.image).toContain("0.067");
  expect(main.height).toBe(main.viewportHeight);
  expect(main.shellImage).toBe("none");

  await page.goto("/skills/deconstruct/");
  const design = await readAtmosphere();
  expect(design.image).toContain("linear-gradient");
  expect(design.image).toContain("0.067");
  expect(design.image).not.toBe(main.image);
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
  await page.waitForTimeout(240);

  const active = await row.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    rail: getComputedStyle(element, "::before").transform,
  }));
  expect(resting.cursor).toBe("pointer");
  expect(active.background).not.toBe(resting.background);
  expect(active.rail).not.toBe(resting.rail);
});

test("directory search occupies its complete toolbar cell", async ({ page }) => {
  await page.goto("/recipes/");
  const cell = page.locator("[data-directory-search-cell]");
  const input = page.getByRole("searchbox", { name: "Search recipes" });
  const geometry = await cell.evaluate((element) => {
    const field = element.querySelector("input");
    if (!(field instanceof HTMLInputElement)) return null;
    const cellBounds = element.getBoundingClientRect();
    const inputBounds = field.getBoundingClientRect();
    return {
      cell: { x: cellBounds.x, y: cellBounds.y, width: cellBounds.width, height: cellBounds.height },
      input: { x: inputBounds.x, y: inputBounds.y, width: inputBounds.width, height: inputBounds.height },
    };
  });
  expect(geometry?.input).toEqual(geometry?.cell);

  await input.focus();
  expect(await cell.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await input.fill("not-a-recipe");
  await expect(page.locator('[aria-live="polite"]')).toContainText("0 of 1 recipes");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("recipe rows use LAB indigo and reveal their rail from the leading edge", async ({ page }) => {
  await page.goto("/recipes/");
  const row = page.getByRole("link", { name: "Open Functioning Prototype recipe" });
  await page.waitForTimeout(350);
  const resting = await row.evaluate((element) => ({
    accent: getComputedStyle(element.parentElement).getPropertyValue("--row-accent").trim(),
    borderBottomWidth: getComputedStyle(element).borderBottomWidth,
    railColor: getComputedStyle(element, "::before").backgroundColor,
    railTransform: getComputedStyle(element, "::before").transform,
  }));

  await row.hover();
  await page.waitForTimeout(50);

  const active = await row.evaluate((element) => ({
    railColor: getComputedStyle(element, "::before").backgroundColor,
    railTransform: getComputedStyle(element, "::before").transform,
  }));
  expect(resting.accent).toBe("#b5afff");
  expect(resting.borderBottomWidth).toBe("0px");
  expect(resting.railColor).toBe("rgb(181, 175, 255)");
  expect(resting.railTransform).toBe("matrix(1, 0, 0, 1, -4, 0)");
  expect(active.railColor).toBe(resting.railColor);
  expect(active.railTransform).not.toBe(resting.railTransform);
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

test("the footer uses one tidy grid and avoids duplicated service labels", async ({ page, isMobile }) => {
  await page.goto("/");
  const footer = page.locator("[data-site-footer]");
  const primary = footer.locator("[data-footer-primary]");
  const meta = footer.locator("[data-footer-meta]");
  const signature = await footer.evaluate((element) => {
    const primaryElement = element.querySelector("[data-footer-primary]");
    const metaElement = element.querySelector("[data-footer-meta]");
    if (!(primaryElement instanceof HTMLElement) || !(metaElement instanceof HTMLElement)) return null;
    return {
      columns: getComputedStyle(primaryElement).gridTemplateColumns.split(" ").length,
      footerHeight: element.getBoundingClientRect().height,
      metaText: metaElement.textContent?.trim(),
      slogan: element.querySelector("#footer-lab-title")?.textContent?.trim(),
      wordmark: (() => {
        const root = element.querySelector('[data-lab-wordmark][data-size="production"]');
        const image = root?.querySelector("img");
        const label = root?.querySelector("span");
        if (!(root instanceof HTMLElement) || !(image instanceof HTMLImageElement) || !(label instanceof HTMLElement)) return null;
        const rootBounds = root.getBoundingClientRect();
        const imageBounds = image.getBoundingClientRect();
        const rootStyle = getComputedStyle(root);
        const imageStyle = getComputedStyle(image);
        const labelStyle = getComputedStyle(label);
        return {
          rootWidth: rootBounds.width,
          rootHeight: rootBounds.height,
          imageWidth: imageBounds.width,
					imageHeight: imageBounds.height,
					labelHeight: label.getBoundingClientRect().height,
					alignItems: rootStyle.alignItems,
          gap: rootStyle.gap,
          paddingTop: imageStyle.paddingTop,
          fontFamily: labelStyle.fontFamily,
          fontSize: labelStyle.fontSize,
          fontWeight: labelStyle.fontWeight,
          lineHeight: labelStyle.lineHeight,
          letterSpacing: labelStyle.letterSpacing,
        };
      })(),
      servicePositions: [...element.querySelectorAll('[aria-label="LAB services"] a')].map((link) => {
        const bounds = link.getBoundingClientRect();
        return { x: bounds.x, y: bounds.y };
      }),
    };
  });
  await expect(primary).toBeVisible();
  await expect(meta).toBeVisible();
  expect(signature?.columns).toBe(isMobile ? 1 : 3);
  if (!isMobile) expect(signature?.footerHeight).toBeLessThan(480);
  expect(signature?.metaText).toBe("© 2026 LAB LLC. All rights reserved.");
  expect(signature?.slogan).toBe("We are a product innovation company. Built to explore, design, develop, and scale what matters.");
  expect(signature?.wordmark).toMatchObject({
    gap: "8px",
    imageWidth: 32,
		imageHeight: 48,
		labelHeight: 48,
		alignItems: "center",
		paddingTop: "0px",
    fontSize: "48px",
    fontWeight: "700",
    lineHeight: "48px",
    letterSpacing: "1.2px",
  });
  expect(signature?.wordmark?.fontFamily).toContain("Maax Unicase");
  expect(signature?.wordmark?.rootWidth).toBeGreaterThan(135);
  expect(signature?.wordmark?.rootWidth).toBeLessThan(139);
	expect(signature?.wordmark?.rootHeight).toBe(48);
  expect(new Set(signature?.servicePositions.map((position) => position.x)).size).toBe(1);
  expect(new Set(signature?.servicePositions.map((position) => position.y)).size).toBe(4);
});

test("the footer pillar bar reflects the published Skill distribution", async ({ page }) => {
  await page.goto("/");
  const bar = page.locator("[data-skill-pillar-distribution]");
  const expected = await page.locator("[data-directory-rows] > [data-pillar]").evaluateAll((rows) => {
    const order = ["research", "design", "development", "marketing"];
    const counts = new Map(order.map((pillar) => [pillar, 0]));
    for (const row of rows) counts.set(row.dataset.pillar, (counts.get(row.dataset.pillar) ?? 0) + 1);
    return order
      .map((pillar) => ({ pillar, count: counts.get(pillar) ?? 0 }))
      .filter((entry) => entry.count > 0);
  });
  const total = expected.reduce((sum, entry) => sum + entry.count, 0);
  await expect(bar).toHaveAttribute("data-total-skills", String(total));
  const distribution = await bar.locator(":scope > [data-pillar]").evaluateAll((segments) => segments.map((segment) => ({
    pillar: segment.dataset.pillar,
    count: Number(segment.dataset.count),
    grow: Number(getComputedStyle(segment).flexGrow),
    width: segment.getBoundingClientRect().width,
  })));
  expect(distribution.map(({ pillar, count }) => ({ pillar, count }))).toEqual(expected);
  expect(distribution.every((entry) => entry.grow === entry.count)).toBe(true);
  const barWidth = await bar.evaluate((element) => element.getBoundingClientRect().width);
  expect(distribution.every((entry) => Math.abs(entry.width / barWidth - entry.count / total) < 0.002)).toBe(true);
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
      const grid = element.querySelector("[data-lab-hero-grid]");
      const leading = element.querySelector("[data-lab-hero-leading]");
      const trailing = element.querySelector("[data-lab-hero-trailing]");
      if (!(title instanceof HTMLElement) || !(support instanceof HTMLElement) || !(grid instanceof HTMLElement) || !(leading instanceof HTMLElement) || !(trailing instanceof HTMLElement)) return null;
      const titleStyle = getComputedStyle(title);
      const leadingBounds = leading.getBoundingClientRect();
      const populatedRegions = [...leading.querySelectorAll("[data-lab-hero-title], [data-lab-hero-primary], [data-lab-hero-aside]")];
      return {
        fontSize: titleStyle.fontSize,
        lineHeight: titleStyle.lineHeight,
        maxWidth: titleStyle.maxWidth,
        supportDisplay: getComputedStyle(support).display,
        columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
        leadingColumn: getComputedStyle(leading).gridColumnEnd,
        trailingDisplay: getComputedStyle(trailing).display,
        trailingChildren: trailing.childElementCount,
        allContentInLeading: populatedRegions.every((region) => region.getBoundingClientRect().right <= leadingBounds.right + 1),
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
      const grid = element.querySelector("[data-lab-hero-grid]");
      const trailing = element.querySelector("[data-lab-hero-trailing]");
      if (!(title instanceof HTMLElement) || !(support instanceof HTMLElement) || !(grid instanceof HTMLElement) || !(trailing instanceof HTMLElement)) return null;
      const titleStyle = getComputedStyle(title);
      return {
        fontSize: titleStyle.fontSize,
        lineHeight: titleStyle.lineHeight,
        maxWidth: titleStyle.maxWidth,
        supportDisplay: getComputedStyle(support).display,
        columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
        trailingDisplay: getComputedStyle(trailing).display,
      };
    }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  expect(new Set(mobileSignatures.map((signature) => JSON.stringify(signature))).size).toBe(1);
});

test("hero install commands use one shared component contract", async ({ page, isMobile }) => {
  const signatures = [];
  for (const route of ["/", "/skills/build-product-artifacts/"]) {
    await page.goto(route);
    const command = page.locator("[data-lab-hero] [data-install-command]");
    await expect(command).toHaveCount(1);
    signatures.push(await command.evaluate((element) => {
			const surface = element.querySelector("[data-install-command-surface]");
      const panel = element.querySelector("[data-code-panel]");
      const code = element.querySelector("code");
      const copy = element.querySelector("button");
			if (!(surface instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(code instanceof HTMLElement) || !(copy instanceof HTMLElement)) return null;
      const panelBox = panel.getBoundingClientRect();
      const codeBox = code.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const copyCellBox = copy.parentElement?.getBoundingClientRect();
      return {
        rootClass: element.className,
		intrinsicFit: element.getBoundingClientRect().width < (element.parentElement?.getBoundingClientRect().width ?? 0),
        panelClass: panel.className,
				surfaceRadius: getComputedStyle(surface).borderRadius,
				panelRadius: getComputedStyle(panel).borderRadius,
				panelBlockBorders: [getComputedStyle(panel).borderTopWidth, getComputedStyle(panel).borderBottomWidth],
        gridColumns: getComputedStyle(panel).gridTemplateColumns.split(" ").length,
        headerDisplay: getComputedStyle(element.querySelector("[data-code-panel-header]")).display,
        hasVisibleHeader: element.querySelector("[data-code-language]") !== null,
        whiteSpace: getComputedStyle(code).whiteSpace,
				overflowX: getComputedStyle(code).overflowX,
				textOverflow: getComputedStyle(code).textOverflow,
        rowCenter: [codeBox, copyBox].map((box) => Math.round(box.top + box.height / 2 - panelBox.top)),
        copyFillsCell: copyCellBox
          ? Math.abs(copyBox.x - copyCellBox.x) <= 1
            && Math.abs(copyBox.y - copyCellBox.y) <= 1
            && Math.abs(copyBox.width - copyCellBox.width) <= 1
            && Math.abs(copyBox.height - copyCellBox.height) <= 1
          : false,
        panelHeight: Math.round(panelBox.height),
        hasCode: element.querySelectorAll("code").length,
        hasCopy: element.querySelectorAll("button").length,
      };
    }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  expect(signatures[1]).toEqual(signatures[0]);
  expect(signatures[0]).toMatchObject({
		surfaceRadius: "10px",
		panelRadius: "0px",
		panelBlockBorders: ["0px", "0px"],
    gridColumns: 2,
    headerDisplay: "contents",
    hasVisibleHeader: false,
    whiteSpace: "nowrap",
		overflowX: "hidden",
		textOverflow: "ellipsis",
    hasCode: 1,
    hasCopy: 1,
    copyFillsCell: true,
  });
	expect(signatures[0].rootClass).toContain("w-fit");
	if (!isMobile) expect(signatures[0].intrinsicFit).toBe(true);
  expect(new Set(signatures[0].rowCenter).size).toBe(1);
  expect(signatures[0].panelHeight).toBeLessThanOrEqual(64);

	await page.setViewportSize({ width: 320, height: 800 });
	await page.goto("/");
	const narrowCode = page.locator("[data-lab-hero] [data-install-command] code");
	const narrowSignature = await narrowCode.evaluate((element) => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
		overflowX: getComputedStyle(element).overflowX,
		textOverflow: getComputedStyle(element).textOverflow,
		whiteSpace: getComputedStyle(element).whiteSpace,
		title: element.getAttribute("title"),
		text: element.textContent,
	}));
	expect(narrowSignature.scrollWidth).toBeGreaterThan(narrowSignature.clientWidth);
	expect(narrowSignature).toMatchObject({
		overflowX: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		title: "npx skills add labdotsa/skills",
		text: "npx skills add labdotsa/skills",
	});
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("recipe requirements switch themes atomically", async ({ page, isMobile }) => {
  await page.goto("/recipes/functional-prototype/");
  const section = page.locator("[data-theme-transition-surface]");
  const table = page.locator("[data-recipe-requirements-table]");
  const panel = table.locator("[data-code-panel]").first();
  const copy = panel.locator("button");

  const readStyles = async () => Promise.all([section, table, panel, copy].map((locator) => locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      border: style.borderColor,
      duration: style.transitionDuration,
      property: style.transitionProperty,
    };
  })));

  const light = await readStyles();
  await (await exposeThemeToggle(page, isMobile)).click();
  const dark = await readStyles();

  for (const index of [0, 1, 2]) {
    expect(dark[index].background).not.toBe(light[index].background);
  }
  expect(await page.locator("html").getAttribute("data-theme-switching")).toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("representative surfaces reach the selected theme without an intermediate transition", async ({ page, isMobile }) => {
  const routes = [
    {
      path: "/",
      selectors: [
        "[data-directory-search-row]",
        "[data-directory-search-cell]",
        '[role="group"][aria-label="Filter skills by category"]',
        "[data-directory-rows] > li:first-child > a",
      ],
    },
    {
      path: "/recipes/functional-prototype/",
      selectors: [
        "[data-theme-transition-surface]",
        "[data-recipe-requirements-table]",
        "[data-recipe-requirements-table] [data-code-panel]",
        "[data-recipe-requirements-table] [data-code-panel] button",
      ],
    },
    {
      path: "/skills/build-product-artifacts/",
      selectors: [
        "[data-lab-hero]",
        "[data-install-command] [data-code-panel]",
        "[data-multiline-code]",
        "[data-site-footer]",
      ],
    },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await page.waitForTimeout(100);
    const toggle = await exposeThemeToggle(page, isMobile);
    const currentTheme = await toggle.getAttribute("data-current-theme");
    const result = await page.evaluate(({ selectors }) => {
      const toggle = [...document.querySelectorAll("[data-theme-toggle]")].find((element) => element instanceof HTMLElement && element.offsetParent !== null);
      if (!(toggle instanceof HTMLElement)) throw new Error("A visible theme toggle is required");
      toggle.click();
      return {
        switching: document.documentElement.dataset.themeSwitching,
        theme: document.documentElement.dataset.theme,
        signatures: selectors.map((selector) => {
          const element = document.querySelector(selector);
          if (!(element instanceof HTMLElement)) throw new Error(`Missing transition surface: ${selector}`);
          const style = getComputedStyle(element);
          return {
            duration: style.transitionDuration,
            timing: style.transitionTimingFunction,
            property: style.transitionProperty,
          };
        }),
      };
    }, { selectors: route.selectors });
    expect(result.switching).toBeUndefined();
    expect(result.theme).toBe(currentTheme === "dark" ? "light" : "dark");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});

test("page accents and code panels use one owning brand color", async ({ page }) => {
  await page.goto("/skills/copywriting/");
  const signature = await page.locator("[data-site-shell]").evaluate((element) => {
    const nav = document.querySelector(".site-nav-link.active");
    const panels = [...document.querySelectorAll("[data-code-panel]")];
    return {
      pageAccent: getComputedStyle(element).getPropertyValue("--page-accent").trim(),
      primary: getComputedStyle(element).getPropertyValue("--primary").trim(),
      navAccent: nav ? getComputedStyle(nav, "::after").backgroundColor : null,
      panelCount: panels.length,
      headerCount: document.querySelectorAll("[data-code-panel] > [data-code-panel-header]").length,
      panelBackgrounds: [...new Set(panels.map((panel) => getComputedStyle(panel).backgroundColor).filter((color) => color !== "rgba(0, 0, 0, 0)"))],
    };
  });
  expect(signature.pageAccent).toBe("#01a26b");
  expect(signature.primary).toBe("#01a26b");
  expect(signature.navAccent).toBe("rgb(1, 162, 107)");
  expect(signature.panelCount).toBeGreaterThan(1);
  expect(signature.headerCount).toBe(signature.panelCount);
  expect(signature.panelBackgrounds).toHaveLength(1);
});

test("multiline code blocks wrap long lines inside their panels", async ({ page }) => {
  await page.goto("/recipes/functional-prototype/");
  const blocks = page.locator("[data-multiline-code]");
  await expect(blocks.first()).toBeVisible();

  const signatures = await blocks.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return {
      whiteSpace: style.whiteSpace,
      overflowWrap: style.overflowWrap,
      fitsPanel: element.scrollWidth <= element.clientWidth + 1,
      preservesNewlines: (element.textContent ?? "").includes("\n"),
    };
  }));

  expect(signatures.length).toBeGreaterThan(0);
  expect(signatures.every((signature) => signature.whiteSpace === "pre-wrap")).toBe(true);
  expect(signatures.every((signature) => signature.overflowWrap === "anywhere")).toBe(true);
  expect(signatures.every((signature) => signature.fitsPanel)).toBe(true);
  expect(signatures.some((signature) => signature.preservesNewlines)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("recipe requirements use compact interactive command controls", async ({ page, isMobile }) => {
  await page.goto("/recipes/functional-prototype/");
  const requirements = page.locator(isMobile ? "[data-recipe-requirements-cards]" : "[data-recipe-requirements-table]");
  const panels = requirements.locator("[data-code-panel]");
  await expect(requirements).toBeVisible();
  await expect(panels).toHaveCount(8);

  const signatures = await panels.evaluateAll((elements) => elements.map((element) => {
    const header = element.querySelector(":scope > [data-code-panel-header]");
    const copy = element.querySelector(":scope > button");
    const cell = element.closest("[data-requirement-command-cell]");
    const panelBounds = element.getBoundingClientRect();
    const cellBounds = cell?.getBoundingClientRect();
    const command = element.querySelector("[data-requirement-command-text]");
    const commandStyle = command ? getComputedStyle(command) : null;
    return {
      height: element.getBoundingClientRect().height,
      hasHeader: header !== null,
      hasLanguageLabel: element.querySelector("[data-code-language]") !== null,
      copyIsDirectChild: copy !== null,
      copyBorder: copy ? getComputedStyle(copy).borderWidth : null,
      copyBackground: copy ? getComputedStyle(copy).backgroundColor : null,
      copyFillsHeight: copy ? Math.abs(copy.getBoundingClientRect().height - panelBounds.height) <= 1 : false,
      radius: getComputedStyle(element).borderRadius,
      border: getComputedStyle(element).borderWidth,
      cellPadding: cell ? getComputedStyle(cell).padding : null,
      fillsCell: cellBounds
        ? Math.abs(panelBounds.x - cellBounds.x) <= 1
          && Math.abs(panelBounds.y - cellBounds.y) <= 1
          && Math.abs(panelBounds.width - cellBounds.width) <= 1
          && Math.abs(panelBounds.height - cellBounds.height) <= 1
        : false,
      commandOverflowX: commandStyle?.overflowX,
      commandTextOverflow: commandStyle?.textOverflow,
      commandWhiteSpace: commandStyle?.whiteSpace,
      commandTabIndex: command instanceof HTMLElement ? command.tabIndex : null,
      commandTitleMatchesText: command?.getAttribute("title") === command?.textContent,
    };
  }));
  expect(signatures.every((signature) => signature.height >= 56 && signature.height <= 65)).toBe(true);
  expect(signatures.every((signature) => !signature.hasHeader)).toBe(true);
  expect(signatures.every((signature) => !signature.hasLanguageLabel)).toBe(true);
  expect(signatures.filter((_, index) => index !== 4).every((signature) => signature.copyIsDirectChild)).toBe(true);
  expect(signatures.filter((_, index) => index !== 4).every((signature) => signature.copyBorder === "0px")).toBe(true);
  expect(signatures.filter((_, index) => index !== 4).every((signature) => signature.copyBackground === "rgba(0, 0, 0, 0)")).toBe(true);
  expect(signatures.filter((_, index) => index !== 4).every((signature) => signature.copyFillsHeight)).toBe(true);
  expect(signatures.every((signature) => signature.radius === "0px")).toBe(true);
  expect(signatures.every((signature) => signature.border === "0px")).toBe(true);
  expect(signatures.every((signature) => signature.cellPadding === "0px")).toBe(true);
  expect(signatures.every((signature) => signature.fillsCell)).toBe(true);
  expect(signatures.every((signature) => signature.commandOverflowX === "hidden")).toBe(true);
  expect(signatures.every((signature) => signature.commandTextOverflow === "ellipsis")).toBe(true);
  expect(signatures.every((signature) => signature.commandWhiteSpace === "nowrap")).toBe(true);
  expect(signatures.every((signature) => signature.commandTabIndex === -1)).toBe(true);
  expect(signatures.every((signature) => signature.commandTitleMatchesText)).toBe(true);

  const copy = requirements.getByRole("button", { name: "Copy wayfinder install command" });
  await expect(copy).toBeEnabled();
  await copy.focus();
  await expect(copy).toBeFocused();
  await copy.click();
  await expect(copy).toHaveAttribute("data-copy-state", "success");
});

test("related rows use a single parent-owned rounded perimeter", async ({ page }) => {
  await page.goto("/skills/copywriting/");
  const related = page.locator("[data-related-rows]");
  const signature = await related.evaluate((element) => {
    const rows = [...element.querySelectorAll(".related-row")];
    const style = getComputedStyle(element);
    return {
      borderTopWidth: Number.parseFloat(style.borderTopWidth),
      borderBottomWidth: Number.parseFloat(style.borderBottomWidth),
      borderRadius: style.borderRadius,
      overflow: style.overflow,
      rowBottomWidths: rows.map((row) => getComputedStyle(row).borderBottomWidth),
    };
  });
  expect(signature.borderTopWidth).toBeGreaterThan(0);
  expect(signature.borderBottomWidth).toBe(signature.borderTopWidth);
  expect(signature.borderRadius).not.toBe("0px");
  expect(signature.overflow).toBe("hidden");
  expect(signature.rowBottomWidths.every((width) => width === "0px")).toBe(true);
});

test("mobile Sidebar closes with Escape and restores trigger focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation behavior");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeVisible();
  const sidebar = page.locator('[data-slot="sidebar"][data-mobile="true"]');
  await expect(sidebar).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile Sidebar rows stay neutral, fit their sheet, and respond to pointer hover", async ({ page, isMobile }) => {
  test.skip(isMobile, "uses the desktop pointer with a narrow responsive viewport");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/skills/copywriting/");
  await page.getByRole("button", { name: "Open navigation" }).click();

  const sidebar = page.locator('[data-slot="sidebar"][data-mobile="true"]');
  const navigationContent = sidebar.locator('[data-slot="sidebar-content"]');
  const service = sidebar.getByRole("link", { name: "Research" });
  const restingBackground = await service.evaluate((element) => getComputedStyle(element).backgroundColor);
  const restingDecoration = await service.evaluate((element) => getComputedStyle(element).textDecorationLine);
  await service.hover();
  const hoveredBackground = await service.evaluate((element) => getComputedStyle(element).backgroundColor);
  const hoveredDecoration = await service.evaluate((element) => getComputedStyle(element).textDecorationLine);
  const geometry = await sidebar.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    right: element.getBoundingClientRect().right,
  }));
  const contentGeometry = await navigationContent.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    overflowX: getComputedStyle(element).overflowX,
  }));

  expect(restingBackground).toBe("rgba(0, 0, 0, 0)");
  expect(hoveredBackground).toBe(restingBackground);
  expect(restingDecoration).toBe("none");
  expect(hoveredDecoration).toContain("underline");
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(contentGeometry.scrollWidth).toBeLessThanOrEqual(contentGeometry.clientWidth);
  expect(contentGeometry.overflowX).toBe("hidden");
});
