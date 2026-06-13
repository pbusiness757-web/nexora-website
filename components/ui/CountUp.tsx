'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  value: string;
  durationMs?: number;
};

/**
 * Counts up to a numeric value when scrolled into view.
 * Non-numeric values (e.g. "24/7", "B2B") are rendered as-is.
 */
export default function CountUp({ value, durationMs = 1200 }: CountUpProps) {
  const target = Number(value);
  const isNumeric = value.trim() !== '' && Number.isFinite(target);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) return;
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(target);
      return;
    }

    let raf = 0;
    let start: number | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const step = (ts: number) => {
          if (start === null) start = ts;
          const progress = Math.min((ts - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(target * eased));
          if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [isNumeric, target, durationMs]);

  return <span ref={ref}>{isNumeric ? display : value}</span>;
}
