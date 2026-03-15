import { motion } from "framer-motion";
import { Bot, Cpu, RefreshCw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import soulwareAI from "@assets/soulwareai_1770572834003.jpeg";

export default function SoulwareSection() {
  const { t } = useTranslation();

  return (
    <section id="soulware" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-900/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cyan-900/10 blur-[120px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }} className="relative">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 soulware-glow transition-shadow duration-500">
                <img src={soulwareAI} alt="SoulwareAI - Autonomous AI Engine" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest">Online - Autonomous</span>
                  </div>
                  <div className="led-glow">
                    <span className="led-text text-3xl font-bold font-display" data-text="SoulwareAI">
                      SoulwareAI
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm">
                  <span className="text-xs font-bold text-purple-300">AI Engine v2.0</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }} className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Bot className="w-3.5 h-3.5" /> {t("soulware.badge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-4" data-testid="text-soulware-title">
                {t("soulware.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{t("soulware.titleHighlight")}</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {t("soulware.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 transition-all duration-400 group/item">
                <div className="neon-icon neon-icon-purple flex-shrink-0" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem' }}>
                  <Cpu className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{t("soulware.modular")}</h4>
                  <p className="text-sm text-slate-400">{t("soulware.modularDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all duration-400 group/item">
                <div className="neon-icon neon-icon-cyan flex-shrink-0" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem' }}>
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{t("soulware.selfEvolving")}</h4>
                  <p className="text-sm text-slate-400">{t("soulware.selfEvolvingDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-all duration-400 group/item">
                <div className="neon-icon neon-icon-emerald flex-shrink-0" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem' }}>
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{t("soulware.zeroHuman")}</h4>
                  <p className="text-sm text-slate-400">{t("soulware.zeroHumanDesc")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
