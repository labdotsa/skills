export const THEME_STORAGE_KEY = "labs-color-theme";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export type ThemeSnapshot = Readonly<{
  preference: ThemePreference;
  resolved: ResolvedTheme;
}>;

type ThemeWindow = Pick<Window, "addEventListener" | "removeEventListener" | "matchMedia">;

export function normalizePreference(value: unknown): ThemePreference {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

export function resolvePreference(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}

export function applyTheme(
  document: Document,
  preference: ThemePreference,
  systemDark: boolean,
): ThemeSnapshot {
  const resolved = resolvePreference(preference, systemDark);
  const root = document.documentElement;

  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolved;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#09090b" : "#f4f4f5");

  return Object.freeze({ preference, resolved });
}

function safeStorage(window: Window): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function createThemeController(
  document: Document,
  window: ThemeWindow & Window,
  onChange: (snapshot: ThemeSnapshot) => void,
) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const storage = safeStorage(window);
  let snapshot = applyTheme(
    document,
    normalizePreference(document.documentElement.dataset.themePreference),
    media.matches,
  );

  function publish(preference: ThemePreference) {
    snapshot = applyTheme(document, preference, media.matches);
    onChange(snapshot);
  }

  function setPreference(value: ThemePreference) {
    publish(value);
    try {
      storage?.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // The selected theme remains active for this tab when persistence is denied.
    }
  }

  function handleSystemChange() {
    if (snapshot.preference === "system") publish("system");
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY) publish(normalizePreference(event.newValue));
  }

  media.addEventListener("change", handleSystemChange);
  window.addEventListener("storage", handleStorage);

  return {
    get snapshot() {
      return snapshot;
    },
    setPreference,
    destroy() {
      media.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
    },
  };
}
