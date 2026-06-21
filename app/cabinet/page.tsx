"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi, ClientUser, MyRequest } from "@/lib/clientApi";

const STATUS_LABELS: Record<string, string> = {
  CREATED:          "Создана",
  WAITING_PAYMENT:  "Ожидает оплаты",
  CRYPTO_RECEIVED:  "Крипта получена",
  AML_REVIEW:       "AML проверка",
  READY_FOR_PAYOUT: "Готово к выплате",
  PROCESSING:       "В обработке",
  COMPLETED:        "Завершена",
  ON_HOLD:          "Приостановлена",
};

type BadgeVariant = "brand" | "green" | "amber" | "red" | "muted";
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  CREATED:          "muted",
  WAITING_PAYMENT:  "amber",
  CRYPTO_RECEIVED:  "brand",
  AML_REVIEW:       "amber",
  READY_FOR_PAYOUT: "green",
  PROCESSING:       "brand",
  COMPLETED:        "green",
  ON_HOLD:          "red",
};

const BADGE_STYLE: Record<BadgeVariant, { bg: string; color: string }> = {
  brand: { bg: "var(--color-brand-dim)",  color: "var(--color-brand)" },
  green: { bg: "var(--color-green-dim)",  color: "var(--color-green)" },
  amber: { bg: "var(--color-amber-dim)",  color: "var(--color-amber)" },
  red:   { bg: "var(--color-red-dim)",    color: "var(--color-red)"   },
  muted: { bg: "var(--color-bg-elevated)", color: "var(--color-text-muted)" },
};

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_VARIANT[status] ?? "muted";
  const s = BADGE_STYLE[v];
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ background: s.bg, color: s.color }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function CabinetPage() {
  const [user,    setUser]    = useState<ClientUser | null>(null);
  const [recent,  setRecent]  = useState<MyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([clientApi.me(), clientApi.getRequests(1, 5)])
      .then(([u, r]) => { setUser(u); setRecent(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Загрузка…
      </div>
    );
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
            Добро пожаловать
          </h1>
          {user && (
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>{user.email}</p>
          )}
        </div>
        <Link href="/cabinet/requests/new" className="nexora-btn-primary flex-shrink-0">
          + Создать заявку
        </Link>
      </div>

      {/* Unread notifications */}
      {user && user.unreadCount > 0 && (
        <div className="nexora-card mb-6 p-4 flex items-center justify-between gap-4"
             style={{ border: "1px solid rgba(37,99,235,0.2)", background: "var(--color-brand-dim)" }}>
          <p className="text-sm" style={{ color: "var(--color-brand)" }}>
            У вас <strong>{user.unreadCount}</strong> непрочитанных уведомлений
          </p>
          <button
            onClick={async () => {
              await clientApi.markNotificationsRead().catch(() => {});
              const u = await clientApi.me().catch(() => null);
              if (u) setUser(u);
            }}
            className="text-xs font-semibold underline flex-shrink-0"
            style={{ color: "var(--color-brand)" }}>
            Отметить прочитанными
          </button>
        </div>
      )}

      {/* Recent requests */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
          Последние заявки
        </h2>
        <Link href="/cabinet/requests" className="text-sm font-medium"
              style={{ color: "var(--color-brand)" }}>
          Все заявки →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
             style={{ border: "2px dashed var(--color-border)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Заявок пока нет
          </p>
          <Link href="/cabinet/requests/new" className="nexora-btn-primary">
            Создать первую заявку
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map(req => (
            <Link key={req.id} href={`/cabinet/request/${req.id}`}
                  className="nexora-card flex items-center justify-between gap-4 px-5 py-4 block">
              <div>
                <span className="font-mono font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                  {req.requestNumber}
                </span>
                <span className="ml-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {req.cryptoAmount} {req.cryptoAsset}
                </span>
              </div>
              <StatusBadge status={req.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
