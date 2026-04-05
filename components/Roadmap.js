export default function Roadmap({ id = "roadmap" }) {
  const phases = [
    {
      phase: "Q1 2025",
      title: "Başlangıç",
      status: "completed",
      items: [
        "AIDAG Chain konsept geliştirme",
        "SoulwareAI entegrasyonu",
        "Smart contract geliştirme",
        "Web sitesi lansmanı"
      ]
    },
    {
      phase: "Q2 2025",
      title: "Ön Satış",
      status: "active",
      items: [
        "Ön satış Stage 1 başlangıcı",
        "DAO üyelik sistemi",
        "Topluluk büyümesi",
        "Güvenlik denetimleri"
      ]
    },
    {
      phase: "Q3 2025",
      title: "Listeleme",
      status: "upcoming",
      items: [
        "PancakeSwap listeleme",
        "Uniswap listeleme",
        "CEX görüşmeleri",
        "Likidite kilitleme"
      ]
    },
    {
      phase: "Q4 2025",
      title: "Genişleme",
      status: "upcoming",
      items: [
        "DAO tam aktivasyon",
        "Cross-chain köprüler",
        "Staking platformu",
        "Mobil uygulama"
      ]
    }
  ];

  return (
    <section id={id} className="py-16 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Yol</span>{" "}
            <span className="text-white">Haritası</span>
          </h2>
          <p className="text-gray-400">AIDAG Chain geliştirme planı</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-gray-700 transform -translate-x-1/2"></div>
          
          <div className="space-y-8 md:space-y-0">
            {phases.map((phase, index) => (
              <div key={index} className={`relative md:flex items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-6 h-6 rounded-full border-4 ${
                    phase.status === "completed" ? "bg-green-500 border-green-400" :
                    phase.status === "active" ? "bg-cyan-500 border-cyan-400 animate-pulse" :
                    "bg-gray-700 border-gray-600"
                  }`}></div>
                </div>
                
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className={`card-neon p-6 ${
                    phase.status === "active" ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20" : ""
                  }`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      phase.status === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                      phase.status === "active" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                      "bg-gray-700/50 text-gray-400 border border-gray-600"
                    }`}>
                      {phase.status === "completed" && "✓ Tamamlandı"}
                      {phase.status === "active" && "● Aktif"}
                      {phase.status === "upcoming" && "○ Yakında"}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1">{phase.phase}</h3>
                    <h4 className="text-lg text-cyan-400 mb-4">{phase.title}</h4>
                    
                    <ul className={`space-y-2 text-sm text-gray-400 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 md:justify-start">
                          <span className={
                            phase.status === "completed" ? "text-green-400" :
                            phase.status === "active" ? "text-cyan-400" : "text-gray-600"
                          }>
                            {phase.status === "completed" ? "✓" : "○"}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
