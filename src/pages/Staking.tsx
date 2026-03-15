import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins, Lock, TrendingUp, Clock, Shield, Zap, Gift,
  Calculator, ArrowRight, CheckCircle, Star, Sparkles,
  Wallet, Crown, Layers, Brain, BarChart3, Target
} from "lucide-react";
import { useWallet } from "@/lib/walletContext";
import { BSC_CHAIN_ID, shortenAddress } from "@/lib/web3Config";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const STAKING_TIERS = [
  {
    name: "Flexible",
    duration: "No Lock",
    apy: 5.2,
    minStake: 100,
    color: "from-slate-500 to-slate-400",
    border: "border-slate-500/30",
    glow: "shadow-slate-500/10",
    badge: null,
    benefits: ["Withdraw anytime", "Daily rewards", "Basic DAO weight"],
  },
  {
    name: "Silver",
    duration: "30 Days",
    apy: 8.5,
    minStake: 500,
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/10",
    badge: null,
    benefits: ["1.5x DAO voting power", "Early feature access", "Weekly bonus airdrops"],
  },
  {
    name: "Gold",
    duration: "90 Days",
    apy: 14.8,
    minStake: 2500,
    color: "from-yellow-500 to-orange-500",
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/10",
    badge: "Popular",
    benefits: ["3x DAO voting power", "QSaaS revenue share", "Priority bridge access", "Exclusive NFT drops"],
  },
  {
    name: "Diamond",
    duration: "180 Days",
    apy: 22.5,
    minStake: 10000,
    color: "from-purple-500 to-pink-500",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10",
    badge: "Max Returns",
    benefits: ["5x DAO voting power", "10% QSaaS revenue share", "Governance council seat", "Cross-chain yield boost", "Whale benefits program"],
  },
  {
    name: "Quantum Vault",
    duration: "365 Days",
    apy: 35.0,
    minStake: 50000,
    color: "from-emerald-500 to-cyan-500",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/10",
    badge: "Elite",
    benefits: ["10x DAO voting power", "25% QSaaS revenue share", "Board advisory role", "Private SoulwareAI channel", "Maximum yield multiplier", "Quantum security audit access"],
  },
];

const REVENUE_STREAMS = [
  { name: "Staking APY Rewards", desc: "Earn up to 35% annual yield by locking your AIDAG tokens", icon: <Coins className="w-6 h-6" />, color: "text-yellow-400", earning: "5.2% - 35% APY" },
  { name: "QSaaS Revenue Share", desc: "Share profits from Quantum Security-as-a-Service provided to other blockchains", icon: <Shield className="w-6 h-6" />, color: "text-emerald-400", earning: "Up to 25% revenue share" },
  { name: "DAO Treasury Dividends", desc: "Quarterly distribution from DAO treasury based on holding duration", icon: <Crown className="w-6 h-6" />, color: "text-purple-400", earning: "Quarterly payouts" },
  { name: "Cross-Chain Bridge Fees", desc: "Earn a portion of bridge transaction fees as a staker", icon: <Layers className="w-6 h-6" />, color: "text-cyan-400", earning: "0.1% per bridge tx" },
  { name: "AI Prediction Pool", desc: "SoulwareAI's predictive analytics generate trading signal profits shared with holders", icon: <Brain className="w-6 h-6" />, color: "text-violet-400", earning: "Performance-based" },
  { name: "Referral Rewards", desc: "Earn 3% bonus on every referred user's staking rewards", icon: <Gift className="w-6 h-6" />, color: "text-pink-400", earning: "3% referral bonus" },
];

function StakingCalculator() {
  const [amount, setAmount] = useState(10000);
  const [tier, setTier] = useState(2);
  const selected = STAKING_TIERS[tier];
  const dailyReward = (amount * selected.apy) / 100 / 365;
  const monthlyReward = dailyReward * 30;
  const yearlyReward = (amount * selected.apy) / 100;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
          <Calculator className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Rewards Calculator</h3>
          <p className="text-xs text-slate-400">Estimate your AIDAG staking earnings</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-slate-300 mb-2 block">Stake Amount (AIDAG)</label>
          <input type="range" min={100} max={100000} step={100} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full accent-cyan-500" data-testid="input-calc-amount" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>100</span>
            <span className="text-lg font-bold text-white">{amount.toLocaleString()} AIDAG</span>
            <span>100K</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-2 block">Lock Period</label>
          <div className="grid grid-cols-5 gap-2">
            {STAKING_TIERS.map((t, i) => (
              <button key={i} onClick={() => setTier(i)} data-testid={`button-tier-${i}`}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${
                  tier === i ? `bg-gradient-to-r ${t.color} text-white border-transparent` : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20"
                }`}>
                {t.duration}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 sm:p-4 bg-slate-900/60 rounded-xl text-center border border-white/5">
            <div className="text-[10px] sm:text-xs text-slate-400 mb-1">Daily</div>
            <div className="text-sm sm:text-lg font-bold text-emerald-400">{dailyReward.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500">AIDAG</div>
          </div>
          <div className="p-3 sm:p-4 bg-slate-900/60 rounded-xl text-center border border-white/5">
            <div className="text-[10px] sm:text-xs text-slate-400 mb-1">Monthly</div>
            <div className="text-sm sm:text-lg font-bold text-cyan-400">{monthlyReward.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500">AIDAG</div>
          </div>
          <div className="p-3 sm:p-4 bg-slate-900/60 rounded-xl text-center border border-white/5">
            <div className="text-[10px] sm:text-xs text-slate-400 mb-1">Yearly</div>
            <div className="text-sm sm:text-lg font-bold text-yellow-400">{yearlyReward.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500">AIDAG</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm text-slate-300">Effective APY</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{selected.apy}%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">+ QSaaS revenue share & DAO dividends (not included)</p>
        </div>
      </div>
    </motion.div>
  );
}

function ActiveStakes() {
  const stakes = [
    { id: 1, amount: 25000, tier: "Gold", apy: 14.8, locked: "2025-01-15", unlock: "2025-04-15", earned: 924, status: "active" },
    { id: 2, amount: 10000, tier: "Silver", apy: 8.5, locked: "2025-02-01", unlock: "2025-03-03", earned: 187, status: "active" },
    { id: 3, amount: 50000, tier: "Diamond", apy: 22.5, locked: "2024-12-01", unlock: "2025-05-30", earned: 4125, status: "active" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-cyan-400" /> Active Stakes (Demo)
      </h3>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-active-stakes">
            <thead>
              <tr className="border-b border-white/5 bg-slate-900/50">
                <th className="text-left p-4 text-xs text-slate-400 font-medium">Amount</th>
                <th className="text-left p-4 text-xs text-slate-400 font-medium">Tier</th>
                <th className="text-left p-4 text-xs text-slate-400 font-medium">APY</th>
                <th className="text-left p-4 text-xs text-slate-400 font-medium hidden sm:table-cell">Unlock</th>
                <th className="text-left p-4 text-xs text-slate-400 font-medium">Earned</th>
                <th className="text-left p-4 text-xs text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stakes.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-bold">{s.amount.toLocaleString()}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{s.tier}</span></td>
                  <td className="p-4 text-emerald-400 font-bold">{s.apy}%</td>
                  <td className="p-4 text-slate-400 hidden sm:table-cell">{s.unlock}</td>
                  <td className="p-4 text-yellow-400 font-bold">+{s.earned.toLocaleString()}</td>
                  <td className="p-4"><span className="flex items-center gap-1 text-emerald-400 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function StakingStats() {
  const stats = [
    { label: "Total Staked", value: "4.2M AIDAG", icon: <Lock className="w-5 h-5" />, color: "text-cyan-400" },
    { label: "Total Stakers", value: "2,847", icon: <Wallet className="w-5 h-5" />, color: "text-purple-400" },
    { label: "Rewards Distributed", value: "892K AIDAG", icon: <Gift className="w-5 h-5" />, color: "text-yellow-400" },
    { label: "Avg. APY", value: "18.4%", icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6 text-center border border-white/5">
          <div className={`${s.color} mx-auto mb-2 sm:mb-3`}>{s.icon}</div>
          <div className="text-lg sm:text-2xl font-bold text-white font-display mb-1">{s.value}</div>
          <div className="text-[10px] sm:text-xs text-slate-400">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Staking() {
  const wallet = useWallet();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/8 rounded-full blur-[150px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Coins className="w-4 h-4" /> Stake & Earn
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-staking-title">
                Earn With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400">AIDAG Staking</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 px-2">
                Stake your AIDAG tokens and earn up to 35% APY plus revenue from Quantum Security-as-a-Service,
                DAO dividends, and cross-chain bridge fees. All managed autonomously by SoulwareAI.
              </p>
            </motion.div>
          </div>

          <StakingStats />

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 font-display text-center">Staking Tiers</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {STAKING_TIERS.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className={`glass-card rounded-2xl p-5 sm:p-6 border ${t.border} hover:shadow-lg ${t.glow} transition-all relative group`}
                  data-testid={`card-tier-${i}`}>
                  {t.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold whitespace-nowrap">
                      {t.badge}
                    </div>
                  )}
                  <div className="text-center mb-4 pt-1">
                    <div className={`text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${t.color} font-display`}>
                      {t.apy}%
                    </div>
                    <div className="text-xs text-slate-400">APY</div>
                  </div>
                  <h4 className="text-white font-bold text-center mb-1">{t.name}</h4>
                  <div className="text-xs text-center text-slate-400 mb-4">{t.duration} Lock</div>
                  <div className="text-xs text-center text-cyan-400 mb-4 font-mono">Min: {t.minStake.toLocaleString()} AIDAG</div>
                  <ul className="space-y-2">
                    {t.benefits.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r ${t.color} text-white text-sm font-bold transition-all hover:opacity-90`}
                    data-testid={`button-stake-tier-${i}`}>
                    Stake Now
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <StakingCalculator />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-purple-500/20 shadow-[0_0_40px_rgba(147,51,234,0.1)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">6 Ways to Earn with AIDAG</h3>
                  <p className="text-xs text-slate-400">Multiple passive income streams</p>
                </div>
              </div>
              <div className="space-y-4">
                {REVENUE_STREAMS.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className={`${r.color} flex-shrink-0 mt-0.5`}>{r.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm text-white font-bold">{r.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{r.earning}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <ActiveStakes />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 text-center">
            <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto border border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.1)]">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-display">SoulwareAI Autonomous Staking</h3>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                All staking operations, reward distributions, and yield optimizations are managed autonomously
                by SoulwareAI across BSC and ETH chains. No manual intervention, 24/7 operation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" /> Auto-compound
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
                  <Shield className="w-4 h-4" /> Quantum Secured
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
                  <Brain className="w-4 h-4" /> AI Optimized
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
