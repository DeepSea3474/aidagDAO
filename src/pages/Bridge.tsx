import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownUp, Shield, Zap, Clock, CheckCircle,
  AlertTriangle, Loader2, ExternalLink, ArrowRight,
  Globe, Lock, Brain, Layers, Activity, TrendingUp, RefreshCw
} from "lucide-react";
import { useWallet } from "@/lib/walletContext";
import { BSC_CHAIN_ID, ETH_CHAIN_ID, shortenAddress } from "@/lib/web3Config";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CHAINS = [
  { id: BSC_CHAIN_ID, name: "BNB Smart Chain", short: "BSC", color: "#F0B90B", icon: "B" },
  { id: ETH_CHAIN_ID, name: "Ethereum", short: "ETH", color: "#627EEA", icon: "E" },
];

function BridgeInterface() {
  const [fromChain, setFromChain] = useState(0);
  const [amount, setAmount] = useState("");
  const wallet = useWallet();

  const toChain = fromChain === 0 ? 1 : 0;
  const swap = () => setFromChain(toChain);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
          <ArrowDownUp className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Cross-Chain Bridge</h3>
          <p className="text-xs text-slate-400">Powered by SoulwareAI Trustless Protocol</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs text-slate-400">From</span>
            <span className="text-xs text-slate-500">Balance: 12,500 AIDAG</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: CHAINS[fromChain].color }}>
                {CHAINS[fromChain].icon}
              </div>
              <span className="text-sm text-white font-bold">{CHAINS[fromChain].short}</span>
            </div>
            <input type="number" placeholder="0.0" value={amount} onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-right text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-none min-w-0"
              data-testid="input-bridge-amount" />
          </div>
        </div>

        <div className="flex justify-center -my-1 relative z-10">
          <button onClick={swap} data-testid="button-swap-chains"
            className="w-10 h-10 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-cyan-400 hover:bg-slate-700 transition-colors hover:border-cyan-500/30">
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs text-slate-400">To</span>
            <span className="text-xs text-slate-500">Estimated arrival: ~2 min</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: CHAINS[toChain].color }}>
                {CHAINS[toChain].icon}
              </div>
              <span className="text-sm text-white font-bold">{CHAINS[toChain].short}</span>
            </div>
            <div className="flex-1 text-right text-2xl font-bold text-slate-500">
              {amount ? (parseFloat(amount) * 0.998).toFixed(2) : "0.0"}
            </div>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-xl space-y-2">
          <div className="flex justify-between text-xs"><span className="text-slate-400">Bridge Fee</span><span className="text-white">0.2%</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-400">Estimated Time</span><span className="text-emerald-400">~2 minutes</span></div>
          <div className="flex justify-between text-xs"><span className="text-slate-400">Security</span><span className="text-cyan-400">Quantum Encrypted</span></div>
        </div>

        <button className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          data-testid="button-bridge-transfer">
          <ArrowDownUp className="w-4 h-4" /> Bridge AIDAG
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> Quantum Secured</span>
        <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-purple-400" /> AI Verified</span>
        <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-cyan-400" /> Trustless</span>
      </div>
    </motion.div>
  );
}

function BridgeHistory() {
  const txs = [
    { hash: "0x7a3B...f21E", from: "BSC", to: "ETH", amount: "5,000", status: "completed", time: "3 min ago" },
    { hash: "0x1cF9...8b2A", from: "ETH", to: "BSC", amount: "12,500", status: "completed", time: "15 min ago" },
    { hash: "0x9eD2...3c7F", from: "BSC", to: "ETH", amount: "8,200", status: "pending", time: "1 min ago" },
    { hash: "0x4bA1...d9E5", from: "ETH", to: "BSC", amount: "25,000", status: "completed", time: "1 hour ago" },
    { hash: "0x6fC8...a4B3", from: "BSC", to: "ETH", amount: "3,400", status: "completed", time: "2 hours ago" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-6 font-display">Recent Bridge Activity</h3>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="divide-y divide-white/5">
          {txs.map((tx, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  tx.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {tx.status === "completed" ? <CheckCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
                <div>
                  <div className="text-sm text-white font-mono">{tx.hash}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="text-cyan-400">{tx.from}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-purple-400">{tx.to}</span>
                    <span className="ml-2">{tx.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{tx.amount} AIDAG</div>
                <div className={`text-xs ${tx.status === "completed" ? "text-emerald-400" : "text-yellow-400"}`}>
                  {tx.status === "completed" ? "Completed" : "Pending..."}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Bridge() {
  const bridgeStats = [
    { label: "Total Bridged", value: "$2.4M", icon: <TrendingUp className="w-5 h-5" />, color: "text-cyan-400" },
    { label: "Bridge Transactions", value: "15,847", icon: <Activity className="w-5 h-5" />, color: "text-emerald-400" },
    { label: "Avg. Time", value: "~2 min", icon: <Clock className="w-5 h-5" />, color: "text-yellow-400" },
    { label: "Success Rate", value: "99.98%", icon: <CheckCircle className="w-5 h-5" />, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Layers className="w-4 h-4" /> Cross-Chain Bridge
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-bridge-title">
                Bridge{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AIDAG</span>{" "}
                Across Chains
              </h1>
              <p className="text-base sm:text-lg text-slate-400 px-2">
                Transfer AIDAG tokens between BSC and Ethereum securely using our quantum-encrypted,
                AI-verified trustless bridge operated by SoulwareAI.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {bridgeStats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4 sm:p-6 text-center border border-white/5">
                <div className={`${s.color} mx-auto mb-2 sm:mb-3`}>{s.icon}</div>
                <div className="text-lg sm:text-2xl font-bold text-white font-display mb-1">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <BridgeInterface />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Shield className="w-8 h-8 text-emerald-400" />, title: "Quantum Security", desc: "All bridge transactions are protected by post-quantum cryptography, immune to quantum attacks" },
              { icon: <Brain className="w-8 h-8 text-purple-400" />, title: "AI Verification", desc: "SoulwareAI autonomously verifies every transfer for fraud detection and instant confirmation" },
              { icon: <RefreshCw className="w-8 h-8 text-cyan-400" />, title: "Instant Settlement", desc: "Average bridge time under 2 minutes with atomic swap technology across both chains" },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center border border-white/5">
                <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">{f.icon}</div>
                <h4 className="text-white font-bold mb-2">{f.title}</h4>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          <BridgeHistory />
        </div>
      </main>
      <Footer />
    </div>
  );
}
