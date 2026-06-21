'use client';

import { useState } from 'react';
import { useLocale } from '../../lib/locale-context';

export default function FAQSection() {
  const { dict } = useLocale();
  const t = dict.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-base)' }}
      id="faq"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="mt-12 space-y-3">
          {t.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="nexora-card overflow-hidden transition-all duration-300"
                style={{
                  background: 'var(--color-bg-surface)',
                  borderColor: isOpen ? 'rgba(37,99,235,0.3)' : 'var(--color-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-sm font-semibold sm:text-base"
                    style={{ color: isOpen ? 'var(--color-brand)' : 'var(--color-text-primary)' }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-300"
                    style={{
                      background: isOpen ? 'var(--color-brand-dim)' : 'var(--color-bg-elevated)',
                      color: isOpen ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                    }}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <p
                    className="px-6 pb-5 text-sm leading-7 sm:text-base"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
