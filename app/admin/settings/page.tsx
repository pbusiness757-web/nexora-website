"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";


type RatesSnapshot = {
  base: string;
  rates: Record<string, number>;
  source: "live" | "fallback";
  updatedAt: string;
};

const COUNTRIES = [
  { name: "Россия",      currency: "RUB", flag: "🇷🇺" },
  { name: "Казахстан",   currency: "KZT", flag: "🇰🇿" },
  { name: "Узбекистан",  currency: "UZS", flag: "🇺🇿" },
  { name: "Азербайджан", currency: "AZN", flag: "🇦🇿" },
  { name: "Кыргызстан",  currency: "KGS", flag: "🇰🇬" },
];

const CRYPTO_ASSETS = ["USDT", "BTC", "ETH", "TON", "TRX", "USDC", "LTC"];

const MARGIN_SETTINGS = [
  { label: "Частные клиенты",           value: "2% – 5%" },
  { label: "Бизнес-клиенты",           value: "1% – 3%" },
  { label: "VIP-клиенты",              value: "Индивидуально" },
  { label: "Комиссия за срочную выплату", value: "Опционально" },
];

const REQUEST_LIMITS = [
  { label: "Минимальная заявка",      value: "100 USDT" },
  { label: "Максимум для физлиц",     value: "10 000 USDT" },
  { label: "Максимум для бизнеса",    value: "100 000 USDT" },
  { label: "Ручная проверка свыше",   value: "50 000 USDT" },
];

type OpRow = { label: string; value: string; state: "on" | "off" | "neutral" };
const OPERATIONAL: OpRow[] = [
  { label: "Интервал обновления курсов", value: "10 мин",   state: "neutral" },
  { label: "Срок действия заявки",       value: "15 минут", state: "neutral" },
  { label: "AML-проверка",               value: "Включена", state: "on" },
  { label: "Режим обслуживания",         value: "Выключен", state: "off" },
];

const STATE_STYLE: Record<OpRow["state"], { bg: string; color: string }> = {
  on:      { bg: "var(--color-green-dim)",  color: "var(--color-green)" },
  off:     { bg: "var(--color-bg-elevated)", color: "var(--color-text-muted)" },
  neutral: { bg: "var(--color-blue-dim)",   color: "var(--color-brand)" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="nexora-card p-6 sm:p-8">
      <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function KVRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3.5"
         style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
      <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{label}</dt>
      <dd className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{value}</dd>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [rates, setRates] = useState<RatesSnapshot | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/rates`, {
      credentials: "include",
    })
      .then(r => r.ok ? r.json() : null)
      .then(setRates)
      .catch(() => {})
      .finally(() => setRatesLoading(false));
  }, []);

  return (
    <div className="py-12 min-h-screen" style={{ background: "var(--color-bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            Настройки платформы
          </h1>
          <p className="mt-1 text-base" style={{ color: "var(--color-text-secondary)" }}>
            Страны выплат, валюты, криптоактивы, маржа и операционные лимиты.
          </p>
        </div>

        {/* Live rates */}
        <Section title="Текущие курсы (USDT → фиат)">
          {ratesLoading ? (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка…</p>
          ) : rates ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-4">
                {Object.entries(rates.rates).map(([cur, rate]) => (
                  <div key={cur} className="rounded-xl p-4 text-center"
                       style={{ background: "var(--color-brand-dim)", border: "1px solid rgba(37,99,235,0.15)" }}>
                    <p className="text-xs font-bold mb-1" style={{ color: "var(--color-brand)" }}>{cur}</p>
                    <p className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                      {Number(rate).toLocaleString("ru-RU")}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Источник: <strong>{rates.source}</strong> · Обновлено: {new Date(rates.updatedAt).toLocaleString("ru-RU")}
                {" · "}Для изменения перейдите в{" "}
                <a href="/admin/rates" style={{ color: "var(--color-brand)" }}>Управление курсами</a>
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--color-red)" }}>Не удалось загрузить курсы</p>
          )}
        </Section>

        {/* Countries */}
        <section className="nexora-card p-6 sm:p-8 mt-6">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
            Поддерживаемые страны
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {COUNTRIES.map(c => (
              <div key={c.name} className="rounded-xl p-5"
                   style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <div className="text-2xl mb-3">{c.flag}</div>
                <p className="font-bold text-sm mb-2" style={{ color: "var(--color-text-primary)" }}>{c.name}</p>
                <div className="flex items-center justify-between">
                  <span className="nexora-badge text-xs">{c.currency}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "var(--color-green-dim)", color: "var(--color-green)" }}>
                    Активна
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Crypto assets */}
        <section className="nexora-card p-6 sm:p-8 mt-6">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
            Поддерживаемые криптоактивы
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CRYPTO_ASSETS.map(asset => (
              <div key={asset} className="flex items-center justify-between rounded-xl px-4 py-3"
                   style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <span className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>{asset}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-green)" }} />
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Настройки маржи">
            <dl>
              {MARGIN_SETTINGS.map(r => <KVRow key={r.label} {...r} />)}
            </dl>
          </Section>
          <Section title="Лимиты заявок">
            <dl>
              {REQUEST_LIMITS.map(r => <KVRow key={r.label} {...r} />)}
            </dl>
          </Section>
        </div>

        {/* Operational */}
        <section className="nexora-card p-6 sm:p-8 mt-6">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
            Операционные настройки
          </h2>
          <dl>
            {OPERATIONAL.map(row => {
              const s = STATE_STYLE[row.state];
              return (
                <div key={row.label} className="flex items-center justify-between py-3.5"
                     style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                  <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.label}</dt>
                  <dd>
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: s.bg, color: s.color }}>
                      {row.value}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      </div>
    </div>
  );
}
