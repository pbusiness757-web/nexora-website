"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

/**
 * /exchange — redirect to the authenticated client portal.
 *
 * Previously this page used a hardcoded test clientId ("test-client")
 * which caused all public requests to fail silently.
 *
 * Real clients must register/log in at /cabinet first, then submit
 * requests from within their portal — that flow uses the proper
 * authenticated API (POST /api/client-requests).
 */
export default function ExchangePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cabinet/register");
  }, [router]);

  return (
    <>
      <Header />
      <main
        className="flex min-h-[60vh] flex-col items-center justify-center py-24"
        style={{ background: "var(--color-bg-surface)" }}
      >
        <div
          className="nexora-card mx-auto max-w-md p-10 text-center"
          style={{ background: "var(--color-bg-elevated)" }}
        >
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{ background: "var(--color-brand-dim)", color: "var(--color-brand)" }}
          >
            ↗
          </div>
          <h1
            className="text-2xl font-black"
            style={{ color: "var(--color-text-primary)" }}
          >
            Переход в личный кабинет
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Для создания заявки необходимо зарегистрироваться или войти в
            личный кабинет.
          </p>
          <a
            href="/cabinet/register"
            className="nexora-btn-primary mt-8 inline-block text-base"
          >
            Зарегистрироваться
          </a>
          <p className="mt-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Уже есть аккаунт?{" "}
            <a
              href="/cabinet/login"
              style={{ color: "var(--color-brand)" }}
              className="font-semibold hover:underline"
            >
              Войти
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
