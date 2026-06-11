type Stat = {
  value: string;
  label: string;
};

const STATS: Stat[] = [
  { value: '5', label: 'Supported Countries' },
  { value: '7', label: 'Supported Crypto Assets' },
  { value: '5', label: 'Local Currencies' },
  { value: '24/7', label: 'Support Channel' },
];

export default function StatisticsSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Platform Metrics
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Built for Reliable Crypto-to-Bank Payouts
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Nexora is designed for controlled payouts, business settlements and
            local currency transfers.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <p className="text-5xl font-bold text-blue-900">{stat.value}</p>
              <p className="mt-3 text-base font-medium text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-medium text-slate-500">
          Live operational statistics will be displayed after launch.
        </p>
      </div>
    </section>
  );
}
