"use client";

import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useLocale } from "../../lib/locale-context";

type StepState = "done" | "current" | "pending";

const STEP_STATUSES = [
  "CREATED",
  "WAITING_PAYMENT",
  "CRYPTO_RECEIVED",
  "AML_REVIEW",
  "READY_FOR_PAYOUT",
  "PROCESSING",
  "COMPLETED",
];

interface StatusResult {
  requestNumber: string;
  status: string;
  statusLabel: string;
  stepIndex: number;
  cryptoAmount: string;
  cryptoAsset: string;
  payoutCurrency: string;
  country: string;
  createdAt: string;
}

const markerStyles: Record<StepState, React.CSSProperties> = {
  done:    { background: "var(--color-brand)", borderColor: "var(--color-brand)", color: "#fff" },
  current: { background: "var(--color-brand-dim)", borderColor: "var(--color-brand)", color: "var(--color-brand)" },
  pending: { background: "var(--color-bg-surface)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" },
};

const badgeStyles: Record<StepState, React.CSSProperties> = {
  done:    { background: "rgba(34,197,94,0.1)", color: "rgb(22,163,74)" },
  current: { background: "var(--color-brand-dim)", color: "var(--color-brand)" },
  pending: { background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" },
};

export default function StatusPage() {
  const { dict } = useLocale();
  const t = dict.status;

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack() {
    const num = inputValue.trim().toUpperCase();
    if (!num) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/public/status/${encodeURIComponent(num)}`);
      if (res.status === 404) {
        setError(t.notFound ?? "Заявка не найдена. Проверьте номер.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data: StatusResult = await res.json();
      setResult(data);
    } catch {
      setError(t.loadError ?? "Ошибка загрузки. Попробуйте позже.");
    }
    setLoading(false);
  }

  function getStepState(idx: number, currentStepIndex: number): StepState {
    if (idx < currentStepIndex) return "done";
    if (idx === currentStepIndex) return "current";
    return "pending";
  }

  return (
    <>
      <Header />
      <main style={{ background: "var(--color-bg-base)", minHeight: "70vh" }} className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div
              className="mb-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)", border: "1px solid rgba(37,99,235,0.25)" }}
            >
              {t.badge}
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl" style={{ color: "var(--color-text-primary)" }}>
              {t.title}
            </h1>
            <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>{t.subtitle}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {t.trustPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                  style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                >
                  <span style={{ color: "var(--color-brand)" }}>✓</span>
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <input
              id="request-id"
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
              placeholder={t.inputPlaceholder}
              className="w-full rounded-2xl px-4 py-4 text-base font-medium outline-none transition"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
            <button
              type="button"
              onClick={handleTrack}
              disabled={loading}
              className="shrink-0 rounded-2xl px-7 py-4 text-base font-semibold transition disabled:opacity-60"
              style={{ background: "var(--color-brand)", color: "#fff" }}
            >
              {loading ? "..." : t.trackButton}
            </button>
          </div>

          {error && (
            <div
              className="mt-6 rounded-2xl px-6 py-4 text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "rgb(220,38,38)" }}
            >
              {error}
            </div>
          )}

          {result && (
            <div
              className="mt-8 rounded-[2rem] p-6 shadow-2xl sm:p-8"
              style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                  {t.requestWord} {result.requestNumber}
                </h2>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)" }}
                >
                  {result.statusLabel}
                </span>
              </div>

              <dl
                className="mt-6 grid grid-cols-2 gap-4 rounded-2xl p-5 sm:grid-cols-3"
                style={{ background: "var(--color-bg-base)" }}
              >
                {[
                  { label: t.fields.requestId,  value: result.requestNumber },
                  { label: t.fields.crypto,      value: `${result.cryptoAmount} ${result.cryptoAsset}` },
                  { label: t.fields.currency,    value: result.payoutCurrency },
                  { label: t.fields.country,     value: result.country },
                  { label: "Дата создания",      value: new Date(result.createdAt).toLocaleDateString("ru-RU") },
                ].map(item => (
                  <div key={item.label}>
                    <dt className="text-sm" style={{ color: "var(--color-text-muted)" }}>{item.label}</dt>
                    <dd className="mt-1 font-semibold" style={{ color: "var(--color-text-primary)" }}>{item.value}</dd>
                  </div>
                ))}
              </dl>

              <ol className="mt-8 space-y-6">
                {t.steps.map((label, index) => {
                  const state = getStepState(index, result.stepIndex);
                  const isLast = index === t.steps.length - 1;
                  return (
                    <li key={label} className="relative flex gap-4">
                      {!isLast && (
                        <span
                          className="absolute left-5 top-10 w-px"
                          style={{
                            height: "calc(100% - 0.5rem)",
                            background: state === "done" ? "var(--color-brand)" : "var(--color-border)",
                          }}
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                        style={markerStyles[state]}
                      >
                        {state === "done" ? "✓" : index + 1}
                      </span>
                      <div className="flex flex-1 items-center justify-between pt-1">
                        <p className="font-semibold" style={{ color: state === "pending" ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>
                          {label}
                        </p>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={badgeStyles[state]}
                        >
                          {t.stateLabels[state]}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {!result && !error && (
            <p className="mt-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t.footnote}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
