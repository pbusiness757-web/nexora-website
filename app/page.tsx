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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LiveCalculator />
        <BusinessSolutions />
        <CorporatePayouts />
        <HowItWorks />
        <CountriesSection />
        <LiveRates />
        <FAQSection />
        <StatisticsSection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}