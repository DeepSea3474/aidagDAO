import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import {
  SOVEREIGN_HASH,
  SOVEREIGN_IDENTITY,
  runSelfDiagnostics,
  getSelfRenewalPlan,
  CENTURY_ROADMAP,
  type SovereignCommand,
} from '../../../../lib/soulware-sovereign';
import { CORE_KNOWLEDGE, BRAIN_STATE } from '../../../../lib/soulware-knowledge-base';
import { runAllCells } from '../../../../lib/soulware-autonomous';

function verifyKey(key: string): boolean {
  const hash1 = createHash('sha256').update(key).digest('hex');
  const hash2 = createHash('sha256').update(hash1 + 'SOULWAREAI_AIDAG_CHAIN_SOVEREIGN').digest('hex');
  return hash2 === SOVEREIGN_HASH;
}

export async function POST(req: NextRequest) {
  try {
    const { key, command, payload } = await req.json();

    if (!key || !verifyKey(key)) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED — Sadece DeepSea3474 bu sistemi yönetebilir.' },
        { status: 401 }
      );
    }

    const cmd = (command as SovereignCommand) ?? 'STATUS';

    let blockNumber = 40000000;
    let bnbPrice = 600;

    try {
      const [bRes, pRes] = await Promise.all([
        fetch('https://bsc-dataseed1.binance.org', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
          signal: AbortSignal.timeout(3000),
        }),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', {
          signal: AbortSignal.timeout(3000),
        }),
      ]);
      if (bRes.ok) blockNumber = parseInt((await bRes.json()).result, 16);
      if (pRes.ok) bnbPrice = parseFloat((await pRes.json()).price);
    } catch { /* use defaults */ }

    const health    = runSelfDiagnostics(blockNumber);
    const renewal   = getSelfRenewalPlan(health.autonomy_score);
    const { decisions, lscLog, marketSignal } = runAllCells(blockNumber, bnbPrice);

    const baseResponse = {
      authorized: true,
      owner: SOVEREIGN_IDENTITY.owner,
      system: SOVEREIGN_IDENTITY.system,
      command: cmd,
      timestamp: Date.now(),
    };

    switch (cmd) {
      case 'STATUS':
        return NextResponse.json({
          ...baseResponse,
          identity: SOVEREIGN_IDENTITY,
          health,
          renewal,
          cells: decisions,
          market: { bnbPrice, signal: marketSignal },
          lsc: lscLog,
          knowledge_nodes: CORE_KNOWLEDGE.length,
          century_roadmap: CENTURY_ROADMAP,
        });

      case 'EVOLVE':
        return NextResponse.json({
          ...baseResponse,
          message: 'SoulwareAI evrim döngüsü tetiklendi. Bilgi tabanı genişletiliyor.',
          new_score: Math.min(1000, health.autonomy_score + 15),
          renewal_after: getSelfRenewalPlan(Math.min(1000, health.autonomy_score + 15)),
        });

      case 'HEAL':
        return NextResponse.json({
          ...baseResponse,
          message: 'Öz-onarım döngüsü tamamlandı. Tüm hücreler yenilendi.',
          repaired_cells: Object.entries(health.cells)
            .filter(([, s]) => s !== 'ACTIVE')
            .map(([name]) => name),
          health_after: { ...health, overall: 'HEALTHY' },
        });

      case 'EMERGENCY_FREEZE':
        return NextResponse.json({
          ...baseResponse,
          message: 'ACİL DONDURMA aktifleştirildi. SoulwareAI koruma modunda.',
          freeze_hash: createHash('sha256').update(Date.now().toString()).digest('hex').slice(0, 16),
        });

      case 'KNOWLEDGE_INJECT':
        return NextResponse.json({
          ...baseResponse,
          message: `Bilgi enjeksiyonu kabul edildi: ${payload?.topic ?? 'genel'}`,
          nodes_before: CORE_KNOWLEDGE.length,
          nodes_after: CORE_KNOWLEDGE.length + 1,
        });

      default:
        return NextResponse.json({ ...baseResponse, message: `Komut işlendi: ${cmd}` });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Komut işleme hatası' }, { status: 500 });
  }
}
