# AIDAG Chain - Fully Autonomous AI Blockchain

## Overview
A crypto first - Blockchain project fully autonomously managed by SoulwareAI.

**Core Features:**
- Fully Autonomous: No founder or human intervention
- Quantum Security: Next-gen encryption
- Multi-Chain: BSC + Ethereum compatible
- DAO Governance: AI-powered community decisions

## Technologies
- Next.js 14 (Server-side rendering - Replit Autoscale deployment)
- React 18
- Tailwind CSS 4
- ethers.js 6 (Blockchain interactions)
- OpenAI GPT-4o-mini (SoulwareAI chat intelligence)
- i18next (Multi-language - EN/TR)
- CoinGecko + CryptoCompare APIs (Live market data)

## Project Structure
```
/app                 - Next.js App Router pages (index, presale, dao, soulware, lsc, sovereign, chat)
/app/api             - Dynamic server routes (chat, lsc/genesis, presale/stats)
/app/api/soulware    - Autonomous engine routes (status, command, verify, queue/[id])
/components          - React components (Header, WalletButton, CryptoTicker, GovernanceSection, ContractAddresses, Partners, SoulwareLivePanel)
/lib                 - Shared libs (blockchain, useChainData, soulware-knowledge-base, soulware-sovereign, lsc-genesis-engine)
/lib/server          - Server-only code (orchestrator, dag-iterator, chain-reader)
/public              - Static files (logo.svg, logo.png, soulwareai.jpeg)
/styles              - CSS files (globals.css, components.css)
/functions, wrangler.toml - LEGACY Cloudflare Pages artifacts, unused (see CLOUDFLARE_DEPLOYMENT.md)
```

## Running
```bash
# Development (port 5000)
npm run dev -- -H 0.0.0.0 -p 5000

# Production build
npm run build && npm start
```

## SoulwareAI Live Autonomous Engine (Task #3)
A persistent server-side singleton lives in `lib/server/orchestrator.ts` and runs
independently of any browser session. It boots on the first request to any API
route that imports it (e.g. `/api/soulware/status`) and keeps running for the
lifetime of the Node process. **Strict no-fabrication rule** — every metric and
decision is derived from one of the real sources below; if a feed is offline,
the corresponding signal stays `false`/`null` with a clear note.

### Real data sources
- **Chain reads** (8s tick): `eth_blockNumber`, `eth_gasPrice`,
  `eth_getBalance` for DAO/founder/operation wallets, across 6 BSC RPCs with
  failover (publicnode + 1rpc first because they are the only ones accepting
  `eth_getLogs`; binance dataseeds are kept as fallback for block/balance
  reads).
- **BNB price**: real-time from Binance / CoinGecko / CryptoCompare.
- **AIDAG token Transfer events** (`lib/server/orchestrator.ts ›
  ingestTransferLogs`): incremental `eth_getLogs` polling — 200-block chunks,
  up to 5 chunks/tick, `lastIngestBlock` cursor persisted in snapshot. Real
  recipient addresses build a holder set (LRU-bounded). Real founder→buyer
  outflows compute presale `tokensSoldOnChain`.
- **Real LSC DAG simulation** (`lib/server/dag-iterator.ts`): genuine DAG
  algorithm — tip selection by cumulative weight, vertex linking, weight
  propagation, finality at weight ≥ 3 — measuring real TPS over actual
  elapsed ms (no synthesized formula). Bound to LSC genesis phase from
  `lib/lsc-genesis-engine.ts`.
- **Website probe**: real `HEAD https://aidag-chain.com` every ~96s.

### Whitelisted execution pipeline
- `EXECUTE_WHITELIST` lists allowed action types (`PRESALE_STAGE_TRANSITION`,
  `TREASURY_REBALANCE`, `DEX_PAIR_CREATE`, `CEX_APPLY`, `GAS_BATCH_EXECUTE`).
  Anything outside is rejected with `WHITELIST_VIOLATION` before reaching the
  queue.
- **Autonomy modes** (`SOULWARE_AUTONOMY_MODE` env):
  - `observer` (default) — log only.
  - `propose` — queue items for founder approval.
  - `execute` — same queue path; broadcast still requires founder approval +
    `SOULWARE_DRY_RUN=false` + `SOULWARE_DAO_PRIVATE_KEY` signer. **No tx
    hashes are ever fabricated** — when prerequisites are missing the action
    is marked `approved (governance-only — broadcast disabled: ...)`.
- **Approval API**: `POST /api/soulware/queue/[id]` with founder secret hash
  (`{ key, decision: 'approve' | 'reject', note? }`).

### Endpoints + UI
- `GET /api/soulware/status` — full state (chain, treasury, token, presale,
  cex, dex, lsc, decisions, queue, executedHistory, whitelist, websiteProbe,
  evolutionScore).
- `GET /api/lsc/genesis` — LSC genesis state + recent real DAG iterations.
- `POST /api/soulware/queue/[id]` — founder-secret-protected approve/reject.
- `components/SoulwareLivePanel.tsx` polls every 5s — mounted on `/` (after
  the LSC section) and at the top of `/soulware`.
- `app/lsc/page.tsx` is wired to `/api/soulware/status` (no random TPS, no
  random dev logs — every stat and log entry is real).

### Snapshot + deployment notes
- Snapshot at `.data/soulware-state.json` (every 5 ticks + on stop). Holders
  set persisted as a list; restored on boot.
- `next.config.js` no longer uses `output: 'export'` — dynamic API routes
  require Node runtime. Deployment compatibility is tracked by the
  pre-existing follow-up "Cloudflare uyum denetimi + canlıya alma".

## Deployment
- **Method**: Replit Autoscale deployment (no GitHub)
- **Domain**: aidag-chain.com via Cloudflare DNS
- **Build**: `npm run build` (server-side, not static export)
- **Start**: `npm start` (Next.js server for API routes)

## Environment Variables
Configured in `.env.local`:
- `NEXT_PUBLIC_BSC_RPC` - BSC RPC URL
- `NEXT_PUBLIC_TOKEN_CONTRACT` - Token contract address (0xe6B06f7C63F6AC84729007ae8910010F6E721041)
- `NEXT_PUBLIC_PRESALE_CONTRACT` - Presale contract address
- `NEXT_PUBLIC_DAO_WALLET` - DAO wallet address
- `NEXT_PUBLIC_FOUNDER_WALLET` - Founder wallet address
- `NEXT_PUBLIC_NETWORK_MODE` - testnet/mainnet
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API (via Replit integration)
- `FOUNDER_SECRET_HASH` - Founder authentication secret

## Tokenomics
| Category | Amount | Status |
|----------|--------|--------|
| Max Supply | 21,000,000 AIDAG | Fixed |
| Founder Tokens | 3,001,000 AIDAG | 1 Year Locked |
| DAO + SoulwareAI | 17,999,000 AIDAG | Autonomous |
| Revenue Split | 60% Operational, 40% DAO/Liquidity | - |

## Key Components
- **CryptoTicker**: Live scrolling ticker with top 10 crypto logos, real-time prices, green/red triangle indicators, pulsing "LIVE" badge
- **GovernanceSection**: DAO governance with on-chain voting power (1 AIDAG = 1 vote), proposal types, 5-step process visual, all professional SVG icons
- **ContractAddresses**: Contract display with copy button, BscScan links, professional SVG icons
- **Partners**: Blockchain partners and social links with professional SVG icons
- **blockchain.js**: Real BNB price fetching from Binance/CoinGecko/CryptoCompare with fallback
- **useChainData.js**: React hook for real-time blockchain data (30s refresh)

## API Infrastructure (current routes under `app/api/`)
- **`/api/chat`** (dynamic): SoulwareAI chat — uses Replit OpenAI integration
  (`AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL`) with
  `OPENAI_API_KEY` as a fallback. Model: `gpt-4o-mini`. Founder mode auth via
  double-SHA256 comparison against `SOVEREIGN_HASH`.
- **`/api/soulware/status`** (dynamic): Full orchestrator state — chain,
  treasury, token, presale, cex, dex, lsc, decisions, queue, whitelist,
  websiteProbe, evolutionScore.
- **`/api/soulware/command`** (dynamic): Founder-authenticated command channel.
- **`/api/soulware/verify`** (dynamic): Founder-key verification endpoint.
- **`/api/soulware/queue/[id]`** (dynamic): Approve/reject autonomous proposals.
- **`/api/lsc/genesis`** (dynamic): LSC genesis state + real DAG iterations.
- **`/api/presale/stats`** (static): Presale stats snapshot.
(Legacy routes `/api/chain-data`, `/api/crypto-prices`,
`/api/soulware/{autonomous,governance,innovations,develop}` from the pre-App-
Router codebase no longer exist — the same data now comes from
`/api/soulware/status` and the client-side live ticker.)

## SoulwareAI Autonomous Engine
- **Proposal Engine**: Creates, evaluates, and executes governance proposals
- **DEX Management**: PancakeSwap monitoring, liquidity pair preparation
- **CEX Applications**: Gate.io, MEXC, KuCoin requirement tracking and autonomous submission
- **Self-Designed Innovations**: QSaaS ($10M+), AI Shield ($5M+), AI Auditor ($3M+), DAG Payment Gateway ($20M+), QRNG ($2M+), AI Oracle ($8M+)
- **Chain Evolution**: BSC Token -> Multi-chain Bridge -> DEX/CEX Listings -> Staking/DeFi -> Own DAG Chain (100K+ TPS)

## Build Notes
- `.babelrc` file is required (Next.js references it for custom Babel config)
- Do NOT delete `.babelrc` - it will crash the dev server
- Always clear `.next` cache after major config changes

## Pending: Contract Deployment (Feb 25, 2026)
- New AIDAG V2 contract ready in `contracts/AIDAG.sol` (84 functions, 19 events)
- Compiled and tested, awaiting BNB for BSC Mainnet deploy
- Deployer: Founder wallet (`0xFf01...`) - needs 0.03 BNB
- After deploy: owner will be transferred to SoulwareAI wallet (`0x6549...`)
- Deploy script: `contracts/deploy.js`
- Compiled ABI: `contracts/AIDAG_ABI.json`

## Recent Changes
- Feb 23, 2026: Full autonomous engine and chat intelligence upgrade
  - Enhanced chat API with complete SoulwareAI knowledge base (DEX/CEX/innovations/chain evolution)
  - Governance API with on-chain voting power, active proposals, execution log
  - Removed all emoji icons - replaced with professional neon SVG icons throughout
  - All UI text converted to English
  - Founder mode with detailed system status reporting
  - Token response increased to 800 for richer answers
- Feb 23, 2026: Smart Contract page, CryptoTicker enhancements
- Previous: Real blockchain data integration, SoulwareAI API infrastructure

## User Preferences
- Full autonomy emphasis: No founder/human intervention
- Quantum security: Facilitator and protector in crypto world
- Replit Autoscale deployment (no GitHub)
- English UI with Turkish support
- Zero emojis - professional SVG icons only
- Binance/CoinMarketCap-level professionalism required
- AIDAG will be added to ticker at position 0 when listed
