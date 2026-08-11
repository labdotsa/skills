import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const pages = [
  { name: "home", path: "/", readyText: "6 of 6 skills" },
  { name: "recipes", path: "/recipes.html", readyText: "1 of 1 recipes" },
  { name: "skill-tailwind", path: "/skills/tailwind/", readyText: "Skill instructions" },
  { name: "recipe", path: "/recipe.html", readyText: "Share files, not conversation history." },
];

test("captures the named parity surfaces", async ({ page }, testInfo) => {
  const captureDirectory = path.resolve("tmp", "parity-captures", testInfo.project.name);
  await mkdir(captureDirectory, { recursive: true });

  for (const surface of pages) {
    await page.goto(surface.path);
    await expect(page.getByText(surface.readyText, { exact: false }).first()).toBeVisible();
    await page.screenshot({
      animations: "disabled",
      fullPage: true,
      path: path.join(captureDirectory, `${surface.name}.png`),
    });
  }
});
