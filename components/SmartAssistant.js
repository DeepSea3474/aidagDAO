import { useState } from "react";
import { AlertTriangle, CheckCircle, Info, HelpCircle, X, ChevronDown, ChevronUp, Shield, Zap } from "lucide-react";

const TIPS = {
  wallet: [
    { type: "info", title: "Connect Your Wallet", message: "Use MetaMask, Trust Wallet, or WalletConnect to connect. Make sure you're on the BSC network." },
    { type: "warning", title: "Check Network", message: "AIDAG runs on Binance Smart Chain (BSC). Switch your wallet to BSC Mainnet (Chain ID: 56)." },
    { type: "tip", title: "Gas Fees", message: "Keep at least 0.01 BNB in your wallet for transaction fees (gas)." }
  ],
  presale: [
    { type: "info", title: "Current Price", message: "Stage 1 price is $0.078 per AIDAG. Listing price will be $0.12 - that's +54% potential!" },
    { type: "warning", title: "Minimum Amount", message: "Minimum purchase is 0.01 BNB. Enter the amount carefully." },
    { type: "tip", title: "Revenue Split", message: "60% goes to founder wallet, 40% to DAO/Liquidity - all managed autonomously by SoulwareAI." }
  ],
  dao: [
    { type: "info", title: "DAO Membership", message: "Pay $5 to become a DAO member. You'll be able to create proposals and vote." },
    { type: "tip", title: "Voting Power", message: "Your voting power equals your AIDAG token balance. 1 AIDAG = 1 Vote." },
    { type: "warning", title: "No Human Intervention", message: "All DAO decisions are executed by SoulwareAI autonomously. No founder intervention." }
  ],
  security: [
    { type: "success", title: "Quantum Secure", message: "AIDAG uses quantum-resistant security protocols for future-proof protection." },
    { type: "info", title: "Smart Contracts", message: "All contracts are deployed on BSC and can be verified on BSCScan." },
    { type: "warning", title: "Never Share", message: "Never share your private keys or seed phrase. SoulwareAI will never ask for them." }
  ]
};

function TipCard({ tip, onDismiss }) {
  const config = {
    info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    success: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
    tip: { icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" }
  };
  const { icon: Icon, color, bg, border } = config[tip.type] || config.info;

  return (
    <div className={`${bg} ${border} border rounded-xl p-4 relative group`}>
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-800 rounded"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`font-medium ${color} text-sm`}>{tip.title}</h4>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{tip.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function SmartAssistant({ context = "wallet" }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedTips, setDismissedTips] = useState([]);
  
  const tips = TIPS[context] || TIPS.wallet;
  const visibleTips = tips.filter((_, i) => !dismissedTips.includes(i));

  if (visibleTips.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl border border-gray-700/50 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium text-sm">Smart Assistant</h3>
            <p className="text-gray-500 text-xs">Tips for beginners</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
            {visibleTips.length} tips
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {visibleTips.map((tip, index) => (
            <TipCard 
              key={index} 
              tip={tip} 
              onDismiss={() => setDismissedTips([...dismissedTips, tips.indexOf(tip)])}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ErrorGuard({ children, onError }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleError(error) {
    setHasError(true);
    setErrorMessage(error.message || "An unexpected error occurred");
    if (onError) onError(error);
  }

  if (hasError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-white font-bold mb-2">Something went wrong</h3>
        <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
        <button 
          onClick={() => { setHasError(false); setErrorMessage(""); }}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return children;
}

export function NetworkChecker({ requiredChainId = 56 }) {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  if (isCorrectNetwork) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4">
      <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="text-yellow-400 font-medium">Wrong Network</h4>
        <p className="text-gray-400 text-sm">Please switch to Binance Smart Chain (BSC Mainnet)</p>
      </div>
      <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm transition-all">
        Switch Network
      </button>
    </div>
  );
}
