"use client";

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ClientRow = {
  id: string;
  email: string;
  companyName: string | null;
  country: string;
  riskLevel: string;
  createdAt: string;
  _count: { requests: number };
};

type PageResult = { data: ClientRow[]; total: number; page: number; limit: number };

const RISK_META: Record<string, { label: string; color: string; bg: string }> = {
  LOW:      { label: "Низкий",     color: "#03a66d", bg: "rgba(3,166,109,0.12)"  },
  MEDIUM:   { label: "Средний",    color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  HIGH:     { label: "Высокий",    color: "#f6465d", bg: "rgba(246,70,93,0.12)"  },
  CRITICAL: { label: "Критичный",  color: "#f6465d", bg: "rgba(246,70,93,0.2)"   },
};

export default function AdminClientsPage() {
  const [rows, setRows]       = useState<ClientRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      const res = await fetch(`${API_BASE}/api/clients?${qs}`, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const body: PageResult = await res.json();
      setRows(body.data); setTotal(body.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);
  const cardStyle = { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "1rem" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>Клиенты</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Все зарегистрированные клиенты платформы
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="rounded-xl px-4 py-2 text-xs font-bold"
            style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            ↻ Обновить
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Всего клиентов", value: total },
          { label: "С заявками", value: rows.filter(r => r._count.requests > 0).length },
          { label: "Высокий риск", value: rows.filter(r => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL").length },
          { label: "Загружено", value: rows.length },
        ].map(k => (
          <div key={k.label} style={{ ...cardStyle, padding: "1rem" }}>
            <div className="text-2xl font-black" style={{ color: "var(--color-brand)" }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl p-4 text-sm font-medium"
          style={{ background: "rgba(246,70,93,0.1)", color: "#f6465d", border: "1px solid rgba(246,70,93,0.2)" }}>
          {error}
        </div>
      )}

      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Email", "Компания", "Страна", "Заявки", "Риск", "Дата регистрации"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}>Загрузка...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}>Клиенты не найдены</td></tr>
              ) : rows.map(row => {
                const risk = RISK_META[row.riskLevel] ?? { label: row.riskLevel, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
                return (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--color-border)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-primary)" }}>
                      {row.email}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {row.companyName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {row.country}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: "var(--color-brand)" }}>
                      {row._count.requests}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{ color: risk.color, background: risk.bg }}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(row.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-40"
            style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            ← Назад
          </button>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-40"
            style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}
