"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setChecked(true);
      return;
    }
    let active = true;
    setChecked(false);
    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!active) return;
        if (res.ok) {
          setChecked(true);
        } else {
          router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => {
        if (active) router.replace("/admin/login");
      });
    return () => {
      active = false;
    };
  }, [pathname, isLogin, router]);

  // Login screen renders full-bleed without the sidebar chrome.
  if (isLogin) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Проверка доступа…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
