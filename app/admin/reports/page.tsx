type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Monthly Volume", value: "1,240,000 USDT" },
  { label: "Monthly Profit", value: "34,800 USDT" },
  { label: "Completed Requests", value: "486" },
  { label: "Average Margin", value: "2.8%" },
];

type CountryRow = {
  country: string;
  currency: string;
  volume: string;
  requests: string;
  profit: string;
};

const COUNTRIES: CountryRow[] = [
  {
    country: "Russia",
    currency: "RUB",
    volume: "520,000 USDT",
    requests: "184",
    profit: "14,600 USDT",
  },
  {
    country: "Kazakhstan",
    currency: "KZT",
    volume: "310,000 USDT",
    requests: "112",
    profit: "8,700 USDT",
  },
  {
    country: "Uzbekistan",
    currency: "UZS",
    volume: "245,000 USDT",
    requests: "96",
    profit: "6,900 USDT",
  },
  {
    country: "Azerbaijan",
    currency: "AZN",
    volume: "95,000 USDT",
    requests: "54",
    profit: "2,600 USDT",
  },
  {
    country: "Kyrgyzstan",
    currency: "KGS",
    volume: "70,000 USDT",
    requests: "40",
    profit: "2,000 USDT",
  },
];

const METHODS = [
  { label: "Corporate Accounts", percent: 58 },
  { label: "Bank Cards", percent: 27 },
  { label: "Personal Accounts", percent: 15 },
];

const SEGMENTS = [
  { label: "Business Clients Volume", value: "820,000 USDT", percent: 66 },
  { label: "Individual Clients Volume", value: "420,000 USDT", percent: 34 },
];

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminReportsPage() {
  return (
    <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Reports &amp; Analytics
            </h1>
            <p className="text-lg text-slate-600">
              Track turnover, profit, countries, payout methods and business
              performance.
            </p>
          </div>

          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((card) => (
              <div
                key={card.label}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-950">
                  {card.value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">
              Volume by Country
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>Country</th>
                    <th className={thClass}>Currency</th>
                    <th className={thClass}>Volume</th>
                    <th className={thClass}>Requests</th>
                    <th className={thClass}>Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COUNTRIES.map((row) => (
                    <tr key={row.country} className="text-slate-700">
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.country}
                      </td>
                      <td className={tdClass}>{row.currency}</td>
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.volume}
                      </td>
                      <td className={tdClass}>{row.requests}</td>
                      <td className={`${tdClass} font-semibold text-blue-900`}>
                        {row.profit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Payout Method Performance
              </h2>
              <div className="mt-6 space-y-5">
                {METHODS.map((method) => (
                  <div key={method.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {method.label}
                      </span>
                      <span className="font-semibold text-slate-950">
                        {method.percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-900"
                        style={{ width: `${method.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Business Segment
              </h2>
              <div className="mt-6 space-y-5">
                {SEGMENTS.map((segment) => (
                  <div key={segment.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {segment.label}
                      </span>
                      <span className="font-semibold text-slate-950">
                        {segment.value}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{ width: `${segment.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
                Corporate payouts are the leading segment.
              </p>
            </section>
          </div>
        </div>
    </main>
  );
}
