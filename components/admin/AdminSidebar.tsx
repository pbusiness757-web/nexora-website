'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Панель управления', href: '/admin' },
  { label: 'Заявки', href: '/admin/requests' },
  { label: 'Выплаты', href: '/admin/payouts' },
  { label: 'Курсы и маржа', href: '/admin/rates' },
  { label: 'AML-проверка', href: '/admin/aml' },
  { label: 'Клиенты', href: '/admin/clients' },
  { label: 'Партнёры и ликвидность', href: '/admin/partners' },
  { label: 'Отчёты', href: '/admin/reports' },
  { label: 'Финансы', href: '/admin/finance' },
  { label: 'Журнал действий', href: '/admin/audit-logs' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    await fetch(`${apiBase}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.replace('/admin/login');
    router.refresh();
  }

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

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto rounded-2xl border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          Выйти
        </button>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">
            Операционный центр
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Инфраструктура выплат крипто-в-банк
          </p>
        </div>
      </div>
    </aside>
  );
}
