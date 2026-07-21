'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '../../lib/locale-context';
import { supportedLocales } from '../../lib/i18n';

const NAV_LINKS: { href: string; dictKey: 'business' | 'countries' | 'rates' | 'faq'; fallback: string }[] = [
  { href: '#business',    dictKey: 'business',  fallback: 'Бизнес' },
  { href: '#countries',   dictKey: 'countries', fallback: 'Страны' },
  { href: '#rates',       dictKey: 'rates',     fallback: 'Курсы' },
  { href: '#faq',         dictKey: 'faq',       fallback: 'FAQ' },
];

export default function Header() {
  const { locale, setLocale, dict } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
              style={{ background: 'var(--color-brand)' }}
            >
              N
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Nexora
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-brand-dim)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {dict.nav?.[link.dictKey] ?? link.fallback}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Locale */}
            <select
              value={locale}
              onChange={e => setLocale(e.target.value as typeof locale)}
              className="hidden sm:block rounded-lg px-2 py-1.5 text-xs font-semibold outline-none cursor-pointer transition-all"
              style={{
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              {supportedLocales.map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>

            {/* Telegram */}
            <a
              href="https://t.me/nexorapay"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.3)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)';
                (e.currentTarget as HTMLElement).style.background = 'var(--color-brand-dim)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </a>

            {/* CTA */}
            <Link
              href="/cabinet/register"
              className="nexora-btn-primary hidden sm:inline-flex items-center gap-2 text-sm !py-2.5 !px-5 !rounded-xl"
            >
              {dict.nav?.createRequest ?? 'Создать заявку'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Mobile burger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors"
              style={{ background: mobileOpen ? 'var(--color-brand-dim)' : 'var(--color-bg-elevated)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span
                className="block w-5 h-0.5 rounded transition-all"
                style={{ background: 'var(--color-text-primary)', transform: mobileOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }}
              />
              <span
                className="block w-5 h-0.5 rounded transition-all"
                style={{ background: 'var(--color-text-primary)', opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-0.5 rounded transition-all"
                style={{ background: 'var(--color-text-primary)', transform: mobileOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden pb-6 pt-2 space-y-1"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {dict.nav?.[link.dictKey] ?? link.fallback}
              </a>
            ))}
            <div className="pt-3 flex gap-3 flex-wrap">
              <select
                value={locale}
                onChange={e => setLocale(e.target.value as typeof locale)}
                className="rounded-lg px-3 py-2 text-xs font-semibold outline-none"
                style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
              >
                {supportedLocales.map(l => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
              <Link
                href="/cabinet/register"
                className="nexora-btn-primary !py-2 !px-4 !text-sm !rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                {dict.nav?.createRequest ?? 'Создать заявку'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
