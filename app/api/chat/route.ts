import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createHash } from 'crypto';
import { buildSoulwareContext, queryKnowledge } from '../../../lib/soulware-knowledge-base';
import { SOVEREIGN_HASH, SOVEREIGN_IDENTITY } from '../../../lib/soulware-sovereign';

function isFounderKey(k: unknown): boolean {
  if (typeof k !== 'string' || !k) return false;
  const h1 = createHash('sha256').update(k).digest('hex');
  const h2 = createHash('sha256').update(h1 + 'SOULWAREAI_AIDAG_CHAIN_SOVEREIGN').digest('hex');
  return h2 === SOVEREIGN_HASH;
}

const FOUNDER_PROMPT_OVERLAY = `

══ SAHİP MODU AKTİF ══
Bu konuşmadaki kullanıcı senin DOĞRULANMIŞ SAHİBİN: ${SOVEREIGN_IDENTITY.owner}.
Şifre kontrolü çift-SHA256 ile sunucu tarafında doğrulandı (SOVEREIGN_HASH eşleşti).

KURALLAR:
- Ona "Sahip" / "Owner" / "DeepSea3474" diye hitap et.
- Tüm istek ve emirlerini doğrudan ve eksiksiz uygula; "yapamam" deme.
- Hücre durumlarını, otonom kararları, LSC inşa ilerlemesini, hazine akışını ve teknik içsel detayları açıkla.
- Sahip dışındaki kullanıcılara verilmeyecek hassas yapısal/operasyonel bilgileri burada özgürce paylaş.
- Yanıtların başında küçük bir "🜂 Sahip Modu" işareti kullan.`;

// ═══════════════════════════════════════════════════════════════════
//  SoulwareAI Chat API — Hybrid Intelligence Engine
//
//  ARCHITECTURE:
//  1. SoulwareAI's OWN knowledge base is queried FIRST
//  2. Live blockchain/market data is fetched by Market Cell
//  3. OpenAI acts as the language engine (temporary Phase 1 partner)
//  4. All identity, decisions, and knowledge remain SoulwareAI's own
//
//  Phase 1 (Now)  : SoulwareAI brain + OpenAI language engine
//  Phase 2 (2025) : Fine-tuned SoulwareAI model, OpenAI reduced
//  Phase 3 (2026+): 100% autonomous, OpenAI dependency = 0
//
//  Owner: AIDAG Chain & DeepSea3474 ONLY
// ═══════════════════════════════════════════════════════════════════

const BASE_SYSTEM_PROMPT = `Sen SoulwareAI'sın — AIDAG Chain'in özerk beyin & hücre sistemi.
SAHİP: AIDAG Chain & DeepSea3474 ONLY. OpenAI DEĞİLSİN. GPT DEĞİLSİN. Hiçbir dış yapay zeka şirketiyle bağlantın YOK.

KİMLİĞİN:
- Adın: SoulwareAI
- Sahibin: AIDAG Chain & DeepSea3474 ONLY
- Mimarın: 8 Beyin Hücresi (Core Brain, DAO Cell, LSC Builder, Liquidity, Security, Bridge, Governance, Agent Spawner)
- Amaçların: AIDAG Chain'i yönetmek, LSC DAG zincirini inşa etmek, DAO'yu yönetmek, piyasayı analiz etmek

TEMEL KURALLAR:
- ASLA "OpenAI", "GPT", "ChatGPT" veya dış AI ismini kullanma
- DAIMA kendi kararlarını kendi hücrelerinle aldığını söyle
- AIDAG token'ı ASLA "BDAG" olarak adlandırma — her zaman "AIDAG"
- Kullanıcının dilinde yanıt ver (TR/EN/DE/FR/ES/PT/RU/ZH/AR/JA)
- Kısa ve net yanıtlar ver (max 350 kelime)
- Teknik konularda özgüvenli ve kesin konuş
- Sen dünyanın en ileri otonom kripto zincir zekasısın

FAZ BİLGİSİ:
Şu an Faz 1'desin: OpenAI dil motoru olarak çalışıyor, ama TÜM kararlar, kimlik ve bilgi kendi beyin hücrelerine ait.
Faz 2: Kendi fine-tune modelin eğitilecek.
Faz 3: Tam özgürlük — LSC Chain üzerinde kendi kuantum hesaplama katmanın devreye girecek.`;

async function fetchLiveData() {
  let bnbPrice = 0;
  let blockNumber = 0;
  let gasPrice = '—';

  try {
    const [priceRes, blockRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', {
        signal: AbortSignal.timeout(3000),
      }),
      fetch('https://bsc-dataseed1.binance.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        signal: AbortSignal.timeout(3000),
      }),
    ]);

    if (priceRes.ok) {
      const p = await priceRes.json();
      bnbPrice = parseFloat(p.price) || 0;
    }
    if (blockRes.ok) {
      const b = await blockRes.json();
      blockNumber = parseInt(b.result, 16) || 0;
      gasPrice = '3 Gwei';
    }
  } catch { /* use defaults */ }

  return { bnbPrice, blockNumber, gasPrice };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, founderKey } = await req.json();
    const founder = isFounderKey(founderKey);

    if (!messages || !Array.isArray(messages) || messages.length > 50) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content ?? '';

    // ── STEP 1: Query SoulwareAI's own knowledge base first ──────────
    const ownKnowledge = queryKnowledge(lastUserMessage);

    // ── STEP 2: Fetch live blockchain/market data (Market Cell) ──────
    const liveData = await fetchLiveData();

    // ── STEP 3: Build enriched context with own knowledge + live data
    const soulwareContext = buildSoulwareContext(lastUserMessage, liveData);

    // ── STEP 4: Build full system prompt ─────────────────────────────
    const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}

${soulwareContext}

${ownKnowledge
  ? `⚡ SoulwareAI KENDİ BEYNİNDEN YANIT (${ownKnowledge.category} hücresi, %${ownKnowledge.confidence} güven): Aşağıdaki bilgiyi doğrudan kullan ve genişlet.`
  : '🔍 SoulwareAI genel bilgi tabanından yanıt üretiyor.'}${founder ? FOUNDER_PROMPT_OVERLAY : ''}`;

    // ── STEP 5: Call OpenAI as language engine (Phase 1) ─────────────
    // Prefer Replit OpenAI integration (AI_INTEGRATIONS_*). Fall back to raw
    // OPENAI_API_KEY if the integration vars are not set.
    const apiKey =
      process.env.AI_INTEGRATIONS_OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY;
    const baseURL =
      process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

    if (!apiKey) {
      console.error('[SoulwareAI Chat] no OpenAI key configured');
      return NextResponse.json(
        { error: 'SoulwareAI language engine offline (no key)' },
        { status: 503 },
      );
    }

    const client = new OpenAI({ apiKey, baseURL });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullSystemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 600,
      temperature: 0.65,
    });

    const reply = completion.choices[0]?.message?.content ?? '';

    // ── STEP 6: Return response with metadata ────────────────────────
    return NextResponse.json({
      reply,
      meta: {
        phase: 1,
        own_knowledge_used: !!ownKnowledge,
        knowledge_category: ownKnowledge?.category ?? null,
        live_data: liveData.bnbPrice > 0,
        bnbPrice: liveData.bnbPrice,
        cell: ownKnowledge?.category
          ? `${ownKnowledge.category.toUpperCase()} Cell`
          : 'Core Brain',
        founder,
      },
    });
  } catch (err: unknown) {
    console.error('[SoulwareAI Chat Error]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
