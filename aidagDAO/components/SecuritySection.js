export default function SecuritySection({ id = "features" }) {
  return (
    <section id={id} className="py-16 px-4 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-cyan-900/5 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{textShadow: '0 0 30px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)'}}>
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Technology</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="security-card-glow bg-gray-900/80 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/40 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, transparent 50%, rgba(6,182,212,0.1) 100%)', opacity: 0}} />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center" style={{boxShadow: '0 0 25px rgba(139, 92, 246, 0.2), inset 0 0 15px rgba(139, 92, 246, 0.05)'}}>
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.7))'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full" style={{boxShadow: '0 0 10px rgba(139, 92, 246, 0.15)'}}>
                  SECURITY
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{textShadow: '0 0 15px rgba(139, 92, 246, 0.2)'}}>6-Layer Quantum Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Full immunity against quantum computer attacks with NIST-approved post-quantum cryptography (CRYSTALS-Kyber, Dilithium, SPHINCS+).
              </p>
            </div>
          </div>

          <div className="security-card-glow bg-gray-900/80 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/40 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center" style={{boxShadow: '0 0 25px rgba(139, 92, 246, 0.2), inset 0 0 15px rgba(139, 92, 246, 0.05)'}}>
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.7))'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
                  CONSENSUS
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{textShadow: '0 0 15px rgba(6, 182, 212, 0.2)'}}>DAG Consensus Protocol</h3>
              <p className="text-gray-400 leading-relaxed">
                Directed Acyclic Graph structure enabling parallel transaction processing, &lt;0.001s finality, and blockless unlimited scalability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
