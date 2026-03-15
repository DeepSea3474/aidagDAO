import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useWallet } from "@/lib/walletContext";

export type WalletType = "metamask" | "trustwallet" | "coinbase" | "walletconnect";

interface WalletOption {
  id: WalletType;
  name: string;
  icon: string;
  description: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
    description: "Connect using MetaMask browser extension or mobile app"
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/media/assets/trust_platform.svg",
    description: "Multi-chain wallet supporting AIDAG on BSC"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "https://raw.githubusercontent.com/coinbase/coinbase-wallet-sdk/master/packages/wallet-sdk/assets/images/coinbase-wallet-logo.svg",
    description: "Connect with Coinbase Wallet"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg",
    description: "Scan QR code with any mobile wallet"
  }
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: WalletType) => Promise<void>;
}

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const { error, isConnecting, connectingWallet, isMobile } = useWallet();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleWalletClick = async (wallet: WalletOption) => {
    await onConnect(wallet.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="grid gap-3">
                {WALLET_OPTIONS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletClick(wallet)}
                    disabled={isConnecting}
                    className="group relative flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 text-left transition-all hover:border-cyan-500/50 hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 p-2 shadow-inner overflow-hidden">
                      <img 
                        src={wallet.icon} 
                        alt={wallet.name} 
                        className="h-full w-full object-contain filter drop-shadow-sm scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (wallet.id === 'metamask') target.src = 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg';
                          else if (wallet.id === 'trustwallet') target.src = 'https://trustwallet.com/assets/images/media/assets/TWT.png';
                          else if (wallet.id === 'coinbase') target.src = 'https://www.vectorlogo.zone/logos/coinbase/coinbase-icon.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{wallet.name}</span>
                        {isMobile && wallet.id !== "walletconnect" && (
                          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 border border-cyan-500/20">
                            Direct Link
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50">{wallet.description}</p>
                    </div>
                    {isConnecting && connectingWallet === wallet.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-white/20 transition-colors group-hover:text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-white/30 italic">
                  AIDAG Chain uses secure quantum-ready encryption for all connections.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
