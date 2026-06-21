"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ── Types ───────────────────────────────────────────────── */
type AmlRow = {
  id: string;
  requestNumber: string;
  cryptoAsset: string;
  cryptoAmount: number | string;
  country: string | null;
  amlStatus: string;
  riskLevel: string;
  riskScore: number | null;
  amlComment: string | null;
  amlReviewedAt: string | null;
  createdAt: string;
  client: { id: string; companyName: string | null } | null;
};

const AML_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Ожидает",   color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  APPROVED:  { label: "Одобрено",  color: "#059669", bg: "rgba(5,150,105,0.1)"   },
  REJECTED:  { label: "Отклонено", color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  REVIEW:    { label: "Проверка",  color: "#2563eb", bg: "rgba(37,99,235,0.08)"  },
};

const RISK_META: Record<string, { label: string; color: string; bg: string }> = {
  LOW:      { label: "Низкий",   color: "#059669", bg: "rgba(5,150,105,0.1)"   },
  MEDIUM:   { label: "Средний",  color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  HIGH:     { label: "Высокий",  color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  CRITICAL: { label: "Критич.",  color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
};

const AML_FILTERS = [
  { value: "",         label: "Все"       },
  { value: "PENDING",  label: "Ожидают"   },
  { value: "REVIEW",   label: "Проверка"  },
  { value: "APPROVED", label: "Одобрено"  },
  { value: "REJECTED", label: "Отклонено" },
];

function fmt(v: number | string) {
  return Number(v).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/* ── Component ───────────────────────────────────────────── */
export default function AmlPage() {
  const [rows, setRows]           = useState<AmlRow[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [amlFilter, setAmlFilter] = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (amlFilter) params.set("amlStatus", amlFilter);

      const res = await fetch(`${API_BASE}/api/requests?${params}`);
      if (!res.ok) throw new Error("requests");
      const data = await res.json();
      setRows(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Не удалось загрузить данные AML.");
    } finally {
      setLoading(false);
    }
  }, [page, amlFilter]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filter changes
  function applyFilter(f: string) {
    setAmlFilter(f);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // KPI counts from current data (approximate — based on full total from last filter)
  const pending  = rows.filter(r => r.amlStatus === "PENDING").length;
  const review   = rows.filter(r => r.amlStatus === "REVIEW").length;
  const rejected = rows.filter(r => r.amlStatus === "REJECTED").length;
  const highRisk = rows.filter(r => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL").length;

  return (
    <main style={{ background: "var(--color-bg-surface)" }} className="py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            AML-мониторинг
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Заявки с AML-статусами и уровнями риска
          </p>
        </div>

        {/* KPI strip */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Ожидают проверки", value: pending,  color: "var(--color-amber)" },
            { label: "На проверке",      value: review,   color: "var(--color-brand)" },
            { label: "Высокий риск",     value: highRisk, color: "var(--color-red)"   },
            { label: "Отклонено",        value: rejected, color: "var(--color-red)"   },
          ].map(k => (
            <div key={k.label} className="nexora-card p-5" style={{ background: "var(--color-bg-base)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>{k.label}</p>
              <p className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-2">
          {AML_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => applyFilter(f.value)}
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
              style={{
                background: amlFilter === f.value ? "var(--color-brand)" : "var(--color-bg-base)",
                color:      amlFilter === f.value ? "#ffffff"            : "var(--color-text-secondary)",
                border:     `1px solid ${amlFilter === f.value ? "var(--color-brand)" : "var(--color-border)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-sm self-center" style={{ color: "var(--color-text-muted)" }}>
            Всего: {total}
          </span>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-5 rounded-2xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-red)" }}>
            {error}
          </p>
        )}

        {/* Table */}
        <div className="nexora-card overflow-hidden" style={{ background: "var(--color-bg-base)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr style={{ background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Заявка", "Клиент", "Актив", "Сумма", "Страна", "AML-статус", "Риск", "Оценка", "Дата"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
                      Загрузка…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
                      Нет заявок по выбранному фильтру.
                    </td>
                  </tr>
                ) : rows.map(row => {
                  const aml  = AML_META[row.amlStatus]  ?? { label: row.amlStatus,  color: "#64748b", bg: "rgba(100,116,139,0.1)" };
                  const risk = RISK_META[row.riskLevel]  ?? { label: row.riskLevel,  color: "#64748b", bg: "rgba(100,116,139,0.1)" };

                  return (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid var(--color-border-soft)" }}
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/requests/${row.id}`}
                          className="font-semibold hover:underline"
                          style={{ color: "var(--color-brand)" }}
                        >
                          {row.requestNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                        {row.client?.companyName ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {row.cryptoAsset}
                      </td>
                      <td className="px-5 py-3.5" style={{ color: "var(--color-text-primary)" }}>
                        {fmt(row.cryptoAmount)}
                      </td>
                      <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                        {row.country ?? "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color: aml.color, background: aml.bg }}>
                          {aml.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color: risk.color, background: risk.bg }}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-sm" style={{ color: row.riskScore != null && row.riskScore >= 70 ? "var(--color-red)" : "var(--color-text-secondary)" }}>
                        {row.riskScore != null ? row.riskScore : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {new Date(row.createdAt).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: "1px solid var(--color-border)" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="nexora-btn-secondary !py-1.5 !px-4 text-xs disabled:opacity-40"
              >
                ← Назад
              </button>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Стр. {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="nexora-btn-secondary !py-1.5 !px-4 text-xs disabled:opacity-40"
              >
                Далее →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
