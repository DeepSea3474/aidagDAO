'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WalletButton from './WalletButton';
import { useWalletContext } from '../lib/WalletContext';
import { useLang, LANGS, LangCode } from '../lib/LanguageContext';

interface NavbarProps {
  activePage?: 'home' | 'lsc' | 'dao' | 'presale' | 'soulware' | 'docs';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  const { openModal, isConnected, address } = useWalletContext();
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lscOpen, setLscOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const lscRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (lscRef.current && !lscRef.current.contains(e.target as Node)) setLscOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const changeLang = (code: LangCode) => {
    setLang(code);
    setLangOpen(false);
  };

  const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];

  const navItems = [
    { label: t('nav_home'),       href: '/',           key: 'home',     icon: '◇' },
    { label: t('nav_presale'),    href: '/presale',    key: 'presale',  icon: '◈', accent: 'green' },
    { label: t('nav_dao'),        href: '/dao',        key: 'dao',      icon: '⬢', accent: 'purple' },
    { label: t('nav_soulware'),   href: '/soulware',   key: 'soulware', icon: '◉', accent: 'cyan' },
    { label: t('lsc_dashboard'),  href: '/lsc',        key: 'lsc',      icon: '⬡', accent: 'amber' },
    { label: 'Sovereign',         href: '/sovereign',  key: 'sovereign',icon: '◊', accent: 'rose' },
    { label: 'Whitepaper',        href: '/whitepaper', key: 'docs',     icon: '▤', accent: 'blue' },
  ];

  return (
    <nav className={`navbar transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/50' : ''}`}>
      {/* Top micro-bar */}
      <div className="border-b border-white/[0.04] px-6 py-1.5 hidden md:flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-4 text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="live-dot" style={{ width: 6, height: 6 }}></span>
            <span className="relative inline-flex items-center justify-center w-4 h-4 rounded-[4px] bg-gradient-to-br from-cyan-500/80 to-blue-600/80 border border-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.55)]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
              </svg>
              <span className="absolute -inset-px rounded-[4px] animate-pulse bg-cyan-400/10" />
            </span>
            <span className="text-emerald-400 font-semibold">SoulwareAI</span> ONLINE
          </span>
          <span className="text-gray-700">|</span>
          <span>BSC Block: <span className="text-cyan-400 font-mono">#{(47823941 + Math.floor(Date.now() / 3000)).toLocaleString()}</span></span>
          <span className="text-gray-700">|</span>
          <span>AIDAG: <span className="text-green-400 font-semibold">$0.078</span></span>
          <span className="text-gray-700">|</span>
          <span className="text-amber-400/80">Stage 1 Live · Listing $0.12</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="flex items-center gap-1"><span style={{ color: '#f0b90b' }}>⬡</span> BSC</span>
          <span className="flex items-center gap-1"><span style={{ color: '#627eea' }}>◈</span> ETH</span>
          <span className="flex items-center gap-1"><span style={{ color: '#8247e5' }}>⬟</span> Polygon</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-2 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* ═══ Logo: AIDAG (navy gradient) CHAIN (white) with quantum glow ═══ */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          <div className="relative shrink-0">
            {/* Triple-layer pulsing glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-indigo-700 to-cyan-500 blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
            <div className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all" />
            {/* Logo image */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-cyan-400/40 group-hover:border-cyan-300/70 transition-all shadow-lg shadow-cyan-500/30">
              <Image src="/aidag-logo.jpg" alt="AIDAG" width={44} height={44} className="rounded-full" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-cyan-400/10 to-blue-600/20 mix-blend-overlay" />
            </div>
          </div>
          <div className="leading-none min-w-0">
            {/* Mobile: stack AIDAG / CHAIN vertically to save width */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 font-black tracking-tight select-none">
              <span className="aidag-brand text-base sm:text-xl leading-none">AIDAG</span>
              <span className="chain-brand text-[11px] sm:text-xl leading-none mt-0.5 sm:mt-0">CHAIN</span>
            </div>
            <div className="hidden sm:flex mt-1 text-[9px] text-cyan-400/70 font-bold tracking-[0.25em] uppercase items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              SoulwareAI · Autonomous
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const active = activePage === item.key;
            const accentColor =
              item.accent === 'green' ? 'text-emerald-400' :
              item.accent === 'purple' ? 'text-purple-400' :
              item.accent === 'cyan' ? 'text-cyan-400' :
              'text-gray-300';
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  active
                    ? `${accentColor} bg-white/[0.06]`
                    : `text-gray-400 hover:text-white hover:bg-white/[0.04]`
                }`}
              >
                <span className={`text-[10px] ${active ? accentColor : 'opacity-50'}`}>{item.icon}</span>
                {item.label}
                {active && (
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full ${
                    item.accent === 'green' ? 'bg-emerald-400' :
                    item.accent === 'purple' ? 'bg-purple-400' :
                    item.accent === 'cyan' ? 'bg-cyan-400' :
                    'bg-cyan-400'
                  }`} />
                )}
              </Link>
            );
          })}

          {/* LSC Chain dropdown */}
          <div className="relative" ref={lscRef}>
            <button
              onClick={() => setLscOpen(!lscOpen)}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activePage === 'lsc'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/[0.06]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              LSC Chain
              <svg className={`w-3 h-3 transition-transform ${lscOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute -top-1 -right-1 text-[8px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-black px-1.5 py-0.5 rounded-full shadow-lg shadow-amber-500/50">2027</span>
            </button>

            {lscOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 menu-solid rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-900/20 p-2 z-50">
                <div className="px-3 py-2 mb-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60 mb-1">2027 Roadmap</div>
                  <div className="text-xs text-gray-400">LSC Chain — 100,000+ TPS DAG Blockchain</div>
                </div>
                <Link href="/lsc" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-base mt-0.5 shrink-0">⬡</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">LSC Dashboard</div>
                    <div className="text-xs text-gray-500">Live DAG · TPS · cell network</div>
                  </div>
                </Link>
                <Link href="/lsc#roadmap" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-base mt-0.5 shrink-0">🗺</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Roadmap 2025–2027</div>
                    <div className="text-xs text-gray-500">Autonomy milestones</div>
                  </div>
                </Link>
                <Link href="/lsc#whitepaper" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-base mt-0.5 shrink-0">📄</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Whitepaper</div>
                    <div className="text-xs text-gray-500">DAG architecture · consensus</div>
                  </div>
                </Link>
                <Link href="/budget" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 text-base mt-0.5 shrink-0">◈</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{t('b_nav_label')}</div>
                    <div className="text-xs text-gray-500">{t('b_nav_desc')}</div>
                  </div>
                </Link>
                <div className="mt-2 mx-3 mb-1 p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-bold">⚡ AIDAG holders → priority LSC allocation @ 1:100</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Buy AIDAG — icon-only on tiny screens, label on tablet+ */}
          <Link
            href="/presale"
            aria-label={t('nav_buy')}
            className="flex items-center gap-1 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:inline">{t('nav_buy')}</span>
            <span className="hidden sm:inline md:hidden">{t('nav_buy_short')}</span>
            <span className="hidden lg:inline text-[9px] bg-white/20 px-1 py-0.5 rounded ml-0.5">$0.078</span>
          </Link>

          {/* Language */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all border border-white/[0.06] hover:border-white/[0.12]"
              title={t('nav_change_lang')}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:block text-[11px] font-bold">{currentLang.code.toUpperCase()}</span>
              <svg className={`w-3 h-3 transition-transform hidden sm:block ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 menu-solid rounded-2xl border border-white/[0.08] shadow-2xl p-1.5 z-50">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code as LangCode)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                      lang === l.code
                        ? 'bg-cyan-500/15 text-cyan-400'
                        : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="font-medium">{l.name}</span>
                    {lang === l.code && <span className="ml-auto text-cyan-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet — full button on tablet+; on mobile show address pill when connected, icon when not */}
          <div className="hidden md:block">
            <WalletButton />
          </div>
          {isConnected && address ? (
            <button
              onClick={openModal}
              aria-label={t('wallet_connected')}
              title={address}
              className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-all hover:bg-emerald-500/15"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-mono text-[10px] font-bold tracking-tight">
                {address.slice(0, 4)}…{address.slice(-3)}
              </span>
            </button>
          ) : (
            <button
              onClick={openModal}
              aria-label={t('connect_wallet')}
              title={t('connect_wallet')}
              className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg border bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wide">Wallet</span>
            </button>
          )}

          {/* Mobile menu toggle — always visible on mobile, compact */}
          <button
            className="lg:hidden flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-white bg-white/[0.04] border border-white/[0.08] hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <div className="w-4 h-3.5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.05] bg-[#0b1430] px-4 py-4 flex flex-col gap-1.5 shadow-2xl">
          {navItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold ${
                activePage === item.key ? 'bg-white/[0.08] text-white' : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-base opacity-70">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <Link href="/lsc" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl flex items-center gap-3 text-amber-400 hover:bg-amber-500/10 transition-all text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            ⬡ {t('lsc_dashboard')}
            <span className="ml-auto text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">2027</span>
          </Link>

          <div className="border-t border-white/[0.05] mt-2 pt-3 space-y-2">
            <Link href="/presale" onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30">
              💰 {t('nav_buy')} — $0.078
            </Link>
            <Link href="/dao" onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20">
              ⬢ {t('nav_dao')}
            </Link>
            <button
              onClick={() => { setMobileOpen(false); openModal(); }}
              className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isConnected && address
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'btn btn-primary'
              }`}
            >
              {isConnected && address ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs tracking-wide">{address.slice(0, 6)}…{address.slice(-4)}</span>
                  <span className="opacity-60 text-[10px] font-normal">— {t('wallet_connected')}</span>
                </>
              ) : (
                t('connect_wallet')
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
