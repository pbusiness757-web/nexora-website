"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiPayout = {
  id: string;
  payoutNumber: string;
  status: string;
  amount: string;
  currency: string;
  partnerId: string | null;
};

type ApiPartner = {
  id: string;
  name: string;
  country: string;
  currency: string;
  feePercent: string;
  reserve: string;
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
  country: string | null;
  client: ApiClient | null;
  payout: ApiPayout | null;
  amlStatus: string;
  riskScore: number | null;
  amlComment: string | null;
  amlReviewedAt: string | null;
  amlReviewedBy: string | null;
  walletAddress: string | null;
  recipientDetails: string | null;
};

type HistoryEntry = {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  createdAt: string;
};

type AmlForm = { amlStatus: string; riskScore: string; amlComment: string };

type BadgeStyle = { bg: string; color: string };

const STATUS_META: Record<string, { label: string } & BadgeStyle> = {
  CREATED:          { label: "Создана",          bg: "var(--color-bg-elevated)",   color: "var(--color-text-secondary)" },
  WAITING_PAYMENT:  { label: "Ожидание оплаты",  bg: "var(--color-amber-dim)",     color: "var(--color-amber)"          },
  CRYPTO_RECEIVED:  { label: "Крипто получено",  bg: "var(--color-brand-dim)",     color: "var(--color-brand)"          },
  AML_REVIEW:       { label: "AML-проверка",     bg: "rgba(8,145,178,0.08)",       color: "#0891b2"                     },
  READY_FOR_PAYOUT: { label: "Готово к выплате", bg: "rgba(99,102,241,0.08)",      color: "#6366f1"                     },
  PROCESSING:       { label: "В обработке",      bg: "var(--color-amber-dim)",     color: "var(--color-amber)"          },
  COMPLETED:        { label: "Завершено",         bg: "var(--color-green-dim)",     color: "var(--color-green)"          },
  ON_HOLD:          { label: "На удержании",      bg: "var(--color-red-dim)",       color: "var(--color-red)"            },
};

const PAYOUT_STATUS_META: Record<string, { label: string } & BadgeStyle> = {
  PENDING:    { label: "Ожидает",      bg: "var(--color-bg-elevated)", color: "var(--color-text-secondary)" },
  READY:      { label: "Готово",       bg: "rgba(99,102,241,0.08)",    color: "#6366f1"                     },
  PROCESSING: { label: "В обработке", bg: "var(--color-amber-dim)",   color: "var(--color-amber)"          },
  COMPLETED:  { label: "Выполнено",   bg: "var(--color-green-dim)",   color: "var(--color-green)"          },
  FAILED:     { label: "Ошибка",      bg: "var(--color-red-dim)",     color: "var(--color-red)"            },
  ON_HOLD:    { label: "Удержание",   bg: "var(--color-red-dim)",     color: "var(--color-red)"            },
};

const AML_META: Record<string, { label: string } & BadgeStyle> = {
  PENDING:  { label: "Ожидает",      bg: "var(--color-bg-elevated)", color: "var(--color-text-secondary)" },
  PASSED:   { label: "Пройдена",     bg: "var(--color-green-dim)",   color: "var(--color-green)"          },
  REVIEW:   { label: "На проверке",  bg: "var(--color-amber-dim)",   color: "var(--color-amber)"          },
  REJECTED: { label: "Отклонена",    bg: "var(--color-red-dim)",     color: "var(--color-red)"            },
};

const FALLBACK_BADGE: BadgeStyle & { label: string } = {
  label: "—", bg: "var(--color-bg-elevated)", color: "var(--color-text-muted)",
};

const TIMELINE_ORDER = [
  "CREATED", "WAITING_PAYMENT", "CRYPTO_RECEIVED",
  "AML_REVIEW", "READY_FOR_PAYOUT", "PROCESSING", "COMPLETED",
];

const AML_BLOCKED = new Set(["READY_FOR_PAYOUT", "PROCESSING", "COMPLETED"]);

const STATUS_ACTIONS: { label: string; targetStatus: string; primary?: boolean }[] = [
  { label: "Ожидает оплаты",         targetStatus: "WAITING_PAYMENT",  primary: true },
  { label: "Крипто получено",        targetStatus: "CRYPTO_RECEIVED" },
  { label: "Начать AML-проверку",    targetStatus: "AML_REVIEW",       primary: true },
  { label: "Готово к выплате",       targetStatus: "READY_FOR_PAYOUT" },
  { label: "В обработке",            targetStatus: "PROCESSING" },
  { label: "Завершить заявку",       targetStatus: "COMPLETED",        primary: true },
  { label: "Поставить на удержание", targetStatus: "ON_HOLD" },
];

function smeta(s: string) { return STATUS_META[s] ?? { ...FALLBACK_BADGE, label: s }; }
function pmeta(s: string) { return PAYOUT_STATUS_META[s] ?? { ...FALLBACK_BADGE, label: s }; }
function ameta(s: string) { return AML_META[s] ?? { ...FALLBACK_BADGE, label: s }; }

function Badge({ m }: { m: { label: string; bg: string; color: string } }) {
  return (
    <span className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
}

function fmt(v: string | number) { return Number(v).toLocaleString("ru-RU"); }
function fmtTs(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const CARD_STYLE = {
  background: "var(--color-bg-base)",
  border: "1px solid var(--color-border)",
  borderRadius: "1.5rem",
};
const ROW_STYLE = { borderBottom: "1px solid var(--color-border-soft)" };
const INPUT_STYLE = {
  width: "100%", borderRadius: "0.75rem",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-base)",
  color: "var(--color-text-primary)",
  padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none",
};

function InfoCard({ title, rows }: {
  title: string;
  rows: { label: string; value: string; mono?: boolean }[];
}) {
  return (
    <section style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
      <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>{title}</h2>
      <dl className="mt-6">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
            <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.label}</dt>
            <dd className="text-right font-semibold"
                style={{ color: row.mono ? "var(--color-text-muted)" : "var(--color-text-primary)",
                         fontFamily: row.mono ? "monospace" : undefined }}>
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

  const [request, setRequest]         = useState<ApiRequest | null>(null);
  const [history, setHistory]         = useState<HistoryEntry[]>([]);
  const [partnerData, setPartnerData] = useState<ApiPartner | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [updating, setUpdating]         = useState(false);
  const [amlSaving, setAmlSaving]       = useState(false);
  const [assigning, setAssigning]       = useState(false);
  const [toast, setToast]               = useState<{ text: string; ok: boolean } | null>(null);
  const [amlForm, setAmlForm]           = useState<AmlForm>({ amlStatus: "PENDING", riskScore: "", amlComment: "" });
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [walletAddressInput, setWalletAddressInput] = useState("");

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  async function resolvePartner(partnerId: string): Promise<ApiPartner | null> {
    try {
      const res = await fetch(`${API_BASE}/api/partners?limit=100`, { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      const list: ApiPartner[] = Array.isArray(data) ? data : (data.data ?? []);
      return list.find((p) => p.id === partnerId) ?? null;
    } catch { return null; }
  }

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
      setAmlForm({
        amlStatus: reqData.amlStatus ?? "PENDING",
        riskScore: reqData.riskScore != null ? String(reqData.riskScore) : "",
        amlComment: reqData.amlComment ?? "",
      });
      if (reqData.payout?.partnerId) {
        resolvePartner(reqData.payout.partnerId).then((p) => setPartnerData(p));
      } else {
        setPartnerData(null);
      }
    } catch {
      setError("Не удалось загрузить заявку.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(targetStatus: string, walletAddr?: string) {
    if (!request || updating) return;
    setUpdating(true);
    try {
      const body: Record<string, unknown> = { status: targetStatus };
      if (targetStatus === "WAITING_PAYMENT" && walletAddr && walletAddr.trim()) {
        body.walletAddress = walletAddr.trim();
      }
      const res = await fetch(`${API_BASE}/api/requests/${request.id}/status`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); showToast(b.error ?? "Ошибка", false); return; }
      showToast("Статус → " + smeta(targetStatus).label, true);
      setPendingStatus(null);
      setWalletAddressInput("");
      await load();
    } catch { showToast("Сетевая ошибка", false); }
    finally { setUpdating(false); }
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
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); showToast(b.error ?? "Ошибка AML", false); return; }
      showToast("AML -> " + ameta(amlForm.amlStatus).label, true);
      await load();
    } catch { showToast("Сетевая ошибка", false); }
    finally { setAmlSaving(false); }
  }

  async function handleAssignPartner() {
    if (!request || assigning) return;
    setAssigning(true);
    try {
      const res = await fetch(`${API_BASE}/api/requests/${request.id}/assign-partner`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { showToast(body.error ?? "Не удалось назначить партнёра", false); return; }
      if (body.partner) setPartnerData(body.partner as ApiPartner);
      showToast("Партнёр: " + (body.partner?.name ?? "") + " — выплата #" + (body.payout?.payoutNumber ?? ""), true);
      await load();
    } catch { showToast("Сетевая ошибка", false); }
    finally { setAssigning(false); }
  }

  if (loading) {
    return (
      <div className="px-6 py-16" style={{ background: "var(--color-bg-surface)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка заявки...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="px-6 py-16" style={{ background: "var(--color-bg-surface)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="rounded-2xl px-4 py-3 text-sm font-medium"
             style={{ background: "var(--color-red-dim)", color: "var(--color-red)" }}>
            {error ?? "Заявка не найдена."}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = TIMELINE_ORDER.indexOf(request.status);
  const meta         = smeta(request.status);
  const amlBadge     = ameta(request.amlStatus ?? "PENDING");
  const amlRejected  = request.amlStatus === "REJECTED";
  const canAssign    = request.status === "READY_FOR_PAYOUT" && !request.payout && !amlRejected;

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
    { label: "Сумма",   value: fmt(request.cryptoAmount) + " " + request.cryptoAsset },
    { label: "Страна",  value: request.country ?? "—" },
    { label: "Создана", value: request.createdAt.slice(0, 10) },
  ];

  // Parse recipient details JSON
  let recipientInfo: Record<string, string> | null = null;
  if (request.recipientDetails) {
    try { recipientInfo = JSON.parse(request.recipientDetails); } catch { /* ignore */ }
  }

  const payoutRows = request.payout
    ? [
        { label: "Номер выплаты", value: request.payout.payoutNumber, mono: true },
        { label: "Статус",        value: pmeta(request.payout.status).label },
        { label: "Сумма",         value: fmt(request.payout.amount) + " " + request.payout.currency },
      ]
    : [
        { label: "Сумма",   value: fmt(request.payoutAmount) + " " + request.payoutCurrency },
        { label: "Валюта",  value: request.payoutCurrency },
        { label: "Выплата", value: "Ещё не создана" },
      ];

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "var(--color-bg-surface)" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl"
             style={{ background: toast.ok ? "var(--color-green)" : "var(--color-red)", color: "#fff" }}>
          {toast.text}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ color: "var(--color-text-primary)" }}>
              Заявка {request.requestNumber}
            </h1>
            <Badge m={meta} />
            <Badge m={{ ...amlBadge, label: "AML: " + amlBadge.label }} />
          </div>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Детали заявки на выплату крипто-в-банк.
          </p>
        </div>

        {/* AML REJECTED banner */}
        {amlRejected && (
          <div className="mt-6 rounded-2xl px-5 py-4"
               style={{ background: "var(--color-red-dim)", border: "1px solid var(--color-red)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--color-red)" }}>
              AML отклонена — переход в Готово к выплате / В обработке / Завершено заблокирован.
            </p>
          </div>
        )}

        {/* Status timeline */}
        <section className="mt-8" style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
            Хронология статусов
          </h2>

          {history.length > 0 ? (
            <ol className="mt-8 space-y-4">
              {history.map((entry) => (
                <li key={entry.id} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--color-brand)", border: "2px solid var(--color-brand)" }}>
                    OK
                  </span>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {smeta(entry.fromStatus).label}
                      <span className="mx-2" style={{ color: "var(--color-text-muted)" }}>→</span>
                      {smeta(entry.toStatus).label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {fmtTs(entry.createdAt)}
                      {entry.changedBy && entry.changedBy !== "unknown" ? " · " + entry.changedBy : ""}
                    </p>
                  </div>
                </li>
              ))}
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: "rgba(8,145,178,0.12)", color: "#0891b2", border: "2px solid #0891b2" }}>
                  NOW
                </span>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    Текущий: {smeta(request.status).label}
                  </p>
                </div>
              </li>
            </ol>
          ) : (
            <ol className="mt-8 space-y-6">
              {TIMELINE_ORDER.map((step, index) => {
                const state = currentIndex === -1 ? "pending"
                  : index < currentIndex ? "done"
                  : index === currentIndex ? "current"
                  : "pending";
                const isLast = index === TIMELINE_ORDER.length - 1;
                const markerStyle =
                  state === "done"    ? { background: "var(--color-brand)", border: "2px solid var(--color-brand)", color: "#fff" }
                  : state === "current" ? { background: "rgba(8,145,178,0.12)", border: "2px solid #0891b2", color: "#0891b2" }
                  : { background: "var(--color-bg-base)", border: "2px solid var(--color-border)", color: "var(--color-text-muted)" };
                return (
                  <li key={step} className="relative flex gap-4">
                    {!isLast && (
                      <span className="absolute left-5 top-10 h-[calc(100%-0.5rem)] w-px"
                            style={{ background: state === "done" ? "var(--color-brand)" : "var(--color-border)" }}
                            aria-hidden="true" />
                    )}
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                          style={markerStyle}>
                      {state === "done" ? "✓" : index + 1}
                    </span>
                    <div className="flex flex-1 items-center pt-2">
                      <p className="font-semibold"
                         style={{ color: state === "pending" ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>
                        {smeta(step).label}
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

          {/* Operator actions */}
          <section style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
              Действия оператора
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Текущий статус:{" "}
              <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{meta.label}</span>
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STATUS_ACTIONS.filter((a) => a.targetStatus !== request.status).map((action) => {
                const isBlocked = amlRejected && AML_BLOCKED.has(action.targetStatus);
                const isWaiting = action.targetStatus === "WAITING_PAYMENT";
                return (
                  <button
                    key={action.targetStatus}
                    type="button"
                    disabled={updating || isBlocked}
                    title={isBlocked ? "Заблокировано: AML отклонена" : undefined}
                    onClick={() => {
                      if (isWaiting) {
                        setPendingStatus(pendingStatus === "WAITING_PAYMENT" ? null : "WAITING_PAYMENT");
                      } else {
                        handleStatusChange(action.targetStatus);
                      }
                    }}
                    className="rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:opacity-50"
                    style={
                      isBlocked
                        ? { background: "var(--color-bg-elevated)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", cursor: "not-allowed" }
                        : pendingStatus === "WAITING_PAYMENT" && isWaiting
                        ? { background: "var(--color-amber-dim)", color: "var(--color-amber)", border: "1px solid var(--color-amber)" }
                        : action.primary
                        ? { background: "var(--color-brand)", color: "#fff", border: "none" }
                        : { background: "var(--color-bg-base)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }
                    }
                  >
                    {updating ? "..." : action.label}
                  </button>
                );
              })}
            </div>

            {/* Wallet address input — shown when moving to WAITING_PAYMENT */}
            {pendingStatus === "WAITING_PAYMENT" && (
              <div className="mt-4 rounded-2xl p-4" style={{ background: "var(--color-amber-dim)", border: "1px solid var(--color-amber)" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-amber)" }}>
                  Укажите адрес крипто-кошелька для отправки платежа клиентом
                </p>
                <input
                  type="text"
                  placeholder={`Адрес ${request.cryptoAsset} (${request.network})`}
                  value={walletAddressInput}
                  onChange={(e) => setWalletAddressInput(e.target.value)}
                  style={{ ...INPUT_STYLE, fontFamily: "monospace", fontSize: "0.8rem" }}
                  autoFocus
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={updating || !walletAddressInput.trim()}
                    onClick={() => handleStatusChange("WAITING_PAYMENT", walletAddressInput)}
                    className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
                    style={{ background: "var(--color-amber)" }}
                  >
                    {updating ? "..." : "Подтвердить"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPendingStatus(null); setWalletAddressInput(""); }}
                    className="rounded-2xl px-5 py-2.5 text-sm font-semibold transition"
                    style={{ background: "var(--color-bg-base)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--color-border-soft)" }}>
              <label htmlFor="status-override" className="block text-xs font-medium mb-2"
                     style={{ color: "var(--color-text-muted)" }}>
                Установить статус напрямую
              </label>
              <select
                id="status-override"
                value={request.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={INPUT_STYLE}
              >
                {Object.entries(STATUS_META).map(([value, m]) => (
                  <option key={value} value={value}>{m.label}</option>
                ))}
              </select>
            </div>
          </section>
        </div>

        {/* Partner Assignment */}
        <section className="mt-6" style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                Партнёр выплаты
              </h2>
              {request.payout && <Badge m={pmeta(request.payout.status)} />}
            </div>

            {canAssign && (
              <button
                type="button"
                disabled={assigning}
                onClick={handleAssignPartner}
                className="rounded-2xl px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
                style={{ background: "var(--color-brand)" }}
              >
                {assigning ? "Поиск партнёра..." : "Назначить партнёра"}
              </button>
            )}

            {request.status === "READY_FOR_PAYOUT" && !request.payout && amlRejected && (
              <span className="rounded-2xl px-4 py-2.5 text-sm font-medium"
                    style={{ background: "var(--color-red-dim)", color: "var(--color-red)", border: "1px solid var(--color-red)" }}>
                Недоступно — AML отклонена
              </span>
            )}
          </div>

          {request.payout ? (
            <dl className="mt-6 rounded-xl px-4"
                style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
              {partnerData && (
                <div className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Партнёр</dt>
                  <dd className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{partnerData.name}</dd>
                </div>
              )}
              {partnerData && (
                <div className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Страна / валюта</dt>
                  <dd className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {partnerData.country} / {partnerData.currency}
                  </dd>
                </div>
              )}
              {partnerData && (
                <div className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Комиссия партнёра</dt>
                  <dd className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {Number(partnerData.feePercent).toFixed(2)}%
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
                <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Номер выплаты</dt>
                <dd className="font-semibold font-mono text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {request.payout.payoutNumber}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
                <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Сумма выплаты</dt>
                <dd className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {fmt(request.payout.amount)} {request.payout.currency}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Статус выплаты</dt>
                <dd><Badge m={pmeta(request.payout.status)} /></dd>
              </div>
              {!partnerData && request.payout.partnerId && (
                <div className="flex items-center justify-between gap-4 py-4" style={ROW_STYLE}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>ID партнёра</dt>
                  <dd className="font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {request.payout.partnerId}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="mt-6 rounded-xl px-5 py-5"
                 style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {request.status === "READY_FOR_PAYOUT"
                  ? "Заявка готова к выплате. Нажмите кнопку выше, чтобы автоматически выбрать лучшего партнёра."
                  : "Выплата будет создана после перехода заявки в статус Готово к выплате."}
              </p>
            </div>
          )}
        </section>

        {/* Wallet Address + Recipient Details */}
        {(request.walletAddress || recipientInfo) && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Wallet address */}
            {request.walletAddress && (
              <section style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                  Адрес кошелька (отправлено клиенту)
                </h2>
                <div className="mt-4 rounded-xl px-4 py-3"
                     style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                    {request.cryptoAsset} · {request.network}
                  </p>
                  <p className="break-all font-mono text-sm font-semibold"
                     style={{ color: "var(--color-text-primary)" }}>
                    {request.walletAddress}
                  </p>
                </div>
              </section>
            )}

            {/* Recipient details */}
            {recipientInfo && (
              <section style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                  Реквизиты клиента
                </h2>
                <dl className="mt-4">
                  {recipientInfo.cardNumber && (
                    <div className="flex items-center justify-between gap-4 py-3" style={ROW_STYLE}>
                      <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Номер карты</dt>
                      <dd className="font-mono font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {recipientInfo.cardNumber}
                      </dd>
                    </div>
                  )}
                  {recipientInfo.bankName && (
                    <div className="flex items-center justify-between gap-4 py-3" style={ROW_STYLE}>
                      <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Банк</dt>
                      <dd className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {recipientInfo.bankName}
                      </dd>
                    </div>
                  )}
                  {recipientInfo.recipientName && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Получатель</dt>
                      <dd className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {recipientInfo.recipientName}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}
          </div>
        )}

        {/* AML Card */}
        <section className="mt-6" style={{ ...CARD_STYLE, padding: "1.5rem 2rem" }}>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>AML Проверка</h2>
            <Badge m={amlBadge} />
          </div>

          {(request.riskScore !== null || request.amlComment || request.amlReviewedBy) && (
            <dl className="mt-4 rounded-xl px-4"
                style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
              {request.riskScore !== null && (
                <div className="flex items-center justify-between py-3" style={ROW_STYLE}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Риск-балл</dt>
                  <dd className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{request.riskScore}/100</dd>
                </div>
              )}
              {request.amlComment && (
                <div className="flex flex-col gap-1 py-3" style={ROW_STYLE}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Комментарий</dt>
                  <dd className="text-sm" style={{ color: "var(--color-text-primary)" }}>{request.amlComment}</dd>
                </div>
              )}
              {request.amlReviewedBy && (
                <div className="flex items-center justify-between py-3">
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Проверил</dt>
                  <dd className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                    {request.amlReviewedBy}
                    {request.amlReviewedAt ? " · " + fmtTs(request.amlReviewedAt) : ""}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <form onSubmit={handleAmlSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="aml-status" className="block text-xs font-medium mb-1"
                     style={{ color: "var(--color-text-muted)" }}>Результат AML</label>
              <select id="aml-status" value={amlForm.amlStatus} disabled={amlSaving}
                      onChange={(e) => setAmlForm((f) => ({ ...f, amlStatus: e.target.value }))}
                      style={INPUT_STYLE}>
                <option value="PENDING">Ожидает</option>
                <option value="PASSED">Пройдена</option>
                <option value="REVIEW">На проверке</option>
                <option value="REJECTED">Отклонена</option>
              </select>
            </div>

            <div>
              <label htmlFor="risk-score" className="block text-xs font-medium mb-1"
                     style={{ color: "var(--color-text-muted)" }}>Риск-балл (0–100, необязательно)</label>
              <input id="risk-score" type="number" min="0" max="100"
                     placeholder="например, 72" value={amlForm.riskScore} disabled={amlSaving}
                     onChange={(e) => setAmlForm((f) => ({ ...f, riskScore: e.target.value }))}
                     style={INPUT_STYLE} />
            </div>

            <div>
              <label htmlFor="aml-comment" className="block text-xs font-medium mb-1"
                     style={{ color: "var(--color-text-muted)" }}>Комментарий (необязательно)</label>
              <textarea id="aml-comment" rows={3} maxLength={2000}
                        placeholder="Заметки по результатам AML-проверки..."
                        value={amlForm.amlComment} disabled={amlSaving}
                        onChange={(e) => setAmlForm((f) => ({ ...f, amlComment: e.target.value }))}
                        style={{ ...INPUT_STYLE, resize: "none" }} />
            </div>

            <button type="submit" disabled={amlSaving}
                    className="rounded-2xl px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50 sm:w-auto w-full"
                    style={{ background: "var(--color-brand)" }}>
              {amlSaving ? "Сохранение..." : "Сохранить AML"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
