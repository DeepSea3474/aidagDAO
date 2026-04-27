# AIDAG Chain — Pre-Launch Audit & Post-Build Report

_Date: 2026-04-21. Runtime: Node 20.20, Next.js 14.2.35, Replit Autoscale.
Audit scope: packages, build, Cloudflare+Autoscale config, production
smoke test, secrets._

## 1. Build and type health — PASS

- `npm install` clean, 794 packages, `npm ls --depth=0` shows expected
  tree.
- `rm -rf .next && npm run build` → **PASS** in ~2m17s.
- TypeScript `tsc --noEmit` → **PASS** (no errors).
- Static pages: 7 prerendered (`/`, `/chat`, `/dao`, `/lsc`,
  `/presale`, `/soulware`, `/sovereign`) + `_not-found` + static
  `/api/presale/stats`.
- Dynamic routes: `/api/chat`, `/api/lsc/genesis`,
  `/api/soulware/{status,command,verify,queue/[id]}` — all server-
  rendered on demand (Node runtime, correct for SSR + ethers + crypto).
- Largest first-load bundle: `/` at 154 kB First Load JS (23.6 kB route-
  specific). No abnormal chunks.
- Shared chunks: 88.9 kB total (normal for Next 14 + React 18 +
  ethers 6).

## 2. Package audit — MIXED, 4 moderate, 0 critical after fix

- **Next.js bumped 14.1.0 → 14.2.35** (patch-level, stays in 14.x) to
  close 18 advisories that affected 14.1.0. No API surface change.
- Remaining `npm audit` findings (all inside the `openai` SDK's
  optional `@coinbase/cdp-sdk` tree which the app does not actually
  import):
  - `axios` moderate (SSRF / header injection)
  - `follow-redirects` moderate
  - The only remaining "high" would require `--force`-upgrading
    `next` to 16, which is out of scope for this audit task.
- Bumps **not** applied (patch-only nits, no advisories):
  `@tailwindcss/postcss 4.2.2→4.2.4`, `postcss 8.5.8→8.5.10`,
  `autoprefixer 10.4.27→10.5.0`, `i18next 26.0.4→26.0.6`,
  `react-i18next 17.0.2→17.0.4`, `typescript 6.0.2→6.0.3`,
  `tailwindcss 4.2.2→4.2.4`. Safe to bump in a follow-up.
- No unused direct dependencies detected.

## 3. Cloudflare + Replit Autoscale alignment — PASS

- Deployment target (`.replit` `[deployment]`): `autoscale`, `build =
  npm run build`, `run = npm start -H 0.0.0.0 -p 5000`. Correct for
  SSR Next.
- `CLOUDFLARE_DEPLOYMENT.md` rewritten to reflect the current
  **DNS-only** Cloudflare role (the old doc still described a retired
  Cloudflare Pages static-export flow).
- `wrangler.toml` annotated as LEGACY (safe to delete once no one
  still runs `wrangler pages deploy`).
- `functions/` directory is Pages-Functions-only and is not built by
  `next build`; does not impact Autoscale deploys.
- `.replit` `[deployment]` still contains `publicDir = "out"` — the
  agent could not edit `.replit` directly. **Autoscale ignores
  `publicDir`**, so this is harmless but should be removed manually
  on the next `.replit` edit.

## 4. Production smoke test (local `npm start`) — PASS

All tested at `http://localhost:5000` against the real prod build:

| Endpoint                        | Status | Notes                                         |
| ------------------------------- | ------ | --------------------------------------------- |
| `GET /`                         | 200    | Hero, ticker (live BNB $632, block 93.8M)     |
| `GET /presale`                  | 200    |                                               |
| `GET /dao`                      | 200    |                                               |
| `GET /soulware`                 | 200    |                                               |
| `GET /lsc`                      | 200    |                                               |
| `GET /api/soulware/status`      | 200    | Live chain, treasury, presale, LSC, RPC health |
| `GET /api/lsc/genesis`          | 200    | Real phase/day/module progress                |
| `GET /api/presale/stats`        | 200    | Real BNB inflow, live bnbPrice                |
| `POST /api/chat`                | 200    | Real OpenAI reply (gpt-4o-mini)               |

- Orchestrator boot confirmed: 91 ticks in ~12 min, RPC failovers clean
  across `publicnode`, `1rpc`, `binance`, `pancake` endpoints, 0
  failures observed during the window.
- Website probe self-check reports `site canlı` (200) against
  `aidag-chain.com`.
- Mobile console: the only errors are the long-standing
  Binance-API-CORS warnings from a redundant client-side fetch in the
  ticker; the ticker already falls back to server-computed BNB
  ($632.48 visible on screen), so it is cosmetic log noise, not a
  regression.

## 5. Bug fixes applied during the audit

Two real production bugs were found and fixed:

- **`lib/soulware-knowledge-base.ts`** started with `'use client';`,
  which made Next.js turn `queryKnowledge` / `buildSoulwareContext`
  into RSC client-reference proxies. The result was that every call
  to `/api/chat` threw `TypeError: (0, nD.xP) is not a function` in
  production before the OpenAI call was even reached. The directive
  was removed — these functions are pure data/library helpers and
  must run on the server.
- **`app/api/chat/route.ts`** hardcoded `process.env.OPENAI_API_KEY`.
  In this environment that env var points at a revoked key (returns
  HTTP 401 from OpenAI). The route now prefers the Replit OpenAI
  integration (`AI_INTEGRATIONS_OPENAI_API_KEY` +
  `AI_INTEGRATIONS_OPENAI_BASE_URL`) and falls back to
  `OPENAI_API_KEY`. Model is now `gpt-4o-mini` (matches what
  `replit.md` already documented).

Both fixes are verified end-to-end — `POST /api/chat` now returns a
real Turkish-language reply from SoulwareAI.

## 6. Secrets audit — ⚠ BLOCKER for a pre-sale launch

**No NEXT_PUBLIC_ leakage of sensitive values** — all `NEXT_PUBLIC_*`
entries are public by design (RPC URLs, contract addresses, wallet
addresses, WalletConnect project id, social links).

**However**, two sensitive values live in `.replit`'s
`[userenv.shared]` block and are therefore **committed to the repo in
plaintext**:

| Key                         | Current value             | Risk |
| --------------------------- | ------------------------- | ---- |
| `FOUNDER_SECRET_HASH`       | `Baba1kubra22.`           | The "hash" is literally the raw password. Anyone with repo read can hit `/api/soulware/queue/[id]` and approve autonomous proposals. |
| `SOULWARE_DAO_PRIVATE_KEY`  | `0xabc5636110793e48f84ef2eacbbd42908de07771c39c85fd6612cbc5b9567b4e` | Real BSC private key for `0x65498beaA3e8506Ef2551a20b86A2a0cF0b85A7C`. Whoever has the repo can drain whatever the DAO wallet holds and sign as SoulwareAI. |

Both values were already in the repo before this task; the audit did
**not** rotate them because doing so is destructive (it changes the
founder authentication secret and requires moving funds out of the
on-chain DAO wallet). They must be rotated by the founder before the
presale is opened to the public:

1. Generate a fresh DAO wallet, transfer any balance of
   `0x65498beaA…85A7C` to it, update
   `NEXT_PUBLIC_SOULWARE_WALLET` accordingly.
2. Pick a new strong `FOUNDER_SECRET_HASH` (ideally the actual SHA-256
   hash of a secret, not the secret itself).
3. Remove both keys from `[userenv.shared]` in `.replit` and store
   them as Replit **Secrets** (Secrets tab, not userenv) so they are
   not persisted to the repo.

OpenAI key is already a secret. Twitter API credentials are already
secrets. GitHub PAT is already a secret. Session secret is already a
secret. Postgres credentials are already secrets.

## 7. CORS / rate-limit

Out-of-scope minimums:

- API routes do not currently emit CORS headers. Because the frontend
  is same-origin (`aidag-chain.com`) to the API, no CORS is required
  for normal use — browsers that fetch `/api/*` from the site will
  succeed without a CORS header.
- No rate limiting in front of `/api/chat`. With a live OpenAI key,
  unmitigated abuse = real dollar cost. Recommend a follow-up task to
  add an IP-or-wallet-based throttle (e.g. 5 req/min) before opening
  the presale to the public.

## 8. What remains before `aidag-chain.com` goes live

The agent **did not** trigger the actual Autoscale redeploy — in this
environment the deploy is initiated by the founder from the Replit
"Deploy" panel. Steps for the founder:

1. Rotate the two leaked secrets above and move them to Replit
   Secrets (hard blocker — do this first).
2. Open the **Deploy** tab, pick the Autoscale deployment, click
   **Redeploy**.
3. Wait for the build log to show `✓ Ready` and confirm no error
   output.
4. Re-run the smoke-test checklist in `CLOUDFLARE_DEPLOYMENT.md`
   **against `https://aidag-chain.com`** (not localhost) and confirm
   each endpoint responds with real data.
5. Only then announce the presale.

## 9. Files touched by this audit

- `package.json` — bumped next 14.1.0 → 14.2.35.
- `package-lock.json` — regenerated by `npm install`.
- `lib/soulware-knowledge-base.ts` — removed incorrect `'use client'`.
- `app/api/chat/route.ts` — integration-first OpenAI client, 503
  fallback if no key, model set to `gpt-4o-mini`.
- `CLOUDFLARE_DEPLOYMENT.md` — rewritten for the actual Autoscale
  flow.
- `wrangler.toml` — annotated as legacy.
- `replit.md` — corrected project structure and API list, added
  reference to the Replit OpenAI integration.
- `POST_DEPLOY_CHECK.md` — this file.
