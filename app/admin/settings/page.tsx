type CountryItem = {
  name: string;
  currency: string;
};

const COUNTRIES: CountryItem[] = [
  { name: "Russia", currency: "RUB" },
  { name: "Kazakhstan", currency: "KZT" },
  { name: "Uzbekistan", currency: "UZS" },
  { name: "Azerbaijan", currency: "AZN" },
  { name: "Kyrgyzstan", currency: "KGS" },
];

const CRYPTO_ASSETS = ["USDT", "BTC", "ETH", "TON", "TRX", "USDC", "LTC"];

const MARGIN_SETTINGS = [
  { label: "Individual clients", value: "2% - 5%" },
  { label: "Business clients", value: "1% - 3%" },
  { label: "VIP clients", value: "Custom" },
  { label: "Urgent payout fee", value: "Optional" },
];

const REQUEST_LIMITS = [
  { label: "Minimum request", value: "100 USDT" },
  { label: "Individual max", value: "10,000 USDT" },
  { label: "Business max", value: "100,000 USDT" },
  { label: "Manual review above", value: "50,000 USDT" },
];

type OperationalRow = {
  label: string;
  value: string;
  state: "on" | "off" | "neutral";
};

const OPERATIONAL_SETTINGS: OperationalRow[] = [
  { label: "Rate update interval", value: "30 seconds", state: "neutral" },
  { label: "Request expiration", value: "15 minutes", state: "neutral" },
  { label: "AML review", value: "Enabled", state: "on" },
  { label: "Maintenance mode", value: "Off", state: "off" },
];

const activeBadge =
  "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600";

const stateBadge: Record<OperationalRow["state"], string> = {
  on: "bg-emerald-50 text-emerald-600",
  off: "bg-slate-100 text-slate-500",
  neutral: "bg-blue-50 text-blue-700",
};

function KeyValueCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <dl className="mt-6 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-4"
          >
            <dt className="text-sm text-slate-600">{row.label}</dt>
            <dd className="font-semibold text-slate-950">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Platform Settings
          </h1>
          <p className="text-lg text-slate-600">
            Manage payout countries, currencies, crypto assets, margins and
            operational limits.
          </p>
        </div>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Supported Countries
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {COUNTRIES.map((country) => (
              <div
                key={country.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-900">
                    {country.currency}
                  </span>
                  <span className={activeBadge}>Active</span>
                </div>
                <p className="mt-4 font-semibold text-slate-950">
                  {country.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Supported Crypto Assets
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {CRYPTO_ASSETS.map((asset) => (
              <div
                key={asset}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="font-semibold text-slate-950">{asset}</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <KeyValueCard title="Margin Settings" rows={MARGIN_SETTINGS} />
          <KeyValueCard title="Request Limits" rows={REQUEST_LIMITS} />
        </div>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Operational Settings
          </h2>
          <dl className="mt-6 divide-y divide-slate-100">
            {OPERATIONAL_SETTINGS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-4"
              >
                <dt className="text-sm text-slate-600">{row.label}</dt>
                <dd>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stateBadge[row.state]}`}
                  >
                    {row.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
