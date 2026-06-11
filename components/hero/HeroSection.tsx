export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            Crypto-to-Bank Infrastructure
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
            Pay with Crypto.
            <br />
            Settle in Local Currency.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            Nexora enables individuals and businesses to send cryptocurrency and
            receive payouts to corporate bank accounts, personal accounts and
            bank cards across CIS countries.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-2xl bg-blue-900 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20">
              Create Request
            </button>

            <button className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-900">
              Business Solutions
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm font-medium text-slate-600 sm:grid-cols-4">
            <div>✓ Corporate payouts</div>
            <div>✓ Real-time rates</div>
            <div>✓ AML monitoring</div>
            <div>✓ Dedicated support</div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                Payment Route
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Live
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Client sends</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  10,000 USDT
                </p>
              </div>

              <div className="flex justify-center text-2xl text-cyan-500">↓</div>

              <div className="rounded-2xl bg-blue-900 p-5 text-white">
                <p className="text-sm text-blue-100">Nexora Network</p>
                <p className="mt-2 text-2xl font-bold">
                  Crypto-to-Bank Processing
                </p>
              </div>

              <div className="flex justify-center text-2xl text-cyan-500">↓</div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Recipient receives</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  Corporate Bank Account
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  RUB · KZT · UZS · AZN · KGS
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}