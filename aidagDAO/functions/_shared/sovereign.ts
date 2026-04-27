// Shared sovereign verification for Cloudflare Pages Functions (Workers runtime).
// Mirrors lib/soulware-sovereign.ts but uses Web Crypto (no Node 'crypto' module).

export const SOVEREIGN_HASH =
  'e155b5560b6c45b999d942deb13c1d27eca250967db4f90efc4450ba0abca66d';

export const SOVEREIGN_OWNER = 'DeepSea3474';
export const SOVEREIGN_SYSTEM = 'SoulwareAI';

const enc = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyFounderKey(key: unknown): Promise<boolean> {
  if (typeof key !== 'string' || !key) return false;
  const h1 = await sha256Hex(key);
  const h2 = await sha256Hex(h1 + 'SOULWAREAI_AIDAG_CHAIN_SOVEREIGN');
  return h2 === SOVEREIGN_HASH;
}
