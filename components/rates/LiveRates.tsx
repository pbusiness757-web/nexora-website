'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '../../lib/locale-context';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

type RatesData = {
  rates: Record<string, number>;
  cryptoPrices: Record<string, number>;
  source: string;
  updatedAt: string;
};

const CRYPTO_META: { symbol: string; icon: string }[] = [
  { symbol: 'USDT', icon: '💵' },
  { symbol: 'BTC',  icon: '₿'  },
  { symbol: 'ETH',  icon: '⬡'  },
  { symbol: 'TON',  icon: '💎' },
  { symbol: 'TRX',  icon: '⚡' },
  { symbol: 'USDC', icon: '🔵' },
  { symbol: 'LTC',  icon: '🌐' },
];

const FIAT_META: { code: string; flag: string }[] = [
  { code: 'RUB', flag: '🇷🇺' },
  { code: 'KZT', flag: '🇰🇿' },
  { code: 'UZS', flag: '🇺🇿' },
  { code: 'AZN', flag: '🇦🇿' },
  { code: 'KGS', flag: '🇰🇬' },
];

const STABLES = new Set(['USDT', 'USDC']);

const fmt = (v: number, d = 2) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

function fmtCompact(v: number): string {
  if (v >= 10000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (v >= 100)   return v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (v >= 1)     return v.toLocaleString('en-US', { maximumFractionDigits: 4 });
  return v.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export default function LiveRates() {
  const { dict } = useLocale();
  const t = dict.liveRates;
  const [data,    setData]    = useState<RatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchRates = () => {
    fetch(`${API_BASE}/api/rates`)
      .then(r => r.json())
      .then((d: RatesData) => { setData(d); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRates();
    const timer = setInterval(fetchRates, 60_000);
    return () => clearInterval(timer);
  }, []);

  const updatedTime = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
    : null;

  const getCryptoUsd = (symbol: string): number => {
    if (STABLES.has(symbol)) return 1;
    return data?.cryptoPrices?.[symbol] ?? 0;
  };

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
          {loading ? (
            <span>Загрузка курсов…</span>
          ) : error ? (
            <span style={{ color: 'var(--color-amber)' }}>⚠ Курсы временно недоступны</span>
          ) : (
            <>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>{data?.source === 'live' ? 'Онлайн' : 'Кэш'} · обновлено {updatedTime}</span>
            </>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Crypto rates */}
          <div className="nexora-card p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)' }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{t.cryptoTitle}</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{t.cryptoSubtitle}</p>

            <div className="space-y-1">
              {CRYPTO_META.map(({ symbol, icon }) => {
                const priceUsdt = getCryptoUsd(symbol);
                return (
                  <div
                    key={symbol}
                    className="flex items-center justify-between py-3 px-3 rounded-xl transition-all"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-base)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg w-6 text-center">{icon}</span>
                      <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{symbol}</span>
                    </div>
                    <div className="text-right">
                      {loading ? (
                        <div className="h-4 w-20 rounded animate-pulse" style={{ background: 'var(--color-bg-base)' }} />
                      ) : priceUsdt > 0 ? (
                        <>
                          <div className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                            ${fmtCompact(priceUsdt)}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {STABLES.has(symbol) ? 'stablecoin' : 'в USDT'}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fiat rates */}
          <div className="nexora-card p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)' }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{t.fiatTitle}</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{t.fiatSubtitle}</p>

            <div className="space-y-1">
              {FIAT_META.map(({ code, flag }) => {
                const perUsdt = data?.rates?.[code] ?? 0;
                return (
                  <div
                    key={code}
                    className="flex items-center justify-between py-3 px-3 rounded-xl transition-all"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-base)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{flag}</span>
                      <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{code}</span>
                    </div>
                    <div className="text-right">
                      {loading ? (
                        <div className="h-4 w-16 rounded animate-pulse" style={{ background: 'var(--color-bg-base)' }} />
                      ) : perUsdt > 0 ? (
                        <>
                          <div className="font-semibold text-sm" style={{ color: 'var(--color-brand)' }}>
                            {fmt(perUsdt)}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {t.perUsdt}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>{t.footnote}</p>
      </div>
    </section>
  );
}
