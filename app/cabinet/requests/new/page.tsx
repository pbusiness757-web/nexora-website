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

const COUNTRIES = [
  "Russia",
  "Kazakhstan",
  "Uzbekistan",
  "Azerbaijan",
  "Kyrgyzstan",
];

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

export default function NewRequestPage() {
  const router = useRouter();

  const [asset, setAsset]     = useState("USDT");
  const [network, setNetwork] = useState("TRC20");
  const [amount, setAmount]   = useState("");
  const [country, setCountry] = useState("Russia");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [rates, setRates]             = useState<RatesSnapshot | null>(null);
  const [ratesError, setRatesError]   = useState(false);

  // Reset network when asset changes
  useEffect(() => {
    const nets = NETWORKS[asset] ?? [];
    if (!nets.includes(network)) setNetwork(nets[0] ?? "");
  }, [asset]);

  // Fetch rates for estimate
  useEffect(() => {
    clientApi.getRates()
      .then(setRates)
      .catch(() => setRatesError(true));
  }, []);

  const numAmount = parseFloat(amount);
  const currency  = CURRENCY_FOR_COUNTRY[country] ?? "";
  const rate      = rates?.rates?.[currency] ?? null;
  const estimate  = rate && Number.isFinite(numAmount) && numAmount > 0
    ? numAmount * rate
    : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    setLoading(true);
    try {
      const req = await clientApi.createRequest({
        cryptoAsset: asset,
        network,
        cryptoAmount: parsed,
        country,
      });
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
        <Link href="/cabinet/requests" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Мои заявки
        </Link>
        <h1 className="text-xl font-semibold text-white mt-2">Создать заявку</h1>
        <p className="text-gray-400 text-sm mt-0.5">Обмен крипты на фиат</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Crypto Asset */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Криптоактив</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {CRYPTO_ASSETS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Network */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Сеть</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {(NETWORKS[asset] ?? []).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Сумма ({asset})</label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Payout Country */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Страна выплаты</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{COUNTRY_LABELS[c] ?? c}</option>
            ))}
          </select>
        </div>

        {/* Estimated payout */}
        <div className="bg-gray-800/60 rounded-lg px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">Ориентировочная выплата</span>
            {estimate !== null ? (
              <span className="text-white text-sm font-semibold">
                ≈ {estimate.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} {currency}
              </span>
            ) : ratesError ? (
              <span className="text-gray-500 text-xs">Курс недоступен</span>
            ) : (
              <span className="text-gray-500 text-xs">
                {rates ? "Введите сумму" : "Загрузка..."}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-xs mt-1">
            Итоговая сумма рассчитывается с учётом комиссий
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Создание..." : "Создать заявку"}
        </button>
      </form>
    </div>
  );
}
