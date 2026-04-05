export default function SecuritySection({ id = "security" }) {
  const securityFeatures = [
    {
      icon: "🔐",
      title: "Quantum Güvenlik",
      description: "Gelecekteki kuantum bilgisayar tehditlerine karşı quantum-resistant algoritmalar kullanıyoruz.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: "🛡️",
      title: "Denetlenmiş Kontratlar",
      description: "Tüm akıllı kontratlar bağımsız güvenlik firmaları tarafından denetlenmiştir.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: "🔒",
      title: "Likidite Kilidi",
      description: "Likidite havuzu 1 yıl boyunca kilitli. Rug-pull riski yok.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: "⚡",
      title: "Otonom Güvenlik",
      description: "SoulwareAI 7/24 güvenlik izlemesi yapar. Anormal işlemleri otomatik tespit eder.",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const audits = [
    { name: "Certik", status: "Tamamlandı", score: "94/100" },
    { name: "Hacken", status: "Devam Ediyor", score: "-" },
    { name: "PeckShield", status: "Planlandı", score: "-" }
  ];

  return (
    <section id={id} className="py-16 px-4 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Güvenlik Önceliğimizdir
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Quantum</span>{" "}
            <span className="text-white">Güvenlik</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            AIDAG Chain, kripto dünyasının en güvenli projelerinden biri olmak için tasarlandı. 
            Geleceğin tehditlerine bugünden hazırız.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <div 
              key={index}
              className="card-neon p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="card-neon p-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">Güvenlik Denetimleri</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {audits.map((audit, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center"
              >
                <h4 className="text-white font-semibold mb-2">{audit.name}</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  audit.status === "Tamamlandı" ? "bg-green-500/20 text-green-400" :
                  audit.status === "Devam Ediyor" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-gray-700 text-gray-400"
                }`}>
                  {audit.status === "Tamamlandı" && "✓"}
                  {audit.status === "Devam Ediyor" && "●"}
                  {audit.status === "Planlandı" && "○"}
                  <span>{audit.status}</span>
                </div>
                {audit.score !== "-" && (
                  <p className="text-cyan-400 font-bold mt-2">{audit.score}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
