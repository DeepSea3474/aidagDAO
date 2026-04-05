import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import { 
  TOKEN_ADDRESS, 
  PRESALE_CONTRACT,
  DAO_WALLET, 
  FOUNDER_WALLET,
  OPERATION_WALLET,
  PRESALE_STAGE1_PRICE,
  PRESALE_STAGE2_PRICE,
  LISTING_PRICE,
  MAX_SUPPLY,
  FOUNDER_COINS,
  FOUNDER_LOCK_YEARS,
  DAO_COINS,
  BSCSCAN_ADDRESS_URL,
  BSCSCAN_TOKEN_URL
} from "../lib/config";

export default function Docs() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            {t("docsTitle")}
          </h1>
          <p className="text-gray-400 text-lg">{t("docsDesc")}</p>
        </div>

        <div className="space-y-8">
          <section className="card">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">{t("tokenomicsRules")}</h2>
            <p className="text-gray-300 mb-6">{t("tokenomicsText")}</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-gray-400 font-medium">Kategori</th>
                    <th className="py-3 px-4 text-gray-400 font-medium">Miktar (AIDAG)</th>
                    <th className="py-3 px-4 text-gray-400 font-medium">Durum / Notlar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-white font-semibold">{t("maxSupply")}</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">{MAX_SUPPLY.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-400">Kontratta sabit</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-white font-semibold">{t("founderCoins")}</td>
                    <td className="py-3 px-4 text-purple-400 font-bold">{FOUNDER_COINS.toLocaleString()}</td>
                    <td className="py-3 px-4 text-yellow-400">{FOUNDER_LOCK_YEARS} year locked 🔒</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-4 text-white font-semibold">{t("presaleBonus")}</td>
                    <td className="py-3 px-4 text-green-400 font-bold">In DAO Wallet</td>
                    <td className="py-3 px-4 text-gray-400">Managed by SoulwareAI + DAO</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-white font-semibold">{t("liquidityCoins")}</td>
                    <td className="py-3 px-4 text-blue-400 font-bold">Reserved share</td>
                    <td className="py-3 px-4 text-gray-400">For DEX + CEX usage</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-600/30 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-cyan-400 mb-2">{MAX_SUPPLY.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{t("maxSupply")}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-600/30 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-purple-400 mb-2">{FOUNDER_COINS.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{t("founderCoins")} ({t("founderLock")})</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-600/30 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-green-400 mb-2">{DAO_COINS.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{t("daoCoins")}</p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Presale Fiyatlandırma</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">Stage 1</p>
                <p className="text-2xl font-bold text-cyan-400">${PRESALE_STAGE1_PRICE}</p>
                <p className="text-gray-500 text-xs">USDT / AIDAG</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">Stage 2</p>
                <p className="text-2xl font-bold text-blue-400">${PRESALE_STAGE2_PRICE}</p>
                <p className="text-gray-500 text-xs">USDT / AIDAG</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">Listing</p>
                <p className="text-2xl font-bold text-green-400">${LISTING_PRICE}</p>
                <p className="text-gray-500 text-xs">USDT / AIDAG</p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Gelir Dağılımı</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-blue-400 mb-2">40%</p>
                <p className="text-gray-400 text-sm">{t("rule40")}</p>
              </div>
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-purple-400 mb-2">60%</p>
                <p className="text-gray-400 text-sm">{t("rule60")}</p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t("contractAddresses")}</h2>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Token Contract (AIDAG) - BSC</p>
                <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono text-sm break-all hover:underline">
                  {TOKEN_ADDRESS}
                </a>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Presale Contract</p>
                <a href={BSCSCAN_ADDRESS_URL(PRESALE_CONTRACT)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono text-sm break-all hover:underline">
                  {PRESALE_CONTRACT}
                </a>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">SoulwareAI + DAO Treasury</p>
                <a href={BSCSCAN_ADDRESS_URL(DAO_WALLET)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono text-sm break-all hover:underline">
                  {DAO_WALLET}
                </a>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Founder Wallet (1 Yıl Kilitli)</p>
                <a href={BSCSCAN_ADDRESS_URL(FOUNDER_WALLET)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono text-sm break-all hover:underline">
                  {FOUNDER_WALLET}
                </a>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Operation Wallet</p>
                <a href={BSCSCAN_ADDRESS_URL(OPERATION_WALLET)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono text-sm break-all hover:underline">
                  {OPERATION_WALLET}
                </a>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t("transparency")}</h2>
            <p className="text-gray-300 mb-4">{t("transparencyText")}</p>
            <a
              href="https://bscscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-600/30 transition-all"
            >
              <span>🔍</span>
              <span>View on BSCScan</span>
              <span>→</span>
            </a>
          </section>

          <section className="card bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-600/30">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">🤖 SoulwareAI Hakkında</h2>
            <p className="text-gray-300 mb-4">
              SoulwareAI, AIDAG Chain'i çalıştıran otonom yapay zeka sistemidir. 
              Token operasyonları, yönetişim kararları ve ekosistem geliştirme işlemlerini
              hiçbir insan müdahalesi olmadan yönetir. Gerçek anlamda merkeziyetsiz ve şeffaf operasyonlar sağlar.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <p className="text-white font-semibold">Autonomous Operations</p>
                <p className="text-gray-500 text-sm">24/7 automatic management</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-white font-semibold">Secure & Transparent</p>
                <p className="text-gray-500 text-sm">Verified smart contracts</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-white font-semibold">BSC Ağı</p>
                <p className="text-gray-500 text-sm">Hızlı & düşük maliyetli işlemler</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
