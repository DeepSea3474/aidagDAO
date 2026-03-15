import React from 'react';
import { ShieldCheck, Cpu, Coins, ArrowUpRight, Zap, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen pt-40 pb-32 px-6 relative overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-600/10 to-transparent opacity-60 blur-[130px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-10 tracking-wider">
            <Zap size={15} className="animate-pulse text-cyan-500" />
            AIDAG-CHAIN MAINNET PROTOCOL: ACTIVE
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter leading-none uppercase italic text-aidag-glow">
            AIDAG <span className="text-white font-light">CHAIN</span>
          </h1>
          
          <p className="text-gray-400 text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-16 selection:bg-cyan-500/20">
            Yapay zeka otonomisiyle güçlendirilmiş, yeni nesil finansal katman. 
            Güvenliği matematik, yönetimi topluluk belirler.
          </p>

          <div className="flex flex-wrap justify-center gap-7">
            <button className="px-14 py-6 bg-white text-black font-black rounded-xl hover:bg-cyan-400 hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 text-lg uppercase tracking-wider">
              PRE-SALE LIVE
            </button>
            <button className="px-14 py-6 glass border border-cyan-500/30 text-white font-bold rounded-xl hover:bg-white/5 transition-all backdrop-blur-md text-lg group">
              WHITE PAPER <ArrowUpRight size={20} className="inline-block ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Strategic Ecosystem (Mükemmel Kartlar) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Cpu/>, title: 'Autonomous DAO', desc: 'Yapay zeka otonomisiyle yönetilen ilk merkeziyetsiz yönetim biçimi.', link: '/dao' },
            { icon: <Coins/>, title: 'Pre-sale Terminal', desc: 'AIDAG token ön satışına katılın, erken aşama avantajlarından yararlanın.', link: '/presale' },
            { icon: <Network/>, title: 'Mainnet Explorer', desc: 'SCL Chain blok verileri, ağ sağlığı ve otonom zincir takibi.', link: '/mainnet' }
          ].map((item, i) => (
            <div key={i} className="group glass p-12 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/40 transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-black border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 mb-10 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-shadow">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-bold mb-5 text-white tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-10 text-lg">{item.desc}</p>
              </div>
              <Link to={item.link} className="flex items-center gap-2.5 text-white font-black group-hover:text-aidag-glow transition-colors uppercase text-sm tracking-widest">
                Giriş Yap <ArrowUpRight size={19} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;
