"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi, MyRequest, PageResult } from "@/lib/clientApi";

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
  brand: { bg: "var(--color-brand-dim)",   color: "var(--color-brand)" },
  green: { bg: "var(--color-green-dim)",   color: "var(--color-green)" },
  amber: { bg: "var(--color-amber-dim)",   color: "var(--color-amber)" },
  red:   { bg: "var(--color-red-dim)",     color: "var(--color-red)"   },
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function RequestsPage() {
  const [result,  setResult]  = useState<PageResult<MyRequest> | null>(null);
  const [page,    setPage]    = useState(1);
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
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
            Мои заявки
          </h1>
          {result && (
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Всего: {result.total}
            </p>
          )}
        </div>
        <Link href="/cabinet/requests/new" className="nexora-btn-primary flex-shrink-0">
          + Создать заявку
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Загрузка…
        </div>
      ) : !result || result.data.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
             style={{ border: "2px dashed var(--color-border)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Заявок пока нет</p>
          <Link href="/cabinet/requests/new" className="nexora-btn-primary">
            Создать первую заявку
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {result.data.map(req => (
              <Link key={req.id} href={`/cabinet/request/${req.id}`}
                    className="nexora-card block px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm"
                            style={{ color: "var(--color-text-primary)" }}>
                        {req.requestNumber}
                      </span>
                      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        {req.cryptoAmount} {req.cryptoAsset}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {req.network}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                      → {Number(req.payoutAmount).toLocaleString("ru-RU")} {req.payoutCurrency}
                      {" · "}{formatDate(req.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="nexora-btn-secondary px-4 py-2 text-sm disabled:opacity-40">
                ← Назад
              </button>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {page} / {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="nexora-btn-secondary px-4 py-2 text-sm disabled:opacity-40">
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
