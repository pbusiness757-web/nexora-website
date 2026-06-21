'use client';

import { useLocale } from '../../lib/locale-context';

const FEATURE_ICONS = ['🛡️', '🔍', '🔐', '📋'];

const ShieldSVG = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path
      d="M32 4L8 14v18c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V14L32 4z"
      fill="rgba(37,99,235,0.15)"
      stroke="#2563eb"
      strokeWidth="2"
    />
    <path
      d="M32 12L14 20v12c0 8.8 6.8 17 18 19.3C43.2 49 50 40.8 50 32V20L32 12z"
      fill="rgba(37,99,235,0.08)"
    />
    <path
      d="M26 32l4 4 8-8"
      stroke="#2563eb"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const COMPLIANCE = [
  { label: 'FATF', desc: 'Compliant' },
  { label: 'OFAC', desc: 'Screened' },
  { label: 'EU AML', desc: '6AMLD' },
  { label: 'KYB', desc: 'Verified' },
];

export default function SecuritySection() {
  const { dict } = useLocale();
  const t = dict.security;

  return (
    <section
      id="security"
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-surface)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* Text side */}
          <div>
            <div className="nexora-badge mb-4">{t.badge}</div>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
              {t.title}
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {t.subtitle}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {t.features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="nexora-card p-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--color-bg-elevated)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{FEATURE_ICONS[i] ?? '✓'}</span>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual side */}
          <div className="flex items-center justify-center">
            <div
              className="nexora-card relative w-full max-w-sm p-8"
              style={{
                background: 'var(--color-bg-elevated)',
                boxShadow: '0 0 80px rgba(37,99,235,0.06), var(--shadow-card)',
              }}
            >
              {/* Grid bg */}
              <div
                className="absolute inset-0 rounded-2xl opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(var(--color-brand) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              {/* Central shield */}
              <div className="relative z-10 flex flex-col items-center text-center mb-8">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 100%)',
                    border: '1px solid rgba(37,99,235,0.3)',
                  }}
                >
                  <ShieldSVG />
                </div>
                <div className="text-xl font-black mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  AML / KYB
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Compliance Engine
                </div>
              </div>

              {/* Compliance grid */}
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {COMPLIANCE.map((item, i) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-xl p-3 animate-float"
                    style={{
                      background: 'rgba(3,166,109,0.08)',
                      border: '1px solid rgba(3,166,109,0.2)',
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                      style={{ background: 'rgba(3,166,109,0.2)', color: 'var(--color-green)' }}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-black" style={{ color: 'var(--color-green)' }}>
                        {item.label}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live status */}
              <div
                className="relative z-10 mt-4 flex items-center justify-center gap-2 rounded-xl p-3"
                style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}
              >
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                  Мониторинг активен · 24/7
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
