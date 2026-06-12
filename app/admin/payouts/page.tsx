import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Pending Payouts", value: "9" },
  { label: "Processing", value: "6" },
  { label: "Completed Today", value: "18" },
  { label: "Failed / On Hold", value: "2" },
];

type PayoutRow = {
  id: string;
  requestId: string;
  recipient: string;
  recipientType: string;
  country: string;
  currency: string;
  amount: string;
  method: string;
  status: string;
  operator: string;
};

const PAYOUTS: PayoutRow[] = [
  {
    id: "PO-2026-0001",
    requestId: "NX-2026-0001",
    recipient: "Alpha Trade LLC",
    recipientType: "Organization",
    country: "Russia",
    currency: "RUB",
    amount: "925,000",
    method: "Corporate Account",
    status: "Processing",
    operator: "Anna",
  },
  {
    id: "PO-2026-0002",
    requestId: "NX-2026-0002",
    recipient: "Private Client",
    recipientType: "Individual",
    country: "Kazakhstan",
    currency: "KZT",
    amount: "1,125,000",
    method: "Bank Card",
    status: "Pending",
    operator: "Ivan",
  },
  {
    id: "PO-2026-0003",
    requestId: "NX-2026-0003",
    recipient: "UzMarket Group",
    recipientType: "Organization",
    country: "Uzbekistan",
    currency: "UZS",
    amount: "228,000,000",
    method: "Corporate Account",
    status: "Ready",
    operator: "Marina",
  },
  {
    id: "PO-2026-0004",
    requestId: "NX-2026-0004",
    recipient: "Contractor",
    recipientType: "Individual",
    country: "Azerbaijan",
    currency: "AZN",
    amount: "6,800",
    method: "Personal Account",
    status: "Completed",
    operator: "Anna",
  },
];

const STATUSES = [
  "Pending",
  "Ready",
  "Processing",
  "Completed",
  "Failed",
  "On Hold",
];

const statusStyles: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-600",
  Ready: "bg-indigo-50 text-indigo-700",
  Processing: "bg-amber-50 text-amber-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Failed: "bg-rose-50 text-rose-600",
  "On Hold": "bg-orange-50 text-orange-600",
};

const FILTER_COUNTRY = [
  "All Countries",
  "Russia",
  "Kazakhstan",
  "Uzbekistan",
  "Azerbaijan",
  "Kyrgyzstan",
];
const FILTER_METHOD = [
  "All Methods",
  "Corporate Account",
  "Personal Account",
  "Bank Card",
];
const FILTER_STATUS = ["All Statuses", ...STATUSES];

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";

export default function AdminPayoutsPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Payouts Management
            </h1>
            <p className="text-lg text-slate-600">
              Track and manage local currency payouts to individuals, companies
              and corporate bank accounts.
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
                  htmlFor="search-id"
                  className="text-sm font-semibold text-slate-500"
                >
                  Search by Payout ID
                </label>
                <input
                  id="search-id"
                  type="text"
                  placeholder="e.g. PO-2026-0001"
                  className={`mt-2 ${fieldClass}`}
                />
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
                  htmlFor="filter-method"
                  className="text-sm font-semibold text-slate-500"
                >
                  Method
                </label>
                <select id="filter-method" className={`mt-2 ${fieldClass}`}>
                  {FILTER_METHOD.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-status"
                  className="text-sm font-semibold text-slate-500"
                >
                  Status
                </label>
                <select id="filter-status" className={`mt-2 ${fieldClass}`}>
                  {FILTER_STATUS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Payouts</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">Payout ID</th>
                    <th className="pb-3 font-semibold">Request ID</th>
                    <th className="pb-3 font-semibold">Recipient</th>
                    <th className="pb-3 font-semibold">Recipient Type</th>
                    <th className="pb-3 font-semibold">Country</th>
                    <th className="pb-3 font-semibold">Currency</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Method</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PAYOUTS.map((row) => (
                    <tr key={row.id} className="text-slate-700">
                      <td className="py-4 font-semibold text-slate-950">
                        {row.id}
                      </td>
                      <td className="py-4">{row.requestId}</td>
                      <td className="py-4">{row.recipient}</td>
                      <td className="py-4">{row.recipientType}</td>
                      <td className="py-4">{row.country}</td>
                      <td className="py-4">{row.currency}</td>
                      <td className="py-4 font-semibold text-slate-950">
                        {row.amount}
                      </td>
                      <td className="py-4">{row.method}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[row.status] ??
                            "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4">{row.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Status Legend</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {STATUSES.map((status) => (
                <span
                  key={status}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[status] ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
