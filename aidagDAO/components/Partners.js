const ChainSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="pch-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0B90B" /><stop offset="100%" stopColor="#F8D12F" /></linearGradient></defs>
    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="url(#pch-g)" opacity="0.15" stroke="#F0B90B" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 7l3 2v4l-3 2-3-2V9l3-2z" fill="#F0B90B" opacity="0.6" />
  </svg>
);

const DiamondSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="pdm-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#627EEA" /><stop offset="100%" stopColor="#3B5998" /></linearGradient></defs>
    <path d="M12 2l7 10-7 4-7-4 7-10z" fill="url(#pdm-g)" opacity="0.2" stroke="#627EEA" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 16l7-4-7 10-7-10 7 4z" fill="url(#pdm-g)" opacity="0.35" stroke="#627EEA" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const SwapSvg = ({ className = "w-8 h-8", color = "#06b6d4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
    <path d="M8 10l4-3 4 3M16 14l-4 3-4-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChartSvg = ({ className = "w-8 h-8", color = "#22c55e" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="14" width="4" height="7" rx="1" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <rect x="10" y="9" width="4" height="12" rx="1" stroke={color} strokeWidth="1.5" opacity="0.7" />
    <rect x="17" y="4" width="4" height="17" rx="1" stroke={color} strokeWidth="1.5" opacity="0.9" />
  </svg>
);

const ShieldSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="psh-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
    <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" fill="url(#psh-g)" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 12l3 3 5-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LinkSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="plk-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="url(#plk-g)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="url(#plk-g)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const XSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="white" />
  </svg>
);

const TelegramSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ptg-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2AABEE" /><stop offset="100%" stopColor="#229ED9" /></linearGradient></defs>
    <circle cx="12" cy="12" r="10" fill="url(#ptg-g)" opacity="0.15" />
    <path d="M5 12l2.5 1.5L9 17l3-4 5-3-12 4.5z" fill="#2AABEE" opacity="0.8" />
    <path d="M9 17l.5-3.5 7.5-6.5-8 8z" fill="#2AABEE" opacity="0.6" />
  </svg>
);

const DiscordSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="pdc-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5865F2" /><stop offset="100%" stopColor="#7289DA" /></linearGradient></defs>
    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 00-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 00-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.02.03.05.03.07.02 1.72-.53 3.45-1.33 5.24-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" fill="url(#pdc-g)" opacity="0.8" />
  </svg>
);

const MediumSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="7" cy="12" rx="4.5" ry="5" fill="white" opacity="0.8" />
    <ellipse cx="14.5" cy="12" rx="2.5" ry="4.5" fill="white" opacity="0.6" />
    <ellipse cx="20" cy="12" rx="1.5" ry="4" fill="white" opacity="0.4" />
  </svg>
);

const partnerIcons = {
  "Binance Smart Chain": <ChainSvg />,
  "Ethereum": <DiamondSvg />,
  "PancakeSwap": <SwapSvg color="#D4A017" />,
  "Uniswap": <SwapSvg color="#FF007A" />,
  "CoinGecko": <ChartSvg color="#8CC63F" />,
  "CoinMarketCap": <ChartSvg color="#3861FB" />,
  "Certik": <ShieldSvg />,
  "Chainlink": <LinkSvg />
};

const socialIcons = {
  "Twitter": <XSvg />,
  "Telegram": <TelegramSvg />,
  "Discord": <DiscordSvg />,
  "Medium": <MediumSvg />
};

export default function Partners() {
  const partners = [
    { name: "Binance Smart Chain", type: "Blockchain" },
    { name: "Ethereum", type: "Blockchain" },
    { name: "PancakeSwap", type: "DEX" },
    { name: "Uniswap", type: "DEX" },
    { name: "CoinGecko", type: "Tracking" },
    { name: "CoinMarketCap", type: "Tracking" },
    { name: "Certik", type: "Security" },
    { name: "Chainlink", type: "Oracle" }
  ];

  const socialLinks = [
    { name: "Twitter", url: "#", followers: "25K+" },
    { name: "Telegram", url: "#", followers: "18K+" },
    { name: "Discord", url: "#", followers: "12K+" },
    { name: "Medium", url: "#", followers: "5K+" }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Partners</span>{" "}
            <span className="text-white">& Community</span>
          </h2>
          <p className="text-gray-400">Strong ecosystem partnerships</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/30 rounded-xl p-4 text-center transition-all duration-300 group"
            >
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                {partnerIcons[partner.name]}
              </div>
              <h3 className="text-white font-semibold text-sm">{partner.name}</h3>
              <p className="text-xs text-gray-500">{partner.type}</p>
            </div>
          ))}
        </div>

        <div className="card-neon p-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">Join Our Community</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gradient-to-br hover:from-cyan-600/20 hover:to-purple-600/20 border border-gray-700 hover:border-cyan-500/50 rounded-xl p-4 text-center transition-all duration-300 group"
              >
                <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                  {socialIcons[social.name]}
                </div>
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
