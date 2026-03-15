import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity, Globe, Shield, Cpu, Zap, TrendingUp,
  CheckCircle, Clock, Server, Database, GitBranch,
  Brain, Bot, RefreshCw, Layers, Eye, ArrowUpRight,
  Wifi, WifiOff, Send, Edit3, Copy, ExternalLink, AlertCircle,
  Rocket, Vote, BarChart3, Calendar, FileText, Play, Pause,
  Settings, Target, Wallet, CircleDot, ArrowRight
} from "lucide-react";
import { SiX } from "react-icons/si";
import { CHAIN_CONFIG, SUPPORTED_CHAINS, CONTRACT_ADDRESSES, shortenAddress } from "@/lib/web3Config";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

function ChainStatusCard({ chainId, name, color, status, blocks, txCount, latency }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-colors">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${color}20`, color }}>
            {name.charAt(0)}
          </div>
          <div>
            <div className="text-white font-bold">{name}</div>
            <div className="text-xs text-slate-400">Chain ID: {chainId}</div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
          status === "healthy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          status === "syncing" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
          "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {status === "healthy" ? <Wifi className="w-3 h-3" /> : status === "syncing" ? <RefreshCw className="w-3 h-3 animate-spin" /> : <WifiOff className="w-3 h-3" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/50 rounded-xl text-center">
          <div className="text-xs text-slate-400 mb-1">Blocks</div>
          <div className="text-sm font-bold text-white">{blocks}</div>
        </div>
        <div className="p-3 bg-slate-900/50 rounded-xl text-center">
          <div className="text-xs text-slate-400 mb-1">Tx Count</div>
          <div className="text-sm font-bold text-white">{txCount}</div>
        </div>
        <div className="p-3 bg-slate-900/50 rounded-xl text-center">
          <div className="text-xs text-slate-400 mb-1">Latency</div>
          <div className="text-sm font-bold text-emerald-400">{latency}ms</div>
        </div>
      </div>
    </div>
  );
}

function AutonomusOpsLog() {
  const [ops] = useState([
    { time: "00:12:34", action: "Cross-chain bridge sync completed", chain: "BSC→ETH", status: "success", module: "Bridge" },
    { time: "00:11:22", action: "DAO Proposal #5 executed on-chain", chain: "BSC", status: "success", module: "DAO" },
    { time: "00:10:45", action: "Presale transaction batch processed", chain: "BSC", status: "success", module: "Presale" },
    { time: "00:09:18", action: "Quantum encryption keys rotated", chain: "All", status: "success", module: "Security" },
    { time: "00:08:56", action: "Token holder snapshot captured", chain: "BSC", status: "success", module: "Analytics" },
    { time: "00:07:33", action: "Smart contract optimization deployed", chain: "BSC", status: "success", module: "Optimizer" },
    { time: "00:06:12", action: "Network health check completed", chain: "All", status: "success", module: "Monitor" },
    { time: "00:05:01", action: "DAO treasury balance verified", chain: "BSC", status: "success", module: "Treasury" },
    { time: "00:04:22", action: "Parallel chain execution sync", chain: "BSC+ETH", status: "success", module: "ParallelExec" },
    { time: "00:03:15", action: "AI model self-optimization cycle", chain: "Internal", status: "success", module: "SoulwareAI" },
  ]);

  const moduleColors: Record<string, string> = {
    Bridge: "text-cyan-400", DAO: "text-purple-400", Presale: "text-emerald-400",
    Security: "text-orange-400", Analytics: "text-blue-400", Optimizer: "text-yellow-400",
    Monitor: "text-slate-400", Treasury: "text-pink-400", ParallelExec: "text-indigo-400",
    SoulwareAI: "text-violet-400",
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-bold text-white">SoulwareAI Autonomous Operations</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-bold">LIVE</span>
        </div>
      </div>
      <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
        {ops.map((op, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
            <div className="text-xs text-slate-500 font-mono w-16 flex-shrink-0">{op.time}</div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${op.status === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{op.action}</div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className={moduleColors[op.module] || "text-slate-400"}>[{op.module}]</span>
                <span>{op.chain}</span>
              </div>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SoulwareAIStatus() {
  const [uptime] = useState(99.99);
  const modules = [
    { name: "Chain Monitor", status: "active", icon: <Eye className="w-4 h-4" /> },
    { name: "Bridge Engine", status: "active", icon: <GitBranch className="w-4 h-4" /> },
    { name: "DAO Executor", status: "active", icon: <Zap className="w-4 h-4" /> },
    { name: "Presale Manager", status: "active", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Security Module", status: "active", icon: <Shield className="w-4 h-4" /> },
    { name: "Optimizer", status: "active", icon: <Cpu className="w-4 h-4" /> },
    { name: "Analytics", status: "active", icon: <Activity className="w-4 h-4" /> },
    { name: "Self-Evolution", status: "active", icon: <Brain className="w-4 h-4" /> },
  ];

  return (
    <div className="glass-card rounded-2xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.1)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
          <Brain className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">SoulwareAI Engine</h3>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Fully Operational - {uptime}% Uptime
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {modules.map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-cyan-400">{m.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white font-medium truncate">{m.name}</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-white/5">
        <div className="text-xs text-slate-400 mb-2">Active Processes</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div animate={{ width: ["60%", "85%", "70%", "90%", "75%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
          </div>
          <span className="text-xs text-white font-mono">8/8</span>
        </div>
      </div>
    </div>
  );
}

interface TweetTemplate {
  id: string;
  category: string;
  title: string;
  content: string;
}

function TwitterManager() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TweetTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TweetTemplate | null>(null);
  const [tweetContent, setTweetContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [xUsername, setXUsername] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [postedTweets, setPostedTweets] = useState<{ id: string; content: string; time: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("admin_key") || "");
  const [isAuthed, setIsAuthed] = useState(false);

  const authHeaders = { "x-admin-key": adminKey };

  const authenticateAdmin = () => {
    if (!adminKey.trim()) return;
    sessionStorage.setItem("admin_key", adminKey);
    setIsAuthed(true);
    fetch("/api/twitter/templates", { headers: authHeaders })
      .then(r => {
        if (r.status === 401) {
          setIsAuthed(false);
          toast({ title: "Auth Failed", description: "Invalid admin key", variant: "destructive" });
          return [];
        }
        return r.json();
      })
      .then(data => { if (Array.isArray(data)) setTemplates(data); })
      .catch(() => {});
  };

  useEffect(() => {
    if (adminKey) {
      authenticateAdmin();
    }
  }, []);

  const verifyConnection = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/twitter/verify", { headers: authHeaders });
      if (res.status === 401) {
        setIsAuthed(false);
        toast({ title: "Unauthorized", description: "Admin key is invalid", variant: "destructive" });
        setIsVerifying(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsConnected(true);
        setXUsername(data.username);
        toast({ title: "X Connected", description: `@${data.username} hesabi baglandi` });
      } else {
        setIsConnected(false);
        toast({ title: "Connection Failed", description: data.error || "Could not verify credentials", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify X connection", variant: "destructive" });
    }
    setIsVerifying(false);
  };

  const postTweet = async () => {
    if (!tweetContent.trim()) return;
    setIsPosting(true);
    try {
      const res = await fetch("/api/twitter/tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ content: tweetContent }),
      });
      if (res.status === 401) {
        setIsAuthed(false);
        toast({ title: "Unauthorized", description: "Admin key is invalid", variant: "destructive" });
        setIsPosting(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setPostedTweets(prev => [{ id: data.tweetId, content: tweetContent, time: new Date().toLocaleTimeString() }, ...prev]);
        toast({ title: "Tweet Posted!", description: "Content published to X successfully" });
        setTweetContent("");
        setSelectedTemplate(null);
      } else {
        toast({ title: "Tweet Failed", description: data.message || "Could not post tweet", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to post tweet", variant: "destructive" });
    }
    setIsPosting(false);
  };

  const selectTemplate = (t: TweetTemplate) => {
    setSelectedTemplate(t);
    setTweetContent(t.content);
  };

  const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = activeCategory === "All" ? templates : templates.filter(t => t.category === activeCategory);

  if (!isAuthed) {
    return (
      <div className="glass-card rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20 mx-auto mb-4">
            <SiX className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">X / Twitter Manager</h3>
          <p className="text-sm text-slate-400 mb-6">Enter admin key to access Twitter management</p>
          <div className="max-w-sm mx-auto flex gap-3">
            <input
              type="password"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && authenticateAdmin()}
              placeholder="Admin Key"
              className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/30"
              data-testid="input-admin-key"
            />
            <button onClick={authenticateAdmin}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
              data-testid="button-admin-login">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
            <SiX className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">X / Twitter Manager</h3>
            <p className="text-xs text-slate-400">SoulwareAI Auto-Post Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isConnected && xUsername && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-bold">@{xUsername}</span>
            </div>
          )}
          <button onClick={verifyConnection} disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
            data-testid="button-verify-x">
            {isVerifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
            {isConnected ? "Reconnect" : "Connect X"}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm font-bold text-white">Post Templates</span>
              <div className="flex items-center gap-1 flex-wrap ml-auto">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      activeCategory === cat ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                    }`} data-testid={`button-category-${cat.toLowerCase()}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredTemplates.map(t => (
                <button key={t.id} onClick={() => selectTemplate(t)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedTemplate?.id === t.id
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                  }`} data-testid={`button-template-${t.id}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{t.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 flex-shrink-0">{t.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{t.content.substring(0, 100)}...</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <span className="text-sm font-bold text-white">Compose Tweet</span>
              <span className={`text-xs font-mono ${tweetContent.length > 280 ? "text-red-400" : "text-slate-400"}`}>
                {tweetContent.length}/280
              </span>
            </div>
            <textarea
              value={tweetContent}
              onChange={e => setTweetContent(e.target.value)}
              placeholder="Write your tweet or select a template..."
              className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500/30 transition-colors"
              data-testid="input-tweet-content"
            />
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button onClick={postTweet} disabled={isPosting || !tweetContent.trim() || tweetContent.length > 280}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-post-tweet">
                {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isPosting ? "Posting..." : "Post to X"}
              </button>
              {selectedTemplate && (
                <button onClick={() => { setTweetContent(""); setSelectedTemplate(null); }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 transition-colors"
                  data-testid="button-clear-tweet">
                  Clear
                </button>
              )}
            </div>
            {tweetContent.length > 280 && (
              <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" />
                Tweet exceeds 280 character limit
              </div>
            )}
          </div>
        </div>

        {postedTweets.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <span className="text-sm font-bold text-white mb-4 block">Recent Posts</span>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {postedTweets.map((tweet, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{tweet.content.substring(0, 80)}...</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{tweet.time}</p>
                  </div>
                  <a href={`https://x.com/i/web/status/${tweet.id}`} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex-shrink-0" data-testid={`link-tweet-${tweet.id}`}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const chains = [
    { chainId: 56, name: "BNB Smart Chain", color: "#F0B90B", status: "healthy", blocks: "45,892,103", txCount: "2.1B", latency: 12 },
    { chainId: 1, name: "Ethereum", color: "#627EEA", status: "healthy", blocks: "19,234,567", txCount: "2.4B", latency: 45 },
  ];

  const globalStats = [
    { label: "Total Transactions", value: "1.2M+", icon: <Activity className="w-6 h-6" />, color: "text-cyan-400" },
    { label: "Active Chains", value: "2", icon: <Globe className="w-6 h-6" />, color: "text-emerald-400" },
    { label: "AI Uptime", value: "99.99%", icon: <Cpu className="w-6 h-6" />, color: "text-purple-400" },
    { label: "Processed Blocks", value: "65M+", icon: <Database className="w-6 h-6" />, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Brain className="w-4 h-4" /> Autonomous Operations
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-dashboard-title">
                SoulwareAI{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Dashboard</span>
              </h1>
              <p className="text-lg text-slate-400">
                Real-time view of autonomous chain operations, multi-chain status, and SoulwareAI activity across all networks.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {globalStats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center border border-white/5">
                <div className={`${s.color} mx-auto mb-3`}>{s.icon}</div>
                <div className="text-2xl font-bold text-white font-display mb-1">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
              <SoulwareAIStatus />
            </div>
            <div className="lg:col-span-2">
              <AutonomusOpsLog />
            </div>
          </div>

          <div className="mb-12">
            <TwitterManager />
          </div>

          <h3 className="text-2xl font-bold text-white mb-6 font-display">Chain Status</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {chains.map(c => <ChainStatusCard key={c.chainId} {...c} />)}
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" /> Contract Addresses
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Token Contract", addr: CONTRACT_ADDRESSES.token },
                { label: "Presale Contract", addr: CONTRACT_ADDRESSES.presale },
                { label: "DAO Wallet", addr: CONTRACT_ADDRESSES.daoWallet },
                { label: "Operations Wallet", addr: CONTRACT_ADDRESSES.operationWallet },
              ].map((c, i) => (
                <div key={i} className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="text-xs text-slate-400 mb-1">{c.label}</div>
                  <div className="text-xs text-cyan-400 font-mono break-all">{c.addr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
