"use client";

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LogRow = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  admin: { email: string } | null;
};

type PageResult = { data: LogRow[]; total: number; page: number; limit: number };

export default function AdminAuditLogsPage() {
  const [rows, setRows]       = useState<LogRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState("");
  const [inputVal, setInputVal] = useState("");

  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) qs.set("action", search);
      const res = await fetch(`${API_BASE}/api/audit-logs?${qs}`, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const body: PageResult = await res.json();
      setRows(body.data); setTotal(body.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const cardStyle = {
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "1rem",
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen py-10 px-6" style={{ background: "var(--color-bg-surface)" }}>
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
          Журнал аудита
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Все действия операторов и системные события
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { setSearch(inputVal); setPage(1); } }}
          placeholder="Поиск по действию..."
          className="rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            background: "var(--color-bg-elevated)", color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)", minWidth: "260px",
          }}
        />
        <button
          onClick={() => { setSearch(inputVal); setPage(1); }}
          className="rounded-xl px-5 py-2.5 text-sm font-bold"
          style={{ background: "var(--color-brand)", color: "#ffffff" }}
        >
          Найти
        </button>
        <button onClick={load} className="rounded-xl px-4 py-2.5 text-xs font-bold"
          style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
          ↻
        </button>
      </div>

      {error && (
        <div className="rounded-xl p-4 text-sm font-medium"
          style={{ background: "rgba(246,70,93,0.1)", color: "#f6465d", border: "1px solid rgba(246,70,93,0.2)" }}>
          {error}
        </div>
      )}

      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Итого: <strong style={{ color: "var(--color-text-primary)" }}>{total}</strong>
      </p>

      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Время", "Оператор", "Действие", "Сущность", "ID", "Детали"].map(h => (
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
                  style={{ color: "var(--color-text-muted)" }}>Записи не найдены</td></tr>
              ) : rows.map(row => (
                <tr key={row.id}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                    {new Date(row.createdAt).toLocaleString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {row.admin?.email ?? "system"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg px-2 py-0.5 text-xs font-bold font-mono"
                      style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)" }}>
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {row.entityType ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                    {row.entityId ? row.entityId.slice(0, 8) + "…" : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                    {row.details ?? "—"}
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
