'use client';

import Link from 'next/link';
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
    <footer style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black"
                style={{ background: 'var(--color-brand)', color: '#ffffff' }}
              >
                N
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Nexora
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
              {t.description}
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-3">
              {[
                {
                  href: 'https://t.me/nexorapay',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.4)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors"
                        style={{ color: 'var(--color-text-secondary)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
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

        {/* Bottom */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.rights}</p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
