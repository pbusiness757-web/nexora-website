'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale } from '../../lib/locale-context';
import { supportedLocales, type Locale } from '../../lib/i18n';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, dict } = useLocale();

  const navLinks = [
    { label: dict.nav.business, href: '#business' },
    { label: dict.nav.countries, href: '#countries' },
    { label: dict.nav.rates, href: '#rates' },
    { label: dict.nav.faq, href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          Nexora
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-blue-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label="Select language"
            className="hidden cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold uppercase text-slate-700 outline-none transition hover:border-blue-200 hover:text-blue-900 focus:border-cyan-400 sm:inline-flex"
          >
            {supportedLocales.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="hidden rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-900 sm:inline-flex"
          >
            Telegram
          </button>

          <Link
            href="/exchange"
            className="rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950"
          >
            {dict.nav.createRequest}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open ? 'true' : 'false'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:border-blue-200 hover:text-blue-900 md:hidden"
          >
            <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-900"
              >
                {link.label}
              </a>
            ))}

            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label="Select language"
              className="mt-2 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-semibold uppercase text-slate-700 outline-none"
            >
              {supportedLocales.map((code) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </nav>
      )}
    </header>
  );
}
