import Image from "next/image";

export default function SoulwareSection({ onOpenChat, id = "soulware" }) {
  return (
    <section id={id} className="py-20 px-4 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{textShadow: '0 0 30px rgba(139, 92, 246, 0.2), 0 0 60px rgba(6, 182, 212, 0.1)'}}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">SoulwareAI</span> Engine
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-teal-500/20 rounded-3xl blur-3xl"></div>
              <Image 
                src="/soulwareai-autonomy.jpeg" 
                alt="SoulwareAI Full Autonomy - 100% Autonomous AI Management" 
                width={450} 
                height={600} 
                className="relative rounded-3xl border border-teal-500/20"
                style={{ boxShadow: '0 0 60px rgba(0, 212, 255, 0.15), 0 0 120px rgba(0, 150, 180, 0.08)' }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-xs font-mono tracking-widest">ONLINE - AUTONOMOUS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm px-4 py-2 rounded-full mb-6" style={{boxShadow: '0 0 12px rgba(139, 92, 246, 0.15)'}}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              SELF-EVOLVING AI
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{textShadow: '0 0 20px rgba(139, 92, 246, 0.15)'}}>
              Fully Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI Management</span>
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-500/10 border border-green-500/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{boxShadow: '0 0 15px rgba(34, 197, 94, 0.2), inset 0 0 10px rgba(34, 197, 94, 0.05)'}}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Zero Founder Intervention</h4>
                  <p className="text-gray-500 text-sm">All decisions made autonomously by SoulwareAI. Founder has no authority - only receives operational funds.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-500/10 border border-green-500/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{boxShadow: '0 0 15px rgba(34, 197, 94, 0.2), inset 0 0 10px rgba(34, 197, 94, 0.05)'}}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Self-Evolving Intelligence</h4>
                  <p className="text-gray-500 text-sm">SoulwareAI designs, develops, and deploys all contracts, features, and upgrades autonomously.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-500/10 border border-green-500/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{boxShadow: '0 0 15px rgba(34, 197, 94, 0.2), inset 0 0 10px rgba(34, 197, 94, 0.05)'}}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Revenue-Generating AI</h4>
                  <p className="text-gray-500 text-sm">QSaaS, AI Auditor, DAG Payments, Cross-Chain Oracles - real services that generate real revenue.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-500/10 border border-green-500/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{boxShadow: '0 0 15px rgba(34, 197, 94, 0.2), inset 0 0 10px rgba(34, 197, 94, 0.05)'}}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Own DAG Chain (2027)</h4>
                  <p className="text-gray-500 text-sm">100,000+ TPS, sub-millisecond finality, quantum-secure. From BSC token to native DAG coin.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onOpenChat}
              className="neon-button-purple flex items-center gap-3 relative overflow-hidden group"
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '12px',
                color: '#c084fc',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.2), inset 0 0 15px rgba(139, 92, 246, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.6))'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Talk to SoulwareAI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
