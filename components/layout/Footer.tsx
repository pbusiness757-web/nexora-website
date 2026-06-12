'use client';

import { useLocale } from '../../lib/locale-context';

export default function Footer() {
  const { dict } = useLocale();
  const t = dict.footer;
  const columns = [
    t.columns.platform,
    t.columns.business,
    t.columns.countries,
    t.columns.legal,
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-blue-900">Nexora</div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              {t.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-slate-950">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-600 transition hover:text-blue-900"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-500">{t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
