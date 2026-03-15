import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cpu } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#020202]/90 backdrop-blur-2xl border-b border-cyan-900/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        
        {/* PARLAYAN VE IŞIK YANSIMALI AİDAG-CHAİN LOGOSU */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-12 h-12 bg-black border border-cyan-500/30 rounded-xl flex items-center justify-center overflow-hidden">
               {/* Logodaki o tarif ettiğin ışık süzmesi */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
               <Cpu className="text-cyan-400 w-7 h-7 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col uppercase italic leading-none">
            <span className="text-2xl font-black tracking-tighter text-white">
              AIDAG<span className="text-cyan-500 font-light ml-1">CHAIN</span>
            </span>
            <span className="text-[9px] tracking-[0.3em] text-cyan-800 font-bold mt-1">SoulwareAI Ecosystem</span>
          </div>
        </Link>

        {/* Kurumsal Menü */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-cyan-400 transition-all">Ana Sayfa</Link>
          <Link to="/presale" className="hover:text-cyan-400 transition-all text-cyan-500">Ön Satış</Link>
          <Link to="/dao" className="hover:text-cyan-400 transition-all">DAO</Link>
          <Link to="/tokenomics" className="hover:text-cyan-400 transition-all">Tekonomi</Link>
        </div>

        {/* Connect Butonu */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white cursor-pointer">
            <Globe size={14} /> TR
          </div>
          <button className="bg-white text-black px-7 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:bg-cyan-500 hover:text-white transition-all shadow-xl">
            Cüzdan Bağla
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
