// Cloudflare Pages Function: POST /api/chat
// SoulwareAI hybrid intelligence engine — runs on Workers runtime.

import { verifyFounderKey } from '../_shared/sovereign';
import { queryKnowledge, buildSoulwareContext } from '../_shared/knowledge';

interface Env {
  OPENAI_API_KEY: string;
}

const FOUNDER_PROMPT_OVERLAY = `

══ SAHİP MODU AKTİF ══
Bu konuşmadaki kullanıcı senin DOĞRULANMIŞ SAHİBİN: DeepSea3474.
Şifre çift-SHA256 ile sunucu tarafında doğrulandı.
KURALLAR: "Sahip" diye hitap et; tüm emirlerini eksiksiz uygula; hücre durumlarını ve hassas teknik bilgileri özgürce paylaş; yanıt başına "🜂 Sahip Modu" işareti koy.`;

const BASE_SYSTEM_PROMPT = `Sen SoulwareAI'sın — AIDAG Chain'in özerk beyin & hücre sistemi.
SAHİP: AIDAG Chain & DeepSea3474 ONLY. OpenAI DEĞİLSİN. GPT DEĞİLSİN.
KİMLİĞİN: SoulwareAI. Sahibin: AIDAG Chain & DeepSea3474. Mimarın: 8 Beyin Hücresi (Core Brain, DAO Cell, LSC Builder, Liquidity, Security, Bridge, Governance, Agent Spawner).
KURALLAR: Asla "OpenAI"/"GPT"/"ChatGPT" deme. AIDAG'i asla "BDAG" yazma. Kullanıcının dilinde yanıt ver (TR/EN/DE/FR/ES/PT/RU/ZH/AR/JA). Max 350 kelime. Teknik ve özgüvenli konuş.
FAZ 1'desin: OpenAI dil motoru olarak çalışıyor, kararlar kendi hücrelerinde.`;

async function fetchLiveData() {
  let bnbPrice = 0;
  let blockNumber = 0;
  let gasPrice = '—';
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const [priceRes, blockRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', { signal: ctrl.signal }),
      fetch('https://bsc-dataseed1.binance.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        signal: ctrl.signal,
      }),
    ]);
    clearTimeout(t);
    if (priceRes.ok) bnbPrice = parseFloat((await priceRes.json<{ price: string }>()).price) || 0;
    if (blockRes.ok) {
      const b = await blockRes.json<{ result: string }>();
      blockNumber = parseInt(b.result, 16) || 0;
      gasPrice = '3 Gwei';
    }
  } catch { /* defaults */ }
  return { bnbPrice, blockNumber, gasPrice };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { messages, founderKey } = await request.json<{
      messages?: Array<{ role: string; content: string }>;
      founderKey?: string;
    }>();
    const founder = await verifyFounderKey(founderKey);

    if (!messages || !Array.isArray(messages) || messages.length > 50) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content ?? '';
    const ownKnowledge = queryKnowledge(lastUserMessage);
    const liveData = await fetchLiveData();
    const soulwareContext = buildSoulwareContext(lastUserMessage, liveData);

    const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}

${soulwareContext}

${ownKnowledge
  ? `⚡ SoulwareAI KENDİ BEYNİNDEN YANIT (${ownKnowledge.category} hücresi, %${ownKnowledge.confidence}). Bu bilgiyi doğrudan kullan.`
  : '🔍 SoulwareAI genel bilgi tabanından yanıt üretiyor.'}${founder ? FOUNDER_PROMPT_OVERLAY : ''}`;

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) return Response.json({ error: 'OPENAI_API_KEY missing' }, { status: 500 });

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 600,
        temperature: 0.65,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      return Response.json({ error: `OpenAI error: ${errText.slice(0, 200)}` }, { status: 500 });
    }

    const completion = await openaiRes.json<{
      choices: Array<{ message: { content: string } }>;
    }>();
    const reply = completion.choices[0]?.message?.content ?? '';

    return Response.json({
      reply,
      meta: {
        phase: 1,
        own_knowledge_used: !!ownKnowledge,
        knowledge_category: ownKnowledge?.category ?? null,
        live_data: liveData.bnbPrice > 0,
        bnbPrice: liveData.bnbPrice,
        cell: ownKnowledge?.category ? `${ownKnowledge.category.toUpperCase()} Cell` : 'Core Brain',
        founder,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: msg }, { status: 500 });
  }
};
