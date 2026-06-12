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
