import { motion } from "framer-motion";
import { Brain, ShieldCheck, GitBranch, Bot, Vote, Layers, Atom, Fingerprint, BarChart3, Gauge, Sparkles, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: <Brain className="w-7 h-7 text-cyan-400" />,
    title: "SoulwareAI Autonomous Engine",
    description: "World's first AI engine that autonomously designs, develops, and optimizes blockchain without any human intervention. Self-evolving 24/7.",
    neon: "neon-icon-cyan",
    tag: "Core",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
    title: "6-Layer Quantum Security",
    description: "NIST-approved post-quantum cryptography (CRYSTALS-Kyber, Dilithium, SPHINCS+) providing immunity against quantum computer attacks.",
    neon: "neon-icon-emerald",
    tag: "Security",
  },
  {
    icon: <GitBranch className="w-7 h-7 text-purple-400" />,
    title: "DAG Consensus Protocol",
    description: "Directed Acyclic Graph structure enabling parallel transaction processing, <0.001s finality, and unlimited scalability without blocks.",
    neon: "neon-icon-purple",
    tag: "Consensus",
  },
  {
    icon: <Vote className="w-7 h-7 text-blue-400" />,
    title: "DAO Self-Governance",
    description: "Fully decentralized governance where community votes on all protocol changes. SoulwareAI autonomously implements approved proposals.",
    neon: "neon-icon-blue",
    tag: "Governance",
  },
  {
    icon: <Layers className="w-7 h-7 text-yellow-400" />,
    title: "Multi-Chain Parallel Execution",
    description: "Native operation on BSC + Ethereum simultaneously with atomic cross-chain transactions and synchronized DAG state.",
    neon: "neon-icon-yellow",
    tag: "Multi-Chain",
  },
  {
    icon: <Fingerprint className="w-7 h-7 text-orange-400" />,
    title: "Zero-Knowledge Proofs (ZKP)",
    description: "zk-SNARK verification validates transactions without revealing sender, receiver, or amounts. Full privacy with quantum resistance.",
    neon: "neon-icon-orange",
    tag: "Privacy",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-pink-400" />,
    title: "AI Predictive Analytics",
    description: "SoulwareAI's ML models analyze 500M+ data points for market predictions, risk assessment, and trading signals shared with stakers.",
    neon: "neon-icon-pink",
    tag: "AI",
  },
  {
    icon: <Gauge className="w-7 h-7 text-violet-400" />,
    title: "Dynamic Fee Optimization",
    description: "AI-powered gas fee adjustment in real-time based on network demand. Always optimal fees, never overpaying, never stuck transactions.",
    neon: "neon-icon-violet",
    tag: "Optimization",
  },
  {
    icon: <Lock className="w-7 h-7 text-cyan-400" />,
    title: "Quantum Security-as-a-Service",
    description: "Other blockchains pay AIDAG for quantum protection. Revenue from QSaaS is distributed to AIDAG token holders and stakers.",
    neon: "neon-icon-cyan",
    tag: "Revenue",
  },
];

export default function Features() {
  const { t } = useTranslation();

  const translatedFeatures = features.map((feature, index) => ({
    ...feature,
    title: t(`featuresPage.feature${index + 1}Title`),
    description: t(`featuresPage.feature${index + 1}Desc`),
  }));

  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-900/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-900/10 blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Atom className="w-3.5 h-3.5" /> {t("featuresPage.badge")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display" data-testid="text-features-title">
              {t("featuresPage.title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500">{t("featuresPage.titleHighlight")}</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              {t("featuresPage.subtitle")}
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {translatedFeatures.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.5 }}
              className="glass-card p-6 sm:p-8 rounded-2xl group hover:border-cyan-500/20 transition-all neon-card"
              data-testid={`card-feature-${index}`}>
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className={`neon-icon ${feature.neon}`}>
                  {feature.icon}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-400 border border-white/5 uppercase tracking-wider">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 font-display">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
