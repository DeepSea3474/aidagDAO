import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { SOVEREIGN_HASH, SOVEREIGN_IDENTITY } from '../../../../lib/soulware-sovereign';

function verifyKey(key: string): boolean {
  const hash1 = createHash('sha256').update(key).digest('hex');
  const hash2 = createHash('sha256')
    .update(hash1 + 'SOULWAREAI_AIDAG_CHAIN_SOVEREIGN')
    .digest('hex');
  return hash2 === SOVEREIGN_HASH;
}

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    if (typeof key !== 'string' || !verifyKey(key)) {
      return NextResponse.json(
        { ok: false, error: 'UNAUTHORIZED — Sahip anahtarı eşleşmedi.' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      ok: true,
      owner: SOVEREIGN_IDENTITY.owner,
      system: SOVEREIGN_IDENTITY.system,
      grantedAt: Date.now(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 });
  }
}
