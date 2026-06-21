"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ── Types ───────────────────────────────────────────────── */
type Stats = {
  totalRequests: number;
  createdRequests: number;
  activeRequests: number;
  processingRequests: number;
  completedRequests: number;
  totalCryptoVolume: number | string;
  totalPayoutVolume: number | string;
  activePartners: number;
  totalPartners: number;
  totalClients: number;
};

type RequestRow = {
  id: string;
  requestNumber: string;
  country: string | null;
  recipientType: string;
  cryptoAmount: number | string;
  cryptoAsset: string;
  status: string;
  createdAt: string;
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  CREATED:           { label: "Создана",          color: "#475569", bg: "rgba(71,85,105,0.08)"  },
  WAITING_PAYMENT:   { label: "Ожидает оплаты",   color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  CRYPTO_RECEIVED:   { label: "Крипта получена",  color: "#2563eb", bg: "rgba(37,99,235,0.08)"  },
  AML_REVIEW:        { label: "AML проверка",     color: "#0891b2", bg: "rgba(8,145,178,0.08)"  },
  READY_FOR_PAYOUT:  { label: "Готово к выплате", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  PROCESSING:        { label: "В обработке",      color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  COMPLETED:         { label: "Завершена",         color: "#059669", bg: "rgba(5,150,105,0.1)"   },
  ON_HOLD:           { label: "Приостановлена",   color: "#64748b", bg: "rgba(100,116,139,0.1)" },
};

function fmt(v: number | string) {
  return Number(v).toLocaleString("en-US");
}

const LIQUIDITY = ["RUB", "KZT", "UZS", "AZN", "KGS"];

/* ── Component ───────────────────────────────────────────── */
export default function AdminPage() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [statsRes, reqRes] = await Promise.all([
          fetch(`${API_BASE}/api/dashboard/stats`, { credentials: "include" }),
          fetch(`${API_BASE}/api/requests?limit=5&page=1`, { credentials: "include" }),
        ]);
        if (!statsRes.ok) throw new Error("stats");
        const statsData = await statsRes.json();
        const reqData   = reqRes.ok ? await reqRes.json() : { data: [] };
        if (active) {
          setStats(statsData);
          setRequests(reqData.data ?? []);
        }
      } catch {
        if (active) setError("Не удалось загрузить статистику.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const cards = stats
    ? [
        { label: "Всего заявок",       value: fmt(stats.totalRequests),       icon: "📋" },
        { label: "Активные заявки",    value: fmt(stats.activeRequests),       icon: "⚡" },
        { label: "Завершено",          value: fmt(stats.completedRequests),    icon: "✅" },
        { label: "Всего клиентов",     value: fmt(stats.totalClients),         icon: "👥" },
        { label: "Активные партнёры",  value: fmt(stats.activePartners),       icon: "🤝" },
        { label: "Всего партнёров",    value: fmt(stats.totalPartners),        icon: "🏢" },
        { label: "Объём крипто",       value: `${fmt(stats.totalCryptoVolume)} USDT`, icon: "💎" },
        { label: "Объём выплат",       value: fmt(stats.totalPayoutVolume),    icon: "💸" },
      ]
    : [];

  return (
    <main style={{ background: "var(--color-bg-surface)" }} className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "var(--color-text-primary)" }}>
            Операционная панель
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Контроль заявок, выплат и активности платформы.
          </p>
        </div>

        {/* KPI cards */}
        {loading ? (
          <p className="mt-10 text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка статистики…</p>
        ) : error ? (
          <p className="mt-10 rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-red)" }}>
            {error}
          </p>
        ) : (
          <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((kpi) => (
              <div
                key={kpi.label}
                className="nexora-card p-6"
                style={{ background: "var(--color-bg-base)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{kpi.label}</p>
                  <span className="text-xl">{kpi.icon}</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>{kpi.value}</p>
              </div>
            ))}
          </section>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent requests */}
          <section className="lg:col-span-2">
            <div className="nexora-card p-6 sm:p-8" style={{ background: "var(--color-bg-base)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                  Последние заявки
                </h2>
                <Link
                  href="/admin/requests"
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-brand)" }}
                >
                  Все заявки →
                </Link>
              </div>

              {requests.length === 0 && !loading ? (
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Заявок пока нет.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        {["Номер", "Страна", "Тип", "Сумма", "Статус"].map(h => (
                          <th key={h} className="pb-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((row) => {
                        const meta = STATUS_META[row.status] ?? { label: row.status, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
                        return (
                          <tr
                            key={row.id}
                            style={{ borderBottom: "1px solid var(--color-border-soft)" }}
                          >
                            <td className="py-3.5">
                              <Link
                                href={`/admin/requests/${row.id}`}
                                className="font-semibold hover:underline"
                                style={{ color: "var(--color-brand)" }}
                              >
                                {row.requestNumber}
                              </Link>
                            </td>
                            <td className="py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                              {row.country ?? "—"}
                            </td>
                            <td className="py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                              {row.recipientType}
                            </td>
                            <td className="py-3.5 font-medium" style={{ color: "var(--color-text-primary)" }}>
                              {fmt(row.cryptoAmount)} {row.cryptoAsset}
                            </td>
                            <td className="py-3.5">
                              <span
                                className="rounded-full px-3 py-1 text-xs font-semibold"
                                style={{ color: meta.color, background: meta.bg }}
                              >
                                {meta.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Liquidity */}
            <section className="nexora-card p-6 sm:p-8" style={{ background: "var(--color-bg-base)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                  Ликвидность
                </h2>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ color: "var(--color-green)", background: "var(--color-green-dim)" }}
                >
                  ● В норме
                </span>
              </div>
              <ul className="space-y-2">
                {LIQUIDITY.map((cur) => (
                  <li
                    key={cur}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "var(--color-bg-surface)" }}
                  >
                    <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{cur}</span>
                    <span className="text-xs font-medium" style={{ color: "var(--color-green)" }}>● Норма</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Quick actions */}
            <section className="nexora-card p-6 sm:p-8" style={{ background: "var(--color-bg-base)" }}>
              <h2 className="text-lg font-bold mb-5" style={{ color: "var(--color-text-primary)" }}>
                Быстрые действия
              </h2>
              <div className="flex flex-col gap-3">
                <Link href="/admin/requests" className="nexora-btn-primary !py-2.5 text-sm text-center">
                  Заявки
                </Link>
                <Link href="/admin/aml" className="nexora-btn-secondary !py-2.5 text-sm text-center">
                  AML-проверка
                </Link>
                <Link href="/admin/rates" className="nexora-btn-secondary !py-2.5 text-sm text-center">
                  Управление курсами
                </Link>
                <Link href="/admin/reports" className="nexora-btn-secondary !py-2.5 text-sm text-center">
                  Отчёты
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
