'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Requests', href: '/admin/requests' },
  { label: 'Payouts', href: '/admin/payouts' },
  { label: 'Rates', href: '/admin/rates' },
  { label: 'AML Review', href: '/admin/aml' },
  { label: 'Clients', href: '/admin/clients' },
  { label: 'Partners', href: '/admin/partners' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Audit Logs', href: '/admin/audit-logs' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="px-3">
          <span className="text-xl font-bold text-blue-900">Nexora</span>
          <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-900">
            Admin
          </span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">
            Operations Center
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Crypto-to-bank payout infrastructure
          </p>
        </div>
      </div>
    </aside>
  );
}
