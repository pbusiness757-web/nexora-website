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
  byStatus:  (Bucket & { status: string })[];
};

const STATUS_LABELS: Record<string, string> = {
  CREATED:          "Создана",
  WAITING_PAYMENT:  "Ожидание оплаты",
  CRYPTO_RECEIVED:  "Крипто получено",
  AML_REVIEW:       "AML-проверка",
  READY_FOR_PAYOUT: "Готово к выплате",
  PROCESSING:       "В обработке",
  COMPLETED:        "Завершено",
  ON_HOLD:          "На паузе",
};

function fmt(n: number) {
  return Number(n).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

function Table({ headers, rows }: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto mt-5">
      <table className="w-full text-left text-sm" style={{ minWidth: "600px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {headers.map(h => (
              <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
              {row.map((cell, j) => (
                <td key={j} className="py-3.5 text-sm"
                    style={{
                      color:      j === 0 ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      fontWeight: j === 0 ? 600 : 400,
                    }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminFinancePage() {
  const [data,    setData]    = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/finance/summary`, { credentials: "include" })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(d => { if (active) setData(d); })
      .catch(() => { if (active) setError("Не удалось загрузить финансовую сводку."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="py-12 min-h-screen" style={{ background: "var(--color-bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Финансы
          </h1>
          <p className="mt-1 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Выручка, комиссии партнёров и прибыль по выплатам.
          </p>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка финансов…</p>
        ) : error ? (
          <div className="nexora-card p-4 text-sm" style={{ color: "var(--color-red)" }}>{error}</div>
        ) : data ? (
          <>
            {/* Total crypto volume */}
            <div className="nexora-card p-6 mb-6 inline-block">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                 style={{ color: "var(--color-text-muted)" }}>Объём крипто</p>
              <p className="text-3xl font-black" style={{ color: "var(--color-text-primary)" }}>
                {fmt(data.totalCryptoVolume)} <span className="text-lg font-semibold" style={{ color: "var(--color-text-secondary)" }}>USDT</span>
              </p>
            </div>

            <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
              Фиатные итоги сгруппированы по валюте и не суммируются между валютами.
            </p>

            {/* By currency */}
            <section className="nexora-card p-6 sm:p-8 mb-6">
              <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
                По валюте
              </h2>
              <Table
                headers={["Валюта", "Заявок", "Объём", "Комиссии Nexora", "Комиссии партнёров", "Прибыль"]}
                rows={Object.entries(data.byCurrencyTotals).map(([cur, b]) => [
                  cur, b.count, fmt(b.fiatVolume), fmt(b.nexoraFees), fmt(b.partnerFees), fmt(b.grossProfit),
                ])}
              />
            </section>

            {/* By country */}
            <section className="nexora-card p-6 sm:p-8 mb-6">
              <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
                По стране
              </h2>
              <Table
                headers={["Страна", "Заявок", "Объём", "Прибыль"]}
                rows={data.byCountry.map(r => [r.country, r.count, fmt(r.fiatVolume), fmt(r.grossProfit)])}
              />
            </section>

            {/* By status */}
            <section className="nexora-card p-6 sm:p-8">
              <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
                По статусу
              </h2>
              <Table
                headers={["Статус", "Заявок", "Объём", "Прибыль"]}
                rows={data.byStatus.map(r => [
                  STATUS_LABELS[r.status] ?? r.status, r.count, fmt(r.fiatVolume), fmt(r.grossProfit),
                ])}
              />
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
