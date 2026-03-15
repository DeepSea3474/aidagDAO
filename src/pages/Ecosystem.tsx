import { motion } from "framer-motion";
import {
  Globe, Shield, Brain, Layers, Zap, TrendingUp,
  CheckCircle, ArrowRight, ExternalLink, Code2, Cpu,
  Database, Lock, Users, Sparkles, Rocket, Target,
  GitBranch, Wifi, Box, BarChart3
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const QSAAS_CLIENTS = [
  { name: "Bitcoin Lightning", desc: "Quantum-safe channel encryption for Lightning Network payments", status: "Active", chains: "BTC L2", revenue: "$45K/mo" },
  { name: "Ethereum L2s", desc: "Post-quantum signature verification for Optimistic & ZK rollups", status: "Active", chains: "ETH L2", revenue: "$120K/mo" },
  { name: "Solana DeFi", desc: "Quantum-resistant key management for Solana DeFi protocols", status: "Active", chains: "SOL", revenue: "$85K/mo" },
  { name: "Polygon zkEVM", desc: "Quantum-safe zero-knowledge proof generation enhancement", status: "Integration", chains: "MATIC", revenue: "Pending" },
  { name: "Avalanche Subnets", desc: "Post-quantum consensus protection for Avalanche subnet validators", status: "Integration", chains: "AVAX", revenue: "Pending" },
  { name: "Cosmos IBC", desc: "Quantum-encrypted inter-blockchain communication channels", status: "Development", chains: "ATOM", revenue: "Q3 2025" },
];

const DEFI_INTEGRATIONS = [
  { name: "AiDAG Swap", desc: "Decentralized exchange with quantum-secure order matching", status: "Live", icon: <ArrowRight className="w-5 h-5" />, color: "text-cyan-400" },
  { name: "AiDAG Lending", desc: "Borrow/lend with AI-optimized interest rates and quantum-safe collateral", status: "Live", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-400" },
  { name: "AiDAG Vault", desc: "Auto-compounding yield vaults managed by SoulwareAI algorithms", status: "Live", icon: <Lock className="w-5 h-5" />, color: "text-purple-400" },
  { name: "AiDAG NFT Market", desc: "Quantum-secure NFT marketplace with AI-generated authenticity verification", status: "Beta", icon: <Sparkles className="w-5 h-5" />, color: "text-pink-400" },
  { name: "AiDAG Insurance", desc: "Decentralized insurance pool with AI risk assessment for smart contracts", status: "Development", icon: <Shield className="w-5 h-5" />, color: "text-yellow-400" },
  { name: "AiDAG Launchpad", desc: "Token launchpad for new projects seeking quantum security infrastructure", status: "Development", icon: <Rocket className="w-5 h-5" />, color: "text-orange-400" },
];

const DEV_RESOURCES = [
  { title: "QSaaS SDK", desc: "Integrate quantum security into any blockchain in 5 minutes", lang: "TypeScript / Rust", downloads: "12.4K" },
  { title: "AIDAG Smart Contract Templates", desc: "Pre-built quantum-safe smart contract templates for DeFi", lang: "Solidity", downloads: "8.7K" },
  { title: "SoulwareAI API", desc: "Access AI predictive analytics and autonomous optimization", lang: "REST / GraphQL", downloads: "6.2K" },
  { title: "Cross-Chain Bridge SDK", desc: "Build custom bridge integrations between any EVM chain", lang: "TypeScript", downloads: "4.8K" },
];

function EcosystemStats() {
  const stats = [
    { label: "QSaaS Revenue", value: "$250K+/mo", icon: <Shield className="w-5 h-5" />, color: "text-emerald-400", desc: "Monthly recurring" },
    { label: "Partner Chains", value: "12+", icon: <Globe className="w-5 h-5" />, color: "text-cyan-400", desc: "Blockchains served" },
    { label: "DeFi TVL", value: "$18.4M", icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-400", desc: "Total value locked" },
    { label: "Developers", value: "2,400+", icon: <Code2 className="w-5 h-5" />, color: "text-yellow-400", desc: "Building on AIDAG" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6 text-center border border-white/5">
          <div className={`${s.color} mx-auto mb-2 sm:mb-3`}>{s.icon}</div>
          <div className="text-lg sm:text-2xl font-bold text-white font-display mb-1">{s.value}</div>
          <div className="text-[10px] sm:text-xs text-slate-400">{s.label}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Ecosystem() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Globe className="w-4 h-4" /> Ecosystem & QSaaS
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-ecosystem-title">
                AIDAG{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500">Ecosystem</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 px-2">
                AIDAG is not just a cryptocurrency - it's the world's first Quantum Security-as-a-Service (QSaaS) provider.
                Every blockchain that integrates AIDAG's quantum protection generates revenue shared with AIDAG holders.
              </p>
            </motion.div>
          </div>

          <EcosystemStats />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
                Quantum Security-as-a-Service <span className="text-emerald-400">(QSaaS)</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                Other blockchains pay AIDAG for quantum security protection. This revenue is distributed to AIDAG stakers and holders.
              </p>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="p-4 border-b border-white/5 bg-emerald-900/20 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" /> QSaaS Partner Blockchains
                </span>
                <span className="text-xs text-emerald-400 font-bold">Revenue flows to AIDAG holders</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-qsaas-clients">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/30">
                      <th className="text-left p-3 sm:p-4 text-xs text-slate-400 font-medium">Partner Chain</th>
                      <th className="text-left p-3 sm:p-4 text-xs text-slate-400 font-medium hidden md:table-cell">Service</th>
                      <th className="text-left p-3 sm:p-4 text-xs text-slate-400 font-medium">Status</th>
                      <th className="text-right p-3 sm:p-4 text-xs text-slate-400 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {QSAAS_CLIENTS.map((c, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 sm:p-4">
                          <div className="text-white font-bold">{c.name}</div>
                          <div className="text-[10px] text-slate-500 md:hidden">{c.desc}</div>
                        </td>
                        <td className="p-3 sm:p-4 text-xs text-slate-400 hidden md:table-cell">{c.desc}</td>
                        <td className="p-3 sm:p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                            c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            c.status === "Integration" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}>{c.status}</span>
                        </td>
                        <td className="p-3 sm:p-4 text-right text-emerald-400 font-bold text-xs">{c.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">DeFi Ecosystem</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                A complete DeFi suite built on quantum-secure infrastructure, autonomously managed by SoulwareAI.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFI_INTEGRATIONS.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-colors group"
                  data-testid={`card-defi-${i}`}>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${d.color} group-hover:scale-110 transition-transform`}>
                      {d.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                      d.status === "Live" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      d.status === "Beta" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>{d.status}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{d.name}</h4>
                  <p className="text-xs text-slate-400">{d.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">Developer Resources</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                Build quantum-secure applications on AIDAG with our comprehensive SDK and API toolkit.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {DEV_RESOURCES.map((r, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-purple-500/20 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <h4 className="text-white font-bold">{r.title}</h4>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded">{r.lang}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{r.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{r.downloads} downloads</span>
                    <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">View Docs <ExternalLink className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center">
            <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto border border-purple-500/20 shadow-[0_0_60px_rgba(147,51,234,0.1)]">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-display">
                Why Every Blockchain Needs AIDAG
              </h3>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                Quantum computers will break current encryption within 5-10 years. AIDAG is the only blockchain
                offering Quantum Security-as-a-Service. Every chain that integrates generates revenue for AIDAG holders.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-emerald-400 font-display mb-1">$3M+</div>
                  <div className="text-xs text-slate-400">Projected Annual QSaaS Revenue</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-cyan-400 font-display mb-1">50+</div>
                  <div className="text-xs text-slate-400">Target Partner Chains by 2026</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-purple-400 font-display mb-1">100%</div>
                  <div className="text-xs text-slate-400">Revenue Shared with Holders</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
