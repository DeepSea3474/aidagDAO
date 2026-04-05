import { useState } from "react";
import { 
  TOKEN_ADDRESS, 
  FOUNDER_WALLET, 
  DAO_WALLET, 
  PRESALE_CONTRACT,
  BSCSCAN_ADDRESS_URL,
  ETHERSCAN_ADDRESS_URL
} from "../lib/config";

function AddressCard({ title, address, icon, description, chain = "bsc" }) {
  const [copied, setCopied] = useState(false);
  
  const explorerUrl = chain === "bsc" 
    ? BSCSCAN_ADDRESS_URL(address) 
    : ETHERSCAN_ADDRESS_URL(address);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  if (!address) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="text-white font-semibold">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <span className="text-gray-500 text-sm">Yakin zamanda duyurulacak</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 rounded-xl p-4 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h4 className="text-white font-semibold">{title}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${address ? "bg-green-400" : "bg-gray-500"}`}></div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-3 mb-3">
        <code className="text-cyan-400 text-xs md:text-sm font-mono break-all">
          {address}
        </code>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={copyAddress}
          className={`flex-1 text-xs py-2 px-3 rounded-lg font-semibold transition-all ${
            copied 
              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {copied ? "✓ Kopyalandi" : "📋 Kopyala"}
        </button>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-xs py-2 px-3 rounded-lg font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-center transition-all"
        >
          🔍 Explorer
        </a>
      </div>
    </div>
  );
}

export default function ContractAddresses() {
  const addresses = [
    {
      title: "Token Kontrati",
      address: TOKEN_ADDRESS,
      icon: "📜",
      description: "AIDAG Token akilli kontrati",
      chain: "bsc"
    },
    {
      title: "Kurucu Cuzdani",
      address: FOUNDER_WALLET,
      icon: "👤",
      description: "On satis gelirlerinin %60'i",
      chain: "bsc"
    },
    {
      title: "DAO / Likidite Cuzdani",
      address: DAO_WALLET,
      icon: "🏛️",
      description: "On satis gelirlerinin %40'i + DAO",
      chain: "bsc"
    },
    {
      title: "On Satis Kontrati",
      address: PRESALE_CONTRACT,
      icon: "💰",
      description: "Presale akilli kontrati",
      chain: "bsc"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-full mb-4">
            <span>✓</span> Tam Seffaflik
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Kontrat</span>{" "}
            <span className="text-white">Adresleri</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tum islemler blockchain uzerinde acik ve dogrulanabilir. 
            Asagidaki adresleri kullanarak islemleri takip edebilirsiniz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {addresses.map((addr, index) => (
            <AddressCard key={index} {...addr} />
          ))}
        </div>

        <div className="card-neon p-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-400 text-sm">Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-gray-400 text-sm">1 Yil Kilitli</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">🔒</span>
              <span className="text-gray-400 text-sm">Denetlenmis Kontratlar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🤖</span>
              <span className="text-gray-400 text-sm">SoulwareAI Yonetiminde</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <a 
            href="https://bscscan.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-yellow-500/30 rounded-xl p-4 flex items-center gap-3 transition-all group"
          >
            <span className="text-3xl">🔶</span>
            <div>
              <h4 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">BscScan</h4>
              <p className="text-xs text-gray-500">BSC Explorer</p>
            </div>
          </a>
          
          <a 
            href="https://etherscan.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/30 rounded-xl p-4 flex items-center gap-3 transition-all group"
          >
            <span className="text-3xl">💎</span>
            <div>
              <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">Etherscan</h4>
              <p className="text-xs text-gray-500">ETH Explorer</p>
            </div>
          </a>
          
          <a 
            href="#" 
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-green-500/30 rounded-xl p-4 flex items-center gap-3 transition-all group"
          >
            <span className="text-3xl">📊</span>
            <div>
              <h4 className="text-white font-semibold group-hover:text-green-400 transition-colors">Denetim Raporu</h4>
              <p className="text-xs text-gray-500">Yakin Zamanda</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
