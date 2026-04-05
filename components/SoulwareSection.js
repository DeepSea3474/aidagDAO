import { useState } from "react";
import Image from "next/image";

export default function SoulwareSection({ onOpenChat, id = "soulware" }) {
  const features = [
    {
      icon: "🧠",
      title: "Tam Otonom Yonetim",
      description: "Token dagitimi, likidite yonetimi ve DAO kararlari SoulwareAI tarafindan otonom olarak yurutulur."
    },
    {
      icon: "💬",
      title: "7/24 AI Asistan",
      description: "Sorularinizi yanitlar, AIDAG hakkinda bilgi verir ve size rehberlik eder."
    },
    {
      icon: "🔐",
      title: "Guvenlik Izlemesi",
      description: "Anormal islemleri tespit eder, guvenlik protokollerini otonom olarak uygular."
    },
    {
      icon: "📊",
      title: "Akilli Karar Alma",
      description: "Piyasa verilerini analiz eder, topluluk oylamalarini yonetir ve optimal kararlar alir."
    }
  ];

  const stats = [
    { label: "Aktif Sure", value: "24/7", color: "text-green-400" },
    { label: "Islem Suresi", value: "<1s", color: "text-cyan-400" },
    { label: "Dogruluk", value: "99.9%", color: "text-purple-400" },
    { label: "Mudahale", value: "0", color: "text-yellow-400" }
  ];

  return (
    <section id={id} className="py-20 px-4 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-cyan-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Aktif & Cevrimici
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="logo-aidag">Soulware</span>
            <span className="text-white">AI</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Kripto tarihinin ilk tam otonom yapay zeka yoneticisi.
            <br/>
            <span className="text-cyan-400 font-semibold">Kurucu mudahalesi YOK</span> • <span className="text-purple-400 font-semibold">Insan mudahalesi YOK</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="relative">
            <div className="card-neon p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Image 
                    src="/soulwareai.jpeg" 
                    alt="SoulwareAI" 
                    width={80} 
                    height={80} 
                    className="rounded-xl border-2 border-cyan-500/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">SoulwareAI</h3>
                  <p className="text-cyan-400">Otonom Yonetici</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">
                      "Merhaba! Ben SoulwareAI. AIDAG Chain'in tum operasyonlarini otonom olarak yonetiyorum. 
                      Sorulariniz icin benimle sohbet edebilirsiniz."
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Simdi aktif</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={onOpenChat}
                className="w-full neon-button-purple text-lg py-4 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">💬</span>
                SoulwareAI ile Konus
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/30 rounded-xl p-4 flex items-start gap-4 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="card-neon p-4 text-center"
            >
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
