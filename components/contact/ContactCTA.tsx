const TRUST_POINTS = [
  'Corporate account payouts',
  'Supplier and contractor payments',
  'Local currency settlement across CIS countries',
];

export default function ContactCTA() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-900 to-blue-950 px-8 py-16 shadow-2xl shadow-blue-900/30 sm:px-16">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              Business Request
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Ready to Process Business Payouts with Nexora?
            </h2>

            <p className="mt-4 text-lg leading-8 text-blue-100">
              Contact the Nexora team for supplier payments, contractor payouts,
              corporate bank account settlements and high-volume crypto-to-bank
              operations.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              {TRUST_POINTS.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
                >
                  <span className="text-cyan-300">✓</span>
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="rounded-2xl bg-white px-7 py-4 text-base font-semibold text-blue-900 shadow-lg shadow-blue-950/30 transition hover:bg-slate-100"
              >
                Create Business Request
              </button>

              <button
                type="button"
                className="rounded-2xl border border-white/30 bg-transparent px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Contact via Telegram
              </button>
            </div>
          </div>

          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
