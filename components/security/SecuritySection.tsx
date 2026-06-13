'use client';

import { useLocale } from '../../lib/locale-context';
import SmartImage from '../ui/SmartImage';

export default function SecuritySection() {
  const { dict } = useLocale();
  const t = dict.security;

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              {t.badge}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              {t.title}
            </h2>
            <p className="mt-4 text-lg text-slate-600">{t.subtitle}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {t.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-900">✓</span>
                    <h3 className="font-bold text-slate-950">{feature.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <SmartImage
            src="/images/security/security-main.jpg"
            alt={t.title}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="h-80 w-full rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200 lg:h-[28rem]"
          />
        </div>
      </div>
    </section>
  );
}
