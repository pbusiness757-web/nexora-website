type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Create Request',
    description:
      'Choose cryptocurrency, payout country, recipient type and payout method.',
  },
  {
    number: '02',
    title: 'Send Cryptocurrency',
    description: 'Transfer crypto to the provided wallet address.',
  },
  {
    number: '03',
    title: 'Nexora Processes Payment',
    description:
      'The transaction is verified and prepared for local currency payout.',
  },
  {
    number: '04',
    title: 'Recipient Receives Funds',
    description:
      'Funds are sent to a bank card, personal account or corporate bank account.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            How It Works
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            From Crypto to Local Currency in Four Steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A controlled payout flow for individuals, suppliers, contractors and
            organizations.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <span className="text-5xl font-bold text-slate-100 transition group-hover:text-blue-100">
                {step.number}
              </span>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                {step.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
