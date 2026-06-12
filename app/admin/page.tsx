"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Stats = {
  totalRequests: number;
  createdRequests: number;
  processingRequests: number;
  completedRequests: number;
  totalCryptoVolume: number | string;
  totalPayoutVolume: number | string;
  activePartners: number;
  totalClients: number;
};

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("en-US");
}

type RequestRow = {
  id: string;
  country: string;
  recipientType: string;
  amount: string;
  status: string;
};

const REQUESTS: RequestRow[] = [
  {
    id: "NX-2026-0042",
    country: "Россия",
    recipientType: "Бизнес",
    amount: "10,000 USDT",
    status: "Ожидание оплаты",
  },
  {
    id: "NX-2026-0041",
    country: "Казахстан",
    recipientType: "Физлицо",
    amount: "2,500 USDT",
    status: "AML-проверка",
  },
  {
    id: "NX-2026-0040",
    country: "Узбекистан",
    recipientType: "Бизнес",
    amount: "18,000 USDT",
    status: "Готово к выплате",
  },
  {
    id: "NX-2026-0039",
    country: "Азербайджан",
    recipientType: "Физлицо",
    amount: "4,200 USDT",
    status: "В обработке",
  },
  {
    id: "NX-2026-0038",
    country: "Кыргызстан",
    recipientType: "Бизнес",
    amount: "9,800 USDT",
    status: "Завершено",
  },
];

const statusStyles: Record<string, string> = {
  "Ожидание оплаты": "bg-slate-100 text-slate-600",
  "AML-проверка": "bg-cyan-50 text-cyan-700",
  "Готово к выплате": "bg-blue-50 text-blue-900",
  "В обработке": "bg-amber-50 text-amber-600",
  Завершено: "bg-emerald-50 text-emerald-600",
};

const LIQUIDITY = ["RUB", "KZT", "UZS", "AZN", "KGS"];

const QUICK_ACTIONS = [
  { label: "Новая заявка", primary: true },
  { label: "AML-проверка", primary: false },
  { label: "Управление курсами", primary: false },
  { label: "Просмотр отчётов", primary: false },
];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/stats`);
        if (!res.ok) throw new Error("stats");
        const data = await res.json();
        if (active) setStats(data);
      } catch {
        if (active) setError("Не удалось загрузить статистику.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const cards = stats
    ? [
        { label: "Всего заявок", value: formatNumber(stats.totalRequests) },
        { label: "Создано", value: formatNumber(stats.createdRequests) },
        { label: "В обработке", value: formatNumber(stats.processingRequests) },
        { label: "Завершено", value: formatNumber(stats.completedRequests) },
        {
          label: "Объём крипто",
          value: `${formatNumber(stats.totalCryptoVolume)} USDT`,
        },
        {
          label: "Объём выплат",
          value: formatNumber(stats.totalPayoutVolume),
        },
        { label: "Активные партнёры", value: formatNumber(stats.activePartners) },
        { label: "Всего клиентов", value: formatNumber(stats.totalClients) },
      ]
    : [];

  return (
    <main className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Операционная панель
          </h1>
          <p className="text-lg text-slate-600">
            Контроль заявок, выплат и активности платформы.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Загрузка статистики…</p>
        ) : error ? (
          <p className="mt-10 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        ) : (
          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <p className="text-sm font-medium text-slate-500">
                  {kpi.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {kpi.value}
                </p>
              </div>
            ))}
          </section>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Последние заявки
              </h2>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">Страна</th>
                      <th className="pb-3 font-semibold">Тип получателя</th>
                      <th className="pb-3 font-semibold">Сумма</th>
                      <th className="pb-3 font-semibold">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {REQUESTS.map((row) => (
                      <tr key={row.id} className="text-slate-700">
                        <td className="py-4 font-semibold text-slate-950">
                          {row.id}
                        </td>
                        <td className="py-4">{row.country}</td>
                        <td className="py-4">{row.recipientType}</td>
                        <td className="py-4">{row.amount}</td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[row.status] ??
                              "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-950">
                  Обзор ликвидности
                </h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  В норме
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {LIQUIDITY.map((currency) => (
                  <li
                    key={currency}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <span className="font-semibold text-slate-950">
                      {currency}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      Норма
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Быстрые действия
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={
                      action.primary
                        ? "rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950"
                        : "rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900"
                    }
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
