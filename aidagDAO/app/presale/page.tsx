'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import { useWallet } from '../../lib/useWallet';
import { useChainData } from '../../lib/useChainData';
import { useT } from '../../lib/LanguageContext';
import Icon from '../../components/Icon';
import {
  TOKEN_CONTRACT, BSCSCAN_TOKEN_URL,
  PRESALE_STAGE1_PRICE, PRESALE_STAGE2_PRICE, LISTING_PRICE,
  MAX_SUPPLY, FOUNDER_COINS, DAO_COINS,
  TELEGRAM_URL, TWITTER_URL, GITHUB_URL,
} from '../../lib/constants';

const FOUNDER_WALLET = '0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9';

function LiveDot({ color = 'emerald' }: { color?: string }) {
  const c: Record<string, string> = { emerald: 'bg-emerald-400', cyan: 'bg-cyan-400', amber: 'bg-amber-400' };
  return <span className={`w-2 h-2 rounded-full ${c[color] ?? 'bg-emerald-400'} animate-pulse flex-shrink-0`} />;
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-cyan-400 transition-all" title="Copy">
      {ok
        ? <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        : <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
      }
    </button>
  );
}

export default function PresalePage() {
  const wallet = useWallet();
  const chain = useChainData();
  const t = useT();

  const [bnbAmount, setBnbAmount] = useState('');
  const [aidagAmount, setAidagAmount] = useState('');
  const [txStep, setTxStep] = useState<'idle' | 'confirm' | 'sending' | 'done' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');
  const [mode, setMode] = useState<'dao' | 'buy' | null>(null);
  const [daoPrefilled, setDaoPrefilled] = useState(false);
  const DAO_FEE_USD = 10;

  // Read ?mode= from URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = new URLSearchParams(window.location.search).get('mode');
    if (m === 'dao' || m === 'buy') setMode(m);
  }, []);

  // ── Presale Stats — fetched client-side (Cloudflare-compatible) ─────────────
  const STAGE1_HARD_CAP = 9_000_000;
  const STAGE2_HARD_CAP = 7_999_000;
  const BSC_RPCS = [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://rpc.ankr.com/bsc',
  ];

  const [stats, setStats] = useState<any>(null);
  const fetchStats = useCallback(async () => {
    try {
      // BNB price
      let bnbPrice = 0;
      try {
        const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', { signal: AbortSignal.timeout(5000) });
        if (r.ok) bnbPrice = parseFloat((await r.json()).price);
      } catch {}
      if (!bnbPrice) {
        try {
          const r = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD', { signal: AbortSignal.timeout(5000) });
          if (r.ok) bnbPrice = (await r.json()).USD;
        } catch {}
      }

      // Founder BNB balance via BSC RPC
      let founderBNB = 0;
      for (const rpc of BSC_RPCS) {
        try {
          const r = await fetch(rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [FOUNDER_WALLET, 'latest'] }),
            signal: AbortSignal.timeout(5000),
          });
          if (!r.ok) continue;
          const { result } = await r.json();
          if (result) { founderBNB = Number(BigInt(result)) / 1e18; break; }
        } catch { continue; }
      }

      // Tx count & participants from BSCScan
      let txCount = null, participants = null;
      try {
        const r = await fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${FOUNDER_WALLET}&startblock=0&endblock=99999999&sort=asc`, { signal: AbortSignal.timeout(6000) });
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data.result)) {
            const incoming = data.result.filter((tx: any) => tx.to?.toLowerCase() === FOUNDER_WALLET.toLowerCase() && BigInt(tx.value || '0') > 0n && tx.isError === '0');
            txCount = incoming.length;
            participants = new Set(incoming.map((tx: any) => tx.from.toLowerCase())).size;
          }
        }
      } catch {}

      if (!bnbPrice) return;
      const totalUSD   = founderBNB * bnbPrice;
      const tokensSold = totalUSD / PRESALE_STAGE1_PRICE;
      const stage1Pct  = Math.min(100, parseFloat(((tokensSold / STAGE1_HARD_CAP) * 100).toFixed(4)));
      const stage      = tokensSold >= STAGE1_HARD_CAP ? 2 : 1;
      const price      = stage === 1 ? PRESALE_STAGE1_PRICE : PRESALE_STAGE2_PRICE;
      const remaining  = stage === 1 ? STAGE1_HARD_CAP - Math.round(tokensSold) : STAGE2_HARD_CAP - Math.max(0, Math.round(tokensSold) - STAGE1_HARD_CAP);
      const sig        = stage1Pct >= 80 ? '⚡ Stage 1 critical fill — SoulwareAI initiating Stage 2 prep'
                       : stage1Pct >= 50 ? '📈 Strong demand — SoulwareAI expanding liquidity pool'
                       : stage1Pct >= 10 ? '🔄 Presale active — SoulwareAI Market Cell monitoring inflows'
                       :                   '🚀 Stage 1 open — Be early. SoulwareAI tracking wallet inflows live.';
      setStats({ ok: true, stage, price, listing_price: 0.12, bnbPrice, totalBNB: founderBNB, totalUSD: Math.round(totalUSD), tokensSold: Math.round(tokensSold), participants, txCount, stage1_pct: stage1Pct, remaining, hard_cap: stage === 1 ? STAGE1_HARD_CAP : STAGE2_HARD_CAP, total_presale: STAGE1_HARD_CAP + STAGE2_HARD_CAP, soulware_signal: { msg: sig } });
    } catch {}
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 30_000);
    return () => clearInterval(id);
  }, [fetchStats]);

  const AIDAG_PER_USD = 1 / (stats?.price ?? PRESALE_STAGE1_PRICE);

  // Calculate AIDAG from BNB
  const calcAidag = useCallback((bnb: string) => {
    const v = parseFloat(bnb);
    if (!v || !chain.bnbPrice) return '';
    const usd = v * chain.bnbPrice;
    return (usd * AIDAG_PER_USD).toLocaleString('en-US', { maximumFractionDigits: 4 });
  }, [chain.bnbPrice]);

  // Calculate BNB from AIDAG
  const calcBnb = useCallback((aidag: string) => {
    const v = parseFloat(aidag.replace(/,/g, ''));
    if (!v || !chain.bnbPrice) return '';
    const usd = v * PRESALE_STAGE1_PRICE;
    return (usd / chain.bnbPrice).toFixed(6);
  }, [chain.bnbPrice]);

  // Pre-fill BNB amount with $10 equivalent if mode=dao (only once, when bnbPrice ready)
  useEffect(() => {
    if (mode === 'dao' && !daoPrefilled && chain.bnbPrice > 0 && !bnbAmount) {
      const bnb = (DAO_FEE_USD / chain.bnbPrice).toFixed(6);
      setBnbAmount(bnb);
      const usd = parseFloat(bnb) * chain.bnbPrice;
      setAidagAmount((usd / PRESALE_STAGE1_PRICE).toLocaleString('en-US', { maximumFractionDigits: 4 }));
      setDaoPrefilled(true);
    }
  }, [mode, daoPrefilled, chain.bnbPrice, bnbAmount]);

  const handleBnbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBnbAmount(val);
    setAidagAmount(calcAidag(val));
  };

  const handleAidagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAidagAmount(val);
    setBnbAmount(calcBnb(val));
  };

  const handleBuy = async () => {
    if (!wallet.isConnected) { wallet.openModal(); return; }
    if (!bnbAmount || parseFloat(bnbAmount) <= 0) return;
    if (wallet.chainId !== 56) {
      try { await wallet.switchToBSC(); } catch {}
      return;
    }
    setTxStep('confirm');
    setTxError('');
    setTxHash('');
  };

  const confirmTx = async () => {
    setTxStep('sending');
    try {
      const tx = await wallet.sendPresaleTx(bnbAmount);
      setTxHash(tx);
      setTxStep('done');
      await wallet.refreshBalances();
    } catch (e: any) {
      setTxError(e?.message || 'Transaction failed');
      setTxStep('error');
    }
  };

  const reset = () => { setTxStep('idle'); setBnbAmount(''); setAidagAmount(''); setTxError(''); setTxHash(''); };

  const isWrongChain = wallet.isConnected && wallet.chainId !== 56;
  const aidagFloat = parseFloat((aidagAmount || '0').replace(/,/g, ''));
  const usdValue = aidagFloat * PRESALE_STAGE1_PRICE;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-[-200px] left-[-100px] w-[700px] h-[700px] rounded-full bg-cyan-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/[0.04] blur-[120px]" />
      </div>

      <Navbar activePage="presale" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 text-xs font-bold text-cyan-400 mb-6">
            <LiveDot /> {t('presale_badge_live')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4">
            {t('presale_h1_a')} <span className="text-gradient">AIDAG</span> {t('presale_h1_b')}
          </h1>
          <p className="text-gray-400 text-lg mb-3">
            {t('presale_stage_price_label')} {stats?.stage ?? 1}: <span className="text-white font-bold">${stats?.price ?? PRESALE_STAGE1_PRICE}</span> {t('presale_per_aidag')}
            &nbsp;·&nbsp; {t('presale_listing_target')}: <span className="text-emerald-400 font-bold">${LISTING_PRICE}</span>
            &nbsp;·&nbsp; <span className="text-amber-400 font-bold">+{stats?.roi_from_stage1 ?? 53.8}% {t('presale_roi_suffix')}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Contract:{' '}
            <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-cyan-400 hover:text-cyan-300 break-all">
              <span className="hidden sm:inline">{TOKEN_CONTRACT}</span>
              <span className="sm:hidden">{TOKEN_CONTRACT.slice(0, 10)}…{TOKEN_CONTRACT.slice(-8)}</span>
            </a>
          </p>
        </div>

        {/* ── Live Presale Progress ─────────────────────────────────────────── */}
        <div className="glass rounded-2xl border border-cyan-500/20 p-5 mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LiveDot />
              <span className="font-black text-sm text-cyan-400">Stage {stats?.stage ?? 1} Progress</span>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {stats ? `${stats.stage1_pct}% sold` : 'Loading…'}
            </span>
          </div>
          <div className="progress-track h-3 mb-3 relative overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${stats?.stage1_pct ?? 0}%` }}
            />
            {stats && stats.stage1_pct > 5 && (
              <div
                className="absolute top-0 bottom-0 flex items-center px-2"
                style={{ left: `${Math.max(0, stats.stage1_pct - 14)}%` }}
              >
                <span className="text-[9px] font-black text-white/80">{stats.stage1_pct}%</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-2">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Raised</div>
              <div className="font-black text-white text-base">${stats?.totalUSD?.toLocaleString() ?? '—'}</div>
              <div className="text-[10px] text-gray-600">{stats?.totalBNB ?? '—'} BNB</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Tokens Sold</div>
              <div className="font-black text-cyan-400 text-base">{stats?.tokensSold?.toLocaleString() ?? '—'}</div>
              <div className="text-[10px] text-gray-600">of {(stats?.hard_cap ?? 9_000_000).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Participants</div>
              <div className="font-black text-purple-400 text-base">{stats?.participants?.toLocaleString() ?? '—'}</div>
              <div className="text-[10px] text-gray-600">{stats?.txCount ?? '—'} transactions</div>
            </div>
          </div>
          {stats?.soulware_signal && (
            <div className={`mt-4 rounded-xl px-4 py-2.5 text-xs font-bold border flex items-center gap-2 ${
              stats.soulware_signal.type === 'CRITICAL'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : stats.soulware_signal.type === 'HIGH'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />
              SoulwareAI Signal: {stats.soulware_signal.msg}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Buy card ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stage cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Stage 1 — LIVE', price: PRESALE_STAGE1_PRICE, status: 'ACTIVE', c: 'border-cyan-500/30 bg-cyan-500/[0.05]', dc: 'text-cyan-400', dot: 'bg-cyan-400' },
                { label: 'Stage 2', price: PRESALE_STAGE2_PRICE, status: 'UPCOMING', c: 'border-white/[0.06]', dc: 'text-gray-500', dot: 'bg-gray-700' },
                { label: 'Listing', price: LISTING_PRICE, status: 'TARGET', c: 'border-amber-500/15 bg-amber-500/[0.02]', dc: 'text-amber-400', dot: 'bg-amber-400' },
              ].map((s, i) => (
                <div key={i} className={`glass rounded-2xl border ${s.c} p-4 text-center relative`}>
                  {i === 0 && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent" />}
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${i === 0 ? 'animate-pulse' : ''}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${s.dc}`}>{s.status}</span>
                  </div>
                  <div className={`text-2xl font-black font-mono mb-0.5 ${i === 0 ? 'text-gradient' : 'text-gray-500'}`}>${s.price}</div>
                  <div className="text-[10px] text-gray-600">{s.label}</div>
                  {i > 0 && <div className="text-[9px] text-emerald-400 mt-1">+{(((s.price - PRESALE_STAGE1_PRICE)/PRESALE_STAGE1_PRICE)*100).toFixed(0)}% from Stage 1</div>}
                </div>
              ))}
            </div>

            {/* Mode banner — DAO membership or open buy */}
            {mode === 'dao' && (
              <div className="glass rounded-2xl border border-purple-500/30 p-5 mb-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
                <div className="flex items-start gap-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-0.5">DAO Membership</div>
                    <div className="text-sm font-bold text-white">You&apos;re joining as a DAO member.</div>
                    <div className="text-xs text-gray-400 mt-1">
                      The amount below is pre-filled with the BNB equivalent of <span className="text-purple-300 font-bold">${DAO_FEE_USD}</span>
                      {chain.bnbPrice > 0 && <> (BNB @ ${chain.bnbPrice.toFixed(2)})</>}.
                      You&apos;ll receive AIDAG tokens plus DAO governance rights once mainnet activates.
                    </div>
                  </div>
                </div>
              </div>
            )}
            {mode === 'buy' && (
              <div className="glass rounded-2xl border border-emerald-500/25 p-4 mb-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Open Buy</div>
                  <div className="text-xs text-gray-400">Choose any BNB amount. No membership required — you can upgrade to DAO later.</div>
                </div>
              </div>
            )}

            {/* Main buy form */}
            <div className="glass rounded-3xl border border-white/[0.08] overflow-hidden">
              {/* Form header */}
              <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="font-black text-lg">Buy AIDAG with BNB</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Binance Smart Chain · BEP-20</p>
                </div>
                <div className="glass rounded-xl px-3 py-1.5 text-xs font-mono text-yellow-400 border border-yellow-500/20">
                  BNB: {chain.loading ? '···' : `$${chain.bnbPrice.toFixed(2)}`}
                </div>
              </div>

              <div className="p-6 space-y-4">

                {/* Wallet status */}
                {!wallet.isConnected ? (
                  <button
                    type="button"
                    onClick={() => wallet.openModal()}
                    className="w-full glass rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 p-5 flex flex-col items-center gap-3 transition-all hover:bg-cyan-500/[0.04]"
                  >
                    <div className="w-12 h-12 rounded-full glass-cyan border border-cyan-500/30 flex items-center justify-center">
                      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-cyan-400">Tap here to connect your wallet</p>
                    <p className="text-[10px] text-gray-500 text-center">One-time connection — works on every page</p>
                  </button>
                ) : isWrongChain ? (
                  <div className="glass rounded-2xl border border-red-500/30 p-4 flex items-center gap-3">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-red-400 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <div className="text-sm font-bold text-red-400">Wrong Network</div>
                      <div className="text-xs text-gray-500">Please switch to BSC (Chain ID: 56)</div>
                    </div>
                    <button
                      onClick={() => wallet.switchToBSC()}
                      className="ml-auto btn btn-primary px-4 py-2 rounded-xl text-xs font-bold">Switch</button>
                  </div>
                ) : (
                  <div className="glass rounded-xl border border-emerald-500/20 px-4 py-3 flex items-center gap-3">
                    <LiveDot />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs text-white truncate">{wallet.address}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Balance: <span className="text-yellow-400 font-bold">{wallet.bnbBalance ?? '0'} BNB</span>{wallet.aidagBalance !== '0' && <> · <span className="text-cyan-400 font-bold">{wallet.aidagBalance} AIDAG</span></>}</div>
                    </div>
                  </div>
                )}

                {/* Swap UI */}
                {txStep === 'idle' && (
                  <>
                    {/* Input BNB */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block">You Pay</label>
                      <div className="glass rounded-2xl border border-white/[0.07] focus-within:border-cyan-500/40 transition-colors">
                        <div className="flex items-center px-4 py-4 gap-3">
                          <input
                            type="number"
                            placeholder="0.0"
                            value={bnbAmount}
                            onChange={handleBnbChange}
                            min="0"
                            step="0.001"
                            className="flex-1 bg-transparent text-2xl font-black text-white placeholder-gray-700 outline-none appearance-none"
                          />
                          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-yellow-500/20 flex-shrink-0">
                            <span className="text-xl">🟡</span>
                            <span className="font-black text-sm">BNB</span>
                          </div>
                        </div>
                        {bnbAmount && chain.bnbPrice > 0 && (
                          <div className="px-4 pb-3 text-xs text-gray-500">
                            ≈ ${(parseFloat(bnbAmount) * chain.bnbPrice).toFixed(2)} USD · BNB price: ${chain.bnbPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full glass border border-white/[0.08] flex items-center justify-center text-gray-500">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>

                    {/* Output AIDAG */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block">You Receive</label>
                      <div className="glass rounded-2xl border border-white/[0.07] focus-within:border-cyan-500/40 transition-colors">
                        <div className="flex items-center px-4 py-4 gap-3">
                          <input
                            type="text"
                            placeholder="0.0"
                            value={aidagAmount}
                            onChange={handleAidagChange}
                            className="flex-1 bg-transparent text-2xl font-black text-gradient placeholder-gray-700 outline-none"
                          />
                          <div className="flex items-center gap-2 glass-cyan rounded-xl px-3 py-2 border border-cyan-500/30 flex-shrink-0">
                            <span className="text-xl">🔵</span>
                            <span className="font-black text-sm">AIDAG</span>
                          </div>
                        </div>
                        {aidagAmount && (
                          <div className="px-4 pb-3 text-xs text-gray-500">
                            ≈ ${usdValue.toFixed(2)} USD · Stage 1: ${PRESALE_STAGE1_PRICE}/AIDAG
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick amounts */}
                    <div className="flex gap-2 flex-wrap">
                      {['0.05', '0.1', '0.25', '0.5', '1.0', '2.0'].map(v => (
                        <button key={v}
                          onClick={() => { setBnbAmount(v); setAidagAmount(calcAidag(v)); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${bnbAmount === v ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'glass border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.15]'}`}>
                          {v} BNB
                        </button>
                      ))}
                    </div>

                    {/* Summary */}
                    {bnbAmount && aidagAmount && (
                      <div className="glass rounded-xl border border-white/[0.06] p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>Rate</span><span className="text-white">1 AIDAG = ${PRESALE_STAGE1_PRICE} · 1 BNB ≈ {chain.bnbPrice > 0 ? (chain.bnbPrice / PRESALE_STAGE1_PRICE).toFixed(0) : '···'} AIDAG</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>You pay</span><span className="text-yellow-400 font-bold">{bnbAmount} BNB (${(parseFloat(bnbAmount)*chain.bnbPrice).toFixed(2)})</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>You receive</span><span className="text-cyan-400 font-bold">{aidagAmount} AIDAG</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>+ LSC at genesis (1:100)</span>
                          <span className="text-amber-400 font-bold">
                            {aidagAmount ? `${(parseFloat(aidagAmount.replace(/,/g,'')) * 100).toLocaleString('en-US', { maximumFractionDigits: 0 })} LSC` : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>Potential at listing</span><span className="text-emerald-400 font-bold">${(usdValue * LISTING_PRICE / PRESALE_STAGE1_PRICE).toFixed(2)} (+{(((LISTING_PRICE-PRESALE_STAGE1_PRICE)/PRESALE_STAGE1_PRICE)*100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    )}

                    {/* Buy button */}
                    <button
                      onClick={handleBuy}
                      disabled={wallet.isConnected && (!bnbAmount || parseFloat(bnbAmount) <= 0)}
                      className="w-full btn btn-primary py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {!wallet.isConnected
                        ? <><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> Connect Wallet to Buy</>
                        : isWrongChain ? '⚠️ Switch to BSC First'
                        : `Buy ${aidagAmount || '···'} AIDAG for ${bnbAmount || '···'} BNB`
                      }
                    </button>

                    <p className="text-center text-[10px] text-gray-600">
                      Sending BNB directly to presale wallet ·{' '}
                      <a href={`https://bscscan.com/address/${FOUNDER_WALLET}`} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-400 font-mono">
                        {FOUNDER_WALLET.slice(0, 8)}...{FOUNDER_WALLET.slice(-6)}
                      </a>
                    </p>
                  </>
                )}

                {/* Confirm step */}
                {txStep === 'confirm' && (
                  <div className="space-y-4">
                    <div className="glass rounded-2xl border border-cyan-500/30 p-5">
                      <h3 className="font-black mb-3 text-cyan-400 flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Confirm Purchase
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Paying</span><span className="text-yellow-400 font-bold">{bnbAmount} BNB</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Receiving</span><span className="text-cyan-400 font-bold">{aidagAmount} AIDAG</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">To Wallet</span><span className="font-mono text-xs text-gray-300">{FOUNDER_WALLET.slice(0, 10)}...{FOUNDER_WALLET.slice(-8)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Network</span><span className="text-white">BSC (Chain ID: 56)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Token Contract</span><span className="font-mono text-xs text-gray-300">{TOKEN_CONTRACT.slice(0, 10)}...</span></div>
                      </div>
                    </div>
                    <div className="glass rounded-xl border border-amber-500/20 p-3 text-xs text-amber-400/80">
                      ⚠️ You will send BNB to the presale wallet. AIDAG tokens will be delivered to your address after transaction confirmation.
                    </div>
                    <div className="flex gap-3">
                      <button onClick={reset} className="flex-1 btn btn-secondary py-3.5 rounded-2xl font-bold">Cancel</button>
                      <button onClick={confirmTx} className="flex-1 btn btn-primary py-3.5 rounded-2xl font-bold">Confirm in Wallet</button>
                    </div>
                  </div>
                )}

                {/* Sending step */}
                {txStep === 'sending' && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full glass-cyan border border-cyan-500/30 flex items-center justify-center mx-auto">
                      <svg className="animate-spin w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                    <div className="font-bold text-lg">Sending Transaction…</div>
                    <div className="text-sm text-gray-400">Please approve the transaction in your wallet. Do not close this window.</div>
                  </div>
                )}

                {/* Done step */}
                {txStep === 'done' && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} className="text-emerald-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="font-black text-xl text-emerald-400">Transaction Sent!</div>
                    <p className="text-sm text-gray-400">
                      {aidagAmount} AIDAG will be delivered to your wallet after confirmation.
                    </p>
                    {txHash && (
                      <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        View on BSCScan →
                      </a>
                    )}
                    <button onClick={reset} className="btn btn-secondary px-8 py-3 rounded-2xl font-bold text-sm block mx-auto mt-2">Buy More AIDAG</button>
                  </div>
                )}

                {/* Error step */}
                {txStep === 'error' && (
                  <div className="space-y-4">
                    <div className="glass rounded-2xl border border-red-500/30 p-5 text-center">
                      <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-3">
                        <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-red-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="font-bold text-red-400 mb-2">Transaction Failed</div>
                      {txError && <div className="text-xs text-gray-500 break-all">{txError}</div>}
                    </div>
                    <button onClick={reset} className="btn btn-secondary w-full py-3.5 rounded-2xl font-bold">Try Again</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Token facts */}
            <div className="glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="font-bold text-sm mb-4 text-gray-300">Token Facts</h3>
              <div className="space-y-3">
                {[
                  { label: 'Symbol', val: 'AIDAG', c: 'text-cyan-400' },
                  { label: 'Network', val: 'BSC (BEP-20)', c: 'text-yellow-400' },
                  { label: 'Max Supply', val: `${MAX_SUPPLY.toLocaleString()}`, c: 'text-white' },
                  { label: 'Stage 1 Price', val: `$${PRESALE_STAGE1_PRICE}`, c: 'text-emerald-400' },
                  { label: 'Stage 2 Price', val: `$${PRESALE_STAGE2_PRICE}`, c: 'text-blue-400' },
                  { label: 'Listing Target', val: `$${LISTING_PRICE}`, c: 'text-amber-400' },
                  { label: 'Mint Function', val: '❌ None', c: 'text-gray-400' },
                  { label: 'Decimals', val: '18', c: 'text-gray-400' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className={`font-bold font-mono ${r.c}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue split */}
            <div className="glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="font-bold text-sm mb-4 text-gray-300">Revenue Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Founder Wallet</span>
                    <span className="text-yellow-400 font-bold">60%</span>
                  </div>
                  <div className="progress-track"><div className="h-full w-[60%] bg-gradient-to-r from-yellow-500 to-amber-500 rounded" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">SoulwareAI Pool</span>
                    <span className="text-cyan-400 font-bold">40%</span>
                  </div>
                  <div className="progress-track"><div className="h-full w-[40%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded" /></div>
                </div>
                <p className="text-[10px] text-gray-600 mt-2">40% goes into SoulwareAI autonomous liquidity pool — managed by AIDAG Chain's own intelligence, no human control.</p>
              </div>
            </div>

            {/* Contract */}
            <div className="glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="font-bold text-sm mb-3 text-gray-300">Token Contract</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[11px] text-cyan-400 break-all flex-1 min-w-0">
                  <span className="hidden sm:inline">{TOKEN_CONTRACT}</span>
                  <span className="sm:hidden">{TOKEN_CONTRACT.slice(0, 10)}…{TOKEN_CONTRACT.slice(-8)}</span>
                </span>
                <CopyBtn text={TOKEN_CONTRACT} />
              </div>
              <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Verify on BSCScan
              </a>
            </div>

            {/* SoulwareAI note */}
            <div className="glass rounded-2xl border border-purple-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <LiveDot color="cyan" />
                <h3 className="font-bold text-sm text-purple-400">SoulwareAI</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                SoulwareAI is <strong className="text-white">AIDAG Chain's own brain & cell system</strong> — not OpenAI, not GPT-4, not any external AI. It autonomously governs every on-chain decision and is building LSC Chain block-by-block.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-2">
              {[
                { href: TELEGRAM_URL, label: 'Join Telegram Community', icon: 'chat' as const },
                { href: TWITTER_URL, label: 'Follow on Twitter / X', icon: 'twitter' as const },
                { href: GITHUB_URL, label: 'Open Source on GitHub', icon: 'code' as const },
                { href: '/dao', label: 'DAO Governance Portal', icon: 'governance' as const },
                { href: '/lsc', label: 'LSC Chain Dashboard', icon: 'hexagon' as const },
              ].map(s => (
                s.href.startsWith('http')
                  ? <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 glass rounded-xl border border-white/[0.05] hover:border-cyan-500/20 text-sm text-gray-400 hover:text-white transition-all">
                      <Icon name={s.icon} size={15} />{s.label}
                      <svg className="ml-auto w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  : <Link key={s.href} href={s.href}
                      className="flex items-center gap-3 px-4 py-3 glass rounded-xl border border-white/[0.05] hover:border-cyan-500/20 text-sm text-gray-400 hover:text-white transition-all">
                      <Icon name={s.icon} size={15} />{s.label}
                    </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
