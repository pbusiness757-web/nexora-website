'use client';

import { useLocale } from '../../lib/locale-context';

type Node = {
  label: string;
  x: number;
  y: number;
  variant: 'crypto' | 'hub' | 'output';
  delay: string;
};

const NODES: Node[] = [
  { label: 'USDT', x: 16, y: 16, variant: 'crypto', delay: '0ms' },
  { label: 'BTC', x: 50, y: 9, variant: 'crypto', delay: '200ms' },
  { label: 'ETH', x: 84, y: 16, variant: 'crypto', delay: '400ms' },
  { label: 'NEXORA', x: 50, y: 50, variant: 'hub', delay: '0ms' },
  { label: 'Corporate Account', x: 18, y: 86, variant: 'output', delay: '300ms' },
  { label: 'Bank Card', x: 50, y: 93, variant: 'output', delay: '500ms' },
  { label: 'Local Currency', x: 82, y: 86, variant: 'output', delay: '700ms' },
];

const HUB = { x: 50, y: 50 };

const STATS = [
  { value: '5', label: 'Countries' },
  { value: 'Corporate', label: 'Payouts' },
  { value: 'Real-Time', label: 'Rates' },
  { value: 'Business', label: 'Focus' },
];

const nodeStyles: Record<Node['variant'], string> = {
  crypto: 'bg-white text-slate-900 border border-slate-200',
  hub: 'bg-blue-900 text-white border border-blue-700 shadow-lg shadow-blue-900/40',
  output: 'bg-white text-blue-900 border border-blue-200',
};

export default function HeroSection() {
  const { dict } = useLocale();

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            {dict.hero.badge}
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
            {dict.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            {dict.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              className="rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20"
            >
              {dict.hero.primaryCta}
            </button>

            <button
              type="button"
              className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900"
            >
              {dict.hero.secondaryCta}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xl font-bold text-blue-900">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                Payment Network
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Live
              </span>
            </div>

            <div className="relative aspect-square w-full">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {NODES.filter((n) => n.variant !== 'hub').map((node) => (
                  <line
                    key={node.label}
                    x1={node.x}
                    y1={node.y}
                    x2={HUB.x}
                    y2={HUB.y}
                    stroke="#06b6d4"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    className="animate-pulse motion-reduce:animate-none"
                    style={{ animationDelay: node.delay }}
                  />
                ))}
              </svg>

              {NODES.map((node) => (
                <div
                  key={node.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <span className="relative flex items-center justify-center">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/40 motion-reduce:animate-none"
                      style={{ animationDelay: node.delay }}
                    />
                    <span
                      className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${nodeStyles[node.variant]}`}
                    >
                      {node.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
