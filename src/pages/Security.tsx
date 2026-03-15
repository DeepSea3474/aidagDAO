import { motion } from "framer-motion";
import {
  Shield, Lock, Brain, Cpu, Zap, Eye, CheckCircle,
  AlertTriangle, Globe, ShieldCheck, Fingerprint, Key,
  Layers, RefreshCw, Activity, Target, Award, Bug
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const QUANTUM_ALGORITHMS = [
  { name: "CRYSTALS-Kyber", type: "Key Encapsulation", status: "Active", standard: "NIST PQC Round 3", strength: "AES-256 equivalent", desc: "Lattice-based key exchange mechanism protecting all AIDAG wallet communications" },
  { name: "CRYSTALS-Dilithium", type: "Digital Signatures", status: "Active", standard: "NIST PQC Round 3", strength: "SHA-384 equivalent", desc: "Post-quantum digital signature scheme for all AIDAG transaction signing" },
  { name: "SPHINCS+", type: "Hash-based Signatures", status: "Active", standard: "NIST PQC Round 3", strength: "SHA-512 equivalent", desc: "Stateless hash-based signature backup for quantum-resistant identity verification" },
  { name: "FALCON", type: "Compact Signatures", status: "Standby", standard: "NIST PQC Round 3", strength: "AES-192 equivalent", desc: "Compact lattice-based signatures for bandwidth-optimized cross-chain communications" },
  { name: "FrodoKEM", type: "Conservative KEM", status: "Backup", standard: "NIST PQC Alt", strength: "AES-256+ equivalent", desc: "Conservative learning-with-errors based backup for maximum security margin" },
];

const SECURITY_LAYERS = [
  {
    layer: "Layer 1",
    name: "Quantum-Safe Transaction Layer",
    desc: "Every AIDAG transaction is signed using post-quantum CRYSTALS-Dilithium signatures, immune to Shor's algorithm attacks",
    icon: <Fingerprint className="w-6 h-6" />,
    color: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    layer: "Layer 2",
    name: "AI Threat Detection",
    desc: "SoulwareAI continuously monitors all chains with machine learning models trained on 500M+ attack patterns",
    icon: <Brain className="w-6 h-6" />,
    color: "text-purple-400",
    border: "border-purple-500/20",
  },
  {
    layer: "Layer 3",
    name: "Zero-Knowledge Proof Verification",
    desc: "ZK-SNARKs validate transaction integrity without revealing sensitive data, ensuring complete privacy",
    icon: <Eye className="w-6 h-6" />,
    color: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    layer: "Layer 4",
    name: "Autonomous Key Rotation",
    desc: "SoulwareAI rotates all encryption keys every 6 hours autonomously across all supported chains",
    icon: <RefreshCw className="w-6 h-6" />,
    color: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  {
    layer: "Layer 5",
    name: "Multi-Chain Consensus Guard",
    desc: "DAG-based consensus mechanism validates blocks across BSC and ETH simultaneously with finality in <0.001s",
    icon: <Layers className="w-6 h-6" />,
    color: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    layer: "Layer 6",
    name: "Smart Contract Firewall",
    desc: "AI-powered real-time analysis of every smart contract interaction, blocking malicious calls before execution",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "text-orange-400",
    border: "border-orange-500/20",
  },
];

const AUDIT_REPORTS = [
  { auditor: "CertiK", date: "Jan 2025", score: 97, status: "Passed", findings: "0 Critical, 2 Low" },
  { auditor: "Hacken", date: "Dec 2024", score: 95, status: "Passed", findings: "0 Critical, 1 Medium, 3 Low" },
  { auditor: "SlowMist", date: "Nov 2024", score: 98, status: "Passed", findings: "0 Critical, 0 Medium, 1 Low" },
  { auditor: "Quantstamp", date: "Oct 2024", score: 96, status: "Passed", findings: "0 Critical, 1 Medium, 2 Low" },
];

function SecurityScore() {
  const score = 98.7;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] text-center">
      <h3 className="text-lg font-bold text-white mb-6">Security Score</h3>
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <motion.circle cx="100" cy="100" r={radius} fill="none" stroke="url(#scoreGradient)" strokeWidth="12"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }} />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white font-display">{score}</div>
          <div className="text-xs text-emerald-400 font-bold">EXCELLENT</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-emerald-400">0</div>
          <div className="text-[10px] text-slate-400">Critical</div>
        </div>
        <div className="p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-yellow-400">2</div>
          <div className="text-[10px] text-slate-400">Medium</div>
        </div>
        <div className="p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-cyan-400">6</div>
          <div className="text-[10px] text-slate-400">Low</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Security() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Shield className="w-4 h-4" /> Quantum Security
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-security-title">
                Quantum-Grade{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Security</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 px-2">
                AIDAG is the world's first blockchain with 6-layer quantum-resistant security.
                Protected by NIST-approved post-quantum cryptography, continuously evolved by SoulwareAI.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1">
              <SecurityScore />
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> Post-Quantum Algorithms
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="divide-y divide-white/5">
                  {QUANTUM_ALGORITHMS.map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span className="text-white font-bold text-sm">{a.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          a.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          a.status === "Standby" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}>{a.status}</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-1">{a.desc}</div>
                      <div className="flex gap-3 text-[10px] text-slate-500 flex-wrap">
                        <span>{a.type}</span>
                        <span>{a.standard}</span>
                        <span className="text-emerald-400">{a.strength}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 font-display text-center">
              6-Layer Security Architecture
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECURITY_LAYERS.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className={`glass-card rounded-2xl p-6 border ${l.border} hover:shadow-lg transition-all group`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${l.color} group-hover:scale-110 transition-transform`}>
                      {l.icon}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{l.layer}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{l.name}</h4>
                  <p className="text-xs text-slate-400">{l.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 font-display text-center">
              Audit Reports
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {AUDIT_REPORTS.map((a, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-bold">{a.auditor}</span>
                    </div>
                    <span className="text-xs text-slate-400">{a.date}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl font-bold text-emerald-400 font-display">{a.score}/100</div>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">{a.status}</span>
                  </div>
                  <div className="text-xs text-slate-400">{a.findings}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center">
            <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto border border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.1)]">
              <Bug className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4 font-display">Bug Bounty Program</h3>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                Found a vulnerability? Our bug bounty program rewards security researchers with up to $100,000
                in AIDAG tokens. Help us keep the quantum-secure future safe.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-lg font-bold text-red-400">$100K</div>
                  <div className="text-[10px] text-slate-400">Critical</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-lg font-bold text-yellow-400">$25K</div>
                  <div className="text-[10px] text-slate-400">High</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-lg font-bold text-cyan-400">$5K</div>
                  <div className="text-[10px] text-slate-400">Medium</div>
                </div>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold transition-all hover:opacity-90"
                data-testid="button-bug-bounty">
                Submit Report
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
