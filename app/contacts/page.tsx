"use client";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main style={{ background: "var(--color-bg-base)", minHeight: "70vh" }}>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-text-primary)" }}>
            Контакты
          </h1>
          <div className="space-y-8" style={{ color: "var(--color-text-secondary)" }}>
            <p className="text-lg">
              Мы готовы помочь вам с любыми вопросами о платформе Nexora.
            </p>

            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
            >
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Email поддержки
                </p>
                <a
                  href="mailto:support@nexoraexample.pro"
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-brand)" }}
                >
                  support@nexoraexample.pro
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Telegram
                </p>
                <a
                  href="https://t.me/nexoranotify_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-brand)" }}
                >
                  @nexoranotify_bot
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Время работы
                </p>
                <p className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  24/7
                </p>
              </div>
            </div>

            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Среднее время ответа — в течение нескольких часов. По срочным вопросам пишите в Telegram.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
