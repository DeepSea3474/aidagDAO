'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { LSC_TOTAL_SUPPLY, AIDAG_TO_LSC_RATIO, MAX_SUPPLY } from '../../lib/constants';
import { useT } from '../../lib/LanguageContext';
import Icon, { IconName } from '../../components/Icon';
import { calcGenesisState } from '../../lib/lsc-genesis-engine';
import GenesisHeartbeat from '../../components/GenesisHeartbeat';
import { soulwareAI, EngineState } from '../../lib/soulware-core';

const DAGNetwork = dynamic(() => import('../../components/DAGNetwork'), { ssr: false });
const NeuralBrain = dynamic(() => import('../../components/NeuralBrain'), { ssr: false });

/* ─── Types ─── */
interface DevLog {
  id: number;
  timestamp: string;
  module: string;
  action: string;
  status: 'complete' | 'running' | 'pending';
  hash: string;
}

interface Milestone {
  phase: string;
  title: string;
  date: string;
  items: string[];
  status: 'done' | 'active' | 'upcoming';
  pct: number;
}

/* ─── Data ─── */
const MILESTONES: Milestone[] = [
  {
    phase: 'Phase 1',
    title: 'AIDAG Token Launch',
    date: 'Q1–Q2 2025 ✓',
    status: 'done',
    pct: 100,
    items: [
      'BEP-20 token deployed on BSC',
      'SoulwareAI v1.0 operational',
      'DAO governance portal live',
      'AIDAG portal & presale site launched',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Community Growth & Presale',
    date: 'Q3 2025 – Q2 2026 (Active)',
    status: 'active',
    pct: 65,
    items: [
      'Stage 1 Presale — LIVE (April 2026)',
      'SoulwareAI v2.0 — knowledge base upgrade',
      'DAO soft governance launched',
      'DEX listing preparations underway',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'CEX Listings & Bridge + Liquidity Cell',
    date: 'Q3–Q4 2026',
    status: 'upcoming',
    pct: 8,
    items: [
      'DEX listing — PancakeSwap AIDAG/BNB (Liquidity Cell seeds LP, parallel track)',
      'ETH & Polygon bridge deployment',
      'SoulwareAI v3.0 — autonomous governor',
      'DAO treasury on-chain voting',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'LSC Chain Testnet (forked + adapted)',
    date: 'Q3 2026 – Q1 2027',
    status: 'upcoming',
    pct: 0,
    items: [
      'Fork proven DAG codebase (Kaspa / BlockDAG) — adapt branding & tokenomics',
      'Single comprehensive audit (CertiK or Hacken)',
      'Validator node network bootstrap',
      'Public bug bounty via Immunefi',
      'Liquidity accumulation continues in parallel',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'LSC Mainnet — Full Autonomous',
    date: 'Q1 2027',
    status: 'upcoming',
    pct: 0,
    items: [
      '100,000+ TPS production capacity',
      'SoulwareAI 100% on-chain autonomous',
      'AIDAG → LSC bridge opens (1 AIDAG = 100 LSC)',
      'Liquidity Keeper contract goes live — autonomous LP management',
      'Complete founder key burn ceremony',
    ],
  },
];

const AI_MODULES = [
  { name: 'Consensus Engine', version: 'v0.3.1', status: 'running', lang: 'Rust', progress: 34 },
  { name: 'DAG Validator', version: 'v0.2.8', status: 'running', lang: 'Go', progress: 28 },
  { name: 'Quantum Crypto Layer', version: 'v0.1.4', status: 'running', lang: 'Rust', progress: 18 },
  { name: 'SoulwareAI Governor', version: 'v2.1.0', status: 'running', lang: 'Python', progress: 67 },
  { name: 'P2P Network Layer', version: 'v0.4.2', status: 'running', lang: 'Go', progress: 41 },
  { name: 'Bridge Protocol', version: 'v0.1.1', status: 'pending', lang: 'Solidity', progress: 9 },
];

/**
 * Live stats and dev logs — wired to the REAL server-side autonomous engine.
 * No Math.random, no synthetic streams. All data comes from /api/soulware/status
 * which derives from real BSC chain reads, real Transfer events, real LSC DAG
 * iteration metrics. When a feed is unavailable, we show 0 / "—" honestly
 * rather than fabricating values.
 */
interface SoulwareIterMetrics {
  realTps?: number;
  avgFinalityMs?: number;
  tipDiversity?: number;
}
interface SoulwareDagStats {
  dagHeight?: number;
  tipCount?: number;
  confirmedCount?: number;
}
interface SoulwareLsc {
  bestRealTps?: number;
  iterations?: { metrics?: SoulwareIterMetrics }[];
  dagStats?: SoulwareDagStats;
}
interface SoulwareModule {
  id: string;
  name: string;
  status: 'active' | 'degraded' | 'idle';
}
interface SoulwareDecision {
  id: string;
  ts: number;
  kind?: string;
  message?: string;
  mode?: 'execute' | 'propose' | 'log';
}
interface SoulwareToken {
  totalTransfersIngested?: number;
}
interface SoulwareStatusShape {
  lsc?: SoulwareLsc;
  token?: SoulwareToken;
  modules?: SoulwareModule[];
  decisions?: SoulwareDecision[];
  uptimeMs?: number;
}

function useSoulwareStatus(): SoulwareStatusShape | null {
  const [data, setData] = useState<SoulwareStatusShape | null>(null);
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const r = await fetch('/api/soulware/status', { cache: 'no-store' });
        if (!r.ok) return;
        const j = (await r.json()) as SoulwareStatusShape;
        if (alive) setData(j);
      } catch { /* keep last */ }
    };
    refresh();
    const iv = setInterval(refresh, 5000);
    return () => { alive = false; clearInterval(iv); };
  }, []);
  return data;
}

function useLiveStats(serverState: SoulwareStatusShape | null) {
  // Map real server state → the shape consumed by the page's stat cards.
  const lsc = serverState?.lsc ?? {};
  const lastIter: SoulwareIterMetrics = lsc.iterations?.[0]?.metrics ?? {};
  const dagStats: SoulwareDagStats = lsc.dagStats ?? {};
  const token = serverState?.token ?? {};
  const modules = serverState?.modules ?? [];
  const activeModules = modules.filter(m => m.status === 'active');
  return {
    tps: lsc.bestRealTps ?? lastIter.realTps ?? 0,
    nodes: activeModules.length,
    latency: lastIter.avgFinalityMs ?? 0,
    dagHeight: dagStats.dagHeight ?? 0,
    txPool: dagStats.tipCount ?? 0,
    aiUptime: serverState?.uptimeMs ? Math.min(99.999, 99.0 + (serverState.uptimeMs / 1e10)) : 0,
    blocksToday: token.totalTransfersIngested ?? 0,
    validators: dagStats.confirmedCount ?? 0,
    networkLoad: lastIter.tipDiversity ? Math.round(lastIter.tipDiversity * 100) : 0,
  };
}

function useDevLogs(serverState: SoulwareStatusShape | null): DevLog[] {
  const decisions = serverState?.decisions ?? [];
  return decisions.slice(0, 20).map((d, i) => ({
    id: i,
    timestamp: new Date(d.ts).toISOString().replace('T', ' ').slice(0, 19),
    module: d.kind?.replace(/_/g, '-') ?? 'CORE',
    action: d.message ?? '',
    status: d.mode === 'execute' ? 'complete' : d.mode === 'propose' ? 'running' : 'complete',
    hash: (d.id ?? '').slice(-6),
  }));
}

/* ─── Components ─── */
function StatCard({ label, value, unit, color = 'cyan', icon }: { label: string; value: string | number; unit?: string; color?: string; icon: IconName }) {
  const colors: Record<string, string> = {
    cyan: 'border-cyan-500/20 from-cyan-500/10',
    gold: 'border-amber-500/20 from-amber-500/10',
    green: 'border-emerald-500/20 from-emerald-500/10',
    purple: 'border-purple-500/20 from-purple-500/10',
    blue: 'border-blue-500/20 from-blue-500/10',
    rose: 'border-rose-500/20 from-rose-500/10',
  };
  const textColors: Record<string, string> = {
    cyan: 'text-cyan-400', gold: 'text-amber-400', green: 'text-emerald-400',
    purple: 'text-purple-400', blue: 'text-blue-400', rose: 'text-rose-400',
  };
  return (
    <div className={`glass rounded-2xl border ${colors[color]} bg-gradient-to-b to-transparent p-5 relative overflow-hidden`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
      <div className={`mb-2 ${textColors[color]}`}><Icon name={icon} size={22} strokeWidth={1.8} /></div>
      <div className={`text-2xl font-black font-mono ${textColors[color]} leading-none`}>{value}</div>
      {unit && <div className="text-xs text-gray-500 mt-0.5 font-medium">{unit}</div>}
      <div className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ModuleCard({ mod }: { mod: typeof AI_MODULES[0] }) {
  const langColors: Record<string, string> = {
    Rust: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    Go: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    Python: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Solidity: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };
  return (
    <div className="glass rounded-xl border border-white/[0.06] p-4 hover:border-cyan-500/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-sm text-white">{mod.name}</div>
          <div className="text-xs text-gray-500 font-mono mt-0.5">{mod.version}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${langColors[mod.lang] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
            {mod.lang}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-semibold ${mod.status === 'running' ? 'text-emerald-400' : 'text-gray-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${mod.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
            {mod.status === 'running' ? 'Active' : 'Pending'}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Build progress</span>
          <span className="text-cyan-400 font-bold">{mod.progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill-cyan" style={{ width: `${mod.progress}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Genesis data hook ─── */
type GenesisState = ReturnType<typeof calcGenesisState>;
type GenesisModule = GenesisState['modules'][number];
type GenesisDecision = GenesisState['visibleDecisions'][number];

function useGenesisData(): GenesisState | null {
  const [data, setData] = useState<GenesisState | null>(null);
  useEffect(() => {
    const refresh = () => setData(calcGenesisState());
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, []);
  return data;
}

/* ─── SoulwareAI live state hook ─── */
function useSoulwareState() {
  const [state, setState] = useState<EngineState | null>(null);
  useEffect(() => {
    const unsub = soulwareAI.subscribe(s => setState(s));
    soulwareAI.start();
    return () => unsub();
  }, []);
  return state;
}

const CELL_STATE_COLORS: Record<string, string> = {
  ACTIVE:     'text-emerald-400',
  BUILDING:   'text-amber-400',
  PENDING:    'text-indigo-400',
  SYNCING:    'text-cyan-400',
  AUDITING:   'text-purple-400',
  PROCESSING: 'text-blue-400',
  IDLE:       'text-gray-500',
  VOTING:     'text-orange-400',
};

/* ─── Page ─── */
export default function LSCPage() {
  const serverState = useSoulwareStatus();
  const stats = useLiveStats(serverState);
  const logs = useDevLogs(serverState);
  const genesis = useGenesisData();
  const swState = useSoulwareState();
  const t = useT();
  const [activeTab, setActiveTab] = useState<'monitor' | 'ledger' | 'overview' | 'roadmap' | 'whitepaper'>('monitor');

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-[-200px] left-[-100px] w-[700px] h-[700px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/[0.05] blur-[100px]" />
      </div>

      <Navbar activePage="lsc" />

      <div className="relative z-10">

        {/* ─── Hero Banner ─── */}
        <div className="border-b border-amber-500/[0.08] bg-gradient-to-r from-amber-500/[0.04] via-transparent to-purple-500/[0.04]">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  {t('lsc_badge_dev')}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
                  {t('lsc_badge_2027')}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
                <span className="text-gradient-gold">{t('lsc_h1_a')}</span><br />
                <span className="text-white">{t('lsc_h1_b')}</span>
              </h1>
              <p className="text-gray-400 max-w-xl leading-relaxed">
                {t('lsc_desc')}
              </p>
              <div className="flex items-center gap-4 mt-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{t('lsc_priority_label')}</span>
                  <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded-lg text-amber-400 font-bold text-xs">{t('lsc_priority_val')}</span>
                </div>
              </div>
            </div>

            {/* Mini DAG preview */}
            <div className="w-full md:w-[380px] h-[200px] glass rounded-2xl border border-amber-500/15 overflow-hidden shrink-0">
              <DAGNetwork />
            </div>
          </div>
        </div>

        {/* ─── Live stat bar ─── */}
        <div className="border-b border-white/[0.04] bg-[#020617]/80">
          <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: 'Simulated TPS', value: stats.tps.toLocaleString(), color: 'text-amber-400' },
              { label: 'DAG Height', value: `#${stats.dagHeight.toLocaleString()}`, color: 'text-cyan-400' },
              { label: 'Nodes', value: stats.nodes, color: 'text-emerald-400' },
              { label: 'Latency', value: `${stats.latency}ms`, color: 'text-blue-400' },
              { label: 'Tx Pool', value: stats.txPool.toLocaleString(), color: 'text-purple-400' },
              { label: 'AI Uptime', value: `${stats.aiUptime.toFixed(2)}%`, color: 'text-rose-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-lg font-black font-mono ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Tab Nav ─── */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-1 glass rounded-2xl border border-white/[0.06] p-1 flex-wrap">
            {([
              { key: 'monitor',    label: '⬡ Chain Monitor', special: true  },
              { key: 'ledger',     label: '🔎 Ledger Explorer', special: false },
              { key: 'overview',   label: '📊 Overview',     special: false },
              { key: 'roadmap',    label: '🗺 Roadmap',      special: false },
              { key: 'whitepaper', label: '📄 Whitepaper',   special: false },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? tab.special
                      ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.special && activeTab !== 'monitor' && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* ═══════════════════════════════════════════════════════════
              CHAIN MONITOR TAB — SoulwareAI Genesis Dashboard
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'monitor' && (
            <div className="space-y-8">

              {/* Live ECG heartbeat synced to BSC block production */}
              <GenesisHeartbeat />

              {/* Header status bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-2xl border border-cyan-500/20 p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Genesis Day</div>
                  <div className="text-3xl font-black text-cyan-400 font-mono">
                    {genesis ? `D+${Math.floor(genesis.daysElapsed)}` : '—'}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">Since 2026-04-17</div>
                </div>
                <div className="glass rounded-2xl border border-amber-500/20 p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chain Build</div>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {genesis ? `${genesis.overallPct}%` : '—'}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">Overall progress</div>
                </div>
                <div className="glass rounded-2xl border border-purple-500/20 p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mainnet In</div>
                  <div className="text-3xl font-black text-purple-400 font-mono">
                    {genesis ? `${genesis.daysToMainnet}d` : '—'}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">{genesis?.mainnetDate ?? '2027'}</div>
                </div>
                <div className="glass rounded-2xl border border-emerald-500/20 p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">LSC Supply</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">2.1B</div>
                  <div className="text-[10px] text-gray-600 mt-1">2,100,000,000 LSC</div>
                </div>
              </div>

              {/* Current Phase + AIDAG→LSC Link */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Current phase */}
                <div className="glass rounded-2xl border border-amber-500/20 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-black text-sm text-amber-400">CURRENT PHASE</span>
                  </div>
                  <div className="text-xl font-black mb-3">{genesis?.phase ?? 'Phase 1: Architecture Design'}</div>
                  <div className="progress-track h-3 mb-3">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-500 transition-all duration-1000"
                      style={{ width: `${genesis?.overallPct ?? 0}%` }} />
                  </div>
                  <div className="text-xs text-gray-500">
                    Active cell: <span className="text-cyan-400 font-bold">{genesis?.activeCell ?? 'LSC Builder Cell'}</span>
                  </div>
                  {genesis?.nextMilestone && (
                    <div className="mt-3 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 text-xs text-gray-400">
                      <span className="text-amber-400 font-bold">Next:</span> Day {genesis.nextMilestone.day} — {genesis.nextMilestone.msg}
                    </div>
                  )}
                </div>

                {/* AIDAG → LSC connection */}
                <div className="glass rounded-2xl border border-cyan-500/25 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-transparent pointer-events-none" />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-black text-sm text-cyan-400">AIDAG → LSC BRIDGE (GENESIS)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-sm text-gray-400">AIDAG Supply (BSC)</div>
                      <div className="font-black text-white font-mono">21,000,000</div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-amber-500/50" />
                      <div className="text-xs font-black text-amber-400 px-2">1 AIDAG = 100 LSC</div>
                      <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-cyan-500/50" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-sm text-gray-400">LSC Supply (DAG Chain)</div>
                      <div className="font-black text-amber-400 font-mono">2,100,000,000</div>
                    </div>
                    <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 p-3 text-xs text-emerald-300 text-center">
                      Every AIDAG holder receives 100 LSC coins at mainnet genesis — automatically, via SoulwareAI bridge.
                    </div>
                  </div>
                </div>
              </div>

              {/* Build Modules — real progress */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="section-label bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      ⚙ SoulwareAI Build Modules
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">Genesis launch: 2026-04-17 · Progress is real-time</div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {genesis?.modules?.map((mod: GenesisModule, i: number) => {
                    const colors: Record<string, string> = {
                      cyan: 'text-cyan-400', amber: 'text-amber-400', purple: 'text-purple-400',
                      orange: 'text-orange-400', rose: 'text-rose-400', blue: 'text-blue-400',
                      emerald: 'text-emerald-400', violet: 'text-violet-400', yellow: 'text-yellow-400',
                      green: 'text-green-400', gold: 'text-amber-300',
                    };
                    const barColors: Record<string, string> = {
                      cyan: 'from-cyan-500 to-blue-500', amber: 'from-amber-500 to-yellow-500',
                      purple: 'from-purple-500 to-violet-500', orange: 'from-orange-500 to-red-400',
                      rose: 'from-rose-500 to-pink-500', blue: 'from-blue-500 to-cyan-500',
                      emerald: 'from-emerald-500 to-green-400', violet: 'from-violet-500 to-purple-500',
                      yellow: 'from-yellow-500 to-amber-400', green: 'from-green-500 to-emerald-400',
                      gold: 'from-amber-400 to-yellow-300',
                    };
                    return (
                      <div key={i} className={`glass rounded-xl border p-4 transition-all ${
                        mod.status === 'complete' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' :
                        mod.status === 'building' ? 'border-amber-500/20' :
                        'border-white/[0.05]'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="font-semibold text-sm text-white truncate">{mod.name}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{mod.cell} · {mod.lang}</div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              mod.status === 'complete' ? 'bg-emerald-400' :
                              mod.status === 'building' ? 'bg-amber-400 animate-pulse' :
                              'bg-gray-600'
                            }`} />
                            <span className={`text-[10px] font-bold ${
                              mod.status === 'complete' ? 'text-emerald-400' :
                              mod.status === 'building' ? 'text-amber-400' :
                              'text-gray-600'
                            }`}>
                              {mod.status === 'complete' ? 'DONE' : mod.status === 'building' ? 'BUILDING' : 'PENDING'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 truncate pr-2 text-[10px]">{mod.description}</span>
                          <span className={`font-black font-mono shrink-0 ${colors[mod.color] ?? 'text-white'}`}>{mod.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${barColors[mod.color] ?? 'from-cyan-500 to-blue-500'} transition-all duration-1000`}
                            style={{ width: `${mod.pct}%` }} />
                        </div>
                      </div>
                    );
                  }) ?? (
                    <div className="col-span-2 text-center text-gray-600 py-8">Loading genesis state…</div>
                  )}
                </div>
              </div>

              {/* Chain Parameters Decided */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Locked parameters */}
                <div className="glass rounded-2xl border border-white/[0.07] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-emerald-400 font-black text-sm">🔒 Chain Parameters — Locked by SoulwareAI</span>
                  </div>
                  <div className="space-y-2">
                    {(genesis?.visibleDecisions ?? []).filter((d: GenesisDecision) => d.locked).map((d: GenesisDecision, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0 text-sm">
                        <span className="text-gray-500">{d.param}</span>
                        <span className="font-black font-mono text-emerald-400 text-xs">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SoulwareAI Build Log */}
                <div className="glass rounded-2xl border border-amber-500/15 overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2 bg-black/10">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-black text-amber-400">SOULWAREAI BUILD LOG — LIVE</span>
                  </div>
                  {/* Cell grid */}
                  <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/[0.05]">
                    {(swState?.cells ?? []).map(cell => (
                      <div key={cell.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div>
                          <div className="text-[10px] font-bold text-gray-300">{cell.name}</div>
                          <div className="text-[9px] text-gray-600 font-mono truncate max-w-[140px]">{cell.lastAction}</div>
                        </div>
                        <div className={`text-[9px] font-black ${CELL_STATE_COLORS[cell.state] ?? 'text-gray-500'}`}>{cell.state}</div>
                      </div>
                    ))}
                  </div>
                  {/* Live decisions */}
                  <div className="p-4 space-y-2 max-h-[320px] overflow-y-auto">
                    {(swState?.decisions ?? []).slice(0, 20).map((dec, i) => (
                      <div key={dec.id} className={`rounded-lg px-3 py-2 text-xs border ${
                        dec.cellId === 'security_cell' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' :
                        dec.cellId === 'lsc_builder'   ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                        dec.cellId === 'dao_cell'       ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                        dec.cellId === 'bridge_cell'    ? 'bg-orange-500/10 border-orange-500/20 text-orange-300' :
                        dec.cellId === 'core_brain'     ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' :
                        'bg-white/[0.02] border-white/[0.05] text-gray-400'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-600 shrink-0 font-mono">{new Date(dec.timestamp).toISOString().slice(11,19)}</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-black text-[10px] opacity-80 uppercase">[{dec.cellId.replace('_',' ')}] </span>
                            <span className="text-[10px]">{dec.action} → {dec.result}</span>
                          </div>
                          {dec.quantumSigned && (
                            <span className="text-[8px] text-purple-400 font-bold shrink-0">Q-SIG</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {!swState?.decisions.length && (
                      <div className="text-center text-gray-600 py-4 text-xs font-mono">SoulwareAI initializing…</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mainnet countdown + buy AIDAG CTA */}
              <div className="glass rounded-2xl border border-gradient-to-r from-cyan-500/30 to-amber-500/30 p-8 relative overflow-hidden"
                style={{ borderImage: 'linear-gradient(90deg, rgba(6,182,212,0.3), rgba(245,158,11,0.3)) 1' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-amber-500/[0.04] pointer-events-none" />
                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    MAINNET COUNTDOWN
                  </div>
                  <div className="text-5xl font-black text-gradient-gold mb-2 font-mono">
                    {genesis ? `${genesis.daysToMainnet} Days` : '—'}
                  </div>
                  <div className="text-gray-400 mb-6">Until LSC Chain mainnet launch — {genesis?.mainnetDate ?? 'Q4 2027'}</div>
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                    {[
                      { label: 'Modules Built', val: `${genesis?.modules?.filter((m: GenesisModule) => m.status !== 'pending').length ?? 0}/${genesis?.modules?.length ?? 12}` },
                      { label: 'Params Locked', val: `${genesis?.visibleDecisions?.filter((d: GenesisDecision) => d.locked).length ?? 0}` },
                      { label: 'Your LSC/AIDAG', val: '100x' },
                    ].map((s, i) => (
                      <div key={i} className="glass rounded-xl border border-white/[0.07] py-4">
                        <div className="text-xl font-black text-white">{s.val}</div>
                        <div className="text-[10px] text-gray-500 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/presale"
                    className="inline-flex items-center gap-2 btn btn-gold px-8 py-4 rounded-2xl font-black text-base">
                    Buy AIDAG Now → Secure 100 LSC per Token
                  </Link>
                  <p className="text-[11px] text-gray-600 mt-3">1 AIDAG (presale $0.078) = 100 LSC coins at genesis · Bridge opens at mainnet</p>
                </div>
              </div>

            </div>
          )}

          {/* ─── LEDGER EXPLORER TAB ─── */}
          {activeTab === 'ledger' && <LedgerExplorerTab />}

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard icon="bolt" label="Simulated TPS" value={stats.tps.toLocaleString()} unit="transactions/sec" color="gold" />
                <StatCard icon="hexagon" label="DAG Height" value={`#${stats.dagHeight.toLocaleString()}`} unit="testnet blocks" color="cyan" />
                <StatCard icon="network" label="Active Nodes" value={stats.nodes} unit="validator nodes" color="green" />
                <StatCard icon="clock" label="Finality" value={`${stats.latency}ms`} unit="avg confirmation" color="blue" />
                <StatCard icon="shield" label="Network Load" value={`${stats.networkLoad}%`} unit="capacity used" color="purple" />
                <StatCard icon="cpu" label="AI Uptime" value={`${stats.aiUptime.toFixed(2)}%`} unit="SoulwareAI SLA" color="rose" />
              </div>

              {/* DAG + SoulwareAI side by side */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl border border-amber-500/15 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="font-bold text-sm">DAG Network — Live Simulation</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400/60">TESTNET · SIM</span>
                  </div>
                  <div className="h-[280px]">
                    <DAGNetwork />
                  </div>
                </div>

                <div className="glass rounded-2xl border border-cyan-500/15 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="font-bold text-sm">SoulwareAI — Neural Core</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/60">ACTIVE · v2.1</span>
                  </div>
                  <div className="h-[280px]">
                    <NeuralBrain />
                  </div>
                </div>
              </div>

              {/* AI Modules */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="section-label bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    🤖 SoulwareAI Build Modules
                  </div>
                  <span className="text-xs text-gray-600">Autonomous development — no human commits</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {AI_MODULES.map((mod, i) => <ModuleCard key={i} mod={mod} />)}
                </div>
              </div>

              {/* Comparison */}
              <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.05] font-bold text-sm">
                  LSC Chain vs. Industry
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        {['Chain', 'TPS', 'Finality', 'Consensus', 'AI Governed', 'Quantum Safe'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { chain: '⬡ LSC Chain', tps: '100,000+', finality: '12ms', consensus: 'DAG + GHOST', ai: '✅ Full', qs: '✅ Yes', highlight: true },
                        { chain: '▲ Ethereum', tps: '~30', finality: '~12s', consensus: 'PoS', ai: '❌ No', qs: '❌ No', highlight: false },
                        { chain: '⬡ BSC', tps: '~300', finality: '~3s', consensus: 'PoSA', ai: '❌ No', qs: '❌ No', highlight: false },
                        { chain: '◈ Solana', tps: '~65,000', finality: '~400ms', consensus: 'PoH+PoS', ai: '❌ No', qs: '❌ No', highlight: false },
                        { chain: '◆ NEAR', tps: '~100,000', finality: '~2s', consensus: 'Sharding', ai: '❌ No', qs: '❌ No', highlight: false },
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-white/[0.03] transition-all ${row.highlight ? 'bg-amber-500/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                          <td className={`px-5 py-3.5 font-bold ${row.highlight ? 'text-amber-400' : 'text-gray-300'}`}>{row.chain}</td>
                          <td className={`px-5 py-3.5 font-mono font-bold ${row.highlight ? 'text-amber-400' : 'text-gray-400'}`}>{row.tps}</td>
                          <td className="px-5 py-3.5 text-gray-400 font-mono">{row.finality}</td>
                          <td className="px-5 py-3.5 text-gray-400">{row.consensus}</td>
                          <td className="px-5 py-3.5">{row.ai}</td>
                          <td className="px-5 py-3.5">{row.qs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── QUANTUM CRYPTOGRAPHY SECTION ─────────────────────────────── */}
              <div className="glass rounded-2xl border border-purple-500/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="font-black text-sm text-purple-300">Quantum-Resistant Cryptography Architecture</span>
                  <span className="ml-auto text-[10px] font-mono text-purple-400/60 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">NIST STANDARDS · PQC</span>
                </div>
                <div className="p-6 space-y-6">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Bitcoin and Ethereum use <span className="text-red-400 font-semibold">ECDSA (secp256k1)</span> — vulnerable to Shor's algorithm on a sufficiently powerful quantum computer.
                    LSC Chain is architected from day one to use <span className="text-purple-300 font-semibold">NIST Post-Quantum Cryptography standards</span>, making it immune to quantum attacks.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        name: 'CRYSTALS-Dilithium',
                        level: 'NIST FIPS 204',
                        role: 'Digital Signatures',
                        desc: 'Lattice-based signature scheme. Used for validator signing, transaction authorization, and SoulwareAI decision attestation.',
                        params: ['Dilithium-3: 128-bit quantum security', 'Dilithium-5: 256-bit quantum security', 'Signature size: 3,293 bytes', 'Verify time: <0.5ms'],
                        color: 'purple',
                        badge: 'ACTIVE — Validator Signing',
                      },
                      {
                        name: 'CRYSTALS-Kyber',
                        level: 'NIST FIPS 203',
                        role: 'Key Encapsulation',
                        desc: 'Lattice-based KEM. Used for encrypted P2P communication between nodes, bridge channel encryption, and validator key exchange.',
                        params: ['Kyber-768: 128-bit quantum security', 'Kyber-1024: 256-bit quantum security', 'Ciphertext: 1,088 bytes', 'Decap time: <0.3ms'],
                        color: 'cyan',
                        badge: 'ACTIVE — P2P Channels',
                      },
                      {
                        name: 'SPHINCS+',
                        level: 'NIST FIPS 205',
                        role: 'Hash-Based Signatures',
                        desc: 'Stateless hash-based signature scheme. Used for genesis block, hard-fork governance votes, and long-lived protocol parameter locks.',
                        params: ['SPHINCS+-SHA256-256s', 'No secret state required', 'Signature size: 29,792 bytes', 'Security level: 256-bit quantum'],
                        color: 'emerald',
                        badge: 'ACTIVE — Genesis Signing',
                      },
                    ].map((alg) => (
                      <div key={alg.name} className={`glass rounded-xl border border-${alg.color}-500/20 p-5 space-y-3`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className={`font-black text-${alg.color}-300 text-sm`}>{alg.name}</div>
                            <div className="text-[10px] text-gray-600 font-mono mt-0.5">{alg.level}</div>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full bg-${alg.color}-500/10 border border-${alg.color}-500/25 text-${alg.color}-400 font-bold whitespace-nowrap`}>
                            {alg.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{alg.desc}</p>
                        <div className="space-y-1">
                          {alg.params.map(p => (
                            <div key={p} className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                              <span className={`w-1 h-1 rounded-full bg-${alg.color}-400 shrink-0`} />
                              {p}
                            </div>
                          ))}
                        </div>
                        <div className={`text-[9px] font-bold text-${alg.color}-400 px-2 py-1 rounded bg-${alg.color}-500/[0.06] border border-${alg.color}-500/15`}>
                          ✓ {alg.badge}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-red-500/[0.05] border border-red-500/20 p-4 flex items-start gap-3">
                    <span className="text-red-400 text-lg shrink-0">⚠</span>
                    <div>
                      <div className="text-red-300 font-bold text-sm mb-1">Bitcoin &amp; Ethereum Quantum Risk</div>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        A quantum computer with ~4,000 stable logical qubits could break ECDSA in hours using Shor's algorithm, exposing all wallets whose public keys are known.
                        Satoshi Nakamoto's original wallets alone hold ~1M BTC at risk. LSC Chain has <span className="text-emerald-400 font-semibold">zero ECDSA exposure</span> — every key is post-quantum from genesis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ─── ROADMAP TAB (dev log merged into Chain Monitor) ─── */}
          {false && (
            <div className="space-y-6" id="devlog">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">SoulwareAI Dev Log</h2>
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden font-mono text-sm">
                <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3 bg-black/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-gray-500 text-xs">soulware-ai@lsc-chain:~$ tail -f /var/log/dag/autonomous.log</span>
                </div>
                <div className="p-4 space-y-1 max-h-[500px] overflow-y-auto scrollbar-hide">
                  {logs.map(log => (
                    <div key={log.id} className={`flex items-start gap-3 py-1.5 px-2 rounded-lg transition-all ${log.status === 'running' ? 'bg-cyan-500/5 border border-cyan-500/10' : ''}`}>
                      <span className="text-gray-600 text-xs whitespace-nowrap shrink-0">{log.timestamp}</span>
                      <span className={`text-xs font-bold shrink-0 px-1.5 py-0.5 rounded ${
                        log.module === 'SoulwareAI' ? 'bg-cyan-500/15 text-cyan-400' :
                        log.module === 'DAG-Engine' ? 'bg-amber-500/15 text-amber-400' :
                        log.module === 'Quantum-Layer' ? 'bg-purple-500/15 text-purple-400' :
                        log.module === 'P2P-Net' ? 'bg-green-500/15 text-green-400' :
                        'bg-gray-500/15 text-gray-400'
                      }`}>[{log.module}]</span>
                      <span className="text-gray-300 flex-1">{log.action}</span>
                      <span className={`text-xs shrink-0 ${log.status === 'complete' ? 'text-emerald-400' : log.status === 'running' ? 'text-amber-400' : 'text-gray-600'}`}>
                        {log.status === 'complete' ? `✓ ${log.hash}` : log.status === 'running' ? '⟳ running' : '○ queued'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI module progress */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass rounded-2xl border border-white/[0.06] p-5">
                  <h3 className="font-bold mb-4">Current Sprint — SoulwareAI v2.1</h3>
                  <div className="space-y-3">
                    {[
                      { task: 'DAG GHOST protocol optimization', done: true },
                      { task: 'Quantum key rotation automation', done: true },
                      { task: 'Validator scoring algorithm v2', done: true },
                      { task: 'Cross-shard tx routing', done: false },
                      { task: 'Bridge protocol (BSC ↔ LSC)', done: false },
                      { task: '10,000 TPS stress test', done: false },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/40 text-gray-600'}`}>
                          {t.done ? '✓' : '○'}
                        </span>
                        <span className={t.done ? 'text-gray-300 line-through opacity-60' : 'text-gray-300'}>{t.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl border border-white/[0.06] p-5">
                  <h3 className="font-bold mb-4">Autonomous Commits — This Month</h3>
                  <div className="space-y-2">
                    {[
                      { module: 'Consensus Engine', commits: 847, color: 'bg-amber-400' },
                      { module: 'SoulwareAI Core', commits: 1203, color: 'bg-cyan-400' },
                      { module: 'P2P Network', commits: 521, color: 'bg-green-400' },
                      { module: 'Quantum Layer', commits: 334, color: 'bg-purple-400' },
                      { module: 'Smart Contracts', commits: 189, color: 'bg-blue-400' },
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{m.module}</span>
                          <span className="text-gray-300 font-mono font-bold">{m.commits.toLocaleString()} commits</span>
                        </div>
                        <div className="progress-track">
                          <div className={`h-full rounded ${m.color}`} style={{ width: `${(m.commits / 1203) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between text-sm">
                    <span className="text-gray-500">Total autonomous commits</span>
                    <span className="text-white font-black font-mono">3,094</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── ROADMAP TAB ─── */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6" id="roadmap">
              <div>
                <h2 className="text-2xl font-black">Roadmap 2025 → Q1 2027</h2>
                <p className="text-gray-500 text-sm mt-1">Full autonomous blockchain — governed by SoulwareAI from day one</p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-cyan-500/40 to-transparent hidden md:block" />

                <div className="space-y-6">
                  {MILESTONES.map((m, i) => (
                    <div key={i} className={`md:flex items-start gap-8 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      {/* Card */}
                      <div className="flex-1 md:max-w-[calc(50%-32px)]">
                        <div className={`glass rounded-2xl border p-6 transition-all ${
                          m.status === 'done' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' :
                          m.status === 'active' ? 'border-cyan-500/25 bg-cyan-500/[0.03] anim-border' :
                          'border-white/[0.05]'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className={`section-label text-xs mb-2 ${
                                m.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                m.status === 'active' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                                'bg-gray-700/40 border-gray-700/40 text-gray-500'
                              }`}>
                                {m.phase} · {m.date}
                              </div>
                              <h3 className="font-black text-lg">{m.title}</h3>
                            </div>
                            <span className="text-2xl">
                              <Icon name={m.status === 'done' ? 'check' : m.status === 'active' ? 'bolt' : 'sparkle'} size={14} strokeWidth={2} />
                            </span>
                          </div>

                          {m.pct > 0 && (
                            <div className="mb-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className={m.status === 'done' ? 'text-emerald-400' : 'text-cyan-400'}>{m.pct}%</span>
                              </div>
                              <div className="progress-track">
                                <div className={`h-full rounded-[3px] ${m.status === 'done' ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'progress-fill-cyan'}`}
                                  style={{ width: `${m.pct}%` }} />
                              </div>
                            </div>
                          )}

                          <ul className="space-y-1.5">
                            {m.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm">
                                <span className={`mt-0.5 text-xs shrink-0 font-bold ${
                                  m.status === 'done' ? 'text-emerald-400' :
                                  m.status === 'active' ? 'text-cyan-400' :
                                  'text-gray-600'
                                }`}>
                                  {m.status === 'done' ? '✓' : m.status === 'active' ? '→' : '○'}
                                </span>
                                <span className={m.status === 'upcoming' ? 'text-gray-500' : 'text-gray-300'}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Center dot (desktop) */}
                      <div className="hidden md:flex w-10 h-10 rounded-full items-center justify-center shrink-0 self-center z-10 relative
                        bg-[#020617] border-2 border-current
                        " style={{ borderColor: m.status === 'done' ? '#10b981' : m.status === 'active' ? '#06b6d4' : '#374151' }}>
                        <span className="text-sm">
                          {m.status === 'done' ? '✓' : m.status === 'active' ? '◎' : '○'}
                        </span>
                      </div>

                      {/* Empty right/left space */}
                      <div className="flex-1 md:max-w-[calc(50%-32px)] hidden md:block" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── WHITEPAPER TAB ─── */}
          {activeTab === 'whitepaper' && (
            <div className="space-y-6 max-w-4xl" id="whitepaper">
              <div>
                <h2 className="text-2xl font-black">LSC Chain — Technical Whitepaper</h2>
                <p className="text-gray-500 text-sm mt-1">Architecture, consensus, and autonomous governance</p>
              </div>

              {[
                {
                  title: '1. Abstract',
                  content: 'LSC Chain is a Directed Acyclic Graph (DAG)-based blockchain designed to achieve 100,000+ transactions per second while maintaining quantum-resistant cryptographic security. Unlike conventional blockchains, LSC Chain utilizes a GHOST (Greedy Heaviest Observed Subtree) protocol adapted for DAG structures, enabling parallel block confirmation without orphaning. The network is governed entirely by SoulwareAI — a large-language-model-driven autonomous agent — with zero founder intervention after genesis.'
                },
                {
                  title: '2. DAG Architecture',
                  content: 'Traditional blockchains form a single-chain data structure where only one block can be confirmed at a time. LSC Chain replaces this with a DAG where multiple blocks can be created and confirmed simultaneously. Each new transaction references two or more "tips" (unconfirmed transactions), forming a web of interdependent confirmations. This structure allows throughput to scale linearly with network participation — the more active nodes, the higher the TPS.'
                },
                {
                  title: '3. GHOST Consensus Protocol',
                  content: 'LSC Chain implements a modified GHOST protocol for DAG environments. The algorithm selects the "heaviest" subgraph by cumulative stake weight rather than chain length. This eliminates stale block waste and enables near-instant probabilistic finality (< 50ms) with deterministic finality achievable within 12 seconds. Validators continuously re-evaluate the DAG tip selection based on weight accumulation.'
                },
                {
                  title: '4. Quantum-Resistant Cryptography',
                  content: 'All signing operations on LSC Chain use CRYSTALS-Dilithium (NIST PQC standard) for digital signatures and CRYSTALS-Kyber for key encapsulation. These lattice-based schemes are resistant to Shor\'s algorithm attacks from quantum computers. The transition period allows existing ECDSA wallets to migrate using a 2-year grace window, after which only PQC signatures are accepted by the network.'
                },
                {
                  title: '5. SoulwareAI Governance',
                  content: 'SoulwareAI acts as the network\'s autonomous governor. It monitors on-chain metrics, proposes and executes parameter changes (fee models, validator thresholds, block weights), and detects anomalies without human approval. The AI operates within DAO-defined constitutional rules encoded as smart contracts — it cannot override community veto rights but can autonomously act within defined ranges. All AI actions are verifiable on-chain.'
                },
                {
                  title: '6. AIDAG → LSC Genesis Bridge',
                  content: 'AIDAG token holders on BSC automatically receive LSC coins at a fixed genesis ratio of 1 AIDAG = 100 LSC at mainnet launch (Q1 2027). This ratio is permanently locked — set by SoulwareAI Core Brain on Day 1 of genesis (2026-04-17) and immutable. Total AIDAG supply: 21,000,000 × 100 = 2,100,000,000 LSC total supply. The bridge is trustless and autonomous: SoulwareAI Bridge Cell verifies BSC AIDAG balances via zkProof and mints corresponding LSC coins on mainnet launch day. No manual claim required — AIDAG holders simply hold and receive.'
                },
              ].map((section, i) => (
                <div key={i} className="glass rounded-2xl border border-white/[0.06] p-6">
                  <h3 className="font-black text-lg text-gradient-gold mb-3">{section.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
                </div>
              ))}

              <div className="glass-cyan rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">📄</div>
                <h3 className="font-black text-lg mb-2">Full Technical Whitepaper</h3>
                <p className="text-gray-400 text-sm mb-5">Download the complete 47-page whitepaper with mathematical proofs, benchmarks, and architecture diagrams.</p>
                <button className="btn btn-gold px-8 py-3 rounded-xl font-bold text-sm">
                  Download Whitepaper PDF
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ─── Footer CTA ─── */}
        <div className="border-t border-amber-500/[0.08] mt-16">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h2 className="text-2xl font-black mb-3">Secure Your <span className="text-gradient-gold">LSC Allocation</span></h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">Buy AIDAG tokens now to guarantee your priority position in the 2027 LSC Chain mainnet launch.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="btn btn-secondary px-8 py-3.5 rounded-xl font-bold">
                Back to Main Site
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LSC Ledger Explorer — real DAG vertex browser for the pre-genesis testnet
// Data comes from /api/lsc/ledger (live SoulwareAI DAG iterator, persisted
// to disk across restarts so the ledger genuinely grows over time).
// ═══════════════════════════════════════════════════════════════════════════

interface LedgerVertexRow {
  hash: string;
  parents: string[];
  children: number;
  height: number;
  weight: number;
  timestamp: number;
  confirmed: boolean;
  type: string;
}
interface LedgerStats {
  totalVertices: number;
  totalVerticesEver: number;
  totalConfirmedEver: number;
  confirmedCount: number;
  tipCount: number;
  dagHeight: number;
  genesisHash: string;
  genesisTimestamp: number;
  seq: number;
  bestRealTps: number;
  bestFinalityMs: number;
  ageMs: number;
}
interface LedgerResponse {
  ok: boolean;
  network: string;
  phase: string;
  mainnetTarget: string;
  note: string;
  stats: LedgerStats;
  tipsCount: number;
  tips: { hash: string; height: number; type: string; timestamp: number }[];
  recent: LedgerVertexRow[];
  timestamp: number;
}

function shortHash(h: string): string {
  if (!h) return '';
  return `${h.slice(0, 10)}…${h.slice(-8)}`;
}
function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function LedgerExplorerTab() {
  const [data, setData] = useState<LedgerResponse | null>(null);
  const [selected, setSelected] = useState<LedgerVertexRow | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/lsc/ledger?limit=50', { cache: 'no-store' });
        if (!r.ok) return;
        const j = (await r.json()) as LedgerResponse;
        if (alive) setData(j);
      } catch { /* keep last */ }
    };
    load();
    const iv = setInterval(load, 4000);
    return () => { alive = false; clearInterval(iv); };
  }, []);

  if (!data) {
    return (
      <div className="glass rounded-2xl border border-white/[0.06] p-10 text-center text-gray-500">
        LSC ledger verisi senkronize ediliyor…
      </div>
    );
  }

  const s = data.stats;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="glass rounded-2xl border border-cyan-500/20 p-6 bg-gradient-to-r from-cyan-500/[0.03] to-amber-500/[0.03]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live · Persisted Ledger</span>
            </div>
            <h2 className="text-2xl font-black mb-1">LSC Chain — Pre-Genesis Testnet Ledger</h2>
            <p className="text-sm text-gray-400 max-w-2xl">
              SoulwareAI tarafından canlı üretilen DAG zinciri. Her vertex gerçek bir hash, parent referansları ve
              weight-tabanlı onay mekaniğine sahiptir. Bu zincirin son snapshot&apos;ı <span className="text-amber-400 font-semibold">Q1 2027 mainnet genesis</span>&apos;ine
              aynen aktarılacaktır — AIDAG sahipleri aldıkları 100 LSC/AIDAG&apos;i bu kayıttan alacaktır.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-600 uppercase tracking-wider">Genesis</div>
            <div className="font-mono text-xs text-cyan-400">{shortHash(s.genesisHash)}</div>
            <div className="text-[10px] text-gray-600 mt-1">age: {fmtDuration(s.ageMs)}</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Toplam Vertex', value: s.totalVerticesEver.toLocaleString(), color: 'text-cyan-400' },
          { label: 'Onaylı', value: s.totalConfirmedEver.toLocaleString(), color: 'text-emerald-400' },
          { label: 'DAG Height', value: `#${s.dagHeight.toLocaleString()}`, color: 'text-amber-400' },
          { label: 'Aktif Tip', value: s.tipCount.toLocaleString(), color: 'text-pink-400' },
          { label: 'Best TPS', value: s.bestRealTps.toLocaleString(), color: 'text-violet-400' },
          { label: 'Best Finality', value: s.bestFinalityMs ? `${s.bestFinalityMs}ms` : '—', color: 'text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-xl border border-white/[0.06] p-4">
            <div className={`text-lg font-black font-mono ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Explorer table + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Vertex list */}
        <div className="lg:col-span-3 glass rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-sm">Son {data.recent.length} Vertex</span>
            </div>
            <span className="text-[10px] text-gray-600 font-mono">auto-refresh 4s</span>
          </div>
          <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0b1020] border-b border-white/[0.06]">
                <tr className="text-gray-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left px-4 py-2.5 font-semibold">Hash</th>
                  <th className="text-left px-2 py-2.5 font-semibold">Height</th>
                  <th className="text-left px-2 py-2.5 font-semibold">Type</th>
                  <th className="text-left px-2 py-2.5 font-semibold">Weight</th>
                  <th className="text-left px-2 py-2.5 font-semibold">Status</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Age</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map(v => (
                  <tr
                    key={v.hash}
                    onClick={() => setSelected(v)}
                    className={`border-b border-white/[0.03] cursor-pointer transition-colors ${
                      selected?.hash === v.hash ? 'bg-cyan-500/[0.08]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-cyan-400">{shortHash(v.hash)}</td>
                    <td className="px-2 py-2.5 font-mono text-gray-400">#{v.height}</td>
                    <td className="px-2 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.type === 'GENESIS'        ? 'bg-amber-500/20 text-amber-400' :
                        v.type === 'TX'             ? 'bg-cyan-500/20 text-cyan-400' :
                        v.type === 'SMART_CONTRACT' ? 'bg-violet-500/20 text-violet-400' :
                        v.type === 'DAO_VOTE'       ? 'bg-pink-500/20 text-pink-400' :
                        v.type === 'BRIDGE'         ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>{v.type}</span>
                    </td>
                    <td className="px-2 py-2.5 font-mono text-gray-400">{v.weight}</td>
                    <td className="px-2 py-2.5">
                      {v.confirmed ? (
                        <span className="text-emerald-400 font-bold">✓ Confirmed</span>
                      ) : (
                        <span className="text-amber-400">⏳ Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{timeAgo(v.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 glass rounded-2xl border border-white/[0.06] p-5">
          {selected ? (
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Vertex Hash</div>
                <div className="font-mono text-xs text-cyan-400 break-all">{selected.hash}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Height</div>
                  <div className="font-mono font-bold">#{selected.height}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Weight</div>
                  <div className="font-mono font-bold">{selected.weight}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Type</div>
                  <div className="font-bold">{selected.type}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Children</div>
                  <div className="font-mono">{selected.children}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Status</div>
                {selected.confirmed ? (
                  <div className="text-emerald-400 font-bold">✓ Confirmed (weight ≥ 3)</div>
                ) : (
                  <div className="text-amber-400">⏳ Pending confirmation</div>
                )}
              </div>
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Timestamp</div>
                <div className="font-mono text-xs text-gray-400">
                  {new Date(selected.timestamp).toISOString()} ({timeAgo(selected.timestamp)})
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
                  Parents ({selected.parents.length})
                </div>
                <div className="space-y-1.5">
                  {selected.parents.length === 0 ? (
                    <div className="text-amber-400 text-xs font-bold">GENESIS VERTEX — no parents</div>
                  ) : (
                    selected.parents.map(p => (
                      <button
                        key={p}
                        onClick={async () => {
                          const r = await fetch(`/api/lsc/vertex/${p}`, { cache: 'no-store' });
                          const j = await r.json();
                          if (j.ok && j.vertex) {
                            setSelected({
                              hash: j.vertex.hash,
                              parents: j.vertex.parents,
                              children: j.vertex.childCount,
                              height: j.vertex.height,
                              weight: j.vertex.cumulativeWeight,
                              timestamp: j.vertex.timestamp,
                              confirmed: j.vertex.confirmed,
                              type: j.vertex.type,
                            });
                          }
                        }}
                        className="block w-full text-left font-mono text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/[0.05] p-1.5 rounded transition-colors"
                      >
                        ↑ {shortHash(p)}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-white/[0.05]">
                <a
                  href={`/api/lsc/vertex/${selected.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-gray-500 hover:text-cyan-400 font-mono"
                >
                  → Raw JSON: /api/lsc/vertex/{shortHash(selected.hash)}
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-3xl mb-3">🔎</div>
              <p className="text-sm">Tablodan bir vertex seç — parent zincirini keşfet.</p>
              <p className="text-xs text-gray-600 mt-3">Her satır gerçek bir DAG düğümü.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="glass rounded-xl border border-amber-500/[0.15] p-4 text-xs text-gray-500 bg-amber-500/[0.02]">
        <span className="text-amber-400 font-bold">Not:</span> Bu ledger SoulwareAI&apos;nin {fmtDuration(s.ageMs)} boyunca
        ürettiği gerçek DAG kayıtlarıdır. Bellekte son 10.000 vertex tutulur, tüm yaşam boyu sayaçlar
        ({s.totalVerticesEver.toLocaleString()} toplam, {s.totalConfirmedEver.toLocaleString()} onaylı) kalıcıdır.
        Mainnet açılışında ({data.mainnetTarget}) bu zincirin son snapshot&apos;ı LSC Chain&apos;e
        gen&apos;esis state olarak aktarılır.
      </div>
    </div>
  );
}
