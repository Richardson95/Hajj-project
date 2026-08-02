"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePrefersDark } from "@/lib/client-hooks";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "hajjpath.theme";

/**
 * Runs before paint so the correct palette is applied without a flash.
 * Kept in sync with the resolution logic below.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}")||"system";var d=s==="dark"||(s==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

/* ---- Theme preference, stored in localStorage and shared as a store ---- */

const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system" ? value : "system";
  } catch {
    return "system";
  }
}

function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeTheme(next: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* private mode — the choice simply will not persist */
  }
  listeners.forEach((l) => l());
}

interface ThemeContextValue {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => "system" as Theme,
  );
  const prefersDark = usePrefersDark();

  const resolved: "light" | "dark" =
    theme === "dark" || (theme === "system" && prefersDark) ? "dark" : "light";

  /* Sync the external DOM to React state. No setState, so no cascading render. */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const setTheme = useCallback((next: Theme) => writeTheme(next), []);
  const toggle = useCallback(
    () => writeTheme(resolved === "dark" ? "light" : "dark"),
    [resolved],
  );

  const value = useMemo(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
