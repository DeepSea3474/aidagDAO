import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-[100] glass border-b border-white/5 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Aidag-Chain Logosu ve İsmi (Tarifine Sadık) */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 bg-black border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-logo-shine overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 opacity-50" />
            <span className="text-2xl font-black text-white relative z-10 italic">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic group-hover:text-cyan-400 transition-colors">
              AIDAG <span className="text-cyan-500 font-light">CHAIN</span>
            </div>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest -mt-1 font-mono">SoulwareAI Ecosystem</span>
          </div>
        </Link>
        
        {/* Mükemmel Planlanmış Menü */}
        <div className="hidden md:flex items-center gap-9 text-sm font-medium text-gray-300">
          {[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Ön Satış', path: '/presale' },
            { name: 'DAO', path: '/dao' },
            { name: 'Mainnet', path: '/mainnet' }
          ].map(item => (
            <Link key={item.path} to={item.path} className="hover:text-aidag-glow transition-colors relative group py-1">
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Kurumsal Butonlar */}
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <Globe size={14} /> TR
          </button>
          <button className="px-7 py-3 bg-white text-black text-xs font-black rounded-full hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all uppercase tracking-widest transform hover:-translate-y-0.5 active:scale-95">
            Cüzdan Bağla
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
