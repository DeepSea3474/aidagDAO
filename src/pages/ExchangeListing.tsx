import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Activity, CheckCircle, Clock, AlertTriangle, ArrowRight,
  Globe, Shield, Zap, TrendingUp, Eye, Send, RefreshCw,
  Layers, Target, BarChart3, Wallet, Lock, Brain, CircleDot,
  ExternalLink
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { CONTRACT_ADDRESSES } from "@/lib/web3Config";

const DEX_EXCHANGES = [
  {
    name: "PancakeSwap",
    type: "DEX",
    chain: "BSC",
    logo: "🥞",
    priority: 1,
    liquidityRequired: "$50,000",
    pairs: ["AIDAG/BNB", "AIDAG/USDT"],
    applicationUrl: "https://github.com/pancakeswap/token-list",
    requirements: ["BEP-20 verified contract", "Liquidity pool created", "Token info JSON", "96x96 SVG logo"],
    automationSteps: [
      "SoulwareAI verifies smart contract on BSCScan",
      "Liquidity pool AIDAG/BNB created autonomously",
      "Token metadata submitted to PancakeSwap token list",
      "Initial liquidity funded from presale allocation",
      "Market maker bot activated for price stability",
    ],
  },
  {
    name: "Uniswap V3",
    type: "DEX",
    chain: "Ethereum",
    logo: "🦄",
    priority: 2,
    liquidityRequired: "$100,000",
    pairs: ["AIDAG/ETH", "AIDAG/USDT"],
    applicationUrl: "https://github.com/Uniswap/token-lists",
    requirements: ["ERC-20 verified contract", "Liquidity pool created", "Token info JSON", "128x128 SVG logo"],
    automationSteps: [
      "SoulwareAI deploys ERC-20 contract on Ethereum",
      "Liquidity pool AIDAG/ETH created via Uniswap V3",
      "Token metadata submitted to Uniswap default list",
      "Concentrated liquidity positions optimized by AI",
      "Cross-chain bridge activated for BSC↔ETH",
    ],
  },
  {
    name: "SushiSwap",
    type: "DEX",
    chain: "Multi-chain",
    logo: "🍣",
    priority: 3,
    liquidityRequired: "$30,000",
    pairs: ["AIDAG/ETH", "AIDAG/USDT"],
    applicationUrl: "https://github.com/sushiswap/list",
    requirements: ["Verified contract", "Community token list PR", "SVG logo", "Token metadata"],
    automationSteps: [
      "SoulwareAI submits PR to SushiSwap token list",
      "Liquidity pair created on SushiSwap",
      "Farming pool proposal submitted",
      "Cross-chain deployment verified",
    ],
  },
  {
    name: "1inch",
    type: "DEX Aggregator",
    chain: "Multi-chain",
    logo: "🔄",
    priority: 4,
    liquidityRequired: "$20,000",
    pairs: ["Aggregated"],
    applicationUrl: "https://github.com/1inch/token-list",
    requirements: ["Sufficient DEX liquidity", "Verified contract", "Token list PR"],
    automationSteps: [
      "Automatically aggregated after PancakeSwap/Uniswap listing",
      "SoulwareAI submits to 1inch token list",
      "Optimal routing paths configured",
    ],
  },
];

const CEX_EXCHANGES = [
  {
    name: "Gate.io",
    type: "CEX",
    tier: "Tier-2",
    logo: "🏛️",
    priority: 1,
    liquidityRequired: "$100,000",
    tradingVolume: "$500K+/day",
    applicationUrl: "https://www.gate.io/listing",
    requirements: ["256x256 SVG logo", "Audit report", "Whitepaper", "Team info", "Tokenomics", "Trading volume proof", "Legal opinion"],
    automationSteps: [
      "SoulwareAI compiles application package autonomously",
      "Brand kit + SVG assets generated and attached",
      "Tokenomics & audit documentation prepared",
      "Application submitted via Gate.io listing portal",
      "Follow-up communications managed by SoulwareAI",
      "Market maker integration upon approval",
    ],
  },
  {
    name: "MEXC",
    type: "CEX",
    tier: "Tier-2",
    logo: "Ⓜ️",
    priority: 2,
    liquidityRequired: "$75,000",
    tradingVolume: "$300K+/day",
    applicationUrl: "https://www.mexc.com/listing",
    requirements: ["200x200 logo", "Contract address", "Whitepaper", "Social presence", "Team info", "Project description"],
    automationSteps: [
      "SoulwareAI generates listing application",
      "Community metrics and social proof compiled",
      "Application submitted to MEXC listing team",
      "Integration testing coordinated autonomously",
    ],
  },
  {
    name: "KuCoin",
    type: "CEX",
    tier: "Tier-1",
    logo: "🟢",
    priority: 3,
    liquidityRequired: "$250,000",
    tradingVolume: "$1M+/day",
    applicationUrl: "https://www.kucoin.com/listing",
    requirements: ["256x256 logo", "Verified contract", "Security audit", "Community metrics", "Trading volume", "Whitepaper", "Legal compliance"],
    automationSteps: [
      "SoulwareAI prepares comprehensive listing dossier",
      "Security audit reports compiled",
      "Community growth metrics documented",
      "Application submitted to KuCoin evaluation team",
      "Technical integration managed by SoulwareAI",
    ],
  },
  {
    name: "Bybit",
    type: "CEX",
    tier: "Tier-1",
    logo: "⚡",
    priority: 4,
    liquidityRequired: "$500,000",
    tradingVolume: "$2M+/day",
    applicationUrl: "https://www.bybit.com/listing",
    requirements: ["256x256 logo", "Full audit", "Legal opinion", "Market maker commitment", "Whitepaper", "Team KYC"],
    automationSteps: [
      "SoulwareAI compiles enterprise-grade application",
      "Legal documentation and compliance review",
      "Market maker partnerships established",
      "Application submitted with full documentation",
    ],
  },
  {
    name: "Binance",
    type: "CEX",
    tier: "Tier-1",
    logo: "🔶",
    priority: 5,
    liquidityRequired: "$1,000,000+",
    tradingVolume: "$5M+/day",
    applicationUrl: "https://www.binance.com/en/my/coin-apply",
    requirements: ["All previous requirements", "Significant trading volume", "Global community", "Multiple exchange listings", "Institutional backing"],
    automationSteps: [
      "SoulwareAI monitors readiness criteria continuously",
      "Pre-application with Binance Labs prepared",
      "Trading volume and community milestones verified",
      "Full application submitted when all criteria met",
      "Binance Innovation Zone targeting strategy",
    ],
  },
  {
    name: "CoinGecko",
    type: "Aggregator",
    tier: "Listing",
    logo: "🦎",
    priority: 1,
    liquidityRequired: "$10,000",
    tradingVolume: "Any",
    applicationUrl: "https://www.coingecko.com/en/coins/new",
    requirements: ["128x128 PNG logo", "Contract address (verified)", "Website", "Social links", "Description", "Market data"],
    automationSteps: [
      "SoulwareAI submits listing request automatically",
      "Token metadata and market data provided",
      "Community links and documentation attached",
      "Price tracking activated upon listing",
    ],
  },
  {
    name: "CoinMarketCap",
    type: "Aggregator",
    tier: "Listing",
    logo: "📊",
    priority: 2,
    liquidityRequired: "$10,000",
    tradingVolume: "Any",
    applicationUrl: "https://support.coinmarketcap.com/hc/en-us/articles/360043659351",
    requirements: ["200x200 logo", "Contract address", "Website + Whitepaper", "Explorer link", "Community links"],
    automationSteps: [
      "SoulwareAI compiles CoinMarketCap application",
      "Self-reporting dashboard configured",
      "Market pair data and exchange links provided",
      "Listing verified and price tracking enabled",
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Pending" },
    monitoring: { icon: Eye, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "Monitoring Liquidity" },
    preparing: { icon: RefreshCw, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", label: "Preparing Application" },
    submitted: { icon: Send, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", label: "Submitted" },
    approved: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Approved" },
    listed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Listed" },
    rejected: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Under Review" },
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.color}`}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}

function LiquidityMonitor() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (Math.random() * 0.3);
        return next > 100 ? 100 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { label: t("listing.dexReady", "DEX Ready"), threshold: 15, target: "$50K" },
    { label: t("listing.aggregatorReady", "Aggregator Ready"), threshold: 25, target: "$100K" },
    { label: t("listing.tier2Ready", "Tier-2 CEX Ready"), threshold: 50, target: "$250K" },
    { label: t("listing.tier1Ready", "Tier-1 CEX Ready"), threshold: 100, target: "$1M+" },
  ];

  return (
    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          {t("listing.liquidityMonitor", "Liquidity Monitor")}
        </h3>
        <span className="flex items-center gap-1.5 text-xs text-cyan-400">
          <CircleDot className="w-3 h-3 animate-pulse" /> {t("listing.liveMonitoring", "Live Monitoring")}
        </span>
      </div>
      <div className="space-y-3">
        {stages.map((stage) => {
          const reached = progress >= stage.threshold;
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${reached ? "bg-emerald-500" : "bg-white/10"}`}>
                {reached && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${reached ? "text-emerald-400" : "text-slate-400"}`}>{stage.label}</span>
                  <span className="text-xs text-slate-500">{stage.target}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${reached ? "bg-emerald-500" : "bg-cyan-500/50"}`}
                    style={{ width: `${Math.min((progress / stage.threshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FounderRevenueSection() {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("listing.founderRevenue", "AIDAG Chain Development Fee")}
          </h3>
          <p className="text-xs text-slate-400">
            {t("listing.founderRevenueSubtitle", "Autonomous — Independent of DAO decisions")}
          </p>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          <Brain className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-slate-200">
              {t("listing.founderRevenueDesc1", "The founder development fee percentage is dynamically determined by SoulwareAI based on ecosystem profit levels.")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          <Layers className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-slate-200">
              {t("listing.founderRevenueDesc2", "Transferred directly from AIDAG transaction layers to the founder wallet. This revenue is completely independent of DAO decisions and DAO governance cannot intervene.")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-md bg-white/5">
          <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-slate-200">
              {t("listing.founderRevenueDesc3", "This is the AIDAG Chain development fee — allocated as founder and SoulwareAI team share to sustain continuous protocol development, infrastructure, and ecosystem growth.")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-md bg-purple-500/10 border border-purple-500/20">
        <Wallet className="w-5 h-5 text-purple-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-slate-400 mb-1">{t("listing.founderWalletLabel", "Founder Wallet (Development Fee Recipient)")}</p>
          <p className="text-xs font-mono text-purple-300 truncate">{CONTRACT_ADDRESSES.founderWallet}</p>
        </div>
      </div>
    </div>
  );
}

export default function ExchangeListing() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"overview" | "dex" | "cex">("overview");

  const { data: listings } = useQuery<any[]>({
    queryKey: ["/api/exchange-listings"],
  });

  const getExchangeStatus = (name: string) => {
    const listing = listings?.find((l: any) => l.exchangeName === name);
    return listing?.status || "monitoring";
  };

  const totalExchanges = DEX_EXCHANGES.length + CEX_EXCHANGES.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              {t("listing.badge", "SoulwareAI Autonomous Exchange Operations")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("listing.title", "Autonomous")} <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{t("listing.titleHighlight", "Exchange Listing")}</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              {t("listing.subtitle", "SoulwareAI autonomously monitors liquidity, prepares applications, and submits listing requests to major DEX and CEX platforms when targets are met.")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: t("listing.targetExchanges", "Target Exchanges"), value: totalExchanges.toString(), icon: Globe, color: "text-cyan-400" },
              { label: t("listing.dexTargets", "DEX Targets"), value: DEX_EXCHANGES.length.toString(), icon: Zap, color: "text-emerald-400" },
              { label: t("listing.cexTargets", "CEX Targets"), value: CEX_EXCHANGES.length.toString(), icon: BarChart3, color: "text-purple-400" },
              { label: t("listing.autonomousOps", "Autonomous Ops"), value: "24/7", icon: Brain, color: "text-yellow-400" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-center"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <LiquidityMonitor />
            <FounderRevenueSection />
          </div>

          <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
            {[
              { id: "overview" as const, label: t("listing.tabOverview", "Autonomous Pipeline") },
              { id: "dex" as const, label: t("listing.tabDex", "DEX Listings") },
              { id: "cex" as const, label: t("listing.tabCex", "CEX Listings") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover-elevate"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  {t("listing.autonomousPipeline", "SoulwareAI Autonomous Listing Pipeline")}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {t("listing.pipelineDesc", "When presale completes and planned liquidity is formed, SoulwareAI autonomously executes the following pipeline for each target exchange.")}
                </p>
                <div className="space-y-4">
                  {[
                    { step: 1, title: t("listing.step1", "Liquidity Monitoring"), desc: t("listing.step1Desc", "SoulwareAI continuously monitors presale progress and liquidity pool formation across BSC and Ethereum networks."), icon: Eye, color: "text-cyan-400" },
                    { step: 2, title: t("listing.step2", "Threshold Detection"), desc: t("listing.step2Desc", "When planned liquidity targets are met, SoulwareAI triggers the autonomous application process for qualifying exchanges."), icon: Target, color: "text-emerald-400" },
                    { step: 3, title: t("listing.step3", "Application Preparation"), desc: t("listing.step3Desc", "Brand kit (SVG logos), token metadata, audit reports, whitepaper, team info, and tokenomics are compiled into exchange-specific application packages."), icon: Layers, color: "text-purple-400" },
                    { step: 4, title: t("listing.step4", "Smart Contract Verification"), desc: t("listing.step4Desc", "Token contracts are verified on BSCScan and Etherscan. Liquidity pools are created with optimal parameters calculated by SoulwareAI."), icon: Shield, color: "text-yellow-400" },
                    { step: 5, title: t("listing.step5", "Autonomous Submission"), desc: t("listing.step5Desc", "Applications submitted to each exchange platform. DEX token list PRs created on GitHub. CEX listing forms completed with all required documentation."), icon: Send, color: "text-cyan-400" },
                    { step: 6, title: t("listing.step6", "Post-Listing Operations"), desc: t("listing.step6Desc", "Market maker bots activated, liquidity optimized, price feeds configured, and AIDAG Chain Development Fee (founder & SoulwareAI team share) autonomously transferred from transaction layers to founder wallet — percentage determined by SoulwareAI based on profit levels, independent of DAO. Token burn mechanism to be proposed by community once DAO governance is established."), icon: TrendingUp, color: "text-emerald-400" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        {item.step < 6 && <div className="w-px h-full bg-white/10 mt-2" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs text-slate-500 mb-1">{t("listing.stepLabel", "Step")} {item.step}</p>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t("listing.revenueModel", "Revenue Distribution on Listing")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md bg-white/5">
                    <p className="text-2xl font-bold text-emerald-400 mb-1">40%</p>
                    <p className="text-sm text-slate-300">{t("listing.daoStakers", "DAO Members & Stakers")}</p>
                    <p className="text-xs text-slate-500">{t("listing.daoStakersDesc", "Ecosystem revenue share distributed via smart contract")}</p>
                  </div>
                  <div className="p-4 rounded-md bg-white/5">
                    <p className="text-2xl font-bold text-purple-400 mb-1">{t("listing.dynamicPercent", "Dynamic")}</p>
                    <p className="text-sm text-slate-300">{t("listing.founderDev", "AIDAG Chain Development Fee")}</p>
                    <p className="text-xs text-slate-500">{t("listing.founderDevDesc", "Determined by SoulwareAI, transferred to founder wallet from transaction layers")}</p>
                  </div>
                  <div className="p-4 rounded-md bg-white/5">
                    <p className="text-2xl font-bold text-cyan-400 mb-1">{t("listing.daoProposal", "DAO Proposal")}</p>
                    <p className="text-sm text-slate-300">{t("listing.tokenBurn", "Token Burn Mechanism")}</p>
                    <p className="text-xs text-slate-500">{t("listing.tokenBurnDesc", "To be proposed by the community once DAO governance is established")}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "dex" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {DEX_EXCHANGES.map((exchange) => (
                <div key={exchange.name} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exchange.logo}</span>
                      <div>
                        <h3 className="font-semibold text-white">{exchange.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{exchange.type}</span>
                          <span className="text-xs text-slate-500">{exchange.chain}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={getExchangeStatus(exchange.name)} />
                      <a
                        href={exchange.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t("listing.requirements", "Requirements")}</p>
                      <ul className="space-y-1">
                        {exchange.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" /> {req}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-4 mt-3">
                        <div>
                          <p className="text-xs text-slate-500">{t("listing.liquidityNeeded", "Liquidity Needed")}</p>
                          <p className="text-sm font-semibold text-cyan-400">{exchange.liquidityRequired}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{t("listing.tradingPairs", "Trading Pairs")}</p>
                          <p className="text-sm text-slate-300">{exchange.pairs.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t("listing.automationSteps", "SoulwareAI Automation Steps")}</p>
                      <ul className="space-y-1.5">
                        {exchange.automationSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <ArrowRight className="w-3 h-3 text-purple-400 mt-1 shrink-0" /> {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "cex" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {CEX_EXCHANGES.map((exchange) => (
                <div key={exchange.name} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exchange.logo}</span>
                      <div>
                        <h3 className="font-semibold text-white">{exchange.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${exchange.type === "CEX" ? "bg-purple-500/10 text-purple-400" : "bg-yellow-500/10 text-yellow-400"}`}>{exchange.type}</span>
                          <span className="text-xs text-slate-500">{exchange.tier}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={getExchangeStatus(exchange.name)} />
                      <a
                        href={exchange.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t("listing.requirements", "Requirements")}</p>
                      <ul className="space-y-1">
                        {exchange.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" /> {req}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-4 mt-3">
                        <div>
                          <p className="text-xs text-slate-500">{t("listing.liquidityNeeded", "Liquidity Needed")}</p>
                          <p className="text-sm font-semibold text-cyan-400">{exchange.liquidityRequired}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{t("listing.dailyVolume", "Daily Volume Target")}</p>
                          <p className="text-sm text-slate-300">{exchange.tradingVolume}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t("listing.automationSteps", "SoulwareAI Automation Steps")}</p>
                      <ul className="space-y-1.5">
                        {exchange.automationSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <ArrowRight className="w-3 h-3 text-purple-400 mt-1 shrink-0" /> {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
