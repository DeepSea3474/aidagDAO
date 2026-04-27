import { NextResponse } from 'next/server';
import { getOrchestrator, startOrchestrator } from '../../../../lib/server/orchestrator';
import { calcGenesisState } from '../../../../lib/lsc-genesis-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  startOrchestrator();
  const state = getOrchestrator().getState();
  const genesis = calcGenesisState();

  return NextResponse.json({
    ok: true,
    genesis,
    iterations: state.lsc.iterations.slice(0, 30),
    bestRealTps: state.lsc.bestRealTps,
    bestFinalityMs: state.lsc.bestFinalityMs,
    iterationCount: state.lsc.iterations.length,
    timestamp: Date.now(),
  });
}
