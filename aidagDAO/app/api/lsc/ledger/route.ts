import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator, startOrchestrator } from '../../../../lib/server/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  startOrchestrator();
  const orch = getOrchestrator();
  const url = new URL(req.url);
  const rawLimit = Number(url.searchParams.get('limit') ?? '50');
  const limit = Math.max(1, Math.min(200, Number.isFinite(rawLimit) ? rawLimit : 50));
  const stats = orch.getLedgerStats();
  const recent = orch.getLedgerRecent(limit);
  const tips = orch.getLedgerTips();
  return NextResponse.json({
    ok: true,
    network: 'LSC Chain — Pre-Genesis Testnet Ledger',
    phase: 'testnet_development',
    mainnetTarget: '2027-03-31',
    note: 'This is the live DAG ledger produced by SoulwareAI. Its final snapshot will migrate to mainnet at genesis (Q1 2027). 1 AIDAG = 100 LSC bridge opens at mainnet.',
    stats,
    tipsCount: tips.length,
    tips: tips.slice(0, 10).map(v => ({ hash: v.hash, height: v.height, type: v.type, timestamp: v.timestamp })),
    recent: recent.map(v => ({
      hash: v.hash,
      parents: v.parents,
      children: v.children.length,
      height: v.height,
      weight: v.cumulativeWeight,
      timestamp: v.timestamp,
      confirmed: v.confirmed,
      type: v.type,
    })),
    timestamp: Date.now(),
  });
}
