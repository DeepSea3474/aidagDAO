import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Users, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

function AnimatedCounter({ end, suffix = "", prefix = "", decimals = 0, duration = 2000 }: {
  end: number; suffix?: string; prefix?: string; decimals?: number; duration?: number;
}) {
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
            setValue(eased * end);
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

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toLocaleString();

  return (
    <div ref={ref} className="counter-value">
      {prefix}{display}{suffix}
    </div>
  );
}

export default function Stats() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("stats.parallelChains", "Parallel Chains"),
      end: 128,
      suffix: "+",
      color: "text-cyan-400",
      statColor: "rgba(6,182,212,0.3)",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: t("stats.transactionSpeed", "Transaction Speed"),
      value: "<0.001s",
      color: "text-emerald-400",
      statColor: "rgba(16,185,129,0.3)",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      label: t("stats.revenueToHolders", "Revenue to Holders"),
      end: 40,
      suffix: "%",
      color: "text-purple-400",
      statColor: "rgba(147,51,234,0.3)",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: t("stats.aiUptime", "AI Uptime"),
      end: 99.99,
      suffix: "%",
      decimals: 2,
      color: "text-blue-400",
      statColor: "rgba(59,130,246,0.3)",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  return (
    <section id="stats" className="py-16 relative">
      <div className="section-divider mb-16" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="stat-card glass-card-premium rounded-2xl p-5 sm:p-6 text-center group"
              style={{ "--stat-color": stat.statColor } as any}
              data-testid={`stat-${index}`}
            >
              <div className={`${stat.color} mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500`}
                style={{
                  background: `linear-gradient(145deg, ${stat.statColor.replace('0.3', '0.12')}, rgba(15,23,42,0.95))`,
                  border: `1px solid ${stat.statColor.replace('0.3', '0.2')}`,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 15px ${stat.statColor.replace('0.3', '0.1')}`,
                }}>
                {stat.icon}
              </div>
              <div className={`text-3xl md:text-4xl font-bold font-display mb-2 ${stat.color}`}>
                {stat.value ? stat.value : (
                  <AnimatedCounter end={stat.end!} suffix={stat.suffix || ""} decimals={stat.decimals || 0} />
                )}
              </div>
              <div className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="section-divider mt-16" />
    </section>
  );
}
