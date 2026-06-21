"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApi } from "@/lib/clientApi";

export default function RegisterPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm)   { setError("Пароли не совпадают"); return; }
    if (password.length < 8)    { setError("Пароль должен быть не менее 8 символов"); return; }
    setLoading(true);
    try {
      await clientApi.register(email, password);
      router.replace("/cabinet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: "var(--color-bg-surface)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-2" style={{ color: "var(--color-brand)" }}>
            Nexora
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Регистрация
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Nexora Platform — личный кабинет
          </p>
        </div>

        <form onSubmit={handleSubmit} className="nexora-card p-6 space-y-4">
          {error && (
            <div className="text-sm rounded-xl px-4 py-3"
                 style={{
                   background: "var(--color-red-dim)",
                   border:     "1px solid rgba(239,68,68,0.25)",
                   color:      "var(--color-red)",
                 }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5"
                   style={{ color: "var(--color-text-secondary)" }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                   required autoComplete="email" placeholder="you@company.com"
                   className="nexora-input" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5"
                   style={{ color: "var(--color-text-secondary)" }}>
              Пароль
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                   required autoComplete="new-password" placeholder="Минимум 8 символов"
                   className="nexora-input" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5"
                   style={{ color: "var(--color-text-secondary)" }}>
              Подтверждение пароля
            </label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                   required autoComplete="new-password" placeholder="••••••••"
                   className="nexora-input" />
          </div>

          <button type="submit" disabled={loading}
                  className="nexora-btn-primary w-full justify-center"
                  style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "Создание аккаунта…" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: "var(--color-text-muted)" }}>
          Уже есть аккаунт?{" "}
          <Link href="/cabinet/login" style={{ color: "var(--color-brand)", fontWeight: 600 }}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
