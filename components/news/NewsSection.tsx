'use client';

import { useLocale } from '../../lib/locale-context';

export default function NewsSection() {
  const { dict } = useLocale();
  const t = dict.news;

  return (
    <section className="bg-white py-24">
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

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.items.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-900">
                {item.category}
              </span>

              <h3 className="mt-6 flex-1 text-lg font-bold leading-7 text-slate-950">
                {item.title}
              </h3>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-500">
                  {item.date}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
