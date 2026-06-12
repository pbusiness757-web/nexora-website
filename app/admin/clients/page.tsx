type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Total Clients", value: "248" },
  { label: "Business Clients", value: "64" },
  { label: "Individual Clients", value: "184" },
  { label: "High Value Clients", value: "17" },
];

type ClientRow = {
  id: string;
  name: string;
  type: string;
  country: string;
  volume: string;
  requests: string;
  risk: string;
  status: string;
};

const CLIENTS: ClientRow[] = [
  {
    id: "CL-0001",
    name: "Alpha Trade LLC",
    type: "Business",
    country: "Russia",
    volume: "125,000 USDT",
    requests: "14",
    risk: "Low",
    status: "Active",
  },
  {
    id: "CL-0002",
    name: "Private Client",
    type: "Individual",
    country: "Kazakhstan",
    volume: "18,500 USDT",
    requests: "6",
    risk: "Medium",
    status: "Active",
  },
  {
    id: "CL-0003",
    name: "UzMarket Group",
    type: "Business",
    country: "Uzbekistan",
    volume: "240,000 USDT",
    requests: "22",
    risk: "Low",
    status: "VIP",
  },
  {
    id: "CL-0004",
    name: "Contractor",
    type: "Individual",
    country: "Azerbaijan",
    volume: "9,200 USDT",
    requests: "3",
    risk: "Low",
    status: "Active",
  },
];

const riskStyles: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
};

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  VIP: "bg-indigo-50 text-indigo-700",
  Suspended: "bg-rose-50 text-rose-600",
};

const CLIENT_TYPES = ["Individual", "Business", "VIP"];

const typeStyles: Record<string, string> = {
  Individual: "bg-slate-100 text-slate-600",
  Business: "bg-blue-50 text-blue-700",
  VIP: "bg-indigo-50 text-indigo-700",
};

const FILTER_TYPE = ["All Types", "Individual", "Business", "VIP"];
const FILTER_COUNTRY = [
  "All Countries",
  "Russia",
  "Kazakhstan",
  "Uzbekistan",
  "Azerbaijan",
  "Kyrgyzstan",
];
const FILTER_RISK = ["All Levels", "Low", "Medium", "High"];

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminClientsPage() {
  return (
    <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Clients Management
            </h1>
            <p className="text-lg text-slate-600">
              View individual and business clients, volumes and risk levels.
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
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {card.value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="search-name"
                  className="text-sm font-semibold text-slate-500"
                >
                  Search by name
                </label>
                <input
                  id="search-name"
                  type="text"
                  placeholder="e.g. Alpha Trade LLC"
                  className={`mt-2 ${fieldClass}`}
                />
              </div>

              <div>
                <label
                  htmlFor="filter-type"
                  className="text-sm font-semibold text-slate-500"
                >
                  Client Type
                </label>
                <select id="filter-type" className={`mt-2 ${fieldClass}`}>
                  {FILTER_TYPE.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-country"
                  className="text-sm font-semibold text-slate-500"
                >
                  Country
                </label>
                <select id="filter-country" className={`mt-2 ${fieldClass}`}>
                  {FILTER_COUNTRY.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-risk"
                  className="text-sm font-semibold text-slate-500"
                >
                  Risk Level
                </label>
                <select id="filter-risk" className={`mt-2 ${fieldClass}`}>
                  {FILTER_RISK.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Clients</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>Client ID</th>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Type</th>
                    <th className={thClass}>Country</th>
                    <th className={thClass}>Total Volume</th>
                    <th className={thClass}>Requests</th>
                    <th className={thClass}>Risk Level</th>
                    <th className={thClass}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CLIENTS.map((row) => (
                    <tr key={row.id} className="text-slate-700">
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.id}
                      </td>
                      <td className={tdClass}>{row.name}</td>
                      <td className={tdClass}>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            typeStyles[row.type] ?? "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className={tdClass}>{row.country}</td>
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.volume}
                      </td>
                      <td className={tdClass}>{row.requests}</td>
                      <td className={tdClass}>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            riskStyles[row.risk] ?? "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.risk}
                        </span>
                      </td>
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

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">
              Client Types Legend
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {CLIENT_TYPES.map((type) => (
                <span
                  key={type}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    typeStyles[type] ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </section>
        </div>
    </main>
  );
}
