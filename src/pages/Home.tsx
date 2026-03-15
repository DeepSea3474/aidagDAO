import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Tokenomics from "@/components/Tokenomics";
import SoulwareSection from "@/components/SoulwareSection";
import Roadmap from "@/components/Roadmap";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-white">
      <Navigation />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Tokenomics />
        <SoulwareSection />
        <Roadmap />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
