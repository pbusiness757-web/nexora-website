"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultCountry,
  defaultLocale,
  detectCountry,
  detectLocale,
  getDictionary,
  supportedLocales,
  type Dictionary,
  type Locale,
} from "./i18n";

const LOCALE_KEY = "nexora.locale";
const COUNTRY_KEY = "nexora.country";

type LocaleContextValue = {
  locale: Locale;
  country: string;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isSupported(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [country, setCountry] = useState<string>(defaultCountry);

  useEffect(() => {
    const languages =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];

    // Locale: stored choice wins; otherwise auto-detect from the browser.
    const storedLocale = localStorage.getItem(LOCALE_KEY);
    if (storedLocale && isSupported(storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      const detected = detectLocale(languages);
      setLocaleState(detected);
      localStorage.setItem(LOCALE_KEY, detected);
    }

    // Country: stored value wins; otherwise infer from the browser region.
    const storedCountry = localStorage.getItem(COUNTRY_KEY);
    if (storedCountry) {
      setCountry(storedCountry);
    } else {
      const detectedCountry = detectCountry(languages);
      setCountry(detectedCountry);
      localStorage.setItem(COUNTRY_KEY, detectedCountry);
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(LOCALE_KEY, next);
  }

  const dict = getDictionary(locale);

  return (
    <LocaleContext.Provider value={{ locale, country, setLocale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
