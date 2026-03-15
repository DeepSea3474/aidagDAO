import { motion } from "framer-motion";
import { PieChart, Lock, Bot, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TOKENOMICS } from "@/lib/web3Config";

const TOTAL = TOKENOMICS.totalSupply;
const soulwareAmount = TOKENOMICS.soulwareDaoWallet.amount;
const founderAmount = TOKENOMICS.founderWallet.amount;
const soulwarePct = +((soulwareAmount / TOTAL) * 100).toFixed(2);
const founderPct = +((founderAmount / TOTAL) * 100).toFixed(2);

const segments = [
  {
    labelKey: "tokenomics.soulwareDaoLabel",
    fallback: "SoulwareAI + DAO",
    percent: soulwarePct,
    amount: soulwareAmount.toLocaleString(),
    color: "#06b6d4",
    icon: <Bot className="w-4 h-4" />,
    descKey: "tokenomics.soulwareDaoDesc",
    descFallback: "Bonus, DEX/CEX liquidity, system coins — autonomously distributed on-chain by SoulwareAI",
  },
  {
    labelKey: "tokenomics.founderLabel",
    fallback: "Founder (1 Year Locked)",
    percent: founderPct,
    amount: founderAmount.toLocaleString(),
    color: "#a855f7",
    icon: <Lock className="w-4 h-4" />,
    descKey: "tokenomics.founderDesc",
    descFallback: "Locked for 1 year from listing date",
  },
];

function DonutChart() {
  const { t } = useTranslation();
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        {segments.map((seg, i) => {
          const dashoffset = circumference * (1 - cumulativePercent / 100);
          cumulativePercent += seg.percent;
          return (
            <motion.circle
              key={i}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeLinecap="butt"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: dashoffset - (seg.percent / 100) * circumference + circumference }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${seg.color}40)` }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs text-slate-400 mb-1">{t("tokenomics.totalSupply", "Total Supply")}</div>
        <div className="text-2xl sm:text-3xl font-bold text-white font-display">{(TOTAL / 1e6).toFixed(0)}M</div>
        <div className="text-xs text-cyan-400 font-bold mt-1">AIDAG</div>
      </div>
    </div>
  );
}

export default function Tokenomics() {
  const { t } = useTranslation();

  return (
    <section id="tokenomics" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-[150px] orb-animate" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px] orb-animate-reverse" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-6">
              <PieChart className="w-3.5 h-3.5" /> {t("tokenomics.badge", "Token Economics")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display" data-testid="text-tokenomics-title">
              AIDAG{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400">
                {t("tokenomics.title", "Tokenomics")}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              {t("tokenomics.subtitle", "Fixed supply, transparent distribution. 17,999,000 AIDAG autonomously managed by SoulwareAI — 3,001,000 founder tokens locked for 1 year.")}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <DonutChart />
          </motion.div>

          <div className="space-y-4">
            {segments.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                data-testid={`tokenomics-segment-${i}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${seg.color}15`, color: seg.color }}>
                    {seg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{t(seg.labelKey, seg.fallback)}</span>
                      <span className="text-sm font-bold font-display" style={{ color: seg.color }}>{seg.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: seg.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${seg.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-1">{seg.amount} AIDAG</div>
                <div className="text-xs text-slate-400">{t(seg.descKey, seg.descFallback)}</div>
                {i === 1 && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-purple-400">
                    <Wallet className="w-3 h-3" />
                    <span className="font-mono">{TOKENOMICS.founderWallet.address.slice(0, 10)}...{TOKENOMICS.founderWallet.address.slice(-8)}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: t("tokenomics.burnPerTx", "1% Burn Per TX"), value: t("tokenomics.deflationary", "Deflationary"), color: "text-red-400" },
            { label: t("tokenomics.buyback", "Quarterly Buy-back"), value: t("tokenomics.daoVoted", "DAO Voted"), color: "text-yellow-400" },
            { label: t("tokenomics.annualTarget", "Annual Target"), value: "-5% Supply", color: "text-emerald-400" },
            { label: t("tokenomics.revenueModel", "Revenue Model"), value: t("tokenomics.realYield", "Real Yield"), color: "text-cyan-400" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className={`text-sm font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-[10px] text-slate-500">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
