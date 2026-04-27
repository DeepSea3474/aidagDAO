'use client';
import { useState, useEffect, useCallback } from 'react';
import { TOKEN_CONTRACT } from './constants';

// ── Live chain data types ─────────────────────────────────────────────────────
export interface ChainData {
  bnbPrice: number;
  blockNumber: number;
  gasPrice: string;
  totalSupply: string;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

const DEFAULT: ChainData = {
  bnbPrice: 0,
  blockNumber: 0,
  gasPrice: '—',
  totalSupply: '21,000,000',
  loading: true,
  error: null,
  lastUpdated: 0,
};

// ── Fetch BNB price (Binance public API — no key required) ────────────────────
async function fetchBNBPrice(): Promise<number> {
  const sources = [
    {
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
      parse: (d: any) => parseFloat(d.price),
    },
    {
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
      parse: (d: any) => d?.binancecoin?.usd,
    },
  ];
  for (const src of sources) {
    try {
      const r = await fetch(src.url, { signal: AbortSignal.timeout(5000) });
      if (!r.ok) continue;
      const price = src.parse(await r.json());
      if (price > 0) return price;
    } catch { continue; }
  }
  return 0;
}

// ── Fetch BSC block + gas via public RPC ──────────────────────────────────────
async function fetchBSCData(): Promise<{ blockNumber: number; gasPrice: string }> {
  const rpcs = [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
  ];
  for (const rpc of rpcs) {
    try {
      const [br, gr] = await Promise.all([
        fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
          signal: AbortSignal.timeout(5000),
        }),
        fetch(rpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 2 }),
          signal: AbortSignal.timeout(5000),
        }),
      ]);
      if (!br.ok || !gr.ok) continue;
      const [bd, gd] = await Promise.all([br.json(), gr.json()]);
      const blockNumber = parseInt(bd.result, 16);
      const gasGwei = (parseInt(gd.result, 16) / 1e9).toFixed(1);
      if (blockNumber > 0) return { blockNumber, gasPrice: `${gasGwei} Gwei` };
    } catch { continue; }
  }
  return { blockNumber: 0, gasPrice: '—' };
}

// ── Fetch AIDAG on-chain totalSupply ─────────────────────────────────────────
async function fetchTokenSupply(): Promise<string> {
  try {
    const r = await fetch('https://bsc-dataseed1.binance.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', method: 'eth_call',
        params: [{ to: TOKEN_CONTRACT, data: '0x18160ddd' }, 'latest'],
        id: 3,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return '21,000,000';
    const { result } = await r.json();
    if (result && result !== '0x') {
      const supply = Number(BigInt(result)) / 1e18;
      return supply.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
  } catch { }
  return '21,000,000';
}

// ── Main hook: refreshes every 30 s ──────────────────────────────────────────
export function useChainData() {
  const [data, setData] = useState<ChainData>(DEFAULT);

  const refresh = useCallback(async () => {
    try {
      const [bnbPrice, bsc, supply] = await Promise.all([
        fetchBNBPrice(),
        fetchBSCData(),
        fetchTokenSupply(),
      ]);
      setData({
        bnbPrice,
        blockNumber: bsc.blockNumber,
        gasPrice: bsc.gasPrice,
        totalSupply: supply,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch {
      setData(prev => ({ ...prev, loading: false, error: 'BSC RPC unreachable' }));
    }
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 30_000);
    return () => clearInterval(iv);
  }, [refresh]);

  return data;
}
