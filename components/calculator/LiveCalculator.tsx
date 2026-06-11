'use client';

import { useMemo, useState } from 'react';

type Currency = {
  code: string;
  label: string;
  rate: number; // 1 USDT in local currency
};

const CURRENCIES: Currency[] = [
  { code: 'RUB', label: 'Russian Ruble', rate: 92.4 },
  { code: 'KZT', label: 'Kazakhstani Tenge', rate: 478.5 },
  { code: 'UZS', label: 'Uzbekistani Som', rate: 12650 },
  { code: 'AZN', label: 'Azerbaijani Manat', rate: 1.7 },
  { code: 'KGS', label: 'Kyrgyzstani Som', rate: 89.2 },
];

const FEE_RATE = 0.01; // 1% network fee

const formatNumber = (value: number, fractionDigits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export default function LiveCalculator() {
  const [amount, setAmount] = useState('10000');
  const [currencyCode, setCurrencyCode] = useState(CURRENCIES[0].code);

  const currency =
    CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];

  const { send, fee, net, receive } = useMemo(() => {
    const parsed = Math.max(0, Number(amount) || 0);
    const feeValue = parsed * FEE_RATE;
    const netValue = parsed - feeValue;
    return {
      send: parsed,
      fee: feeValue,
      net: netValue,
      receive: netValue * currency.rate,
    };
  }, [amount, currency]);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            Live Calculator
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Estimate your payout
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Real-time conversion from crypto to local bank currency.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="amount"
                className="text-sm font-semibold text-slate-500"
              >
                You send (USDT)
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
                  USDT
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="currency"
                className="text-sm font-semibold text-slate-500"
              >
                Recipient currency
              </label>
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
                <select
                  id="currency"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full cursor-pointer bg-transparent py-4 text-2xl font-bold text-slate-950 outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} · {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Amount sent</span>
              <span className="font-semibold text-slate-900">
                {formatNumber(send)} USDT
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Network fee (1%)</span>
              <span className="font-semibold text-slate-900">
                {formatNumber(fee)} USDT
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Exchange rate</span>
              <span className="font-semibold text-slate-900">
                1 USDT = {formatNumber(currency.rate)} {currency.code}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3 text-slate-600">
              <span className="text-xs">
                After {formatNumber(net)} USDT conversion
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-900 p-6 text-white">
            <p className="text-sm text-blue-100">Recipient receives</p>
            <p className="mt-2 text-3xl font-bold sm:text-4xl">
              {formatNumber(receive)} {currency.code}
            </p>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20">
            Create Request
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Rates are indicative and updated at request confirmation.
          </p>
        </div>
      </div>
    </section>
  );
}
