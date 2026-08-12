export const THEME_STORAGE_KEY = "labs-color-theme";

export type ThemePreference = "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export type ThemeSnapshot = Readonly<{
  preference: ThemePreference;
  resolved: ResolvedTheme;
}>;

type ThemeWindow = Pick<Window, "addEventListener" | "removeEventListener">;

export function normalizePreference(value: unknown): ThemePreference {
  return value === "dark" ? "dark" : "light";
}

export function oppositeTheme(theme: ResolvedTheme): ResolvedTheme {
  return theme === "light" ? "dark" : "light";
}

export function applyTheme(
  document: Document,
  preference: ThemePreference,
): ThemeSnapshot {
  const resolved = preference;
  const root = document.documentElement;

  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolved;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#0b0b0c" : "#f8f8f6");

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
  const storage = safeStorage(window);
  let snapshot = applyTheme(
    document,
    normalizePreference(document.documentElement.dataset.themePreference),
  );

  function publish(preference: ThemePreference) {
    snapshot = applyTheme(document, preference);
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

  function handleStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY) publish(normalizePreference(event.newValue));
  }

  window.addEventListener("storage", handleStorage);

  return {
    get snapshot() {
      return snapshot;
    },
    setPreference,
    destroy() {
      window.removeEventListener("storage", handleStorage);
    },
  };
}
