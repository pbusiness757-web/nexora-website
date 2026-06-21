'use client';

import { useLocale } from '../../lib/locale-context';

type CryptoRate = { symbol: string; priceUsd: number; change24h: number; icon: string };
type FiatRate = { code: string; perUsdt: number; flag: string };

const CRYPTO_RATES: CryptoRate[] = [
  { symbol: 'USDT', priceUsd: 1.0,     change24h:  0.01, icon: '💵' },
  { symbol: 'BTC',  priceUsd: 64250.0, change24h:  1.84, icon: '₿'  },
  { symbol: 'ETH',  priceUsd: 3120.5,  change24h: -0.62, icon: '⬡'  },
  { symbol: 'TON',  priceUsd: 6.74,    change24h:  2.31, icon: '💎' },
  { symbol: 'TRX',  priceUsd: 0.118,   change24h:  0.45, icon: '⚡' },
  { symbol: 'USDC', priceUsd: 1.0,     change24h: -0.01, icon: '🔵' },
  { symbol: 'LTC',  priceUsd: 84.2,    change24h:  0.97, icon: '🌐' },
];

const FIAT_RATES: FiatRate[] = [
  { code: 'RUB', perUsdt: 92.4,  flag: '🇷🇺' },
  { code: 'KZT', perUsdt: 478.5, flag: '🇰🇿' },
  { code: 'UZS', perUsdt: 12650, flag: '🇺🇿' },
  { code: 'AZN', perUsdt: 1.7,   flag: '🇦🇿' },
  { code: 'KGS', perUsdt: 89.2,  flag: '🇰🇬' },
];

const fmt = (v: number, d = 2) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function LiveRates() {
  const { dict } = useLocale();
  const t = dict.liveRates;

  return (
    <section
      id="rates"
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-surface)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          {t.lastUpdated}: 2026-06-20 · 14:00 UTC
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Crypto rates */}
          <div className="nexora-card p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)' }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{t.cryptoTitle}</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{t.cryptoSubtitle}</p>

            <div className="space-y-1">
              {CRYPTO_RATES.map(rate => (
                <div
                  key={rate.symbol}
                  className="flex items-center justify-between py-3 px-3 rounded-xl transition-all"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-base)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg w-6 text-center">{rate.icon}</span>
                    <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{rate.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      ${fmt(rate.priceUsd)}
                    </div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: rate.change24h >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}
                    >
                      {rate.change24h >= 0 ? '+' : ''}{fmt(rate.change24h)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fiat rates */}
          <div className="nexora-card p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)' }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{t.fiatTitle}</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{t.fiatSubtitle}</p>

            <div className="space-y-1">
              {FIAT_RATES.map(rate => (
                <div
                  key={rate.code}
                  className="flex items-center justify-between py-3 px-3 rounded-xl transition-all"
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-base)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{rate.flag}</span>
                    <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{rate.code}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-brand)' }}>
                      {fmt(rate.perUsdt)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {t.perUsdt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>{t.footnote}</p>
      </div>
    </section>
  );
}
