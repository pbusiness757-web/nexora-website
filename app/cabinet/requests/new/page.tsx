"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApi, RatesSnapshot } from "@/lib/clientApi";

const CRYPTO_ASSETS = ["USDT", "BTC", "ETH", "TON", "TRX", "USDC", "LTC"];
const NETWORKS: Record<string, string[]> = {
  USDT: ["TRC20", "ERC20", "BEP20"],
  BTC:  ["BTC"],
  ETH:  ["ERC20"],
  TON:  ["TON"],
  TRX:  ["TRC20"],
  USDC: ["ERC20", "TRC20", "BEP20"],
  LTC:  ["LTC"],
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
const STABLE_ASSETS = new Set(["USDT", "USDC"]);

const RECIPIENT_HINT: Record<string, string> = {
  Russia:     "Пример: 4276 1234 5678 9012 · Иванов Иван Иванович · Сбербанк",
  Kazakhstan: "Пример: 4400 1234 5678 9012 · Иванов Иван · Kaspi Bank",
  Uzbekistan: "Пример: 8600 1234 5678 9012 · Имя получателя · Uzcard",
  Azerbaijan: "Пример: номер карты или IBAN · ФИО · Kapital Bank",
  Kyrgyzstan: "Пример: номер карты · ФИО · Mbank / KICB",
};

const selectStyle = {
  background:   "var(--color-bg-surface)",
  border:       "1px solid var(--color-border)",
  color:        "var(--color-text-primary)",
  borderRadius: "0.75rem",
  padding:      "0.75rem 1rem",
  fontSize:     "0.95rem",
  outline:      "none",
  width:        "100%",
};

const STEPS = ["Параметры обмена", "Реквизиты", "Проверка"];

export default function NewRequestPage() {
  const router = useRouter();
  const [step,       setStep]       = useState(0);
  const [asset,      setAsset]      = useState("USDT");
  const [network,    setNetwork]    = useState("TRC20");
  const [amount,     setAmount]     = useState("");
  const [country,    setCountry]    = useState("Russia");
  const [cardNumber, setCardNumber] = useState("");
  const [bankName,   setBankName]   = useState("");
  const [recpName,   setRecpName]   = useState("");
  const [error,      setError]      = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [rates,      setRates]      = useState<RatesSnapshot | null>(null);
  const [ratesErr,   setRatesErr]   = useState(false);

  useEffect(() => {
    const nets = NETWORKS[asset] ?? [];
    if (!nets.includes(network)) setNetwork(nets[0] ?? "");
  }, [asset]);

  useEffect(() => {
    const fetchRates = () => clientApi.getRates().then(setRates).catch(() => setRatesErr(true));
    fetchRates();
    const timer = setInterval(fetchRates, 60_000); // refresh every 60 seconds
    return () => clearInterval(timer);
  }, []);

  const numAmount   = parseFloat(amount);
  const currency    = CURRENCY_FOR_COUNTRY[country] ?? "";
  const fiatRate    = rates?.rates?.[currency] ?? null;
  // Stablecoins (USDT/USDC) = 1 USDT; others use live crypto price
  const cryptoToUSDT = STABLE_ASSETS.has(asset) ? 1 : (rates?.cryptoPrices?.[asset] ?? null);
  const gross     = fiatRate && cryptoToUSDT !== null && Number.isFinite(numAmount) && numAmount > 0
    ? numAmount * cryptoToUSDT * fiatRate
    : null;
  const fee       = gross ? gross * 0.03 : null;
  const estimate  = gross && fee ? gross - fee : null;

  const validateStep0 = () => {
    if (!amount || !Number.isFinite(numAmount) || numAmount <= 0) {
      setError("Введите корректную сумму"); return false;
    }
    setError(null); return true;
  };
  const validateStep1 = () => {
    if (!cardNumber.trim()) { setError("Введите номер карты / счёта"); return false; }
    if (!recpName.trim())   { setError("Введите ФИО получателя"); return false; }
    if (!bankName.trim())   { setError("Введите название банка"); return false; }
    setError(null); return true;
  };

  const handleNext = () => {
    if (step === 0 && validateStep0()) setStep(1);
    else if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const recipientDetails = JSON.stringify({
      cardNumber: cardNumber.trim(),
      bankName:   bankName.trim(),
      recipientName: recpName.trim(),
    });
    try {
      const req = await clientApi.createRequest({
        cryptoAsset: asset, network, cryptoAmount: numAmount, country, recipientDetails,
      });
      router.push(`/cabinet/request/${req.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при создании заявки");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/cabinet/requests" className="text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}>← Мои заявки</Link>
        <h1 className="text-2xl font-black mt-2" style={{ color: "var(--color-text-primary)" }}>
          Создать заявку
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Крипто → банковский счёт / карта
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                   style={{
                     background: i < step ? "var(--color-green)" : i === step ? "var(--color-brand)" : "var(--color-bg-elevated)",
                     color:      i <= step ? "#fff" : "var(--color-text-muted)",
                     border:     i > step ? "1px solid var(--color-border)" : "none",
                   }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="text-xs hidden sm:block"
                    style={{ color: i === step ? "var(--color-text-primary)" : "var(--color-text-muted)", fontWeight: i === step ? 600 : 400 }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1" style={{ background: i < step ? "var(--color-green)" : "var(--color-border)" }} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-sm rounded-xl px-4 py-3 mb-4"
             style={{ background: "var(--color-red-dim)", border: "1px solid rgba(239,68,68,0.25)", color: "var(--color-red)" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Step 0 */}
        {step === 0 && (
          <div className="nexora-card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                Криптоактив
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CRYPTO_ASSETS.map(a => (
                  <button key={a} type="button" onClick={() => setAsset(a)}
                          className="rounded-xl py-2 text-sm font-bold border transition-all"
                          style={{
                            background: asset === a ? "var(--color-brand)" : "var(--color-bg-elevated)",
                            color:      asset === a ? "#fff" : "var(--color-text-secondary)",
                            border:     asset === a ? "1px solid var(--color-brand)" : "1px solid var(--color-border)",
                          }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                Сеть
              </label>
              <div className="flex gap-2 flex-wrap">
                {(NETWORKS[asset] ?? []).map(n => (
                  <button key={n} type="button" onClick={() => setNetwork(n)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium border transition-all"
                          style={{
                            background: network === n ? "var(--color-brand-dim)" : "var(--color-bg-elevated)",
                            color:      network === n ? "var(--color-brand)" : "var(--color-text-muted)",
                            border:     network === n ? "1px solid rgba(37,99,235,0.4)" : "1px solid var(--color-border)",
                          }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Сумма ({asset})
              </label>
              <input type="number" min="0" step="any" value={amount}
                     onChange={e => setAmount(e.target.value)} placeholder="Например: 500"
                     className="nexora-input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Страна выплаты
              </label>
              <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
                {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_LABELS[c] ?? c}</option>)}
              </select>
            </div>

            {/* Estimate */}
            <div className="rounded-xl px-4 py-3" style={{ background: "var(--color-brand-dim)", border: "1px solid rgba(37,99,235,0.15)" }}>
              {/* Live rate line */}
              {rates && fiatRate && cryptoToUSDT !== null && (
                <div className="flex justify-between mb-2 pb-2" style={{ borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Курс</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: "var(--color-brand)" }}>
                    {STABLE_ASSETS.has(asset)
                      ? `1 ${asset} = ${fiatRate.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${currency}`
                      : `1 ${asset} ≈ ${cryptoToUSDT.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} USDT → ${(cryptoToUSDT * fiatRate).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${currency}`
                    }
                    {rates.updatedAt && (
                      <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
                        {" "}· {new Date(rates.updatedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Вы отправляете</span>
                <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                  {numAmount > 0 ? `${numAmount} ${asset}` : "—"}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Комиссия (3%)</span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {fee ? `− ${fee.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${currency}` : "—"}
                </span>
              </div>
              <div className="flex justify-between pt-2" style={{ borderTop: "1px solid rgba(37,99,235,0.15)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>Получатель получит</span>
                {estimate !== null ? (
                  <span className="text-base font-black" style={{ color: "var(--color-brand)" }}>
                    ≈ {estimate.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} {currency}
                  </span>
                ) : ratesErr ? (
                  <span className="text-xs" style={{ color: "var(--color-red)" }}>Курс недоступен</span>
                ) : !rates ? (
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Загрузка…</span>
                ) : cryptoToUSDT === null ? (
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Курс {asset} не получен</span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Введите сумму</span>
                )}
              </div>
            </div>

            <button type="button" onClick={handleNext} className="nexora-btn-primary w-full justify-center">
              Далее — Реквизиты →
            </button>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="nexora-card p-6 space-y-5">
            <div className="rounded-xl px-4 py-3" style={{ background: "var(--color-brand-dim)", border: "1px solid rgba(37,99,235,0.15)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-brand)" }}>
                📋 Куда перечислить средства?
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Укажите реквизиты получателя. Деньги будут зачислены на эту карту / счёт после подтверждения транзакции.
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                💡 {RECIPIENT_HINT[country]}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Номер карты / счёта *
              </label>
              <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                     placeholder="0000 0000 0000 0000" className="nexora-input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                ФИО получателя *
              </label>
              <input type="text" value={recpName} onChange={e => setRecpName(e.target.value)}
                     placeholder="Иванов Иван Иванович" className="nexora-input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Банк *
              </label>
              <input type="text" value={bankName} onChange={e => setBankName(e.target.value)}
                     placeholder="Сбербанк / Kaspi / Kapital Bank…" className="nexora-input" />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { setError(null); setStep(0); }}
                      className="nexora-btn-secondary flex-1 justify-center">← Назад</button>
              <button type="button" onClick={handleNext}
                      className="nexora-btn-primary flex-1 justify-center">Проверить →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="nexora-card p-6 space-y-3">
            <div className="text-sm font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
              ✅ Проверьте данные перед отправкой
            </div>
            {[
              { label: "Актив",      value: `${asset} (${network})` },
              { label: "Сумма",      value: `${amount} ${asset}` },
              { label: "Страна",     value: COUNTRY_LABELS[country] ?? country },
              { label: "Карта/счёт", value: cardNumber },
              { label: "Получатель", value: recpName },
              { label: "Банк",       value: bankName },
              { label: "≈ Получите", value: estimate ? `${estimate.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${currency}` : "—" },
            ].map(row => (
              <div key={row.label} className="flex justify-between gap-2 py-2"
                   style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{row.label}</span>
                <span className="text-sm font-medium text-right" style={{ color: "var(--color-text-primary)" }}>{row.value}</span>
              </div>
            ))}

            <div className="rounded-xl px-4 py-3 mt-2"
                 style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
              <p className="text-xs" style={{ color: "var(--color-green)" }}>
                🔐 После создания заявки вы получите адрес кошелька для отправки крипты. Обработка — до 15 минут.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setError(null); setStep(1); }}
                      className="nexora-btn-secondary flex-1 justify-center">← Назад</button>
              <button type="submit" disabled={loading}
                      className="nexora-btn-primary flex-1 justify-center"
                      style={{ opacity: loading ? 0.6 : 1 }}>
                {loading ? "Создание…" : "Создать заявку ✓"}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
