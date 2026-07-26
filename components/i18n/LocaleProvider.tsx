"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, dir, type Locale } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  /** pick the right string from a { fa, en } pair */
  t: (pair: { fa: string; en: string }) => string;
};

const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Apply saved locale on mount (default is Persian, so first paint is correct
  // for most visitors; returning EN users flip after hydration).
  useEffect(() => {
    const saved = localStorage.getItem("behrouz:locale") as Locale | null;
    if (saved === "en" || saved === "fa") setLocaleState(saved);
  }, []);

  // Keep <html> lang/dir in sync so RTL/LTR + fonts follow the locale.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dir(locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("behrouz:locale", l);
    } catch {}
  }, []);

  const toggle = useCallback(
    () => setLocale(locale === "fa" ? "en" : "fa"),
    [locale, setLocale]
  );

  const t = useCallback(
    (pair: { fa: string; en: string }) => pair[locale],
    [locale]
  );

  return (
    <LocaleCtx.Provider value={{ locale, setLocale, toggle, t }}>
      {children}
    </LocaleCtx.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
