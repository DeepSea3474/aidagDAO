import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5 fixed top-0 w-full z-[100]">
      <Link to="/" className="flex items-center gap-3">
        {/* Aidag-Chain Logosu */}
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          A
        </div>
        <span className="text-xl font-black tracking-tighter text-white uppercase">Aidag-Chain</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
        <Link to="/mining" className="hover:text-white transition-colors">Mobil Madencilik</Link>
        <Link to="/mainnet" className="hover:text-white transition-colors">SCL Mainnet</Link>
        <Link to="/dao" className="hover:text-white transition-colors">DAO</Link>
      </div>

      <button className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest">
        Cüzdanı Bağla
      </button>
    </nav>
  );
};

export default Navigation;
