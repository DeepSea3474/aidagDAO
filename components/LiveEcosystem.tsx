'use client';
import { useEffect, useState, useRef } from 'react';
import { TOKEN_CONTRACT, MAX_SUPPLY, FOUNDER_COINS, SOULWARE_MODULES } from '../lib/constants';
import { useChainData } from '../lib/useChainData';

const BSC_RPCS = [
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
];

interface LiveBlock {
  number: number;
  hash: string;
  txCount: number;
  gasUsed: string;
  miner: string;
  ts: number;
  age: number;
}

async function rpc(method: string, params: any[]): Promise<any> {
  for (const url of BSC_RPCS) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) continue;
      const j = await r.json();
      if (j.error) continue;
      return j.result;
    } catch {}
  }
  return null;
}

async function fetchBlock(num: number | 'latest'): Promise<LiveBlock | null> {
  const tag = num === 'latest' ? 'latest' : '0x' + num.toString(16);
  const b = await rpc('eth_getBlockByNumber', [tag, false]);
  if (!b) return null;
  return {
    number: parseInt(b.number, 16),
    hash: b.hash,
    txCount: b.transactions?.length ?? 0,
    gasUsed: (parseInt(b.gasUsed, 16) / 1e6).toFixed(2),
    miner: b.miner,
    ts: parseInt(b.timestamp, 16),
    age: 0,
  };
}

async function fetchTokenStats(): Promise<{ supply: number; founder: number } | null> {
  const supplyHex = await rpc('eth_call', [{ to: TOKEN_CONTRACT, data: '0x18160ddd' }, 'latest']);
  if (!supplyHex || supplyHex === '0x') return null;
  const supply = Number(BigInt(supplyHex)) / 1e18;
  return { supply, founder: FOUNDER_COINS };
}

const fmtN = (n: number, d = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtAge = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);

// ─────────────────────────────────────────────────────────────────────
//  SoulwareAI Brain & Cells — declared cell roster (config only, not telemetry)
// ─────────────────────────────────────────────────────────────────────
function BrainPanel() {
  // Real, source-of-truth heartbeat: latest BSC block (the LSC Builder Cell consumes BSC blocks).
  const [latestBlock, setLatestBlock] = useState<LiveBlock | null>(null);
  const [history, setHistory] = useState<LiveBlock[]>([]);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const b = await fetchBlock('latest');
      if (!alive || !b) return;
      setLatestBlock((prev) => {
        if (prev && prev.number === b.number) return prev;
        setHistory((h) => (h.length && h[0].number === b.number ? h : [b, ...h].slice(0, 4)));
        return b;
      });
    };
    tick();
    const iv = setInterval(tick, 3000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  const active = SOULWARE_MODULES.filter((m) => m.status === 'ACTIVE').length;
  const building = SOULWARE_MODULES.filter((m) => m.status === 'BUILDING').length;
  const pending = SOULWARE_MODULES.filter((m) => m.status === 'PENDING').length;

  return (
    <div className="glass rounded-3xl border border-cyan-500/20 p-6 md:p-7 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 relative">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SoulwareAI · Brain &amp; Cells
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Autonomous Brain — <span className="text-gradient">Cell Roster</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Declared cell topology of AIDAG Chain&apos;s SoulwareAI brain. Status reflects the on-chain
            configuration; real cell-level telemetry will publish post-mainnet (2027).
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Active (declared)</div>
            <div className="font-mono text-2xl font-black text-emerald-400">{active}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Building</div>
            <div className="font-mono text-2xl font-black text-amber-400">{building}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Pending</div>
            <div className="font-mono text-2xl font-black text-gray-400">{pending}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 relative">
        {/* Cells grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          {SOULWARE_MODULES.map((m) => {
            const isActive = m.status === 'ACTIVE';
            const isBuilding = m.status === 'BUILDING';
            const colour = isActive
              ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
              : isBuilding
              ? 'border-amber-500/25 bg-amber-500/[0.04]'
              : 'border-white/[0.06] bg-white/[0.02]';
            const dot = isActive ? 'bg-emerald-400' : isBuilding ? 'bg-amber-400' : 'bg-gray-600';
            const badge = isActive
              ? 'text-emerald-400'
              : isBuilding
              ? 'text-amber-400'
              : 'text-gray-500';
            return (
              <div
                key={m.id}
                className={`rounded-xl border ${colour} p-2.5 relative transition-all`}
                style={{ opacity: isActive || isBuilding ? 1 : 0.65 }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 flex-shrink-0 ${
                      isActive ? 'animate-pulse' : ''
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <div className="text-[11px] font-bold text-white truncate">{m.name}</div>
                      <div className={`text-[8px] font-black uppercase tracking-wider ${badge}`}>
                        {m.status}
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-500 leading-tight mt-0.5 line-clamp-2">
                      {m.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real BSC block heartbeat — fed into LSC Builder Cell */}
        <div className="rounded-xl border border-white/[0.06] bg-[#020617]/60 p-3">
          <div className="text-[9px] uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
            LSC Builder · BSC block intake
          </div>
          <div className="space-y-1.5 min-h-[140px]">
            {!latestBlock ? (
              <div className="text-[10px] text-gray-700 font-mono">Connecting BSC RPC…</div>
            ) : (
              history.map((b, i) => (
                <div
                  key={b.hash}
                  className="text-[10px] font-mono text-gray-400 leading-tight"
                  style={{ opacity: 1 - i * 0.18 }}
                >
                  <span className="text-cyan-400">
                    [{new Date(b.ts * 1000).toLocaleTimeString([], { hour12: false })}]
                  </span>{' '}
                  block <span className="text-white">#{fmtN(b.number)}</span> ·{' '}
                  <span className="text-emerald-400">{b.txCount}</span> tx
                </div>
              ))
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-white/[0.05] text-[9px] text-gray-600 leading-snug">
            Each new BSC block is a verifiable input event for the LSC Builder Cell. No synthetic
            telemetry — only real RPC data.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  AIDAG Token live stats — left panel
// ─────────────────────────────────────────────────────────────────────
function AidagPanel() {
  const chain = useChainData();
  const [stats, setStats] = useState<{ supply: number; founder: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const s = await fetchTokenStats();
      if (!alive) return;
      setStats(s);
      setLoading(false);
    };
    refresh();
    const iv = setInterval(refresh, 30_000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  const supply = stats?.supply ?? 0;
  const circulating = supply > 0 ? supply - FOUNDER_COINS : 0;
  const usdSupply = supply > 0 ? supply * 0.078 : 0; // stage 1 valuation

  return (
    <div className="glass rounded-3xl border border-amber-500/20 p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            AIDAG Token · BSC Live
          </div>
          <div className="text-base font-black text-white">On-Chain Reality</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Verified via BSC RPC every 30s</div>
        </div>
        <a
          href={`https://bscscan.com/token/${TOKEN_CONTRACT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-amber-400/70 hover:text-amber-400 font-mono"
        >
          BSCScan ↗
        </a>
      </div>

      <div className="space-y-2.5 relative">
        <Row
          label="Total Supply"
          value={loading || !stats ? '—' : `${fmtN(supply)} AIDAG`}
          sub={loading ? 'Fetching from BSC…' : 'eth_call · totalSupply()'}
        />
        <Row
          label="Max Supply (cap)"
          value={`${fmtN(MAX_SUPPLY)} AIDAG`}
          sub="Hard-coded · No mint function"
          accent="text-cyan-400"
        />
        <Row
          label="Founder Lock"
          value={`${fmtN(FOUNDER_COINS)} AIDAG`}
          sub="14.29% · 1-year locked"
          accent="text-purple-400"
        />
        <Row
          label="Circulating + DAO"
          value={loading || !stats ? '—' : `${fmtN(circulating)} AIDAG`}
          sub="Supply − founder lock"
          accent="text-emerald-400"
        />
        <Row
          label="Stage 1 Valuation"
          value={usdSupply > 0 ? `$${fmtN(usdSupply * 0.078 / 0.078)}` : '—'}
          sub="@ $0.078 / AIDAG"
          accent="text-yellow-400"
        />
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.05] grid grid-cols-2 gap-3 relative">
        <div className="rounded-lg bg-[#020617]/60 border border-white/[0.05] p-2.5">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Contract</div>
          <a
            href={`https://bscscan.com/address/${TOKEN_CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-amber-400 hover:text-amber-300 break-all leading-tight block"
          >
            {TOKEN_CONTRACT.slice(0, 10)}…{TOKEN_CONTRACT.slice(-8)}
          </a>
        </div>
        <div className="rounded-lg bg-[#020617]/60 border border-white/[0.05] p-2.5">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Network</div>
          <div className="text-[11px] font-bold text-yellow-400">BSC · Chain 56</div>
          <div className="text-[9px] text-gray-600">BEP-20 · Verified</div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  accent = 'text-white',
}: {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2">
      <div className="min-w-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
        <div className="text-[9px] text-gray-700 truncate">{sub}</div>
      </div>
      <div className={`font-mono text-sm font-black text-right flex-shrink-0 ${accent}`}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  DAG System Live — right panel (real BSC blocks → DAG nodes)
// ─────────────────────────────────────────────────────────────────────
function DagPanel() {
  const [blocks, setBlocks] = useState<LiveBlock[]>([]);
  const [latest, setLatest] = useState<number | null>(null);
  const [tps, setTps] = useState<number>(0);
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      // Throttle: only refetch if 3s since last fetch
      if (Date.now() - lastFetchRef.current < 2500) return;
      lastFetchRef.current = Date.now();

      const block = await fetchBlock('latest');
      if (!alive || !block) return;

      setBlocks((prev) => {
        if (prev.length && prev[0].number === block.number) return prev;
        const next = [block, ...prev].slice(0, 8);
        // TPS over last 4 blocks
        if (next.length >= 4) {
          const totalTx = next.slice(0, 4).reduce((s, b) => s + b.txCount, 0);
          const dt = next[0].ts - next[3].ts;
          if (dt > 0) setTps(Math.round(totalTx / dt));
        }
        return next;
      });
      setLatest(block.number);
    };

    tick();
    const iv = setInterval(tick, 3000);

    // Age refresher tick (every 1s)
    const ageIv = setInterval(() => {
      setBlocks((prev) =>
        prev.map((b) => ({ ...b, age: Math.max(0, Math.floor(Date.now() / 1000) - b.ts) })),
      );
    }, 1000);

    return () => {
      alive = false;
      clearInterval(iv);
      clearInterval(ageIv);
    };
  }, []);

  const totalTx = blocks.reduce((s, b) => s + b.txCount, 0);

  return (
    <div className="glass rounded-3xl border border-cyan-500/20 p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DAG System · BSC Live Feed
          </div>
          <div className="text-base font-black text-white">Real Blocks → DAG Nodes</div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            BSC mainnet · feeds the LSC DAG builder cell
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase tracking-wider text-gray-500">Latest</div>
          <div className="font-mono text-sm font-black text-cyan-400">
            {latest ? `#${fmtN(latest)}` : '—'}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2 mb-4 relative">
        <Stat label="Tx (last 8 blk)" value={blocks.length ? fmtN(totalTx) : '—'} c="text-emerald-400" />
        <Stat label="Live TPS" value={tps > 0 ? fmtN(tps) : '—'} c="text-cyan-400" />
        <Stat label="DAG Nodes" value={fmtN(blocks.length)} c="text-purple-400" />
      </div>

      {/* DAG flow — vertical list of incoming blocks animating in */}
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent" />
        <div className="space-y-2 relative max-h-[260px] overflow-hidden">
          {blocks.length === 0 ? (
            <div className="py-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
              <div className="text-[10px] text-gray-600 mt-2 font-mono">Connecting BSC RPC…</div>
            </div>
          ) : (
            blocks.map((b, i) => (
              <div
                key={b.hash}
                className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/25 px-3 py-2 transition-all"
                style={{
                  opacity: 1 - i * 0.08,
                  animation: i === 0 ? 'fadeUp 0.4s ease-out' : undefined,
                }}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <span
                    className={`block w-3 h-3 rounded-full border-2 ${
                      i === 0
                        ? 'border-cyan-400 bg-cyan-400/40 animate-pulse'
                        : 'border-cyan-500/40 bg-cyan-500/20'
                    }`}
                  />
                  {i < blocks.length - 1 && (
                    <span className="absolute left-1/2 top-3 -translate-x-1/2 w-px h-4 bg-cyan-500/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <a
                      href={`https://bscscan.com/block/${b.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200"
                    >
                      #{fmtN(b.number)}
                    </a>
                    <span className="text-[9px] text-gray-600 font-mono">{fmtAge(b.age)} ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono mt-0.5">
                    <span>
                      <span className="text-emerald-400 font-bold">{b.txCount}</span> tx
                    </span>
                    <span>
                      <span className="text-amber-400">{b.gasUsed}M</span> gas
                    </span>
                    <span className="truncate">
                      hash <span className="text-gray-600">{b.hash.slice(2, 10)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.05] text-[10px] text-gray-600 leading-relaxed relative">
        Each block streamed live from BSC mainnet via public RPC. SoulwareAI&apos;s LSC Builder Cell consumes these as DAG seed nodes for the 2027 native chain.
      </div>
    </div>
  );
}

function Stat({ label, value, c }: { label: string; value: string; c: string }) {
  return (
    <div className="rounded-lg bg-[#020617]/60 border border-white/[0.05] p-2 text-center">
      <div className={`font-mono text-base font-black ${c} leading-none`}>{value}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Main — exported composite
// ─────────────────────────────────────────────────────────────────────
export default function LiveEcosystem() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-10">
        <div className="section-label glass-cyan border border-cyan-500/20 text-cyan-400 mb-4 mx-auto w-fit">
          Live Ecosystem
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          AIDAG Chain — <span className="text-gradient">Live On BSC</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          Cell topology comes from the project&apos;s declared SoulwareAI configuration.
          Token, supply, BNB price, and BSC block data below are fetched live from public
          BSC RPCs and the Binance ticker — every value is independently verifiable.
        </p>
      </div>

      <BrainPanel />

      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        <AidagPanel />
        <DagPanel />
      </div>
    </section>
  );
}
