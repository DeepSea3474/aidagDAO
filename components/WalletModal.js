import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BSC_CHAIN_ID, BSC_CHAIN_CONFIG, ETH_CHAIN_ID, CHAINS } from "../lib/config";

const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    color: "from-orange-500 to-orange-600",
    description: "En popüler Web3 cüzdanı"
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "🛡️",
    color: "from-blue-500 to-blue-600",
    description: "Binance destekli mobil cüzdan"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "💰",
    color: "from-blue-600 to-indigo-600",
    description: "Coinbase resmi cüzdanı"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    color: "from-purple-500 to-blue-500",
    description: "200+ cüzdan ile bağlan"
  },
  {
    id: "tokenpocket",
    name: "TokenPocket",
    icon: "👛",
    color: "from-cyan-500 to-blue-500",
    description: "Multi-chain DeFi cüzdanı"
  },
  {
    id: "mathwallet",
    name: "Math Wallet",
    icon: "🧮",
    color: "from-green-500 to-emerald-600",
    description: "Web3 çoklu platform cüzdan"
  }
];

export default function WalletModal({ isOpen, onClose, onConnected, selectedChain = "bsc" }) {
  const [connecting, setConnecting] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  if (!isOpen) return null;

  async function connectWallet(walletId) {
    setConnecting(walletId);
    setError(null);

    try {
      if (!window.ethereum) {
        if (walletId === "metamask") {
          window.open("https://metamask.io/download/", "_blank");
        } else if (walletId === "trustwallet") {
          window.open("https://trustwallet.com/download", "_blank");
        } else if (walletId === "coinbase") {
          window.open("https://www.coinbase.com/wallet", "_blank");
        } else {
          window.open("https://metamask.io/download/", "_blank");
        }
        setError("Cüzdan bulunamadı. İndirme sayfası açıldı.");
        setConnecting(null);
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const targetChainId = selectedChain === "eth" ? ETH_CHAIN_ID : BSC_CHAIN_ID;
      const chainConfig = selectedChain === "eth" 
        ? { chainId: `0x${ETH_CHAIN_ID.toString(16)}` }
        : BSC_CHAIN_CONFIG;

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
      } catch (switchError) {
        if (switchError.code === 4902 && selectedChain === "bsc") {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BSC_CHAIN_CONFIG],
          });
        }
      }

      if (accounts.length > 0) {
        onConnected(accounts[0], walletId);
        onClose();
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
      if (err.code === 4001) {
        setError("Bağlantı isteği reddedildi.");
      } else {
        setError("Bağlantı hatası. Tekrar deneyin.");
      }
    }
    setConnecting(null);
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 border-2 border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-cyan-500/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Cüzdan Bağla</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {selectedChain === "bsc" ? "BSC Mainnet" : "Ethereum Mainnet"} ağına bağlanılacak
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {WALLETS.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => connectWallet(wallet.id)}
              disabled={connecting !== null}
              className={`
                bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 hover:border-cyan-500/50
                rounded-xl p-4 text-left transition-all duration-300
                ${connecting === wallet.id ? "border-cyan-500 bg-cyan-900/20" : ""}
                disabled:opacity-50
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center text-xl`}>
                  {wallet.icon}
                </div>
                <span className="font-semibold text-white">{wallet.name}</span>
              </div>
              <p className="text-xs text-gray-500">{wallet.description}</p>
              {connecting === wallet.id && (
                <div className="mt-2 text-xs text-cyan-400 animate-pulse">Bağlanıyor...</div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Cüzdanı bağlayarak <span className="text-cyan-400">Kullanım Şartları</span>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
