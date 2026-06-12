'use client';

import { useMemo, useState } from 'react';
import {
  getPayoutCurrency,
  supportedPayoutCountries,
  type PayoutCountry,
} from '../../lib/countryCurrency';
import { useLocale } from '../../lib/locale-context';

const CRYPTO_ASSETS: { code: string; usd: number }[] = [
  { code: 'USDT', usd: 1 },
  { code: 'BTC', usd: 64250 },
  { code: 'ETH', usd: 3120.5 },
  { code: 'TON', usd: 6.74 },
  { code: 'TRX', usd: 0.118 },
  { code: 'USDC', usd: 1 },
  { code: 'LTC', usd: 84.2 },
];

// Local currency units per 1 USD.
const FIAT_PER_USD: Record<string, number> = {
  RUB: 92.4,
  KZT: 478.5,
  UZS: 12650,
  AZN: 1.7,
  KGS: 89.2,
};

const FEE_RATE = 0.01; // 1% network fee

const formatNumber = (value: number, fractionDigits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export default function LiveCalculator() {
  const { dict } = useLocale();
  const t = dict.calculator;
  const countryNames = dict.countries.names;

  const [amount, setAmount] = useState('10000');
  const [asset, setAsset] = useState(CRYPTO_ASSETS[0].code);
  const [country, setCountry] = useState<PayoutCountry>(
    supportedPayoutCountries[0]
  );

  const payoutCurrency = getPayoutCurrency(country);

  const { send, fee, receive, rate } = useMemo(() => {
    const parsed = Math.max(0, Number(amount) || 0);
    const usd = CRYPTO_ASSETS.find((a) => a.code === asset)?.usd ?? 1;
    const fiatPerUsd = FIAT_PER_USD[payoutCurrency] ?? FIAT_PER_USD.RUB;
    const feeValue = parsed * FEE_RATE;
    const net = parsed - feeValue;
    const oneAssetInFiat = usd * fiatPerUsd;
    return {
      send: parsed,
      fee: feeValue,
      receive: net * oneAssetInFiat,
      rate: oneAssetInFiat,
    };
  }, [amount, asset, payoutCurrency]);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {t.badge}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t.subtitle}</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="asset" className="text-sm font-semibold text-slate-500">
                {t.sendLabel}
              </label>
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
                <select
                  id="asset"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full cursor-pointer bg-transparent py-4 text-2xl font-bold text-slate-950 outline-none"
                >
                  {CRYPTO_ASSETS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="text-sm font-semibold text-slate-500">
                {t.amountLabel}
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
                <input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent py-4 text-2xl font-bold text-slate-950 outline-none"
                  placeholder="0"
                />
                <span className="ml-2 text-sm font-semibold text-slate-500">
                  {asset}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="country" className="text-sm font-semibold text-slate-500">
                {t.countryLabel}
              </label>
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value as PayoutCountry)}
                  className="w-full cursor-pointer bg-transparent py-4 text-2xl font-bold text-slate-950 outline-none"
                >
                  {supportedPayoutCountries.map((c) => (
                    <option key={c} value={c}>
                      {countryNames[c]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-slate-500">
                {t.currencyLabel}
              </span>
              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4">
                <span className="text-2xl font-bold text-slate-950">
                  {payoutCurrency}
                </span>
                <span className="ml-2 text-xs font-medium text-slate-400">
                  {t.autoLabel} · {countryNames[country]}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>{t.summarySend}</span>
              <span className="font-semibold text-slate-900">
                {formatNumber(send)} {asset}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>{t.summaryFee}</span>
              <span className="font-semibold text-slate-900">
                {formatNumber(fee)} {asset}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>{t.summaryRate}</span>
              <span className="font-semibold text-slate-900">
                1 {asset} = {formatNumber(rate)} {payoutCurrency}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-900 p-6 text-white">
            <p className="text-sm text-blue-100">{t.receiveLabel}</p>
            <p className="mt-2 text-3xl font-bold sm:text-4xl">
              {formatNumber(receive)} {payoutCurrency}
            </p>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20"
          >
            {t.button}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">{t.footnote}</p>
        </div>
      </div>
    </section>
  );
}
