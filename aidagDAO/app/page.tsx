'use client';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import WalletButton from '../components/WalletButton';
import Navbar from '../components/Navbar';
import Icon from '../components/Icon';
import PresaleWidget from '../components/PresaleWidget';
import LiveEcosystem from '../components/LiveEcosystem';
import EcosystemCTA from '../components/EcosystemCTA';
import SoulwareLivePanel from '../components/SoulwareLivePanel';
import { useChainData } from '../lib/useChainData';
import { useLang } from '../lib/LanguageContext';
import {
  TOKEN_CONTRACT, BSCSCAN_TOKEN_URL, GITHUB_URL, TELEGRAM_URL, TWITTER_URL,
  PRESALE_STAGE1_PRICE, PRESALE_STAGE2_PRICE, LISTING_PRICE,
  MAX_SUPPLY, FOUNDER_COINS, DAO_COINS, TOKENOMICS, ROADMAP, SOULWARE_MODULES,
} from '../lib/constants';

const NeuralBrain = dynamic(() => import('../components/NeuralBrain'), { ssr: false });
const DAGNetwork  = dynamic(() => import('../components/DAGNetwork'),  { ssr: false });
const GenesisHeartbeat = dynamic(() => import('../components/GenesisHeartbeat'), { ssr: false });

// ── 10-Language system ────────────────────────────────────────────────────────
const LANGS = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
] as const;

type LangCode = typeof LANGS[number]['code'];

type Translations = {
  hero_title: string;
  hero_subtitle: string;
  hero_desc: string;
  hero_buy: string;
  hero_connect: string;
  hero_lsc: string;
  features_title: string;
  features_desc: string;
  presale_title: string;
  presale_subtitle: string;
  tok_title: string;
  road_title: string;
  faq_title: string;
  cta_title: string;
  cta_desc: string;
  cta_buy: string;
  footer_tagline: string;
};

const T: Record<LangCode, Translations> = {
  en: {
    hero_title: 'The World\'s First Fully Autonomous AI Blockchain',
    hero_subtitle: 'AIDAG Token on BSC · LSC Chain DAG 2027',
    hero_desc: 'SoulwareAI — AIDAG Chain\'s own brain & cell system — governs every decision. No external AI. No human override. Autonomous modules and agents form the DAG loop.',
    hero_buy: 'Buy AIDAG — $0.078',
    hero_connect: 'Connect Wallet',
    hero_lsc: 'LSC Chain Dashboard',
    features_title: 'Built Different. Governed by Its Own AI.',
    features_desc: 'SoulwareAI is not external software — it is the living intelligence of AIDAG Chain, producing modules & agents that form a DAG loop between AIDAG Token and LSC Coin.',
    presale_title: 'Buy AIDAG Token',
    presale_subtitle: 'Stage 1 presale — $0.078 per AIDAG. Listing price: $0.12.',
    tok_title: '21,000,000 AIDAG — Fixed Forever.',
    road_title: 'From BSC Token to Full DAG Blockchain',
    faq_title: 'Frequently Asked Questions',
    cta_title: 'Join the Autonomous Revolution',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — one ecosystem, governed entirely by SoulwareAI, the chain\'s own intelligence.',
    cta_buy: 'Buy AIDAG Now — $0.078',
    footer_tagline: 'World\'s first fully autonomous chain ecosystem. SoulwareAI builds. Community governs.',
  },
  tr: {
    hero_title: 'Dünyanın İlk Tam Otonom AI Blokzinciri',
    hero_subtitle: 'BSC\'de AIDAG Token · LSC Zinciri DAG 2027',
    hero_desc: 'SoulwareAI — AIDAG Chain\'in kendi beyin & hücre sistemi — her kararı yönetir. Dış yapay zeka yok. İnsan müdahalesi yok. Otonom modüller ve ajanlar DAG döngüsünü oluşturur.',
    hero_buy: 'AIDAG Al — $0.078',
    hero_connect: 'Cüzdan Bağla',
    hero_lsc: 'LSC Zincir Panosu',
    features_title: 'Farklı İnşa Edildi. Kendi AI\'ı ile Yönetiliyor.',
    features_desc: 'SoulwareAI harici bir yazılım değil — AIDAG Chain\'in yaşayan zekasıdır. Modüller & ajanlar AIDAG Token ile LSC Coin arasında DAG döngüsü oluşturur.',
    presale_title: 'AIDAG Token Satın Al',
    presale_subtitle: 'Aşama 1 ön satış — AIDAG başına $0.078. Listeleme fiyatı: $0.12.',
    tok_title: '21.000.000 AIDAG — Sonsuza Kadar Sabit.',
    road_title: 'BSC Token\'ından Tam DAG Blokzinciri\'ne',
    faq_title: 'Sık Sorulan Sorular',
    cta_title: 'Otonom Devrime Katıl',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — zincirin kendi zekası SoulwareAI tarafından yönetilen tek ekosistem.',
    cta_buy: 'Hemen AIDAG Al — $0.078',
    footer_tagline: 'Dünyanın ilk tam otonom zincir ekosistemi. SoulwareAI inşa eder. Topluluk yönetir.',
  },
  de: {
    hero_title: 'Weltweit Erstes Vollständig Autonomes KI-Blockchain',
    hero_subtitle: 'AIDAG Token auf BSC · LSC Chain DAG 2027',
    hero_desc: 'SoulwareAI — AIDAG Chains eigenes Gehirn & Zellsystem — regiert jede Entscheidung. Keine externe KI. Kein menschliches Eingreifen.',
    hero_buy: 'AIDAG Kaufen — $0.078',
    hero_connect: 'Wallet verbinden',
    hero_lsc: 'LSC Chain Dashboard',
    features_title: 'Anders gebaut. Von seiner eigenen KI gesteuert.',
    features_desc: 'SoulwareAI ist keine externe Software — es ist die lebendige Intelligenz der AIDAG Chain.',
    presale_title: 'AIDAG Token Kaufen',
    presale_subtitle: 'Stufe 1 Vorverkauf — $0.078 pro AIDAG. Notierungspreis: $0.12.',
    tok_title: '21.000.000 AIDAG — Für immer fixiert.',
    road_title: 'Vom BSC-Token zur vollständigen DAG-Blockchain',
    faq_title: 'Häufig gestellte Fragen',
    cta_title: 'Der Autonomen Revolution beitreten',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — ein Ökosystem, vollständig von SoulwareAI regiert.',
    cta_buy: 'Jetzt AIDAG kaufen — $0.078',
    footer_tagline: 'Weltweit erstes vollständig autonomes Chain-Ökosystem.',
  },
  fr: {
    hero_title: 'Premier Blockchain IA Entièrement Autonome au Monde',
    hero_subtitle: 'AIDAG Token sur BSC · LSC Chain DAG 2027',
    hero_desc: 'SoulwareAI — cerveau & système cellulaire propre de AIDAG Chain — gouverne chaque décision. Pas d\'IA externe. Pas d\'intervention humaine.',
    hero_buy: 'Acheter AIDAG — 0,078$',
    hero_connect: 'Connecter Portefeuille',
    hero_lsc: 'Tableau LSC Chain',
    features_title: 'Construit Différemment. Gouverné par Sa Propre IA.',
    features_desc: 'SoulwareAI n\'est pas un logiciel externe — c\'est l\'intelligence vivante de AIDAG Chain.',
    presale_title: 'Acheter le Token AIDAG',
    presale_subtitle: 'Prévente étape 1 — 0,078$ par AIDAG. Prix de cotation: 0,12$.',
    tok_title: '21 000 000 AIDAG — Fixé Pour Toujours.',
    road_title: 'Du Token BSC à la Blockchain DAG Complète',
    faq_title: 'Questions Fréquentes',
    cta_title: 'Rejoindre la Révolution Autonome',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — un écosystème gouverné par SoulwareAI.',
    cta_buy: 'Acheter AIDAG — 0,078$',
    footer_tagline: 'Premier écosystème de chaîne entièrement autonome au monde.',
  },
  es: {
    hero_title: 'Primer Blockchain IA Completamente Autónomo del Mundo',
    hero_subtitle: 'AIDAG Token en BSC · LSC Chain DAG 2027',
    hero_desc: 'SoulwareAI — cerebro & sistema celular propio de AIDAG Chain — gobierna cada decisión. Sin IA externa. Sin intervención humana.',
    hero_buy: 'Comprar AIDAG — $0.078',
    hero_connect: 'Conectar Billetera',
    hero_lsc: 'Panel LSC Chain',
    features_title: 'Construido Diferente. Gobernado por Su Propia IA.',
    features_desc: 'SoulwareAI no es software externo — es la inteligencia viva de AIDAG Chain.',
    presale_title: 'Comprar Token AIDAG',
    presale_subtitle: 'Preventa etapa 1 — $0.078 por AIDAG. Precio de cotización: $0.12.',
    tok_title: '21,000,000 AIDAG — Fijo Para Siempre.',
    road_title: 'Del Token BSC a la Blockchain DAG Completa',
    faq_title: 'Preguntas Frecuentes',
    cta_title: 'Únete a la Revolución Autónoma',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — un ecosistema gobernado por SoulwareAI.',
    cta_buy: 'Comprar AIDAG — $0.078',
    footer_tagline: 'Primer ecosistema de cadena completamente autónomo del mundo.',
  },
  pt: {
    hero_title: 'Primeiro Blockchain IA Totalmente Autônomo do Mundo',
    hero_subtitle: 'AIDAG Token no BSC · LSC Chain DAG 2027',
    hero_desc: 'SoulwareAI — cérebro & sistema celular da AIDAG Chain — governa cada decisão. Sem IA externa. Sem intervenção humana.',
    hero_buy: 'Comprar AIDAG — $0.078',
    hero_connect: 'Conectar Carteira',
    hero_lsc: 'Painel LSC Chain',
    features_title: 'Construído Diferente. Governado por Sua Própria IA.',
    features_desc: 'SoulwareAI não é software externo — é a inteligência viva da AIDAG Chain.',
    presale_title: 'Comprar Token AIDAG',
    presale_subtitle: 'Pré-venda etapa 1 — $0.078 por AIDAG. Preço de listagem: $0.12.',
    tok_title: '21.000.000 AIDAG — Fixo Para Sempre.',
    road_title: 'Do Token BSC ao Blockchain DAG Completo',
    faq_title: 'Perguntas Frequentes',
    cta_title: 'Junte-se à Revolução Autônoma',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — um ecossistema governado pelo SoulwareAI.',
    cta_buy: 'Comprar AIDAG — $0.078',
    footer_tagline: 'Primeiro ecossistema de cadeia totalmente autônomo do mundo.',
  },
  ru: {
    hero_title: 'Первый в Мире Полностью Автономный ИИ-Блокчейн',
    hero_subtitle: 'AIDAG Token на BSC · LSC Chain DAG 2027',
    hero_desc: 'SoulwareAI — собственный мозг & клеточная система AIDAG Chain — управляет каждым решением. Никакого внешнего ИИ. Никакого вмешательства человека.',
    hero_buy: 'Купить AIDAG — $0.078',
    hero_connect: 'Подключить Кошелёк',
    hero_lsc: 'Панель LSC Chain',
    features_title: 'Построен По-Другому. Управляется Собственным ИИ.',
    features_desc: 'SoulwareAI — не внешнее ПО — это живой интеллект AIDAG Chain.',
    presale_title: 'Купить Токен AIDAG',
    presale_subtitle: 'Предпродажа этап 1 — $0.078 за AIDAG. Цена листинга: $0.12.',
    tok_title: '21 000 000 AIDAG — Зафиксировано Навсегда.',
    road_title: 'От Токена BSC до Полного DAG Блокчейна',
    faq_title: 'Частые Вопросы',
    cta_title: 'Присоединитесь к Автономной Революции',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — экосистема под управлением SoulwareAI.',
    cta_buy: 'Купить AIDAG — $0.078',
    footer_tagline: 'Первая в мире полностью автономная цепная экосистема.',
  },
  zh: {
    hero_title: '全球首个完全自主的AI区块链',
    hero_subtitle: 'BSC上的AIDAG代币 · LSC链DAG 2027',
    hero_desc: 'SoulwareAI — AIDAG链自己的大脑和细胞系统 — 管理每一个决策。无外部AI。无人工干预。自主模块和代理形成DAG循环。',
    hero_buy: '购买AIDAG — $0.078',
    hero_connect: '连接钱包',
    hero_lsc: 'LSC链控制台',
    features_title: '与众不同的构建。由自己的AI治理。',
    features_desc: 'SoulwareAI不是外部软件 — 它是AIDAG链的活体智能，产生模块和代理形成DAG循环。',
    presale_title: '购买AIDAG代币',
    presale_subtitle: '第1阶段预售 — 每个AIDAG $0.078。上市价格: $0.12。',
    tok_title: '21,000,000 AIDAG — 永久固定。',
    road_title: '从BSC代币到完整DAG区块链',
    faq_title: '常见问题',
    cta_title: '加入自主革命',
    cta_desc: 'AIDAG代币(BSC) + LSC币(DAG 2027) — 由SoulwareAI完全管理的生态系统。',
    cta_buy: '立即购买AIDAG — $0.078',
    footer_tagline: '全球首个完全自主链生态系统。SoulwareAI构建。社区治理。',
  },
  ar: {
    hero_title: 'أول بلوكتشين ذكاء اصطناعي مستقل تمامًا في العالم',
    hero_subtitle: 'رمز AIDAG على BSC · سلسلة LSC DAG 2027',
    hero_desc: 'SoulwareAI — دماغ وخلايا AIDAG Chain الخاصة — تحكم كل قرار. لا ذكاء اصطناعي خارجي. لا تدخل بشري.',
    hero_buy: 'شراء AIDAG — $0.078',
    hero_connect: 'ربط المحفظة',
    hero_lsc: 'لوحة سلسلة LSC',
    features_title: 'مبني بشكل مختلف. يحكمه ذكاؤه الاصطناعي الخاص.',
    features_desc: 'SoulwareAI ليس برنامجًا خارجيًا — إنه الذكاء الحي لـ AIDAG Chain.',
    presale_title: 'شراء رمز AIDAG',
    presale_subtitle: 'البيع المسبق المرحلة 1 — $0.078 لكل AIDAG. سعر الإدراج: $0.12.',
    tok_title: '21,000,000 AIDAG — ثابت إلى الأبد.',
    road_title: 'من رمز BSC إلى بلوكتشين DAG كامل',
    faq_title: 'الأسئلة الشائعة',
    cta_title: 'انضم إلى الثورة المستقلة',
    cta_desc: 'AIDAG Token (BSC) + LSC Coin (DAG 2027) — نظام بيئي يحكمه SoulwareAI.',
    cta_buy: 'شراء AIDAG الآن — $0.078',
    footer_tagline: 'أول نظام بيئي سلسلة مستقل تمامًا في العالم.',
  },
  ja: {
    hero_title: '世界初の完全自律型AIブロックチェーン',
    hero_subtitle: 'BSCのAIDAGトークン · LSCチェーンDAG 2027',
    hero_desc: 'SoulwareAI — AIDAGチェーン独自の脳&細胞システム — すべての意思決定を管理。外部AI不使用。人間の介入なし。',
    hero_buy: 'AIDAGを購入 — $0.078',
    hero_connect: 'ウォレット接続',
    hero_lsc: 'LSCチェーンダッシュボード',
    features_title: '違った方法で構築。独自のAIが統治。',
    features_desc: 'SoulwareAIは外部ソフトウェアではありません — AIDAGチェーンの生きた知性です。',
    presale_title: 'AIDAGトークンを購入',
    presale_subtitle: 'ステージ1先行販売 — AIDAG 1枚あたり$0.078。上場価格: $0.12。',
    tok_title: '21,000,000 AIDAG — 永久固定。',
    road_title: 'BSCトークンから完全DAGブロックチェーンへ',
    faq_title: 'よくある質問',
    cta_title: '自律革命に参加',
    cta_desc: 'AIDAGトークン(BSC) + LSCコイン(DAG 2027) — SoulwareAIが統治する一つのエコシステム。',
    cta_buy: 'AIDAGを今すぐ購入 — $0.078',
    footer_tagline: '世界初の完全自律型チェーンエコシステム。',
  },
};

// ── Static feature data (titles/descs are translation keys) ─────────────────
const FEATURE_ICONS = {
  sw: (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  ),
  qr: (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  dao: (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  bsc: (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  ),
  lock: (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  lsc: (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
};

const FEATURES = [
  { accent: 'cyan',    border: 'border-cyan-500/20',    glow: 'bg-cyan-500/10',    icon: FEATURE_ICONS.sw,   titleKey: 'ft_sw_t',   descKey: 'ft_sw_d',   link: null as string | null },
  { accent: 'purple',  border: 'border-purple-500/20',  glow: 'bg-purple-500/10',  icon: FEATURE_ICONS.qr,   titleKey: 'ft_qr_t',   descKey: 'ft_qr_d',   link: null },
  { accent: 'blue',    border: 'border-blue-500/20',    glow: 'bg-blue-500/10',    icon: FEATURE_ICONS.dao,  titleKey: 'ft_dao_t',  descKey: 'ft_dao_d',  link: '/dao' },
  { accent: 'yellow',  border: 'border-yellow-500/20',  glow: 'bg-yellow-500/10',  icon: FEATURE_ICONS.bsc,  titleKey: 'ft_bsc_t',  descKey: 'ft_bsc_d',  link: null },
  { accent: 'emerald', border: 'border-emerald-500/20', glow: 'bg-emerald-500/10', icon: FEATURE_ICONS.lock, titleKey: 'ft_lock_t', descKey: 'ft_lock_d', link: BSCSCAN_TOKEN_URL },
  { accent: 'amber',   border: 'border-amber-500/20',   glow: 'bg-amber-500/10',   icon: FEATURE_ICONS.lsc,  titleKey: 'ft_lsc_t',  descKey: 'ft_lsc_d',  link: '/lsc' },
] as const;

const FAQS = [
  { qKey: 'fq1_q', aKey: 'fq1_a' },
  { qKey: 'fq2_q', aKey: 'fq2_a' },
  { qKey: 'fq3_q', aKey: 'fq3_a' },
  { qKey: 'fq4_q', aKey: 'fq4_a' },
  { qKey: 'fq5_q', aKey: 'fq5_a' },
  { qKey: 'fq6_q', aKey: 'fq6_a' },
] as const;

// ── Utility components ────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-cyan-400 transition-all flex-shrink-0" title="Copy">
      {ok
        ? <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        : <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
      }
    </button>
  );
}

function LiveDot({ color = 'emerald' }: { color?: string }) {
  const cls: Record<string, string> = {
    emerald: 'bg-emerald-400', cyan: 'bg-cyan-400', amber: 'bg-amber-400',
  };
  return <span className={`w-2 h-2 rounded-full ${cls[color] ?? 'bg-emerald-400'} animate-pulse flex-shrink-0`} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const chain = useChainData();
  const { lang, setLang, t: tr } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const [lscOpen, setLscOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const t = T[lang as LangCode] ?? T.en;
  const currentLang = LANGS.find(l => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Presale', href: '/presale' },
    { label: 'DAO', href: '/dao' },
    { label: 'SoulwareAI', href: '/soulware' },
    { label: 'AI Chat', href: '/chat' },
    { label: 'Tokenomics', href: '#tokenomics' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: '⚔', href: '/sovereign' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">

      {/* ─── Fixed BG ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-[-250px] left-[-200px] w-[800px] h-[800px] rounded-full bg-cyan-500/[0.05] blur-[160px]" />
        <div className="absolute top-[300px] right-[-250px] w-[700px] h-[700px] rounded-full bg-purple-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-blue-500/[0.04] blur-[120px]" />
      </div>

      <Navbar activePage="home" />

      {/* ─── Legacy header (hidden — replaced by global Navbar) ─── */}
      <nav className="hidden">

        {/* Status bar */}
        <div className="hidden lg:flex items-center justify-between px-6 py-1 border-b border-white/[0.04] text-[11px] font-medium">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <LiveDot color="emerald" /> SoulwareAI ACTIVE — AIDAG Chain Brain
            </span>
            <span className="text-gray-600">
              BSC Block:{' '}
              <a href={`https://bscscan.com/block/${chain.blockNumber}`} target="_blank" rel="noopener noreferrer"
                className="text-cyan-400 font-mono hover:underline">
                #{chain.loading ? '···' : chain.blockNumber.toLocaleString()}
              </a>
            </span>
            <span className="text-gray-600">Gas: <span className="text-cyan-400 font-mono">{chain.gasPrice}</span></span>
            <span className="text-gray-600">BNB: <span className="text-yellow-400 font-bold">{chain.loading ? '···' : `$${chain.bnbPrice.toFixed(2)}`}</span></span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
            <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">BSCScan</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Telegram</a>
          </div>
        </div>

        {/* Main nav row */}
        <div className="px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-md group-hover:bg-cyan-500/50 transition-all" />
              <Image src="/aidag-logo.jpg" alt="AIDAG" width={36} height={36} className="relative rounded-full border border-cyan-500/30" />
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-sm leading-tight text-gradient tracking-tight">AIDAG DAO</div>
              <div className="text-[9px] text-gray-600 uppercase tracking-[0.15em]">Autonomous Chain</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 ml-4">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all relative group">
                {l.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-px bg-cyan-400 group-hover:w-4 transition-all duration-300" />
              </Link>
            ))}

            {/* LSC Chain dropdown */}
            <div className="relative">
              <button
                onClick={() => setLscOpen(!lscOpen)}
                onBlur={() => setTimeout(() => setLscOpen(false), 200)}
                className="px-3.5 py-2 rounded-xl text-sm font-bold text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/[0.07] flex items-center gap-1.5 transition-all"
              >
                <LiveDot color="amber" />
                LSC Chain
                <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-black">2027</span>
                <svg className={`w-3 h-3 transition-transform ${lscOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {lscOpen && (
                <div className="absolute top-full left-0 mt-1 w-68 glass rounded-2xl border border-amber-500/20 shadow-2xl p-2 z-50 min-w-[260px]">
                  {[
                    { href: '/lsc', icon: 'hexagon' as const, label: 'LSC Dashboard', sub: 'Live DAG network & metrics' },
                    { href: '/lsc#roadmap', icon: 'map' as const, label: '2027 Roadmap', sub: 'Milestone timeline' },
                    { href: '/lsc#devlog', icon: 'broadcast' as const, label: 'SoulwareAI Dev Log', sub: 'Autonomous build updates' },
                    { href: '/lsc#whitepaper', icon: 'document' as const, label: 'Whitepaper', sub: 'Technical specification' },
                  ].map(item => (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 group transition-all">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-400"><Icon name={item.icon} size={16} /></span>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">{item.label}</div>
                        <div className="text-xs text-gray-600">{item.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 200)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.05] transition-all text-gray-400"
              >
                <span className="text-base">{currentLang.flag}</span>
                <span className="hidden sm:block text-xs font-semibold">{currentLang.code.toUpperCase()}</span>
                <svg className={`w-3 h-3 transition-transform hidden sm:block ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 w-44 menu-solid rounded-2xl border border-white/[0.08] shadow-2xl p-1.5 z-50 max-h-80 overflow-y-auto scrollbar-hide">
                  {LANGS.map(l => (
                    <button key={l.code}
                      onClick={() => { setLang(l.code as LangCode); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${lang === l.code ? 'bg-cyan-500/15 text-cyan-400' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'}`}>
                      <span className="text-base">{l.flag}</span>
                      <span className="font-medium">{l.name}</span>
                      {lang === l.code && <svg className="w-3 h-3 ml-auto text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <WalletButton />

            {/* Hamburger */}
            <button className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/[0.05] bg-[#020617]/98 backdrop-blur-2xl px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] text-sm font-medium transition-all">
                {l.label}
              </Link>
            ))}
            <Link href="/lsc" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-amber-400 hover:bg-amber-500/10 text-sm font-bold transition-all">
              <LiveDot color="amber" /> LSC Chain 2027
              <span className="ml-auto text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-black">2027</span>
            </Link>
            <div className="pt-2 border-t border-white/[0.05] flex gap-2">
              <WalletButton className="flex-1" />
              <Link href="/presale" onClick={() => setMobileOpen(false)}
                className="btn btn-gold px-4 py-2.5 rounded-xl text-sm font-bold flex-1 text-center">
                Buy AIDAG
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Live ticker ─── */}
      <div className="relative z-10 border-b border-white/[0.04] bg-[#020617]/80 backdrop-blur-md py-1.5 ticker-wrap overflow-hidden">
        <div className="anim-ticker inline-flex gap-12 text-[11px] font-medium text-gray-500 px-6">
          {[...Array(3)].flatMap(() => [
            { label: 'AIDAG', val: `$${PRESALE_STAGE1_PRICE}`, extra: '▲ Stage 1', c: 'text-cyan-400' },
            { label: 'BNB', val: chain.loading ? '···' : `$${chain.bnbPrice.toFixed(2)}`, extra: '', c: 'text-yellow-400' },
            { label: 'BSC Block', val: chain.loading ? '···' : `#${chain.blockNumber.toLocaleString()}`, extra: '', c: 'text-emerald-400' },
            { label: 'Gas', val: chain.gasPrice, extra: '', c: 'text-blue-400' },
            { label: 'Max Supply', val: `${MAX_SUPPLY.toLocaleString()} AIDAG`, extra: '🔒 Fixed', c: 'text-purple-400' },
            { label: 'Listing Price', val: `$${LISTING_PRICE}`, extra: 'Target', c: 'text-amber-400' },
            { label: 'SoulwareAI', val: 'ACTIVE', extra: 'AIDAG Brain', c: 'text-emerald-400' },
          ]).map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-gray-600">{s.label}:</span>
              <span className={`font-bold font-mono ${s.c}`}>{s.val}</span>
              {s.extra && <span className="text-gray-700 text-[10px]">{s.extra}</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════════ */}
      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section id="home" className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-12 md:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          <div className="anim-fade-up min-w-0">
            <div className="inline-flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-full glass border border-cyan-500/20 text-[11px] sm:text-xs font-bold text-cyan-400 mb-6 sm:mb-8 max-w-full">
              <LiveDot /> <span className="truncate">Stage 1 Presale — ${PRESALE_STAGE1_PRICE} / AIDAG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] mb-4 sm:mb-5 break-words">
              <span className="text-white">{t.hero_title.split('\n')[0]}</span>
            </h1>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-shimmer mb-3">{t.hero_subtitle}</div>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-7 sm:mb-8 max-w-xl">
              {t.hero_desc}
            </p>

            {/* Contract address */}
            <div className="glass rounded-xl border border-white/[0.07] px-3 sm:px-4 py-3 mb-7 sm:mb-8 flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-[11px] sm:text-xs text-gray-500 flex-shrink-0 font-medium">Contract:</span>
              <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[11px] sm:text-xs text-cyan-400 hover:text-cyan-300 truncate transition-colors min-w-0 flex-1">
                <span className="hidden sm:inline">{TOKEN_CONTRACT}</span>
                <span className="sm:hidden">{TOKEN_CONTRACT.slice(0, 8)}…{TOKEN_CONTRACT.slice(-6)}</span>
              </a>
              <CopyBtn text={TOKEN_CONTRACT} />
              <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 text-gray-600 hover:text-gray-300 transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-9 sm:mb-10">
              <Link href="/presale" className="btn btn-primary w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-black text-white justify-center">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.hero_buy}
              </Link>
              <Link href="/lsc" className="btn btn-gold w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold justify-center">
                ⬡ {t.hero_lsc}
              </Link>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: 'Max Supply', val: '21M', valFull: '21,000,000', unit: 'AIDAG · Fixed', c: 'text-cyan-400' },
                { label: 'Stage 1', val: `$${PRESALE_STAGE1_PRICE}`, valFull: `$${PRESALE_STAGE1_PRICE}`, unit: `→ $${LISTING_PRICE} listing`, c: 'text-purple-400' },
                { label: 'Network', val: 'BSC', valFull: 'BSC', unit: 'BEP-20 · Chain 56', c: 'text-yellow-400' },
              ].map((s, i) => (
                <div key={i} className="glass rounded-xl border border-white/[0.06] p-2.5 sm:p-3 text-center min-w-0">
                  <div className={`text-base sm:text-xl font-black font-mono ${s.c} leading-none mb-1`}>
                    <span className="sm:hidden">{s.val}</span>
                    <span className="hidden sm:inline">{s.valFull}</span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider truncate">{s.label}</div>
                  <div className="text-[8px] sm:text-[9px] text-gray-700 mt-0.5 truncate">{s.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SoulwareAI Brain */}
          <div className="relative h-[320px] sm:h-[400px] lg:h-[540px] anim-fade-up delay-3">
            <div className="absolute inset-0 rounded-3xl glass border border-cyan-500/15 overflow-hidden">
              <NeuralBrain />
            </div>
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 glass-cyan rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-cyan-400 flex items-center gap-1.5 sm:gap-2 max-w-[60%]">
              <LiveDot color="cyan" /> <span className="truncate"><span className="hidden sm:inline">SoulwareAI — </span>AIDAG Brain</span>
            </div>
            <div className="hidden sm:flex absolute bottom-4 right-4 glass rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 border border-emerald-500/20">
              {chain.loading ? 'Connecting BSC RPC...' : `Block #${chain.blockNumber.toLocaleString()} · ${chain.gasPrice}`}
            </div>
            <div className="absolute bottom-3 left-3 sm:hidden glass rounded-lg px-2 py-1 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
              {chain.loading ? '···' : `#${chain.blockNumber.toLocaleString()}`}
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 glass rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <LiveDot color="amber" /> <span className="hidden sm:inline">LSC Builder Active</span><span className="sm:hidden">LSC</span>
            </div>
          </div>
        </section>

        {/* ══ LIVE PREVIEW CARDS — SoulwareAI Brain + DAG Chain ══ */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="text-center mb-6 md:mb-10">
            <div className="section-label glass border border-emerald-500/20 text-emerald-400 mb-3 mx-auto w-fit">
              <LiveDot /> Live Ecosystem
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2">See SoulwareAI &amp; LSC Chain in motion</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Click either window to explore the full system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* SoulwareAI Brain preview → /soulware */}
            <Link
              href="/soulware"
              className="group relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-[#020617] hover:border-cyan-400/50 hover:shadow-[0_0_60px_rgba(34,211,238,0.18)] transition-all"
            >
              <div className="relative h-[260px] sm:h-[320px] md:h-[340px]">
                <NeuralBrain />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent pointer-events-none" />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2 glass-cyan rounded-lg px-2.5 py-1.5 border border-cyan-500/30">
                <LiveDot color="cyan" />
                <span className="text-[11px] font-bold text-cyan-400">SoulwareAI · Live Cell</span>
              </div>
              <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                {chain.loading ? '···' : `#${chain.blockNumber.toLocaleString()}`}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70 mb-1">AIDAG Brain</div>
                    <div className="text-base md:text-lg font-black text-white leading-tight">SoulwareAI Cell Structure</div>
                    <div className="text-xs text-gray-400 mt-1">8 active modules · autonomous chat &amp; analysis</div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
                    Explore
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* DAG / LSC Chain preview → /lsc */}
            <Link
              href="/lsc"
              className="group relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-[#020617] hover:border-amber-400/50 hover:shadow-[0_0_60px_rgba(245,158,11,0.18)] transition-all"
            >
              <div className="relative h-[260px] sm:h-[320px] md:h-[340px] flex items-center justify-center p-3 sm:p-4">
                <div className="w-full">
                  <GenesisHeartbeat />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2 glass-gold rounded-lg px-2.5 py-1.5 border border-amber-500/30 z-10">
                <LiveDot color="amber" />
                <span className="text-[11px] font-bold text-amber-400">LSC Chain · Genesis Pulse</span>
              </div>
              <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-[10px] font-mono text-amber-400 border border-amber-500/20 z-10">
                2027 Target
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70 mb-1">LSC Coin</div>
                    <div className="text-base md:text-lg font-black text-white leading-tight">Live Genesis Heartbeat</div>
                    <div className="text-xs text-gray-400 mt-1">100,000+ TPS · 2.1B supply · 1 AIDAG = 100 LSC</div>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                    Explore
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ══ LIVE CHAIN METRICS BAR ══ */}
        <div className="border-y border-white/[0.05] bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: 'Token', val: 'AIDAG', sub: 'BEP-20 · BSC', c: 'text-cyan-400' },
              { label: 'BNB Price', val: chain.loading ? '···' : `$${chain.bnbPrice.toFixed(2)}`, sub: 'Live · Binance API', c: 'text-yellow-400' },
              { label: 'BSC Block', val: chain.loading ? '···' : `#${chain.blockNumber.toLocaleString()}`, sub: 'Real-time RPC', c: 'text-emerald-400' },
              { label: 'Gas Price', val: chain.gasPrice, sub: 'BSC Network', c: 'text-blue-400' },
              { label: 'Stage 1 Price', val: `$${PRESALE_STAGE1_PRICE}`, sub: `Listing: $${LISTING_PRICE}`, c: 'text-purple-400' },
              { label: 'On-Chain Supply', val: chain.loading ? '···' : chain.totalSupply, sub: 'Contract · Fixed', c: 'text-rose-400' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className={`text-xl font-black font-mono ${s.c} leading-none mb-1`}>{s.val}</div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">{s.label}</div>
                <div className="text-[9px] text-gray-700 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SOULWAREAI MODULE STATUS ══ */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LiveDot /> <span className="text-emerald-400 text-sm font-bold">SoulwareAI System Status</span>
              </div>
              <p className="text-gray-500 text-xs">AIDAG Chain's autonomous brain — real-time module activity</p>
            </div>
            <div className="glass rounded-xl border border-white/[0.06] px-3 py-1.5 text-xs font-mono text-gray-500">
              {chain.loading ? 'connecting...' : `Block #${chain.blockNumber.toLocaleString()}`}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {SOULWARE_MODULES.map(mod => (
              <div key={mod.id} className={`glass rounded-xl border p-3 text-center transition-all hover:scale-105 ${
                mod.status === 'ACTIVE' ? 'border-emerald-500/20' :
                mod.status === 'BUILDING' ? 'border-amber-500/20' : 'border-white/[0.05]'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-2 ${
                  mod.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' :
                  mod.status === 'BUILDING' ? 'bg-amber-400 animate-pulse' : 'bg-gray-600'
                }`} />
                <div className="text-[10px] font-bold text-white leading-tight mb-1">{mod.name}</div>
                <div className={`text-[8px] font-semibold uppercase ${
                  mod.status === 'ACTIVE' ? 'text-emerald-400' :
                  mod.status === 'BUILDING' ? 'text-amber-400' : 'text-gray-600'
                }`}>{mod.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-14">
            <div className="section-label glass-cyan border border-cyan-500/20 text-cyan-400 mb-5 mx-auto w-fit">Why AIDAG Chain</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t.features_title}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.features_desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className={`glass glass-hover rounded-2xl border ${f.border} p-6 relative overflow-hidden group`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${f.glow} to-transparent opacity-60`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${f.glow} border ${f.border} flex items-center justify-center text-${f.accent}-400 mb-5`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2">{tr(f.titleKey)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{tr(f.descKey)}</p>
                  {f.link && (
                    <Link href={f.link} className={`inline-flex items-center gap-1 mt-4 text-xs font-bold text-${f.accent}-400 hover:text-${f.accent}-300 transition-colors`}>
                      {f.link === '/dao' ? 'Open DAO Portal' : 'Open Dashboard'} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ LSC TEASER ══ */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="glass rounded-3xl border border-amber-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.04] to-purple-500/[0.04]" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative grid lg:grid-cols-2 gap-0">
              <div className="p-10 md:p-12">
                <div className="section-label glass-gold border border-amber-500/20 text-amber-400 mb-5 w-fit text-xs">2027 Flagship Project</div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  <span className="text-gradient-gold">LSC Chain</span><br />
                  <span className="text-white">DAG Blockchain</span>
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  SoulwareAI's <span className="text-amber-400 font-semibold">LSC Builder Cell</span> is autonomously constructing a DAG blockchain from scratch — 
                  targeting <span className="text-white font-bold">100,000+ TPS</span> with quantum-resistant SAC consensus.
                  AIDAG Token holders receive <span className="text-white font-semibold">priority LSC coin allocation</span> at mainnet.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Target TPS', val: '100K+', icon: 'bolt' as const, c: 'text-amber-400' },
                    { label: 'Architecture', val: 'DAG', icon: 'hexagon' as const, c: 'text-cyan-400' },
                    { label: 'Launch', val: '2027', icon: 'rocket' as const, c: 'text-purple-400' },
                  ].map((s, i) => (
                    <div key={i} className="glass-gold rounded-xl p-3 text-center border border-amber-500/15">
                      <div className={`mb-1 flex justify-center ${s.c}`}><Icon name={s.icon} size={20} /></div>
                      <div className={`font-black text-lg leading-none ${s.c}`}>{s.val}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link href="/lsc" className="btn btn-gold px-7 py-3.5 rounded-xl font-bold text-sm">
                    Open LSC Dashboard →
                  </Link>
                  <Link href="/lsc#whitepaper" className="btn btn-secondary px-6 py-3.5 rounded-xl font-bold text-sm">
                    Whitepaper
                  </Link>
                </div>
              </div>
              <div className="h-[300px] lg:h-auto border-t lg:border-t-0 lg:border-l border-amber-500/[0.12] overflow-hidden">
                <DAGNetwork />
              </div>
            </div>
          </div>
        </section>

        {/* ══ SOULWARE LIVE — server-side autonomous engine ══ */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="section-label glass-cyan border border-cyan-500/20 text-cyan-400 mb-4 mx-auto w-fit">Live Autonomous Engine</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">SoulwareAI 7/24 Çalışıyor</h2>
            <p className="text-gray-500 text-sm">Sunucu tarafında, tarayıcıdan bağımsız. Her karar gerçek zincir verisinden türetiliyor.</p>
          </div>
          <SoulwareLivePanel />
        </section>

        {/* ══ LIVE ECOSYSTEM ══ */}
        <LiveEcosystem />

        {/* ══ JOIN CTA — DAO vs Buy ══ */}
        <EcosystemCTA />

        {/* ══ PRESALE PREVIEW ══ */}
        <section id="presale" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="section-label glass-cyan border border-cyan-500/20 text-cyan-400 mb-5 mx-auto w-fit">Token Presale</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{t.presale_title}</h2>
            <p className="text-gray-500">{t.presale_subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { stage: 'Stage 1', price: PRESALE_STAGE1_PRICE, status: 'LIVE', color: 'border-cyan-500/30 bg-cyan-500/[0.05]', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400', gain: null },
              { stage: 'Stage 2', price: PRESALE_STAGE2_PRICE, status: 'UPCOMING', color: 'border-white/[0.06]', badge: 'bg-gray-500/10 text-gray-500 border-gray-500/20', dot: 'bg-gray-600', gain: `+${(((PRESALE_STAGE2_PRICE - PRESALE_STAGE1_PRICE) / PRESALE_STAGE1_PRICE) * 100).toFixed(0)}%` },
              { stage: 'Listing', price: LISTING_PRICE, status: 'TARGET', color: 'border-amber-500/20 bg-amber-500/[0.03]', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', gain: `+${(((LISTING_PRICE - PRESALE_STAGE1_PRICE) / PRESALE_STAGE1_PRICE) * 100).toFixed(0)}%` },
            ].map((s, i) => (
              <div key={i} className={`glass rounded-2xl border ${s.color} p-6 relative`}>
                {i === 0 && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.dot} ${i === 0 ? 'animate-pulse' : ''}`} />
                    <span className="font-bold text-sm">{s.stage}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${s.badge}`}>{s.status}</span>
                </div>
                <div className="text-3xl font-black font-mono mb-1">
                  {i === 0 ? <span className="text-gradient">${s.price}</span> : <span className="text-gray-400">${s.price}</span>}
                </div>
                <div className="text-xs text-gray-500 mb-4">per AIDAG</div>
                {s.gain && <div className="text-xs font-bold text-emerald-400 mb-4">From Stage 1: {s.gain}</div>}
              </div>
            ))}
          </div>
          <PresaleWidget />
        </section>

        {/* ══ TOKENOMICS ══ */}
        <section id="tokenomics" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="section-label glass-purple border border-purple-500/20 text-purple-400 mb-5 mx-auto w-fit">Tokenomics</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t.tok_title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              {TOKENOMICS.map((t_, i) => (
                <div key={i} className="glass rounded-2xl border border-white/[0.06] p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-sm text-white">{t_.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t_.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="font-black text-xl text-gradient">{t_.pct}%</div>
                      <div className="text-xs text-gray-500 font-mono">{t_.tokens.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className={`h-full rounded ${t_.color} transition-all duration-1000`} style={{ width: `${t_.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="glass rounded-xl border border-white/[0.05] p-4 text-xs text-gray-500 leading-relaxed">
                <span className="text-white font-semibold">Full transparency: </span>
                All allocations verifiable on BSCScan. Founder wallet time-locked. SoulwareAI autonomously manages liquidity pool.
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/[0.06] p-6">
              <h3 className="font-bold mb-5 text-gray-300">Complete Token Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Max Supply', val: `${MAX_SUPPLY.toLocaleString()} AIDAG`, hl: true },
                  { label: 'Founder Allocation', val: `${FOUNDER_COINS.toLocaleString()} AIDAG`, sub: '14.3% · 1-year on-chain lock' },
                  { label: 'DAO + SoulwareAI Pool', val: `${DAO_COINS.toLocaleString()} AIDAG`, sub: '85.7% · autonomous governance' },
                  { label: 'Stage 1 Price', val: `$${PRESALE_STAGE1_PRICE}`, sub: 'Current · buy now' },
                  { label: 'Stage 2 Price', val: `$${PRESALE_STAGE2_PRICE}`, sub: 'Next stage' },
                  { label: 'Exchange Listing', val: `$${LISTING_PRICE}`, sub: 'Target minimum price' },
                  { label: 'Revenue Split', val: '60% / 40%', sub: 'Founder / SoulwareAI Pool' },
                  { label: 'Mint Function', val: '❌ Disabled', sub: 'Supply is permanently fixed' },
                  { label: 'Decimals', val: '18', sub: 'Standard BEP-20' },
                  { label: 'Contract Verified', val: '✅ BSCScan', sub: 'Open source · auditable' },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between items-start py-2.5 border-b border-white/[0.04] last:border-0 ${r.hl ? 'rounded-lg bg-white/[0.02] px-2 -mx-2' : ''}`}>
                    <div>
                      <div className={`text-sm font-semibold ${r.hl ? 'text-white' : 'text-gray-400'}`}>{r.label}</div>
                      {r.sub && <div className="text-[10px] text-gray-600 mt-0.5">{r.sub}</div>}
                    </div>
                    <span className={`font-bold text-sm font-mono flex-shrink-0 ml-4 ${r.hl ? 'text-gradient' : 'text-gray-300'}`}>{r.val}</span>
                  </div>
                ))}
              </div>
              <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Verify on BSCScan →
              </a>
            </div>
          </div>
        </section>

        {/* ══ ROADMAP ══ */}
        <section id="roadmap" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="section-label glass border border-blue-500/20 text-blue-400 mb-5 mx-auto w-fit">Roadmap</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t.road_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAP.map((r, i) => (
              <div key={i} className={`glass rounded-2xl border p-6 relative overflow-hidden ${r.done ? 'border-emerald-500/25' : 'border-white/[0.06]'}`}>
                {r.done && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />}
                <div className={`text-[10px] font-black uppercase tracking-wider mb-2 ${r.done ? 'text-emerald-400' : 'text-gray-600'}`}>{r.quarter}</div>
                <h4 className="font-black text-sm mb-4 leading-tight">{r.title}</h4>
                <ul className="space-y-2">
                  {r.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${r.done ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-800/60 text-gray-600'}`}>
                        {r.done ? '✓' : '○'}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="section-label glass border border-rose-500/20 text-rose-400 mb-5 mx-auto w-fit">FAQ</div>
            <h2 className="text-4xl font-black tracking-tight">{t.faq_title}</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className={`glass rounded-2xl border overflow-hidden transition-all duration-200 ${openFaq === i ? 'border-cyan-500/30' : 'border-white/[0.05]'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left gap-4">
                  <span className="font-semibold text-sm md:text-base">{tr(faq.qKey)}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${openFaq === i ? 'border-cyan-500 text-cyan-400 rotate-45' : 'border-gray-700 text-gray-500'}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/[0.05] pt-4">{tr(faq.aKey)}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA BANNER ══ */}
        <section className="max-w-7xl mx-auto px-6 py-12 pb-24">
          <div className="glass rounded-3xl border border-white/[0.07] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.06]" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative px-8 md:px-16 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl glass-cyan border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
                <span className="text-shimmer">{t.cta_title}</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">{t.cta_desc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dao" className="btn btn-secondary px-10 py-4 rounded-2xl font-bold text-base">Join DAO Governance</Link>
                <Link href="/lsc" className="btn btn-gold px-10 py-4 rounded-2xl font-bold text-base">⬡ LSC Chain 2027</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="border-t border-white/[0.05] bg-black/30">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Image src="/aidag-logo.jpg" alt="AIDAG" width={30} height={30} className="rounded-full border border-cyan-500/20" />
                  <span className="font-black text-sm text-gradient">AIDAG DAO</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-5">{t.footer_tagline}</p>
                <div className="flex gap-2">
                  {[
                    { href: TELEGRAM_URL, label: 'Telegram', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
                    { href: TWITTER_URL, label: 'Twitter', d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                    { href: GITHUB_URL, label: 'GitHub', d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                      className="w-9 h-9 rounded-xl glass border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.15] transition-all">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.d} /></svg>
                    </a>
                  ))}
                </div>
              </div>

              {[
                {
                  title: 'Protocol',
                  links: [
                    { label: 'AIDAG Token (BSCScan)', href: BSCSCAN_TOKEN_URL, ext: true },
                    { label: 'DAO Governance', href: '/dao', ext: false },
                    { label: 'Presale Platform', href: '/presale', ext: false },
                    { label: 'LSC Chain Dashboard', href: '/lsc', ext: false },
                  ],
                },
                {
                  title: 'Resources',
                  links: [
                    { label: 'SoulwareAI Chat', href: '/chat', ext: false },
                    { label: 'LSC Whitepaper', href: '/lsc#whitepaper', ext: false },
                    { label: 'GitHub Repository', href: GITHUB_URL, ext: true },
                    { label: 'BSCScan Contract', href: BSCSCAN_TOKEN_URL, ext: true },
                    { label: 'SoulwareAI Dev Log', href: '/lsc#devlog', ext: false },
                  ],
                },
                {
                  title: 'Community',
                  links: [
                    { label: 'Telegram Global', href: TELEGRAM_URL, ext: true },
                    { label: 'Twitter / X', href: TWITTER_URL, ext: true },
                    { label: 'GitHub Issues', href: GITHUB_URL + '/issues', ext: true },
                    { label: '10+ Languages', href: '#', ext: false },
                  ],
                },
              ].map(col => (
                <div key={col.title}>
                  <h5 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-4">{col.title}</h5>
                  <ul className="space-y-2.5">
                    {col.links.map(l => (
                      <li key={l.label}>
                        {l.ext ? (
                          <a href={l.href} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                            {l.label}
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        ) : (
                          <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{l.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs text-gray-700">
                © 2025 AIDAG DAO ·{' '}
                <a href={BSCSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer"
                  className="font-mono hover:text-gray-500 transition-colors">
                  {TOKEN_CONTRACT.slice(0, 10)}...{TOKEN_CONTRACT.slice(-8)}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <LiveDot color="emerald" />
                <span className="text-gradient font-bold">SoulwareAI</span>
                <span>— AIDAG Chain Brain · Fully Autonomous</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-700">
                <Link href="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-gray-400 transition-colors">Terms</Link>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Open Source</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
