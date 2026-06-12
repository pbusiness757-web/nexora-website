'use client';

import { useLocale } from '../../lib/locale-context';

const NUMBERS = ['01', '02', '03', '04'];

export default function HowItWorks() {
  const { dict } = useLocale();
  const t = dict.howItWorks;

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
          {t.steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <span className="text-5xl font-bold text-slate-100 transition group-hover:text-blue-100">
                {NUMBERS[index]}
              </span>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                {step.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
