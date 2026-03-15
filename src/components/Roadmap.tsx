import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Roadmap() {
  const { t } = useTranslation();

  const phases = [
    {
      quarter: "Phase 1", title: t("roadmap.phase1", "Genesis & SoulwareAI Integration"),
      items: t("roadmap.phase1Items", { returnObjects: true }) as string[],
      status: "completed"
    },
    {
      quarter: "Phase 2", title: t("roadmap.phase2", "AI Autonomous Development"),
      items: t("roadmap.phase2Items", { returnObjects: true }) as string[],
      status: "completed"
    },
    {
      quarter: "Phase 3", title: t("roadmap.phase3", "Ecosystem Expansion"),
      items: t("roadmap.phase3Items", { returnObjects: true }) as string[],
      status: "active"
    },
    {
      quarter: "Phase 4", title: t("roadmap.phase4", "Full Autonomy & Scale"),
      items: t("roadmap.phase4Items", { returnObjects: true }) as string[],
      status: "upcoming"
    },
    {
      quarter: "Phase 5", title: t("roadmap.phase5", "Quantum Security Standard"),
      items: t("roadmap.phase5Items", { returnObjects: true }) as string[],
      status: "upcoming"
    },
    {
      quarter: "Phase 6", title: t("roadmap.phase6", "Global Financial Infrastructure"),
      items: t("roadmap.phase6Items", { returnObjects: true }) as string[],
      status: "upcoming"
    }
  ];

  return (
    <section id="roadmap" className="py-24 bg-slate-950 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display" data-testid="text-roadmap-title">
              {t("roadmap.title", "Evolution")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{t("roadmap.titleHighlight", "Roadmap")}</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t("roadmap.subtitle", "AIDAG Chain's autonomous evolution journey — from genesis to global financial infrastructure. Guided by AI, approved by DAO.")}
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 md:-translate-x-1/2" />

          {phases.map((phase, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              data-testid={`roadmap-phase-${index}`}>
              <div className="hidden md:block w-1/2" />
              <div className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-2 border-slate-950 md:-translate-x-1/2 mt-6 z-10 ${
                phase.status === "completed" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                phase.status === "active" ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" :
                "bg-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
              }`} />
              <div className="flex-1 pl-8 md:pl-0">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <span className={`text-sm font-bold uppercase tracking-wider ${
                      phase.status === "completed" ? "text-emerald-400" :
                      phase.status === "active" ? "text-cyan-400" : "text-purple-400"
                    }`}>{phase.quarter}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      phase.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                      phase.status === "active" ? "bg-cyan-500/20 text-cyan-400 animate-pulse" : "bg-purple-500/10 text-purple-400"
                    }`}>
                      {phase.status === "completed" ? t("roadmap.completed", "COMPLETED") : phase.status === "active" ? t("roadmap.inProgress", "IN PROGRESS") : t("roadmap.upcoming", "UPCOMING")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          phase.status === "completed" ? "bg-emerald-500" :
                          phase.status === "active" ? "bg-cyan-500" : "bg-purple-500/50"
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
