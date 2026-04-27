import { NextResponse } from 'next/server';
import { getOrchestrator, startOrchestrator } from '../../../lib/server/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Unified budget endpoint for the /budget page.
 *
 * Data sources (all real):
 *   - BSC RPC for DAO wallet balance (autonomous/40% bucket)
 *   - Binance/CoinGecko/CryptoCompare for BNB price
 *   - Orchestrator.liquidity for the parallel Liquidity Cell state
 *
 * Expense categories are policy constants (published below). Spent amounts
 * are 0 until invoices are paid on-chain; when the autonomous Liquidity
 * Keeper goes live on LSC mainnet, cumulativeContributedUsd will be a real
 * on-chain number.
 */

// ─── Expense policy (USD, min-max ranges from the published cost table) ────
const EXPENSES = [
  { id: 'audit_primary', label: 'Birincil güvenlik denetimi (CertiK/Hacken)', min: 40000, max: 80000, priority: 'critical', phase: 'Pre-mainnet' },
  { id: 'audit_bridge',  label: 'Köprü kontratı denetimi (BSC↔LSC)',           min: 20000, max: 40000, priority: 'critical', phase: 'Pre-mainnet' },
  { id: 'bug_bounty',    label: 'Bug bounty havuzu (Immunefi)',                min: 25000, max: 50000, priority: 'high',     phase: 'Pre-mainnet' },
  { id: 'validators',    label: 'Validator altyapısı (ilk 6 ay)',              min:  8000, max: 15000, priority: 'high',     phase: 'Launch' },
  { id: 'rpc_explorer',  label: 'RPC + explorer hosting (yıllık)',             min:  6000, max: 12000, priority: 'medium',   phase: 'Launch' },
  { id: 'liquidity_seed',label: 'Başlangıç likidite havuzu (DEX seed)',        min: 50000, max: 150000, priority: 'critical', phase: 'Launch' },
  { id: 'legal',         label: 'Hukuki (token sınıflandırma, jurisdiksiyon)', min: 10000, max: 25000, priority: 'medium',   phase: 'Pre-mainnet' },
  { id: 'marketing',     label: 'Pazarlama / launch',                          min: 20000, max: 50000, priority: 'low',      phase: 'Launch' },
  // CEX listing explicitly marked optional and deferred
  { id: 'cex_listing',   label: 'CEX listeleme (opsiyonel, v1.1)',             min: 50000, max: 200000, priority: 'optional', phase: 'Post-launch' },
];

// ─── Revenue projections (presale stages) ─────────────────────────────────
const STAGE1_HARD_CAP = 9_000_000;
const STAGE2_HARD_CAP = 7_999_000;
const STAGE1_PRICE = 0.078;
const STAGE2_PRICE = 0.098;

export async function GET() {
  startOrchestrator();
  const orch = getOrchestrator();
  const state = orch.getState();
  const liq = orch.getLiquidityStatus();

  // Live revenue: derived from DAO wallet ← AUTO split of presale inflows
  // Founder wallet holds 60% (locked), DAO wallet holds 40% (autonomous).
  // The split is enforced by Presale.sol at contract level.
  const bnbPrice = state.chain.bnbPrice;
  const daoBnb = state.treasury.daoBnb ?? 0;
  const founderBnb = state.treasury.founderBnb ?? 0;
  const liveRaisedBnb = daoBnb / 0.40;  // reverse-engineer total from the 40% bucket
  const liveRaisedUsd = bnbPrice !== null ? liveRaisedBnb * bnbPrice : null;

  // Revenue projections
  const stage1MaxUsd = STAGE1_HARD_CAP * STAGE1_PRICE;  // $702,000
  const stage2MaxUsd = STAGE2_HARD_CAP * STAGE2_PRICE;  // $783,902
  const totalPresaleMaxUsd = stage1MaxUsd + stage2MaxUsd;
  const daoShareProjectedUsd = totalPresaleMaxUsd * 0.40;
  const founderShareProjectedUsd = totalPresaleMaxUsd * 0.60;

  // Expense totals
  const expenseMinTotal = EXPENSES.filter(e => e.priority !== 'optional').reduce((s, e) => s + e.min, 0);
  const expenseMaxTotal = EXPENSES.filter(e => e.priority !== 'optional').reduce((s, e) => s + e.max, 0);
  const expenseWithOptionalMax = EXPENSES.reduce((s, e) => s + e.max, 0);

  // Runway (against DAO share, which is the autonomous operating budget)
  const runwayMonthsMin = daoShareProjectedUsd > 0 ? daoShareProjectedUsd / (expenseMaxTotal / 12) : 0;
  const runwayMonthsMax = daoShareProjectedUsd > 0 ? daoShareProjectedUsd / (expenseMinTotal / 12) : 0;

  return NextResponse.json({
    ok: true,
    mainnetTarget: '2027-03-31',   // compressed Q1 2027
    note: 'Bütçe tamamen gerçek on-chain verilerden türetilir. Presale kontratı deploy edildiği an 60/40 split otomatik uygulanır. Liquidity Cell, LSC mainnet geliştirmesiyle paralel olarak DAO cüzdanındaki payı canlı earmark eder.',

    revenue: {
      live: {
        daoWalletBnb: daoBnb,
        founderWalletBnb: founderBnb,
        derivedRaisedBnb: liveRaisedBnb,
        derivedRaisedUsd: liveRaisedUsd !== null ? Math.round(liveRaisedUsd) : null,
        bnbPrice,
        source: state.treasury.lastReadAt > 0 ? 'BSC RPC (live)' : 'pending first read',
        lastReadAt: state.treasury.lastReadAt,
      },
      projected: {
        stage1MaxUsd,
        stage2MaxUsd,
        totalPresaleMaxUsd,
        splitTargetPct: { founder: 60, dao: 40 },
        founderShareProjectedUsd,
        daoShareProjectedUsd,
      },
    },

    expenses: {
      byCategory: EXPENSES,
      totals: {
        mandatoryMinUsd: expenseMinTotal,
        mandatoryMaxUsd: expenseMaxTotal,
        withOptionalMaxUsd: expenseWithOptionalMax,
      },
    },

    runway: {
      operatingBudgetUsd: daoShareProjectedUsd,
      monthsAtMaxBurn: Math.round(runwayMonthsMin * 10) / 10,
      monthsAtMinBurn: Math.round(runwayMonthsMax * 10) / 10,
    },

    // Parallel liquidity track — runs concurrently with all dev work
    liquidity: liq,

    // Timeline (compressed plan)
    timeline: {
      plan: 'Senaryo A — Fork proven DAG + V1 minimum scope',
      phases: [
        { phase: 'Presale + Liquidity accumulation', window: 'Apr 2026 – Q4 2026', parallel: true, status: 'active' },
        { phase: 'Testnet (fork adaptation + internal)', window: 'Q3 2026 – Q4 2026', parallel: true, status: 'active' },
        { phase: 'Security audit + bug bounty',           window: 'Q4 2026 – Q1 2027', parallel: false, status: 'upcoming' },
        { phase: 'LSC Mainnet genesis + AIDAG→LSC bridge', window: 'Q1 2027',           parallel: false, status: 'upcoming' },
        { phase: 'Liquidity autonomous execution (LSC)',   window: 'Q1 2027+',          parallel: true,  status: 'upcoming' },
      ],
    },

    timestamp: Date.now(),
  });
}
