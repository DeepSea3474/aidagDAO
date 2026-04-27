import { NextResponse } from 'next/server';
import { getOrchestrator, startOrchestrator } from '../../../../../lib/server/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { hash: string } }) {
  startOrchestrator();
  const orch = getOrchestrator();
  const hash = (params.hash || '').toLowerCase().trim();
  if (!hash || hash.length < 8) {
    return NextResponse.json({ ok: false, error: 'invalid_hash' }, { status: 400 });
  }
  const v = orch.getLedgerVertex(hash);
  if (!v) {
    return NextResponse.json({ ok: false, error: 'vertex_not_found_or_pruned', hash }, { status: 404 });
  }
  // Include parent summaries for navigation
  const parentDetails = v.parents.map(ph => {
    const p = orch.getLedgerVertex(ph);
    return p
      ? { hash: p.hash, height: p.height, type: p.type, confirmed: p.confirmed, timestamp: p.timestamp }
      : { hash: ph, pruned: true };
  });
  return NextResponse.json({
    ok: true,
    vertex: {
      hash: v.hash,
      type: v.type,
      height: v.height,
      timestamp: v.timestamp,
      confirmed: v.confirmed,
      cumulativeWeight: v.cumulativeWeight,
      parents: v.parents,
      parentDetails,
      children: v.children,
      childCount: v.children.length,
    },
    explorer: 'LSC Chain — Pre-Genesis Testnet Ledger',
    timestamp: Date.now(),
  });
}
