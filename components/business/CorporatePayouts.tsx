type Feature = {
  title: string;
  description: string;
  icon: string;
};

const FEATURES: Feature[] = [
  {
    title: 'Corporate Bank Accounts',
    description: 'Send local currency directly to company bank accounts.',
    icon: '🏛️',
  },
  {
    title: 'Supplier Payments',
    description: 'Pay suppliers across supported countries.',
    icon: '🏭',
  },
  {
    title: 'Contractor Settlements',
    description: 'Pay contractors and business partners efficiently.',
    icon: '👥',
  },
  {
    title: 'Invoice Payments',
    description: 'Settle business invoices using crypto conversion.',
    icon: '🧾',
  },
];

const CURRENCIES = ['RUB', 'KZT', 'UZS', 'AZN', 'KGS'];

export default function CorporatePayouts() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-900">
            Corporate Payouts
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Pay Companies and Organizations with Cryptocurrency
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Nexora enables crypto-to-bank settlements for legal entities,
            suppliers, contractors and business partners.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-900 group-hover:text-white">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
            <span className="text-sm font-semibold text-slate-500">
              Settlement Flow
            </span>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Step 1</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  Client Sends Crypto
                </p>
              </div>

              <div className="flex justify-center text-2xl text-cyan-500">↓</div>

              <div className="rounded-2xl bg-blue-900 p-5 text-white">
                <p className="text-sm text-blue-100">Step 2</p>
                <p className="mt-1 text-xl font-bold">Nexora Processing</p>
              </div>

              <div className="flex justify-center text-2xl text-cyan-500">↓</div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Step 3</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  Company Bank Account Receives Local Currency
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              {CURRENCIES.map((currency) => (
                <span
                  key={currency}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
                >
                  {currency}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-950"
            >
              Create Business Request
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
