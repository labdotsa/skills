import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { loadRepresentativeRoutes } from "../quality/load-routes.mjs";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const profiles = [
  { name: "canonical", origin: "http://127.0.0.1:4173", root: ".artifacts/e2e", basePath: "" },
  { name: "pages-project", origin: "http://127.0.0.1:4174", root: ".artifacts/e2e-pages", basePath: "/skills" },
];
const adjudications = JSON.parse(await readFile("test/quality/axe-adjudications.json", "utf8"));

test("representative routes and exposed states have no unadjudicated WCAG A/AA result", async ({ page }, testInfo) => {
  const evidence = [];
  for (const profile of profiles) {
    const routes = await loadRepresentativeRoutes(profile.root, profile.basePath);
    for (const route of routes) {
      const errors = [];
      page.removeAllListeners("console");
      page.removeAllListeners("pageerror");
      page.on("console", (message) => {
        if (message.type() === "error") errors.push({ kind: "console", text: message.text(), url: message.location().url });
      });
      page.on("pageerror", (error) => errors.push({ kind: "page", text: error.message, url: page.url() }));
      page.on("requestfailed", (request) => errors.push({ kind: "request", text: request.failure()?.errorText, url: request.url() }));
      const response = await page.goto(`${profile.origin}${route.pathname}`, { waitUntil: "networkidle" });
      expect([200, 404]).toContain(response?.status());
      await scan(page, testInfo, evidence, adjudications, profile.name, route.id, "default");

      if (route.id === "home") {
        await page.getByRole("searchbox").fill("tailwind");
        await scan(page, testInfo, evidence, adjudications, profile.name, route.id, "filtered");
        if (testInfo.project.name.endsWith("mobile")) {
          await page.getByRole("button", { name: "Open navigation" }).click();
          await expect(page.getByRole("dialog", { name: "LAB Skills" })).toBeVisible();
          await scan(page, testInfo, evidence, adjudications, profile.name, route.id, "sheet-open");
          await page.keyboard.press("Escape");
        }
      }
      if (route.id === "skill") {
        const disclosure = page.getByRole("button", { name: /^Expand / }).first();
        if (await disclosure.count()) {
          await disclosure.click();
          await scan(page, testInfo, evidence, adjudications, profile.name, route.id, "disclosure-open");
        }
      }
      const unexpectedErrors = errors.filter((error) => !(route.id === "not-found"
        && error.kind === "console"
        && error.text === "Failed to load resource: the server responded with a status of 404 (Not Found)"
        && error.url === `${profile.origin}${route.pathname}`));
      expect(unexpectedErrors, `${profile.name} ${route.pathname} console/page/request errors`).toEqual([]);
    }
  }

  const directory = path.resolve(".artifacts/quality/axe");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, `${testInfo.project.name}.json`), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    project: testInfo.project.name,
    axeVersion: evidence[0]?.axeVersion,
    scans: evidence,
  }, null, 2)}\n`);
});

async function scan(page, testInfo, evidence, ledger, profile, route, state) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(results.violations, `${profile} ${route} ${state} axe violations`).toEqual([]);
  const independentlyVerified = new Set();
  const verification = {};
  const contrastResult = results.incomplete.find((result) => result.id === "color-contrast");
  if (contrastResult) {
    const contrast = await verifyComputedContrast(page, contrastResult.nodes);
    verification["color-contrast"] = {
      method: "computed-foreground-background-ratio",
      measurements: contrast,
    };
    if (contrast.every((measurement) => measurement.pass)) independentlyVerified.add("color-contrast");
  }
  const scope = `${testInfo.project.name}|${profile}|${route}|${state}`;
  const missing = results.incomplete.filter((result) =>
    !independentlyVerified.has(result.id)
    || !validAdjudication(ledger[result.id], scope, results.testEngine.version));
  expect(missing, `${profile} ${route} ${state} incomplete axe results require current adjudication`).toEqual([]);
  evidence.push({
    profile,
    route,
    state,
    axeVersion: results.testEngine.version,
    violations: results.violations,
    incomplete: results.incomplete,
    adjudications: verification,
    passes: results.passes.map((result) => result.id),
  });
  await testInfo.attach(`axe-${profile}-${route}-${state}`, {
    body: Buffer.from(JSON.stringify(results, null, 2)),
    contentType: "application/json",
  });
}

async function verifyComputedContrast(page, nodes) {
  return page.evaluate((axeNodes) => {
    const parse = (value) => {
      const values = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return { r: values[0], g: values[1], b: values[2], a: values[3] ?? 1 };
    };
    const composite = (front, back) => {
      const alpha = front.a + back.a * (1 - front.a);
      return {
        r: (front.r * front.a + back.r * back.a * (1 - front.a)) / alpha,
        g: (front.g * front.a + back.g * back.a * (1 - front.a)) / alpha,
        b: (front.b * front.a + back.b * back.a * (1 - front.a)) / alpha,
        a: alpha,
      };
    };
    const luminance = (color) => {
      const channel = (value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    };
    return axeNodes.map((node) => {
      const selector = node.target[0];
      const element = document.querySelector(selector);
      if (!element) return { selector, pass: false, reason: "target-not-found" };
      const layers = [];
      for (let current = element; current; current = current.parentElement) {
        layers.push(parse(getComputedStyle(current).backgroundColor));
      }
      let background = { r: 255, g: 255, b: 255, a: 1 };
      for (const layer of layers.reverse()) background = composite(layer, background);
      const foreground = composite(parse(getComputedStyle(element).color), background);
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));
      const ratio = (lighter + 0.05) / (darker + 0.05);
      const expected = Number.parseFloat(node.any.find((check) => check.data?.expectedContrastRatio)?.data.expectedContrastRatio ?? "4.5");
      return {
        selector,
        foreground: getComputedStyle(element).color,
        background: `rgb(${Math.round(background.r)} ${Math.round(background.g)} ${Math.round(background.b)})`,
        ratio: Number(ratio.toFixed(2)),
        expected,
        pass: ratio + 0.005 >= expected,
      };
    });
  }, nodes);
}

function validAdjudication(value, scope, toolVersion) {
  if (!value || typeof value !== "object") return false;
  const expiry = Date.parse(value.expires);
  return typeof value.rationale === "string" && value.rationale.length > 20
    && typeof value.owner === "string" && value.owner.length > 0
    && typeof value.issue === "string" && value.issue.length > 0
    && value.toolVersion === toolVersion
    && Array.isArray(value.scopes) && value.scopes.includes(scope)
    && Number.isFinite(expiry) && expiry >= Date.now() && expiry <= Date.now() + 30 * 86_400_000;
}
