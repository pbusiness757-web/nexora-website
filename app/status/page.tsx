"use client";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useLocale } from "../../lib/locale-context";

type StepState = "done" | "current" | "pending";

const STEP_STATES: StepState[] = [
  "done",
  "done",
  "done",
  "current",
  "pending",
  "pending",
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

const badgeStyles: Record<StepState, string> = {
  done: "bg-emerald-50 text-emerald-600",
  current: "bg-cyan-50 text-cyan-700",
  pending: "bg-slate-100 text-slate-500",
};

const SAMPLE_ID = "NX-2026-0001";

export default function StatusPage() {
  const { dict } = useLocale();
  const t = dict.status;

  const sample = [
    { label: t.fields.requestId, value: SAMPLE_ID },
    { label: t.fields.crypto, value: "10,000 USDT" },
    { label: t.fields.payout, value: t.samplePayout },
    { label: t.fields.country, value: dict.countries.names.Russia },
    { label: t.fields.currency, value: "RUB" },
  ];

  return (
    <>
      <Header />
      <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              {t.badge}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t.subtitle}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {t.trustPoints.map((point) => (
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
              placeholder={t.inputPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
            <button
              type="button"
              className="shrink-0 rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-950"
            >
              {t.trackButton}
            </button>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">
                {t.requestWord} {SAMPLE_ID}
              </h2>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                {t.currentStatus}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3">
              {sample.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-slate-500">{item.label}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ol className="mt-8 space-y-6">
              {t.steps.map((label, index) => {
                const state = STEP_STATES[index] ?? "pending";
                const isLast = index === t.steps.length - 1;
                return (
                  <li key={label} className="relative flex gap-4">
                    {!isLast && (
                      <span
                        className={`absolute left-5 top-10 h-[calc(100%-0.5rem)] w-px ${
                          state === "done" ? "bg-blue-900" : "bg-slate-200"
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${markerStyles[state]}`}
                    >
                      {state === "done" ? "✓" : index + 1}
                    </span>

                    <div className="flex flex-1 items-center justify-between pt-1">
                      <p className={`font-semibold ${labelStyles[state]}`}>
                        {label}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[state]}`}
                      >
                        {t.stateLabels[state]}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            {t.footnote}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
