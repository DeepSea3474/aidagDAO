import React from 'react';

const Home = () => (
  <div className="pt-24 pb-20">
    <section className="container mx-auto px-6 text-center">
      <h1 className="text-7xl font-black text-white mb-6 uppercase tracking-tight">
        AIDAG <span className="text-cyan-500">CHAIN</span>
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12 font-light">
        Yapay zeka otonomisiyle güçlendirilmiş, merkeziyetsiz bir gelecek. SCL ekosisteminin kalbine hoş geldiniz.
      </p>
      
      {/* Dashboard Preview Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {['Network Health', 'Total Supply', 'Active Nodes', 'Staking APY'].map((item, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <span className="text-xs text-gray-500 uppercase block mb-1">{item}</span>
            <span className="text-2xl font-mono font-bold text-cyan-400">100% / Canlı</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
