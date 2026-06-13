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

export default function HomePage() {
  return (
    <>
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