'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useWalletContext } from '../lib/WalletContext';
import { PRESALE_STAGE1_PRICE, LISTING_PRICE, PRESALE_MIN_USD } from '../lib/constants';
import { useChainData } from '../lib/useChainData';

const QUICK = ['0.1', '0.25', '0.5', '1'];

export default function PresaleWidget() {
  const { isConnected, openModal, bnbBalance } = useWalletContext();
  const chain = useChainData();
  const [bnb, setBnb] = useState('0.1');

  const calc = useMemo(() => {
    const bnbNum = parseFloat(bnb) || 0;
    const bnbPrice = chain.bnbPrice || 0;
    const usd = bnbNum * bnbPrice;
    const aidag = usd > 0 ? usd / PRESALE_STAGE1_PRICE : 0;
    const listingValue = aidag * LISTING_PRICE;
    const profit = listingValue - usd;
    const belowMin = bnbPrice > 0 && usd > 0 && usd < PRESALE_MIN_USD;
    return { bnbNum, usd, aidag, listingValue, profit, belowMin };
  }, [bnb, chain.bnbPrice]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <div className="glass rounded-3xl border border-cyan-500/20 p-6 md:p-7 max-w-3xl mx-auto mt-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">Quick Calculator</div>
          <div className="text-lg font-black text-white">BNB → AIDAG</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">BNB Price</div>
          <div className="text-sm font-mono font-bold text-yellow-400">
            {chain.loading || !chain.bnbPrice ? '—' : `$${fmt(chain.bnbPrice, 2)}`}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 items-stretch">
        <div className="space-y-3">
          <label className="block">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">You pay</span>
              {isConnected && bnbBalance && (
                <span className="text-[10px] text-gray-500 font-mono">Balance: {bnbBalance} BNB</span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={bnb}
                onChange={(e) => setBnb(e.target.value)}
                placeholder="0.0"
                className="w-full bg-[#020617]/60 border border-white/[0.08] focus:border-cyan-500/40 rounded-xl px-4 py-3 pr-16 text-lg font-mono font-bold text-white outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm">BNB</span>
            </div>
          </label>

          <div className="flex gap-1.5">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => setBnb(q)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                  bnb === q
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'border-white/[0.06] text-gray-500 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#020617]/60 border border-cyan-500/15 p-4 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">You receive</div>
            <div className="font-mono text-2xl font-black text-gradient leading-none">
              {calc.aidag > 0 ? fmt(calc.aidag, 2) : '—'}
            </div>
            <div className="text-[10px] text-cyan-400/70 mt-1">AIDAG · Stage 1 @ ${PRESALE_STAGE1_PRICE}</div>
          </div>
          <div className="border-t border-white/[0.05] mt-3 pt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <div className="text-gray-500">USD value</div>
              <div className="font-mono text-white font-bold">
                {calc.usd > 0 ? `$${fmt(calc.usd, 2)}` : '—'}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Listing value</div>
              <div className="font-mono text-emerald-400 font-bold">
                {calc.listingValue > 0 ? `$${fmt(calc.listingValue, 2)}` : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        {isConnected ? (
          <Link
            href="/presale"
            className="btn btn-primary flex-1 py-3.5 rounded-xl text-sm font-black"
          >
            Continue to Buy AIDAG →
          </Link>
        ) : (
          <button
            onClick={openModal}
            className="btn btn-primary flex-1 py-3.5 rounded-xl text-sm font-black"
          >
            Connect Wallet to Buy
          </button>
        )}
        <Link
          href="/presale"
          className="btn btn-secondary px-5 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap"
        >
          Full Presale Page
        </Link>
      </div>

      <div className="mt-3 text-[10px] text-center">
        {calc.belowMin ? (
          <span className="text-amber-400">
            Minimum buy is ${PRESALE_MIN_USD}. Increase the BNB amount to continue on the presale page.
          </span>
        ) : (
          <span className="text-gray-600">
            Minimum buy ${PRESALE_MIN_USD} · live BSC RPC + Binance ticker · final amount confirmed in-wallet at signature.
          </span>
        )}
      </div>
    </div>
  );
}
