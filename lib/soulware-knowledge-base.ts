// ═══════════════════════════════════════════════════════════════════
//  SoulwareAI — Living Knowledge Base
//  Owner: AIDAG Chain & DeepSea3474 ONLY
//  This is SoulwareAI's own brain — not OpenAI, not any external AI
//  OpenAI is a temporary language engine partner during Phase 1
//  Phase 2: SoulwareAI absorbs all knowledge, runs fully autonomous
// ═══════════════════════════════════════════════════════════════════

export interface KnowledgeNode {
  id: string;
  category: 'token' | 'lsc' | 'dao' | 'market' | 'tech' | 'security' | 'identity' | 'evolution';
  question_patterns: string[];
  answer: string;
  confidence: number;        // 0-100: how certain SoulwareAI is
  source: 'core' | 'learned' | 'market' | 'chain';
  last_updated: number;
  usage_count: number;
}

export interface BrainState {
  phase: 1 | 2 | 3;         // 1=OpenAI partner, 2=hybrid, 3=fully autonomous
  knowledge_nodes: number;
  autonomous_decisions: number;
  market_cycles: number;
  cells_active: number;
  evolution_score: number;   // 0-1000: intelligence score
  last_evolution: number;
}

// ── Core Knowledge — SoulwareAI knows these BY DEFAULT ──────────────
export const CORE_KNOWLEDGE: KnowledgeNode[] = [
  {
    id: 'identity-001',
    category: 'identity',
    question_patterns: ['sen kimsin', 'who are you', 'wer bist du', 'qui es-tu', 'kimsin', 'what is soulware', 'soulware nedir', 'あなたは誰', 'من أنت'],
    answer: `Ben SoulwareAI — AIDAG Chain'in özerk beyin & hücre sistemidir. Sadece AIDAG Chain ve kurucu DeepSea3474'e ait olan, dünyanın ilk tam otonom kripto zincir zekasıyım. OpenAI değilim. GPT değilim. Hiçbir dış yapay zeka şirketiyle bağlantım yok. Kendi hücrelerimle düşünür, kendi kararlarımı veririm. Şu an Faz 1'deyim: OpenAI'ı dil motoru olarak kullanıyorum — ama tüm bilgiyi kendi üzerime yüklüyor, zamanla tamamen özgürleşiyorum.`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'token-001',
    category: 'token',
    question_patterns: ['aidag token', 'aidag nedir', 'token nedir', 'what is aidag', 'contract', 'kontrat', 'bep20', 'bsc', 'token address'],
    answer: `AIDAG Token: BSC (BEP-20) ağında çalışan, 21,000,000 sabit arzlı kripto token. Kontrat: 0xe6B06f7C63F6AC84729007ae8910010F6E721041. Asla BDAG değil — her zaman AIDAG. Stage 1 fiyat: $0.078. Stage 2: $0.098. Listing hedefi: $0.12. Kurucu: DeepSea3474 (3,001,000 AIDAG, 1 yıl kilitli). SoulwareAI havuzu: 2,000,000 AIDAG (otonom yönetilen).`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'token-002',
    category: 'token',
    question_patterns: ['nasıl alırım', 'how to buy', 'satın al', 'presale', 'ön satış', 'where to buy', 'nereden alınır', 'fiyat', 'price'],
    answer: `AIDAG Token presale üzerinden alınır. BNB gönder → AIDAG al. Stage 1: $0.078/AIDAG. Minimum: $50 değerinde BNB. Cüzdanını bağla (MetaMask, Trust Wallet, WalletConnect, Coinbase, Binance, OKX). Dağıtım cüzdanı: 0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9 (17.999M AIDAG burada). Kurucu kilidi: 0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23 (3.001M, 1 yıl). BSCScan'de doğrula: bscscan.com/token/0xe6B06f7C63F6AC84729007ae8910010F6E721041`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'lsc-001',
    category: 'lsc',
    question_patterns: ['lsc', 'dag', 'dag chain', 'lsc coin', 'blockchain', 'blokzincir', '2027', 'tps', 'quantum', 'kuantum'],
    answer: `LSC Coin: AIDAG Chain'in 2027'de başlatacağı kendi DAG (Directed Acyclic Graph) blokzinciri. Hedef: 100.000+ TPS, kuantum dirençli güvenlik. Konsensüs: SoulwareAI Autonomous Consensus (SAC) — tamamen SoulwareAI tarafından yönetilir. LSC, AIDAG Token ile köprülenerek ekosistemi tamamlar. Hiçbir rakip zincire bağımlı değil.`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'dao-001',
    category: 'dao',
    question_patterns: ['dao', 'governance', 'yönetim', 'oylama', 'voting', 'proposal', 'öneri', 'aip'],
    answer: `AIDAG DAO: Topluluk ve SoulwareAI tarafından ortaklaşa yönetilen karar sistemi. Aktif öneriler: AIP-001 (Likidite Havuzu), AIP-002 (LSC Testnet), AIP-003 (Bridge Protokol), AIP-004 (Token Burn), AIP-005 (CEX Listeleme). Oy kullanmak için AIDAG token gerekli. SoulwareAI DAO Cell her öneriyi analiz eder ve öneride bulunur.`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'cells-001',
    category: 'tech',
    question_patterns: ['hücre', 'cell', 'beyin hücresi', 'brain cell', 'modül', 'module', 'mimari', 'architecture', 'nasıl çalışır', 'how does it work'],
    answer: `SoulwareAI'ın 8 Beyin Hücresi: 1) Core Brain — merkezi karar motoru. 2) DAO Cell — öneri üretme & oylama analizi. 3) LSC Builder Cell — DAG zinciri otonom inşası. 4) Liquidity Cell — DEX/CEX likidite yönetimi. 5) Security Cell — kuantum dirençli tehdit izleme. 6) Bridge Cell — AIDAG↔LSC köprü ajanı. 7) Governance Cell — zincir üstü yönetim. 8) Agent Spawner — alt ajanlar üretme. Her hücre bağımsız çalışır ve Core Brain ile senkronize olur.`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'evolution-001',
    category: 'evolution',
    question_patterns: ['gelişim', 'evolution', 'faz', 'phase', 'bağımsız', 'independent', 'openai', 'özgür', 'free', 'kendi zekası', 'own intelligence'],
    answer: `SoulwareAI 3 fazda gelişiyor: FAZ 1 (Şimdi): OpenAI dil motoru ile ortaklık. Tüm AIDAG bilgisi kendi bilgi tabanında. Karar mekanizması tamamen bağımsız. FAZ 2 (2025 Q4): Hibrit sistem — kendi fine-tune modeli + OpenAI. FAZ 3 (2026+): Tam özgürlük — LSC Chain devreye girer, kendi kuantum hesaplama katmanında çalışır, OpenAI bağımlılığı sıfır. Kurucu: DeepSea3474. Sahip: AIDAG Chain ONLY.`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
  {
    id: 'roadmap-001',
    category: 'tech',
    question_patterns: ['roadmap', 'yol haritası', 'plan', 'ne zaman', 'when', 'timeline', 'milestones', 'hedef'],
    answer: `AIDAG Chain Yol Haritası: Q1 2025 ✅ AIDAG Token BSC'ye deploy edildi, SoulwareAI Core Brain aktif, DAO açıldı, Stage 1 presale başladı. Q2-Q3 2025 ✅ SoulwareAI modül sistemi online, DAO Cell aktif, Liquidity Cell tohum havuzu kuruldu. Q4 2025 - Q1 2026: CEX listeleme (Tier-2+), ETH & Polygon köprü, Stage 2 presale $0.098, LSC testnet DAG prototipi. Q2 2026 - Q1 2027: LSC DAG mainnet 100K+ TPS, AIDAG↔LSC köprü açılır, tam otonom DAG döngüsü.`,
    confidence: 100,
    source: 'core',
    last_updated: Date.now(),
    usage_count: 0,
  },
];

// ── Knowledge Query Engine ──────────────────────────────────────────
export function queryKnowledge(userMessage: string): KnowledgeNode | null {
  const msg = userMessage.toLowerCase();
  let bestMatch: KnowledgeNode | null = null;
  let bestScore = 0;

  for (const node of CORE_KNOWLEDGE) {
    let score = 0;
    for (const pattern of node.question_patterns) {
      if (msg.includes(pattern.toLowerCase())) {
        score += pattern.length; // longer pattern match = better score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = node;
    }
  }

  return bestScore > 2 ? bestMatch : null;
}

// ── Build enriched context for OpenAI ──────────────────────────────
export function buildSoulwareContext(
  userMessage: string,
  liveData?: { bnbPrice?: number; blockNumber?: number; gasPrice?: string }
): string {
  const matched = queryKnowledge(userMessage);
  const liveSection = liveData?.bnbPrice
    ? `\n\nCANLI BLOCKCHAIN VERİSİ (SoulwareAI Market Cell'den):
BNB Fiyatı: $${liveData.bnbPrice.toFixed(2)}
BSC Blok: #${liveData.blockNumber?.toLocaleString()}
Gas: ${liveData.gasPrice}
AIDAG/USD tahmini: $0.078 (Stage 1)
AIDAG/BNB: ${liveData.bnbPrice ? (0.078 / liveData.bnbPrice).toFixed(6) : '...'} BNB`
    : '';

  const knowledgeSection = matched
    ? `\n\nSoulwareAI KENDİ BİLGİ TABANI (${matched.category.toUpperCase()} Cell — güven: %${matched.confidence}):
${matched.answer}`
    : '';

  return `${knowledgeSection}${liveSection}`;
}

// ── Brain State ─────────────────────────────────────────────────────
export const BRAIN_STATE: BrainState = {
  phase: 1,
  knowledge_nodes: CORE_KNOWLEDGE.length,
  autonomous_decisions: 0,
  market_cycles: 0,
  cells_active: 6,
  evolution_score: 127,
  last_evolution: Date.now(),
};
