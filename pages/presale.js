import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import WalletButton from "../components/WalletButton";
import { 
  TOKEN_ADDRESS, 
  PRESALE_CONTRACT, 
  DAO_WALLET,
  FOUNDER_WALLET,
  PRESALE_STAGE1_PRICE,
  PRESALE_STAGE2_PRICE,
  LISTING_PRICE,
  MAX_SUPPLY,
  FOUNDER_COINS,
  DAO_COINS,
  BSCSCAN_ADDRESS_URL,
  REVENUE_FOUNDER_PERCENT,
  REVENUE_LIQUIDITY_PERCENT,
  DAO_MEMBERSHIP_FEE
} from "../lib/config";
import { getSigner } from "../lib/provider";
import PresaleABI from "../lib/PresaleABI.json";
import { parseError, ErrorAlert, SuccessAlert } from "../lib/errors";
import { formatNumber } from "../lib/utils";
import { Users, Vote, MessageCircle, Check, X, Shield, Zap, Crown, Coins, Wallet, ArrowRight, Lock, Unlock } from "lucide-react";

const GAS_LIMIT = 200000;
const BNB_USD_PRICE = 600;

export default function Presale() {
  const { t } = useTranslation();
  const [walletAddress, setWalletAddress] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [step, setStep] = useState(1);
  const [showDaoModal, setShowDaoModal] = useState(false);
  const [daoJoined, setDaoJoined] = useState(false);
  const [daoLoading, setDaoLoading] = useState(false);
  const [daoAgreement, setDaoAgreement] = useState(false);

  const currentPrice = PRESALE_STAGE1_PRICE;
  const tokensToReceive = amount ? (parseFloat(amount) * BNB_USD_PRICE / currentPrice).toFixed(2) : "0";
  const founderShare = amount ? (parseFloat(amount) * 0.6).toFixed(4) : "0";
  const liquidityShare = amount ? (parseFloat(amount) * 0.4).toFixed(4) : "0";

  function handleConnected(address) {
    setWalletAddress(address);
    if (address && !daoJoined) {
      setShowDaoModal(true);
    }
  }

  async function joinDAO() {
    if (!walletAddress || !FOUNDER_WALLET) {
      setError("Cüzdan veya kurucu adresi bulunamadı");
      return;
    }

    setDaoLoading(true);
    setError(null);

    try {
      const signer = await getSigner();
      if (!signer) {
        setError("Cüzdan bağlı değil");
        setDaoLoading(false);
        return;
      }

      const feeInBNB = (DAO_MEMBERSHIP_FEE / BNB_USD_PRICE).toFixed(6);
      const tx = await signer.sendTransaction({
        to: FOUNDER_WALLET,
        value: ethers.parseEther(feeInBNB),
        gasLimit: 50000
      });
      
      await tx.wait();
      setDaoJoined(true);
      setShowDaoModal(false);
      setSuccess("Congratulations! You are now a DAO member. You can now purchase tokens.");
    } catch (err) {
      console.error("DAO join failed:", err);
      const parsedError = parseError(err);
      setError(parsedError.message);
    }
    setDaoLoading(false);
  }

  function skipDAO() {
    setShowDaoModal(false);
    setDaoAgreement(false);
  }

  async function buyTokens() {
    if (!walletAddress) {
      setError("Lütfen önce cüzdanınızı bağlayın");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError("Lütfen geçerli bir miktar girin");
      return;
    }

    if (!FOUNDER_WALLET || !DAO_WALLET) {
      setError("Cüzdan adresleri bulunamadı. Lütfen yapılandırmayı kontrol edin.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      const signer = await getSigner();
      if (!signer) {
        setError("Cüzdan bağlı değil");
        setLoading(false);
        return;
      }

      const balance = await signer.provider.getBalance(walletAddress);
      const totalAmount = ethers.parseEther(amount);
      
      if (balance < totalAmount) {
        setError("Yetersiz BNB bakiyesi. Lütfen hesabınıza yeterli BNB ekleyin.");
        setLoading(false);
        return;
      }

      const founderAmount = ethers.parseEther(founderShare);
      const tx1 = await signer.sendTransaction({
        to: FOUNDER_WALLET,
        value: founderAmount,
        gasLimit: 50000
      });
      
      setTxHash(tx1.hash);
      setSuccess("Transaction 1/2: Sending founder share...");
      await tx1.wait();

      const liquidityAmount = ethers.parseEther(liquidityShare);
      const tx2 = await signer.sendTransaction({
        to: DAO_WALLET,
        value: liquidityAmount,
        gasLimit: 50000
      });
      
      setTxHash(tx2.hash);
      await tx2.wait();
      
      setSuccess(`Tebrikler! ${formatNumber(parseFloat(tokensToReceive))} AIDAG token satın aldınız! Token dağılımı SoulwareAI tarafından otomatik yapılacaktır.`);
      setAmount("");
    } catch (err) {
      console.error("Transaction failed:", err);
      const parsedError = parseError(err);
      setError(parsedError.message);
    }
    setLoading(false);
  }

  return (
    <Layout>
      {showDaoModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border border-purple-500/30 rounded-3xl max-w-md w-full p-6 overflow-hidden"
               style={{ boxShadow: '0 0 60px rgba(139, 92, 246, 0.15)' }}>
            
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>
            
            <button 
              onClick={skipDAO} 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center mb-6 relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30"
                   style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Join the DAO?</h2>
              <p className="text-gray-400 text-sm">
                As a DAO member, you can create proposals, participate in voting, 
                and interact directly with SoulwareAI.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/20 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-purple-400" />
                  Membership Fee
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">${DAO_MEMBERSHIP_FEE}</span>
              </div>
              <p className="text-gray-500 text-xs">
                Fee is transferred autonomously to the founder wallet
              </p>
            </div>

            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Vote className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">Create and vote on proposals</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-gray-300 text-sm">Direct interaction with SoulwareAI</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-300 text-sm">Access to exclusive DAO channels</span>
              </div>
            </div>

            <label className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 mb-5 cursor-pointer hover:bg-gray-800/70 transition-all">
              <input 
                type="checkbox" 
                checked={daoAgreement}
                onChange={(e) => setDaoAgreement(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
              />
              <span className="text-gray-400 text-xs leading-relaxed">
                I agree to pay the ${DAO_MEMBERSHIP_FEE} membership fee and understand that the DAO is fully managed by SoulwareAI with no human intervention.
              </span>
            </label>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded-xl mb-4 flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={skipDAO}
                disabled={daoLoading}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 border border-gray-700"
              >
                Skip for Now
              </button>
              <button
                onClick={joinDAO}
                disabled={daoLoading || !daoAgreement}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-4 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {daoLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Join DAO
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-cyan-600/20 border border-cyan-600/30 text-cyan-400 text-sm px-4 py-1 rounded-full mb-4">
            SoulwareAI Autonomous Presale
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            AIDAG Token Presale
          </h1>
          <p className="text-gray-400 text-lg">
            Fully autonomous presale - No founder or human intervention
          </p>
        </div>

        <div className="card bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-cyan-500/30 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🤖</span>
            <div>
              <h3 className="text-xl font-bold text-white">Autonomous Revenue Distribution</h3>
              <p className="text-gray-500 text-sm">All revenues are automatically distributed according to smart contract rules</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👨‍💼</span>
                  <span className="text-white font-semibold">Founder Wallet</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400">%{REVENUE_FOUNDER_PERCENT}</span>
              </div>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💧</span>
                  <span className="text-white font-semibold">SoulwareAI + DAO Likidite</span>
                </div>
                <span className="text-2xl font-bold text-cyan-400">%{REVENUE_LIQUIDITY_PERCENT}</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">DEX/CEX likidite havuzları için otonom yönetim</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center glow-animation">
            <p className="text-gray-500 text-sm mb-2">Stage 1</p>
            <p className="text-2xl font-bold text-cyan-400">${PRESALE_STAGE1_PRICE}</p>
            <p className="text-gray-500 text-xs mt-1">USDT / AIDAG</p>
            <span className="inline-block mt-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">Aktif</span>
          </div>
          <div className="card text-center">
            <p className="text-gray-500 text-sm mb-2">Stage 2</p>
            <p className="text-2xl font-bold text-blue-400">${PRESALE_STAGE2_PRICE}</p>
            <p className="text-gray-500 text-xs mt-1">USDT / AIDAG</p>
            <span className="inline-block mt-2 text-xs bg-gray-600/20 text-gray-400 px-2 py-1 rounded">Yakında</span>
          </div>
          <div className="card text-center">
            <p className="text-gray-500 text-sm mb-2">Listeleme</p>
            <p className="text-2xl font-bold text-green-400">${LISTING_PRICE}</p>
            <p className="text-gray-500 text-xs mt-1">USDT / AIDAG</p>
            <span className="inline-block mt-2 text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">DEX/CEX</span>
          </div>
          <div className="card text-center">
            <p className="text-gray-500 text-sm mb-2">DAO Tokenleri</p>
            <p className="text-2xl font-bold text-purple-400" suppressHydrationWarning>{formatNumber(DAO_COINS)}</p>
            <p className="text-gray-500 text-xs mt-1">AIDAG</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">AIDAG Token Satın Al</h3>
              {daoJoined && (
                <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">DAO Üyesi</span>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Miktar (BNB)</label>
                <input
                  type="number"
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Alacağınız token:</span>
                  <span className="text-cyan-400 font-bold" suppressHydrationWarning>{formatNumber(parseFloat(tokensToReceive))} AIDAG</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Founder share (%{REVENUE_FOUNDER_PERCENT}):</span>
                  <span className="text-yellow-400">{founderShare} BNB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Likidite payı (%{REVENUE_LIQUIDITY_PERCENT}):</span>
                  <span className="text-cyan-400">{liquidityShare} BNB</span>
                </div>
              </div>
              
              {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
              {success && <SuccessAlert message={success} txHash={txHash} onDismiss={() => setSuccess(null)} />}

              {walletAddress ? (
                <button
                  onClick={buyTokens}
                  disabled={loading || !amount}
                  className="w-full btn-primary text-white disabled:opacity-50"
                >
                  {loading ? "İşleniyor..." : "Şimdi Satın Al"}
                </button>
              ) : (
                <WalletButton onConnected={handleConnected} onError={setError} />
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6">Satın Alma Adımları</h3>
            <div className="space-y-4">
              <div className={`flex items-start gap-3 p-3 rounded-lg ${walletAddress ? 'bg-green-900/20 border border-green-600/30' : 'bg-gray-800/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${walletAddress ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {walletAddress ? '✓' : '1'}
                </div>
                <div>
                  <p className={`font-semibold ${walletAddress ? 'text-green-400' : 'text-white'}`}>Cüzdan Bağla</p>
                  <p className="text-gray-500 text-sm">MetaMask, Trust Wallet veya WalletConnect</p>
                </div>
              </div>
              
              <div className={`flex items-start gap-3 p-3 rounded-lg ${daoJoined ? 'bg-green-900/20 border border-green-600/30' : 'bg-gray-800/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${daoJoined ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {daoJoined ? '✓' : '2'}
                </div>
                <div>
                  <p className={`font-semibold ${daoJoined ? 'text-green-400' : 'text-white'}`}>DAO Üyeliği (Opsiyonel)</p>
                  <p className="text-gray-500 text-sm">${DAO_MEMBERSHIP_FEE} ile DAO'ya katıl veya atla</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-700 text-gray-400">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">Token Satın Al</p>
                  <p className="text-gray-500 text-sm">BNB ile AIDAG token satın al</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-700 text-gray-400">
                  4
                </div>
                <div>
                  <p className="font-semibold text-white">Otomatik Dağılım</p>
                  <p className="text-gray-500 text-sm">SoulwareAI tokenları cüzdanınıza gönderir</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Tokenomics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-400 font-medium">Kategori</th>
                  <th className="py-3 px-4 text-gray-400 font-medium text-right">Miktar</th>
                  <th className="py-3 px-4 text-gray-400 font-medium text-right">Oran</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">●</span>
                      <span className="text-white font-medium">Maximum Supply</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-cyan-400 font-bold" suppressHydrationWarning>{formatNumber(MAX_SUPPLY)}</td>
                  <td className="py-4 px-4 text-right text-gray-400">%100</td>
                  <td className="py-4 px-4">
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Fixed</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">●</span>
                      <span className="text-white font-medium">Founder Tokens</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-yellow-400 font-bold" suppressHydrationWarning>{formatNumber(FOUNDER_COINS)}</td>
                  <td className="py-4 px-4 text-right text-gray-400">%14.3</td>
                  <td className="py-4 px-4">
                    <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded">1 Year Locked</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">●</span>
                      <span className="text-white font-medium">DAO + SoulwareAI</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-purple-400 font-bold" suppressHydrationWarning>{formatNumber(DAO_COINS)}</td>
                  <td className="py-4 px-4 text-right text-gray-400">%85.7</td>
                  <td className="py-4 px-4">
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">Autonomous</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Cüzdan Adresleri</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-500 mb-1">Founder Wallet (%{REVENUE_FOUNDER_PERCENT} + DAO Membership)</p>
              <a href={BSCSCAN_ADDRESS_URL(FOUNDER_WALLET)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono break-all hover:underline text-xs">
                {FOUNDER_WALLET || "Yakında açıklanacak"}
              </a>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-500 mb-1">SoulwareAI + DAO Likidite (%{REVENUE_LIQUIDITY_PERCENT})</p>
              <a href={BSCSCAN_ADDRESS_URL(DAO_WALLET)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-mono break-all hover:underline text-xs">
                {DAO_WALLET || "Yakında açıklanacak"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
