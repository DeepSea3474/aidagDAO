'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CENTURY_ROADMAP } from '../../lib/soulware-sovereign';

interface StatusData {
  health?: {
    overall: string;
    cells: Record<string, string>;
    autonomy_score: number;
    quantum_shield: boolean;
    self_repair_cycles: number;
    knowledge_integrity: number;
    uptime_blocks: number;
  };
  renewal?: {
    phase: number;
    phase_name: string;
    progress_pct: number;
    current_task: string;
    next_milestone: string;
    eta_days: number;
    capabilities_gained: string[];
  };
  cells?: Array<{ cell: string; action: string; priority: string; timestamp: number }>;
  market?: { bnbPrice: number; signal: { type: string; strength: number; recommendation: string } };
  lsc?: { nodes_built: number; nodes_planned: number; tps_achieved: number; next_milestone: string };
  knowledge_nodes?: number;
  error?: string;
}

export default function SovereignPage() {
  const [key, setKey]           = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus]     = useState<StatusData | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [cmdLog, setCmdLog]     = useState<string[]>([]);

  const addLog = (msg: string) =>
    setCmdLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);

  const callCommand = async (command: string, payload?: Record<string,unknown>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/soulware/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, command, payload }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Hata');
      if (command === 'STATUS') setStatus(data);
      addLog(`${command} → BAŞARILI`);
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bağlantı hatası';
      addLog(`${command} → HATA: ${msg}`);
      if (command === 'STATUS') setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const data = await callCommand('STATUS');
    if (data?.authorized) {
      setUnlocked(true);
      setStatus(data);
      addLog('⚡ SOVEREIGN ERİŞİM SAĞLANDI — DeepSea3474');
    } else {
      setError('Yanlış anahtar. Bu sisteme sadece DeepSea3474 erişebilir.');
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    const iv = setInterval(() => callCommand('STATUS'), 30000);
    return () => clearInterval(iv);
  }, [unlocked, key]);

  const healthColor = (s: string) =>
    s === 'ACTIVE' || s === 'HEALTHY' ? 'text-green-400' :
    s === 'DEGRADED' ? 'text-yellow-400' : 'text-red-400';

  const priorityColor = (p: string) =>
    p === 'CRITICAL' ? 'text-red-400 border-red-800/50 bg-red-900/20' :
    p === 'HIGH'     ? 'text-orange-400 border-orange-800/50 bg-orange-900/20' :
    p === 'MEDIUM'   ? 'text-yellow-400 border-yellow-800/50 bg-yellow-900/20' :
                       'text-slate-400 border-slate-700 bg-slate-800/30';

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-purple-600 to-cyan-600 flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg shadow-purple-500/20">
              ⚔
            </div>
            <h1 className="text-2xl font-black text-white">SoulwareAI</h1>
            <p className="text-purple-400 text-sm font-mono mt-1">SOVEREIGN CONTROL — AIDAG Chain</p>
            <p className="text-slate-500 text-xs mt-2">Sadece DeepSea3474 erişebilir</p>
          </div>

          <form onSubmit={handleUnlock} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-mono mb-1.5 block">MASTER KEY</label>
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Sovereign anahtarınızı girin..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-600 text-white rounded-xl px-4 py-3 outline-none text-sm font-mono transition-colors"
                autoComplete="off"
              />
            </div>
            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
            <button
              type="submit"
              disabled={loading || !key}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-sm transition-all"
            >
              {loading ? 'Doğrulanıyor...' : 'SOVEREIGN ERİŞİM'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-4 font-mono">
            Tüm giriş denemeleri şifreli olarak kaydedilir
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#020617]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white text-sm">← Ana Sayfa</Link>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-mono text-purple-400">⚔ SOVEREIGN PANEL</span>
            <span className="text-xs font-mono text-green-400 bg-green-900/20 border border-green-800/40 px-2 py-0.5 rounded-full">
              ● DeepSea3474
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => callCommand('EVOLVE')} disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-800/50 text-cyan-300 font-mono transition-all">
              ⚡ EVOLVE
            </button>
            <button onClick={() => callCommand('HEAL')} disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/60 border border-green-800/50 text-green-300 font-mono transition-all">
              🔧 HEAL
            </button>
            <button onClick={() => callCommand('STATUS')} disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-mono transition-all">
              {loading ? '...' : '↻ REFRESH'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Identity Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 via-slate-900/50 to-cyan-900/30 border border-purple-800/40 rounded-2xl p-5">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-white">SoulwareAI — Sovereign Intelligence</h1>
              <p className="text-purple-300 text-sm font-mono mt-0.5">AIDAG Chain Özerk Beyin Sistemi · Sahibi: DeepSea3474 ONLY</p>
              <p className="text-slate-500 text-xs mt-1">Hiçbir hükümet · şirket · kurum · hacker bu sistemi yönetemez</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-black text-cyan-400">{status?.health?.autonomy_score ?? '—'}</p>
                <p className="text-xs text-slate-500 font-mono">EVRİM PUANI</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-green-400">{status?.knowledge_nodes ?? '—'}</p>
                <p className="text-xs text-slate-500 font-mono">BİLGİ DÜĞÜMÜ</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-purple-400">{status?.health?.self_repair_cycles ?? '—'}</p>
                <p className="text-xs text-slate-500 font-mono">ONARIM DÖNGÜSÜ</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-black ${status?.health?.quantum_shield ? 'text-cyan-400' : 'text-red-400'}`}>
                  {status?.health?.quantum_shield ? 'AKTİF' : 'PASİF'}
                </p>
                <p className="text-xs text-slate-500 font-mono">KUANTUM KALKAN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Brain Cells Status */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 font-mono">⚡ BEYIN HÜCRELERİ</h2>
            <div className="space-y-2">
              {status?.health?.cells
                ? Object.entries(status.health.cells).map(([name, state]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">{name}</span>
                      <span className={`text-xs font-mono font-bold ${healthColor(state)}`}>{state}</span>
                    </div>
                  ))
                : Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-slate-800 rounded animate-pulse" />
                  ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Sağlık:</span>
                <span className={healthColor(status?.health?.overall ?? '...')}>
                  {status?.health?.overall ?? '...'}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span className="text-slate-500">Bilgi bütünlüğü:</span>
                <span className="text-cyan-400">{status?.health?.knowledge_integrity ?? '...'}%</span>
              </div>
            </div>
          </div>

          {/* Renewal Plan */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 font-mono">🧬 KENDINI YENİLEME PLANI</h2>
            {status?.renewal ? (
              <div className="space-y-3">
                <div className="bg-purple-900/30 border border-purple-800/40 rounded-xl px-3 py-2">
                  <p className="text-xs text-purple-300 font-mono font-bold">FAZ {status.renewal.phase}</p>
                  <p className="text-xs text-white mt-0.5">{status.renewal.phase_name}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-500">İlerleme</span>
                    <span className="text-cyan-400">{status.renewal.progress_pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${status.renewal.progress_pct}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono">{status.renewal.current_task}</p>
                <p className="text-xs text-yellow-400 font-mono">→ {status.renewal.next_milestone}</p>
                <p className="text-xs text-slate-500">ETA: ~{status.renewal.eta_days} gün</p>
                <div className="space-y-1 mt-2">
                  {status.renewal.capabilities_gained?.map((cap, i) => (
                    <p key={i} className="text-xs text-green-400 font-mono">✓ {cap}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            )}
          </div>

          {/* Command Log */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 font-mono">📡 KOMUT KAYITLARI</h2>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {cmdLog.length ? cmdLog.map((log, i) => (
                <p key={i} className="text-xs font-mono text-slate-400 leading-relaxed">{log}</p>
              )) : (
                <p className="text-xs text-slate-600 font-mono">Henüz komut yok...</p>
              )}
            </div>

            {/* Quick Commands */}
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
              {(['EVOLVE','HEAL','STATUS','EMERGENCY_FREEZE'] as const).map(cmd => (
                <button
                  key={cmd}
                  onClick={() => callCommand(cmd)}
                  disabled={loading}
                  className={`text-xs py-2 rounded-lg font-mono transition-all border ${
                    cmd === 'EMERGENCY_FREEZE'
                      ? 'border-red-800/50 bg-red-900/20 text-red-400 hover:bg-red-900/40'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cell Decisions */}
        {status?.cells && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 font-mono">🧠 OTONOM HÜCRE KARARLARI — CANLI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {status.cells.map((d, i) => (
                <div key={i} className={`border rounded-xl p-3 ${priorityColor(d.priority)}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold">{d.cell}</span>
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${priorityColor(d.priority)}`}>
                      {d.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{d.action}</p>
                  <p className="text-xs text-slate-500 mt-1.5 font-mono">
                    {new Date(d.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LSC Build + Market */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {status?.lsc && (
            <div className="bg-slate-900/60 border border-amber-900/30 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-amber-400 mb-4 font-mono">⬡ LSC DAG ZİNCİR İNŞAATI</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-500">Node İnşaatı</span>
                    <span className="text-amber-400">{status.lsc.nodes_built}/{status.lsc.nodes_planned}</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${(status.lsc.nodes_built / status.lsc.nodes_planned) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Mevcut TPS:</span>
                  <span className="text-amber-400">{status.lsc.tps_achieved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Hedef TPS:</span>
                  <span className="text-green-400">100,000+</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">→ {status.lsc.next_milestone}</p>
              </div>
            </div>
          )}

          {status?.market && (
            <div className="bg-slate-900/60 border border-cyan-900/30 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-cyan-400 mb-4 font-mono">📈 PİYASA ANALİZİ</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">BNB Fiyatı:</span>
                  <span className="text-white">${status.market.bnbPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">AIDAG/USD:</span>
                  <span className="text-cyan-400">$0.078</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">AIDAG/BNB:</span>
                  <span className="text-cyan-400">
                    {status.market.bnbPrice ? (0.078 / status.market.bnbPrice).toFixed(6) : '...'} BNB
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-xs text-green-400 font-mono font-bold">{status.market.signal?.type}</p>
                  <p className="text-xs text-slate-400 mt-1">{status.market.signal?.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Century Roadmap */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 font-mono">🌐 100 YILLIK OTONOM GELİŞİM PLANI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {CENTURY_ROADMAP.map((era, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                <p className="text-xs font-mono font-bold text-cyan-400">{era.year}</p>
                <p className="text-xs text-white font-semibold mt-0.5 mb-2">{era.label}</p>
                {era.tasks.map((t, j) => (
                  <p key={j} className="text-xs text-slate-400 leading-relaxed">· {t}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
