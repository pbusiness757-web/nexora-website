'use client';

import { useLocale } from '../../lib/locale-context';
import CountUp from '../ui/CountUp';

export default function StatisticsSection() {
  const { dict } = useLocale();
  const t = dict.statistics;

  return (
    <section
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-surface)' }}
      id="statistics"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((stat, i) => (
            <div
              key={stat.label}
              className="nexora-card p-8 text-center transition-all duration-300 cursor-default group"
              style={{
                background: 'var(--color-bg-elevated)',
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{ background: 'var(--color-brand-dim)' }}
              >
                {['💸', '🌍', '⚡', '🏦'][i] ?? '📊'}
              </div>
              <p
                className="text-4xl font-black"
                style={{ color: 'var(--color-brand)' }}
              >
                <CountUp value={stat.value} />
              </p>
              <p className="mt-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {stat.label}
              </p>
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
