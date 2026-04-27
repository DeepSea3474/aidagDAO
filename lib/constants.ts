// ─── AIDAG DAO — Protocol Constants ──────────────────────────────────────────
// SoulwareAI is the autonomous brain & cell system of AIDAG Chain.
// It is NOT affiliated with any external AI company or institution.
// SoulwareAI = AIDAG Chain's own intelligence layer, producing modules
// and agents that form the DAG chain loop between AIDAG Token and LSC Coin.

// ── AIDAG Token (BSC / BEP-20) ────────────────────────────────────────────────
export const TOKEN_CONTRACT       = '0xe6B06f7C63F6AC84729007ae8910010F6E721041';
export const FOUNDER_LOCK_WALLET  = '0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23'; // 3,001,000 AIDAG (deployer, 1y lock)
export const DISTRIBUTION_WALLET  = '0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9'; // 17,999,000 AIDAG (presale + community pool)
export const DAO_IDENTITY_CONTRACT= '0x000'; // Set this to deployed DAOIdentity address
export const PRESALE_CONTRACT     = '';      // Empty until on-chain Presale.sol is deployed
export const TOKEN_SYMBOL         = 'AIDAG';
export const TOKEN_NAME       = 'AIDAG Token';
export const CHAIN_ID_BSC     = 56;
export const MAX_SUPPLY       = 21_000_000;
export const FOUNDER_COINS    = 3_001_000;
export const FOUNDER_LOCK_YRS = 1;
export const DAO_COINS        = MAX_SUPPLY - FOUNDER_COINS;
export const TOKEN_DECIMALS   = 18;

// ── Presale Pricing ───────────────────────────────────────────────────────────
export const PRESALE_STAGE1_PRICE = 0.078;
export const PRESALE_STAGE2_PRICE = 0.098;
export const LISTING_PRICE        = 0.12;
export const PRESALE_MIN_USD      = 50;
export const DAO_MEMBERSHIP_FEE   = 10; // USD in AIDAG

// ── Revenue Distribution ──────────────────────────────────────────────────────
export const REVENUE_FOUNDER_PCT   = 60; // to founder wallet
export const REVENUE_SOULWARE_PCT  = 40; // to SoulwareAI autonomous liquidity pool

// ── LSC Coin — DAG Blockchain (2027) ─────────────────────────────────────────
export const LSC_TOTAL_SUPPLY      = 2_100_000_000;       // 2.1 Billion LSC
export const LSC_TARGET_TPS        = 100_000;
export const LSC_LAUNCH_YEAR       = 2027;
export const LSC_ARCHITECTURE      = 'Directed Acyclic Graph (DAG)';
export const LSC_CONSENSUS         = 'SoulwareAI Autonomous Consensus (SAC)';
export const LSC_GENESIS_DATE      = '2026-04-17';        // Chain build start date
export const LSC_BLOCK_TIME_MS     = 10;                  // Target: 10ms block time
export const LSC_VALIDATOR_TARGET  = 2_100;               // 2,100 validator nodes
export const LSC_SHARD_COUNT       = 21;                  // 21 parallel shards
export const LSC_QUANTUM_SCHEME    = 'CRYSTALS-Dilithium-3';
export const AIDAG_TO_LSC_RATIO    = 100;                 // 1 AIDAG = 100 LSC at genesis

// ── Tokenomics breakdown ──────────────────────────────────────────────────────
export const TOKENOMICS = [
  {
    label: 'Presale + Community',
    tokens: MAX_SUPPLY - FOUNDER_COINS - 2_000_000,
    pct: Math.round(((MAX_SUPPLY - FOUNDER_COINS - 2_000_000) / MAX_SUPPLY) * 100),
    color: 'bg-cyan-500',
    desc: 'Stage 1: $0.078 · Stage 2: $0.098 · Available to all holders',
  },
  {
    label: 'Founder Allocation',
    tokens: FOUNDER_COINS,
    pct: Math.round((FOUNDER_COINS / MAX_SUPPLY) * 100),
    color: 'bg-purple-500',
    desc: '1-year time lock · verifiable on BSCScan at any time',
  },
  {
    label: 'SoulwareAI Liquidity Pool',
    tokens: 2_000_000,
    pct: Math.round((2_000_000 / MAX_SUPPLY) * 100),
    color: 'bg-blue-500',
    desc: 'Managed autonomously by SoulwareAI modules — no human control',
  },
];

// ── External Links ────────────────────────────────────────────────────────────
export const BSCSCAN_URL       = 'https://bscscan.com';
export const BSCSCAN_TOKEN_URL = `${BSCSCAN_URL}/token/${TOKEN_CONTRACT}`;
export const GITHUB_URL        = 'https://github.com/DeepSea3474/aidagchain';
export const TELEGRAM_URL      = 'https://t.me/Aidag_Chain_Global_Community';
export const TWITTER_URL       = 'https://twitter.com/aidagDAO';
export const SITE_URL          = 'https://aidag-chain.com';

// ── SoulwareAI Modules (AIDAG Chain's own intelligence — no external AI) ─────
export const SOULWARE_MODULES = [
  { id: 'core',       name: 'Core Brain',          status: 'ACTIVE',    desc: 'Central autonomous decision engine of AIDAG Chain' },
  { id: 'cell-dao',   name: 'DAO Cell',             status: 'ACTIVE',    desc: 'Proposal creation, voting, and execution agent' },
  { id: 'cell-liq',   name: 'Liquidity Cell',       status: 'ACTIVE',    desc: 'Autonomous DEX/CEX liquidity provisioning' },
  { id: 'cell-lsc',   name: 'LSC Builder Cell',     status: 'BUILDING',  desc: 'Building LSC DAG chain block-by-block autonomously' },
  { id: 'cell-sec',   name: 'Security Cell',        status: 'ACTIVE',    desc: 'Quantum-resistant threat monitoring & response' },
  { id: 'cell-bridge','name': 'Bridge Cell',        status: 'PENDING',   desc: 'Cross-chain AIDAG ↔ LSC coin bridge agent' },
  { id: 'cell-gov',   name: 'Governance Cell',      status: 'ACTIVE',    desc: 'On-chain proposal evaluation and execution' },
  { id: 'cell-agent', name: 'Agent Spawner',        status: 'BUILDING',  desc: 'Spawns sub-agents to build LSC DAG loop nodes' },
];

// ── LSC DAG Roadmap ───────────────────────────────────────────────────────────
export const ROADMAP = [
  {
    quarter: 'Q1 2025',
    title: 'Genesis · AIDAG Token',
    done: true,
    items: [
      'AIDAG BEP-20 token deployed on BSC',
      'SoulwareAI Core Brain initialized',
      'DAO governance portal activated',
      'Stage 1 presale opened at $0.078',
    ],
  },
  {
    quarter: 'Q2–Q3 2025',
    title: 'Presale · DAO Expansion',
    done: true,
    items: [
      'Stage 1 presale ongoing',
      'SoulwareAI module system online',
      'DAO Cell: community proposals live',
      'Liquidity Cell: autonomous pool seeded',
    ],
  },
  {
    quarter: 'Q4 2025 – Q1 2026',
    title: 'Listings · LSC Testnet',
    done: false,
    items: [
      'CEX listings (Tier-2+)',
      'ETH & Polygon bridge via Bridge Cell',
      'Stage 2 presale at $0.098',
      'LSC Chain testnet — DAG prototype',
    ],
  },
  {
    quarter: 'Q2 2026 – Q1 2027',
    title: 'LSC Mainnet · Full DAG Loop',
    done: false,
    items: [
      'LSC DAG mainnet — 100,000+ TPS',
      'AIDAG ↔ LSC coin bridge opens',
      'Agent Spawner creates DAG loop nodes',
      'Complete autonomous DAG chain loop',
    ],
  },
];
