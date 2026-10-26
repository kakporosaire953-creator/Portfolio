"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useIsomorphicLayoutEffect from "@/lib/utils/useIsomorphicLayoutEffect";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  /** false until the client has read the persisted preference */
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "krafter:theme";
const THEME_EVENT = "krafter:theme-change";

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage blocked — fall through to system preference */
  }
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server + first client render agree on "light" (the documented default),
  // then we sync with the attribute pre-set by the inline boot script.
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const fromDom = document.documentElement.dataset.theme;
    const next: Theme =
      fromDom === "dark" || fromDom === "light"
        ? fromDom
        : (readStoredTheme() ??
          (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    setThemeState(next);
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore quota / privacy errors */
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      applyTheme(next);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  // While no explicit choice is stored, follow the OS preference live.
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme()) return; // an explicit choice wins
      const next: Theme = event.matches ? "dark" : "light";
      setThemeState(next);
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    };
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") {
        setThemeState(event.newValue);
        document.documentElement.dataset.theme = event.newValue;
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ theme, mounted, setTheme, toggleTheme }),
    [theme, mounted, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
