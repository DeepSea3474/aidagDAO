import { useState, useEffect } from "react";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, RefreshCw, Wallet } from "lucide-react";
import { shortenAddress, formatTimestamp, formatBNB } from "../lib/helpers";
import { BSCSCAN_TX_URL, BSCSCAN_ADDRESS_URL } from "../lib/config";

const MOCK_TRANSACTIONS = [
  { hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890", type: "buy", from: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD00", to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", amount: "0.5", tokens: "3846", status: "confirmed", timestamp: Date.now() - 300000 },
  { hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab", type: "dao_join", from: "0x9Cb12D69138ACf8d5F0e4B5C4A3c9a2B1d0E4f67", to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", amount: "0.0083", tokens: "0", status: "confirmed", timestamp: Date.now() - 600000 },
  { hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd", type: "buy", from: "0xAb5801a7D398351b8bE11C439e05C5B3259aec9B", to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", amount: "1.2", tokens: "9230", status: "confirmed", timestamp: Date.now() - 1800000 },
  { hash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", type: "buy", from: "0xDd4B55EbC7f49b80D8C3aB59F57Cb5e69e8f6C89", to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", amount: "0.25", tokens: "1923", status: "pending", timestamp: Date.now() - 60000 },
];

function StatusBadge({ status }) {
  const config = {
    confirmed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/20", label: "Confirmed" },
    pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Pending" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/20", label: "Failed" }
  };
  const { icon: Icon, color, bg, label } = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function TypeBadge({ type }) {
  const config = {
    buy: { icon: ArrowDownLeft, color: "text-cyan-400", bg: "bg-cyan-500/20", label: "Token Purchase" },
    dao_join: { icon: Wallet, color: "text-purple-400", bg: "bg-purple-500/20", label: "DAO Membership" },
    transfer: { icon: ArrowUpRight, color: "text-blue-400", bg: "bg-blue-500/20", label: "Transfer" }
  };
  const { icon: Icon, color, bg, label } = config[type] || config.transfer;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default function TransactionExplorer({ limit = 10 }) {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);

  function refreshTransactions() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Transactions
          </h3>
          <p className="text-gray-500 text-sm">Live blockchain activity on AIDAG Chain</p>
        </div>
        <button 
          onClick={refreshTransactions}
          disabled={loading}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="divide-y divide-gray-800/50">
        {transactions.slice(0, limit).map((tx, index) => (
          <div key={tx.hash} className="p-4 hover:bg-gray-800/30 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <TypeBadge type={tx.type} />
                <StatusBadge status={tx.status} />
              </div>
              <span className="text-gray-500 text-xs">{formatTimestamp(tx.timestamp)}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">From</p>
                <a 
                  href={BSCSCAN_ADDRESS_URL(tx.from)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                >
                  {shortenAddress(tx.from)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Amount</p>
                <p className="text-white font-semibold">{formatBNB(tx.amount)} BNB</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">{tx.type === 'buy' ? 'Tokens' : 'Type'}</p>
                <p className="text-purple-400 font-semibold">
                  {tx.type === 'buy' ? `${tx.tokens} AIDAG` : tx.type === 'dao_join' ? 'DAO Membership' : '-'}
                </p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-800/50">
              <a 
                href={BSCSCAN_TX_URL(tx.hash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-cyan-400 font-mono flex items-center gap-1"
              >
                TX: {shortenAddress(tx.hash, 10, 8)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-800/30 text-center">
        <a 
          href="https://bscscan.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-center gap-2"
        >
          View All on BSCScan
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
