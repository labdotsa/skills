import assert from "node:assert/strict";
import test from "node:test";

const Theme = await import("../src/lib/theme/theme.ts");

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

function themeEnvironment({ stored, storageThrows = false, systemDark = false } = {}) {
  const root = { dataset: {}, style: {} };
  const meta = { content: "", setAttribute(_name, value) { this.content = value; } };
  const mediaListeners = new Map();
  const windowListeners = new Map();
  const writes = [];
  const media = {
    matches: systemDark,
    addEventListener(type, listener) { mediaListeners.set(type, listener); },
    removeEventListener(type) { mediaListeners.delete(type); },
  };
  const storage = {
    getItem() { return stored ?? null; },
    setItem(key, value) {
      if (storageThrows) throw new Error("storage denied");
      writes.push([key, value]);
    },
  };
  const window = {
    matchMedia() { return media; },
    addEventListener(type, listener) { windowListeners.set(type, listener); },
    removeEventListener(type) { windowListeners.delete(type); },
    get localStorage() {
      if (storageThrows) throw new Error("storage denied");
      return storage;
    },
  };
  const document = {
    documentElement: root,
    querySelector() { return meta; },
  };
  return { document, media, mediaListeners, meta, root, window, windowListeners, writes };
}

test("applies a resolved theme and theme-color to the document", () => {
  const environment = themeEnvironment({ systemDark: true });
  const snapshot = Theme.applyTheme(environment.document, "system", true);

  assert.deepEqual(snapshot, { preference: "system", resolved: "dark" });
  assert.equal(environment.root.dataset.theme, "dark");
  assert.equal(environment.root.dataset.themePreference, "system");
  assert.equal(environment.root.style.colorScheme, "dark");
  assert.equal(environment.meta.content, "#09090b");
});

test("theme controller follows system changes and persists explicit choices", () => {
  const environment = themeEnvironment();
  environment.root.dataset.themePreference = "system";
  const snapshots = [];
  const controller = Theme.createThemeController(environment.document, environment.window, (snapshot) => snapshots.push(snapshot));

  environment.media.matches = true;
  environment.mediaListeners.get("change")();
  controller.setPreference("light");

  assert.deepEqual(snapshots, [
    { preference: "system", resolved: "dark" },
    { preference: "light", resolved: "light" },
  ]);
  assert.deepEqual(environment.writes, [[Theme.THEME_STORAGE_KEY, "light"]]);
  controller.destroy();
  assert.equal(environment.mediaListeners.size, 0);
  assert.equal(environment.windowListeners.size, 0);
});

test("theme controller tolerates invalid state and unavailable storage", () => {
  const environment = themeEnvironment({ storageThrows: true, systemDark: true });
  environment.root.dataset.themePreference = "invalid";
  const snapshots = [];

  const controller = Theme.createThemeController(environment.document, environment.window, (snapshot) => snapshots.push(snapshot));
  assert.deepEqual(controller.snapshot, { preference: "system", resolved: "dark" });
  assert.doesNotThrow(() => controller.setPreference("light"));
  assert.deepEqual(snapshots.at(-1), { preference: "light", resolved: "light" });
  controller.destroy();
});
