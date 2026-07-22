"use client";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main style={{ background: "var(--color-bg-base)", minHeight: "70vh" }}>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-text-primary)" }}>
            Политика конфиденциальности
          </h1>
          <div className="prose-lg space-y-6" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              Nexora уважает вашу конфиденциальность и обязуется защищать ваши персональные данные.
              Настоящая политика описывает, как мы собираем, используем и защищаем информацию о вас.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Какие данные мы собираем
            </h2>
            <p>
              Мы собираем данные, необходимые для предоставления услуг: контактную информацию,
              документы KYC, историю транзакций и технические данные сессии.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Как мы используем данные
            </h2>
            <p>
              Данные используются для оказания услуг, выполнения требований AML/KYC, улучшения
              платформы и связи с вами. Мы не продаём ваши данные третьим лицам.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Защита данных
            </h2>
            <p>
              Все данные передаются по зашифрованным каналам (TLS). Доступ к данным строго
              ограничен и контролируется.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Контакты
            </h2>
            <p>
              По вопросам конфиденциальности:{" "}
              <a href="mailto:support@nexoraexample.pro" style={{ color: "var(--color-brand)" }}>
                support@nexoraexample.pro
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
