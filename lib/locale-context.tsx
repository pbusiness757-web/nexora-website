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

const LOCALE_KEY   = "nexora.locale";
const COUNTRY_KEY  = "nexora.country";
const GEO_KEY      = "nexora.geo";       // cached IP geo result
const GEO_TTL_MS   = 24 * 60 * 60 * 1000; // re-check after 24 h

/** Map IP-geo country code → Nexora locale */
const GEO_LOCALE: Record<string, Locale> = {
  RU: "ru",
  KZ: "kk",
  UZ: "uz",
  AZ: "az",
  KG: "ky",
  BY: "ru",  // Belarus → Russian
  TJ: "ru",  // Tajikistan → Russian
  AM: "ru",  // Armenia → Russian
};

/** Map IP-geo country code → Nexora country name */
const GEO_COUNTRY: Record<string, string> = {
  RU: "Russia",
  KZ: "Kazakhstan",
  UZ: "Uzbekistan",
  AZ: "Azerbaijan",
  KG: "Kyrgyzstan",
  BY: "Russia",
  TJ: "Russia",
  AM: "Russia",
};

type GeoCache = {
  countryCode: string;
  fetchedAt: number;
};

async function fetchGeoCountry(): Promise<string | null> {
  // Check cache first
  try {
    const cached = localStorage.getItem(GEO_KEY);
    if (cached) {
      const parsed: GeoCache = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < GEO_TTL_MS) {
        return parsed.countryCode;
      }
    }
  } catch {}

  // Try ipapi.co (free, no key required)
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const code = data?.country_code as string | undefined;
      if (code) {
        const cache: GeoCache = { countryCode: code, fetchedAt: Date.now() };
        localStorage.setItem(GEO_KEY, JSON.stringify(cache));
        return code;
      }
    }
  } catch {}

  // Fallback: try ipinfo.io (also free)
  try {
    const res = await fetch("https://ipinfo.io/json", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const code = data?.country as string | undefined;
      if (code) {
        const cache: GeoCache = { countryCode: code, fetchedAt: Date.now() };
        localStorage.setItem(GEO_KEY, JSON.stringify(cache));
        return code;
      }
    }
  } catch {}

  return null;
}

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
  const [locale, setLocaleState]   = useState<Locale>(defaultLocale);
  const [country, setCountry]      = useState<string>(defaultCountry);
  const [geoApplied, setGeoApplied] = useState(false);

  useEffect(() => {
    const languages =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];

    // ── Step 1: apply browser-detected locale immediately (fast) ──
    const storedLocale  = localStorage.getItem(LOCALE_KEY);
    const storedCountry = localStorage.getItem(COUNTRY_KEY);
    const userPicked    = localStorage.getItem(LOCALE_KEY + ".userPicked") === "1";

    if (storedLocale && isSupported(storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      const detected = detectLocale(languages);
      setLocaleState(detected);
      localStorage.setItem(LOCALE_KEY, detected);
    }

    if (storedCountry) {
      setCountry(storedCountry);
    } else {
      const detectedCountry = detectCountry(languages);
      setCountry(detectedCountry);
      localStorage.setItem(COUNTRY_KEY, detectedCountry);
    }

    // ── Step 2: async geo-detect by IP (only if user never manually picked) ──
    if (!userPicked) {
      fetchGeoCountry().then(code => {
        if (!code) return;
        const geoLocale  = GEO_LOCALE[code];
        const geoCountry = GEO_COUNTRY[code];

        if (geoLocale && geoLocale !== locale) {
          setLocaleState(geoLocale);
          localStorage.setItem(LOCALE_KEY, geoLocale);
        }
        if (geoCountry) {
          setCountry(geoCountry);
          localStorage.setItem(COUNTRY_KEY, geoCountry);
        }
        setGeoApplied(true);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(LOCALE_KEY, next);
    // Mark that user explicitly chose; geo should not override it
    localStorage.setItem(LOCALE_KEY + ".userPicked", "1");
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
