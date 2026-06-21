'use client';

import { useLocale } from '../../lib/locale-context';

const ICONS = ['🏭', '👥', '🏛️', '🧾'];
const ICON_COLORS = [
  'rgba(37,99,235,1)',
  'rgba(24,144,255,1)',
  'rgba(3,166,109,1)',
  'rgba(246,70,93,1)',
];

export default function BusinessSolutions() {
  const { dict } = useLocale();
  const t = dict.businessSolutions;

  return (
    <section
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-surface)' }}
      id="business"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        {/* Decorative gradient banner */}
        <div
          className="mt-12 h-48 w-full rounded-2xl overflow-hidden relative md:h-56"
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-8 sm:gap-16">
            {['USDT', 'BTC', 'ETH', '→', 'RUB', 'KZT', 'UZS'].map((label, i) => (
              <span
                key={i}
                className="text-lg font-black sm:text-2xl"
                style={{
                  color: label === '→' ? 'var(--color-brand)' : i < 3 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  opacity: label === '→' ? 1 : 0.8,
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(37,99,235,0.05) 0%, transparent 70%)' }}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((solution, index) => (
            <div
              key={solution.title}
              className="nexora-card group flex flex-col p-7 transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--color-bg-elevated)' }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: ICON_COLORS[index] + '18',
                  border: '1px solid ' + ICON_COLORS[index] + '30',
                }}
              >
                {ICONS[index]}
              </div>

              <h3 className="mt-5 text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {solution.title}
              </h3>
              <p className="mt-2 text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>
                {solution.description}
              </p>

              <ul
                className="mt-5 space-y-2 pt-5 text-xs"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                {solution.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: 'var(--color-green)' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="mt-14 flex flex-col items-center gap-6 rounded-2xl overflow-hidden px-8 py-12 text-center md:flex-row md:justify-between md:text-left"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 100%)',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          <div>
            <h3 className="text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>
              {t.ctaTitle}
            </h3>
            <p className="mt-2 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
              {t.ctaText}
            </p>
          </div>
          <a
            href="/exchange"
            className="nexora-btn-primary shrink-0 text-sm"
          >
            {t.ctaButton}
          </a>
        </div>
      </div>
    </section>
  );
}
