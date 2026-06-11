type FooterColumn = {
  title: string;
  links: string[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: ['Calculator', 'Rates', 'Countries', 'FAQ'],
  },
  {
    title: 'Business',
    links: [
      'Supplier Payments',
      'Contractor Payments',
      'Corporate Payouts',
      'Invoice Settlements',
    ],
  },
  {
    title: 'Countries',
    links: ['Russia', 'Kazakhstan', 'Uzbekistan', 'Azerbaijan', 'Kyrgyzstan'],
  },
  {
    title: 'Legal',
    links: ['AML Policy', 'Privacy Policy', 'Terms of Service', 'Contacts'],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-blue-900">Nexora</div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              Crypto-to-bank payout infrastructure for individuals and
              businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-slate-950">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-600 transition hover:text-blue-900"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-500">
            © 2026 Nexora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
