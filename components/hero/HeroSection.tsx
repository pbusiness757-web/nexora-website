'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from '../../lib/locale-context';

/* ── Types ─────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number;
  radius: number;
  opacity: number;
}
interface Node {
  x: number; y: number; z: number;
  vx: number; vy: number;
  label: string;
  color: string;
  radius: number;
}
interface FlowDot {
  fromIdx: number; toIdx: number;
  t: number; speed: number;
}

/* ── Canvas hook ────────────────────────────────────────────── */
function useAnimatedCanvas(mouseRef: React.MutableRefObject<{ x: number; y: number }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const nodes     = useRef<Node[]>([]);
  const flowDots  = useRef<FlowDot[]>([]);

  const initParticles = useCallback((w: number, h: number) => {
    particles.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random() * 800 + 200,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.25 + 0.05,
    }));

    const NODES = [
      { label: 'USDT', color: '#26a17b' },
      { label: 'BTC',  color: '#f7931a' },
      { label: 'ETH',  color: '#627eea' },
      { label: 'TON',  color: '#0098ea' },
      { label: 'TRX',  color: '#ef0027' },
      { label: 'RUB',  color: '#2563eb' },
      { label: 'KZT',  color: '#2563eb' },
      { label: 'UZS',  color: '#2563eb' },
    ];
    const cx = w / 2, cy = h / 2;
    const ring = Math.min(w, h) * 0.33;
    nodes.current = NODES.map((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * ring,
        y: cy + Math.sin(angle) * ring,
        z: 600,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        label: n.label, color: n.color,
        radius: 28,
      };
    });

    flowDots.current = [];
    for (let i = 0; i < nodes.current.length; i++) {
      for (let j = i + 1; j < nodes.current.length; j++) {
        if (Math.random() > 0.45) continue;
        flowDots.current.push({ fromIdx: i, toIdx: j, t: Math.random(), speed: 0.004 + Math.random() * 0.003 });
      }
    }
  }, []);

  const project = useCallback((x: number, y: number, z: number, w: number, h: number, mx: number, my: number) => {
    const cx = w / 2 + mx * 30, cy = h / 2 + my * 20;
    const fov = 600;
    const scale = fov / (fov + z);
    return { px: cx + (x - cx) * scale, py: cy + (y - cy) * scale, scale };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const { width: w, height: h } = canvas;
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      /* Soft blue radial bg glow */
      const grad = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w * 0.55);
      grad.addColorStop(0, 'rgba(37,99,235,0.06)');
      grad.addColorStop(1, 'rgba(37,99,235,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      /* Dust particles */
      particles.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const { px, py, scale } = project(p.x, p.y, p.z, w, h, mx, my);
        ctx.beginPath();
        ctx.arc(px, py, p.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${p.opacity})`;
        ctx.fill();
      });

      /* Grid lines between nodes */
      const ns = nodes.current;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = project(ns[i].x, ns[i].y, ns[i].z, w, h, mx, my);
          const b = project(ns[j].x, ns[j].y, ns[j].z, w, h, mx, my);
          const dist = Math.hypot(a.px - b.px, a.py - b.py);
          if (dist > 280) continue;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.strokeStyle = `rgba(37,99,235,${0.08 * (1 - dist / 280)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      /* Flow dots */
      flowDots.current.forEach(fd => {
        fd.t = (fd.t + fd.speed) % 1;
        const a = project(ns[fd.fromIdx].x, ns[fd.fromIdx].y, ns[fd.fromIdx].z, w, h, mx, my);
        const b = project(ns[fd.toIdx].x,   ns[fd.toIdx].y,   ns[fd.toIdx].z,   w, h, mx, my);
        const fx = a.px + (b.px - a.px) * fd.t;
        const fy = a.py + (b.py - a.py) * fd.t;
        ctx.beginPath();
        ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(37,99,235,0.5)';
        ctx.fill();
      });

      /* Nodes */
      ns.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        const margin = n.radius;
        if (n.x < margin || n.x > w - margin) n.vx *= -1;
        if (n.y < margin || n.y > h - margin) n.vy *= -1;
        const { px, py, scale } = project(n.x, n.y, n.z, w, h, mx, my);
        const r = n.radius * scale;

        /* Shadow */
        ctx.save();
        ctx.shadowColor = n.color + '33';
        ctx.shadowBlur  = 12;

        /* Pill bg */
        ctx.beginPath();
        ctx.roundRect(px - r * 1.5, py - r * 0.55, r * 3, r * 1.1, r * 0.4);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(37,99,235,0.15)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        /* Colour dot */
        ctx.beginPath();
        ctx.arc(px - r * 0.75, py, r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        /* Label */
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${Math.max(9, r * 0.45)}px system-ui,sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, px + r * 0.2, py);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [initParticles, project, mouseRef]);

  return canvasRef;
}

/* ── CoinBadge ──────────────────────────────────────────────── */
function CoinBadge({ label, value, change, top, left, delay = 0 }: {
  label: string; value: string; change: string; top: string; left: string; delay?: number;
}) {
  const isPositive = change.startsWith('+');
  return (
    <div
      className="absolute hidden lg:flex items-center gap-2.5 rounded-xl px-4 py-2.5 animate-float"
      style={{
        top, left,
        background: '#ffffff',
        border: '1px solid rgba(37,99,235,0.12)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        animationDelay: `${delay}s`,
        animationDuration: '4s',
      }}
    >
      <div className="flex flex-col">
        <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
      </div>
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          color: isPositive ? 'var(--color-green)' : 'var(--color-red)',
          background: isPositive ? 'var(--color-green-dim)' : 'var(--color-red-dim)',
        }}
      >
        {change}
      </span>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export default function HeroSection() {
  const { dict } = useLocale();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const canvasRef = useAnimatedCanvas(mouseRef);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width  - 0.5,
      y: (e.clientY - rect.top)  / rect.height - 0.5,
    };
  }, []);

  const t = {
    title:        dict.hero?.title        ?? 'Крипто выплаты в СНГ',
    subtitle:     dict.hero?.subtitle     ?? 'Быстрые B2B-переводы из USDT в RUB, KZT, UZS. FATF-совместимость, AML/KYB верификация, API интеграция.',
    primaryCta:   dict.hero?.primaryCta   ?? 'Начать работу',
    secondaryCta: dict.hero?.secondaryCta ?? 'Узнать больше',
  };

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{ background: 'var(--color-bg-base)', paddingTop: '4rem' }}
      onMouseMove={onMouseMove}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
      />

      {/* Floating badges */}
      <CoinBadge label="Bitcoin"   value="$64,250" change="+2.4%" top="22%" left="72%" delay={0} />
      <CoinBadge label="Ethereum"  value="$3,120"  change="+1.8%" top="55%" left="76%" delay={1.5} />
      <CoinBadge label="USDT/RUB"  value="91.4"    change="+0.3%" top="30%" left="8%"  delay={0.8} />
      <CoinBadge label="USDT/KZT"  value="462"     change="+0.6%" top="62%" left="5%"  delay={2} />

      {/* Hero content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(16px)',
              transition: 'all 0.6s ease',
              background: 'var(--color-brand-dim)',
              border: '1px solid rgba(37,99,235,0.2)',
              color: 'var(--color-brand)',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse-soft"
              style={{ background: 'var(--color-brand)' }}
            />
            B2B Crypto Payout Infrastructure · CIS
          </div>

          {/* Title */}
          <h1
            className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.1s',
              color: 'var(--color-text-primary)',
            }}
          >
            {t.title.split(' ').slice(0, 2).join(' ')}{' '}
            <span className="nexora-gradient-text">
              {t.title.split(' ').slice(2).join(' ')}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mb-10 text-lg leading-relaxed sm:text-xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.2s',
              color: 'var(--color-text-secondary)',
            }}
          >
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.3s',
            }}
          >
            <Link href="/exchange" className="nexora-btn-primary text-base !py-3.5 !px-8">
              {t.primaryCta}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="#business" className="nexora-btn-secondary text-base !py-3.5 !px-8">
              {t.secondaryCta}
            </a>
          </div>

          {/* Trust badges */}
          <div
            className="mt-10 flex flex-wrap gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'all 0.7s ease 0.45s',
            }}
          >
            {[
              { icon: '⚡', text: 'Выплата за 15 минут' },
              { icon: '🛡️', text: 'FATF / AML / KYB' },
              { icon: '🌍', text: '6 стран СНГ' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2">
                <span className="text-lg">{b.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg-base))' }}
      />
    </section>
  );
}
