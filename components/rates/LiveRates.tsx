'use client';

import { useLocale } from '../../lib/locale-context';

type CryptoRate = {
  symbol: string;
  priceUsd: number;
  change24h: number;
};

type FiatRate = {
  code: string;
  perUsdt: number;
};

const CRYPTO_RATES: CryptoRate[] = [
  { symbol: 'USDT', priceUsd: 1.0, change24h: 0.01 },
  { symbol: 'BTC', priceUsd: 64250.0, change24h: 1.84 },
  { symbol: 'ETH', priceUsd: 3120.5, change24h: -0.62 },
  { symbol: 'TON', priceUsd: 6.74, change24h: 2.31 },
  { symbol: 'TRX', priceUsd: 0.118, change24h: 0.45 },
  { symbol: 'USDC', priceUsd: 1.0, change24h: -0.01 },
  { symbol: 'LTC', priceUsd: 84.2, change24h: 0.97 },
];

const FIAT_RATES: FiatRate[] = [
  { code: 'RUB', perUsdt: 92.4 },
  { code: 'KZT', perUsdt: 478.5 },
  { code: 'UZS', perUsdt: 12650 },
  { code: 'AZN', perUsdt: 1.7 },
  { code: 'KGS', perUsdt: 89.2 },
];

const LAST_UPDATED = '2026-06-11 · 14:00 UTC';

const formatNumber = (value: number, fractionDigits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export default function LiveRates() {
  const { dict } = useLocale();
  const t = dict.liveRates;

  return (
    <section className="bg-slate-50 py-24">
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

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          {t.lastUpdated}: {LAST_UPDATED}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">{t.cryptoTitle}</h3>
            <p className="mt-1 text-sm text-slate-500">{t.cryptoSubtitle}</p>

            <div className="mt-6 divide-y divide-slate-100">
              {CRYPTO_RATES.map((rate) => (
                <div
                  key={rate.symbol}
                  className="flex items-center justify-between py-4"
                >
                  <p className="font-bold text-slate-950">{rate.symbol}</p>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">
                      ${formatNumber(rate.priceUsd)}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        rate.change24h >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {rate.change24h >= 0 ? '+' : ''}
                      {formatNumber(rate.change24h)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">{t.fiatTitle}</h3>
            <p className="mt-1 text-sm text-slate-500">{t.fiatSubtitle}</p>

            <div className="mt-6 divide-y divide-slate-100">
              {FIAT_RATES.map((rate) => (
                <div
                  key={rate.code}
                  className="flex items-center justify-between py-4"
                >
                  <p className="font-bold text-slate-950">{rate.code}</p>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">
                      {formatNumber(rate.perUsdt)}
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      {t.perUsdt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">{t.footnote}</p>
      </div>
    </section>
  );
}
