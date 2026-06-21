"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiPartner = {
  id: string;
  name: string;
  country: string;
  currency: string;
  reserve: string;
  feePercent: string;
  status: string;
};

type StatusVariant = "green" | "amber" | "red" | "muted";
const STATUS_META: Record<string, { label: string; variant: StatusVariant }> = {
  ACTIVE:      { label: "Активен",       variant: "green" },
  LIMITED:     { label: "Ограничен",     variant: "amber" },
  LOW_RESERVE: { label: "Низкий резерв", variant: "red"   },
  PAUSED:      { label: "Приостановлен", variant: "muted" },
};
const BADGE_STYLE: Record<StatusVariant, { bg: string; color: string }> = {
  green: { bg: "var(--color-green-dim)",   color: "var(--color-green)" },
  amber: { bg: "var(--color-amber-dim)",   color: "var(--color-amber)" },
  red:   { bg: "var(--color-red-dim)",     color: "var(--color-red)"   },
  muted: { bg: "var(--color-bg-elevated)", color: "var(--color-text-muted)" },
};

const PARTNER_RULES = [
  "Минимум 2 партнёра на страну",
  "Резервный маршрут обязателен для крупных выплат",
  "Ручное одобрение выплат свыше лимита",
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/partners`, { credentials: "include" })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { if (active) setPartners(Array.isArray(data) ? data : data.data ?? []); })
      .catch(() => { if (active) setError("Не удалось загрузить партнёров."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="py-12 min-h-screen" style={{ background: "var(--color-bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Партнёры и ликвидность
          </h1>
          <p className="mt-1 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Управление партнёрами по выплатам, резервами и ликвидностью.
          </p>
        </div>

        {/* Partners table */}
        <section className="nexora-card p-6 sm:p-8 mb-6">
          <h2 className="text-base font-bold mb-5" style={{ color: "var(--color-text-primary)" }}>
            Партнёры {partners.length > 0 && (
              <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>({partners.length})</span>
            )}
          </h2>

          {loading ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка партнёров…</p>
          ) : error ? (
            <p className="text-sm" style={{ color: "var(--color-red)" }}>{error}</p>
          ) : partners.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Партнёров пока нет.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Название", "Страна", "Валюта", "Резерв", "Комиссия", "Статус"].map(h => (
                      <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--color-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partners.map(row => {
                    const m = STATUS_META[row.status] ?? { label: row.status, variant: "muted" as StatusVariant };
                    const s = BADGE_STYLE[m.variant];
                    return (
                      <tr key={row.id} style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                        <td className="py-3.5 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                          {row.name}
                        </td>
                        <td className="py-3.5" style={{ color: "var(--color-text-secondary)" }}>{row.country}</td>
                        <td className="py-3.5">
                          <span className="nexora-badge text-xs">{row.currency}</span>
                        </td>
                        <td className="py-3.5 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                          {Number(row.reserve).toLocaleString("ru-RU")}
                        </td>
                        <td className="py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                          {row.feePercent}%
                        </td>
                        <td className="py-3.5">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                style={{ background: s.bg, color: s.color }}>
                            {m.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Legend */}
          <section className="nexora-card p-6">
            <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              Легенда статусов
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.values(STATUS_META).map(m => {
                const s = BADGE_STYLE[m.variant];
                return (
                  <span key={m.label} className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: s.bg, color: s.color }}>
                    {m.label}
                  </span>
                );
              })}
            </div>
          </section>

          {/* Rules */}
          <section className="nexora-card p-6">
            <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              Правила для партнёров
            </h2>
            <ul className="space-y-3">
              {PARTNER_RULES.map(rule => (
                <li key={rule} className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}>
                  <span style={{ color: "var(--color-brand)", fontWeight: 700 }}>✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
