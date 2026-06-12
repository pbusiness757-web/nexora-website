type StepState = "done" | "current" | "pending";

type Step = {
  label: string;
  state: StepState;
};

const TIMELINE: Step[] = [
  { label: "Created", state: "done" },
  { label: "Crypto Received", state: "done" },
  { label: "AML Review", state: "current" },
  { label: "Ready for Payout", state: "pending" },
  { label: "Processing", state: "pending" },
  { label: "Completed", state: "pending" },
];

const CLIENT_INFO = [
  { label: "Client", value: "Alpha Trade LLC" },
  { label: "Type", value: "Business client" },
  { label: "Country", value: "Russia" },
  { label: "Risk Level", value: "Low" },
];

const CRYPTO_PAYMENT = [
  { label: "Asset", value: "USDT" },
  { label: "Network", value: "TRC20" },
  { label: "Amount", value: "10,000 USDT" },
  { label: "Transaction Hash", value: "TQ9...8K2", mono: true },
  { label: "Confirmations", value: "24" },
];

const PAYOUT_DETAILS = [
  { label: "Recipient", value: "Alpha Trade LLC" },
  { label: "Recipient Type", value: "Organization" },
  { label: "Country", value: "Russia" },
  { label: "Currency", value: "RUB" },
  { label: "Method", value: "Corporate Account" },
  { label: "Amount", value: "925,000 RUB" },
];

const FINANCIAL_SUMMARY = [
  { label: "Market Rate", value: "92.50 RUB" },
  { label: "Client Rate", value: "90.18 RUB" },
  { label: "Margin %", value: "2.5%" },
  { label: "Gross Profit", value: "23,200 RUB", highlight: true },
];

const ACTIONS = [
  { label: "Approve AML", primary: true },
  { label: "Mark Ready for Payout", primary: false },
  { label: "Mark as Paid", primary: false },
  { label: "Put On Hold", primary: false },
];

const markerStyles: Record<StepState, string> = {
  done: "border-blue-900 bg-blue-900 text-white",
  current: "border-cyan-500 bg-cyan-50 text-cyan-700",
  pending: "border-slate-200 bg-white text-slate-400",
};

const labelStyles: Record<StepState, string> = {
  done: "text-slate-950",
  current: "text-slate-950",
  pending: "text-slate-400",
};

function InfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; mono?: boolean; highlight?: boolean }[];
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <dl className="mt-6 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-4"
          >
            <dt className="text-sm text-slate-600">{row.label}</dt>
            <dd
              className={`text-right font-semibold ${
                row.highlight ? "text-blue-900" : "text-slate-950"
              } ${row.mono ? "font-mono text-slate-500" : ""}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AdminRequestDetailsPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Request NX-2026-0001
          </h1>
          <p className="text-lg text-slate-600">
            Corporate crypto-to-bank payout request.
          </p>
        </div>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Status Timeline</h2>
          <ol className="mt-8 space-y-6">
            {TIMELINE.map((step, index) => {
              const isLast = index === TIMELINE.length - 1;
              return (
                <li key={step.label} className="relative flex gap-4">
                  {!isLast && (
                    <span
                      className={`absolute left-5 top-10 h-[calc(100%-0.5rem)] w-px ${
                        step.state === "done" ? "bg-blue-900" : "bg-slate-200"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${markerStyles[step.state]}`}
                  >
                    {step.state === "done" ? "✓" : index + 1}
                  </span>
                  <div className="flex flex-1 items-center pt-2">
                    <p className={`font-semibold ${labelStyles[step.state]}`}>
                      {step.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InfoCard title="Client Information" rows={CLIENT_INFO} />
          <InfoCard title="Crypto Payment" rows={CRYPTO_PAYMENT} />
          <InfoCard title="Payout Details" rows={PAYOUT_DETAILS} />
          <InfoCard title="Financial Summary" rows={FINANCIAL_SUMMARY} />
        </div>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Operator Actions</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIONS.map((action) => (
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
  );
}
