'use client';

import { useLocale } from '../../lib/locale-context';
import CountUp from '../ui/CountUp';

export default function StatisticsSection() {
  const { dict } = useLocale();
  const t = dict.statistics;

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {t.badge}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <p className="text-5xl font-bold text-blue-900">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-3 text-base font-medium text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-medium text-slate-500">
          {t.note}
        </p>
      </div>
    </section>
  );
}
