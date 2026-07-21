'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '../../lib/locale-context';

const LABELS: Record<string, string> = {
  ru: 'Наверх',
  en: 'Back to top',
  kk: 'Жоғарыға',
  uz: 'Yuqoriga',
  az: 'Yuxarı',
  ky: 'Жогору',
};

export default function BackToTop() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = LABELS[locale] ?? LABELS.en;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-lg text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:bg-blue-950 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      ↑
    </button>
  );
}
