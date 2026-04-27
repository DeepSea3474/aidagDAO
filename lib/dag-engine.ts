'use client';

// ─── FNV-1a 32-bit hash (fast, deterministic, no async) ───────────────────────
function fnv1a(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function makeHash(seed: string): string {
  const a = fnv1a(seed);
  const b = fnv1a(a.toString(16) + seed);
  const c = fnv1a(b.toString(16) + seed.slice(0, 8));
  const d = fnv1a(c.toString(16) + seed.slice(-8));
  const e = fnv1a(a.toString(16) + d.toString(16));
  const f = fnv1a(b.toString(16) + c.toString(16));
  const g = fnv1a(e.toString(16) + seed);
  const h = fnv1a(f.toString(16) + seed);
  return [a, b, c, d, e, f, g, h].map(n => (n >>> 0).toString(16).padStart(8, '0')).join('');
}

function makeAddr(seed: string): string {
  return '0x' + makeHash(seed + 'addr').slice(0, 40);
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type VertexType = 'GENESIS' | 'TX' | 'SMART_CONTRACT' | 'DAO_VOTE' | 'BRIDGE' | 'VALIDATOR';

export interface DAGVertex {
  hash: string;
  shortHash: string;
  parents: string[];
  children: string[];
  height: number;
  cumulativeWeight: number;
  timestamp: number;
  validatorAddr: string;
  confirmed: boolean;
  type: VertexType;
  amount?: number;
  seq: number;
}

export interface DAGState {
  vertices: DAGVertex[];
  tips: string[];
  dagHeight: number;
  totalVertices: number;
  confirmedCount: number;
  tps: number;
  genesisHash: string;
}

type Listener = (state: DAGState) => void;

// ─── DAG Engine ───────────────────────────────────────────────────────────────
class DAGEngine {
  private vertices = new Map<string, DAGVertex>();
  private tips = new Set<string>();
  private genesisHash = '';
  private listeners: Listener[] = [];
  private seq = 0;
  private txWindowStart = Date.now();
  private txWindowCount = 0;
  private tps = 0;
  private running = false;
  private intervals: ReturnType<typeof setInterval>[] = [];

  constructor() {
    this.bootstrap();
  }

  private bootstrap() {
    // Genesis vertex (deterministic)
    const gSeed = 'LSC_GENESIS_2026-04-17_AIDAG_CHAIN_DAG';
    const gHash = makeHash(gSeed);
    const genesis: DAGVertex = {
      hash: gHash,
      shortHash: gHash.slice(0, 8) + '…' + gHash.slice(-4),
      parents: [],
      children: [],
      height: 0,
      cumulativeWeight: 9999,
      timestamp: new Date('2026-04-17T00:00:00Z').getTime(),
      validatorAddr: makeAddr('lsc_founder_genesis'),
      confirmed: true,
      type: 'GENESIS',
      seq: this.seq++,
    };
    this.vertices.set(gHash, genesis);
    this.tips.add(gHash);
    this.genesisHash = gHash;

    // Pre-fill with 60 vertices (build history)
    const types: VertexType[] = ['TX', 'TX', 'TX', 'TX', 'SMART_CONTRACT', 'DAO_VOTE', 'VALIDATOR', 'BRIDGE'];
    for (let i = 0; i < 60; i++) {
      const type = types[i % types.length];
      this._addVertex(type, Date.now() - (60 - i) * 3000);
    }
  }

  private selectTips(count: number): string[] {
    const arr = Array.from(this.tips);
    if (arr.length <= count) return arr;
    // Weighted: prefer heavier tips (more stable reference)
    const sorted = arr.sort((a, b) => {
      const wa = this.vertices.get(a)?.cumulativeWeight ?? 0;
      const wb = this.vertices.get(b)?.cumulativeWeight ?? 0;
      return wb - wa;
    });
    // Mix: 1 heaviest + 1 random
    const heavy = sorted[0];
    const randIdx = 1 + Math.floor(Math.random() * (arr.length - 1));
    const rand = sorted[randIdx] ?? sorted[0];
    return count === 1 ? [heavy] : [heavy, rand];
  }

  private _addVertex(type: VertexType = 'TX', ts?: number): DAGVertex {
    const parents = this.selectTips(2);
    const parentHeights = parents.map(p => this.vertices.get(p)?.height ?? 0);
    const height = Math.max(...parentHeights) + 1;
    const now = ts ?? Date.now();
    const hash = makeHash(parents.join('') + this.seq.toString() + now.toString() + type);

    const vertex: DAGVertex = {
      hash,
      shortHash: hash.slice(0, 8) + '…' + hash.slice(-4),
      parents,
      children: [],
      height,
      cumulativeWeight: 1,
      timestamp: now,
      validatorAddr: makeAddr(hash + 'v'),
      confirmed: false,
      type,
      amount: type === 'TX' ? parseFloat((Math.random() * 100 + 0.001).toFixed(6)) : undefined,
      seq: this.seq++,
    };

    this.vertices.set(hash, vertex);

    // Wire parent → child links & propagate weight
    parents.forEach(ph => {
      this.tips.delete(ph);
      const parent = this.vertices.get(ph);
      if (parent) {
        parent.children.push(hash);
        parent.cumulativeWeight += 1;
        if (parent.cumulativeWeight >= 3 && !parent.confirmed) {
          parent.confirmed = true;
        }
      }
    });

    this.tips.add(hash);
    this.txWindowCount++;

    // Recalculate TPS every 5 seconds
    const elapsed = (Date.now() - this.txWindowStart) / 1000;
    if (elapsed >= 5) {
      this.tps = Math.round(this.txWindowCount / elapsed);
      this.txWindowCount = 0;
      this.txWindowStart = Date.now();
    }

    // Prune old confirmed vertices (keep last 150)
    if (this.vertices.size > 150) {
      const prunable = Array.from(this.vertices.entries())
        .filter(([h, v]) => v.confirmed && !this.tips.has(h) && h !== this.genesisHash)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, 30);
      prunable.forEach(([h]) => this.vertices.delete(h));
    }

    return vertex;
  }

  // Public: add a new vertex (called by SoulwareAI or autonomously)
  addVertex(type: VertexType = 'TX'): DAGVertex {
    const v = this._addVertex(type);
    this.notify();
    return v;
  }

  // Start autonomous self-operation
  start() {
    if (this.running) return;
    this.running = true;

    // High-frequency TX stream (simulates 97k TPS in compressed time)
    this.intervals.push(setInterval(() => {
      // Burst 3-8 transactions per tick
      const burst = 3 + Math.floor(Math.random() * 6);
      const types: VertexType[] = ['TX', 'TX', 'TX', 'SMART_CONTRACT', 'VALIDATOR'];
      for (let i = 0; i < burst; i++) {
        this._addVertex(types[Math.floor(Math.random() * types.length)]);
      }
      this.notify();
    }, 500));

    // Occasional special vertices
    this.intervals.push(setInterval(() => {
      this._addVertex('DAO_VOTE');
      this.notify();
    }, 15000));

    this.intervals.push(setInterval(() => {
      this._addVertex('BRIDGE');
      this.notify();
    }, 20000));
  }

  stop() {
    this.running = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  getState(): DAGState {
    const vArr = Array.from(this.vertices.values());
    return {
      vertices: vArr,
      tips: Array.from(this.tips),
      dagHeight: Math.max(0, ...vArr.map(v => v.height)),
      totalVertices: vArr.length,
      confirmedCount: vArr.filter(v => v.confirmed).length,
      tps: this.tps,
      genesisHash: this.genesisHash,
    };
  }

  subscribe(fn: Listener): () => void {
    this.listeners.push(fn);
    fn(this.getState());
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(fn => fn(s));
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const dagEngine = new DAGEngine();
