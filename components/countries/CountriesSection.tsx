'use client';

import { useLocale } from '../../lib/locale-context';

type CountryKey = 'Russia' | 'Kazakhstan' | 'Uzbekistan' | 'Azerbaijan' | 'Kyrgyzstan';

const COUNTRIES: { key: CountryKey; currency: string; flag: string; color: string }[] = [
  { key: 'Russia',     currency: 'RUB', flag: '🇷🇺', color: 'rgba(220,38,38,0.15)' },
  { key: 'Kazakhstan', currency: 'KZT', flag: '🇰🇿', color: 'rgba(5,150,105,0.15)' },
  { key: 'Uzbekistan', currency: 'UZS', flag: '🇺🇿', color: 'rgba(30,64,175,0.15)' },
  { key: 'Azerbaijan', currency: 'AZN', flag: '🇦🇿', color: 'rgba(37,99,235,0.15)' },
  { key: 'Kyrgyzstan', currency: 'KGS', flag: '🇰🇬', color: 'rgba(126,34,206,0.15)' },
];

export default function CountriesSection() {
  const { dict } = useLocale();
  const t = dict.countries;

  return (
    <section
      id="countries"
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {COUNTRIES.map((country) => (
            <div
              key={country.key}
              className="nexora-card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--color-bg-surface)' }}
            >
              {/* Color top strip */}
              <div
                className="h-1.5 w-full"
                style={{ background: 'var(--color-brand)' }}
              />

              <div className="p-6">
                {/* Flag + currency */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{country.flag}</span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-black"
                    style={{
                      background: 'var(--color-brand-dim)',
                      color: 'var(--color-brand)',
                      border: '1px solid rgba(240,185,11,0.25)',
                    }}
                  >
                    {country.currency}
                  </span>
                </div>

                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {t.names[country.key]}
                </h3>

                <ul className="space-y-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  {t.methods.map((method) => (
                    <li
                      key={method}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span style={{ color: 'var(--color-green)' }}>✓</span>
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {t.note}
        </p>
      </div>
    </section>
  );
}
