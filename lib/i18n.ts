import ru from "../data/locales/ru";
import en from "../data/locales/en";
import kk from "../data/locales/kk";
import uz from "../data/locales/uz";
import az from "../data/locales/az";
import ky from "../data/locales/ky";

export const supportedLocales = ["ru", "en", "kk", "uz", "az", "ky"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "ru";

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { ru, en, kk, uz, az, ky };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale as Locale] ?? dictionaries[defaultLocale];
}

export const defaultCountry = "Russia";

const COUNTRY_BY_REGION: Record<string, string> = {
  RU: "Russia",
  KZ: "Kazakhstan",
  UZ: "Uzbekistan",
  AZ: "Azerbaijan",
  KG: "Kyrgyzstan",
};

const SUPPORTED = new Set<string>(supportedLocales);

export function detectLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const primary = tag.toLowerCase().split("-")[0];
    if (SUPPORTED.has(primary)) return primary as Locale;
  }
  return defaultLocale;
}

export function detectCountry(languages: readonly string[]): string {
  for (const tag of languages) {
    const region = tag.split("-")[1]?.toUpperCase();
    if (region && COUNTRY_BY_REGION[region]) return COUNTRY_BY_REGION[region];
  }
  return defaultCountry;
}
