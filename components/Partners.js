export default function Partners() {
  const partners = [
    { name: "Binance Smart Chain", icon: "⛓️", type: "Blockchain" },
    { name: "Ethereum", icon: "💎", type: "Blockchain" },
    { name: "PancakeSwap", icon: "🥞", type: "DEX" },
    { name: "Uniswap", icon: "🦄", type: "DEX" },
    { name: "CoinGecko", icon: "🦎", type: "Tracking" },
    { name: "CoinMarketCap", icon: "📊", type: "Tracking" },
    { name: "Certik", icon: "🛡️", type: "Security" },
    { name: "Chainlink", icon: "🔗", type: "Oracle" }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", url: "#", followers: "25K+" },
    { name: "Telegram", icon: "✈️", url: "#", followers: "18K+" },
    { name: "Discord", icon: "💬", url: "#", followers: "12K+" },
    { name: "Medium", icon: "📝", url: "#", followers: "5K+" }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Partnerler</span>{" "}
            <span className="text-white">& Topluluk</span>
          </h2>
          <p className="text-gray-400">Güçlü ekosistem ortaklıkları</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/30 rounded-xl p-4 text-center transition-all duration-300 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{partner.icon}</div>
              <h3 className="text-white font-semibold text-sm">{partner.name}</h3>
              <p className="text-xs text-gray-500">{partner.type}</p>
            </div>
          ))}
        </div>

        <div className="card-neon p-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">Topluluğumuza Katılın</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gradient-to-br hover:from-cyan-600/20 hover:to-purple-600/20 border border-gray-700 hover:border-cyan-500/50 rounded-xl p-4 text-center transition-all duration-300 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{social.icon}</div>
                <h4 className="text-white font-semibold">{social.name}</h4>
                <p className="text-cyan-400 text-sm">{social.followers}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
