import { NextResponse } from 'next/server';

// ── Presale configuration ─────────────────────────────────────────────────────
const FOUNDER_WALLET    = '0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9';
const STAGE1_PRICE_USD  = 0.078;
const STAGE2_PRICE_USD  = 0.098;
const LISTING_PRICE     = 0.12;
const STAGE1_HARD_CAP   = 9_000_000;
const STAGE2_HARD_CAP   = 7_999_000;
const TOTAL_PRESALE     = STAGE1_HARD_CAP + STAGE2_HARD_CAP;

const BSC_RPCS = [
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://rpc.ankr.com/bsc',
];

// ── Real BNB price ────────────────────────────────────────────────────────────
async function getBNBPrice(): Promise<number> {
  const sources = [
    {
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT',
      parse: (d: any) => parseFloat(d.price),
    },
    {
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
      parse: (d: any) => d?.binancecoin?.usd,
    },
    {
      url: 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD',
      parse: (d: any) => d?.USD,
    },
  ];
  for (const src of sources) {
    try {
      const r = await fetch(src.url, { signal: AbortSignal.timeout(4000) });
      if (!r.ok) continue;
      const price = src.parse(await r.json());
      if (price && price > 10) return parseFloat(price);
    } catch { continue; }
  }
  return 0;
}

// ── Real founder wallet BNB balance via BSC RPC ───────────────────────────────
async function getFounderBalance(): Promise<number> {
  for (const rpc of BSC_RPCS) {
    try {
      const r = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'eth_getBalance',
          params: [FOUNDER_WALLET, 'latest'],
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) continue;
      const { result } = await r.json();
      if (result) return Number(BigInt(result)) / 1e18;
    } catch { continue; }
  }
  return 0;
}

// ── Transaction list from Etherscan V2 (BSC chainid=56) ──────────────────────
async function getTxData(): Promise<{ txCount: number; participants: number; source: string } | null> {
  const endpoints = [
    `https://api.etherscan.io/v2/api?chainid=56&module=account&action=txlist&address=${FOUNDER_WALLET}&startblock=0&endblock=99999999&sort=asc`,
    `https://api.bscscan.com/api?module=account&action=txlist&address=${FOUNDER_WALLET}&startblock=0&endblock=99999999&sort=asc`,
  ];

  for (const url of endpoints) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!r.ok) continue;
      const data = await r.json();

      let txList: any[] = [];
      if (Array.isArray(data.result)) {
        txList = data.result;
      } else if (data.status === '0' && data.message === 'No transactions found') {
        return { txCount: 0, participants: 0, source: 'etherscan_v2' };
      } else {
        continue;
      }

      const incoming = txList.filter((tx: any) =>
        tx.to?.toLowerCase() === FOUNDER_WALLET.toLowerCase() &&
        BigInt(tx.value || '0') > 0n &&
        tx.isError === '0'
      );

      const participants = new Set(incoming.map((tx: any) => tx.from.toLowerCase())).size;
      return { txCount: incoming.length, participants, source: 'etherscan_v2' };
    } catch { continue; }
  }
  return null;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [bnbPrice, founderBNB, txData] = await Promise.all([
      getBNBPrice(),
      getFounderBalance(),
      getTxData(),
    ]);

    if (bnbPrice === 0) {
      return NextResponse.json({ ok: false, error: 'Price feed unavailable' }, { status: 503 });
    }

    // Tokens sold calculated from actual wallet balance × price
    const totalUSD    = founderBNB * bnbPrice;
    const tokensSold  = totalUSD / STAGE1_PRICE_USD;
    const stage1Pct   = Math.min(100, parseFloat(((tokensSold / STAGE1_HARD_CAP) * 100).toFixed(4)));
    const currentStage = tokensSold >= STAGE1_HARD_CAP ? 2 : 1;
    const currentPrice = currentStage === 1 ? STAGE1_PRICE_USD : STAGE2_PRICE_USD;
    const hardCap      = currentStage === 1 ? STAGE1_HARD_CAP : STAGE2_HARD_CAP;
    const remaining    = currentStage === 1
      ? STAGE1_HARD_CAP - Math.round(tokensSold)
      : STAGE2_HARD_CAP - Math.max(0, Math.round(tokensSold) - STAGE1_HARD_CAP);

    // SoulwareAI Market Cell autonomous signal
    const soulware_signal =
      stage1Pct >= 80 ? { type: 'CRITICAL', msg: `⚡ Stage 1 is ${stage1Pct}% filled — SoulwareAI initiating Stage 2 preparation` }
      : stage1Pct >= 50 ? { type: 'HIGH',   msg: `📈 Strong demand at ${stage1Pct}% — SoulwareAI expanding liquidity pool` }
      : stage1Pct >= 10 ? { type: 'ACTIVE', msg: `🔄 Presale active — SoulwareAI Market Cell monitoring all inflows` }
      :                   { type: 'OPEN',   msg: `🚀 Stage 1 open — Be early. SoulwareAI tracking wallet inflows live.` };

    return NextResponse.json({
      ok: true,
      stage: currentStage,
      price: currentPrice,
      listing_price: LISTING_PRICE,
      bnbPrice,
      totalBNB:    parseFloat(founderBNB.toFixed(6)),
      totalUSD:    Math.round(totalUSD),
      tokensSold:  Math.round(tokensSold),
      participants: txData?.participants ?? null,
      txCount:      txData?.txCount ?? null,
      stage1_pct:   stage1Pct,
      remaining,
      hard_cap:     hardCap,
      total_presale: TOTAL_PRESALE,
      roi_from_stage1: parseFloat(((LISTING_PRICE / STAGE1_PRICE_USD - 1) * 100).toFixed(1)),
      roi_from_stage2: parseFloat(((LISTING_PRICE / STAGE2_PRICE_USD - 1) * 100).toFixed(1)),
      soulware_signal,
      data_source: {
        balance: 'BSC RPC (live)',
        price: 'Binance API (live)',
        transactions: txData?.source ?? 'unavailable',
      },
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Stats unavailable' }, { status: 500 });
  }
}
