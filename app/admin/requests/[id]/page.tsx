"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiPayout = {
  payoutNumber: string;
  status: string;
  amount: string;
  currency: string;
};

type ApiClient = {
  companyName: string;
  country: string;
  riskLevel: string;
};

type ApiRequest = {
  id: string;
  requestNumber: string;
  status: string;
  cryptoAsset: string;
  network: string;
  cryptoAmount: string;
  payoutCurrency: string;
  payoutAmount: string;
  createdAt: string;
  clientId: string;
  client: ApiClient | null;
  payout: ApiPayout | null;
  // AML fields
  amlStatus: string;
  riskScore: number | null;
  amlComment: string | null;
  amlReviewedAt: string | null;
  amlReviewedBy: string | null;
};

type HistoryEntry = {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  createdAt: string;
};

type AmlForm = {
  amlStatus: string;
  riskScore: string;
  amlComment: string;
};

const STATUS_META: Record<string, { label: string; style: string }> = {
  CREATED:          { label: "Создана",           style: "bg-slate-100 text-slate-600" },
  WAITING_PAYMENT:  { label: "Ожидание оплаты",   style: "bg-slate-100 text-slate-600" },
  CRYPTO_RECEIVED:  { label: "Крипто получено",   style: "bg-blue-50 text-blue-700" },
  AML_REVIEW:       { label: "AML-проверка",      style: "bg-cyan-50 text-cyan-700" },
  READY_FOR_PAYOUT: { label: "Готово к выплате",  style: "bg-indigo-50 text-indigo-700" },
  PROCESSING:       { label: "В обработке",        style: "bg-amber-50 text-amber-600" },
  COMPLETED:        { label: "Завершено",          style: "bg-emerald-50 text-emerald-600" },
  ON_HOLD:          { label: "На удержании",       style: "bg-rose-50 text-rose-600" },
};

const AML_META: Record<string, { label: string; style: string }> = {
  PENDING:  { label: "Ожидает",        style: "bg-slate-100 text-slate-600" },
  PASSED:   { label: "Пройдена",       style: "bg-emerald-50 text-emerald-700" },
  REVIEW:   { label: "На проверке",   style: "bg-amber-50 text-amber-700" },
  REJECTED: { label: "Отклонена",     style: "bg-rose-50 text-rose-700" },
};

const TIMELINE_ORDER = [
  "CREATED",
  "WAITING_PAYMENT",
  "CRYPTO_RECEIVED",
  "AML_REVIEW",
  "READY_FOR_PAYOUT",
  "PROCESSING",
  "COMPLETED",
];

// Statuses blocked by AML REJECTED
const AML_BLOCKED = new Set(["READY_FOR_PAYOUT", "PROCESSING", "COMPLETED"]);

const STATUS_ACTIONS: { label: string; targetStatus: string; primary?: boolean }[] = [
  { label: "Начать AML-проверку",    targetStatus: "AML_REVIEW",       primary: true },
  { label: "Крипто получено",         targetStatus: "CRYPTO_RECEIVED" },
  { label: "Готово к выплате",        targetStatus: "READY_FOR_PAYOUT" },
  { label: "В обработке",            targetStatus: "PROCESSING" },
  { label: "Завершить заявку",        targetStatus: "COMPLETED",        primary: true },
  { label: "Поставить на удержание",  targetStatus: "ON_HOLD" },
];

function statusMeta(status: string) {
  return STATUS_META[status] ?? { label: status, style: "bg-slate-100 text-slate-500" };
}

function amlMeta(status: string) {
  return AML_META[status] ?? { label: status, style: "bg-slate-100 text-slate-500" };
}

function formatNumber(value: string) {
  return Number(value).toLocaleString("en-US");
}

function formatTs(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const markerStyles = {
  done:    "border-blue-900 bg-blue-900 text-white",
  current: "border-cyan-500 bg-cyan-50 text-cyan-700",
  pending: "border-slate-200 bg-white text-slate-400",
} as const;

function InfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; mono?: boolean }[];
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <dl className="mt-6 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-slate-600">{row.label}</dt>
            <dd className={`text-right font-semibold text-slate-950 ${row.mono ? "font-mono text-slate-500" : ""}`}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AdminRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [request, setRequest]     = useState<ApiRequest | null>(null);
  const [history, setHistory]     = useState<HistoryEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [updating, setUpdating]   = useState(false);
  const [amlSaving, setAmlSaving] = useState(false);
  const [toast, setToast]         = useState<{ text: string; ok: boolean } | null>(null);
  const [amlForm, setAmlForm]     = useState<AmlForm>({
    amlStatus: "PENDING",
    riskScore: "",
    amlComment: "",
  });

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [reqRes, histRes] = await Promise.all([
        fetch(`${API_BASE}/api/requests/${id}`, { credentials: "include" }),
        fetch(`${API_BASE}/api/requests/${id}/status-history`, { credentials: "include" }),
      ]);
      if (!reqRes.ok) throw new Error("request");
      const [reqData, histData] = await Promise.all([
        reqRes.json(),
        histRes.ok ? histRes.json() : Promise.resolve([]),
      ]);
      setRequest(reqData);
      setHistory(Array.isArray(histData) ? histData : []);
      setError(null);
      // Sync AML form with loaded data
      setAmlForm({
        amlStatus: reqData.amlStatus ?? "PENDING",
        riskScore: reqData.riskScore !== null && reqData.riskScore !== undefined
          ? String(reqData.riskScore) : "",
        amlComment: reqData.amlComment ?? "",
      });
    } catch {
      setError("Не удалось загрузить заявку.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(targetStatus: string) {
    if (!request || updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/requests/${request.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        showToast(body.error ?? "Ошибка при обновлении статуса", false);
        return;
      }
      showToast(`Статус изменён → «${statusMeta(targetStatus).label}»`, true);
      await load();
    } catch {
      showToast("Сетевая ошибка при обновлении статуса", false);
    } finally {
      setUpdating(false);
    }
  }

  async function handleAmlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!request || amlSaving) return;
    setAmlSaving(true);
    try {
      const body: Record<string, unknown> = { amlStatus: amlForm.amlStatus };
      if (amlForm.riskScore !== "") body.riskScore = Number(amlForm.riskScore);
      if (amlForm.amlComment.trim() !== "") body.amlComment = amlForm.amlComment.trim();

      const res = await fetch(`${API_BASE}/api/requests/${request.id}/aml`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        showToast(errBody.error ?? "Ошибка при обновлении AML", false);
        return;
      }
      showToast(`AML обновлена → «${amlMeta(amlForm.amlStatus).label}»`, true);
      await load();
    } catch {
      showToast("Сетевая ошибка при обновлении AML", false);
    } finally {
      setAmlSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">Загрузка заявки…</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error ?? "Заявка не найдена."}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = TIMELINE_ORDER.indexOf(request.status);
  const meta         = statusMeta(request.status);
  const amlBadge     = amlMeta(request.amlStatus ?? "PENDING");
  const amlRejected  = request.amlStatus === "REJECTED";

  const clientRows = request.client
    ? [
        { label: "Клиент",        value: request.client.companyName },
        { label: "Страна",        value: request.client.country },
        { label: "Уровень риска", value: request.client.riskLevel },
      ]
    : [{ label: "Клиент", value: request.clientId }];

  const cryptoRows = [
    { label: "Актив",   value: request.cryptoAsset },
    { label: "Сеть",    value: request.network },
    { label: "Сумма",   value: `${formatNumber(request.cryptoAmount)} ${request.cryptoAsset}` },
    { label: "Создана", value: request.createdAt.slice(0, 10) },
  ];

  const payoutRows = request.payout
    ? [
        { label: "Номер выплаты", value: request.payout.payoutNumber, mono: true },
        { label: "Статус",        value: statusMeta(request.payout.status).label },
        { label: "Сумма",         value: `${formatNumber(request.payout.amount)} ${request.payout.currency}` },
      ]
    : [
        { label: "Сумма",   value: `${formatNumber(request.payoutAmount)} ${request.payoutCurrency}` },
        { label: "Валюта",  value: request.payoutCurrency },
        { label: "Выплата", value: "Ещё не создана" },
      ];

  return (
    <div className="px-6 py-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl ${
            toast.ok ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Заявка {request.requestNumber}
            </h1>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.style}`}>
              {meta.label}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${amlBadge.style}`}>
              AML: {amlBadge.label}
            </span>
          </div>
          <p className="text-lg text-slate-600">Детали заявки на выплату крипто-в-банк.</p>
        </div>

        {/* AML REJECTED banner */}
        {amlRejected && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <p className="text-sm font-semibold text-rose-700">
              AML отклонена — переход в статусы «Готово к выплате», «В обработке» и «Завершено» заблокирован.
              Измените AML-статус, чтобы разблокировать прогресс.
            </p>
          </div>
        )}

        {/* Status timeline */}
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Хронология статусов</h2>

          {history.length > 0 ? (
            <ol className="mt-8 space-y-4">
              {history.map((entry) => (
                <li key={entry.id} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-900 bg-blue-900 text-xs font-bold text-white">
                    ✓
                  </span>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="font-semibold text-slate-950">
                      {statusMeta(entry.fromStatus).label}
                      <span className="mx-2 text-slate-400">→</span>
                      {statusMeta(entry.toStatus).label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatTs(entry.createdAt)}
                      {entry.changedBy && entry.changedBy !== "unknown"
                        ? ` · ${entry.changedBy}`
                        : ""}
                    </p>
                  </div>
                </li>
              ))}
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-50 text-xs font-bold text-cyan-700">
                  →
                </span>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="font-semibold text-slate-950">
                    Текущий: {statusMeta(request.status).label}
                  </p>
                </div>
              </li>
            </ol>
          ) : (
            <ol className="mt-8 space-y-6">
              {TIMELINE_ORDER.map((step, index) => {
                const state =
                  currentIndex === -1
                    ? "pending"
                    : index < currentIndex
                    ? "done"
                    : index === currentIndex
                    ? "current"
                    : "pending";
                const isLast = index === TIMELINE_ORDER.length - 1;
                return (
                  <li key={step} className="relative flex gap-4">
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
                    <div className="flex flex-1 items-center pt-2">
                      <p className={`font-semibold ${state === "pending" ? "text-slate-400" : "text-slate-950"}`}>
                        {statusMeta(step).label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InfoCard title="Информация о клиенте" rows={clientRows} />
          <InfoCard title="Крипто-платёж"        rows={cryptoRows} />
          <InfoCard title="Детали выплаты"        rows={payoutRows} />

          {/* Operator status actions */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Действия оператора</h2>
            <p className="mt-1 text-sm text-slate-500">
              Текущий статус:{" "}
              <span className="font-semibold text-slate-800">{meta.label}</span>
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STATUS_ACTIONS.filter((a) => a.targetStatus !== request.status).map((action) => {
                const isBlocked = amlRejected && AML_BLOCKED.has(action.targetStatus);
                return (
                  <button
                    key={action.targetStatus}
                    type="button"
                    disabled={updating || isBlocked}
                    title={isBlocked ? "Заблокировано: AML отклонена" : undefined}
                    onClick={() => handleStatusChange(action.targetStatus)}
                    className={
                      isBlocked
                        ? "rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed"
                        : action.primary
                        ? "rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:opacity-50"
                        : "rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900 disabled:opacity-50"
                    }
                  >
                    {updating ? "…" : action.label}
                  </button>
                );
              })}
            </div>

            {/* Direct status override */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <label
                htmlFor="status-override"
                className="block text-xs font-medium text-slate-500 mb-2"
              >
                Установить статус напрямую
              </label>
              <select
                id="status-override"
                value={request.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50"
              >
                {Object.entries(STATUS_META).map(([value, m]) => (
                  <option key={value} value={value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>

        {/* AML Card */}
        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-slate-950">AML Проверка</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${amlBadge.style}`}>
              {amlBadge.label}
            </span>
          </div>

          {/* Current AML data */}
          {(request.riskScore !== null || request.amlComment || request.amlReviewedBy) && (
            <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50 px-4">
              {request.riskScore !== null && (
                <div className="flex items-center justify-between py-3">
                  <dt className="text-sm text-slate-600">Риск-балл</dt>
                  <dd className="font-semibold text-slate-950">{request.riskScore}/100</dd>
                </div>
              )}
              {request.amlComment && (
                <div className="flex flex-col gap-1 py-3">
                  <dt className="text-sm text-slate-600">Комментарий</dt>
                  <dd className="text-sm font-medium text-slate-800">{request.amlComment}</dd>
                </div>
              )}
              {request.amlReviewedBy && (
                <div className="flex items-center justify-between py-3">
                  <dt className="text-sm text-slate-600">Проверил</dt>
                  <dd className="text-sm font-medium text-slate-800">
                    {request.amlReviewedBy}
                    {request.amlReviewedAt ? ` · ${formatTs(request.amlReviewedAt)}` : ""}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {/* AML action form */}
          <form onSubmit={handleAmlSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="aml-status" className="block text-xs font-medium text-slate-500 mb-1">
                Результат AML
              </label>
              <select
                id="aml-status"
                value={amlForm.amlStatus}
                onChange={(e) => setAmlForm((f) => ({ ...f, amlStatus: e.target.value }))}
                disabled={amlSaving}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50"
              >
                <option value="PENDING">Ожидает</option>
                <option value="PASSED">Пройдена</option>
                <option value="REVIEW">На проверке</option>
                <option value="REJECTED">Отклонена</option>
              </select>
            </div>

            <div>
              <label htmlFor="risk-score" className="block text-xs font-medium text-slate-500 mb-1">
                Риск-балл (0–100, необязательно)
              </label>
              <input
                id="risk-score"
                type="number"
                min="0"
                max="100"
                placeholder="например, 72"
                value={amlForm.riskScore}
                onChange={(e) => setAmlForm((f) => ({ ...f, riskScore: e.target.value }))}
                disabled={amlSaving}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="aml-comment" className="block text-xs font-medium text-slate-500 mb-1">
                Комментарий (необязательно)
              </label>
              <textarea
                id="aml-comment"
                rows={3}
                maxLength={2000}
                placeholder="Заметки по результатам AML-проверки..."
                value={amlForm.amlComment}
                onChange={(e) => setAmlForm((f) => ({ ...f, amlComment: e.target.value }))}
                disabled={amlSaving}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={amlSaving}
              className="w-full rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:opacity-50 sm:w-auto"
            >
              {amlSaving ? "Сохранение…" : "Сохранить AML"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
