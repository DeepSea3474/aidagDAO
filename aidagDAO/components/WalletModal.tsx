'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWalletContext, type WalletType } from '../lib/WalletContext';

interface WalletOption {
  type: WalletType;
  name: string;
  logo: string;
  desc: string;
  recommended?: boolean;
  mobile?: boolean;
  detectFn?: () => boolean;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    type: 'metamask',
    name: 'MetaMask',
    logo: '/wallets/metamask.svg',
    desc: 'Browser extension · Most popular',
    recommended: true,
    detectFn: () => typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
  },
  {
    type: 'trust',
    name: 'Trust Wallet',
    logo: '/wallets/trustwallet.svg',
    desc: 'Mobile & browser · Binance official',
    mobile: true,
    detectFn: () => typeof window !== 'undefined' && !!(window as any).ethereum?.isTrust,
  },
  {
    type: 'walletconnect',
    name: 'WalletConnect',
    logo: '/wallets/walletconnect.svg',
    desc: 'QR code · All wallets · Mobile',
    recommended: true,
    detectFn: () => true,
  },
  {
    type: 'coinbase',
    name: 'Coinbase Wallet',
    logo: '/wallets/coinbase.svg',
    desc: 'Browser extension · Mobile',
    detectFn: () => typeof window !== 'undefined' && !!(window as any).ethereum?.isCoinbaseWallet,
  },
  {
    type: 'binance',
    name: 'Binance Web3',
    logo: '/wallets/binance.svg',
    desc: 'Binance Web3 Wallet · BSC native',
    detectFn: () => typeof window !== 'undefined' && !!(window as any).BinanceChain,
  },
  {
    type: 'okx',
    name: 'OKX Wallet',
    logo: '/wallets/okx.svg',
    desc: 'OKX Web3 Wallet · Multi-chain',
    detectFn: () => typeof window !== 'undefined' && !!(window as any).okxwallet,
  },
];

export default function WalletModal() {
  const { modalOpen, closeModal, connect, isConnecting, isSigning, error } = useWalletContext();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  useEffect(() => {
    if (modalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  if (!modalOpen) return null;

  const isLoading = isConnecting || isSigning;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/[0.09] bg-[#08101e] shadow-2xl overflow-hidden">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-lg text-white">Connect to AIDAG Chain</h2>
              <p className="text-xs text-gray-500 mt-1">
                Choose your wallet · BSC required · Sign to authenticate
              </p>
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-xl glass border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.15] transition-all"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* AIDAG Chain banner */}
          <div className="mt-4 glass rounded-xl border border-cyan-500/15 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-cyan-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400">SoulwareAI Authentication</div>
              <div className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                A signature request will confirm your connection to the AIDAG Chain ecosystem. No tokens transferred.
              </div>
            </div>
          </div>
        </div>

        {/* Wallet options */}
        <div className="px-4 py-4 space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-spin border-t-cyan-500" />
                <div className="absolute inset-2 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="text-cyan-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">
                  {isSigning ? 'Sign in Wallet…' : 'Connecting…'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isSigning
                    ? 'Please approve the AIDAG Chain signature request in your wallet'
                    : 'Requesting wallet access. Approve in your wallet app.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {WALLET_OPTIONS.map(opt => {
                const detected = opt.detectFn?.() ?? false;
                return (
                  <button
                    key={opt.type}
                    onClick={() => connect(opt.type)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl glass border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all group relative"
                  >
                    {/* Wallet logo */}
                    <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:border-cyan-500/20 flex items-center justify-center flex-shrink-0 transition-all overflow-hidden p-1.5">
                      <Image src={opt.logo} alt={opt.name} width={32} height={32} className="object-contain" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{opt.name}</span>
                        {opt.recommended && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                            POPULAR
                          </span>
                        )}
                        {detected && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            DETECTED
                          </span>
                        )}
                        {opt.mobile && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">
                            MOBILE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{opt.desc}</div>
                    </div>

                    {/* Arrow */}
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                      className="text-gray-700 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="mt-2 glass rounded-xl border border-red-500/25 px-4 py-3 flex items-start gap-2.5">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-red-400 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.05] flex items-center justify-between">
          <div className="text-[10px] text-gray-700 leading-relaxed max-w-xs">
            By connecting, you agree to the AIDAG Chain terms. No funds moved by signature.
          </div>
          <div className="flex-shrink-0 ml-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
