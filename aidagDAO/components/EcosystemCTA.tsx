'use client';
import Link from 'next/link';
import { useChainData } from '../lib/useChainData';
import { PRESALE_MIN_USD } from '../lib/constants';

const DAO_FEE_USD = 10;

export default function EcosystemCTA() {
  const chain = useChainData();
  const bnbForDao =
    chain.bnbPrice > 0 ? (DAO_FEE_USD / chain.bnbPrice).toFixed(4) : null;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-8">
        <div className="section-label glass-cyan border border-cyan-500/20 text-cyan-400 mb-3 mx-auto w-fit">
          Join the Network
        </div>
        <h3 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
          How do you want to <span className="text-gradient">join AIDAG Chain</span>?
        </h3>
        <p className="text-gray-500 text-sm md:text-base">
          Pick your path. Both go to the same secure presale flow on BSC.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* DAO Member */}
        <Link
          href="/presale?mode=dao"
          className="group relative glass rounded-3xl border border-purple-500/25 hover:border-purple-500/50 p-6 md:p-7 transition-all overflow-hidden block"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl group-hover:bg-purple-500/25 transition-all pointer-events-none" />

          <div className="flex items-center gap-3 mb-4 relative">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">Recommended</div>
              <div className="text-lg md:text-xl font-black text-white">Become a DAO Member</div>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-5 relative">
            Get full governance rights, vote on every proposal, and join the SoulwareAI DAO Cell.
            One-time membership fee paid in BNB equivalent of $10.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-5 relative">
            <Stat label="Fee" value={`$${DAO_FEE_USD}`} sub="One-time" c="text-purple-300" />
            <Stat
              label="In BNB"
              value={bnbForDao ? `${bnbForDao}` : '—'}
              sub={chain.bnbPrice > 0 ? `@ $${chain.bnbPrice.toFixed(2)}` : 'Loading…'}
              c="text-yellow-400"
            />
            <Stat label="Vote weight" value="1×" sub="+ AIDAG bonus" c="text-emerald-400" />
          </div>

          <ul className="text-xs text-gray-400 space-y-1.5 mb-6 relative">
            <Bullet color="purple">Governance rights on every proposal</Bullet>
            <Bullet color="purple">Priority allocation on LSC Chain (2027)</Bullet>
            <Bullet color="purple">DAO badge + on-chain member NFT (post-mainnet)</Bullet>
          </ul>

          <div className="btn btn-primary w-full py-3.5 rounded-xl text-sm font-black bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 relative">
            Continue as DAO Member →
          </div>
        </Link>

        {/* Just buy AIDAG */}
        <Link
          href="/presale?mode=buy"
          className="group relative glass rounded-3xl border border-emerald-500/25 hover:border-emerald-500/50 p-6 md:p-7 transition-all overflow-hidden block"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl group-hover:bg-emerald-500/25 transition-all pointer-events-none" />

          <div className="flex items-center gap-3 mb-4 relative">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Open access</div>
              <div className="text-lg md:text-xl font-black text-white">Just Buy AIDAG Tokens</div>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-5 relative">
            No commitment, no membership. Choose any BNB amount and instantly receive AIDAG tokens
            at the live Stage&nbsp;1 price of $0.078.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-5 relative">
            <Stat label="Stage 1" value="$0.078" sub="per AIDAG" c="text-cyan-400" />
            <Stat label="Listing" value="$0.12" sub="+53.8% target" c="text-amber-400" />
            <Stat label="Min. buy" value={`$${PRESALE_MIN_USD}`} sub="Stage 1 floor" c="text-emerald-400" />
          </div>

          <ul className="text-xs text-gray-400 space-y-1.5 mb-6 relative">
            <Bullet color="emerald">Any amount from ${PRESALE_MIN_USD} upward, instantly</Bullet>
            <Bullet color="emerald">Real BSC transaction · BSCScan verifiable</Bullet>
            <Bullet color="emerald">Upgrade to DAO membership later anytime</Bullet>
          </ul>

          <div className="btn btn-primary w-full py-3.5 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 relative">
            Continue to Buy →
          </div>
        </Link>
      </div>

      <div className="text-center mt-6 text-[11px] text-gray-600 max-w-xl mx-auto">
        Both flows execute on BSC mainnet. The DAO fee is forwarded to the founder wallet exactly
        like a regular presale buy — only the post-purchase status is different.
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  c,
}: {
  label: string;
  value: string;
  sub: string;
  c: string;
}) {
  return (
    <div className="rounded-xl bg-[#020617]/60 border border-white/[0.05] px-2 py-2 text-center">
      <div className={`font-mono text-sm font-black ${c} leading-none`}>{value}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{label}</div>
      <div className="text-[8px] text-gray-700 mt-0.5">{sub}</div>
    </div>
  );
}

function Bullet({
  children,
  color,
}: {
  children: React.ReactNode;
  color: 'purple' | 'emerald';
}) {
  const c = color === 'purple' ? 'text-purple-400' : 'text-emerald-400';
  return (
    <li className="flex items-start gap-2">
      <svg className={`w-3.5 h-3.5 ${c} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
