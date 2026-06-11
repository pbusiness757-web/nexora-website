import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/hero/HeroSection";
import LiveCalculator from "../components/calculator/LiveCalculator";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LiveCalculator />
      </main>
      <Footer />
    </>
  );
}