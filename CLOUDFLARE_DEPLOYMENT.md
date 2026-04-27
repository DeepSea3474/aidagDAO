# AIDAG Chain — Cloudflare + Replit Autoscale Deployment

This document describes the **actual current deployment flow** for
`aidag-chain.com`. An earlier revision of this file described a
Cloudflare Pages (static export) flow — that flow has been retired
because the project now relies on Node runtime API routes and a
persistent SoulwareAI orchestrator singleton
(`lib/server/orchestrator.ts`), which cannot run on static hosting.

## Current flow

```
User → Cloudflare DNS (aidag-chain.com, proxied)
     → Replit Autoscale deployment (Next.js server, port 5000)
```

Cloudflare provides:
- DNS resolution for the apex domain `aidag-chain.com`
- TLS termination (edge SSL)
- Edge cache for static assets (`/_next/static/*`, images under `/public`)

Replit Autoscale provides:
- Node runtime (`node 20`)
- `npm run build` → `npm start -- -H 0.0.0.0 -p 5000`
- SSR pages + dynamic API routes (`/api/chat`, `/api/soulware/*`,
  `/api/lsc/genesis`, `/api/presale/stats`)
- Persistent SoulwareAI orchestrator (real chain reads, real LSC DAG,
  real presale ingestion)

## Replit Autoscale configuration

See `.replit`:

```toml
[deployment]
deploymentTarget = "autoscale"
run = ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "5000"]
build = ["npm", "run", "build"]
```

*(The legacy `publicDir = "out"` key is still present in `.replit`
and is ignored by Autoscale; it is a leftover from the retired
Cloudflare Pages flow and can be removed in a future edit when
`.replit` is next updated.)*

## Environment variables

### Public (set via `.replit` `userenv.shared`)
All `NEXT_PUBLIC_*` values (RPC, contracts, wallets, presale pricing,
WalletConnect project id, site URL, social links).

### Server-only secrets
- `AI_INTEGRATIONS_OPENAI_API_KEY` — provided by the Replit OpenAI
  integration (preferred by `/api/chat`).
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — provided by the Replit OpenAI
  integration.
- `OPENAI_API_KEY` — legacy fallback, optional.
- `FOUNDER_SECRET_HASH` — founder auth secret (double-SHA256 compared
  in `app/api/chat/route.ts::isFounderKey`).
- `SOULWARE_DAO_PRIVATE_KEY` — DAO wallet signer for on-chain
  broadcasts (only consumed when `SOULWARE_AUTONOMY_MODE=execute`
  and `SOULWARE_DRY_RUN=false`).

## Cloudflare DNS settings

- `aidag-chain.com` / `www.aidag-chain.com` → CNAME to the Replit
  Autoscale deployment URL, proxied (orange cloud) through Cloudflare.
- SSL mode: Full (strict) — Cloudflare ↔ Replit both speak TLS.
- Cache rules: default Cloudflare caching for static assets; the
  Next.js server sets appropriate `Cache-Control` headers on its own
  responses (API routes are dynamic and respond with `no-store`).

## Cache and SSR/SSG mix

Per `next build` output:

- Static (○): `/`, `/chat`, `/dao`, `/lsc`, `/presale`, `/soulware`,
  `/sovereign`, `/api/presale/stats`, `/_not-found`.
- Dynamic (ƒ): `/api/chat`, `/api/lsc/genesis`, `/api/soulware/*`.

All `/api/*` routes run on Node (not edge) — required by the
orchestrator singleton, ethers.js, and `crypto`.

## Legacy files — retained but unused

- `wrangler.toml` — only used when someone runs `wrangler pages
  deploy`. **Not part of the current flow.** Kept for reference; safe
  to delete when confirmed no team member still uses it.
- `functions/` — Cloudflare Pages Functions source. **Not built, not
  deployed** in the Autoscale flow. The equivalent logic lives in
  `app/api/chat/route.ts` and `app/api/soulware/*`.
- `_redirects` — empty; would only be honored by Cloudflare Pages.
- `.cfignore`, `.cloudflare_output_dir` — Pages artifacts, no effect
  under Autoscale.

## Deploying

1. Push changes to the Replit workspace.
2. Open the **Deploy** tab in Replit and click **Deploy** (or
   **Redeploy**). Autoscale picks up `[deployment]` from `.replit`.
3. Wait for the build to finish (~2m20s for a clean build).
4. Verify the new version at `https://aidag-chain.com` — the domain
   DNS is already pointed at the stable Autoscale endpoint, so no
   DNS change is required after a redeploy.

## Post-deploy smoke test (manual)

```
GET  https://aidag-chain.com/
GET  https://aidag-chain.com/presale
GET  https://aidag-chain.com/dao
GET  https://aidag-chain.com/soulware
GET  https://aidag-chain.com/lsc
GET  https://aidag-chain.com/api/soulware/status
GET  https://aidag-chain.com/api/lsc/genesis
GET  https://aidag-chain.com/api/presale/stats
POST https://aidag-chain.com/api/chat
     { "messages": [{ "role": "user", "content": "ping" }] }
```

All should return HTTP 200 with real JSON/HTML. If
`/api/soulware/status` shows `autonomyMode: observer` and
`dryRun: true`, that is the safe default.
