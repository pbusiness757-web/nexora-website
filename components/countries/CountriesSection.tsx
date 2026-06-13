'use client';

import { useLocale } from '../../lib/locale-context';
import SmartImage from '../ui/SmartImage';

type CountryKey =
  | 'Russia'
  | 'Kazakhstan'
  | 'Uzbekistan'
  | 'Azerbaijan'
  | 'Kyrgyzstan';

const COUNTRIES: { key: CountryKey; currency: string; flag: string }[] = [
  { key: 'Russia', currency: 'RUB', flag: '🇷🇺' },
  { key: 'Kazakhstan', currency: 'KZT', flag: '🇰🇿' },
  { key: 'Uzbekistan', currency: 'UZS', flag: '🇺🇿' },
  { key: 'Azerbaijan', currency: 'AZN', flag: '🇦🇿' },
  { key: 'Kyrgyzstan', currency: 'KGS', flag: '🇰🇬' },
];

export default function CountriesSection() {
  const { dict } = useLocale();
  const t = dict.countries;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {t.badge}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {COUNTRIES.map((country) => (
            <div
              key={country.key}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <SmartImage
                src={`/images/countries/${country.key.toLowerCase()}.jpg`}
                alt={t.names[country.key]}
                sizes="(min-width: 1280px) 256px, (min-width: 640px) 50vw, 100vw"
                className="h-28 w-full"
              />

              <div className="p-8">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{country.flag}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-900">
                  {country.currency}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                {t.names[country.key]}
              </h3>

              <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                {t.methods.map((method) => (
                  <li key={method} className="flex items-center gap-2">
                    <span className="text-blue-900">✓</span>
                    {method}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-medium text-slate-500">
          {t.note}
        </p>
      </div>
    </section>
  );
}
