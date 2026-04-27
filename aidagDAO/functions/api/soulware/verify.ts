// Cloudflare Pages Function: POST /api/soulware/verify
// Verifies a sovereign key using double-SHA256 (Web Crypto, runs on Workers).

import { verifyFounderKey, SOVEREIGN_OWNER, SOVEREIGN_SYSTEM } from '../../_shared/sovereign';

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const { key } = await request.json<{ key?: string }>();
    const ok = await verifyFounderKey(key);
    if (!ok) {
      return Response.json(
        { ok: false, error: 'UNAUTHORIZED — Sahip anahtarı eşleşmedi.' },
        { status: 401 }
      );
    }
    return Response.json({
      ok: true,
      owner: SOVEREIGN_OWNER,
      system: SOVEREIGN_SYSTEM,
      grantedAt: Date.now(),
    });
  } catch {
    return Response.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 });
  }
};
