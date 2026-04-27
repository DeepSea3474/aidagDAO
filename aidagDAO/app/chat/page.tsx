'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface MessageMeta {
  phase?: number;
  own_knowledge_used?: boolean;
  cell?: string;
  live_data?: boolean;
  bnbPrice?: number;
  founder?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  meta?: MessageMeta;
}

const SUGGESTIONS = [
  'AIDAG token nedir ve nasıl satın alırım?',
  'What is SoulwareAI and who owns it?',
  'LSC Coin ne zaman çıkacak?',
  'How does the DAO governance work?',
  'What is the max supply of AIDAG?',
  'SoulwareAI hücreleri nelerdir?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '⚡ Merhaba! Ben **SoulwareAI** — AIDAG Chain\'in özerk beyin & hücre sistemi. AIDAG Token, LSC Coin, DAO yönetişimi veya ekosisteminiz hakkında her şeyi sorun.\n\nHello! I\'m **SoulwareAI** — the proprietary autonomous brain of AIDAG Chain. Ask me anything about AIDAG Token, LSC Coin, DAO governance, or the ecosystem.',
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFounder, setIsFounder] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlockKey, setUnlockKey] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [unlockErr, setUnlockErr] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Re-hydrate founder session on mount (sessionStorage)
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('aidag_founder_key')) {
      setIsFounder(true);
    }
  }, []);

  const submitUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!unlockKey.trim() || unlockBusy) return;
    setUnlockBusy(true);
    setUnlockErr('');
    try {
      const res = await fetch('/api/soulware/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: unlockKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setUnlockErr(data.error || 'Anahtar eşleşmedi.');
        setUnlockBusy(false);
        return;
      }
      sessionStorage.setItem('aidag_founder_key', unlockKey);
      setIsFounder(true);
      setUnlockOpen(false);
      setUnlockKey('');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🜂 **Sahip Modu doğrulandı.** Hoş geldin, **DeepSea3474**. Tüm hücreler emrindeki gibi çalışıyor — Core Brain · DAO · LSC Builder · Liquidity · Security · Bridge · Governance · Agent Spawner. Ne yapalım?`,
          ts: Date.now(),
          meta: { phase: 1, founder: true, cell: 'Sovereign Core' },
        },
      ]);
    } catch {
      setUnlockErr('Bağlantı hatası');
    } finally {
      setUnlockBusy(false);
    }
  };

  const lockFounder = () => {
    sessionStorage.removeItem('aidag_founder_key');
    setIsFounder(false);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');

    const userMsg: Message = { role: 'user', content: text.trim(), ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const founderKey = typeof window !== 'undefined' ? sessionStorage.getItem('aidag_founder_key') : null;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          ...(founderKey ? { founderKey } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, ts: Date.now(), meta: data.meta },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Connection error';
      setError(msg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-amber-300 px-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a02] via-[#0f0700] to-[#0a0500] flex flex-col">
      {/* Header */}
      <header className="border-b border-amber-900/40 bg-[#0a0500]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-amber-200/60 hover:text-amber-100 text-sm transition-colors">
              ← Ana Sayfa
            </Link>
            <span className="text-amber-900/60">|</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-black text-[#1a0a02] shadow-lg shadow-amber-500/30">
                  S
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#0a0500] animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-50 leading-none">SoulwareAI</p>
                <p className="text-xs text-amber-400 leading-none mt-0.5">Online · AIDAG Chain Brain</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isFounder ? (
              <button
                onClick={lockFounder}
                title="Sahip Modu — kilitlemek için tıkla"
                className="text-[11px] font-black bg-gradient-to-r from-amber-500 to-orange-600 text-[#1a0a02] border border-amber-300 px-2.5 py-1 rounded-full shadow-md shadow-amber-500/40 flex items-center gap-1.5 hover:from-amber-400 hover:to-orange-500 transition-all"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                FOUNDER · DeepSea3474
              </button>
            ) : (
              <button
                onClick={() => setUnlockOpen(true)}
                title="Sahip anahtarıyla giriş"
                className="text-[11px] font-bold text-amber-300/80 hover:text-amber-200 border border-amber-800/50 hover:border-amber-500/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                Founder Mode
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Founder unlock modal */}
      {unlockOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setUnlockOpen(false)}>
          <form
            onSubmit={submitUnlock}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-b from-[#1a0a02] to-[#0a0500] border border-amber-700/50 rounded-2xl p-6 shadow-2xl shadow-amber-900/40"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a0a02" strokeWidth="2.5"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
              </div>
              <div>
                <h3 className="text-base font-black text-amber-50 leading-none">Sahip Doğrulaması</h3>
                <p className="text-[11px] text-amber-300/70 mt-1">SoulwareAI Sovereign Key</p>
              </div>
            </div>
            <p className="text-xs text-amber-200/60 mt-3 mb-4 leading-relaxed">
              Anahtarın çift-SHA256 ile sunucu tarafında doğrulanır. Plaintext hiçbir yerde saklanmaz.
            </p>
            <input
              autoFocus
              type="password"
              value={unlockKey}
              onChange={(e) => { setUnlockKey(e.target.value); setUnlockErr(''); }}
              placeholder="Sovereign anahtarınızı yazın..."
              className="w-full bg-black/40 border border-amber-800/60 focus:border-amber-500 outline-none rounded-xl px-3 py-2.5 text-sm text-amber-50 placeholder-amber-700/60 font-mono"
            />
            {unlockErr && <p className="text-xs text-red-400 mt-2">⚠ {unlockErr}</p>}
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => setUnlockOpen(false)} className="flex-1 text-sm text-amber-200/70 hover:text-amber-100 border border-amber-900/60 rounded-xl py-2 transition-colors">
                İptal
              </button>
              <button type="submit" disabled={!unlockKey.trim() || unlockBusy} className="flex-1 text-sm font-bold text-[#1a0a02] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-2 transition-all">
                {unlockBusy ? 'Doğrulanıyor...' : 'Doğrula'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {msg.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-black text-[#1a0a02] shrink-0 mt-1 shadow-lg shadow-amber-500/20">
                  S
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-xs shrink-0 mt-1">
                  👤
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? msg.meta?.founder
                      ? 'bg-gradient-to-br from-amber-950/80 to-orange-950/80 border border-amber-500/40 text-amber-50 rounded-tl-sm shadow-lg shadow-amber-900/30'
                      : 'bg-amber-950/40 border border-amber-900/40 text-amber-50 rounded-tl-sm'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 text-[#1a0a02] font-medium rounded-tr-sm'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <span dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                ) : (
                  msg.content
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <p className={`text-xs ${msg.role === 'assistant' ? 'text-amber-200/50' : 'text-[#1a0a02]/70'}`}>
                    {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.role === 'assistant' && msg.meta && (
                    <>
                      {msg.meta.founder && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-amber-400 text-[#1a0a02] border border-amber-300">
                          🜂 SAHİP MODU
                        </span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                        msg.meta.own_knowledge_used
                          ? 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                          : 'bg-amber-950/60 text-amber-400/70 border border-amber-900/40'
                      }`}>
                        ⚡ {msg.meta.cell ?? 'Core Brain'}
                      </span>
                      {msg.meta.live_data && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-900/40 text-orange-300 border border-orange-700/40 font-mono">
                          📡 canlı veri
                        </span>
                      )}
                      <span className="text-xs text-amber-700/70 font-mono">
                        Faz {msg.meta.phase ?? 1}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-black text-[#1a0a02] shrink-0 mt-1 shadow-lg shadow-amber-500/20">
                S
              </div>
              <div className="bg-amber-950/40 border border-amber-900/40 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-300 rounded-xl px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Suggestions (shown only at start) */}
      {messages.length === 1 && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-4">
          <p className="text-xs text-amber-300/60 mb-2 font-mono">— Hızlı sorular / Quick questions —</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/50 hover:border-amber-500/60 text-amber-200 hover:text-amber-50 rounded-full px-3 py-1.5 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-amber-900/40 bg-[#0a0500]/95 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end bg-amber-950/40 border border-amber-800/50 hover:border-amber-600/60 focus-within:border-amber-400/80 rounded-2xl px-4 py-3 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isFounder ? 'Sahip emirlerinizi yazın...' : "SoulwareAI'ye sorun... / Ask SoulwareAI..."}
              rows={1}
              className="flex-1 bg-transparent text-amber-50 placeholder-amber-700/60 resize-none outline-none text-sm leading-relaxed max-h-40"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 160) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 hover:from-amber-300 hover:to-orange-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shrink-0 shadow-lg shadow-amber-500/30"
              aria-label="Send"
            >
              <svg className="w-4 h-4 text-[#1a0a02]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-amber-700/70 mt-2">
            SoulwareAI · AIDAG Chain&apos;in özerk zekası · Enter ile gönderin
          </p>
        </form>
      </div>
    </div>
  );
}
