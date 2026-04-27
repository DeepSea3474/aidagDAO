'use client';
import { useState, useEffect, useRef } from 'react';
import { openWeb3Modal } from '../lib/web3modal';
import Image from 'next/image';

// Galaktik Hücresel Çekirdek - Dinamik Renk Döngüsü
const GalacticCore = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hue, setHue] = useState(200);

  useEffect(() => {
    const interval = setInterval(() => setHue(h => (h + 0.4) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let stars: any[] = [];

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s, i) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;
        ctx.fillStyle = `hsla(${hue}, 100%, 80%, 0.8)`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < stars.length; j++) {
          const d = Math.sqrt((s.x - stars[j].x)**2 + (s.y - stars[j].y)**2);
          if (d < 100) {
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${1 - d/100})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(stars[j].x, stars[j].y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, [hue]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000] text-white overflow-x-hidden font-mono">
      {/* 🔱 1. Mevcut Header */}
      <nav className="flex justify-between items-center p-4 border-b border-white/5 bg-black/90 backdrop-blur-md sticky top-0 z-[100]">
        <div className="flex items-center gap-2">
          <Image src="/aidag-logo.jpg" alt="Logo" width={24} height={24} className="rounded-full" />
          <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase">AIDAG-CHAIN</span>
        </div>
        <button onClick={() => openWeb3Modal()} className="border border-white/10 px-3 py-1 rounded-full text-[9px] uppercase hover:bg-white/5 transition">Connect</button>
      </nav>

      {/* 🔱 2. En Üstteki Otonom Panel (Header Altı) */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-4">
        <div className="relative border border-white/10 rounded-2xl bg-[#050505] overflow-hidden min-h-[220px] md:min-h-[380px] flex items-center justify-center">
          <GalacticCore />
        </div>

        {/* 🔱 3. Master'ın İstediği İmza: Soulwareai + Logo + Aidag Chain */}
        <div className="flex justify-center -mt-5 relative z-10">
          <div className="bg-black border border-white/10 rounded-xl px-5 py-2.5 flex items-center gap-3 shadow-2xl">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tight">Soulware AI</span>
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
               <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse blur-sm"></div>
               <Image src="/aidag-logo.jpg" alt="Core" width={40} height={40} className="rounded-full border border-white/20 relative z-20" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">AIDAG Chain</span>
          </div>
        </div>
      </section>

      {/* 🔱 4. Sitenin Geri Kalan İçeriği Buradan Devam Eder */}
      <section className="text-center mt-12 px-6">
        <h1 className="text-xl md:text-4xl font-black uppercase tracking-tighter italic">Autonomous Infrastructure</h1>
        <p className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-[0.3em] mt-2 opacity-70">Decentralized protocols managed by Soulware Core</p>
      </section>
    </main>
  );
}
