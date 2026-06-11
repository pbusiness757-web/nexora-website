import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/hero/HeroSection";
import LiveCalculator from "../components/calculator/LiveCalculator";
import BusinessSolutions from "../components/business/BusinessSolutions";
import CorporatePayouts from "../components/business/CorporatePayouts";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LiveCalculator />
        <BusinessSolutions />
        <CorporatePayouts />
      </main>
      <Footer />
    </>
  );
}