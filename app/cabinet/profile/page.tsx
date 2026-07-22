"use client";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/clientApi";

interface ProfileData {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt: string | null;
  totalRequests: number;
}

export default function ProfilePage() {
  const [profile, setProfile]     = useState<ProfileData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // Change password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError]     = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    clientApi.getProfile()
      .then(setProfile)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(false);
    if (newPwd !== confirmPwd) {
      setPwdError("Новые пароли не совпадают");
      return;
    }
    if (newPwd.length < 8) {
      setPwdError("Новый пароль должен содержать минимум 8 символов");
      return;
    }
    setPwdLoading(true);
    try {
      await clientApi.changePassword(currentPwd, newPwd);
      setPwdSuccess(true);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (e: unknown) {
      setPwdError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Загрузка…</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4 rounded-xl text-sm"
           style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-red)", border: "1px solid rgba(239,68,68,0.2)" }}>
        {error ?? "Не удалось загрузить профиль"}
      </div>
    );
  }

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          Профиль
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          Информация об аккаунте и настройки безопасности
        </p>
      </div>

      {/* Account info card */}
      <div className="rounded-2xl p-6 space-y-4"
           style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-border)" }}>
        <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
          Данные аккаунта
        </h2>

        <div className="grid gap-3">
          {[
            { label: "Email",            value: profile.email },
            { label: "ID аккаунта",      value: profile.id },
            { label: "Дата регистрации", value: fmt(profile.createdAt) },
            { label: "Последний вход",   value: fmt(profile.lastLoginAt) },
            { label: "Заявок всего",     value: String(profile.totalRequests) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2"
                 style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
              <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                {label}
              </span>
              <span className="text-sm font-mono text-right max-w-xs truncate"
                    style={{ color: "var(--color-text-primary)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Change password card */}
      <div className="rounded-2xl p-6"
           style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-border)" }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
          Смена пароля
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
            const config = {
              currentPassword: { label: "Текущий пароль",       state: currentPwd,  set: setCurrentPwd },
              newPassword:     { label: "Новый пароль",          state: newPwd,      set: setNewPwd },
              confirmPassword: { label: "Подтвердите новый пароль", state: confirmPwd, set: setConfirmPwd },
            }[field];
            return (
              <div key={field}>
                <label className="block text-sm font-medium mb-1.5"
                       style={{ color: "var(--color-text-secondary)" }}>
                  {config.label}
                </label>
                <input
                  type="password"
                  value={config.state}
                  onChange={e => config.set(e.target.value)}
                  required
                  minLength={field !== "currentPassword" ? 8 : 1}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--color-brand)")}
                  onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
                />
              </div>
            );
          })}

          {pwdError && (
            <div className="text-sm rounded-xl px-4 py-2.5"
                 style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-red)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {pwdError}
            </div>
          )}
          {pwdSuccess && (
            <div className="text-sm rounded-xl px-4 py-2.5"
                 style={{ background: "rgba(5,150,105,0.08)", color: "var(--color-green)", border: "1px solid rgba(5,150,105,0.2)" }}>
              Пароль успешно изменён
            </div>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: pwdLoading ? "var(--color-bg-elevated)" : "var(--color-brand)",
              color: pwdLoading ? "var(--color-text-muted)" : "#fff",
              cursor: pwdLoading ? "not-allowed" : "pointer",
            }}>
            {pwdLoading ? "Сохранение…" : "Изменить пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
