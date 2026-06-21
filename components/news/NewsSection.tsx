'use client';

import { useLocale } from '../../lib/locale-context';

const CATEGORY_COLORS: Record<string, string> = {
  default: 'rgba(37,99,235,1)',
};

export default function NewsSection() {
  const { dict } = useLocale();
  const t = dict.news;

  return (
    <section
      className="py-24 nexora-section-glow"
      style={{ background: 'var(--color-bg-base)' }}
      id="news"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="nexora-badge mb-4">{t.badge}</div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl" style={{ color: 'var(--color-text-primary)' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.items.map((item, i) => (
            <article
              key={item.title}
              className="nexora-card group flex flex-col p-7 transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--color-bg-surface)' }}
            >
              {/* Category tag */}
              <span
                className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-5"
                style={{
                  background: 'var(--color-brand-dim)',
                  color: 'var(--color-brand)',
                  border: '1px solid rgba(37,99,235,0.25)',
                }}
              >
                {item.category}
              </span>

              <h3
                className="flex-1 text-base font-bold leading-7 transition-colors duration-200 group-hover:text-amber-400"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.title}
              </h3>

              <div
                className="mt-5 flex items-center justify-between pt-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {item.date}
                </span>
                <span
                  className="text-xs font-semibold flex items-center gap-1 transition-all duration-200"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; }}
                >
                  Читать →
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            className="nexora-btn-secondary text-sm"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
