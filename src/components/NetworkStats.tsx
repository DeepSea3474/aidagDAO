import React from 'react';

export const NetworkStats = () => {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
      <div className="flex justify-between items-center space-x-8">
        <div>
          <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Network Status</p>
          <p className="text-white font-bold">MAINNET - ACTIVE</p>
        </div>
        <div>
          <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Live TPS</p>
          <p className="text-white font-bold">120,482 <span className="text-[10px] text-green-400">▲</span></p>
        </div>
        <div>
          <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Finality</p>
          <p className="text-white font-bold">0.78s</p>
        </div>
      </div>
    </div>
  );
};
