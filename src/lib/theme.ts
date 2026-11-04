import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/**
 * Dark mode is switched off for now: the site always renders light and the toggle is hidden.
 * The dark styles are kept; to bring it back, set this to true and restore the
 * theme script in index.html (see the comment there).
 */
export const DARK_MODE_ENABLED = false;

const STORAGE_KEY = "padma-theme";
const listeners = new Set<() => void>();

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode). The theme still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  const toggle = useCallback(() => setTheme(getTheme() === "dark" ? "light" : "dark"), []);
  return [theme, toggle];
}
