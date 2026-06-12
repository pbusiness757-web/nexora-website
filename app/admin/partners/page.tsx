type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Active Partners", value: "14" },
  { label: "Available Reserve", value: "420,000 USDT" },
  { label: "Countries Covered", value: "5" },
  { label: "Limited Partners", value: "2" },
];

type PartnerRow = {
  id: string;
  name: string;
  country: string;
  currency: string;
  methods: string;
  dailyLimit: string;
  reserve: string;
  fee: string;
  status: string;
};

const PARTNERS: PartnerRow[] = [
  {
    id: "PR-001",
    name: "Moscow Liquidity Desk",
    country: "Russia",
    currency: "RUB",
    methods: "Corporate Account, Bank Card",
    dailyLimit: "150,000 USDT",
    reserve: "82,000 USDT",
    fee: "1.2%",
    status: "Active",
  },
  {
    id: "PR-002",
    name: "KZ Settlement Partner",
    country: "Kazakhstan",
    currency: "KZT",
    methods: "Bank Card, Personal Account",
    dailyLimit: "80,000 USDT",
    reserve: "44,000 USDT",
    fee: "1.5%",
    status: "Active",
  },
  {
    id: "PR-003",
    name: "UZ Corporate Route",
    country: "Uzbekistan",
    currency: "UZS",
    methods: "Corporate Account",
    dailyLimit: "120,000 USDT",
    reserve: "31,000 USDT",
    fee: "1.8%",
    status: "Limited",
  },
  {
    id: "PR-004",
    name: "AZ Payout Partner",
    country: "Azerbaijan",
    currency: "AZN",
    methods: "Bank Account",
    dailyLimit: "50,000 USDT",
    reserve: "19,000 USDT",
    fee: "1.6%",
    status: "Active",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Limited: "bg-amber-50 text-amber-600",
  "Low Reserve": "bg-rose-50 text-rose-600",
  Paused: "bg-slate-100 text-slate-500",
};

const LIQUIDITY_STATUSES = ["Healthy", "Limited", "Low Reserve", "Paused"];

const legendStyles: Record<string, string> = {
  Healthy: "bg-emerald-50 text-emerald-600",
  Limited: "bg-amber-50 text-amber-600",
  "Low Reserve": "bg-rose-50 text-rose-600",
  Paused: "bg-slate-100 text-slate-500",
};

const PARTNER_RULES = [
  "Minimum 2 partners per country",
  "Backup route required for large payouts",
  "Manual approval for payouts above limit",
];

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminPartnersPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Partners &amp; Liquidity
          </h1>
          <p className="text-lg text-slate-600">
            Manage payout partners, reserves and local currency liquidity.
          </p>
        </div>

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((card) => (
            <div
              key={card.label}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Partners</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className={thClass}>Partner ID</th>
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Country</th>
                  <th className={thClass}>Currency</th>
                  <th className={thClass}>Methods</th>
                  <th className={thClass}>Daily Limit</th>
                  <th className={thClass}>Available Reserve</th>
                  <th className={thClass}>Fee</th>
                  <th className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PARTNERS.map((row) => (
                  <tr key={row.id} className="text-slate-700">
                    <td className={`${tdClass} font-semibold text-slate-950`}>
                      {row.id}
                    </td>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.country}</td>
                    <td className={tdClass}>{row.currency}</td>
                    <td className={tdClass}>{row.methods}</td>
                    <td className={tdClass}>{row.dailyLimit}</td>
                    <td className={`${tdClass} font-semibold text-slate-950`}>
                      {row.reserve}
                    </td>
                    <td className={tdClass}>{row.fee}</td>
                    <td className={tdClass}>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[row.status] ??
                          "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {row.status}
                      </span>
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
              Liquidity Status Legend
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {LIQUIDITY_STATUSES.map((status) => (
                <span
                  key={status}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    legendStyles[status] ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Partner Rules</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {PARTNER_RULES.map((rule) => (
                <li key={rule} className="flex items-center gap-2">
                  <span className="text-blue-900">✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
