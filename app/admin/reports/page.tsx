type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Объём за месяц", value: "1,240,000 USDT" },
  { label: "Прибыль за месяц", value: "34,800 USDT" },
  { label: "Завершённые заявки", value: "486" },
  { label: "Средняя маржа", value: "2.8%" },
];

type CountryRow = {
  country: string;
  currency: string;
  volume: string;
  requests: string;
  profit: string;
};

const COUNTRIES: CountryRow[] = [
  {
    country: "Россия",
    currency: "RUB",
    volume: "520,000 USDT",
    requests: "184",
    profit: "14,600 USDT",
  },
  {
    country: "Казахстан",
    currency: "KZT",
    volume: "310,000 USDT",
    requests: "112",
    profit: "8,700 USDT",
  },
  {
    country: "Узбекистан",
    currency: "UZS",
    volume: "245,000 USDT",
    requests: "96",
    profit: "6,900 USDT",
  },
  {
    country: "Азербайджан",
    currency: "AZN",
    volume: "95,000 USDT",
    requests: "54",
    profit: "2,600 USDT",
  },
  {
    country: "Кыргызстан",
    currency: "KGS",
    volume: "70,000 USDT",
    requests: "40",
    profit: "2,000 USDT",
  },
];

const METHODS = [
  { label: "Корпоративные счета", percent: 58 },
  { label: "Банковские карты", percent: 27 },
  { label: "Личные счета", percent: 15 },
];

const SEGMENTS = [
  { label: "Объём бизнес-клиентов", value: "820,000 USDT", percent: 66 },
  { label: "Объём частных клиентов", value: "420,000 USDT", percent: 34 },
];

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminReportsPage() {
  return (
    <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Отчёты и аналитика
            </h1>
            <p className="text-lg text-slate-600">
              Контроль оборота, прибыли, стран, способов выплат и показателей
              бизнеса.
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
                <p className="mt-3 text-2xl font-bold text-slate-950">
                  {card.value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">
              Объём по странам
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>Страна</th>
                    <th className={thClass}>Валюта</th>
                    <th className={thClass}>Объём</th>
                    <th className={thClass}>Заявки</th>
                    <th className={thClass}>Прибыль</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COUNTRIES.map((row) => (
                    <tr key={row.country} className="text-slate-700">
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.country}
                      </td>
                      <td className={tdClass}>{row.currency}</td>
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.volume}
                      </td>
                      <td className={tdClass}>{row.requests}</td>
                      <td className={`${tdClass} font-semibold text-blue-900`}>
                        {row.profit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Эффективность способов выплат
              </h2>
              <div className="mt-6 space-y-5">
                {METHODS.map((method) => (
                  <div key={method.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {method.label}
                      </span>
                      <span className="font-semibold text-slate-950">
                        {method.percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-900"
                        style={{ width: `${method.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Бизнес-сегмент
              </h2>
              <div className="mt-6 space-y-5">
                {SEGMENTS.map((segment) => (
                  <div key={segment.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {segment.label}
                      </span>
                      <span className="font-semibold text-slate-950">
                        {segment.value}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{ width: `${segment.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
                Корпоративные выплаты — ведущий сегмент.
              </p>
            </section>
          </div>
        </div>
    </main>
  );
}
