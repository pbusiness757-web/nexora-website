import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/hero/HeroSection";
import LiveCalculator from "../components/calculator/LiveCalculator";
import BusinessSolutions from "../components/business/BusinessSolutions";
import CorporatePayouts from "../components/business/CorporatePayouts";
import SecuritySection from "../components/security/SecuritySection";
import HowItWorks from "../components/how-it-works/HowItWorks";
import CountriesSection from "../components/countries/CountriesSection";
import LiveRates from "../components/rates/LiveRates";
import FAQSection from "../components/faq/FAQSection";
import StatisticsSection from "../components/statistics/StatisticsSection";
import NewsSection from "../components/news/NewsSection";
import ContactCTA from "../components/contact/ContactCTA";
import Reveal from "../components/ui/Reveal";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Что такое Nexora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nexora — это инфраструктурная платформа выплат крипто-в-банк для физлиц и бизнеса. Мы обеспечиваем выплаты поставщикам, подрядчикам и корпоративные B2B-расчёты по странам СНГ.",
      },
    },
    {
      "@type": "Question",
      name: "Какие криптовалюты поддерживаются?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nexora поддерживает USDT, BTC, ETH, TON, TRX, USDC и LTC.",
      },
    },
    {
      "@type": "Question",
      name: "Какие страны поддерживаются?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Россия (RUB), Казахстан (KZT), Узбекистан (UZS), Азербайджан (AZN) и Кыргызстан (KGS).",
      },
    },
    {
      "@type": "Question",
      name: "Можно ли оплачивать поставщиков криптовалютой через Nexora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. Nexora обрабатывает выплаты поставщикам через механизм крипто-в-банк: вы отправляете USDT, получатель получает средства в местной валюте на банковский счёт.",
      },
    },
    {
      "@type": "Question",
      name: "Сколько времени занимает обработка выплаты?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Большинство выплат обрабатываются в течение 15 минут. Время зависит от страны и способа выплаты.",
      },
    },
    {
      "@type": "Question",
      name: "Проверяются ли транзакции на AML-риски?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. Все транзакции проходят AML-мониторинг и KYB-верификацию. Nexora соответствует требованиям FATF, OFAC и EU 6AMLD.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <Reveal>
          <LiveCalculator />
        </Reveal>
        <div id="business" className="scroll-mt-20">
          <Reveal>
            <BusinessSolutions />
          </Reveal>
        </div>
        <Reveal>
          <CorporatePayouts />
        </Reveal>
        <Reveal>
          <SecuritySection />
        </Reveal>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <div id="countries" className="scroll-mt-20">
          <Reveal>
            <CountriesSection />
          </Reveal>
        </div>
        <div id="rates" className="scroll-mt-20">
          <Reveal>
            <LiveRates />
          </Reveal>
        </div>
        <div id="faq" className="scroll-mt-20">
          <Reveal>
            <FAQSection />
          </Reveal>
        </div>
        <Reveal>
          <StatisticsSection />
        </Reveal>
        <Reveal>
          <NewsSection />
        </Reveal>
        <Reveal>
          <ContactCTA />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}