type RequestRow = {
  id: string;
  date: string;
  client: string;
  country: string;
  recipientType: string;
  crypto: string;
  method: string;
  status: string;
  operator: string;
};

const REQUESTS: RequestRow[] = [
  {
    id: "NX-2026-0001",
    date: "2026-06-12",
    client: "Alpha Trade LLC",
    country: "Russia",
    recipientType: "Organization",
    crypto: "10,000 USDT",
    method: "Corporate Account",
    status: "AML Review",
    operator: "Anna",
  },
  {
    id: "NX-2026-0002",
    date: "2026-06-12",
    client: "Private Client",
    country: "Kazakhstan",
    recipientType: "Individual",
    crypto: "2,500 USDT",
    method: "Bank Card",
    status: "Waiting Payment",
    operator: "Ivan",
  },
  {
    id: "NX-2026-0003",
    date: "2026-06-11",
    client: "UzMarket Group",
    country: "Uzbekistan",
    recipientType: "Organization",
    crypto: "18,000 USDT",
    method: "Corporate Account",
    status: "Ready for Payout",
    operator: "Marina",
  },
  {
    id: "NX-2026-0004",
    date: "2026-06-11",
    client: "Contractor",
    country: "Azerbaijan",
    recipientType: "Individual",
    crypto: "4,000 USDT",
    method: "Personal Account",
    status: "Completed",
    operator: "Anna",
  },
];

const STATUSES = [
  "Waiting Payment",
  "Crypto Received",
  "AML Review",
  "Ready for Payout",
  "Processing",
  "Completed",
  "On Hold",
];

const statusStyles: Record<string, string> = {
  "Waiting Payment": "bg-slate-100 text-slate-600",
  "Crypto Received": "bg-blue-50 text-blue-700",
  "AML Review": "bg-cyan-50 text-cyan-700",
  "Ready for Payout": "bg-indigo-50 text-indigo-700",
  Processing: "bg-amber-50 text-amber-600",
  Completed: "bg-emerald-50 text-emerald-600",
  "On Hold": "bg-rose-50 text-rose-600",
};

const FILTER_STATUS = ["All Statuses", ...STATUSES];
const FILTER_COUNTRY = [
  "All Countries",
  "Russia",
  "Kazakhstan",
  "Uzbekistan",
  "Azerbaijan",
  "Kyrgyzstan",
];
const FILTER_RECIPIENT = ["All Types", "Individual", "Organization"];

const selectClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";

export default function AdminRequestsPage() {
  return (
    <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Requests Management
            </h1>
            <p className="text-lg text-slate-600">
              Review, track and process crypto-to-bank payout requests.
            </p>
          </div>

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="search-id"
                  className="text-sm font-semibold text-slate-500"
                >
                  Search by Request ID
                </label>
                <input
                  id="search-id"
                  type="text"
                  placeholder="e.g. NX-2026-0001"
                  className={`mt-2 ${selectClass}`}
                />
              </div>

              <div>
                <label
                  htmlFor="filter-status"
                  className="text-sm font-semibold text-slate-500"
                >
                  Status
                </label>
                <select id="filter-status" className={`mt-2 ${selectClass}`}>
                  {FILTER_STATUS.map((option) => (
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
                <select id="filter-country" className={`mt-2 ${selectClass}`}>
                  {FILTER_COUNTRY.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-recipient"
                  className="text-sm font-semibold text-slate-500"
                >
                  Recipient Type
                </label>
                <select id="filter-recipient" className={`mt-2 ${selectClass}`}>
                  {FILTER_RECIPIENT.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Requests</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">Request ID</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Country</th>
                    <th className="pb-3 font-semibold">Recipient Type</th>
                    <th className="pb-3 font-semibold">Crypto Amount</th>
                    <th className="pb-3 font-semibold">Payout Method</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REQUESTS.map((row) => (
                    <tr key={row.id} className="text-slate-700">
                      <td className="py-4 font-semibold text-slate-950">
                        {row.id}
                      </td>
                      <td className="py-4">{row.date}</td>
                      <td className="py-4">{row.client}</td>
                      <td className="py-4">{row.country}</td>
                      <td className="py-4">{row.recipientType}</td>
                      <td className="py-4">{row.crypto}</td>
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
  );
}
