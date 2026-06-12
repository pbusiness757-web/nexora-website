"use client";

import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const STEPS = [
  { number: "01", label: "Asset & Amount" },
  { number: "02", label: "Payout Details" },
  { number: "03", label: "Recipient" },
];

const CRYPTOCURRENCIES = ["USDT", "BTC", "ETH", "TON", "TRX", "USDC", "LTC"];
const NETWORKS = ["TRC20", "ERC20", "TON", "Bitcoin", "Litecoin"];
const COUNTRIES = [
  "Russia",
  "Kazakhstan",
  "Uzbekistan",
  "Azerbaijan",
  "Kyrgyzstan",
];
const PAYOUT_CURRENCIES = ["RUB", "KZT", "UZS", "AZN", "KGS"];
const RECIPIENT_TYPES = ["Individual", "Business"];
const PAYOUT_METHODS = ["Bank card", "Personal account", "Corporate account"];

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
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [cryptoAsset, setCryptoAsset] = useState(CRYPTOCURRENCIES[0]);
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [payoutCurrency, setPayoutCurrency] = useState(PAYOUT_CURRENCIES[0]);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [recipientType, setRecipientType] = useState(RECIPIENT_TYPES[0]);
  const [payoutMethod, setPayoutMethod] = useState(PAYOUT_METHODS[0]);
  const [recipientDetails, setRecipientDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    const cryptoValue = Number(cryptoAmount);
    const payoutValue = Number(payoutAmount);
    if (!cryptoValue || cryptoValue <= 0) {
      setError("Enter a valid crypto amount.");
      return;
    }
    if (!payoutValue || payoutValue <= 0) {
      setError("Enter a valid payout amount.");
      return;
    }
    if (!recipientDetails.trim()) {
      setError("Enter the recipient details.");
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
      setError("Failed to create request. Please try again.");
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
              Create Request
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Crypto-to-Bank Payout Request
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Set up a payout to a bank card, personal account or corporate bank
              account.
            </p>
          </div>

          {requestNumber ? (
            <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
                ✓
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-950">
                Request created
              </h2>
              <p className="mt-2 text-slate-600">
                Your payout request has been submitted for processing.
              </p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Request number</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {requestNumber}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-3 gap-4">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
                  >
                    <p className="text-sm font-bold text-blue-900">
                      {step.number}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
                <section>
                  <h2 className="text-lg font-bold text-slate-950">
                    Asset &amp; Amount
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="cryptocurrency" className={labelClass}>
                        Cryptocurrency
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
                        Network
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
                        Crypto amount
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
                    Payout Details
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="country" className={labelClass}>
                        Payout country
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={selectClass}
                      >
                        {COUNTRIES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="payout-currency" className={labelClass}>
                        Payout currency
                      </label>
                      <select
                        id="payout-currency"
                        value={payoutCurrency}
                        onChange={(e) => setPayoutCurrency(e.target.value)}
                        className={selectClass}
                      >
                        {PAYOUT_CURRENCIES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="payout-amount" className={labelClass}>
                        Payout amount
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
                        Recipient type
                      </label>
                      <select
                        id="recipient-type"
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className={selectClass}
                      >
                        {RECIPIENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="payout-method" className={labelClass}>
                        Payout method
                      </label>
                      <select
                        id="payout-method"
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value)}
                        className={selectClass}
                      >
                        {PAYOUT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="mt-10 border-t border-slate-100 pt-8">
                  <h2 className="text-lg font-bold text-slate-950">Recipient</h2>
                  <div className="mt-6">
                    <label htmlFor="recipient-details" className={labelClass}>
                      Recipient details
                    </label>
                    <textarea
                      id="recipient-details"
                      rows={4}
                      value={recipientDetails}
                      onChange={(e) => setRecipientDetails(e.target.value)}
                      placeholder="Card number, account number or company bank details"
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
                  {loading ? "Creating..." : "Create Request"}
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Rates and fees are confirmed before the request is finalized.
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
