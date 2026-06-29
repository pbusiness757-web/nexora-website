"use client";

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "OPERATOR";
  createdAt: string;
};

const ROLE_META: Record<string, { label: string; bg: string; color: string }> = {
  ADMIN:    { label: "Администратор", bg: "var(--color-brand-dim)", color: "var(--color-brand)" },
  OPERATOR: { label: "Оператор",      bg: "var(--color-bg-elevated)", color: "var(--color-text-secondary)" },
};

const CARD_STYLE = {
  background: "var(--color-bg-base)",
  border: "1px solid var(--color-border)",
  borderRadius: "1.5rem",
};

const INPUT_STYLE = {
  width: "100%",
  borderRadius: "0.75rem",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-base)",
  color: "var(--color-text-primary)",
  padding: "0.625rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
};

export default function AdminUsersPage() {
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [toast, setToast]         = useState<{ text: string; ok: boolean } | null>(null);
  const [creating, setCreating]   = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ email: "", name: "", role: "OPERATOR" });

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admins`, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      setUsers(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/admins`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { showToast(body.error ?? "Ошибка создания", false); return; }
      showToast("Пользователь добавлен", true);
      setForm({ email: "", name: "", role: "OPERATOR" });
      setShowForm(false);
      await load();
    } catch { showToast("Сетевая ошибка", false); }
    finally { setCreating(false); }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Удалить пользователя ${email}?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}/api/admins/${id}`, {
        method: "DELETE", credentials: "include",
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); showToast(b.error ?? "Ошибка", false); return; }
      showToast("Пользователь удалён", true);
      await load();
    } catch { showToast("Сетевая ошибка", false); }
    finally { setDeleting(null); }
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "var(--color-bg-surface)" }}>
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl"
             style={{ background: toast.ok ? "var(--color-green)" : "var(--color-red)", color: "#fff" }}>
          {toast.text}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Управление операторами
            </h1>
            <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Реестр операторов и администраторов платформы.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={load}
                    className="rounded-2xl px-4 py-2.5 text-sm font-semibold"
                    style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
              ↻ Обновить
            </button>
            <button onClick={() => setShowForm(s => !s)}
                    className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-white"
                    style={{ background: "var(--color-brand)" }}>
              {showForm ? "Отмена" : "+ Добавить"}
            </button>
          </div>
        </div>

        {/* Create form */}
        {showForm && (
          <section style={{ ...CARD_STYLE, padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
            <h2 className="text-base font-bold mb-5" style={{ color: "var(--color-text-primary)" }}>
              Новый пользователь
            </h2>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Email
                </label>
                <input type="email" required value={form.email}
                       onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                       placeholder="operator@nexora.io" style={INPUT_STYLE} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Имя
                </label>
                <input type="text" required minLength={2} value={form.name}
                       onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                       placeholder="Иван Иванов" style={INPUT_STYLE} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Роль
                </label>
                <select value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                        style={INPUT_STYLE}>
                  <option value="OPERATOR">Оператор</option>
                  <option value="ADMIN">Администратор</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button type="submit" disabled={creating}
                        className="rounded-2xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: "var(--color-brand)" }}>
                  {creating ? "Создание..." : "Создать пользователя"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Users list */}
        {error ? (
          <div className="rounded-2xl px-5 py-4 text-sm font-medium"
               style={{ background: "var(--color-red-dim)", color: "var(--color-red)" }}>{error}</div>
        ) : (
          <section style={{ ...CARD_STYLE, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Имя", "Email", "Роль", "Дата добавления", ""].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider"
                          style={{ color: "var(--color-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm"
                          style={{ color: "var(--color-text-muted)" }}>Загрузка...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm"
                          style={{ color: "var(--color-text-muted)" }}>
                        Нет операторов. Добавьте первого с помощью кнопки выше.
                      </td>
                    </tr>
                  ) : users.map(u => {
                    const rm = ROLE_META[u.role] ?? ROLE_META.OPERATOR;
                    return (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border-soft)" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--color-bg-elevated)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <td className="px-5 py-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                          {u.name}
                        </td>
                        <td className="px-5 py-4 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {u.email}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full px-3 py-1 text-xs font-semibold"
                                style={{ background: rm.bg, color: rm.color }}>
                            {rm.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            disabled={deleting === u.id}
                            onClick={() => handleDelete(u.id, u.email)}
                            className="rounded-xl px-3 py-1.5 text-xs font-semibold disabled:opacity-40 transition"
                            style={{ background: "var(--color-red-dim)", color: "var(--color-red)", border: "1px solid var(--color-red)" }}>
                            {deleting === u.id ? "..." : "Удалить"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="mt-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Реестр операторов используется для учёта персонала. Учётные данные для входа в панель управляются
          через переменные окружения <code>ADMIN_EMAIL</code> и <code>ADMIN_PASSWORD</code> на сервере.
        </p>
      </div>
    </div>
  );
}
