'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import SoulwareLivePanel from '../../components/SoulwareLivePanel';
import { useChainData } from '../../lib/useChainData';
import {
  SOULWARE_IDENTITY, BRAIN_CELLS, getInitialEvents, generateEvent, getLSCMetrics,
  type SoulwareBrainEvent, type LSCMetrics,
} from '../../lib/soulware-engine';
import { GITHUB_URL, TELEGRAM_URL, TOKEN_CONTRACT } from '../../lib/constants';
import { useT } from '../../lib/LanguageContext';
import Icon, { IconName } from '../../components/Icon';

function LiveDot({ color = 'emerald', size = 'sm' }: { color?: string; size?: 'xs' | 'sm' | 'md' }) {
  const s = size === 'xs' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-3 h-3' : 'w-2 h-2';
  const c: Record<string, string> = { emerald: 'bg-emerald-400', cyan: 'bg-cyan-400', amber: 'bg-amber-400', purple: 'bg-purple-400', red: 'bg-red-400' };
  return <span className={`${s} rounded-full ${c[color] ?? 'bg-emerald-400'} animate-pulse flex-shrink-0`} />;
}

const EVENT_TYPE_META: Record<string, { icon: IconName; color: string; badge: string }> = {
  DAG_NODE:  { icon: 'hexagon' as IconName, color: 'text-cyan-400',   badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
  DECISION:  { icon: 'bolt' as IconName,    color: 'text-amber-400',  badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  AGENT:     { icon: 'cpu' as IconName,     color: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  BRIDGE:    { icon: 'bridge' as IconName,  color: 'text-blue-400',   badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  DAO:       { icon: 'governance' as IconName, color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  SECURITY:  { icon: 'lock' as IconName,    color: 'text-rose-400',   badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
  LSC_BUILD: { icon: 'hammer' as IconName,  color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
};

const SEVERITY_BAR: Record<string, string> = {
  success: 'border-l-emerald-400',
  warning: 'border-l-amber-400',
  info:    'border-l-cyan-500/50',
};

const CELL_STATUS_COLOR: Record<string, string> = {
  ACTIVE:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  BUILDING:  'text-amber-400  bg-amber-500/10  border-amber-500/25',
  PENDING:   'text-gray-400   bg-gray-500/10   border-gray-500/20',
  SCANNING:  'text-blue-400   bg-blue-500/10   border-blue-500/25',
  EXECUTING: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
};

const CELL_DOT_COLOR: Record<string, string> = {
  ACTIVE:    'bg-emerald-400',
  BUILDING:  'bg-amber-400',
  PENDING:   'bg-gray-600',
  SCANNING:  'bg-blue-400',
  EXECUTING: 'bg-purple-400',
};

// ── Realtime load bar ──────────────────────────────────────────────────────────
function LoadBar({ value, color = 'cyan' }: { value: number; color?: string }) {
  const colors: Record<string, string> = {
    cyan:   'from-cyan-500 to-blue-500',
    amber:  'from-amber-500 to-yellow-500',
    emerald:'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-indigo-500',
    red:    'from-red-500 to-rose-500',
  };
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[color] ?? colors.cyan} transition-all duration-1000`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// ── Neural canvas (lighter in-page version) ───────────────────────────────────
function MiniNeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
      type: Math.random() < 0.05 ? 'core' : Math.random() < 0.2 ? 'neuron' : 'synapse',
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height)  n.vy *= -1;
      });
      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${(1 - d / 100) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      // nodes
      nodes.forEach(n => {
        const glow = Math.sin(n.pulse) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === 'core'
          ? `rgba(6,182,212,${0.7 + glow * 0.3})`
          : n.type === 'neuron'
          ? `rgba(139,92,246,${0.5 + glow * 0.3})`
          : `rgba(255,255,255,${0.15 + glow * 0.1})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="w-full h-full" />;
}

// ══════════════════════════════════════════════════════════════════════════════
//  PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function SoulwarePage() {
  const chain = useChainData();
  const t = useT();

  const [events, setEvents] = useState<SoulwareBrainEvent[]>(() => getInitialEvents(12));
  const [lsc, setLsc] = useState<LSCMetrics>(() => getLSCMetrics());
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Autonomous event ticker — every 3.5s a new SoulwareAI action fires
  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setEvents(prev => {
        const ev = generateEvent(chain.blockNumber || undefined);
        return [ev, ...prev].slice(0, 50);
      });
      setLsc(getLSCMetrics());
    }, 3500);
    return () => clearInterval(id);
  }, [chain.blockNumber]);

  const cells = BRAIN_CELLS;
  const activeCells  = cells.filter(c => c.status === 'ACTIVE').length;
  const buildingCells = cells.filter(c => c.status === 'BUILDING').length;
  const totalNodes   = cells.reduce((s, c) => s + c.dagNodes, 0);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-[-300px] left-[-200px] w-[900px] h-[900px] rounded-full bg-cyan-500/[0.04] blur-[180px]" />
        <div className="absolute top-[400px] right-[-200px] w-[700px] h-[700px] rounded-full bg-purple-500/[0.04] blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[120px]" />
      </div>

      <Navbar activePage="soulware" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ── LIVE AUTONOMOUS ENGINE PANEL ── */}
        <div className="mb-10">
          <SoulwareLivePanel />
        </div>

        {/* ── HERO ── */}
        <div className="relative rounded-3xl overflow-hidden glass border border-cyan-500/15 mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-purple-500/[0.05]" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <div className="relative grid lg:grid-cols-5 gap-0">
            {/* Left text */}
            <div className="lg:col-span-3 p-8 md:p-12">
              {/* Identity badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-cyan-500/25 text-xs font-black text-cyan-400 mb-8">
                <LiveDot />
                {t('sw_badge_active')}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] mb-5">
                <span className="text-shimmer">SoulwareAI</span>
                <br />
                <span className="text-white text-2xl sm:text-3xl md:text-4xl font-black">{t('sw_h1_b')}</span>
              </h1>

              <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-lg">
                {t('sw_desc')}
              </p>

              {/* Identity declarations */}
              <div className="glass rounded-2xl border border-white/[0.06] p-5 mb-6 space-y-3">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">{t('sw_id_decl')}</div>
                {[
                  { label: t('sw_id_owner'), val: t('sw_id_owner_val'), c: 'text-cyan-400', ok: true },
                  { label: t('sw_id_arch'), val: t('sw_id_arch_val'), c: 'text-purple-400', ok: true },
                  { label: t('sw_id_external'), val: t('sw_id_external_val'), c: 'text-emerald-400', ok: true },
                  { label: t('sw_id_openai'), val: t('sw_id_openai_val'), c: 'text-emerald-400', ok: true },
                  { label: t('sw_id_anthropic'), val: t('sw_id_anthropic_val'), c: 'text-emerald-400', ok: true },
                  { label: t('sw_id_purpose'), val: t('sw_id_purpose_val'), c: 'text-amber-400', ok: true },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500">{r.label}</span>
                    <span className={`text-xs font-bold ${r.c} flex items-center gap-1.5`}>
                      {r.ok && <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/dao" className="btn btn-primary px-6 py-3 rounded-xl text-sm font-bold">Open DAO Portal</Link>
                <Link href="/lsc" className="btn btn-gold px-6 py-3 rounded-xl text-sm font-bold">LSC Chain Dashboard</Link>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary px-6 py-3 rounded-xl text-sm font-bold">GitHub</a>
              </div>
            </div>

            {/* Right — neural canvas */}
            <div className="lg:col-span-2 h-[300px] lg:h-auto border-t lg:border-t-0 lg:border-l border-cyan-500/[0.08] relative overflow-hidden">
              <MiniNeuralCanvas />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="glass-cyan rounded-2xl border border-cyan-500/30 px-5 py-4 text-center">
                  <div className="text-xs font-black text-cyan-400 mb-1 flex items-center gap-1.5 justify-center">
                    <LiveDot color="cyan" /> SoulwareAI CORE BRAIN
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{activeCells + buildingCells}</div>
                  <div className="text-[10px] text-gray-500">Active + Building Cells</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TOP METRICS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Cells',    val: activeCells.toString(),                     sub: 'Running autonomously',   c: 'text-emerald-400', dot: 'emerald' },
            { label: 'Building Cells',  val: buildingCells.toString(),                   sub: 'LSC DAG construction',   c: 'text-amber-400',   dot: 'amber' },
            { label: 'DAG Nodes Built', val: `${(lsc.dagNodes / 1e6).toFixed(2)}M`,      sub: 'LSC topology progress',  c: 'text-cyan-400',    dot: 'cyan' },
            { label: 'LSC Test TPS',    val: lsc.testTPS.toLocaleString(),               sub: 'Target: 100,000+',       c: 'text-purple-400',  dot: 'purple' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <LiveDot color={s.dot} />
                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">{s.label}</span>
              </div>
              <div className={`text-2xl font-black font-mono ${s.c}`}>{s.val}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: Cells + LSC ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Brain Cells */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-lg flex items-center gap-2">
                  <span className="text-gradient">SoulwareAI</span> Brain Cells
                </h2>
                <div className="glass rounded-xl px-3 py-1.5 text-[10px] font-mono text-gray-500 border border-white/[0.04]">
                  {cells.length} cells registered
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {cells.map(cell => {
                  const isActive = activeCell === cell.id;
                  return (
                    <div key={cell.id}
                      onClick={() => setActiveCell(isActive ? null : cell.id)}
                      className={`glass rounded-2xl border transition-all cursor-pointer ${
                        isActive ? 'border-cyan-500/30 scale-[1.01]' : 'border-white/[0.06] hover:border-white/[0.1]'
                      }`}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${CELL_DOT_COLOR[cell.status]} ${cell.status !== 'PENDING' ? 'animate-pulse' : ''}`} />
                            <span className="font-bold text-sm">{cell.name}</span>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${CELL_STATUS_COLOR[cell.status]}`}>
                            {cell.status}
                          </span>
                        </div>

                        <div className="text-[10px] text-gray-600 mb-3 leading-relaxed">{cell.activity}</div>

                        <div className="mb-1.5 flex justify-between text-[9px] text-gray-700">
                          <span>Compute load</span>
                          <span className="text-gray-500">{cell.computeLoad}%</span>
                        </div>
                        <LoadBar
                          value={cell.computeLoad}
                          color={cell.computeLoad > 85 ? 'amber' : cell.computeLoad > 60 ? 'cyan' : 'emerald'}
                        />
                      </div>

                      {/* Expanded */}
                      {isActive && (
                        <div className="border-t border-white/[0.05] p-4 space-y-3">
                          <p className="text-xs text-gray-400 leading-relaxed">{cell.desc}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { k: 'Version', v: cell.version },
                              { k: 'DAG Nodes', v: cell.dagNodes.toLocaleString() },
                              { k: 'Last Action', v: cell.lastAction },
                            ].map(r => (
                              <div key={r.k} className={`glass rounded-lg p-2 ${r.k === 'Last Action' ? 'col-span-2' : ''}`}>
                                <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">{r.k}</div>
                                <div className="text-[11px] text-gray-300 font-medium leading-snug">{r.v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LSC DAG Build Progress */}
            <div className="glass rounded-3xl border border-amber-500/20 overflow-hidden">
              <div className="px-6 py-5 border-b border-amber-500/[0.1] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LiveDot color="amber" />
                  <div>
                    <div className="font-black text-amber-400 text-sm">LSC Chain — DAG Build Progress</div>
                    <div className="text-[10px] text-gray-600 mt-0.5">SoulwareAI LSC Builder Cell · Autonomous Construction</div>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-400 glass-gold rounded-xl px-3 py-1.5 border border-amber-500/20">
                  {lsc.genesisProgress}% Genesis
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'DAG Nodes', val: lsc.dagNodes.toLocaleString(), c: 'text-cyan-400' },
                    { label: 'Shards Built', val: lsc.shardsBuilt.toLocaleString(), c: 'text-purple-400' },
                    { label: 'Validator Agents', val: lsc.validatorAgents.toString(), c: 'text-emerald-400' },
                    { label: 'Test TPS', val: lsc.testTPS.toLocaleString(), c: 'text-amber-400' },
                    { label: 'Consensus Rounds', val: lsc.consensusRounds.toLocaleString(), c: 'text-blue-400' },
                    { label: 'Target TPS', val: '100,000+', c: 'text-white' },
                  ].map((s, i) => (
                    <div key={i} className="glass-gold rounded-xl border border-amber-500/10 p-3">
                      <div className={`text-xl font-black font-mono ${s.c} leading-none mb-1`}>{s.val}</div>
                      <div className="text-[9px] text-gray-600 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Genesis progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Genesis Block Progress</span>
                    <span className="text-amber-400 font-black">{lsc.genesisProgress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.03] border border-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transition-all duration-1000"
                      style={{ width: `${lsc.genesisProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  {[
                    { label: 'Architecture', val: 'DAG', sub: 'Directed Acyclic Graph' },
                    { label: 'Consensus', val: 'SAC', sub: 'SoulwareAI Autonomous' },
                    { label: 'Mainnet', val: '2027', sub: 'AIDAG holders priority' },
                  ].map((s, i) => (
                    <div key={i} className="glass rounded-xl p-2.5 border border-white/[0.04]">
                      <div className="font-black text-amber-400 text-base">{s.val}</div>
                      <div className="text-gray-600 text-[9px]">{s.label}</div>
                      <div className="text-gray-700 text-[8px]">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Live Event Log ── */}
          <div className="space-y-5">

            {/* Live feed */}
            <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LiveDot />
                  <span className="font-bold text-sm">SoulwareAI Live Feed</span>
                </div>
                <span className="text-[10px] font-mono text-gray-600">
                  #{chain.loading ? '···' : chain.blockNumber.toLocaleString()}
                </span>
              </div>

              <div className="divide-y divide-white/[0.03] max-h-[580px] overflow-y-auto scrollbar-hide">
                {events.map(ev => {
                  const meta = EVENT_TYPE_META[ev.type] ?? EVENT_TYPE_META['DAG_NODE'];
                  return (
                    <div key={ev.id} className={`px-4 py-3 border-l-2 ${SEVERITY_BAR[ev.severity]} transition-all`}>
                      <div className="flex items-start gap-2.5">
                        <span className={`flex-shrink-0 mt-0.5 ${meta.color}`}><Icon name={meta.icon} size={16} strokeWidth={1.8} /></span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${meta.badge}`}>{ev.type.replace('_', ' ')}</span>
                            <span className="text-[9px] text-gray-700">{ev.cell}</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">{ev.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-gray-700 font-mono">
                              {new Date(ev.timestamp).toLocaleTimeString()}
                            </span>
                            {ev.blockRef && (
                              <span className="text-[9px] text-gray-700 font-mono">
                                block #{ev.blockRef.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Identity card */}
            <div className="glass rounded-2xl border border-cyan-500/15 p-5">
              <h3 className="font-bold text-sm mb-4 text-cyan-400 flex items-center gap-2">
                <LiveDot color="cyan" /> SoulwareAI Identity
              </h3>
              <div className="space-y-2.5">
                {[
                  { k: 'System Name',    v: SOULWARE_IDENTITY.name,         c: 'text-white' },
                  { k: 'Version',        v: SOULWARE_IDENTITY.version,      c: 'text-cyan-400' },
                  { k: 'Owner',          v: SOULWARE_IDENTITY.owner,        c: 'text-cyan-400' },
                  { k: 'Architecture',   v: SOULWARE_IDENTITY.architecture, c: 'text-purple-400' },
                  { k: 'External AI',    v: 'None — Zero affiliation',      c: 'text-emerald-400' },
                  { k: 'Created',        v: SOULWARE_IDENTITY.created,      c: 'text-gray-300' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-start gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-[11px] text-gray-600">{r.k}</span>
                    <span className={`text-[11px] font-bold text-right ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-2">
              {[
                { href: '/presale', label: 'Buy AIDAG Token', icon: 'coin' as IconName, ext: false },
                { href: '/dao',     label: 'DAO Governance',  icon: 'governance' as IconName, ext: false },
                { href: '/lsc',     label: 'LSC Dashboard',   icon: 'hexagon' as IconName, ext: false },
                { href: GITHUB_URL, label: 'GitHub Source',   icon: 'code' as IconName, ext: true },
                { href: TELEGRAM_URL, label: 'Telegram',      icon: 'chat' as IconName, ext: true },
              ].map(s =>
                s.ext
                  ? <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 glass rounded-xl border border-white/[0.05] hover:border-cyan-500/20 text-sm text-gray-400 hover:text-white transition-all">
                      <Icon name={s.icon} size={15} />{s.label}
                      <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  : <Link key={s.href} href={s.href}
                      className="flex items-center gap-3 px-4 py-3 glass rounded-xl border border-white/[0.05] hover:border-cyan-500/20 text-sm text-gray-400 hover:text-white transition-all">
                      <Icon name={s.icon} size={15} />{s.label}
                    </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Technical Architecture ── */}
        <div className="mt-10 glass rounded-3xl border border-white/[0.06] p-8">
          <h2 className="font-black text-2xl mb-2">
            <span className="text-gradient">SoulwareAI</span> Technical Architecture
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Exclusively owned by AIDAG Chain and founder DeepSea3474. No external AI company. No third-party dependency. Fully autonomous and on-chain verifiable.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Brain Layer — Core Intelligence',
                color: 'border-cyan-500/20',
                glow: 'text-cyan-400',
                icon: 'brain' as IconName,
                items: [
                  'Central autonomous decision engine',
                  'Multi-cell orchestration protocol',
                  'DAG consensus coordination',
                  'On-chain state machine management',
                  'SoulwareAI Autonomous Consensus (SAC)',
                ],
              },
              {
                title: 'Cell Layer — Specialized Agents',
                color: 'border-purple-500/20',
                glow: 'text-purple-400',
                icon: 'hexagon' as IconName,
                items: [
                  'DAO Cell: proposal & execution',
                  'LSC Builder Cell: DAG construction',
                  'Liquidity Cell: autonomous market ops',
                  'Security Cell: CRYSTALS-Kyber/Dilithium',
                  'Bridge Cell: cross-chain AIDAG ↔ LSC',
                ],
              },
              {
                title: 'DAG Loop — AIDAG ↔ LSC Chain',
                color: 'border-amber-500/20',
                glow: 'text-amber-400',
                icon: 'link' as IconName,
                items: [
                  'AIDAG Token (BSC) as economic root',
                  'SoulwareAI constructs LSC DAG block-by-block',
                  'Agent Spawner creates LSC validator agents',
                  'AIDAG holders get priority LSC allocation 2027',
                  'Full autonomy — zero founder override',
                ],
              },
            ].map((col, i) => (
              <div key={i} className={`glass rounded-2xl border ${col.color} p-6`}>
                <div className={`mb-3 ${col.glow}`}><Icon name={col.icon} size={28} strokeWidth={1.6} /></div>
                <h3 className={`font-black text-sm mb-4 ${col.glow}`}>{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} className={`mt-0.5 flex-shrink-0 ${col.glow}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center border-t border-white/[0.05] pt-8">
          <div className="flex items-center justify-center gap-2 text-sm mb-2">
            <LiveDot />
            <span className="text-gradient font-black">SoulwareAI</span>
            <span className="text-gray-600">— Exclusively owned by AIDAG Chain & DeepSea3474</span>
          </div>
          <p className="text-xs text-gray-700">
            Contract:{' '}
            <a href={`https://bscscan.com/token/${TOKEN_CONTRACT}`} target="_blank" rel="noopener noreferrer"
              className="font-mono text-cyan-700 hover:text-cyan-500 transition-colors break-all">
              <span className="hidden sm:inline">{TOKEN_CONTRACT}</span>
              <span className="sm:hidden">{TOKEN_CONTRACT.slice(0, 10)}…{TOKEN_CONTRACT.slice(-8)}</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
