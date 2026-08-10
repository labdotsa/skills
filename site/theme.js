"use strict";

((root) => {
  const storageKey = "labs-color-theme";
  const preferences = new Set(["system", "light", "dark"]);

  function normalizePreference(value) {
    return preferences.has(value) ? value : "system";
  }

  function resolvePreference(preference, systemIsDark) {
    const normalized = normalizePreference(preference);
    return normalized === "system" ? (systemIsDark ? "dark" : "light") : normalized;
  }

  const Theme = { normalizePreference, resolvePreference, storageKey };
  root.LabsTheme = Theme;

  if (typeof document === "undefined") return;

  const media = root.matchMedia?.("(prefers-color-scheme: dark)");
  let preference = "system";

  try {
    preference = normalizePreference(root.localStorage?.getItem(storageKey));
  } catch {
    preference = "system";
  }

  function applyTheme() {
    const resolved = resolvePreference(preference, Boolean(media?.matches));
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = resolved === "dark" ? "#09090b" : "#f4f4f5";

    for (const picker of document.querySelectorAll("[data-theme-picker]")) {
      picker.value = preference;
      picker.dataset.resolvedTheme = resolved;
    }
  }

  function savePreference(value) {
    preference = normalizePreference(value);
    try {
      root.localStorage?.setItem(storageKey, preference);
    } catch {
      // Storage can be unavailable in hardened or private browser contexts.
    }
    applyTheme();
  }

  function bindPickers() {
    for (const picker of document.querySelectorAll("[data-theme-picker]")) {
      picker.addEventListener("change", (event) => savePreference(event.currentTarget.value));
    }
    applyTheme();
  }

  applyTheme();

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindPickers, { once: true });
  else bindPickers();

  const handleSystemChange = () => {
    if (preference === "system") applyTheme();
  };
  media?.addEventListener?.("change", handleSystemChange);
  root.addEventListener?.("storage", (event) => {
    if (event.key !== storageKey) return;
    preference = normalizePreference(event.newValue);
    applyTheme();
  });
})(globalThis);
