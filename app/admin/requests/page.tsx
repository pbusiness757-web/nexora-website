"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ApiRequest = {
  id: string;
  requestNumber: string;
  status: string;
  cryptoAsset: string;
  network: string;
  cryptoAmount: string;
  payoutCurrency: string;
  payoutAmount: string;
  createdAt: string;
  clientId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const STATUS_META: Record<string, { label: string; style: string }> = {
  CREATED: { label: "Создана", style: "bg-slate-100 text-slate-600" },
  WAITING_PAYMENT: { label: "Ожидание оплаты", style: "bg-slate-100 text-slate-600" },
  CRYPTO_RECEIVED: { label: "Крипто получено", style: "bg-blue-50 text-blue-700" },
  AML_REVIEW: { label: "AML-проверка", style: "bg-cyan-50 text-cyan-700" },
  READY_FOR_PAYOUT: { label: "Готово к выплате", style: "bg-indigo-50 text-indigo-700" },
  PROCESSING: { label: "В обработке", style: "bg-amber-50 text-amber-600" },
  COMPLETED: { label: "Завершено", style: "bg-emerald-50 text-emerald-600" },
  ON_HOLD: { label: "На удержании", style: "bg-rose-50 text-rose-600" },
};

function statusMeta(status: string) {
  return (
    STATUS_META[status] ?? { label: status, style: "bg-slate-100 text-slate-500" }
  );
}

const STATUS_OPTIONS = Object.keys(STATUS_META);

const FILTER_STATUS = ["Все статусы", ...Object.values(STATUS_META).map((s) => s.label)];
const FILTER_COUNTRY = [
  "Все страны",
  "Россия",
  "Казахстан",
  "Узбекистан",
  "Азербайджан",
  "Кыргызстан",
];
const FILTER_RECIPIENT = ["Все типы", "Физлицо", "Организация"];

const selectClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/requests`);
        if (!res.ok) throw new Error("request");
        const data = await res.json();
        if (active) setRequests(data);
      } catch {
        if (active) setError("Не удалось загрузить заявки.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleStatusChange(id: string, status: string) {
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("status");
      const updated = await res.json();
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
      );
      setMessage({
        type: "ok",
        text: `Статус изменён на «${statusMeta(updated.status).label}».`,
      });
    } catch {
      setMessage({ type: "err", text: "Не удалось обновить статус." });
    }
  }

  return (
    <main className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Управление заявками
          </h1>
          <p className="text-lg text-slate-600">
            Просмотр, отслеживание и обработка заявок на выплаты крипто-в-банк.
          </p>
        </div>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="search-id"
                className="text-sm font-semibold text-slate-500"
              >
                Поиск по ID заявки
              </label>
              <input
                id="search-id"
                type="text"
                placeholder="напр. NX-2026-0001"
                className={`mt-2 ${selectClass}`}
              />
            </div>

            <div>
              <label
                htmlFor="filter-status"
                className="text-sm font-semibold text-slate-500"
              >
                Статус
              </label>
              <select id="filter-status" className={`mt-2 ${selectClass}`}>
                {FILTER_STATUS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-country"
                className="text-sm font-semibold text-slate-500"
              >
                Страна
              </label>
              <select id="filter-country" className={`mt-2 ${selectClass}`}>
                {FILTER_COUNTRY.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-recipient"
                className="text-sm font-semibold text-slate-500"
              >
                Тип получателя
              </label>
              <select id="filter-recipient" className={`mt-2 ${selectClass}`}>
                {FILTER_RECIPIENT.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Заявки</h2>

          {message && (
            <p
              className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                message.type === "ok"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {message.text}
            </p>
          )}

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Загрузка заявок…</p>
          ) : error ? (
            <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </p>
          ) : requests.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">Заявок пока нет.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">ID заявки</th>
                    <th className="pb-3 font-semibold">Дата</th>
                    <th className="pb-3 font-semibold">Клиент</th>
                    <th className="pb-3 font-semibold">Сумма крипто</th>
                    <th className="pb-3 font-semibold">Сеть</th>
                    <th className="pb-3 font-semibold">Выплата</th>
                    <th className="pb-3 font-semibold">Валюта</th>
                    <th className="pb-3 font-semibold">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((row) => {
                    const meta = statusMeta(row.status);
                    return (
                      <tr key={row.id} className="text-slate-700">
                        <td className="py-4 font-semibold text-slate-950">
                          <Link
                            href={`/admin/requests/${row.id}`}
                            className="text-blue-900 transition hover:underline"
                          >
                            {row.requestNumber}
                          </Link>
                        </td>
                        <td className="py-4">{row.createdAt.slice(0, 10)}</td>
                        <td className="py-4 font-mono text-slate-500">
                          {row.clientId}
                        </td>
                        <td className="py-4 font-semibold text-slate-950">
                          {row.cryptoAmount} {row.cryptoAsset}
                        </td>
                        <td className="py-4">{row.network}</td>
                        <td className="py-4">
                          {row.payoutAmount} {row.payoutCurrency}
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {row.payoutCurrency}
                          </span>
                        </td>
                        <td className="py-4">
                          <select
                            value={row.status}
                            onChange={(e) =>
                              handleStatusChange(row.id, e.target.value)
                            }
                            aria-label="Изменить статус"
                            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-slate-200 transition focus:ring-cyan-400 ${meta.style}`}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {statusMeta(option).label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Легенда статусов</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.values(STATUS_META).map((meta) => (
              <span
                key={meta.label}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.style}`}
              >
                {meta.label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
