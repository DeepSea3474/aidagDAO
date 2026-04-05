import { useState } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import WalletModal from "../components/WalletModal";
import ChainToggle from "../components/ChainToggle";
import SoulwareChat, { ChatButton } from "../components/SoulwareChat";
import LiveStats from "../components/LiveStats";
import Roadmap from "../components/Roadmap";
import FAQ from "../components/FAQ";
import Partners from "../components/Partners";
import SecuritySection from "../components/SecuritySection";
import ContractAddresses from "../components/ContractAddresses";
import SoulwareSection from "../components/SoulwareSection";
import GovernanceSection from "../components/GovernanceSection";
import { 
  MAX_SUPPLY, FOUNDER_COINS, DAO_COINS, 
  PRESALE_STAGE1_PRICE, PRESALE_STAGE2_PRICE, LISTING_PRICE, 
  TOKEN_ADDRESS, DAO_WALLET, FOUNDER_WALLET,
  BSCSCAN_ADDRESS_URL, CHAINS,
  REVENUE_FOUNDER_PERCENT, REVENUE_LIQUIDITY_PERCENT,
  DAO_MEMBERSHIP_FEE
} from "../lib/config";
import { formatNumber } from "../lib/utils";
import { getSigner } from "../lib/provider";
import { parseError } from "../lib/errors";

const BNB_USD_PRICE = 600;

export default function Home() {
  const { t } = useTranslation();
  const [walletAddress, setWalletAddress] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDaoModal, setShowDaoModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [daoJoined, setDaoJoined] = useState(false);
  const [daoLoading, setDaoLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState("bsc");

  const tokensToReceive = amount ? (parseFloat(amount) * BNB_USD_PRICE / PRESALE_STAGE1_PRICE).toFixed(2) : "0";

  function handleConnected(address, walletType) {
    setWalletAddress(address);
    setConnectedWallet(walletType);
    if (address && !daoJoined) {
      setShowDaoModal(true);
    }
  }

  async function joinDAO() {
    if (!walletAddress || !FOUNDER_WALLET) return;
    setDaoLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      const feeInBNB = (DAO_MEMBERSHIP_FEE / BNB_USD_PRICE).toFixed(6);
      const tx = await signer.sendTransaction({
        to: FOUNDER_WALLET,
        value: ethers.parseEther(feeInBNB),
        gasLimit: 50000
      });
      await tx.wait();
      setDaoJoined(true);
      setShowDaoModal(false);
      setSuccess("DAO uyesi oldunuz!");
    } catch (err) {
      setError(parseError(err).message);
    }
    setDaoLoading(false);
  }

  async function buyTokens() {
    if (!walletAddress || !amount || parseFloat(amount) <= 0) {
      setError("Lutfen cuzdan baglayın ve miktar girin");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      const founderAmount = ethers.parseEther((parseFloat(amount) * 0.6).toFixed(6));
      const liquidityAmount = ethers.parseEther((parseFloat(amount) * 0.4).toFixed(6));
      
      const tx1 = await signer.sendTransaction({ to: FOUNDER_WALLET, value: founderAmount, gasLimit: 50000 });
      await tx1.wait();
      const tx2 = await signer.sendTransaction({ to: DAO_WALLET, value: liquidityAmount, gasLimit: 50000 });
      await tx2.wait();
      
      setSuccess(`${formatNumber(parseFloat(tokensToReceive))} AIDAG satin alindi!`);
      setAmount("");
    } catch (err) {
      setError(parseError(err).message);
    }
    setLoading(false);
  }

  const walletIcons = {
    metamask: "🦊",
    trustwallet: "🛡️",
    coinbase: "💰",
    walletconnect: "🔗"
  };

  return (
    <Layout>
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)}
        onConnected={handleConnected}
        selectedChain={selectedChain}
      />

      {showDaoModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-purple-500/20">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🏛️</div>
              <h2 className="text-2xl font-bold text-white mb-2">DAO'ya Katil</h2>
              <p className="text-gray-400 text-sm">Teklif olustur, oyla ve SoulwareAI ile etkilesime gec</p>
            </div>
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-4 mb-6 text-center">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">${DAO_MEMBERSHIP_FEE}</p>
              <p className="text-gray-500 text-xs mt-1">Transferred to founder wallet</p>
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowDaoModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition-all">
                Atla
              </button>
              <button onClick={joinDAO} disabled={daoLoading} className="flex-1 neon-button-purple">
                {daoLoading ? "..." : "Katil"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative py-12 px-4 overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-purple-900/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "2s"}}></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-center mb-6">
            <ChainToggle selectedChain={selectedChain} onChainChange={setSelectedChain} />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/40 text-cyan-400 text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              A First in Crypto History
            </div>
            
            <div className="hero-logo-container">
              <div className="relative flex-shrink-0">
                <Image 
                  src="/aidag-logo.jpg" 
                  alt="AIDAG Logo" 
                  width={80} 
                  height={80} 
                  priority
                  className="hero-logo-img rounded-full border-2 border-cyan-500/50"
                  style={{ boxShadow: '0 0 30px rgba(0, 191, 255, 0.5)' }}
                />
              </div>
              <div className="hero-title-wrapper tech-beam-container">
                <span className="hero-aidag">AIDAG</span>
                <span className="hero-chain">CHAIN</span>
                <div className="tech-beam"></div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white mb-3">
              First AI-Managed Cryptocurrency
            </p>
            
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              <span className="text-yellow-400 font-bold">NO FOUNDER INTERVENTION</span> • <span className="text-cyan-400 font-bold">NO HUMAN INTERVENTION</span>
              <br/>Quantum secure, fully autonomous blockchain
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {Object.values(CHAINS).filter(c => c.active).map(chain => (
                <span key={chain.id} className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
                  (chain.id === 56 && selectedChain === "bsc") || (chain.id === 1 && selectedChain === "eth")
                    ? "bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-400"
                    : "bg-gray-800/80 border border-gray-700 text-gray-400"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    (chain.id === 56 && selectedChain === "bsc") || (chain.id === 1 && selectedChain === "eth")
                      ? "bg-green-400 animate-pulse"
                      : "bg-gray-500"
                  }`}></span>
                  {chain.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-2 sm:p-3 md:p-4 text-center overflow-hidden">
                  <p className="text-xs sm:text-lg md:text-2xl font-black text-cyan-400 whitespace-nowrap">21M</p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Total Supply</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-2 sm:p-3 md:p-4 text-center overflow-hidden">
                  <p className="text-xs sm:text-lg md:text-2xl font-black text-green-400 whitespace-nowrap">+54%</p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Potential Profit</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-2 sm:p-3 md:p-4 text-center overflow-hidden">
                  <p className="text-xs sm:text-lg md:text-2xl font-black text-purple-400 whitespace-nowrap">2</p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Blockchains</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button onClick={() => setShowChat(true)} className="neon-button-purple flex items-center justify-center gap-2 text-sm md:text-base">
                  <span>🤖</span> Chat with SoulwareAI
                </button>
                <Link href="/dao" className="neon-button-green flex items-center justify-center gap-2 text-sm md:text-base">
                  <span>🏛️</span> Join DAO
                </Link>
              </div>
            </div>

            <div className="card-neon p-4 md:p-6 lg:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  LIVE
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">Presale</h2>
                <p className="text-cyan-400">2-Stage Sale</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Stage 1</span>
                  <span>Stage 2</span>
                  <span>Listing</span>
                </div>
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-cyan-500/30">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: "35%", boxShadow: "0 0 20px #06b6d4, 0 0 40px #06b6d4, 0 0 60px #0ea5e9" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-cyan-400 font-bold">${PRESALE_STAGE1_PRICE}</span>
                  <span className="text-blue-400 font-bold">${PRESALE_STAGE2_PRICE}</span>
                  <span className="text-green-400 font-bold">${LISTING_PRICE}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 rounded-xl p-4 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 animate-pulse"></div>
                  <div className="absolute top-1 right-1">
                    <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">AKTIF</span>
                  </div>
                  <p className="text-xs text-gray-300 mb-1 font-semibold">Stage 1</p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400" style={{ textShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}>${PRESALE_STAGE1_PRICE}</p>
                  <p className="text-xs text-green-400 mt-1">+{((LISTING_PRICE/PRESALE_STAGE1_PRICE - 1) * 100).toFixed(0)}% kazanc</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-600/50 rounded-xl p-4 text-center opacity-70">
                  <div className="absolute top-1 right-1">
                    <span className="bg-gray-600 text-gray-300 text-[10px] px-2 py-0.5 rounded-full font-bold">YAKINDA</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold">Stage 2</p>
                  <p className="text-3xl font-black text-gray-400">${PRESALE_STAGE2_PRICE}</p>
                  <p className="text-xs text-gray-500 mt-1">+{((LISTING_PRICE/PRESALE_STAGE2_PRICE - 1) * 100).toFixed(0)}% kazanc</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-3 mb-6 text-center">
                <p className="text-xs text-gray-400">Listeleme Fiyati</p>
                <p className="text-2xl font-bold text-green-400">${LISTING_PRICE}</p>
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm block mb-2">Miktar ({selectedChain === "bsc" ? "BNB" : "ETH"})</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-gray-700 focus:border-cyan-500 rounded-xl px-4 py-4 text-white text-lg outline-none transition-all pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    {selectedChain === "bsc" ? "BNB" : "ETH"}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/30 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alacaginiz:</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" suppressHydrationWarning>
                    {formatNumber(parseFloat(tokensToReceive))} AIDAG
                  </span>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-900/20 p-3 rounded-lg border border-red-500/30">{error}</p>}
              {success && <p className="text-green-400 text-sm text-center mb-4 bg-green-900/20 p-3 rounded-lg border border-green-500/30">{success}</p>}

              {walletAddress ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                    <span className="text-2xl">{walletIcons[connectedWallet] || "🔗"}</span>
                    <span className="text-cyan-400 font-mono">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</span>
                    {daoJoined && <span className="text-purple-400 text-sm ml-2">✓ DAO</span>}
                  </div>
                  <button
                    onClick={buyTokens}
                    disabled={loading || !amount}
                    className="w-full neon-button-cyan text-lg py-4 disabled:opacity-50"
                  >
                    {loading ? "Isleniyor..." : "Simdi Satin Al"}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowWalletModal(true)}
                  className="w-full neon-button-cyan text-lg py-4"
                >
                  Cuzdan Bagla
                </button>
              )}

              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-400">%{REVENUE_FOUNDER_PERCENT} Founder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-gray-400">%{REVENUE_LIQUIDITY_PERCENT} Likidite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <a 
              href={`https://bscscan.com/token/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-neon p-4 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📜</span>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">Token Kontrati</h4>
                  <p className="text-xs text-gray-500">BSC Mainnet</p>
                </div>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <code className="text-cyan-400 text-xs font-mono block truncate">{TOKEN_ADDRESS || "Yakin zamanda"}</code>
            </a>

            <a 
              href={`https://bscscan.com/address/${FOUNDER_WALLET}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-neon p-4 hover:border-yellow-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">Founder Wallet</h4>
                  <p className="text-xs text-gray-500">%60 Gelir</p>
                </div>
                <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <code className="text-yellow-400 text-xs font-mono block truncate">{FOUNDER_WALLET || "Yakin zamanda"}</code>
            </a>

            <a 
              href={`https://bscscan.com/address/${DAO_WALLET}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-neon p-4 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏛️</span>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">DAO Cuzdani</h4>
                  <p className="text-xs text-gray-500">%40 Likidite</p>
                </div>
                <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <code className="text-purple-400 text-xs font-mono block truncate">{DAO_WALLET || "Yakin zamanda"}</code>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quantum Guvenlik</h3>
              <p className="text-gray-400 text-sm">Kuantum bilgisayarlara karsi dayanikli koruma</p>
            </div>
            
            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-purple-500 to-pink-600">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fully Autonomous</h3>
              <p className="text-gray-400 text-sm">SoulwareAI tarafindan yonetilir</p>
            </div>
            
            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-green-500 to-emerald-600">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Chain</h3>
              <p className="text-gray-400 text-sm">BSC + Ethereum es zamanli</p>
            </div>
            
            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-yellow-500 to-orange-600">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">DAO Yonetisim</h3>
              <p className="text-gray-400 text-sm">Topluluk odakli kararlar</p>
            </div>
          </div>
        </div>
      </section>

      <LiveStats />

      <SoulwareSection onOpenChat={() => setShowChat(true)} />

      <GovernanceSection />

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="logo-aidag">Autonomous</span>{" "}
              <span className="text-white">Yonetim</span>
            </h2>
            <p className="text-gray-400">SoulwareAI tam kontrol, insan mudahalesi yok</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-neon p-6 hover:border-green-500/50 transition-colors">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">✓</span> SoulwareAI Autonomous Management
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                  Autonomous token distribution
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                  Autonomous development
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                  Autonomous liquidity management
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">✓</span>
                  Autonomous DAO execution
                </li>
              </ul>
            </div>
            
            <div className="card-neon p-6 hover:border-red-500/50 transition-colors">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">✕</span> Insan Mudahalesi YOK
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">✕</span>
                  No founder intervention
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">✕</span>
                  Manuel islem yok
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">✕</span>
                  Kural degisikligi yok
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">✕</span>
                  Merkezi kontrol yok
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            <span className="logo-aidag">Token</span>{" "}
            <span className="text-white">Ekonomisi</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="stats-card hover:border-cyan-500/50 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💎</div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 whitespace-nowrap" suppressHydrationWarning>
                21,000,000
              </p>
              <p className="text-sm sm:text-base text-gray-400">Maximum Supply</p>
            </div>
            <div className="stats-card hover:border-yellow-500/50 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔒</div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 whitespace-nowrap" suppressHydrationWarning>
                3,001,000
              </p>
              <p className="text-sm sm:text-base text-gray-400">Founder (1 Year Locked)</p>
            </div>
            <div className="stats-card hover:border-purple-500/50 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏛️</div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 whitespace-nowrap" suppressHydrationWarning>
                17,999,000
              </p>
              <p className="text-sm sm:text-base text-gray-400">DAO + SoulwareAI</p>
            </div>
          </div>
        </div>
      </section>

      <SecuritySection />
      <ContractAddresses />
      <Roadmap />
      <FAQ />
      <Partners />

      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-purple-900/20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the Autonomous Future
          </h2>
          <p className="text-xl text-gray-400 mb-8">Kripto tarihinin ilk tam otonom ekosistemi</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowWalletModal(true)} className="neon-button-cyan text-lg px-8 py-4">
              Cuzdan Bagla & Satin Al
            </button>
            <button onClick={() => setShowChat(true)} className="neon-button-purple text-lg px-8 py-4">
              SoulwareAI ile Konus
            </button>
          </div>
        </div>
      </section>

      <SoulwareChat isOpen={showChat} onClose={() => setShowChat(false)} />
      {!showChat && <ChatButton onClick={() => setShowChat(true)} />}
    </Layout>
  );
}
