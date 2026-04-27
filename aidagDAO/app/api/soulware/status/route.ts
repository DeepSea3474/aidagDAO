import { NextResponse } from 'next/server';
import { getOrchestrator, startOrchestrator } from '../../../../lib/server/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Boot the singleton on first request (and ensure it stays running).
  // The engine continues to tick independently of any browser connection.
  startOrchestrator();
  const state = getOrchestrator().getState();

  return NextResponse.json({
    ok: true,
    health: state.health,
    autonomyMode: state.autonomyMode,
    dryRun: state.dryRun,
    uptimeMs: state.uptimeMs,
    ticks: state.ticks,
    lastTickAt: state.lastTickAt,
    chain: state.chain,
    treasury: state.treasury,
    token: state.token,
    presale: state.presale,
    websiteProbe: state.websiteProbe,
    rpcHealth: state.rpcHealth,
    modules: state.modules,
    decisions: state.decisions.slice(0, 80),
    queue: state.queue,
    executedHistory: state.executedHistory.slice(0, 30),
    whitelist: state.whitelist,
    cex: state.cex,
    dex: state.dex,
    lsc: {
      bestRealTps: state.lsc.bestRealTps,
      bestFinalityMs: state.lsc.bestFinalityMs,
      iterationCount: state.lsc.iterations.length,
      dagStats: state.lsc.dagStats,
      iterations: state.lsc.iterations.slice(0, 20),
      genesis: state.lsc.genesis,
    },
    evolutionScore: state.evolutionScore,
    timestamp: Date.now(),
  });
}
