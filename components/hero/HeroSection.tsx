'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '../../lib/locale-context';

/* ── 3D Particle Network ──────────────────────────────────── */
type Particle = {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  label?: string; isNode: boolean; size: number;
  color: string;
};

const NODES = [
  { label: 'USDT', color: '#26a17b' },
  { label: 'BTC',  color: '#f7931a' },
  { label: 'ETH',  color: '#627eea' },
  { label: 'TON',  color: '#0098ea' },
  { label: 'RUB',  color: '#f0b90b' },
  { label: 'KZT',  color: '#f0b90b' },
  { label: 'UZS',  color: '#f0b90b' },
  { label: 'USDC', color: '#2775ca' },
];

function initParticles(W: number, H: number): Particle[] {
  const particles: Particle[] = [];
  // Background dust
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: (Math.random() - 0.5) * W * 2.5,
      y: (Math.random() - 0.5) * H * 2.5,
      z: Math.random() * 800 + 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.5,
      isNode: false,
      size: Math.random() * 1.5 + 0.5,
      color: 'rgba(240,185,11,0.35)',
    });
  }
  // Named nodes
  NODES.forEach((n, i) => {
    const angle = (i / NODES.length) * Math.PI * 2;
    const r = 240 + Math.random() * 100;
    particles.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r * 0.55,
      z: 300 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      vz: (Math.random() - 0.5) * 0.2,
      label: n.label,
      isNode: true,
      size: 5,
      color: n.color,
    });
  });
  return particles;
}

function project(x: number, y: number, z: number, W: number, H: number, fov: number) {
  const scale = fov / (fov + z);
  return { sx: x * scale + W / 2, sy: y * scale + H / 2, scale };
}

function drawCanvas(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  W: number, H: number,
  mx: number, my: number,
  tick: number
) {
  ctx.clearRect(0, 0, W, H);

  // Background gradient
  const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.8);
  bgGrad.addColorStop(0,   'rgba(20,17,10,1)');
  bgGrad.addColorStop(0.5, 'rgba(11,14,17,1)');
  bgGrad.addColorStop(1,   'rgba(8,10,13,1)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle brand glow center
  const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.45);
  glow.addColorStop(0,   'rgba(240,185,11,0.04)');
  glow.addColorStop(0.4, 'rgba(240,185,11,0.015)');
  glow.addColorStop(1,   'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const FOV = 600;
  const nodes = particles.filter(p => p.isNode);
  const projected = particles.map(p => {
    const ox = p.x + mx * 0.04;
    const oy = p.y + my * 0.04;
    return project(ox, oy, p.z, W, H, FOV);
  });

  // Draw edges between nodes
  nodes.forEach((a, ai) => {
    nodes.forEach((b, bi) => {
      if (bi <= ai) return;
      const ia = particles.indexOf(a);
      const ib = particles.indexOf(b);
      const pa = projected[ia];
      const pb = projected[ib];
      const dist = Math.hypot(pa.sx - pb.sx, pa.sy - pb.sy);
      if (dist > 280) return;
      const alpha = Math.max(0, 0.18 * (1 - dist / 280));
      ctx.beginPath();
      ctx.moveTo(pa.sx, pa.sy);
      ctx.lineTo(pb.sx, pb.sy);
      ctx.strokeStyle = `rgba(240,185,11,${alpha})`;
      ctx.lineWidth = 0.7 * pa.scale;
      ctx.stroke();
    });
  });

  // Draw edges between dust particles
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].isNode) continue;
    for (let j = i + 1; j < particles.length; j++) {
      if (particles[j].isNode) continue;
      const pa = projected[i];
      const pb = projected[j];
      const dist = Math.hypot(pa.sx - pb.sx, pa.sy - pb.sy);
      if (dist > 120) continue;
      const alpha = 0.07 * (1 - dist / 120);
      ctx.beginPath();
      ctx.moveTo(pa.sx, pa.sy);
      ctx.lineTo(pb.sx, pb.sy);
      ctx.strokeStyle = `rgba(240,185,11,${alpha})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
  }

  // Draw particles
  particles.forEach((p, i) => {
    const { sx, sy, scale } = projected[i];
    if (sx < -100 || sx > W + 100 || sy < -100 || sy > H + 100) return;

    if (p.isNode) {
      const r = p.size * scale * 2.2;
      // Outer glow
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.5);
      g.addColorStop(0,   p.color + '55');
      g.addColorStop(0.4, p.color + '22');
      g.addColorStop(1,   'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(sx, sy, r * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Label
      if (scale > 0.45 && p.label) {
        ctx.font = `bold ${Math.round(10 * scale + 1)}px system-ui,sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(234,236,239,0.9)';
        ctx.fillText(p.label, sx, sy - r - 6 * scale);
      }
    } else {
      // Dust particle
      const r = p.size * scale;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.3, r), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,185,11,${0.2 + scale * 0.15})`;
      ctx.fill();
    }
  });

  // Animated data-flow dots along edges (between nodes)
  const t = tick * 0.008;
  nodes.forEach((a, ai) => {
    nodes.forEach((b, bi) => {
      if (bi <= ai) return;
      const ia = particles.indexOf(a);
      const ib = particles.indexOf(b);
      const pa = projected[ia];
      const pb = projected[ib];
      const dist = Math.hypot(pa.sx - pb.sx, pa.sy - pb.sy);
      if (dist > 280) return;
      const phase = ((t + ai * 1.3 + bi * 0.7) % 1);
      const fx = pa.sx + (pb.sx - pa.sx) * phase;
      const fy = pa.sy + (pb.sy - pa.sy) * phase;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,185,11,0.85)';
      ctx.fill();
    });
  });
}

function useAnimatedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX - canvas.offsetWidth / 2,
        y: e.clientY - canvas.offsetHeight / 2,
      };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    let raf = 0;
    const loop = () => {
      tickRef.current++;
      const { width: W, height: H } = canvas;
      const pts = particlesRef.current;

      // Update positions
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (p.z < 50)  p.vz = Math.abs(p.vz);
        if (p.z > 900) p.vz = -Math.abs(p.vz);
        const bound = 800;
        if (Math.abs(p.x) > bound) p.vx *= -1;
        if (Math.abs(p.y) > bound) p.vy *= -1;
      });

      drawCanvas(ctx, pts, W, H, mouseRef.current.x, mouseRef.current.y, tickRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return canvasRef;
}

/* ── Floating coin badge ─────────────────────────────────── */
function CoinBadge({
  icon, label, value, delay, x, y
}: { icon: string; label: string; value: string; delay: string; x: string; y: string }) {
  return (
    <div
      className="absolute animate-float hidden lg:flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm"
      style={{
        left: x, top: y,
        background: 'rgba(22,26,30,0.85)',
        border: '1px solid rgba(43,48,64,0.8)',
        color: 'var(--color-text-primary)',
        animationDelay: delay,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{icon}</span>
      <div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem', lineHeight: 1 }}>{label}</div>
        <div style={{ color: 'var(--color-brand)', lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

/* ── HeroSection ─────────────────────────────────────────── */
export default function HeroSection() {
  const { dict } = useLocale();
  const t = dict.hero;
  const canvasRef = useAnimatedCanvas();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(11,14,17,0.85) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ zIndex: 2, background: 'linear-gradient(to bottom, transparent, var(--color-bg-base))' }}
      />

      {/* Floating badges */}
      <CoinBadge icon="₿" label="Bitcoin" value="$64,250" delay="0s"   x="6%" y="28%" />
      <CoinBadge icon="⬡" label="Ethereum" value="$3,120" delay="1.2s" x="6%" y="58%" />
      <CoinBadge icon="💵" label="USDT → RUB" value="92.4" delay="0.6s" x="80%" y="28%" />
      <CoinBadge icon="🇰🇿" label="KZT пополнение" value="Мгновенно" delay="1.8s" x="80%" y="58%" />

      {/* Hero Content */}
      <div className="relative w-full" style={{ zIndex: 3 }}>
        <div className="mx-auto max-w-4xl px-6 text-center">

          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            <span className="nexora-badge">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t.badge ?? 'B2B Crypto Payout Infrastructure'}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl font-black tracking-tight leading-tight sm:text-6xl md:text-7xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
            }}
          >
            {t.title}
          </h1>

          {/* Sub */}
          <p
            className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed sm:text-xl"
            style={{
              color: 'var(--color-text-secondary)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s',
            }}
          >
            {t.subtitle ?? 'Автоматические B2B выплаты из крипто в банки России, Казахстана, Узбекистана и других стран СНГ. Быстро, безопасно, прозрачно.'}
          </p>

          {/* CTA Row */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
            }}
          >
            <Link href="/exchange" className="nexora-btn-primary text-base gap-2 flex items-center">
              {t.primaryCta ?? 'Начать выплаты'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="#how-it-works" className="nexora-btn-secondary text-base flex items-center gap-2">
              {t.secondaryCta ?? 'Как это работает'}
            </a>
          </div>

          {/* Trust strip */}
          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.7s ease 0.7s',
            }}
          >
            {[
              { icon: '🌍', text: '6 стран СНГ' },
              { icon: '⚡', text: 'До 15 минут' },
              { icon: '🔒', text: 'AML / KYB' },
              { icon: '📊', text: '99.8% uptime' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2">
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 4, opacity: 0.4 }}
      >
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
          scroll
        </span>
        <div className="w-px h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, var(--color-brand), transparent)' }} />
      </div>
    </section>
  );
}
