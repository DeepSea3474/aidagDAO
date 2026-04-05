import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BSC_CHAIN_ID, BSC_CHAIN_CONFIG, CHAINS } from "../lib/config";

const ERROR_MESSAGES = {
  NO_WALLET: "MetaMask veya uyumlu bir cüzdan bulunamadı. Lütfen MetaMask yükleyin.",
  WRONG_NETWORK: "Yanlış ağ seçildi. Lütfen BSC ağına geçin.",
  CONNECTION_FAILED: "Cüzdan bağlantısı başarısız. Lütfen tekrar deneyin.",
  USER_REJECTED: "Bağlantı isteği reddedildi.",
  INSUFFICIENT_BALANCE: "Yetersiz bakiye.",
  CONTRACT_NOT_FOUND: "Kontrat adresi bulunamadı.",
  TRANSACTION_FAILED: "İşlem başarısız. Lütfen tekrar deneyin.",
};

export default function WalletButton({ onConnected, onError, className = "", showChainInfo = false }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chainError, setChainError] = useState(false);
  const [currentChain, setCurrentChain] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    checkConnection();
    
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setAddress(null);
      if (onConnected) onConnected(null);
    } else {
      setAddress(accounts[0]);
      if (onConnected) onConnected(accounts[0]);
    }
  }

  function handleChainChanged(chainId) {
    const newChainId = parseInt(chainId, 16);
    setCurrentChain(newChainId);
    if (newChainId !== BSC_CHAIN_ID) {
      setChainError(true);
      setError(ERROR_MESSAGES.WRONG_NETWORK);
    } else {
      setChainError(false);
      setError(null);
    }
  }

  async function checkConnection() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          if (onConnected) onConnected(accounts[0]);
          await checkChain();
        }
      } catch (error) {
        console.error("Connection check failed:", error);
      }
    }
  }

  async function checkChain() {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        const currentChainId = parseInt(chainId, 16);
        setCurrentChain(currentChainId);
        
        if (currentChainId !== BSC_CHAIN_ID) {
          setChainError(true);
          setError(ERROR_MESSAGES.WRONG_NETWORK);
          return false;
        }
        setChainError(false);
        setError(null);
        return true;
      } catch (err) {
        console.error("Chain check failed:", err);
        return false;
      }
    }
    return false;
  }

  async function switchToBSC() {
    setLoading(true);
    setError(null);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_CHAIN_CONFIG.chainId }],
      });
      setChainError(false);
      setError(null);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BSC_CHAIN_CONFIG],
          });
          setChainError(false);
          setError(null);
        } catch (addError) {
          console.error("Failed to add BSC network:", addError);
          setError("BSC ağı eklenemedi. Lütfen manuel olarak ekleyin.");
          if (onError) onError(addError);
        }
      } else {
        setError("Ağ değiştirilemedi. Lütfen tekrar deneyin.");
        if (onError) onError(switchError);
      }
    }
    setLoading(false);
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setError(ERROR_MESSAGES.NO_WALLET);
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      if (onConnected) onConnected(accounts[0]);
      
      const isCorrectChain = await checkChain();
      if (!isCorrectChain) {
        await switchToBSC();
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      if (error.code === 4001) {
        setError(ERROR_MESSAGES.USER_REJECTED);
      } else {
        setError(ERROR_MESSAGES.CONNECTION_FAILED);
      }
      if (onError) onError(error);
    }
    setLoading(false);
  }

  function getChainName(chainId) {
    const chain = Object.values(CHAINS).find(c => c.id === chainId);
    return chain ? chain.name : `Bilinmeyen Ağ (${chainId})`;
  }

  if (error && !address) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-600/30 p-3 rounded-lg">
          {error}
        </div>
        <button 
          onClick={connectWallet}
          disabled={loading}
          className="w-full btn-primary text-white disabled:opacity-50"
        >
          {loading ? "Bağlanıyor..." : "Tekrar Dene"}
        </button>
      </div>
    );
  }

  if (chainError && address) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-yellow-400 text-sm bg-yellow-900/20 border border-yellow-600/30 p-3 rounded-lg">
          {ERROR_MESSAGES.WRONG_NETWORK}
          {currentChain && (
            <p className="text-xs mt-1 text-gray-400">Mevcut: {getChainName(currentChain)}</p>
          )}
        </div>
        <button 
          onClick={switchToBSC}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "Değiştiriliyor..." : "BSC Ağına Geç"}
        </button>
      </div>
    );
  }

  if (address && showChainInfo) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-green-400 text-xs">● BSC</span>
        <span className="bg-gray-800 border border-gray-700 text-cyan-400 px-4 py-2 rounded-lg font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button 
      onClick={connectWallet} 
      disabled={loading}
      className={`w-full btn-primary text-white disabled:opacity-50 ${className}`}
    >
      {loading ? "Bağlanıyor..." : address ? `${address.slice(0,6)}...${address.slice(-4)}` : t("connectWallet")}
    </button>
  );
}

export { ERROR_MESSAGES };
