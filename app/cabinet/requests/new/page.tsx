"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApi, RatesSnapshot } from "@/lib/clientApi";

const CRYPTO_ASSETS = ["USDT", "BTC", "ETH"];
const NETWORKS: Record<string, string[]> = {
  USDT: ["TRC20", "ERC20", "BEP20"],
  BTC:  ["BTC"],
  ETH:  ["ERC20"],
};
const COUNTRIES = ["Russia", "Kazakhstan", "Uzbekistan", "Azerbaijan", "Kyrgyzstan"];
const COUNTRY_LABELS: Record<string, string> = {
  Russia:     "Россия (RUB)",
  Kazakhstan: "Казахстан (KZT)",
  Uzbekistan: "Узбекистан (UZS)",
  Azerbaijan: "Азербайджан (AZN)",
  Kyrgyzstan: "Кыргызстан (KGS)",
};
const CURRENCY_FOR_COUNTRY: Record<string, string> = {
  Russia:     "RUB",
  Kazakhstan: "KZT",
  Uzbekistan: "UZS",
  Azerbaijan: "AZN",
  Kyrgyzstan: "KGS",
};

const selectStyle = {
  background: "var(--color-bg-surface)",
  border:     "1px solid var(--color-border)",
  color:      "var(--color-text-primary)",
  borderRadius: "0.75rem",
  padding:    "0.75rem 1rem",
  fontSize:   "0.95rem",
  outline:    "none",
  width:      "100%",
};

export default function NewRequestPage() {
  const router = useRouter();
  const [asset,   setAsset]   = useState("USDT");
  const [network, setNetwork] = useState("TRC20");
  const [amount,  setAmount]  = useState("");
  const [country, setCountry] = useState("Russia");
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rates,   setRates]   = useState<RatesSnapshot | null>(null);
  const [ratesErr,setRatesErr]= useState(false);

  useEffect(() => {
    const nets = NETWORKS[asset] ?? [];
    if (!nets.includes(network)) setNetwork(nets[0] ?? "");
  }, [asset]);

  useEffect(() => {
    clientApi.getRates().then(setRates).catch(() => setRatesErr(true));
  }, []);

  const numAmount = parseFloat(amount);
  const currency  = CURRENCY_FOR_COUNTRY[country] ?? "";
  const rate      = rates?.rates?.[currency] ?? null;
  const estimate  = rate && Number.isFinite(numAmount) && numAmount > 0 ? numAmount * rate : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) { setError("Введите корректную сумму"); return; }
    setLoading(true);
    try {
      const req = await clientApi.createRequest({ cryptoAsset: asset, network, cryptoAmount: parsed, country });
      router.push(`/cabinet/request/${req.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при создании заявки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/cabinet/requests" className="text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}>
          ← Мои заявки
        </Link>
        <h1 className="text-2xl font-black mt-2" style={{ color: "var(--color-text-primary)" }}>
          Создать заявку
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Обмен крипты на фиат
        </p>
      </div>

      <form onSubmit={handleSubmit} className="nexora-card p-6 space-y-5">
        {error && (
          <div className="text-sm rounded-xl px-4 py-3"
               style={{
                 background: "var(--color-red-dim)",
                 border:     "1px solid rgba(239,68,68,0.25)",
                 color:      "var(--color-red)",
               }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5"
                 style={{ color: "var(--color-text-secondary)" }}>
            Криптоактив
          </label>
          <select value={asset} onChange={e => setAsset(e.target.value)} style={selectStyle}>
            {CRYPTO_ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5"
                 style={{ color: "var(--color-text-secondary)" }}>
            Сеть
          </label>
          <select value={network} onChange={e => setNetwork(e.target.value)} style={selectStyle}>
            {(NETWORKS[asset] ?? []).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5"
                 style={{ color: "var(--color-text-secondary)" }}>
            Сумма ({asset})
          </label>
          <input type="number" min="0" step="any" value={amount} onChange={e => setAmount(e.target.value)}
                 required placeholder="0.00" className="nexora-input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5"
                 style={{ color: "var(--color-text-secondary)" }}>
            Страна выплаты
          </label>
          <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
            {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_LABELS[c] ?? c}</option>)}
          </select>
        </div>

        {/* Estimate */}
        <div className="rounded-xl px-4 py-3"
             style={{ background: "var(--color-brand-dim)", border: "1px solid rgba(37,99,235,0.15)" }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Ориентировочная выплата
            </span>
            {estimate !== null ? (
              <span className="text-sm font-bold" style={{ color: "var(--color-brand)" }}>
                ≈ {estimate.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} {currency}
              </span>
            ) : ratesErr ? (
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Курс недоступен</span>
            ) : (
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {rates ? "Введите сумму" : "Загрузка…"}
              </span>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            Итоговая сумма рассчитывается с учётом комиссий
          </p>
        </div>

        <button type="submit" disabled={loading}
                className="nexora-btn-primary w-full justify-center"
                style={{ opacity: loading ? 0.6 : 1 }}>
          {loading ? "Создание…" : "Создать заявку"}
        </button>
      </form>
    </div>
  );
}
