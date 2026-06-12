type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Actions Today", value: "86" },
  { label: "Status Changes", value: "34" },
  { label: "Rate Updates", value: "7" },
  { label: "AML Decisions", value: "12" },
];

type LogRow = {
  time: string;
  operator: string;
  action: string;
  entity: string;
  oldValue: string;
  newValue: string;
  ip: string;
};

const LOGS: LogRow[] = [
  {
    time: "12:44",
    operator: "Anna",
    action: "Request status changed",
    entity: "NX-2026-0001",
    oldValue: "AML Review",
    newValue: "Ready for Payout",
    ip: "192.168.1.12",
  },
  {
    time: "12:32",
    operator: "Ivan",
    action: "Margin updated",
    entity: "USDT/RUB",
    oldValue: "2.5%",
    newValue: "2.8%",
    ip: "192.168.1.18",
  },
  {
    time: "12:10",
    operator: "Marina",
    action: "AML decision",
    entity: "NX-2026-0003",
    oldValue: "Pending",
    newValue: "Approved",
    ip: "192.168.1.21",
  },
  {
    time: "11:58",
    operator: "Anna",
    action: "Payout completed",
    entity: "PO-2026-0001",
    oldValue: "Processing",
    newValue: "Completed",
    ip: "192.168.1.12",
  },
];

const IMPORTANT_ACTIONS = [
  "Payout completion",
  "AML decisions",
  "Rate and margin changes",
  "Client risk level updates",
  "Partner status changes",
];

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminAuditLogsPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Audit Logs
          </h1>
          <p className="text-lg text-slate-600">
            Track critical actions, status changes, rate updates and operator
            decisions.
          </p>
        </div>

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((card) => (
            <div
              key={card.label}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-950">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Audit Logs</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className={thClass}>Time</th>
                  <th className={thClass}>Operator</th>
                  <th className={thClass}>Action</th>
                  <th className={thClass}>Entity</th>
                  <th className={thClass}>Old Value</th>
                  <th className={thClass}>New Value</th>
                  <th className={thClass}>IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LOGS.map((row, index) => (
                  <tr key={`${row.time}-${index}`} className="text-slate-700">
                    <td className={`${tdClass} font-semibold text-slate-950`}>
                      {row.time}
                    </td>
                    <td className={tdClass}>{row.operator}</td>
                    <td className={tdClass}>{row.action}</td>
                    <td className={`${tdClass} font-semibold text-slate-950`}>
                      {row.entity}
                    </td>
                    <td className={tdClass}>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {row.oldValue}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        {row.newValue}
                      </span>
                    </td>
                    <td className={`${tdClass} font-mono text-slate-500`}>
                      {row.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Important Actions</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
            {IMPORTANT_ACTIONS.map((action) => (
              <li
                key={action}
                className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3"
              >
                <span className="text-blue-900">✓</span>
                {action}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
