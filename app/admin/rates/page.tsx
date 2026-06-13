type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Последнее обновление", value: "30 сек назад" },
  { label: "Активные пары", value: "12" },
  { label: "Средняя маржа", value: "2.8%" },
  { label: "Ручные изменения", value: "1" },
];

type CryptoRow = {
  asset: string;
  market: string;
  client: string;
  margin: string;
  source: string;
  status: string;
};

const CRYPTO_RATES: CryptoRow[] = [
  {
    asset: "USDT",
    market: "1.00 USD",
    client: "0.975 USD",
    margin: "2.5%",
    source: "Binance",
    status: "Активна",
  },
  {
    asset: "BTC",
    market: "67,500 USD",
    client: "65,475 USD",
    margin: "3.0%",
    source: "Binance",
    status: "Активна",
  },
  {
    asset: "ETH",
    market: "3,450 USD",
    client: "3,346 USD",
    margin: "3.0%",
    source: "Binance",
    status: "Активна",
  },
  {
    asset: "TON",
    market: "7.20 USD",
    client: "6.98 USD",
    margin: "3.0%",
    source: "CoinGecko",
    status: "Активна",
  },
];

type FiatRow = {
  currency: string;
  country: string;
  market: string;
  client: string;
  margin: string;
  status: string;
};

const FIAT_RATES: FiatRow[] = [
  {
    currency: "RUB",
    country: "Россия",
    market: "92.50",
    client: "90.18",
    margin: "2.5%",
    status: "Активна",
  },
  {
    currency: "KZT",
    country: "Казахстан",
    market: "450.00",
    client: "438.75",
    margin: "2.5%",
    status: "Активна",
  },
  {
    currency: "UZS",
    country: "Узбекистан",
    market: "12650.00",
    client: "12333.75",
    margin: "2.5%",
    status: "Активна",
  },
  {
    currency: "AZN",
    country: "Азербайджан",
    market: "1.70",
    client: "1.66",
    margin: "2.5%",
    status: "Активна",
  },
  {
    currency: "KGS",
    country: "Кыргызстан",
    market: "89.00",
    client: "86.78",
    margin: "2.5%",
    status: "Активна",
  },
];

const MARGIN_RULES = [
  { label: "Частные клиенты", value: "2% - 5%" },
  { label: "Бизнес-клиенты", value: "1% - 3%" },
  { label: "VIP-клиенты", value: "Индивидуально" },
];

const statusBadge =
  "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600";
const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminRatesPage() {
  return (
    <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Курсы и маржа
            </h1>
            <p className="text-lg text-slate-600">
              Контроль рыночных курсов, клиентских курсов и сервисной маржи.
            </p>
          </div>

          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((card) => (
              <div
                key={card.label}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {card.value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Курсы криптовалют</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>Актив</th>
                    <th className={thClass}>Рыночный курс</th>
                    <th className={thClass}>Клиентский курс</th>
                    <th className={thClass}>Маржа</th>
                    <th className={thClass}>Источник</th>
                    <th className={thClass}>Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CRYPTO_RATES.map((row) => (
                    <tr key={row.asset} className="text-slate-700">
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.asset}
                      </td>
                      <td className={tdClass}>{row.market}</td>
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.client}
                      </td>
                      <td className={tdClass}>{row.margin}</td>
                      <td className={tdClass}>{row.source}</td>
                      <td className={tdClass}>
                        <span className={statusBadge}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">
              Курсы фиатных выплат
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>Валюта</th>
                    <th className={thClass}>Страна</th>
                    <th className={thClass}>Рыночный курс</th>
                    <th className={thClass}>Клиентский курс</th>
                    <th className={thClass}>Маржа</th>
                    <th className={thClass}>Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FIAT_RATES.map((row) => (
                    <tr key={row.currency} className="text-slate-700">
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.currency}
                      </td>
                      <td className={tdClass}>{row.country}</td>
                      <td className={tdClass}>{row.market}</td>
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.client}
                      </td>
                      <td className={tdClass}>{row.margin}</td>
                      <td className={tdClass}>
                        <span className={statusBadge}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Правила маржи</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {MARGIN_RULES.map((rule) => (
                <div key={rule.label} className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{rule.label}</p>
                  <p className="mt-1 text-xl font-bold text-blue-900">
                    {rule.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
    </main>
  );
}
