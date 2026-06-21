"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";


type Stats = {
  totalRequests: number;
  completedRequests: number;
  activeRequests: number;
  processingRequests: number;
  totalCryptoVolume: number;
  totalPayoutVolume: number;
  activePartners: number;
  totalPartners: number;
  totalClients: number;
};

const COUNTRIES = [
  { name: "Россия",      currency: "RUB", flag: "🇷🇺" },
  { name: "Казахстан",   currency: "KZT", flag: "🇰🇿" },
  { name: "Узбекистан",  currency: "UZS", flag: "🇺🇿" },
  { name: "Азербайджан", currency: "AZN", flag: "🇦🇿" },
  { name: "Кыргызстан",  currency: "KGS", flag: "🇰🇬" },
];

const METHODS = [
  { label: "Корпоративные счета", percent: 58 },
  { label: "Банковские карты",    percent: 27 },
  { label: "Личные счета",        percent: 15 },
];

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: decimals });
}

export default function AdminReportsPage() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard/stats`, {
      credentials: "include",
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setStats)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const kpis = stats
    ? [
        { label: "Всего заявок",          value: fmt(stats.totalRequests) },
        { label: "Завершено",             value: fmt(stats.completedRequests) },
        { label: "Активных",              value: fmt(stats.activeRequests) },
        { label: "Объём (крипта, USDT)",  value: fmt(Number(stats.totalCryptoVolume), 2) },
        { label: "Объём (выплаты)",       value: fmt(Number(stats.totalPayoutVolume), 0) },
        { label: "Партнёров (активных)",  value: `${fmt(stats.activePartners)} / ${fmt(stats.totalPartners)}` },
        { label: "Клиентов",              value: fmt(stats.totalClients) },
        { label: "В обработке",           value: fmt(stats.processingRequests) },
      ]
    : [];

  return (
    <main style={{ background: "var(--color-bg-surface)" }} className="py-12 min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Отчёты и аналитика
          </h1>
          <p className="mt-1 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Сводка по объёму, заявкам, партнёрам и клиентам платформы.
          </p>
        </div>

        {/* KPI Strip */}
        {loading ? (
          <div className="nexora-card p-8 text-center mb-6" style={{ color: "var(--color-text-muted)" }}>
            Загрузка статистики…
          </div>
        ) : error ? (
          <div className="nexora-card p-6 mb-6" style={{ color: "var(--color-red)", border: "1px solid var(--color-red-dim)" }}>
            Ошибка загрузки: {error}
          </div>
        ) : (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4 mb-6">
            {kpis.map(card => (
              <div key={card.label} className="nexora-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                   style={{ color: "var(--color-text-muted)" }}>
                  {card.label}
                </p>
                <p className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
                  {card.value}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Country table */}
        <section className="nexora-card p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
            Страны выплат
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-sm text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["Страна", "Валюта", "Статус"].map(h => (
                    <th key={h} className="pb-3 font-semibold" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map(row => (
                  <tr key={row.name} style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                    <td className="py-4 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {row.flag} {row.name}
                    </td>
                    <td className="py-4">
                      <span className="nexora-badge text-xs">{row.currency}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: "var(--color-green-dim)", color: "var(--color-green)" }}>
                        Активна
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Methods + Segments */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="nexora-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
              Способы выплат
            </h2>
            <div className="space-y-5">
              {METHODS.map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: "var(--color-text-secondary)" }}>{m.label}</span>
                    <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>{m.percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden"
                       style={{ background: "var(--color-bg-elevated)" }}>
                    <div className="h-full rounded-full"
                         style={{ width: `${m.percent}%`, background: "var(--color-brand)" }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="nexora-card p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
              Платформа
            </h2>
            {stats ? (
              <dl className="space-y-4">
                {[
                  { label: "Клиентов зарегистрировано", value: fmt(stats.totalClients) },
                  { label: "Партнёров всего",           value: fmt(stats.totalPartners) },
                  { label: "Партнёров активных",        value: fmt(stats.activePartners) },
                  { label: "Заявок завершено",          value: fmt(stats.completedRequests) },
                  { label: "Заявок в работе",           value: fmt(stats.activeRequests) },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2"
                       style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                    <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.label}</dt>
                    <dd className="font-bold" style={{ color: "var(--color-text-primary)" }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка…</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
