import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "./Header";
import CryptoTicker from "./CryptoTicker";
import WalletModal from "./WalletModal";
import SoulwareChat, { ChatButton } from "./SoulwareChat";
import { useTranslation } from "react-i18next";
import { TWITTER_URL, TELEGRAM_URL, SITE_URL, TOKEN_ADDRESS, BSCSCAN_ADDRESS_URL, GITHUB_URL } from "../lib/config";

export default function Layout({ children, title = "AIDAG Chain" }) {
  const { t } = useTranslation();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedChain, setSelectedChain] = useState("bsc");
  const [showChat, setShowChat] = useState(false);
  const [founderMode, setFounderMode] = useState(false);
  const [showQuickPresale, setShowQuickPresale] = useState(false);

  useEffect(() => {
    function handleOpenWallet() {
      setShowWalletModal(true);
    }
    window.addEventListener('openWalletModal', handleOpenWallet);
    return () => window.removeEventListener('openWalletModal', handleOpenWallet);
  }, []);

  function handleConnected(address, walletType) {
    setWalletAddress(address);
    setShowWalletModal(false);
  }

  return (
    <>
      <Head>
        <title>{`${title} - Autonomous AI Blockchain`}</title>
        <meta name="description" content="AIDAG Chain - World's first quantum-secure cryptocurrency. Autonomously managed by SoulwareAI with no founder or human intervention. Multi-chain BSC + ETH compatible." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AIDAG Chain - Autonomous AI Blockchain" />
        <meta property="og:description" content="World's first quantum-secure cryptocurrency. AI-managed, no human intervention." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/soulwareai.jpeg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDAG Chain - Autonomous AI Blockchain" />
        <meta name="twitter:description" content="World's first quantum-secure cryptocurrency." />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <div className="min-h-screen bg-black text-white bg-grid">
        <CryptoTicker />
        <Header />

        <WalletModal 
          isOpen={showWalletModal} 
          onClose={() => setShowWalletModal(false)}
          onConnected={handleConnected}
          selectedChain={selectedChain}
        />

        <SoulwareChat 
          isOpen={showChat} 
          onClose={() => setShowChat(false)} 
          founderMode={founderMode} 
          onFounderAuth={setFounderMode} 
        />

        <main>{children}</main>

        <ChatButton onClick={() => setShowChat(true)} founderMode={founderMode} />

        <div className="fixed bottom-28 right-6 z-40 flex flex-col items-center gap-2">
          {showQuickPresale && (
            <div className="quick-presale-panel">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-sm">AIDAG Presale</span>
                </div>
                <button onClick={() => setShowQuickPresale(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-gray-400">Stage 1 Price</span>
                <span className="text-cyan-400 font-bold">$0.078</span>
              </div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-gray-400">Listing Price</span>
                <span className="text-green-400 font-bold">$0.12</span>
              </div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-gray-400">Potential Gain</span>
                <span className="text-green-400 font-bold">+54%</span>
              </div>

              <div className="w-full h-1.5 bg-gray-800 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{ width: '12%' }}></div>
              </div>

              <Link 
                href="/presale" 
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
                }}
                onClick={() => setShowQuickPresale(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t("buyNow", "Buy Now")}
              </Link>

              <button 
                onClick={() => { setShowChat(true); setShowQuickPresale(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 mt-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {t("askSoulware", "Ask SoulwareAI")}
              </button>
            </div>
          )}

          <button 
            onClick={() => setShowQuickPresale(!showQuickPresale)}
            className="presale-fab-btn"
            title="Quick Presale"
          >
            <div className="presale-fab-pulse" />
            <div className="presale-fab-body">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="presale-fab-label">
              <span className="presale-fab-label-dot" />
              PRESALE
            </div>
          </button>
        </div>
        
        <footer className="border-t border-gray-800 py-16 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <img src="/aidag-logo.jpg" alt="AIDAG" className="h-8 w-8 rounded-full" />
                  <span className="text-lg font-bold">
                    <span className="logo-aidag">AIDAG</span>
                    <span className="logo-chain ml-1">CHAIN</span>
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {t("footerDesc", "World's first quantum-secure cryptocurrency, autonomously managed by SoulwareAI.")}
                </p>
                <div className="flex items-center gap-3">
                  {TWITTER_URL && (
                    <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all" title="Twitter/X">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {TELEGRAM_URL && (
                    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all" title="Telegram">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">{t("platformTitle", "Platform")}</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/presale" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("tokenPresale", "Token Presale")}</Link></li>
                  <li><Link href="/presale#staking" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("stakingEarnings", "Staking & Earnings")}</Link></li>
                  <li><Link href="/dao" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("daoGovernance", "DAO Governance")}</Link></li>
                  <li><Link href="/docs#bridge" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("crossChainBridge", "Cross-Chain Bridge")}</Link></li>
                  <li><Link href="/dao#panel" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("panel", "Panel")}</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">{t("ecosystem", "Ecosystem")}</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href={`https://bscscan.com/token/${TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("dagExplorer", "DAG Explorer")}</a></li>
                  <li><Link href="/docs#partners" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("qsaasPartners", "QSaaS & Partners")}</Link></li>
                  <li><Link href="/docs#security" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("quantumSecurityFooter", "Quantum Security")}</Link></li>
                  <li><Link href="/docs" className="text-gray-400 hover:text-cyan-400 transition-colors">{t("technicalDoc", "Technical Docs")}</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">{t("community", "Community")}</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">Telegram</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Discord</a></li>
                  <li><a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">Twitter / X</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © Aidag Chain. {t("poweredBySoulware", "Powered by SoulwareAI.")} {t("allRightsReserved", "All rights reserved.")}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-cyan-400 transition-colors">{t("privacyPolicy", "Privacy Policy")}</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">{t("termsOfService", "Terms of Service")}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
