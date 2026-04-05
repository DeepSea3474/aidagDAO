import Link from "next/link";
import { DAO_COINS, MAX_SUPPLY } from "../lib/config";
import { formatNumber } from "../lib/utils";

export default function GovernanceSection() {
  const governanceFeatures = [
    {
      icon: "🏛️",
      title: "Tam Otonom DAO",
      description: "Tüm kararlar SoulwareAI tarafından değerlendirilir ve yürütülür. İnsan müdahalesi yoktur.",
      color: "cyan"
    },
    {
      icon: "🗳️",
      title: "Şeffaf Oylama",
      description: "Token sahipleri teklifler için oy kullanır. Tüm oylar blockchain üzerinde kayıtlıdır.",
      color: "purple"
    },
    {
      icon: "⚡",
      title: "Akıllı Yürütme",
      description: "Onaylanan teklifler otomatik olarak akıllı kontratlar aracılığıyla uygulanır.",
      color: "yellow"
    },
    {
      icon: "🔒",
      title: "Quantum Güvenlik",
      description: "Gelecek nesil şifreleme ile tüm yönetişim işlemleri korunur.",
      color: "green"
    }
  ];

  const votingPower = [
    { label: "1 AIDAG", power: "1 Oy", description: "Temel oy hakkı" },
    { label: "1,000 AIDAG", power: "1,000 Oy", description: "Teklif oluşturma hakkı" },
    { label: "10,000 AIDAG", power: "10,000 Oy", description: "Öncelikli değerlendirme" },
    { label: "100,000 AIDAG", power: "100,000 Oy", description: "Konsül üyeliği" }
  ];

  const proposalTypes = [
    { type: "Teknik", icon: "⚙️", description: "Protokol güncellemeleri, akıllı kontrat değişiklikleri" },
    { type: "Ekonomik", icon: "💰", description: "Tokenomics, ücretler, ödül dağılımları" },
    { type: "Topluluk", icon: "👥", description: "Pazarlama, ortaklıklar, etkinlikler" },
    { type: "Acil", icon: "🚨", description: "Güvenlik yamaları, kritik düzeltmeler" }
  ];

  const getColorClass = (color) => {
    const colors = {
      cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400",
      purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
      yellow: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
      green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400"
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-sm px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            DAO Yönetişimi
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Tam Otonom Yönetişim
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AIDAG Chain, SoulwareAI tarafından tamamen otonom yönetilen ilk blockchain projesidir.
            <span className="block mt-2 text-yellow-400 font-semibold">Kurucu müdahalesi yok • İnsan müdahalesi yok</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {governanceFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${getColorClass(feature.color)} border rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="card-neon p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Oy Gücü Sistemi</h3>
                <p className="text-gray-400 text-sm">1 AIDAG = 1 Oy</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {votingPower.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">{item.power}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-neon p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Teklif Türleri</h3>
                <p className="text-gray-400 text-sm">SoulwareAI değerlendirmesi</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {proposalTypes.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="text-white font-semibold mb-1">{item.type}</h4>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-neon p-6 md:p-8 mb-12 md:mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Yönetişim Süreci</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Teklif", desc: "DAO üyesi teklif oluşturur", icon: "✏️" },
              { step: 2, title: "Değerlendirme", desc: "SoulwareAI analiz eder", icon: "🤖" },
              { step: 3, title: "Oylama", desc: "Token sahipleri oy kullanır", icon: "🗳️" },
              { step: 4, title: "Onay", desc: "Çoğunluk sağlanırsa onay", icon: "✅" },
              { step: 5, title: "Yürütme", desc: "Otomatik uygulama", icon: "⚡" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700 hover:border-cyan-500/50 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    {item.step}
                  </div>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-cyan-500/50 text-xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🏦</div>
            <p className="text-gray-400 text-sm mb-2">DAO Hazinesi</p>
            <p className="text-3xl font-bold text-cyan-400" suppressHydrationWarning>{formatNumber(DAO_COINS)}</p>
            <p className="text-gray-500 text-xs mt-1">AIDAG</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-400 text-sm mb-2">Yönetişim Oranı</p>
            <p className="text-3xl font-bold text-purple-400">%85.7</p>
            <p className="text-gray-500 text-xs mt-1">Toplam Arzın</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🔐</div>
            <p className="text-gray-400 text-sm mb-2">Kurucu Kilidi</p>
            <p className="text-3xl font-bold text-green-400">1 Yıl</p>
            <p className="text-gray-500 text-xs mt-1">Tam Kilit</p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/dao" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            <span>🏛️</span>
            DAO'ya Katıl
            <span>→</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4">Üyelik ücreti: $5 • Teklif ve oylama hakları</p>
        </div>
      </div>
    </section>
  );
}
