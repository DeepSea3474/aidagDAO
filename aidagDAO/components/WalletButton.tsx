'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useWalletContext } from '../lib/WalletContext';

const WALLET_LOGOS: Record<string, string> = {
  metamask: '/wallets/metamask.svg',
  trust: '/wallets/trustwallet.svg',
  walletconnect: '/wallets/walletconnect.svg',
  coinbase: '/wallets/coinbase.svg',
  binance: '/wallets/binance.svg',
  okx: '/wallets/okx.svg',
};

export default function WalletButton({ className = '' }: { className?: string }) {
  const {
    address, isConnected, isConnecting, isSigning, isSigned,
    bnbBalance, aidagBalance, chainId, walletType,
    openModal, disconnect, switchToBSC,
  } = useWalletContext();

  const [dropOpen, setDropOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isWrongChain = isConnected && chainId !== 56;
  const isLoading    = isConnecting || isSigning;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const renderLogo = (size: number) => {
    if (!walletType || !WALLET_LOGOS[walletType]) {
      return (
        <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-cyan-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    return <Image src={WALLET_LOGOS[walletType]} alt={walletType} width={size} height={size} className="object-contain" />;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass border border-cyan-500/20 text-sm ${className}`}>
        <svg className="animate-spin w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-cyan-400 font-medium text-xs">
          {isSigning ? 'Sign in wallet…' : 'Connecting…'}
        </span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setDropOpen(d => !d)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl glass border transition-all ${
            isWrongChain
              ? 'border-red-500/30 hover:border-red-500/50'
              : isSigned
              ? 'border-cyan-500/25 hover:border-cyan-500/40'
              : 'border-white/[0.08] hover:border-white/[0.15]'
          } ${className}`}
        >
          {/* Status dot */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isWrongChain ? 'bg-red-400 animate-pulse' :
            isSigned     ? 'bg-emerald-400 animate-pulse' :
                           'bg-yellow-400'
          }`} />

          {/* Wallet logo */}
          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{renderLogo(16)}</span>

          {/* Address */}
          {isWrongChain ? (
            <span className="text-xs font-bold text-red-400">Wrong Chain</span>
          ) : (
            <span className="font-mono text-xs text-white">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          )}

          {/* AIDAG balance badge */}
          {!isWrongChain && aidagBalance && aidagBalance !== '0' && (
            <span className="hidden md:block text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              {aidagBalance} AIDAG
            </span>
          )}

          <svg className={`w-3 h-3 text-gray-600 transition-transform ${dropOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {dropOpen && (
          <div className="absolute top-full right-0 mt-1.5 w-72 bg-[#08101e] rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden z-50">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            {/* Wallet info */}
            <div className="px-4 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] p-1">{renderLogo(20)}</span>
                <div>
                  <div className="text-xs font-bold text-white capitalize">{walletType ?? 'Wallet'}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSigned ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                    <span className="text-[10px] text-gray-500">
                      {isSigned ? 'Signed · AIDAG Chain connected' : 'Connected · Unsigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="glass rounded-xl p-3 mb-3">
                <div className="text-[10px] text-gray-600 mb-1">Wallet Address</div>
                <div className="font-mono text-xs text-white break-all">{address}</div>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-2">
                <div className="glass rounded-xl p-2.5">
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">BNB Balance</div>
                  <div className="text-sm font-black text-yellow-400">{bnbBalance ?? '···'}</div>
                  <div className="text-[9px] text-gray-700">BNB</div>
                </div>
                <div className="glass rounded-xl p-2.5">
                  <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">AIDAG Balance</div>
                  <div className="text-sm font-black text-cyan-400 truncate">{aidagBalance ?? '···'}</div>
                  <div className="text-[9px] text-gray-700">AIDAG · BSC</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              {isWrongChain && (
                <button
                  onClick={() => { switchToBSC(); setDropOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all mb-1"
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Switch to BSC Network
                </button>
              )}

              <a href={`https://bscscan.com/address/${address}`} target="_blank" rel="noopener noreferrer"
                onClick={() => setDropOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:bg-white/[0.04] hover:text-white transition-all">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on BSCScan
              </a>

              <a href={`https://bscscan.com/token/0xe6B06f7C63F6AC84729007ae8910010F6E721041?a=${address}`} target="_blank" rel="noopener noreferrer"
                onClick={() => setDropOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:bg-white/[0.04] hover:text-white transition-all">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AIDAG Token Holdings
              </a>

              <button
                onClick={() => { disconnect(); setDropOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400/80 hover:bg-red-500/[0.06] hover:text-red-400 transition-all mt-1"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected
  return (
    <button
      onClick={openModal}
      className={`btn btn-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${className}`}
    >
      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Connect Wallet
    </button>
  );
}
