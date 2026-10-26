"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "@/data/translations";
import useIsomorphicLayoutEffect from "@/lib/utils/useIsomorphicLayoutEffect";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LOCALE_STORAGE_KEY = "krafter:lang";
export const DEFAULT_LOCALE: Locale = "fr";

function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // French is the documented default for every visitor on first load.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useIsomorphicLayoutEffect(() => {
    let next: Locale = DEFAULT_LOCALE;
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) next = stored;
    } catch {
      /* storage blocked — keep French */
    }
    if (next !== DEFAULT_LOCALE) setLocaleState(next);
    document.documentElement.lang = next;
    document.documentElement.dataset.lang = next;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    document.documentElement.dataset.lang = next;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("krafter:locale-change", { detail: next }));
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fr" ? "en" : "fr");
  }, [locale, setLocale]);

  // Keyboard shortcut: ⌥/Alt + L
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && (event.key === "l" || event.key === "L")) {
        event.preventDefault();
        toggleLocale();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleLocale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: dictionaries[locale], setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** Type-safe bilingual picker: `pick(value, locale)`. */
export function pick(value: { fr: string; en: string }, locale: Locale): string {
  return value[locale];
}
