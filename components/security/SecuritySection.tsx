'use client';

import { useLocale } from '../../lib/locale-context';

const FEATURE_ICONS = ['🛡️', '🔍', '🔐', '📋'];

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
          {/* Text */}
          <div>
            <div className="nexora-badge mb-4">{t.badge}</div>
            <h2
              className="text-4xl font-black tracking-tight md:text-5xl"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t.title}
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              {t.subtitle}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {t.features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="nexora-card p-5 group transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--color-bg-elevated)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{FEATURE_ICONS[i] ?? '✓'}</span>
                    <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual — SVG Security Graphic */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  border: '1px dashed rgba(240,185,11,0.2)',
                  transform: 'scale(1.15)',
                }}
              />
              {/* Inner glow card */}
              <div
                className="nexora-card relative flex h-80 w-80 flex-col items-center justify-center text-center overflow-hidden"
                style={{
                  background: 'var(--color-bg-elevated)',
                  boxShadow: '0 0 60px rgba(240,185,11,0.08), var(--shadow-card)',
                }}
              >
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'linear-gradient(var(--color-brand) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />

                {/* Shield icon */}
                <div
                  className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl mb-4"
                  style={{
                    background: 'var(--color-brand-dim)',
                    border: '1px solid rgba(240,185,11,0.3)',
                  }}
                >
                  🛡️
                </div>
                <div className="relative z-10 text-xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  AML / KYB
                </div>
                <div className="relative z-10 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Compliance Engine
                </div>

                {/* Floating badges */}
                {['✓ FATF', '✓ OFAC', '✓ EU AML'].map((badge, i) => (
                  <div
                    key={badge}
                    className="absolute text-xs font-bold px-2.5 py-1 rounded-full animate-float"
                    style={{
                      background: 'var(--color-green-dim)',
                      border: '1px solid rgba(3,166,109,0.3)',
                      color: 'var(--color-green)',
                      animationDelay: `${i * 0.8}s`,
                      top: `${18 + i * 26}%`,
                      right: '-12%',
                    }}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
