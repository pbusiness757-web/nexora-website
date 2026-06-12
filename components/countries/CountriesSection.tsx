type Country = {
  name: string;
  currency: string;
  flag: string;
  methods: string[];
};

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    currency: 'RUB',
    flag: '🇷🇺',
    methods: ['Bank cards', 'Personal accounts', 'Corporate accounts'],
  },
  {
    name: 'Kazakhstan',
    currency: 'KZT',
    flag: '🇰🇿',
    methods: ['Bank cards', 'Personal accounts', 'Corporate accounts'],
  },
  {
    name: 'Uzbekistan',
    currency: 'UZS',
    flag: '🇺🇿',
    methods: ['Bank cards', 'Personal accounts', 'Corporate accounts'],
  },
  {
    name: 'Azerbaijan',
    currency: 'AZN',
    flag: '🇦🇿',
    methods: ['Bank cards', 'Personal accounts', 'Corporate accounts'],
  },
  {
    name: 'Kyrgyzstan',
    currency: 'KGS',
    flag: '🇰🇬',
    methods: ['Bank cards', 'Personal accounts', 'Corporate accounts'],
  },
];

export default function CountriesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Supported Countries
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Local Currency Payouts Across CIS Countries
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Nexora supports crypto-to-bank payouts in key CIS markets with local
            currency settlement.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {COUNTRIES.map((country) => (
            <div
              key={country.name}
              className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{country.flag}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-900">
                  {country.currency}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-950">
                {country.name}
              </h3>

              <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                {country.methods.map((method) => (
                  <li key={method} className="flex items-center gap-2">
                    <span className="text-blue-900">✓</span>
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-medium text-slate-500">
          More payout corridors will be added soon.
        </p>
      </div>
    </section>
  );
}
