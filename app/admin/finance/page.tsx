"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type Bucket = {
  count: number;
  fiatVolume: number;
  nexoraFees: number;
  partnerFees: number;
  grossProfit: number;
};

type Summary = {
  totalCryptoVolume: number;
  byCurrencyTotals: Record<string, Bucket>;
  byCountry: (Bucket & { country: string })[];
  byStatus: (Bucket & { status: string })[];
};

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Создана",
  WAITING_PAYMENT: "Ожидание оплаты",
  CRYPTO_RECEIVED: "Крипто получено",
  AML_REVIEW: "AML-проверка",
  READY_FOR_PAYOUT: "Готово к выплате",
  PROCESSING: "В обработке",
  COMPLETED: "Завершено",
  ON_HOLD: "На паузе",
};

function fmt(n: number) {
  return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminFinancePage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/finance/summary`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("finance");
        return res.json();
      })
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setError("Не удалось загрузить финансовую сводку.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Финансы
          </h1>
          <p className="text-lg text-slate-600">
            Выручка, комиссии партнёров и прибыль по выплатам крипто-в-банк.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Загрузка финансов…</p>
        ) : error ? (
          <p className="mt-10 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        ) : data ? (
          <>
            <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
                <p className="text-sm font-medium text-slate-500">
                  Объём крипто
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-950">
                  {fmt(data.totalCryptoVolume)} USDT
                </p>
              </div>
            </section>

            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Фиатные итоги сгруппированы по валюте и не суммируются между
              валютами.
            </p>

            <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">По валюте</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className={thClass}>Валюта</th>
                      <th className={thClass}>Заявок</th>
                      <th className={thClass}>Объём</th>
                      <th className={thClass}>Комиссии Nexora</th>
                      <th className={thClass}>Комиссии партнёров</th>
                      <th className={thClass}>Прибыль</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(data.byCurrencyTotals).map(
                      ([currency, b]) => (
                        <tr key={currency} className="text-slate-700">
                          <td
                            className={`${tdClass} font-semibold text-slate-950`}
                          >
                            {currency}
                          </td>
                          <td className={tdClass}>{b.count}</td>
                          <td className={tdClass}>{fmt(b.fiatVolume)}</td>
                          <td className={tdClass}>{fmt(b.nexoraFees)}</td>
                          <td className={tdClass}>{fmt(b.partnerFees)}</td>
                          <td className={`${tdClass} font-semibold text-blue-900`}>
                            {fmt(b.grossProfit)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">По стране</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className={thClass}>Страна</th>
                      <th className={thClass}>Заявок</th>
                      <th className={thClass}>Объём</th>
                      <th className={thClass}>Прибыль</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.byCountry.map((row) => (
                      <tr key={row.country} className="text-slate-700">
                        <td className={`${tdClass} font-semibold text-slate-950`}>
                          {row.country}
                        </td>
                        <td className={tdClass}>{row.count}</td>
                        <td className={tdClass}>{fmt(row.fiatVolume)}</td>
                        <td className={`${tdClass} font-semibold text-blue-900`}>
                          {fmt(row.grossProfit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">По статусу</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className={thClass}>Статус</th>
                      <th className={thClass}>Заявок</th>
                      <th className={thClass}>Объём</th>
                      <th className={thClass}>Прибыль</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.byStatus.map((row) => (
                      <tr key={row.status} className="text-slate-700">
                        <td className={`${tdClass} font-semibold text-slate-950`}>
                          {STATUS_LABELS[row.status] ?? row.status}
                        </td>
                        <td className={tdClass}>{row.count}</td>
                        <td className={tdClass}>{fmt(row.fiatVolume)}</td>
                        <td className={`${tdClass} font-semibold text-blue-900`}>
                          {fmt(row.grossProfit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
