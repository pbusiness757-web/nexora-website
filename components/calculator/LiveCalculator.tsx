'use client';

import { useMemo, useState } from 'react';
import {
  getPayoutCurrency,
  supportedPayoutCountries,
  type PayoutCountry,
} from '../../lib/countryCurrency';
import { useLocale } from '../../lib/locale-context';

const CRYPTO_ASSETS: { code: string; usd: number; icon: string }[] = [
  { code: 'USDT', usd: 1,       icon: '💵' },
  { code: 'BTC',  usd: 64250,   icon: '₿' },
  { code: 'ETH',  usd: 3120.5,  icon: '⬡' },
  { code: 'TON',  usd: 6.74,    icon: '💎' },
  { code: 'TRX',  usd: 0.118,   icon: '⚡' },
  { code: 'USDC', usd: 1,       icon: '🔵' },
  { code: 'LTC',  usd: 84.2,    icon: '🌐' },
];

const FIAT_PER_USD: Record<string, number> = {
  RUB: 92.4,
  KZT: 478.5,
  UZS: 12650,
  AZN: 1.7,
  KGS: 89.2,
};

const FEE_RATE = 0.01;

const fmt = (v: number, d = 2) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

const FIELD_STYLE: React.CSSProperties = {
  background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.75rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
  width: '100%',
  padding: '0.9rem 1.1rem',
  fontSize: '1.05rem',
  fontWeight: 700,
  transition: 'border-color 0.2s',
};

export default function LiveCalculator() {
  const { dict } = useLocale();
  const t = dict.calculator;
  const countryNames = dict.countries.names;

  const [amount, setAmount] = useState('10000');
  const [asset, setAsset] = useState(CRYPTO_ASSETS[0].code);
  const [country, setCountry] = useState<PayoutCountry>(supportedPayoutCountries[0]);

  const payoutCurrency = getPayoutCurrency(country);

  const { send, fee, receive, rate } = useMemo(() => {
    const parsed = Math.max(0, Number(amount) || 0);
    const usd = CRYPTO_ASSETS.find(a => a.code === asset)?.usd ?? 1;
    const fiatPerUsd = FIAT_PER_USD[payoutCurrency] ?? FIAT_PER_USD.RUB;
    const feeValue = parsed * FEE_RATE;
    const net = parsed - feeValue;
    const oneAssetInFiat = usd * fiatPerUsd;
    return { send: parsed, fee: feeValue, receive: net * oneAssetInFiat, rate: oneAssetInFiat };
  }, [amount, asset, payoutCurrency]);

  const selectedIcon = CRYPTO_ASSETS.find(a => a.code === asset)?.icon ?? '💵';

  return (
    <section
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-base)' }}
      id="calculator"
    >
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        {/* Card */}
        <div
          className="nexora-card p-6 sm:p-8"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Asset */}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                {t.sendLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{selectedIcon}</span>
                <select
                  value={asset}
                  onChange={e => setAsset(e.target.value)}
                  style={{ ...FIELD_STYLE, paddingLeft: '2.5rem', cursor: 'pointer' }}
                >
                  {CRYPTO_ASSETS.map(a => (
                    <option key={a.code} value={a.code} style={{ background: 'var(--color-bg-elevated)' }}>
                      {a.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                {t.amountLabel}
              </label>
              <div
                className="flex items-center gap-2"
                style={{ ...FIELD_STYLE, padding: 0, overflow: 'hidden' }}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{
                    flex: 1, background: 'transparent', outline: 'none',
                    color: 'var(--color-text-primary)', fontWeight: 700,
                    fontSize: '1.05rem', padding: '0.9rem 0 0.9rem 1.1rem',
                  }}
                  placeholder="0"
                />
                <span
                  className="pr-4 text-sm font-bold"
                  style={{ color: 'var(--color-brand)', flexShrink: 0 }}
                >
                  {asset}
                </span>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                {t.countryLabel}
              </label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value as PayoutCountry)}
                style={{ ...FIELD_STYLE, cursor: 'pointer' }}
              >
                {supportedPayoutCountries.map(c => (
                  <option key={c} value={c} style={{ background: 'var(--color-bg-elevated)' }}>
                    {countryNames[c]}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency auto */}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                {t.currencyLabel}
              </label>
              <div
                className="flex items-center gap-2"
                style={{ ...FIELD_STYLE, background: 'var(--color-bg-base)', cursor: 'default' }}
              >
                <span className="text-lg font-black" style={{ color: 'var(--color-brand)' }}>
                  {payoutCurrency}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {t.autoLabel} · {countryNames[country]}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div
            className="mt-6 rounded-xl p-4 space-y-3 text-sm"
            style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
          >
            {[
              { label: t.summarySend, value: `${fmt(send)} ${asset}` },
              { label: t.summaryFee,  value: `${fmt(fee)} ${asset}`, accent: true },
              { label: t.summaryRate, value: `1 ${asset} = ${fmt(rate)} ${payoutCurrency}` },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>{row.label}</span>
                <span
                  className="font-semibold"
                  style={{ color: row.accent ? 'var(--color-red)' : 'var(--color-text-primary)' }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Result */}
          <div
            className="mt-5 rounded-xl p-5 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 100%)',
              border: '1px solid rgba(37,99,235,0.25)',
            }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-brand)' }}>
                {t.receiveLabel}
              </p>
              <p className="text-3xl font-black sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>
                {fmt(receive)} <span style={{ color: 'var(--color-brand)' }}>{payoutCurrency}</span>
              </p>
            </div>
            <div
              className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full text-2xl"
              style={{ background: 'var(--color-brand)', color: '#ffffff' }}
            >
              ↓
            </div>
          </div>

          {/* CTA */}
          <a
            href="/cabinet/register"
            className="nexora-btn-primary mt-5 w-full flex items-center justify-center gap-2 text-base"
          >
            {t.button}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <p className="mt-3 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {t.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
