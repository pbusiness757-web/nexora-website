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

type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Активные партнёры", value: "14" },
  { label: "Доступный резерв", value: "420,000 USDT" },
  { label: "Охват стран", value: "5" },
  { label: "Ограниченные партнёры", value: "2" },
];

const STATUS_META: Record<string, { label: string; style: string }> = {
  ACTIVE: { label: "Активен", style: "bg-emerald-50 text-emerald-600" },
  LIMITED: { label: "Ограничен", style: "bg-amber-50 text-amber-600" },
  LOW_RESERVE: { label: "Низкий резерв", style: "bg-rose-50 text-rose-600" },
  PAUSED: { label: "Приостановлен", style: "bg-slate-100 text-slate-500" },
};

function statusMeta(status: string) {
  return (
    STATUS_META[status] ?? { label: status, style: "bg-slate-100 text-slate-500" }
  );
}

const LIQUIDITY_STATUSES = ["В норме", "Ограничен", "Низкий резерв", "Приостановлен"];

const legendStyles: Record<string, string> = {
  "В норме": "bg-emerald-50 text-emerald-600",
  Ограничен: "bg-amber-50 text-amber-600",
  "Низкий резерв": "bg-rose-50 text-rose-600",
  Приостановлен: "bg-slate-100 text-slate-500",
};

const PARTNER_RULES = [
  "Минимум 2 партнёра на страну",
  "Резервный маршрут обязателен для крупных выплат",
  "Ручное одобрение выплат свыше лимита",
];

function formatNumber(value: string) {
  return Number(value).toLocaleString("en-US");
}

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/partners`, { credentials: "include" });
        if (!res.ok) throw new Error("partners");
        const data = await res.json();
        if (active) setPartners(data);
      } catch {
        if (active) setError("Не удалось загрузить партнёров.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Партнёры и ликвидность
          </h1>
          <p className="text-lg text-slate-600">
            Управление партнёрами по выплатам, резервами и ликвидностью в местной валюте.
          </p>
        </div>

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((card) => (
            <div
              key={card.label}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Партнёры</h2>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Загрузка партнёров…</p>
          ) : error ? (
            <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </p>
          ) : partners.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">Партнёров пока нет.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>ID партнёра</th>
                    <th className={thClass}>Название</th>
                    <th className={thClass}>Страна</th>
                    <th className={thClass}>Валюта</th>
                    <th className={thClass}>Доступный резерв</th>
                    <th className={thClass}>Комиссия</th>
                    <th className={thClass}>Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.map((row) => {
                    const meta = statusMeta(row.status);
                    return (
                      <tr key={row.id} className="text-slate-700">
                        <td className={`${tdClass} font-mono text-slate-500`}>
                          {row.id}
                        </td>
                        <td className={`${tdClass} font-semibold text-slate-950`}>
                          {row.name}
                        </td>
                        <td className={tdClass}>{row.country}</td>
                        <td className={tdClass}>{row.currency}</td>
                        <td className={`${tdClass} font-semibold text-slate-950`}>
                          {formatNumber(row.reserve)}
                        </td>
                        <td className={tdClass}>{row.feePercent}%</td>
                        <td className={tdClass}>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.style}`}
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
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">
              Легенда статусов ликвидности
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {LIQUIDITY_STATUSES.map((status) => (
                <span
                  key={status}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    legendStyles[status] ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Правила для партнёров</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {PARTNER_RULES.map((rule) => (
                <li key={rule} className="flex items-center gap-2">
                  <span className="text-blue-900">✓</span>
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
