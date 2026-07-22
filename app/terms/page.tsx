"use client";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main style={{ background: "var(--color-bg-base)", minHeight: "70vh" }}>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-text-primary)" }}>
            Условия использования
          </h1>
          <div className="prose-lg space-y-6" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              Используя платформу Nexora, вы соглашаетесь с настоящими условиями. Пожалуйста,
              внимательно ознакомьтесь с ними перед началом работы.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Использование платформы
            </h2>
            <p>
              Nexora предоставляет инфраструктуру для обмена и перевода криптовалюты в фиатные
              средства. Платформа предназначена только для законных операций.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Ограничения
            </h2>
            <p>
              Запрещается использование платформы для отмывания денег, финансирования терроризма
              или любой иной незаконной деятельности. Нарушение правил ведёт к немедленной
              блокировке аккаунта.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Ответственность
            </h2>
            <p>
              Nexora не несёт ответственности за убытки, возникшие вследствие рыночных колебаний
              курсов или задержек, не зависящих от платформы. Все курсы фиксируются на момент
              создания заявки.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Контакты
            </h2>
            <p>
              По вопросам:{" "}
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
