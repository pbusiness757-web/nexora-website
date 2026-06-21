"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

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

type BadgeVariant = "brand" | "green" | "amber" | "red" | "cyan" | "purple" | "muted";
const STATUS_META: Record<string, { label: string; variant: BadgeVariant }> = {
  CREATED:          { label: "Создана",          variant: "muted"   },
  WAITING_PAYMENT:  { label: "Ожидание оплаты",  variant: "amber"   },
  CRYPTO_RECEIVED:  { label: "Крипто получено",  variant: "brand"   },
  AML_REVIEW:       { label: "AML-проверка",     variant: "cyan"    },
  READY_FOR_PAYOUT: { label: "Готово к выплате", variant: "purple"  },
  PROCESSING:       { label: "В обработке",      variant: "amber"   },
  COMPLETED:        { label: "Завершено",         variant: "green"   },
  ON_HOLD:          { label: "На удержании",     variant: "red"     },
};

const BADGE: Record<BadgeVariant, { bg: string; color: string }> = {
  brand:  { bg: "var(--color-brand-dim)",           color: "var(--color-brand)"         },
  green:  { bg: "var(--color-green-dim)",           color: "var(--color-green)"         },
  amber:  { bg: "var(--color-amber-dim)",           color: "var(--color-amber)"         },
  red:    { bg: "var(--color-red-dim)",             color: "var(--color-red)"           },
  cyan:   { bg: "rgba(8,145,178,0.08)",             color: "#0891b2"                    },
  purple: { bg: "rgba(124,58,237,0.08)",            color: "#7c3aed"                    },
  muted:  { bg: "var(--color-bg-elevated)",         color: "var(--color-text-muted)"    },
};

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { label: status, variant: "muted" as BadgeVariant };
  const s = BADGE[m.variant];
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ background: s.bg, color: s.color }}>
      {m.label}
    </span>
  );
}

const STATUS_OPTIONS = Object.keys(STATUS_META);
const ALL_STATUSES  = "Все статусы";
const ALL_COUNTRIES = "Все страны";
const ALL_ASSETS    = "Все активы";

const COUNTRY_CURRENCY: Record<string, string> = {
  Россия: "RUB", Казахстан: "KZT", Узбекистан: "UZS", Азербайджан: "AZN", Кыргызстан: "KGS",
};
const LABEL_TO_STATUS: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map(s => [STATUS_META[s].label, s])
);

const FILTER_STATUS  = [ALL_STATUSES, ...STATUS_OPTIONS.map(s => STATUS_META[s].label)];
const FILTER_COUNTRY = [ALL_COUNTRIES, ...Object.keys(COUNTRY_CURRENCY)];
const FILTER_ASSET   = [ALL_ASSETS, "USDT", "BTC", "ETH", "TON", "TRX", "USDC", "LTC"];

const selectStyle = {
  width: "100%", borderRadius: "0.75rem",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-base)",
  color: "var(--color-text-primary)",
  padding: "0.6rem 0.875rem",
  fontSize: "0.875rem",
  outline: "none",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [message,  setMessage]  = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [query,         setQuery]         = useState("");
  const [statusFilter,  setStatusFilter]  = useState(ALL_STATUSES);
  const [countryFilter, setCountryFilter] = useState(ALL_COUNTRIES);
  const [assetFilter,   setAssetFilter]   = useState(ALL_ASSETS);

  const filtered = requests.filter(r => {
    if (query && !r.requestNumber.toLowerCase().includes(query.toLowerCase())) return false;
    if (statusFilter  !== ALL_STATUSES  && r.status         !== LABEL_TO_STATUS[statusFilter]) return false;
    if (countryFilter !== ALL_COUNTRIES && r.payoutCurrency !== COUNTRY_CURRENCY[countryFilter]) return false;
    if (assetFilter   !== ALL_ASSETS    && r.cryptoAsset    !== assetFilter) return false;
    return true;
  });

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/requests?limit=200`, { credentials: "include" })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { if (active) setRequests(data.data ?? []); })
      .catch(() => { if (active) setError("Не удалось загрузить заявки."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleStatusChange(id: string, status: string) {
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: updated.status } : r));
      setMessage({ type: "ok", text: `Статус изменён на «${STATUS_META[updated.status]?.label ?? updated.status}».` });
    } catch {
      setMessage({ type: "err", text: "Не удалось обновить статус." });
    }
  }

  return (
    <main className="py-12 min-h-screen" style={{ background: "var(--color-bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Управление заявками
          </h1>
          <p className="mt-1 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Просмотр, фильтрация и обработка заявок на выплаты.
          </p>
        </div>

        {/* Filters */}
        <section className="nexora-card p-5 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Поиск по номеру", node: (
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                       placeholder="NX-2026-0001" style={selectStyle} />
              )},
              { label: "Статус", node: (
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                  {FILTER_STATUS.map(o => <option key={o}>{o}</option>)}
                </select>
              )},
              { label: "Страна", node: (
                <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={selectStyle}>
                  {FILTER_COUNTRY.map(o => <option key={o}>{o}</option>)}
                </select>
              )},
              { label: "Криптоактив", node: (
                <select value={assetFilter} onChange={e => setAssetFilter(e.target.value)} style={selectStyle}>
                  {FILTER_ASSET.map(o => <option key={o}>{o}</option>)}
                </select>
              )},
            ].map(({ label, node }) => (
              <div key={label}>
                <label className="block text-xs font-semibold mb-1.5"
                       style={{ color: "var(--color-text-muted)" }}>{label}</label>
                {node}
              </div>
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="nexora-card p-6 sm:p-8">
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
            Заявки {filtered.length > 0 && <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>({filtered.length})</span>}
          </h2>

          {message && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
                 style={{
                   background: message.type === "ok" ? "var(--color-green-dim)" : "var(--color-red-dim)",
                   color:      message.type === "ok" ? "var(--color-green)"     : "var(--color-red)",
                 }}>
              {message.text}
            </div>
          )}

          {loading ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка заявок…</p>
          ) : error ? (
            <p className="text-sm" style={{ color: "var(--color-red)" }}>{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {requests.length === 0 ? "Заявок пока нет." : "Ничего не найдено по фильтрам."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Номер", "Дата", "Клиент", "Сумма", "Сеть", "Выплата", "Валюта", "Статус"].map(h => (
                      <th key={h} className="pb-3 font-semibold text-xs uppercase tracking-wider"
                          style={{ color: "var(--color-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id} style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                      <td className="py-3.5">
                        <Link href={`/admin/requests/${row.id}`}
                              className="font-bold font-mono text-sm hover:underline"
                              style={{ color: "var(--color-brand)" }}>
                          {row.requestNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {row.createdAt.slice(0, 10)}
                      </td>
                      <td className="py-3.5 font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {row.clientId.slice(0, 8)}…
                      </td>
                      <td className="py-3.5 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {row.cryptoAmount} {row.cryptoAsset}
                      </td>
                      <td className="py-3.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {row.network}
                      </td>
                      <td className="py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                        {Number(row.payoutAmount).toLocaleString("ru-RU")} {row.payoutCurrency}
                      </td>
                      <td className="py-3.5">
                        <span className="nexora-badge text-xs">{row.payoutCurrency}</span>
                      </td>
                      <td className="py-3.5">
                        <select value={row.status} onChange={e => handleStatusChange(row.id, e.target.value)}
                                className="text-xs font-bold rounded-full px-2.5 py-1 outline-none cursor-pointer"
                                style={{
                                  background: BADGE[STATUS_META[row.status]?.variant ?? "muted"].bg,
                                  color:      BADGE[STATUS_META[row.status]?.variant ?? "muted"].color,
                                  border:     "none",
                                }}>
                          {STATUS_OPTIONS.map(o => (
                            <option key={o} value={o}>{STATUS_META[o].label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Legend */}
        <section className="nexora-card p-5 mt-6">
          <p className="text-xs font-bold uppercase tracking-wider mb-3"
             style={{ color: "var(--color-text-muted)" }}>Легенда</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(STATUS_META).map(m => (
              <span key={m.label} className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: BADGE[m.variant].bg, color: BADGE[m.variant].color }}>
                {m.label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
