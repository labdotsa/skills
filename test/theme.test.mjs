import assert from "node:assert/strict";
import test from "node:test";

const Theme = await import("../src/lib/theme/theme.ts");

test("normalizes stored theme preferences", () => {
  assert.equal(Theme.normalizePreference("light"), "light");
  assert.equal(Theme.normalizePreference("dark"), "dark");
  assert.equal(Theme.normalizePreference("system"), "light");
  assert.equal(Theme.normalizePreference("unexpected"), "light");
  assert.equal(Theme.normalizePreference(null), "light");
});

test("toggles only between light and dark", () => {
  assert.equal(Theme.oppositeTheme("light"), "dark");
  assert.equal(Theme.oppositeTheme("dark"), "light");
});

function themeEnvironment({ stored, storageThrows = false } = {}) {
  const root = { dataset: {}, style: {} };
  const meta = { content: "", setAttribute(_name, value) { this.content = value; } };
  const windowListeners = new Map();
  const writes = [];
  const storage = {
    getItem() { return stored ?? null; },
    setItem(key, value) {
      if (storageThrows) throw new Error("storage denied");
      writes.push([key, value]);
    },
  };
  const window = {
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
  return { document, meta, root, window, windowListeners, writes };
}

test("applies a selected theme and theme-color to the document", () => {
  const environment = themeEnvironment();
  const snapshot = Theme.applyTheme(environment.document, "dark");

  assert.deepEqual(snapshot, { preference: "dark", resolved: "dark" });
  assert.equal(environment.root.dataset.theme, "dark");
  assert.equal(environment.root.dataset.themePreference, "dark");
  assert.equal(environment.root.style.colorScheme, "dark");
  assert.equal(environment.meta.content, "#0b0b0c");
});

test("theme controller persists explicit choices and synchronizes other tabs", () => {
  const environment = themeEnvironment();
  environment.root.dataset.themePreference = "light";
  const snapshots = [];
  const controller = Theme.createThemeController(environment.document, environment.window, (snapshot) => snapshots.push(snapshot));

  controller.setPreference("dark");
  environment.windowListeners.get("storage")({ key: Theme.THEME_STORAGE_KEY, newValue: "light" });

  assert.deepEqual(snapshots, [
    { preference: "dark", resolved: "dark" },
    { preference: "light", resolved: "light" },
  ]);
  assert.deepEqual(environment.writes, [[Theme.THEME_STORAGE_KEY, "dark"]]);
  controller.destroy();
  assert.equal(environment.windowListeners.size, 0);
});

test("theme controller tolerates invalid state and unavailable storage", () => {
  const environment = themeEnvironment({ storageThrows: true });
  environment.root.dataset.themePreference = "invalid";
  const snapshots = [];

  const controller = Theme.createThemeController(environment.document, environment.window, (snapshot) => snapshots.push(snapshot));
  assert.deepEqual(controller.snapshot, { preference: "light", resolved: "light" });
  assert.doesNotThrow(() => controller.setPreference("dark"));
  assert.deepEqual(snapshots.at(-1), { preference: "dark", resolved: "dark" });
  controller.destroy();
});
