import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

type StepState = "done" | "current" | "pending";

type Step = {
  label: string;
  state: StepState;
};

const STEPS: Step[] = [
  { label: "Request Created", state: "done" },
  { label: "Waiting for Crypto Payment", state: "done" },
  { label: "Crypto Received", state: "done" },
  { label: "AML Review", state: "current" },
  { label: "Payout Processing", state: "pending" },
  { label: "Completed", state: "pending" },
];

const SAMPLE = [
  { label: "Request ID", value: "NX-2026-0001" },
  { label: "Crypto", value: "10,000 USDT" },
  { label: "Payout", value: "Corporate Account" },
  { label: "Country", value: "Russia" },
  { label: "Currency", value: "RUB" },
];

const TRUST_POINTS = [
  "Corporate bank account payouts",
  "Supplier & contractor settlements",
  "AML-monitored processing",
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

const STATUS_LABEL: Record<StepState, string> = {
  done: "Done",
  current: "In progress",
  pending: "Pending",
};

const badgeStyles: Record<StepState, string> = {
  done: "bg-emerald-50 text-emerald-600",
  current: "bg-cyan-50 text-cyan-700",
  pending: "bg-slate-100 text-slate-500",
};

export default function StatusPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Request Status
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Track Your Business Payout Request
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Monitor every stage of your crypto-to-bank settlement — from
              supplier payments to corporate bank account payouts across CIS
              countries.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {TRUST_POINTS.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <span className="text-blue-900">✓</span>
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <input
              id="request-id"
              type="text"
              placeholder="e.g. NX-2026-0001"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
            <button
              type="button"
              className="shrink-0 rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-950"
            >
              Track Request
            </button>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">
                Request {SAMPLE[0].value}
              </h2>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                AML Review
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3">
              {SAMPLE.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-slate-500">{item.label}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ol className="mt-8 space-y-6">
              {STEPS.map((step, index) => {
                const isLast = index === STEPS.length - 1;
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

                    <div className="flex flex-1 items-center justify-between pt-1">
                      <p className={`font-semibold ${labelStyles[step.state]}`}>
                        {step.label}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[step.state]}`}
                      >
                        {STATUS_LABEL[step.state]}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Sample request shown for demonstration. Live tracking will be
            available after launch.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
