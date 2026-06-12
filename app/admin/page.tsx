import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

type Kpi = {
  label: string;
  value: string;
};

const KPIS: Kpi[] = [
  { label: "Active Requests", value: "24" },
  { label: "Completed Today", value: "18" },
  { label: "Daily Volume", value: "125,000 USDT" },
  { label: "Estimated Profit", value: "3,250 USDT" },
];

type RequestRow = {
  id: string;
  country: string;
  recipientType: string;
  amount: string;
  status: string;
};

const REQUESTS: RequestRow[] = [
  {
    id: "NX-2026-0042",
    country: "Russia",
    recipientType: "Business",
    amount: "10,000 USDT",
    status: "Waiting Payment",
  },
  {
    id: "NX-2026-0041",
    country: "Kazakhstan",
    recipientType: "Individual",
    amount: "2,500 USDT",
    status: "AML Review",
  },
  {
    id: "NX-2026-0040",
    country: "Uzbekistan",
    recipientType: "Business",
    amount: "18,000 USDT",
    status: "Ready for Payout",
  },
  {
    id: "NX-2026-0039",
    country: "Azerbaijan",
    recipientType: "Individual",
    amount: "4,200 USDT",
    status: "Processing",
  },
  {
    id: "NX-2026-0038",
    country: "Kyrgyzstan",
    recipientType: "Business",
    amount: "9,800 USDT",
    status: "Completed",
  },
];

const statusStyles: Record<string, string> = {
  "Waiting Payment": "bg-slate-100 text-slate-600",
  "AML Review": "bg-cyan-50 text-cyan-700",
  "Ready for Payout": "bg-blue-50 text-blue-900",
  Processing: "bg-amber-50 text-amber-600",
  Completed: "bg-emerald-50 text-emerald-600",
};

const LIQUIDITY = ["RUB", "KZT", "UZS", "AZN", "KGS"];

const QUICK_ACTIONS = [
  { label: "New Request", primary: true },
  { label: "Review AML", primary: false },
  { label: "Manage Rates", primary: false },
  { label: "View Reports", primary: false },
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Operations Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Monitor requests, payouts and platform activity.
            </p>
          </div>

          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <p className="text-sm font-medium text-slate-500">
                  {kpi.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {kpi.value}
                </p>
              </div>
            ))}
          </section>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
                <h2 className="text-lg font-bold text-slate-950">
                  Recent Requests
                </h2>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-3 font-semibold">ID</th>
                        <th className="pb-3 font-semibold">Country</th>
                        <th className="pb-3 font-semibold">Recipient Type</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {REQUESTS.map((row) => (
                        <tr key={row.id} className="text-slate-700">
                          <td className="py-4 font-semibold text-slate-950">
                            {row.id}
                          </td>
                          <td className="py-4">{row.country}</td>
                          <td className="py-4">{row.recipientType}</td>
                          <td className="py-4">{row.amount}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-6">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-950">
                    Liquidity Overview
                  </h2>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    Healthy
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {LIQUIDITY.map((currency) => (
                    <li
                      key={currency}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <span className="font-semibold text-slate-950">
                        {currency}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        Green
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
                <h2 className="text-lg font-bold text-slate-950">
                  Quick Actions
                </h2>
                <div className="mt-6 flex flex-col gap-3">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className={
                        action.primary
                          ? "rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950"
                          : "rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900"
                      }
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
