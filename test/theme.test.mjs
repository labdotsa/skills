import assert from "node:assert/strict";
import test from "node:test";

await import("../website/theme.js");
const Theme = globalThis.LabsTheme;

test("normalizes stored theme preferences", () => {
  assert.equal(Theme.normalizePreference("light"), "light");
  assert.equal(Theme.normalizePreference("dark"), "dark");
  assert.equal(Theme.normalizePreference("system"), "system");
  assert.equal(Theme.normalizePreference("unexpected"), "system");
  assert.equal(Theme.normalizePreference(null), "system");
});

test("resolves system, light, and dark themes", () => {
  assert.equal(Theme.resolvePreference("system", true), "dark");
  assert.equal(Theme.resolvePreference("system", false), "light");
  assert.equal(Theme.resolvePreference("light", true), "light");
  assert.equal(Theme.resolvePreference("dark", false), "dark");
});
