"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clientApi, ClientUser } from "@/lib/clientApi";

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [user, setUser]       = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const publicPaths = ["/cabinet/login", "/cabinet/register"];
  const isPublic    = publicPaths.includes(pathname);

  useEffect(() => {
    if (isPublic) { setLoading(false); return; }
    clientApi.me()
      .then(setUser)
      .catch(() => router.replace("/cabinet/login"))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await clientApi.logout().catch(() => {});
    router.replace("/cabinet/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "var(--color-bg-base)" }}>
        <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка…</div>
      </div>
    );
  }

  if (isPublic) return <>{children}</>;

  const navLinks = [
    { href: "/cabinet",          label: "Главная" },
    { href: "/cabinet/requests", label: "Заявки"  },
    { href: "/cabinet/profile",  label: "Профиль" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-surface)" }}>
      <header style={{
        background:     "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom:   "1px solid var(--color-border)",
        position:       "sticky",
        top:            0,
        zIndex:         50,
      }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/cabinet" className="font-black text-lg"
                  style={{ color: "var(--color-brand)" }}>
              Nexora
            </Link>
            <nav className="flex gap-1">
              {navLinks.map(link => {
                const active = pathname === link.href
                  || (link.href !== "/cabinet" && pathname.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                        style={{
                          color:      active ? "var(--color-brand)"     : "var(--color-text-secondary)",
                          background: active ? "var(--color-brand-dim)" : "transparent",
                        }}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:flex items-center gap-2">
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                  {user.email}
                </span>
                {user.unreadCount > 0 && (
                  <span className="text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "var(--color-brand)" }}>
                    {user.unreadCount}
                  </span>
                )}
              </span>
            )}
            <button onClick={handleLogout}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      color:  "var(--color-text-secondary)",
                      border: "1px solid var(--color-border)",
                    }}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
