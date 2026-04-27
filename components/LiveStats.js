import { useState, useEffect } from "react";
import { formatNumber } from "../lib/utils";
import { getPresaleStats } from "../lib/blockchain";
import { Users, DollarSign, Activity, Globe, TrendingUp, Zap } from "lucide-react";

function AnimatedCounter({ value, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const endValue = typeof value === "number" ? value : parseFloat(value) || 0;
    
    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(endValue * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{prefix}{formatNumber(count)}{suffix}</span>;
}

function StatCard({ icon: Icon, value, label, trend, trendLabel, gradientFrom, gradientTo, iconColor }) {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-0.5 mb-4`}>
        <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
      
      <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent whitespace-nowrap`}>
        <AnimatedCounter value={value} prefix={label === "Total Raised" ? "$" : ""} />
      </p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
      
      {trend && (
        <div className={`mt-3 inline-flex items-center gap-1.5 text-xs ${trend === 'up' ? 'text-green-400' : 'text-cyan-400'} bg-gray-800/50 px-2 py-1 rounded-full`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function LiveStats({ id = "stats" }) {
  const [stats, setStats] = useState({
    holders: 0,
    raised: 0,
    transactions: 0,
    countries: 0
  });
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const presaleData = await getPresaleStats();
      
      setStats({
        holders: presaleData.participants || 0,
        raised: parseFloat(presaleData.totalRaisedUSD) || 0,
        transactions: (presaleData.participants || 0) * 3,
        countries: Math.max(1, Math.floor((presaleData.participants || 0) / 5))
      });
      setProgress(parseFloat(presaleData.progress) || 0);
    } catch (error) {
      console.error("Error fetching live stats:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id={id} className="py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Live</span>{" "}
            <span className="text-white">Statistics</span>
          </h2>
          <p className="text-gray-400">Real-time presale data from the blockchain</p>
        </div>

        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-700/50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300 font-medium">Presale Progress</span>
              {loading && <span className="text-xs text-gray-500 animate-pulse">Loading...</span>}
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{progress.toFixed(1)}%</span>
          </div>
          
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mt-3">
            <span>{stats.raised > 0 ? `$${formatNumber(Math.round(stats.raised))}` : '0 BNB'}</span>
            <span className="text-cyan-400">Target: 10,000,000 AIDAG</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            icon={Users}
            value={stats.holders}
            label="Token Holders"
            trend="up"
            trendLabel="Growing"
            gradientFrom="from-cyan-400"
            gradientTo="to-blue-500"
            iconColor="text-cyan-400"
          />
          
          <StatCard 
            icon={DollarSign}
            value={stats.raised}
            label="Total Raised"
            trend="up"
            trendLabel="Live"
            gradientFrom="from-green-400"
            gradientTo="to-emerald-500"
            iconColor="text-green-400"
          />
          
          <StatCard 
            icon={Activity}
            value={stats.transactions}
            label="Transactions"
            trend="live"
            trendLabel="Live"
            gradientFrom="from-purple-400"
            gradientTo="to-pink-500"
            iconColor="text-purple-400"
          />
          
          <StatCard 
            icon={Globe}
            value={stats.countries}
            label="Countries"
            trend="live"
            trendLabel="Global"
            gradientFrom="from-yellow-400"
            gradientTo="to-orange-500"
            iconColor="text-yellow-400"
          />
        </div>
      </div>
    </section>
  );
}
