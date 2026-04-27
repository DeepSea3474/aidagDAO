import { NextResponse } from 'next/server';
import { getOrchestrator, startOrchestrator } from '../../../../lib/server/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  startOrchestrator();
  const orch = getOrchestrator();
  const liq = orch.getLiquidityStatus();
  const state = orch.getState();

  // Recent Liquidity Cell decisions for the activity log on the budget page
  const recentEvents = state.decisions
    .filter(d => d.kind === 'LIQUIDITY_RESERVE' || d.kind === 'LIQUIDITY_TRANCHE_READY' || d.kind === 'LIQUIDITY_POLICY')
    .slice(0, 20);

  return NextResponse.json({
    ok: true,
    network: 'AIDAG Liquidity Cell',
    phase: 'pre_mainnet_parallel',
    note: 'Liquidity formation runs in parallel with LSC Chain development. Pre-mainnet: Cell earmarks DAO wallet BNB per policy and proposes tranches when thresholds are hit (DAO signer broadcasts on PancakeSwap). Post-LSC-mainnet (Q1 2027): on-chain Liquidity Keeper contract auto-executes.',
    liquidity: liq,
    recentEvents,
    timestamp: Date.now(),
  });
}
