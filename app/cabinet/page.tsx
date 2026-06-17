"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi, ClientUser, MyRequest } from "@/lib/clientApi";

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

export default function CabinetPage() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [recent, setRecent] = useState<MyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([clientApi.me(), clientApi.getRequests(1, 5)])
      .then(([u, r]) => { setUser(u); setRecent(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-sm py-12 text-center">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Добро пожаловать</h1>
          {user && <p className="text-gray-400 text-sm">{user.email}</p>}
        </div>
        <Link
          href="/cabinet/requests/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          + Создать заявку
        </Link>
      </div>

      {user && user.unreadCount > 0 && (
        <div className="mb-6 bg-indigo-900/40 border border-indigo-700 rounded-lg p-4 flex items-center justify-between">
          <div className="text-sm text-indigo-300">
            У вас <strong>{user.unreadCount}</strong> непрочитанных уведомлений
          </div>
          <button
            onClick={async () => {
              await clientApi.markNotificationsRead().catch(() => {});
              const u = await clientApi.me().catch(() => null);
              if (u) setUser(u);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-200 underline"
          >
            Отметить прочитанными
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">Последние заявки</h2>
        <Link href="/cabinet/requests" className="text-sm text-indigo-400 hover:text-indigo-300">
          Все заявки →
        </Link>
      </div>

      {recent.length === 0 ? (
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
        <div className="space-y-3">
          {recent.map((req) => (
            <Link
              key={req.id}
              href={`/cabinet/request/${req.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-mono text-sm">{req.requestNumber}</span>
                  <span className="ml-3 text-gray-400 text-sm">
                    {req.cryptoAmount} {req.cryptoAsset}
                  </span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[req.status] ?? "bg-gray-700 text-gray-200"}`}>
                  {STATUS_LABELS[req.status] ?? req.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
