import { useState, useEffect } from "react";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, RefreshCw, Wallet } from "lucide-react";
import { shortenAddress, formatTimestamp, formatBNB } from "../lib/helpers";
import { BSCSCAN_TX_URL, BSCSCAN_ADDRESS_URL, DAO_WALLET, FOUNDER_WALLET } from "../lib/config";

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

async function fetchBSCScanTransactions(address) {
  try {
    const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=YourApiKeyToken`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status === "1" && data.result) {
      return data.result.map(tx => ({
        hash: tx.hash,
        type: tx.to?.toLowerCase() === DAO_WALLET?.toLowerCase() ? "dao_join" : "buy",
        from: tx.from,
        to: tx.to,
        amount: (parseFloat(tx.value) / 1e18).toFixed(4),
        tokens: Math.floor((parseFloat(tx.value) / 1e18) * 600 / 0.078).toString(),
        status: tx.txreceipt_status === "1" ? "confirmed" : tx.txreceipt_status === "0" ? "failed" : "pending",
        timestamp: parseInt(tx.timeStamp) * 1000
      }));
    }
    return [];
  } catch (error) {
    console.error("BSCScan fetch error:", error);
    return [];
  }
}

export default function TransactionExplorer({ limit = 10 }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  async function refreshTransactions() {
    setLoading(true);
    try {
      const wallets = [FOUNDER_WALLET, DAO_WALLET].filter(Boolean);
      
      if (wallets.length === 0) {
        setTransactions([]);
        return;
      }

      const results = await Promise.all(wallets.map(w => fetchBSCScanTransactions(w)));
      const allTxs = results.flat();
      
      const uniqueTxs = [...new Map(allTxs.map(tx => [tx.hash, tx])).values()];
      uniqueTxs.sort((a, b) => b.timestamp - a.timestamp);
      
      setTransactions(uniqueTxs.slice(0, limit));
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    refreshTransactions();
    const interval = setInterval(refreshTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

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
        {initialLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading transactions from BSCScan...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No transactions found yet. Be the first to participate in the presale!</p>
          </div>
        ) : (
          transactions.slice(0, limit).map((tx) => (
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
          ))
        )}
      </div>
      
      <div className="p-4 bg-gray-800/30 text-center">
        <a 
          href={`https://bscscan.com/address/${FOUNDER_WALLET || ''}`}
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
