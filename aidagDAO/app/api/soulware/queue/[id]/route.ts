import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getOrchestrator, startOrchestrator } from '../../../../../lib/server/orchestrator';
import { SOVEREIGN_HASH } from '../../../../../lib/soulware-sovereign';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function verifyKey(key: string): boolean {
  const h1 = createHash('sha256').update(key).digest('hex');
  const h2 = createHash('sha256').update(h1 + 'SOULWAREAI_AIDAG_CHAIN_SOVEREIGN').digest('hex');
  return h2 === SOVEREIGN_HASH;
}

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    startOrchestrator();
    const body = await req.json();
    const { key, decision, note } = body ?? {};
    if (!key || !verifyKey(key)) {
      return NextResponse.json({ error: 'UNAUTHORIZED — founder anahtarı gerekli' }, { status: 401 });
    }
    if (decision !== 'approve' && decision !== 'reject') {
      return NextResponse.json({ error: 'decision must be "approve" or "reject"' }, { status: 400 });
    }
    const orch = getOrchestrator();
    const result = orch.approveAction(ctx.params.id, decision, note);
    if (!result) {
      return NextResponse.json({ error: 'action not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, action: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
