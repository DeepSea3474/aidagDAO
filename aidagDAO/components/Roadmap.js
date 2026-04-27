'use client';
import { useLang } from '../lib/LanguageContext';

export default function Roadmap({ id = "roadmap" }) {
  const { t } = useLang();

  const phases = [
    {
      phase: "PHASE 1",
      titleKey: "rm_p1_title",
      status: "completed",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.7))'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      items: [
        "BSC smart contract deployment & verification",
        "SoulwareAI autonomous engine integration",
        "Quantum-secure cryptography infrastructure",
        "Community building & initial DAO setup"
      ]
    },
    {
      phase: "PHASE 2",
      titleKey: "rm_p2_title",
      status: "completed",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.7))'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      items: [
        "AI autonomous development engine activation",
        "Smart contract upgrade mechanism",
        "SoulwareAI decision engine v2",
        "Security audit reports & monitoring"
      ]
    },
    {
      phase: "PHASE 3",
      titleKey: "rm_p3_title",
      status: "active",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      items: [
        "AIDAG token presale Stage 1 ($0.078)",
        "PancakeSwap & Uniswap DEX listing",
        "Community growth campaign",
        "CEX partnership negotiations (Gate.io, MEXC)"
      ]
    },
    {
      phase: "PHASE 4",
      titleKey: "rm_p4_title",
      status: "upcoming",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(107, 114, 128, 0.5))'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      items: [
        "ETH-BSC bridge activation",
        "Staking & yield farming",
        "AI Smart Contract Auditor (revenue service)",
        "QSaaS beta launch"
      ]
    },
    {
      phase: "PHASE 5",
      titleKey: "rm_p5_title",
      status: "upcoming",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(107, 114, 128, 0.5))'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      items: [
        "AIDAG DAG Chain mainnet - 100,000+ TPS",
        "Sub-millisecond finality, quantum-secure consensus",
        "BSC → AIDAG Chain token migration bridge",
        "DAG Payment Gateway (0.1% fees)"
      ]
    },
    {
      phase: "PHASE 6",
      titleKey: "rm_p6_title",
      status: "upcoming",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(107, 114, 128, 0.5))'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      items: [
        "QSaaS - Quantum Security-as-a-Service ($10M+ revenue)",
        "AI-Powered Cross-Chain Oracle",
        "Enterprise blockchain solutions",
        "Target: Top 10 cryptocurrency by real utility"
      ]
    }
  ];

  const statusLabel = (status) => {
    if (status === "completed") return { text: t('rm_completed'), color: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (status === "active")    return { text: t('rm_active'),    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" };
    return { text: t('rm_upcoming'), color: "bg-gray-700/50 text-gray-400 border-gray-600" };
  };

  const getIconContainerStyle = (status) => {
    if (status === "completed") return {
      boxShadow: '0 0 20px rgba(34, 197, 94, 0.25), inset 0 0 12px rgba(34, 197, 94, 0.05)'
    };
    if (status === "active") return {
      boxShadow: '0 0 25px rgba(6, 182, 212, 0.3), inset 0 0 15px rgba(6, 182, 212, 0.05)'
    };
    return {
      boxShadow: '0 0 10px rgba(107, 114, 128, 0.1)'
    };
  };

  return (
    <section id={id} className="py-16 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{textShadow: '0 0 30px rgba(6, 182, 212, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)'}}>
            {t('rm_title')}
          </h2>
          <p className="text-gray-400">{t('rm_sub')}</p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const status = statusLabel(phase.status);
            return (
              <div 
                key={index} 
                className={`bg-gray-900/80 border rounded-2xl p-6 md:p-8 transition-all relative overflow-hidden ${
                  phase.status === "active" 
                    ? "border-cyan-500/40 roadmap-active-card" 
                    : "border-gray-800 hover:border-gray-700"
                }`}
                style={phase.status === "active" ? {boxShadow: '0 0 30px rgba(6, 182, 212, 0.15), inset 0 0 30px rgba(6, 182, 212, 0.02)'} : {}}
              >
                {phase.status === "active" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                )}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                          phase.status === "completed" ? "bg-green-500/10 border-green-500/30 text-green-400" :
                          phase.status === "active" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : 
                          "bg-gray-800/50 border-gray-700 text-gray-500"
                        }`}
                        style={getIconContainerStyle(phase.status)}
                      >
                        {phase.icon}
                      </div>
                      <span className={`text-lg font-bold ${
                        phase.status === "completed" ? "text-green-400" :
                        phase.status === "active" ? "text-cyan-400" : "text-gray-500"
                      }`} style={
                        phase.status === "active" ? {textShadow: '0 0 15px rgba(6, 182, 212, 0.4)'} :
                        phase.status === "completed" ? {textShadow: '0 0 15px rgba(34, 197, 94, 0.3)'} : {}
                      }>
                        {phase.phase}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.color}`} style={
                      phase.status === "active" ? {boxShadow: '0 0 12px rgba(6, 182, 212, 0.2)'} : {}
                    }>
                      {status.text}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4" style={
                    phase.status === "active" ? {textShadow: '0 0 15px rgba(6, 182, 212, 0.15)'} : {}
                  }>{t(phase.titleKey)}</h3>
                  
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          phase.status === "completed" ? "bg-green-400" :
                          phase.status === "active" ? "bg-cyan-400" : "bg-gray-600"
                        }`} style={
                          phase.status === "active" ? {boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)'} :
                          phase.status === "completed" ? {boxShadow: '0 0 6px rgba(34, 197, 94, 0.4)'} : {}
                        }></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
