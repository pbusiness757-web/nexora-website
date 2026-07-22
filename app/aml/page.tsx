"use client";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function AmlPage() {
  return (
    <>
      <Header />
      <main style={{ background: "var(--color-bg-base)", minHeight: "70vh" }}>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--color-text-primary)" }}>
            Политика AML / KYC
          </h1>
          <div className="prose-lg space-y-6" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              Nexora обязуется соблюдать требования по противодействию отмыванию денег (AML) и
              финансированию терроризма (CFT). Мы проводим проверку клиентов (KYC) и мониторинг
              транзакций в соответствии с применимым законодательством.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Верификация клиентов
            </h2>
            <p>
              Все клиенты проходят процедуру верификации личности (KYC) перед началом работы с
              платформой. Мы собираем и проверяем документы, удостоверяющие личность, и проводим
              проверку по санкционным спискам.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Мониторинг транзакций
            </h2>
            <p>
              Все транзакции проходят автоматический AML-скоринг. Транзакции с высоким риском
              направляются на ручную проверку. Мы вправе приостановить или отклонить подозрительные
              операции.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Хранение данных
            </h2>
            <p>
              Мы храним записи о транзакциях и документы KYC в течение не менее 5 лет в соответствии
              с требованиями законодательства.
            </p>
            <h2 className="text-xl font-semibold mt-8" style={{ color: "var(--color-text-primary)" }}>
              Контакты
            </h2>
            <p>
              По вопросам AML/KYC обращайтесь:{" "}
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
