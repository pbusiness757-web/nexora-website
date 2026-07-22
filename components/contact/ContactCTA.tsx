'use client';

import { useLocale } from '../../lib/locale-context';

export default function ContactCTA() {
  const { dict } = useLocale();
  const t = dict.contact;

  return (
    <section
      className="py-24"
      style={{ background: 'var(--color-bg-surface)' }}
      id="contact"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0.03) 50%, rgba(24,144,255,0.06) 100%)',
            border: '1px solid rgba(37,99,235,0.2)',
          }}
        >
          {/* Decorative glows */}
          <div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(37,99,235,0.08)' }}
          />
          <div
            className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(24,144,255,0.06)' }}
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="nexora-badge mb-6">{t.badge}</div>

            <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
              {t.title}
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {t.points.map(point => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    background: 'rgba(37,99,235,0.1)',
                    border: '1px solid rgba(37,99,235,0.2)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <span style={{ color: 'var(--color-green)' }}>✓</span>
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a href="/cabinet/register" className="nexora-btn-primary text-base">
                {t.primaryButton}
              </a>
              <a
                href="https://t.me/nexoranotify_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="nexora-btn-secondary text-base flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                {t.secondaryButton}
              </a>
              <a
                href="mailto:support@nexoraexample.pro"
                className="nexora-btn-secondary text-base flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@nexoraexample.pro
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
