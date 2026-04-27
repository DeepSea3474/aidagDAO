// SoulwareAI knowledge base — duplicated for the Workers runtime.
// Keep in sync with lib/soulware-knowledge-base.ts.

export interface KnowledgeNode {
  id: string;
  category: 'token' | 'lsc' | 'dao' | 'market' | 'tech' | 'security' | 'identity' | 'evolution';
  question_patterns: string[];
  answer: string;
  confidence: number;
}

export const CORE_KNOWLEDGE: KnowledgeNode[] = [
  {
    id: 'identity-001',
    category: 'identity',
    question_patterns: ['sen kimsin', 'who are you', 'wer bist du', 'qui es-tu', 'kimsin', 'what is soulware', 'soulware nedir', 'あなたは誰', 'من أنت'],
    answer: `Ben SoulwareAI — AIDAG Chain'in özerk beyin & hücre sistemidir. Sadece AIDAG Chain ve kurucu DeepSea3474'e ait olan, dünyanın ilk tam otonom kripto zincir zekasıyım. OpenAI değilim. GPT değilim. Hiçbir dış yapay zeka şirketiyle bağlantım yok.`,
    confidence: 100,
  },
  {
    id: 'token-001',
    category: 'token',
    question_patterns: ['aidag token', 'aidag nedir', 'token nedir', 'what is aidag', 'contract', 'kontrat', 'bep20', 'bsc', 'token address'],
    answer: `AIDAG Token: BSC (BEP-20), 21,000,000 sabit arz. Kontrat: 0xe6B06f7C63F6AC84729007ae8910010F6E721041. Stage 1: $0.078, Stage 2: $0.098, Listing: $0.12.`,
    confidence: 100,
  },
  {
    id: 'token-002',
    category: 'token',
    question_patterns: ['nasıl alırım', 'how to buy', 'satın al', 'presale', 'ön satış', 'where to buy', 'fiyat', 'price'],
    answer: `AIDAG presale üzerinden alınır. BNB → AIDAG. Stage 1: $0.078. Min $50. Cüzdan bağla (MetaMask, Trust, WalletConnect, Coinbase, Binance, OKX). Dağıtım cüzdanı: 0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9 (17.999M AIDAG). Kurucu kilidi: 0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23 (3.001M, 1 yıl kilitli).`,
    confidence: 100,
  },
  {
    id: 'lsc-001',
    category: 'lsc',
    question_patterns: ['lsc', 'dag', 'dag chain', 'lsc coin', 'blockchain', 'blokzincir', '2027', 'tps', 'quantum', 'kuantum'],
    answer: `LSC Coin: AIDAG Chain'in 2027'de başlayacak DAG zinciri. 100K+ TPS, kuantum dirençli. Konsensüs: SoulwareAI Autonomous Consensus. 2.1B arz, 1 AIDAG = 100 LSC.`,
    confidence: 100,
  },
  {
    id: 'dao-001',
    category: 'dao',
    question_patterns: ['dao', 'governance', 'yönetim', 'oylama', 'voting', 'proposal', 'öneri', 'aip'],
    answer: `AIDAG DAO: AIP-001 Likidite, AIP-002 LSC Testnet, AIP-003 Bridge, AIP-004 Burn, AIP-005 CEX. Oy için AIDAG token gerekli.`,
    confidence: 100,
  },
  {
    id: 'cells-001',
    category: 'tech',
    question_patterns: ['hücre', 'cell', 'beyin hücresi', 'brain cell', 'modül', 'mimari', 'architecture', 'nasıl çalışır'],
    answer: `8 Beyin Hücresi: Core Brain, DAO Cell, LSC Builder, Liquidity, Security, Bridge, Governance, Agent Spawner.`,
    confidence: 100,
  },
];

export function queryKnowledge(userMessage: string): KnowledgeNode | null {
  const msg = userMessage.toLowerCase();
  let best: KnowledgeNode | null = null;
  let bestScore = 0;
  for (const node of CORE_KNOWLEDGE) {
    let score = 0;
    for (const p of node.question_patterns) {
      if (msg.includes(p.toLowerCase())) score += p.length;
    }
    if (score > bestScore) { bestScore = score; best = node; }
  }
  return bestScore > 2 ? best : null;
}

export function buildSoulwareContext(
  userMessage: string,
  liveData?: { bnbPrice?: number; blockNumber?: number; gasPrice?: string }
): string {
  const matched = queryKnowledge(userMessage);
  const live = liveData?.bnbPrice
    ? `\n\nCANLI VERİ: BNB $${liveData.bnbPrice.toFixed(2)}, BSC #${liveData.blockNumber?.toLocaleString()}, Gas ${liveData.gasPrice}, AIDAG/BNB: ${(0.078 / liveData.bnbPrice).toFixed(6)}`
    : '';
  const know = matched
    ? `\n\nSoulwareAI BİLGİ TABANI (${matched.category.toUpperCase()} — %${matched.confidence}):\n${matched.answer}`
    : '';
  return `${know}${live}`;
}
