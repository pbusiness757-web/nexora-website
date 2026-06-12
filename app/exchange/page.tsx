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
const RECIPIENT_TYPES = ["Individual", "Business"];
const PAYOUT_METHODS = [
  "Bank card",
  "Personal account",
  "Corporate account",
];

const selectClass =
  "mt-2 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const labelClass = "text-sm font-semibold text-slate-500";

export default function ExchangePage() {
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

          <div className="mt-12 grid grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                <p className="text-sm font-bold text-blue-900">{step.number}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
            <section>
              <h2 className="text-lg font-bold text-slate-950">
                Asset & Amount
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="cryptocurrency" className={labelClass}>
                    Cryptocurrency
                  </label>
                  <select id="cryptocurrency" className={selectClass}>
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
                  <select id="network" className={selectClass}>
                    {NETWORKS.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="amount" className={labelClass}>
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    min={0}
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
                  <select id="country" className={selectClass}>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="recipient-type" className={labelClass}>
                    Recipient type
                  </label>
                  <select id="recipient-type" className={selectClass}>
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
                  <select id="payout-method" className={selectClass}>
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
                  placeholder="Card number, account number or company bank details"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </section>

            <button
              type="button"
              className="mt-10 w-full rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-950"
            >
              Create Request
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Rates and fees are confirmed before the request is finalized.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
