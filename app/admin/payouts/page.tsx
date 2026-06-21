"use client";

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type PayoutRow = {
  id: string;
  payoutNumber: string;
  status: string;
  amount: string;
  currency: string;
  createdAt: string;
  request: {
    requestNumber: string;
    cryptoAsset: string;
    payoutCurrency: string;
    country: string | null;
    client: { email: string } | null;
  } | null;
  partner: { name: string; country: string } | null;
};

type PageResult = { data: PayoutRow[]; total: number; page: number; limit: number };

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PROCESSING: { label: "В обработке",  color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  COMPLETED:  { label: "Завершено",    color: "#03a66d", bg: "rgba(3,166,109,0.12)"  },
  FAILED:     { label: "Ошибка",       color: "#f6465d", bg: "rgba(246,70,93,0.12)"  },
  ON_HOLD:    { label: "Удержание",    color: "#64748b", bg: "rgba(100,116,139,0.1)" },
};

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { label: status, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  );
}

export default function AdminPayoutsPage() {
  const [rows, setRows]       = useState<PayoutRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) qs.set("status", statusFilter);
      const res = await fetch(`${API_BASE}/api/payouts?${qs}`, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const body: PageResult = await res.json();
      setRows(body.data); setTotal(body.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  const cardStyle = {
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "1rem",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
          Выплаты
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Все исходящие банковские выплаты партнёров
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {["", "PROCESSING", "COMPLETED", "FAILED", "ON_HOLD"].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className="rounded-xl px-4 py-2 text-xs font-bold transition-all"
            style={{
              background: statusFilter === s ? "var(--color-brand)" : "var(--color-bg-elevated)",
              color: statusFilter === s ? "#ffffff" : "var(--color-text-secondary)",
              border: "1px solid " + (statusFilter === s ? "var(--color-brand)" : "var(--color-border)"),
            }}
          >
            {s === "" ? "Все" : STATUS_META[s]?.label ?? s}
          </button>
        ))}
        <button onClick={load} className="ml-auto rounded-xl px-4 py-2 text-xs font-bold"
          style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
          ↻ Обновить
        </button>
      </div>

      {error && (
        <div className="rounded-xl p-4 text-sm font-medium"
          style={{ background: "rgba(246,70,93,0.1)", color: "#f6465d", border: "1px solid rgba(246,70,93,0.2)" }}>
          {error}
        </div>
      )}

      {/* Total */}
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Итого: <strong style={{ color: "var(--color-text-primary)" }}>{total}</strong>
      </p>

      {/* Table */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["№ выплаты", "Заявка", "Клиент", "Партнёр", "Сумма", "Страна", "Дата", "Статус"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}>Загрузка...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}>Выплаты не найдены</td></tr>
              ) : rows.map(row => (
                <tr key={row.id}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-brand)" }}>
                    {row.payoutNumber}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {row.request?.requestNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-primary)" }}>
                    {row.request?.client?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {row.partner?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-xs" style={{ color: "var(--color-text-primary)" }}>
                    {parseFloat(row.amount).toLocaleString("ru-RU")} {row.currency}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {row.request?.country ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {new Date(row.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-40"
            style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            ← Назад
          </button>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {page} / {totalPages}
          </span>
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
