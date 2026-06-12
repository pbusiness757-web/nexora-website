import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

type SummaryCard = {
  label: string;
  value: string;
};

const SUMMARY: SummaryCard[] = [
  { label: "Total Requests", value: "12" },
  { label: "Active Requests", value: "2" },
  { label: "Completed Requests", value: "10" },
  { label: "Total Volume", value: "84,500 USDT" },
];

type RequestRow = {
  id: string;
  country: string;
  payout: string;
  crypto: string;
  status: string;
};

const REQUESTS: RequestRow[] = [
  {
    id: "NX-2026-0001",
    country: "Russia",
    payout: "Corporate Account",
    crypto: "10,000 USDT",
    status: "Payout Processing",
  },
  {
    id: "NX-2026-0002",
    country: "Kazakhstan",
    payout: "Bank Card",
    crypto: "2,500 USDT",
    status: "Completed",
  },
  {
    id: "NX-2026-0003",
    country: "Uzbekistan",
    payout: "Corporate Account",
    crypto: "18,000 USDT",
    status: "AML Review",
  },
];

const statusStyles: Record<string, string> = {
  "AML Review": "bg-cyan-50 text-cyan-700",
  "Payout Processing": "bg-amber-50 text-amber-600",
  Completed: "bg-emerald-50 text-emerald-600",
};

const QUICK_ACTIONS = [
  { label: "Create Request", href: "/exchange", primary: true },
  { label: "Track Request", href: "/status", primary: false },
  { label: "Upload Documents", href: "#", primary: false },
];

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Client Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Manage payout requests, track transactions and review account
              status.
            </p>
          </div>

          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SUMMARY.map((card) => (
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

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
                <h2 className="text-lg font-bold text-slate-950">
                  Recent Requests
                </h2>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-3 font-semibold">Request ID</th>
                        <th className="pb-3 font-semibold">Country</th>
                        <th className="pb-3 font-semibold">Payout</th>
                        <th className="pb-3 font-semibold">Crypto</th>
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
                          <td className="py-4">{row.payout}</td>
                          <td className="py-4">{row.crypto}</td>
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
                <h2 className="text-lg font-bold text-slate-950">KYC Status</h2>
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                  <div>
                    <p className="text-sm text-slate-500">Verification</p>
                    <p className="mt-1 text-xl font-bold text-slate-950">
                      Verified
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Your account is verified for business and individual payout
                  requests.
                </p>
              </section>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
                <h2 className="text-lg font-bold text-slate-950">
                  Quick Actions
                </h2>
                <div className="mt-6 flex flex-col gap-3">
                  {QUICK_ACTIONS.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      className={
                        action.primary
                          ? "rounded-2xl bg-blue-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-950"
                          : "rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900"
                      }
                    >
                      {action.label}
                    </a>
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
