'use client';

import { useLocale } from '../../lib/locale-context';

const STEP_ICONS = ['📤', '⚡', '🔒', '✅'];
const STEP_COLORS = [
  'rgba(240,185,11,1)',
  'rgba(24,144,255,1)',
  'rgba(3,166,109,1)',
  'rgba(240,185,11,1)',
];

export default function HowItWorks() {
  const { dict } = useLocale();
  const t = dict.howItWorks;

  return (
    <section
      id="how-it-works"
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-base)' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, index) => (
            <div
              key={step.title}
              className="nexora-card group relative p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--color-bg-surface)' }}
            >
              {/* Step number */}
              <div
                className="mb-4 text-6xl font-black select-none"
                style={{ color: 'var(--color-border)', lineHeight: 1 }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: STEP_COLORS[index] + '18',
                  border: `1px solid ${STEP_COLORS[index]}30`,
                }}
              >
                {STEP_ICONS[index]}
              </div>

              <h3
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-7"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {step.description}
              </p>

              {/* Connector line (not last) */}
              {index < t.steps.length - 1 && (
                <div
                  className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1"
                  style={{ zIndex: 1 }}
                >
                  <div className="h-px w-6" style={{ background: 'var(--color-border)' }} />
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'var(--color-brand)' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
