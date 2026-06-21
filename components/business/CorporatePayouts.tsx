'use client';

import { useLocale } from '../../lib/locale-context';

const ICONS = ['🏛️', '🏭', '👥', '🧾'];
const CURRENCIES = ['RUB', 'KZT', 'UZS', 'AZN', 'KGS'];

export default function CorporatePayouts() {
  const { dict } = useLocale();
  const t = dict.corporatePayouts;

  return (
    <section
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="nexora-badge mb-4">{t.badge}</div>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
              {t.title}
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>

            <div className="mt-8 space-y-4">
              {t.features.map((feature: { title: string; description: string }, index: number) => (
                <div
                  key={feature.title}
                  className="nexora-card flex gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--color-bg-surface)' }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: 'var(--color-brand-dim)' }}
                  >
                    {ICONS[index] ?? '⚡'}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{feature.title}</h3>
                    <p className="mt-1 text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div
            className="nexora-card relative overflow-hidden p-8"
            style={{
              background: 'var(--color-bg-surface)',
              minHeight: '400px',
            }}
          >
            {/* Grid bg */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(var(--color-brand) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            <h3 className="relative z-10 text-lg font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {'Поддерживаемые валюты'}
            </h3>

            {/* Currency chips */}
            <div className="relative z-10 flex flex-wrap gap-3 mb-8">
              {CURRENCIES.map(currency => (
                <div
                  key={currency}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold"
                  style={{
                    background: 'var(--color-brand-dim)',
                    border: '1px solid rgba(37,99,235,0.25)',
                    color: 'var(--color-brand)',
                  }}
                >
                  {currency}
                </div>
              ))}
            </div>

            {/* Live payout animation */}
            <div className="relative z-10 space-y-3">
              {[
                { from: 'BTC 0.5', to: 'RUB 2,950,000', status: 'completed' },
                { from: 'ETH 12.0', to: 'KZT 18,500,000', status: 'processing' },
                { from: 'USDT 50k', to: 'UZS 633M', status: 'pending' },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl p-3 text-xs"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{tx.from}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                  <span className="font-semibold" style={{ color: 'var(--color-brand)' }}>{tx.to}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{
                      background: tx.status === 'completed' ? 'var(--color-green-dim)' : tx.status === 'processing' ? 'var(--color-brand-dim)' : 'rgba(100,100,100,0.15)',
                      color: tx.status === 'completed' ? 'var(--color-green)' : tx.status === 'processing' ? 'var(--color-brand)' : 'var(--color-text-muted)',
                    }}
                  >
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
