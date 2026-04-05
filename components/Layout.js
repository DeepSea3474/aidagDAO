import Head from "next/head";
import Header from "./Header";
import { useTranslation } from "react-i18next";
import { TWITTER_URL, TELEGRAM_URL, SITE_URL, TOKEN_ADDRESS, BSCSCAN_ADDRESS_URL, GITHUB_URL } from "../lib/config";

export default function Layout({ children, title = "AIDAG Chain" }) {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${title} - Tam Otonom AI Blockchain`}</title>
        <meta name="description" content="AIDAG Chain - Kripto tarihinde bir ilk. SoulwareAI tarafından tam otonom yönetilen, kurucu ve insan müdahalesi olmayan blockchain. Quantum güvenlik, multi-chain uyumluluk." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AIDAG Chain - Tam Otonom AI Blockchain" />
        <meta property="og:description" content="Kripto tarihinde bir ilk - Yapay zeka yönetimli ilk coin. Quantum güvenlik, BSC + Ethereum uyumlu." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/soulwareai.jpeg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDAG Chain - Tam Otonom AI Blockchain" />
        <meta name="twitter:description" content="Kripto tarihinde bir ilk - Yapay zeka yönetimli ilk coin." />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <div className="min-h-screen bg-black text-white bg-grid">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        
        <footer className="border-t border-gray-800 py-12 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/logo.svg" alt="AIDAG" className="h-8 w-8" />
                  <span className="text-xl font-bold">
                    <span className="logo-aidag">AIDAG</span>
                    <span className="logo-chain ml-1">CHAIN</span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Kripto tarihinde bir ilk - Yapay zeka tarafından tam otonom yönetilen blockchain.
                </p>
                <div className="flex items-center gap-3">
                  {TWITTER_URL && (
                    <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all" title="Twitter/X">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {TELEGRAM_URL && (
                    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-all" title="Telegram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                  )}
                  <a href={BSCSCAN_ADDRESS_URL(TOKEN_ADDRESS)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-gray-700 transition-all" title="BSCScan">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  </a>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all" title="GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Sayfalar</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Ana Sayfa</a></li>
                  <li><a href="/presale" className="text-gray-400 hover:text-cyan-400 transition-colors">Ön Satış</a></li>
                  <li><a href="/dao" className="text-gray-400 hover:text-cyan-400 transition-colors">DAO</a></li>
                  <li><a href="/docs" className="text-gray-400 hover:text-cyan-400 transition-colors">Dokümantasyon</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Özellikler</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-400">Tam Otonom AI</li>
                  <li className="text-gray-400">Quantum Güvenlik</li>
                  <li className="text-gray-400">Multi-Chain (BSC + ETH)</li>
                  <li className="text-gray-400">DAO Yönetişimi</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Kontrat</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-gray-500">Ağ:</span>
                    <span className="text-yellow-400 ml-2">BSC</span>
                  </li>
                  <li>
                    <span className="text-gray-500">Token:</span>
                    <a href={BSCSCAN_ADDRESS_URL(TOKEN_ADDRESS)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 ml-2 hover:underline">
                      AIDAG
                    </a>
                  </li>
                  <li>
                    <span className="text-gray-500">Arz:</span>
                    <span className="text-white ml-2">21,000,000</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {t("copyright")}</p>
                <p className="text-cyan-600 text-xs mt-1">{t("poweredBy")}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Kurucu Müdahalesi Yok</span>
                <span>•</span>
                <span>İnsan Müdahalesi Yok</span>
                <span>•</span>
                <span>Tam Otonom</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
