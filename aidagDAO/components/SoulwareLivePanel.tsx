'use client';
import { useEffect, useState } from 'react';

type Decision = {
  id: string;
  ts: number;
  kind: string;
  source: string;
  message: string;
  mode: string;
};

type Module = {
  id: string;
  name: string;
  status: 'active' | 'degraded' | 'idle';
  lastRunAt: number;
  ticks: number;
  errors: number;
};

type RpcHealth = {
  url: string;
  ok: boolean;
  latencyMs: number | null;
  consecutiveFailures: number;
};

type LiveStatus = {
  ok: boolean;
  health: 'healthy' | 'degraded' | 'critical';
  autonomyMode: string;
  dryRun: boolean;
  uptimeMs: number;
  ticks: number;
  lastTickAt: number;
  chain: { blockNumber: number | null; gasPriceGwei: number | null; bnbPrice: number | null; rpcInUse: string | null };
  treasury: {
    daoBnb: number | null; founderBnb: number | null; operationBnb: number | null;
    totalBnb: number | null; withinTolerance: boolean | null;
    splitObservedPct: { dao: number | null; operation: number | null };
  };
  presale: { stage: number; priceUsd: number; tokensSoldOnChain: number | null; tokensSoldDerivedFromBnb: number | null; raisedUsd: number | null; progressPct: number | null; source: string; uniqueBuyers: number };
  modules: Module[];
  rpcHealth: RpcHealth[];
  decisions: Decision[];
  queue: { id: string; kind: string; reason: string; requires: string }[];
  lsc: { bestRealTps: number; bestFinalityMs: number; iterationCount: number };
  evolutionScore: number;
  timestamp: number;
};

const MODE_BADGE: Record<string, string> = {
  log:      'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  observer: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
  propose:  'text-amber-400 border-amber-500/30 bg-amber-500/10',
  execute:  'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
};

const HEALTH_BADGE: Record<string, string> = {
  healthy:  'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  degraded: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  critical: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
};

function fmtUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function fmtTime(ts: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('tr-TR', { hour12: false });
}

export default function SoulwareLivePanel() {
  const [data, setData] = useState<LiveStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch('/api/soulware/status', { cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unreachable';
        if (!cancelled) setError(msg);
      }
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!data && !error) {
    return (
      <div className="glass rounded-3xl border border-white/[0.06] p-6 text-center text-sm text-gray-500">
        SoulwareAI motoruna bağlanılıyor…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="glass rounded-3xl border border-rose-500/30 p-6 text-sm text-rose-300">
        SoulwareAI motoru cevap vermiyor: {error}
      </div>
    );
  }

  if (!data) return null;

  const okRpcs = data.rpcHealth.filter(r => r.ok).length;

  return (
    <section className="glass rounded-3xl border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-cyan-500/[0.12] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="font-black text-cyan-400 text-sm tracking-wide">SoulwareAI Live — Otonom Motor</div>
            <div className="text-[10px] text-gray-600 mt-0.5">
              Sunucu tarafında sürekli çalışan karar motoru · gerçek zincir verisi
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${HEALTH_BADGE[data.health]}`}>
            {data.health.toUpperCase()}
          </span>
          <span className="text-[10px] font-black px-2 py-1 rounded-full border border-white/15 text-white/80 bg-white/[0.04]">
            MODE: {data.autonomyMode.toUpperCase()}
          </span>
          {data.dryRun && (
            <span className="text-[10px] font-black px-2 py-1 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">
              DRY-RUN
            </span>
          )}
          <span className="text-[10px] font-mono text-gray-500">tick #{data.ticks}</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 border-b border-white/[0.04]">
        {[
          { label: 'Uptime', val: fmtUptime(data.uptimeMs), c: 'text-emerald-400' },
          { label: 'BSC Blok', val: data.chain.blockNumber?.toLocaleString() ?? '—', c: 'text-cyan-400' },
          { label: 'Gas', val: data.chain.gasPriceGwei !== null ? `${data.chain.gasPriceGwei} Gwei` : '—', c: 'text-amber-400' },
          { label: 'BNB', val: data.chain.bnbPrice !== null ? `$${data.chain.bnbPrice.toFixed(2)}` : '—', c: 'text-purple-400' },
          { label: 'Hazine BNB', val: data.treasury.totalBnb !== null ? data.treasury.totalBnb.toFixed(4) : '—', c: 'text-emerald-400' },
          { label: '60/40 Split', val: data.treasury.withinTolerance === null ? '—' : data.treasury.withinTolerance ? 'Dengede' : 'Sapma', c: data.treasury.withinTolerance === false ? 'text-amber-400' : 'text-emerald-400' },
          { label: `Presale (${data.presale.source})`, val: (data.presale.tokensSoldOnChain ?? data.presale.tokensSoldDerivedFromBnb) !== null ? `${Math.round((data.presale.tokensSoldOnChain ?? data.presale.tokensSoldDerivedFromBnb) as number).toLocaleString()} AIDAG` : '—', c: 'text-cyan-400' },
          { label: 'LSC En İyi TPS', val: data.lsc.bestRealTps > 0 ? data.lsc.bestRealTps.toLocaleString() : '—', c: 'text-purple-400' },
        ].map((m, i) => (
          <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
            <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">{m.label}</div>
            <div className={`text-sm font-black font-mono ${m.c} truncate`} title={m.val}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Modules + RPC */}
      <div className="grid md:grid-cols-2 gap-0 border-b border-white/[0.04]">
        <div className="p-5 border-b md:border-b-0 md:border-r border-white/[0.04]">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
            Çalışan Modüller ({data.modules.filter(m => m.status === 'active').length}/{data.modules.length})
          </div>
          <div className="space-y-1.5">
            {data.modules.map(m => (
              <div key={m.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-400 animate-pulse' : m.status === 'degraded' ? 'bg-amber-400' : 'bg-gray-600'}`} />
                  <span className="text-gray-300 truncate">{m.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 flex-shrink-0">
                  <span>{m.ticks} tick</span>
                  {m.errors > 0 && <span className="text-rose-400">{m.errors} err</span>}
                  <span>{fmtTime(m.lastRunAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
            RPC Sağlığı ({okRpcs}/{data.rpcHealth.length} aktif)
          </div>
          <div className="space-y-1.5">
            {data.rpcHealth.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span className={`truncate font-mono ${data.chain.rpcInUse === r.url ? 'text-cyan-400' : 'text-gray-400'}`} title={r.url}>
                    {r.url.replace(/^https?:\/\//, '')}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-600 flex-shrink-0">
                  {r.ok ? `${r.latencyMs ?? '—'}ms` : `${r.consecutiveFailures} fail`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decisions */}
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Son Otonom Kararlar ({data.decisions.length})
          </div>
          <div className="text-[10px] text-gray-600 font-mono">son tick: {fmtTime(data.lastTickAt)}</div>
        </div>
        <div className="max-h-[420px] overflow-y-auto divide-y divide-white/[0.04] -mx-2">
          {data.decisions.length === 0 && (
            <div className="text-xs text-gray-600 px-2 py-4">
              Henüz karar üretilmedi. Motor başlangıç döngüsünü tamamlıyor…
            </div>
          )}
          {data.decisions.map(d => (
            <div key={d.id} className="px-2 py-2.5">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${MODE_BADGE[d.mode] ?? MODE_BADGE.log}`}>
                  {d.mode.toUpperCase()}
                </span>
                <span className="text-[9px] font-black text-gray-500">{d.kind}</span>
                <span className="text-[9px] text-gray-700 font-mono">{d.source}</span>
                <span className="text-[9px] text-gray-700 font-mono ml-auto">{fmtTime(d.ts)}</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">{d.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending queue */}
      <div className="p-5">
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
          Founder Onay Kuyruğu ({data.queue.length})
        </div>
        {data.queue.length === 0 ? (
          <div className="text-xs text-gray-600">Bekleyen onay yok — tüm kurallar dengede.</div>
        ) : (
          <div className="space-y-2">
            {data.queue.slice(0, 8).map(q => (
              <div key={q.id} className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-3 py-2">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10">{q.kind}</span>
                  <span className="text-[9px] text-gray-600 font-mono">{q.requires}</span>
                </div>
                <p className="text-xs text-gray-300">{q.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
