type Solution = {
  title: string;
  description: string;
  features: string[];
  icon: string;
};

const SOLUTIONS: Solution[] = [
  {
    title: 'Supplier Payments',
    description:
      'Pay suppliers using cryptocurrency with local currency settlement.',
    features: [
      'Local currency payouts',
      'Corporate bank accounts',
      'Fast processing',
    ],
    icon: '🏭',
  },
  {
    title: 'Contractor Payments',
    description:
      'Pay contractors and remote teams directly to local bank accounts.',
    features: ['Individual recipients', 'Cross-border payouts', 'Real-time rates'],
    icon: '👥',
  },
  {
    title: 'Corporate Account Payouts',
    description:
      'Send payouts directly to legal entities and company bank accounts.',
    features: ['Business accounts', 'Organization payouts', 'Invoice support'],
    icon: '🏛️',
  },
  {
    title: 'Invoice Settlements',
    description: 'Settle invoices using crypto-to-bank conversion.',
    features: ['Business payments', 'Transparent rates', 'Secure processing'],
    icon: '🧾',
  },
];

export default function BusinessSolutions() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-900">
            Business Payments
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Business Payment Solutions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Built for companies, suppliers, contractors and organizations across
            CIS countries.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((solution) => (
            <div
              key={solution.title}
              className="group flex flex-col rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-900 group-hover:text-white">
                <span>{solution.icon}</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                {solution.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {solution.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-blue-900">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 rounded-[2rem] bg-blue-900 px-8 py-12 text-center text-white md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-2xl font-bold">
              Need a custom business payment solution?
            </h3>
            <p className="mt-2 max-w-2xl text-blue-100">
              Contact Nexora for supplier payments, contractor payouts and
              corporate settlements.
            </p>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-blue-900 shadow-lg shadow-blue-950/20 transition hover:bg-slate-100">
            Contact Business Team
          </button>
        </div>
      </div>
    </section>
  );
}
