import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Activity, Globe, Layers, TrendingUp, Clock,
  ArrowUpRight, CheckCircle, Database, Shield, Brain,
  Zap, Eye, BarChart3, Users, Flame, Hash, Box
} from "lucide-react";
import { shortenAddress } from "@/lib/web3Config";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const RECENT_BLOCKS = [
  { number: 45892103, txCount: 142, time: "3s ago", validator: "SoulwareAI-Node-1", gasUsed: "12.4M", reward: "0.12" },
  { number: 45892102, txCount: 98, time: "6s ago", validator: "SoulwareAI-Node-2", gasUsed: "8.7M", reward: "0.09" },
  { number: 45892101, txCount: 215, time: "9s ago", validator: "SoulwareAI-Node-1", gasUsed: "18.2M", reward: "0.18" },
  { number: 45892100, txCount: 167, time: "12s ago", validator: "SoulwareAI-Node-3", gasUsed: "14.1M", reward: "0.14" },
  { number: 45892099, txCount: 89, time: "15s ago", validator: "SoulwareAI-Node-2", gasUsed: "7.3M", reward: "0.07" },
  { number: 45892098, txCount: 312, time: "18s ago", validator: "SoulwareAI-Node-1", gasUsed: "24.8M", reward: "0.25" },
];

const RECENT_TXS = [
  { hash: "0xe7b3...4f2a", from: "0x7a3B...f21E", to: "0x1cF9...8b2A", value: "12,500", type: "Transfer", time: "5s", status: "success" },
  { hash: "0xa1c9...7d3b", from: "0x9eD2...3c7F", to: "Presale Contract", value: "3.2 BNB", type: "Buy", time: "12s", status: "success" },
  { hash: "0xf4e2...9a1c", from: "SoulwareAI", to: "0x4bA1...d9E5", value: "45,000", type: "Stake Reward", time: "18s", status: "success" },
  { hash: "0xb8d7...2e5f", from: "0x6fC8...a4B3", to: "Bridge Contract", value: "8,200", type: "Bridge", time: "25s", status: "success" },
  { hash: "0xc3a1...8b4d", from: "DAO Contract", to: "0x2dE7...c1F6", value: "1,500", type: "DAO Reward", time: "32s", status: "success" },
  { hash: "0xd9f5...1c7e", from: "0x3fA9...e2B1", to: "0x8cD4...7a3F", value: "67,500", type: "Transfer", time: "38s", status: "success" },
];

const TOP_HOLDERS = [
  { rank: 1, address: "0xFf01...ed23", balance: "1,800,000", percentage: 10.0, label: "Founder Wallet" },
  { rank: 2, address: "0xC16e...12E9", balance: "1,200,000", percentage: 6.67, label: "DAO Treasury" },
  { rank: 3, address: "0xc0c0...590b", balance: "900,000", percentage: 5.0, label: "Presale Contract" },
  { rank: 4, address: "0x7a3B...f21E", balance: "450,000", percentage: 2.5, label: "Whale" },
  { rank: 5, address: "0x1cF9...8b2A", balance: "320,000", percentage: 1.78, label: "Whale" },
  { rank: 6, address: "0x9eD2...3c7F", balance: "280,000", percentage: 1.56, label: "Staker" },
  { rank: 7, address: "0x4bA1...d9E5", balance: "215,000", percentage: 1.19, label: "Staker" },
  { rank: 8, address: "0x6fC8...a4B3", balance: "190,000", percentage: 1.06, label: "Community" },
  { rank: 9, address: "0x2dE7...c1F6", balance: "175,000", percentage: 0.97, label: "Community" },
  { rank: 10, address: "0x3fA9...e2B1", balance: "160,000", percentage: 0.89, label: "Community" },
];

function LiveBlockCounter() {
  const [block, setBlock] = useState(45892103);
  useEffect(() => {
    const i = setInterval(() => setBlock(b => b + 1), 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}
      className="text-center">
      <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1">Latest Block</div>
      <div className="text-3xl sm:text-4xl font-bold text-white font-mono" data-testid="text-block-number">#{block.toLocaleString()}</div>
    </motion.div>
  );
}

function NetworkActivity() {
  const [tps, setTps] = useState(1247);
  useEffect(() => {
    const i = setInterval(() => setTps(t => t + Math.floor(Math.random() * 20) - 10), 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {[
        { label: "TPS (Live)", value: tps.toLocaleString(), color: "text-cyan-400", live: true },
        { label: "DAG Vertices", value: "2.4B+", color: "text-emerald-400" },
        { label: "Active Addresses", value: "48,291", color: "text-purple-400" },
        { label: "Gas Price", value: "3.2 Gwei", color: "text-yellow-400" },
      ].map((s, i) => (
        <div key={i} className="glass-card rounded-xl p-3 sm:p-4 text-center border border-white/5">
          <div className="text-[10px] sm:text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
            {s.label}
            {s.live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </div>
          <div className={`text-lg sm:text-xl font-bold ${s.color} font-mono`}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

export default function Explorer() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Eye className="w-4 h-4" /> DAG Explorer
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-explorer-title">
                AIDAG{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Explorer</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 mb-8 px-2">
                Explore AIDAG's DAG-based transaction graph, real-time blocks, token holders, and autonomous operations across all chains.
              </p>
            </motion.div>

            <div className="flex gap-2 max-w-xl mx-auto mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by address, tx hash, or block..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:border-cyan-500/30 focus:outline-none transition-colors"
                  data-testid="input-explorer-search" />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold text-sm"
                data-testid="button-explorer-search">
                Search
              </button>
            </div>
          </div>

          <div className="mb-8">
            <LiveBlockCounter />
          </div>

          <div className="mb-12">
            <NetworkActivity />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-cyan-400" /> Latest DAG Blocks
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="divide-y divide-white/5">
                  {RECENT_BLOCKS.map((b, i) => (
                    <div key={i} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                          <Box className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm text-cyan-400 font-mono font-bold">#{b.number.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500">{b.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white">{b.txCount} txns</div>
                        <div className="text-[10px] text-slate-500">{b.validator}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> Latest Transactions
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="divide-y divide-white/5">
                  {RECENT_TXS.map((tx, i) => (
                    <div key={i} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          tx.type === "Transfer" ? "bg-white/5 text-white" :
                          tx.type === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
                          tx.type === "Stake Reward" ? "bg-yellow-500/10 text-yellow-400" :
                          tx.type === "Bridge" ? "bg-cyan-500/10 text-cyan-400" :
                          "bg-purple-500/10 text-purple-400"
                        }`}>
                          {tx.type === "Transfer" ? <ArrowUpRight className="w-4 h-4" /> :
                           tx.type === "Buy" ? <Zap className="w-4 h-4" /> :
                           tx.type === "Bridge" ? <Layers className="w-4 h-4" /> :
                           <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm text-white font-mono">{tx.hash}</div>
                          <div className="text-[10px] text-slate-500">{tx.from} → {tx.to}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white font-bold">{tx.value}</div>
                        <div className="text-[10px] text-slate-500">{tx.time} ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> Top AIDAG Holders
            </h3>
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-top-holders">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/50">
                      <th className="text-left p-3 sm:p-4 text-xs text-slate-400 font-medium">Rank</th>
                      <th className="text-left p-3 sm:p-4 text-xs text-slate-400 font-medium">Address</th>
                      <th className="text-left p-3 sm:p-4 text-xs text-slate-400 font-medium hidden sm:table-cell">Label</th>
                      <th className="text-right p-3 sm:p-4 text-xs text-slate-400 font-medium">Balance</th>
                      <th className="text-right p-3 sm:p-4 text-xs text-slate-400 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {TOP_HOLDERS.map(h => (
                      <tr key={h.rank} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 sm:p-4">
                          <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-bold ${
                            h.rank <= 3 ? "bg-yellow-500/10 text-yellow-400" : "bg-white/5 text-slate-400"
                          }`}>{h.rank}</span>
                        </td>
                        <td className="p-3 sm:p-4 text-cyan-400 font-mono text-xs">{h.address}</td>
                        <td className="p-3 sm:p-4 hidden sm:table-cell">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-slate-300 border border-white/5">{h.label}</span>
                        </td>
                        <td className="p-3 sm:p-4 text-right text-white font-bold">{h.balance}</td>
                        <td className="p-3 sm:p-4 text-right text-slate-400">{h.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
