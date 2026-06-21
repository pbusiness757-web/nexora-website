"use client";

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type FiatRates = Record<string, number>;

type RatesSnapshot = {
  base: string;
  rates: FiatRates;
  source: "live" | "fallback";
  updatedAt: string;
};

const CURRENCIES = [
  { code: "RUB", flag: "🇷🇺", name: "Российский рубль" },
  { code: "KZT", flag: "🇰🇿", name: "Казахстанский тенге" },
  { code: "UZS", flag: "🇺🇿", name: "Узбекский сум" },
  { code: "AZN", flag: "🇦🇿", name: "Азербайджанский манат" },
  { code: "KGS", flag: "🇰🇬", name: "Кыргызский сом" },
];

export default function RatesPage() {
  const [snapshot, setSnapshot]   = useState<RatesSnapshot | null>(null);
  const [edits, setEdits]         = useState<FiatRates>({});
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved]         = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/rates`);
      if (!res.ok) throw new Error("rates");
      const data: RatesSnapshot = await res.json();
      setSnapshot(data);
      setEdits({ ...data.rates });
    } catch {
      setError("Не удалось загрузить курсы.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    setSaveError(null);
    try {
      const body: Record<string, number> = {};
      for (const { code } of CURRENCIES) {
        const v = edits[code];
        if (v !== undefined && v > 0) body[code] = v;
      }
      const res = await fetch(`${API_BASE}/api/rates`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "save failed");
      }
      const data: RatesSnapshot = await res.json();
      setSnapshot(data);
      setEdits({ ...data.rates });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setEdits(snapshot ? { ...snapshot.rates } : {});
    setEditing(false);
    setSaveError(null);
  }

  return (
    <main style={{ background: "var(--color-bg-surface)" }} className="py-16">
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Управление курсами
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Фиатные курсы к USDT · база: {snapshot?.base ?? "USDT"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                disabled={loading || !!error}
                className="nexora-btn-primary !py-2.5 !px-5 text-sm"
              >
                ✏️ Редактировать
              </button>
            ) : (
              <>
                <button onClick={cancel} className="nexora-btn-secondary !py-2.5 !px-5 text-sm">
                  Отмена
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="nexora-btn-primary !py-2.5 !px-5 text-sm"
                >
                  {saving ? "Сохранение…" : "💾 Сохранить"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status bar */}
        {snapshot && !loading && (
          <div
            className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl px-5 py-3 text-sm"
            style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-border)" }}
          >
            <span style={{ color: "var(--color-text-muted)" }}>
              Обновлено: {new Date(snapshot.updatedAt).toLocaleString("ru-RU")}
            </span>
            <span
              className="rounded-full px-3 py-0.5 font-semibold"
              style={{
                color: snapshot.source === "live" ? "var(--color-green)" : "var(--color-text-muted)",
                background: snapshot.source === "live" ? "var(--color-green-dim)" : "var(--color-bg-elevated)",
              }}
            >
              {snapshot.source === "live" ? "● Живые данные" : "● Резервные данные"}
            </span>
            {saved && (
              <span className="font-semibold" style={{ color: "var(--color-green)" }}>
                ✓ Курсы обновлены
              </span>
            )}
          </div>
        )}

        {/* Error / loading */}
        {loading && (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка курсов…</p>
        )}
        {error && (
          <p className="rounded-2xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-red)" }}>
            {error}
          </p>
        )}

        {/* Rates table */}
        {!loading && !error && snapshot && (
          <div className="nexora-card overflow-hidden" style={{ background: "var(--color-bg-base)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                    Валюта
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                    Единиц за 1 USDT
                  </th>
                  {editing && (
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                      Новое значение
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {CURRENCIES.map(({ code, flag, name }) => {
                  const current = snapshot.rates[code] ?? 0;
                  const editVal = edits[code] ?? current;
                  const changed = editing && editVal !== current;

                  return (
                    <tr
                      key={code}
                      style={{
                        borderBottom: "1px solid var(--color-border-soft)",
                        background: changed ? "rgba(37,99,235,0.03)" : "transparent",
                      }}
                    >
                      {/* Currency */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{flag}</span>
                          <div>
                            <div className="font-bold" style={{ color: "var(--color-text-primary)" }}>{code}</div>
                            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Current rate */}
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold" style={{ color: "var(--color-brand)" }}>
                          {current.toLocaleString("ru-RU")}
                        </span>
                      </td>

                      {/* Edit input */}
                      {editing && (
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={editVal}
                            onChange={e => setEdits(prev => ({ ...prev, [code]: Number(e.target.value) }))}
                            className="nexora-input !py-2 !px-3 w-36 text-sm font-semibold"
                            style={{ color: changed ? "var(--color-brand)" : "var(--color-text-primary)" }}
                          />
                          {changed && (
                            <span className="ml-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                              ({current.toLocaleString("ru-RU")} → {editVal.toLocaleString("ru-RU")})
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Save error */}
            {saveError && (
              <div className="px-6 pb-4">
                <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-red)" }}>
                  {saveError}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        <p className="mt-6 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Изменения сохраняются в память сервера до следующего перезапуска. Для постоянных курсов настройте RATES_PROVIDER_URL в .env.
        </p>
      </div>
    </main>
  );
}
