import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

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
