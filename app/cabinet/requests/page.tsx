"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi, MyRequest, PageResult } from "@/lib/clientApi";

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Создана", WAITING_PAYMENT: "Ожидает оплаты",
  CRYPTO_RECEIVED: "Крипта получена", AML_REVIEW: "AML проверка",
  READY_FOR_PAYOUT: "Готово к выплате", PROCESSING: "В обработке",
  COMPLETED: "Завершена", ON_HOLD: "Приостановлена",
};

const STATUS_COLORS: Record<string, string> = {
  CREATED: "bg-gray-700 text-gray-200", WAITING_PAYMENT: "bg-yellow-900 text-yellow-300",
  CRYPTO_RECEIVED: "bg-blue-900 text-blue-300", AML_REVIEW: "bg-orange-900 text-orange-300",
  READY_FOR_PAYOUT: "bg-teal-900 text-teal-300", PROCESSING: "bg-indigo-900 text-indigo-300",
  COMPLETED: "bg-green-900 text-green-300", ON_HOLD: "bg-red-900 text-red-300",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function RequestsPage() {
  const [result, setResult] = useState<PageResult<MyRequest> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    clientApi.getRequests(page, limit)
      .then(setResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = result ? Math.ceil(result.total / limit) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Мои заявки</h1>
          {result && (
            <p className="text-gray-500 text-sm mt-0.5">Всего: {result.total}</p>
          )}
        </div>
        <Link
          href="/cabinet/requests/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          + Создать заявку
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm text-center py-12">Загрузка...</div>
      ) : !result || result.data.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
          <p className="text-gray-500 text-sm mb-4">Заявок пока нет</p>
          <Link
            href="/cabinet/requests/new"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Создать первую заявку
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {result.data.map((req) => (
              <Link
                key={req.id}
                href={`/cabinet/request/${req.id}`}
                className="block bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-mono text-sm">{req.requestNumber}</span>
                      <span className="text-gray-400 text-sm">
                        {req.cryptoAmount} {req.cryptoAsset}
                      </span>
                      <span className="text-gray-500 text-xs">{req.network}</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      → {req.payoutAmount} {req.payoutCurrency} · {formatDate(req.createdAt)}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[req.status] ?? "bg-gray-700 text-gray-200"}`}>
                    {STATUS_LABELS[req.status] ?? req.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                ← Назад
              </button>
              <span className="text-gray-500 text-sm">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
