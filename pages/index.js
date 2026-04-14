import Layout from "../components/Layout";
import Header from "../components/Header";
import Features from "../components/Features";
import LiveStats from "../components/LiveStats";
import SecuritySection from "../components/SecuritySection";
import SoulwareSection from "../components/SoulwareSection";
import Partners from "../components/Partners";
import SmartAssistant from "../components/SmartAssistant";

export default function Home() {
  return (
    <Layout>
      {/* Sitenin profesyonel giriş bölümü */}
      <Header />
      
      <div className="space-y-24 pb-20">
        {/* Canlı blockchain verileri */}
        <LiveStats />
        
        {/* Teknik özellikler ve Aidag-Chain mekaniği */}
        <Features />
        
        {/* Yapay zeka ve Soulware entegrasyonu */}
        <SoulwareSection />
        
        {/* Güvenlik katmanı */}
        <SecuritySection />
        
        {/* Partnerler ve Ekosistem */}
        <Partners />
      </div>

      {/* Akıllı asistan - Gerçek fonksiyonellik */}
      <SmartAssistant />
    </Layout>
  );
}
