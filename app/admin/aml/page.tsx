type KpiCard = {
  label: string;
  value: string;
};

const KPIS: KpiCard[] = [
  { label: "Ожидают проверки", value: "7" },
  { label: "Пройдено сегодня", value: "21" },
  { label: "Высокий риск", value: "2" },
  { label: "Отклонено", value: "1" },
];

type AmlRow = {
  id: string;
  client: string;
  wallet: string;
  asset: string;
  amount: string;
  score: string;
  level: string;
  status: string;
  decision: string;
};

const REVIEWS: AmlRow[] = [
  {
    id: "NX-2026-0001",
    client: "Alpha Trade LLC",
    wallet: "TQ9...8K2",
    asset: "USDT",
    amount: "10,000",
    score: "18",
    level: "Низкий",
    status: "Пройдено",
    decision: "Одобрено",
  },
  {
    id: "NX-2026-0003",
    client: "UzMarket Group",
    wallet: "0xA3...91F",
    asset: "ETH",
    amount: "18,000",
    score: "42",
    level: "Средний",
    status: "Ручная проверка",
    decision: "Ожидает",
  },
  {
    id: "NX-2026-0005",
    client: "Частный клиент",
    wallet: "bc1q...7xz",
    asset: "BTC",
    amount: "1.2",
    score: "79",
    level: "Высокий",
    status: "Требует проверки",
    decision: "Удержание",
  },
];

const RISK_LEVELS = ["Низкий", "Средний", "Высокий", "Критический"];

const levelStyles: Record<string, string> = {
  Низкий: "bg-emerald-50 text-emerald-600",
  Средний: "bg-amber-50 text-amber-600",
  Высокий: "bg-rose-50 text-rose-600",
  Критический: "bg-red-100 text-red-700",
};

const decisionStyles: Record<string, string> = {
  Одобрено: "bg-emerald-50 text-emerald-600",
  Ожидает: "bg-cyan-50 text-cyan-700",
  Удержание: "bg-orange-50 text-orange-600",
  Отклонено: "bg-rose-50 text-rose-600",
};

const ACTIONS = [
  { label: "Одобрить", primary: true },
  { label: "Удержать", primary: false },
  { label: "Запросить документы", primary: false },
  { label: "Отклонить", primary: false },
];

const thClass = "pb-3 font-semibold";
const tdClass = "py-4";

export default function AdminAmlPage() {
  return (
    <main className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              AML и оценка рисков
            </h1>
            <p className="text-lg text-slate-600">
              Контроль рисков транзакций, проверок кошельков и комплаенс-решений.
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
            <h2 className="text-lg font-bold text-slate-950">AML-проверка</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className={thClass}>ID заявки</th>
                    <th className={thClass}>Клиент</th>
                    <th className={thClass}>Кошелёк</th>
                    <th className={thClass}>Актив</th>
                    <th className={thClass}>Сумма</th>
                    <th className={thClass}>Балл риска</th>
                    <th className={thClass}>Уровень риска</th>
                    <th className={thClass}>Статус</th>
                    <th className={thClass}>Решение</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REVIEWS.map((row) => (
                    <tr key={row.id} className="text-slate-700">
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.id}
                      </td>
                      <td className={tdClass}>{row.client}</td>
                      <td className={`${tdClass} font-mono text-slate-500`}>
                        {row.wallet}
                      </td>
                      <td className={tdClass}>{row.asset}</td>
                      <td className={tdClass}>{row.amount}</td>
                      <td className={`${tdClass} font-semibold text-slate-950`}>
                        {row.score}
                      </td>
                      <td className={tdClass}>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            levelStyles[row.level] ??
                            "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.level}
                        </span>
                      </td>
                      <td className={tdClass}>{row.status}</td>
                      <td className={tdClass}>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            decisionStyles[row.decision] ??
                            "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.decision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8 lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-950">
                Легенда уровней риска
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {RISK_LEVELS.map((level) => (
                  <span
                    key={level}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      levelStyles[level] ?? "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <h2 className="text-lg font-bold text-slate-950">
                Действия оператора
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={
                      action.primary
                        ? "rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950"
                        : "rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900"
                    }
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
    </main>
  );
}
