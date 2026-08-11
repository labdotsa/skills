"use strict";

((root) => {
  const storageKey = "labs-color-theme";
  const preferences = new Set(["system", "light", "dark"]);
  const iconBase = "https://unpkg.com/lucide-static@latest/icons";

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

  function updateControls(resolved) {
    const nextTheme = resolved === "dark" ? "light" : "dark";
    for (const control of document.querySelectorAll("[data-theme-toggle]")) {
      control.dataset.resolvedTheme = resolved;
      control.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
      const icon = control.querySelector("[data-theme-icon]");
      const label = control.querySelector("[data-theme-label]");
      if (icon) icon.src = `${iconBase}/${nextTheme === "dark" ? "moon" : "sun"}.svg`;
      if (label) label.textContent = nextTheme[0].toUpperCase() + nextTheme.slice(1);
    }
  }

  function applyTheme() {
    const resolved = resolvePreference(preference, Boolean(media?.matches));
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = resolved === "dark" ? "#09090b" : "#f4f4f5";
    updateControls(resolved);
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

  function bindControls() {
    for (const control of document.querySelectorAll("[data-theme-toggle]")) {
      control.addEventListener("click", () => {
        const resolved = resolvePreference(preference, Boolean(media?.matches));
        savePreference(resolved === "dark" ? "light" : "dark");
      });
    }
    applyTheme();
  }

  applyTheme();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindControls, { once: true });
  else bindControls();

  media?.addEventListener?.("change", () => {
    if (preference === "system") applyTheme();
  });
  root.addEventListener?.("storage", (event) => {
    if (event.key !== storageKey) return;
    preference = normalizePreference(event.newValue);
    applyTheme();
  });
})(globalThis);
