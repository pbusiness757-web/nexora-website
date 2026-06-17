"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clientApi, ClientUser } from "@/lib/clientApi";

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const publicPaths = ["/cabinet/login", "/cabinet/register"];
  const isPublic = publicPaths.includes(pathname);

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Загрузка...</div>
      </div>
    );
  }

  if (isPublic) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-indigo-400">Nexora</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/cabinet" className="text-gray-300 hover:text-white transition-colors">
                Главная
              </Link>
              <Link href="/cabinet/requests" className="text-gray-300 hover:text-white transition-colors">
                Заявки
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {user && (
              <span className="text-gray-400 hidden sm:block">
                {user.email}
                {user.unreadCount > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
