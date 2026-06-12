import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/hero/HeroSection";
import LiveCalculator from "../components/calculator/LiveCalculator";
import BusinessSolutions from "../components/business/BusinessSolutions";
import CorporatePayouts from "../components/business/CorporatePayouts";
import HowItWorks from "../components/how-it-works/HowItWorks";
import CountriesSection from "../components/countries/CountriesSection";
import LiveRates from "../components/rates/LiveRates";
import FAQSection from "../components/faq/FAQSection";
import StatisticsSection from "../components/statistics/StatisticsSection";
import NewsSection from "../components/news/NewsSection";
import ContactCTA from "../components/contact/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LiveCalculator />
        <div id="business" className="scroll-mt-20">
          <BusinessSolutions />
        </div>
        <CorporatePayouts />
        <HowItWorks />
        <div id="countries" className="scroll-mt-20">
          <CountriesSection />
        </div>
        <div id="rates" className="scroll-mt-20">
          <LiveRates />
        </div>
        <div id="faq" className="scroll-mt-20">
          <FAQSection />
        </div>
        <StatisticsSection />
        <NewsSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}