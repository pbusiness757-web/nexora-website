"use client";

import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  getPayoutCurrency,
  supportedPayoutCountries,
  type PayoutCountry,
} from "../../lib/countryCurrency";
import { useLocale } from "../../lib/locale-context";

const CRYPTOCURRENCIES = ["USDT", "BTC", "ETH", "TON", "TRX", "USDC", "LTC"];
const NETWORKS = ["TRC20", "ERC20", "TON", "Bitcoin", "Litecoin"];
const STEP_NUMBERS = ["01", "02", "03"];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
// Static test client until client selection / auth is implemented.
const CLIENT_ID = process.env.NEXT_PUBLIC_TEST_CLIENT_ID ?? "test-client";

const selectClass =
  "mt-2 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const labelClass = "text-sm font-semibold text-slate-500";

function generateRequestNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `NX-${year}-${suffix}`;
}

export default function ExchangePage() {
  const { dict } = useLocale();
  const t = dict.exchange;
  const countryNames = dict.countries.names;

  const [country, setCountry] = useState<PayoutCountry>(
    supportedPayoutCountries[0]
  );
  const [cryptoAsset, setCryptoAsset] = useState(CRYPTOCURRENCIES[0]);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const payoutCurrency = getPayoutCurrency(country);
  const [recipientType, setRecipientType] = useState(0);
  const [payoutMethod, setPayoutMethod] = useState(0);
  const [recipientDetails, setRecipientDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    const cryptoValue = Number(cryptoAmount);
    const payoutValue = Number(payoutAmount);
    if (!cryptoValue || cryptoValue <= 0) {
      setError(t.errors.crypto);
      return;
    }
    if (!payoutValue || payoutValue <= 0) {
      setError(t.errors.payout);
      return;
    }
    if (!recipientDetails.trim()) {
      setError(t.errors.recipient);
      return;
    }

    setLoading(true);
    try {
      const number = generateRequestNumber();
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestNumber: number,
          clientId: CLIENT_ID,
          cryptoAsset,
          network,
          cryptoAmount: cryptoValue,
          payoutCurrency,
          payoutAmount: payoutValue,
          country,
        }),
      });
      if (!res.ok) throw new Error("request");
      const created = await res.json();

      setRequestNumber(created.requestNumber ?? number);
    } catch {
      setError(t.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              {t.badge}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t.subtitle}</p>
          </div>

          {!requestNumber && (
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  {t.flowSend}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-950">
                  {cryptoAsset}
                </p>
              </div>
              <div className="flex items-center justify-center text-xl text-cyan-500 sm:px-2">
                →
              </div>
              <div className="flex-1 rounded-2xl border border-blue-200 bg-blue-900 p-4 text-center shadow-sm">
                <p className="text-xs font-medium text-blue-100">
                  {t.flowReceive}
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {payoutCurrency} · {countryNames[country]}
                </p>
              </div>
            </div>
          )}

          {requestNumber ? (
            <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
                ✓
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-950">
                {t.successHeading}
              </h2>
              <p className="mt-2 text-slate-600">{t.successText}</p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{t.requestNumberLabel}</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {requestNumber}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-3 gap-4">
                {t.steps.map((label, index) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
                  >
                    <p className="text-sm font-bold text-blue-900">
                      {STEP_NUMBERS[index]}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
                <section>
                  <h2 className="text-lg font-bold text-slate-950">
                    {t.assetTitle}
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="cryptocurrency" className={labelClass}>
                        {t.cryptoLabel}
                      </label>
                      <select
                        id="cryptocurrency"
                        value={cryptoAsset}
                        onChange={(e) => setCryptoAsset(e.target.value)}
                        className={selectClass}
                      >
                        {CRYPTOCURRENCIES.map((coin) => (
                          <option key={coin} value={coin}>
                            {coin}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="network" className={labelClass}>
                        {t.networkLabel}
                      </label>
                      <select
                        id="network"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className={selectClass}
                      >
                        {NETWORKS.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="crypto-amount" className={labelClass}>
                        {t.cryptoAmountLabel}
                      </label>
                      <input
                        id="crypto-amount"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        placeholder="0.00"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                <section className="mt-10 border-t border-slate-100 pt-8">
                  <h2 className="text-lg font-bold text-slate-950">
                    {t.payoutTitle}
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="country" className={labelClass}>
                        {t.countryLabel}
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) =>
                          setCountry(e.target.value as PayoutCountry)
                        }
                        className={selectClass}
                      >
                        {supportedPayoutCountries.map((item) => (
                          <option key={item} value={item}>
                            {countryNames[item]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className={labelClass}>{t.currencyLabel}</span>
                      <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4">
                        <span className="text-base font-semibold text-slate-950">
                          {payoutCurrency}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {t.autoLabel} · {countryNames[country]}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="payout-amount" className={labelClass}>
                        {t.payoutAmountLabel}
                      </label>
                      <input
                        id="payout-amount"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        placeholder="0.00"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="recipient-type" className={labelClass}>
                        {t.recipientTypeLabel}
                      </label>
                      <select
                        id="recipient-type"
                        value={recipientType}
                        onChange={(e) => setRecipientType(Number(e.target.value))}
                        className={selectClass}
                      >
                        {t.recipientTypes.map((type, index) => (
                          <option key={type} value={index}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="payout-method" className={labelClass}>
                        {t.payoutMethodLabel}
                      </label>
                      <select
                        id="payout-method"
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(Number(e.target.value))}
                        className={selectClass}
                      >
                        {t.payoutMethods.map((method, index) => (
                          <option key={method} value={index}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="mt-10 border-t border-slate-100 pt-8">
                  <h2 className="text-lg font-bold text-slate-950">
                    {t.recipientTitle}
                  </h2>
                  <div className="mt-6">
                    <label htmlFor="recipient-details" className={labelClass}>
                      {t.recipientDetailsLabel}
                    </label>
                    <textarea
                      id="recipient-details"
                      rows={4}
                      value={recipientDetails}
                      onChange={(e) => setRecipientDetails(e.target.value)}
                      placeholder={t.recipientPlaceholder}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </section>

                {error && (
                  <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-8 w-full rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? t.creating : t.submit}
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  {t.footnote}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
