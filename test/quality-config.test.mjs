import assert from "node:assert/strict";
import test from "node:test";

test("deterministic Playwright gates never retry a failed CI run", async () => {
  const previous = process.env.CI;
  process.env.CI = "true";
  try {
    for (const name of ["a11y", "component", "e2e", "quality", "visual"]) {
      const filename = name === "e2e" ? "playwright.config.mjs" : `playwright.${name}.config.mjs`;
      const url = new URL(`../${filename}?quality-ci-contract`, import.meta.url);
      const config = (await import(url.href)).default;
      assert.equal(config.retries, 0, `${name} retries`);
    }
  } finally {
    if (previous === undefined) delete process.env.CI;
    else process.env.CI = previous;
  }
});
