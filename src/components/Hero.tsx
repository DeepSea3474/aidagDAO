import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowRight, FileText, Shield, Brain, Link2, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import aidagLogo from "@assets/aidag-logo_1770572833982.jpg";
import soulwareAI from "@assets/soulwareai_1770572834003.jpeg";

function useCounter(end: number, duration: number = 2000, prefix: string = "", suffix: string = "") {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { ref, display: `${prefix}${value.toLocaleString()}${suffix}` };
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }> = [];
    const colors = ["rgba(6,182,212,", "rgba(168,85,247,", "rgba(16,185,129,"];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" style={{ width: "100%", height: "100%" }} />;
}

function LiveTicker() {
  const [price, setPrice] = useState(0.0042);
  const [change, setChange] = useState(12.4);

  useEffect(() => {
    const i = setInterval(() => {
      setPrice(p => +(p + (Math.random() - 0.45) * 0.0001).toFixed(4));
      setChange(c => +(c + (Math.random() - 0.48) * 0.3).toFixed(1));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="hidden md:flex items-center gap-4 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/5 backdrop-blur-sm"
      data-testid="ticker-live"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-slate-400">AIDAG/USD</span>
      </div>
      <span className="text-sm font-bold text-white font-mono">${price.toFixed(4)}</span>
      <span className={`text-xs font-bold ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {change >= 0 ? "+" : ""}{change}%
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const counter1 = useCounter(48291, 2500, "", "+");
  const counter2 = useCounter(15847, 2000, "", "");
  const counter3 = useCounter(99, 1500, "", ".98%");

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-20 md:pb-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[160px] orb-animate" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[160px] orb-animate-reverse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-500/8 rounded-full blur-[120px] orb-animate" />
      </div>

      <ParticleCanvas />

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 pulse-glow"
            data-testid="badge-status"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {t("hero.badge")}
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] font-display" data-testid="text-hero-title">
            {t("hero.titlePrefix", "The Future of")}{" "}
            <br className="hidden sm:block" />
            <span className="text-shimmer">
              {t("hero.title1")}
            </span>{" "}
            <br className="hidden sm:block" />
            {t("hero.title3")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 leading-relaxed max-w-lg" data-testid="text-hero-description">
            {t("hero.description")}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" /> {t("hero.quantumSecurity")}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
              <Brain className="w-3.5 h-3.5" /> {t("hero.soulwareAutonomous")}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
              <Link2 className="w-3.5 h-3.5" /> {t("hero.multiChain")}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/presale" data-testid="button-join-presale"
              className="btn-premium px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group">
              <Zap className="w-5 h-5" /> {t("hero.getStarted")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/whitepaper" data-testid="button-whitepaper"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl font-bold text-base sm:text-lg backdrop-blur-md transition-all flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" /> {t("hero.whitepaper")}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4" data-testid="hero-live-stats">
            <div ref={counter1.ref} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg sm:text-xl font-bold text-cyan-400 font-display counter-value">{counter1.display}</div>
              <div className="text-[10px] sm:text-xs text-slate-500">{t("hero.activeWallets", "Active Wallets")}</div>
            </div>
            <div ref={counter2.ref} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg sm:text-xl font-bold text-emerald-400 font-display counter-value">{counter2.display}</div>
              <div className="text-[10px] sm:text-xs text-slate-500">{t("hero.transactions", "Transactions")}</div>
            </div>
            <div ref={counter3.ref} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg sm:text-xl font-bold text-purple-400 font-display counter-value">{counter3.display}</div>
              <div className="text-[10px] sm:text-xs text-slate-500">{t("hero.uptime", "Uptime")}</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-purple-600/15 rounded-full blur-3xl" />
            
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 cursor-pointer group" onClick={() => setLocation('/presale')}>
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500/50 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] select-none whitespace-nowrap">
                  AIDAG CHAIN
                </h2>
                
                <div className="absolute -inset-1 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <motion.div 
                  initial={{ left: "-20%" }}
                  animate={{ left: "120%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] pointer-events-none"
                />
                
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              </motion.div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[110%] h-[110%] rounded-full" style={{ border: '1px solid rgba(6,182,212,0.08)' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-cyan-400/60 -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[90%] h-[90%] rounded-full" style={{ border: '1px solid rgba(168,85,247,0.08)' }}>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-purple-400/60" />
              </motion.div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[130%] h-[130%] rounded-full" style={{ border: '1px dashed rgba(16,185,129,0.05)' }} />

              <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.4)] border-2 border-cyan-500/30 pulse-glow">
                <img src={aidagLogo} alt="Aidag Chain" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-72 h-72 rounded-full bg-cyan-500/5 animate-pulse" />
            </div>

            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 glass-card-premium p-3 rounded-xl shadow-xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/30">
                  <img src={soulwareAI} alt="SoulwareAI" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Powered by</div>
                  <div className="text-sm font-bold text-white">SoulwareAI</div>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 glass-card-premium p-3 rounded-xl shadow-xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Multi-Chain</div>
                  <div className="text-sm font-bold text-white">BSC + ETH</div>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ x: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 -right-8 glass-card-premium p-3 rounded-xl shadow-xl z-20">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div className="text-xs font-bold text-emerald-400">QUANTUM SAFE</div>
              </div>
            </motion.div>

            <LiveTicker />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
