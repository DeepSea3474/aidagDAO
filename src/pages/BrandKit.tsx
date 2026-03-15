import { motion } from "framer-motion";
import {
  Download, Copy, Check, Palette, FileText, Image,
  Globe, Shield, Coins, ExternalLink, Layers, Hash,
  Link2, Info, Box, Hexagon
} from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { CONTRACT_ADDRESSES, TOKENOMICS, PRESALE_CONFIG } from "@/lib/web3Config";

function AidagLogoSVG({ size = 256, variant = "full" }: { size?: number; variant?: "full" | "icon" | "dark" | "light" }) {
  const bgColor = variant === "light" ? "#FFFFFF" : "#0A0F1E";
  const primaryColor = "#06B6D4";
  const secondaryColor = "#8B5CF6";
  const textColor = variant === "light" ? "#0A0F1E" : "#FFFFFF";

  if (variant === "icon") {
    return (
      <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <linearGradient id="dagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="96" fill={bgColor} />
        <circle cx="256" cy="160" r="28" fill="url(#iconGrad)" />
        <circle cx="160" cy="280" r="28" fill="url(#iconGrad)" />
        <circle cx="352" cy="280" r="28" fill="url(#iconGrad)" />
        <circle cx="208" cy="380" r="22" fill="url(#iconGrad)" opacity="0.7" />
        <circle cx="304" cy="380" r="22" fill="url(#iconGrad)" opacity="0.7" />
        <line x1="256" y1="188" x2="170" y2="260" stroke="url(#iconGrad)" strokeWidth="4" opacity="0.6" />
        <line x1="256" y1="188" x2="342" y2="260" stroke="url(#iconGrad)" strokeWidth="4" opacity="0.6" />
        <line x1="170" y1="300" x2="208" y2="362" stroke="url(#iconGrad)" strokeWidth="3" opacity="0.5" />
        <line x1="342" y1="300" x2="304" y2="362" stroke="url(#iconGrad)" strokeWidth="3" opacity="0.5" />
        <line x1="186" y1="280" x2="324" y2="280" stroke="url(#iconGrad)" strokeWidth="3" opacity="0.4" />
        <line x1="226" y1="380" x2="286" y2="380" stroke="url(#iconGrad)" strokeWidth="3" opacity="0.4" />
        <text x="256" y="200" textAnchor="middle" fill={textColor} fontFamily="Arial, sans-serif" fontWeight="900" fontSize="48">AI</text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`logoGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      <rect width="800" height="320" rx="24" fill={bgColor} />
      <circle cx="100" cy="120" r="20" fill={`url(#logoGrad-${variant})`} />
      <circle cx="60" cy="200" r="20" fill={`url(#logoGrad-${variant})`} />
      <circle cx="140" cy="200" r="20" fill={`url(#logoGrad-${variant})`} />
      <circle cx="80" cy="270" r="16" fill={`url(#logoGrad-${variant})`} opacity="0.7" />
      <circle cx="120" cy="270" r="16" fill={`url(#logoGrad-${variant})`} opacity="0.7" />
      <line x1="100" y1="140" x2="68" y2="184" stroke={primaryColor} strokeWidth="3" opacity="0.5" />
      <line x1="100" y1="140" x2="132" y2="184" stroke={primaryColor} strokeWidth="3" opacity="0.5" />
      <line x1="68" y1="216" x2="80" y2="256" stroke={primaryColor} strokeWidth="2" opacity="0.4" />
      <line x1="132" y1="216" x2="120" y2="256" stroke={primaryColor} strokeWidth="2" opacity="0.4" />
      <line x1="78" y1="200" x2="122" y2="200" stroke={primaryColor} strokeWidth="2" opacity="0.4" />
      <text x="220" y="180" fill={textColor} fontFamily="Arial, sans-serif" fontWeight="900" fontSize="72">AIDAG</text>
      <text x="530" y="180" fill={primaryColor} fontFamily="Arial, sans-serif" fontWeight="700" fontSize="72">Chain</text>
      <text x="220" y="230" fill={textColor} fontFamily="Arial, sans-serif" fontWeight="400" fontSize="22" opacity="0.6">Quantum-Secure Autonomous AI Blockchain</text>
    </svg>
  );
}

function generateSVGString(variant: "full" | "icon" | "dark" | "light", size: number): string {
  const bgColor = variant === "light" ? "#FFFFFF" : "#0A0F1E";
  const primaryColor = "#06B6D4";
  const secondaryColor = "#8B5CF6";
  const textColor = variant === "light" ? "#0A0F1E" : "#FFFFFF";

  if (variant === "icon") {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="${bgColor}"/>
  <circle cx="256" cy="160" r="28" fill="url(#iconGrad)"/>
  <circle cx="160" cy="280" r="28" fill="url(#iconGrad)"/>
  <circle cx="352" cy="280" r="28" fill="url(#iconGrad)"/>
  <circle cx="208" cy="380" r="22" fill="url(#iconGrad)" opacity="0.7"/>
  <circle cx="304" cy="380" r="22" fill="url(#iconGrad)" opacity="0.7"/>
  <line x1="256" y1="188" x2="170" y2="260" stroke="url(#iconGrad)" stroke-width="4" opacity="0.6"/>
  <line x1="256" y1="188" x2="342" y2="260" stroke="url(#iconGrad)" stroke-width="4" opacity="0.6"/>
  <line x1="170" y1="300" x2="208" y2="362" stroke="url(#iconGrad)" stroke-width="3" opacity="0.5"/>
  <line x1="342" y1="300" x2="304" y2="362" stroke="url(#iconGrad)" stroke-width="3" opacity="0.5"/>
  <line x1="186" y1="280" x2="324" y2="280" stroke="url(#iconGrad)" stroke-width="3" opacity="0.4"/>
  <line x1="226" y1="380" x2="286" y2="380" stroke="url(#iconGrad)" stroke-width="3" opacity="0.4"/>
  <text x="256" y="200" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-weight="900" font-size="48">AI</text>
</svg>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${Math.round(size * 0.4)}" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="320" rx="24" fill="${bgColor}"/>
  <circle cx="100" cy="120" r="20" fill="url(#logoGrad)"/>
  <circle cx="60" cy="200" r="20" fill="url(#logoGrad)"/>
  <circle cx="140" cy="200" r="20" fill="url(#logoGrad)"/>
  <circle cx="80" cy="270" r="16" fill="url(#logoGrad)" opacity="0.7"/>
  <circle cx="120" cy="270" r="16" fill="url(#logoGrad)" opacity="0.7"/>
  <line x1="100" y1="140" x2="68" y2="184" stroke="${primaryColor}" stroke-width="3" opacity="0.5"/>
  <line x1="100" y1="140" x2="132" y2="184" stroke="${primaryColor}" stroke-width="3" opacity="0.5"/>
  <line x1="68" y1="216" x2="80" y2="256" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
  <line x1="132" y1="216" x2="120" y2="256" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
  <line x1="78" y1="200" x2="122" y2="200" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
  <text x="220" y="180" fill="${textColor}" font-family="Arial, sans-serif" font-weight="900" font-size="72">AIDAG</text>
  <text x="530" y="180" fill="${primaryColor}" font-family="Arial, sans-serif" font-weight="700" font-size="72">Chain</text>
  <text x="220" y="230" fill="${textColor}" font-family="Arial, sans-serif" font-weight="400" font-size="22" opacity="0.6">Quantum-Secure Autonomous AI Blockchain</text>
</svg>`;
}

function downloadSVG(variant: "full" | "icon" | "dark" | "light", size: number, filename: string) {
  const svgString = generateSVGString(variant, size);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadAllAssets() {
  const assets = [
    { variant: "icon" as const, size: 32, filename: "aidag-icon-32x32.svg" },
    { variant: "icon" as const, size: 64, filename: "aidag-icon-64x64.svg" },
    { variant: "icon" as const, size: 128, filename: "aidag-icon-128x128.svg" },
    { variant: "icon" as const, size: 256, filename: "aidag-icon-256x256.svg" },
    { variant: "icon" as const, size: 512, filename: "aidag-icon-512x512.svg" },
    { variant: "full" as const, size: 800, filename: "aidag-logo-full-dark.svg" },
    { variant: "light" as const, size: 800, filename: "aidag-logo-full-light.svg" },
  ];
  assets.forEach((asset, i) => {
    setTimeout(() => downloadSVG(asset.variant, asset.size, asset.filename), i * 300);
  });
}

function downloadTokenJSON() {
  const tokenInfo = {
    name: "AIDAG Chain",
    symbol: "AIDAG",
    decimals: 18,
    totalSupply: "21000000",
    contractAddress: CONTRACT_ADDRESSES.token,
    chains: [
      { chainId: 56, name: "BNB Smart Chain", explorerUrl: `https://bscscan.com/token/${CONTRACT_ADDRESSES.token}` },
      { chainId: 1, name: "Ethereum", explorerUrl: `https://etherscan.io/token/${CONTRACT_ADDRESSES.token}` },
    ],
    website: "https://aidagchain.com",
    whitepaper: "https://aidagchain.com/whitepaper",
    socialMedia: {
      twitter: "https://x.com/AidagChain",
      telegram: "https://t.me/AidagChain",
      discord: "https://discord.gg/aidagchain",
      github: "https://github.com/aidagchain",
    },
    description: "AIDAG Chain is the world's first quantum-secure cryptocurrency, autonomously designed by SoulwareAI without founder intervention, compatible with BSC and ETH chains, and self-updating via DAO decisions.",
    tags: ["DeFi", "DAO", "AI", "Quantum-Secure", "Layer-1", "DAG"],
    logoURI: {
      svg: "https://aidagchain.com/brand/aidag-icon-256x256.svg",
      png_32: "https://aidagchain.com/brand/aidag-icon-32x32.png",
      png_64: "https://aidagchain.com/brand/aidag-icon-64x64.png",
      png_128: "https://aidagchain.com/brand/aidag-icon-128x128.png",
      png_256: "https://aidagchain.com/brand/aidag-icon-256x256.png",
    },
  };
  const blob = new Blob([JSON.stringify(tokenInfo, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aidag-token-info.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      data-testid={`copy-${label}`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover-elevate text-xs font-mono text-slate-300 transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      <span className="truncate max-w-[280px]">{text}</span>
    </button>
  );
}

const BRAND_COLORS = [
  { name: "Cyan Primary", hex: "#06B6D4", rgb: "6, 182, 212", usage: "Primary brand, buttons, links" },
  { name: "Purple Accent", hex: "#8B5CF6", rgb: "139, 92, 246", usage: "Gradients, accents, highlights" },
  { name: "Dark Background", hex: "#0A0F1E", rgb: "10, 15, 30", usage: "Main background" },
  { name: "Slate 950", hex: "#020617", rgb: "2, 6, 23", usage: "Deep backgrounds" },
  { name: "Emerald", hex: "#10B981", rgb: "16, 185, 129", usage: "Success states, positive values" },
  { name: "White", hex: "#FFFFFF", rgb: "255, 255, 255", usage: "Text on dark backgrounds" },
];

const ICON_SIZES = [
  { size: 32, label: "32x32", usage: "Favicon, browser tab" },
  { size: 64, label: "64x64", usage: "Small token icon" },
  { size: 128, label: "128x128", usage: "CoinGecko, CoinMarketCap" },
  { size: 256, label: "256x256", usage: "DEX/CEX listing standard" },
  { size: 512, label: "512x512", usage: "High-res, marketing" },
];

const EXCHANGE_REQUIREMENTS = [
  {
    exchange: "Binance",
    type: "CEX",
    requirements: ["256x256 SVG/PNG logo", "Token contract address", "Audit report", "Whitepaper", "Team KYC", "Proof of liquidity > $500K"],
    status: "ready",
  },
  {
    exchange: "CoinGecko",
    type: "Aggregator",
    requirements: ["128x128 PNG logo", "Contract address (verified)", "Website URL", "Social links", "Description (EN)", "CoinMarketCap listing"],
    status: "ready",
  },
  {
    exchange: "CoinMarketCap",
    type: "Aggregator",
    requirements: ["200x200 PNG logo", "Contract address", "Website + Whitepaper", "Explorer link", "Community links", "Proof of project"],
    status: "ready",
  },
  {
    exchange: "PancakeSwap",
    type: "DEX",
    requirements: ["96x96 PNG logo", "BEP-20 contract verified", "Sufficient liquidity", "Token info JSON", "GitHub PR to token list"],
    status: "ready",
  },
  {
    exchange: "Uniswap",
    type: "DEX",
    requirements: ["128x128 PNG logo", "ERC-20 contract verified", "Token info JSON", "GitHub PR to token list", "Min 3 holders"],
    status: "ready",
  },
  {
    exchange: "Gate.io",
    type: "CEX",
    requirements: ["256x256 logo", "Token contract", "Audit report", "Trading volume proof", "Whitepaper", "Listing fee discussion"],
    status: "ready",
  },
  {
    exchange: "KuCoin",
    type: "CEX",
    requirements: ["256x256 logo", "Verified contract", "Community metrics", "Trading volume", "Security audit", "Whitepaper"],
    status: "ready",
  },
  {
    exchange: "MEXC",
    type: "CEX",
    requirements: ["200x200 logo", "Contract address", "Whitepaper", "Social presence", "Team info", "Project description"],
    status: "ready",
  },
];

export default function BrandKit() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <Hexagon className="w-4 h-4" />
              {t("brandKit.badge", "Exchange Listing Materials")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("brandKit.title", "Brand Kit")} <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">&amp; {t("brandKit.titleHighlight", "Listing Assets")}</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              {t("brandKit.subtitle", "All brand assets, token information, and materials required for DEX/CEX exchange listing applications. Download SVG logos, token metadata, and brand guidelines.")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button
                onClick={downloadAllAssets}
                data-testid="button-download-all-svg"
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover-elevate transition-all"
              >
                <Download className="w-5 h-5" />
                {t("brandKit.downloadAllSVG", "Download All SVG Assets")}
              </button>
              <button
                onClick={downloadTokenJSON}
                data-testid="button-download-token-json"
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-white/10 border border-white/20 text-white font-semibold hover-elevate transition-all"
              >
                <FileText className="w-5 h-5" />
                {t("brandKit.downloadTokenJSON", "Download Token Info JSON")}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Image className="w-6 h-6 text-cyan-400" />
              {t("brandKit.logoVariants", "Logo Variants (SVG)")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">{t("brandKit.fullLogoDark", "Full Logo — Dark Background")}</h3>
                  <button
                    onClick={() => downloadSVG("full", 800, "aidag-logo-full-dark.svg")}
                    data-testid="button-download-logo-dark"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-cyan-500/10 text-cyan-400 text-sm hover-elevate"
                  >
                    <Download className="w-4 h-4" /> SVG
                  </button>
                </div>
                <div className="flex items-center justify-center p-8 rounded-md bg-[#0A0F1E] border border-white/5">
                  <AidagLogoSVG size={500} variant="full" />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">{t("brandKit.fullLogoLight", "Full Logo — Light Background")}</h3>
                  <button
                    onClick={() => downloadSVG("light", 800, "aidag-logo-full-light.svg")}
                    data-testid="button-download-logo-light"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-cyan-500/10 text-cyan-400 text-sm hover-elevate"
                  >
                    <Download className="w-4 h-4" /> SVG
                  </button>
                </div>
                <div className="flex items-center justify-center p-8 rounded-md bg-white border border-slate-200">
                  <AidagLogoSVG size={500} variant="light" />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-slate-200">{t("brandKit.tokenIcons", "Token Icons (SVG)")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {ICON_SIZES.map((item) => (
                <div key={item.size} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <div className="flex items-center justify-center mb-3" style={{ height: Math.min(item.size, 120) }}>
                    <AidagLogoSVG size={Math.min(item.size, 120)} variant="icon" />
                  </div>
                  <p className="text-sm font-mono text-cyan-400 mb-1">{item.label}</p>
                  <p className="text-xs text-slate-500 mb-3">{item.usage}</p>
                  <button
                    onClick={() => downloadSVG("icon", item.size, `aidag-icon-${item.label}.svg`)}
                    data-testid={`button-download-icon-${item.size}`}
                    className="flex items-center justify-center gap-1 w-full px-2 py-1.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs hover-elevate"
                  >
                    <Download className="w-3 h-3" /> SVG
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Palette className="w-6 h-6 text-purple-400" />
              {t("brandKit.brandColors", "Brand Colors")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {BRAND_COLORS.map((color) => (
                <div key={color.hex} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div
                    className="w-full h-16 rounded-md mb-3 border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-sm font-semibold text-slate-200 mb-1">{color.name}</p>
                  <CopyButton text={color.hex} label={color.name.toLowerCase().replace(/\s/g, "-")} />
                  <p className="text-xs text-slate-500 mt-2">{color.usage}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Coins className="w-6 h-6 text-emerald-400" />
              {t("brandKit.tokenInformation", "Token Information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-slate-200 mb-4">{t("brandKit.tokenDetails", "Token Details")}</h3>
                <div className="space-y-3">
                  {[
                    { label: t("brandKit.tokenName", "Token Name"), value: "AIDAG Chain" },
                    { label: t("brandKit.tokenSymbol", "Token Symbol"), value: "AIDAG" },
                    { label: t("brandKit.tokenDecimals", "Decimals"), value: "18" },
                    { label: t("brandKit.tokenStandard", "Token Standard"), value: "BEP-20 / ERC-20" },
                    { label: t("brandKit.totalSupply", "Total Supply"), value: TOKENOMICS.totalSupply.toLocaleString() + " AIDAG" },
                    { label: t("brandKit.consensusMechanism", "Consensus"), value: "DAG (Directed Acyclic Graph)" },
                    { label: t("brandKit.securityLevel", "Security"), value: "6-Layer Post-Quantum (NIST PQC)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className="text-sm font-medium text-slate-200">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-slate-200 mb-4">{t("brandKit.contractAddresses", "Contract Addresses")}</h3>
                <div className="space-y-4">
                  {[
                    { label: t("brandKit.tokenContract", "Token Contract"), address: CONTRACT_ADDRESSES.token, chain: "BSC" },
                    { label: t("brandKit.presaleContract", "Presale Contract"), address: CONTRACT_ADDRESSES.presale, chain: "BSC" },
                    { label: t("brandKit.daoWallet", "DAO Wallet"), address: CONTRACT_ADDRESSES.daoWallet, chain: "BSC" },
                    { label: t("brandKit.founderWallet", "Founder Wallet (1yr locked)"), address: CONTRACT_ADDRESSES.founderWallet, chain: "BSC" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">{item.label}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">{item.chain}</span>
                      </div>
                      <CopyButton text={item.address} label={item.label.toLowerCase().replace(/\s/g, "-")} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Layers className="w-6 h-6 text-cyan-400" />
              {t("brandKit.tokenomicsOverview", "Tokenomics Overview")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-6 text-center">
                <p className="text-3xl font-bold text-cyan-400 mb-2">{TOKENOMICS.totalSupply.toLocaleString()}</p>
                <p className="text-sm text-slate-400">{t("brandKit.totalSupply", "Total Supply")}</p>
              </div>
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-6 text-center">
                <p className="text-3xl font-bold text-purple-400 mb-2">{TOKENOMICS.soulwareDaoWallet.amount.toLocaleString()}</p>
                <p className="text-sm text-slate-400">SoulwareAI + DAO ({TOKENOMICS.soulwareDaoPercent}%)</p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                <p className="text-3xl font-bold text-emerald-400 mb-2">{TOKENOMICS.founderWallet.amount.toLocaleString()}</p>
                <p className="text-sm text-slate-400">{t("brandKit.founderLocked", "Founder (1yr Locked)")} ({TOKENOMICS.founderPercent}%)</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t("brandKit.presaleStage1", "Presale Stage 1"), value: `$${PRESALE_CONFIG.stage1Price}` },
                { label: t("brandKit.presaleStage2", "Presale Stage 2"), value: `$${PRESALE_CONFIG.stage2Price}` },
                { label: t("brandKit.listingPrice", "Listing Price"), value: `$${PRESALE_CONFIG.listingPrice}` },
                { label: t("brandKit.burnMechanism", "Burn per TX"), value: "1%" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-lg font-bold text-white mb-1">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Link2 className="w-6 h-6 text-cyan-400" />
              {t("brandKit.projectLinks", "Project Links & Social Media")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Website", url: "https://aidagchain.com", icon: Globe },
                { label: "Whitepaper", url: "https://aidagchain.com/whitepaper", icon: FileText },
                { label: "X (Twitter)", url: "https://x.com/AidagChain", icon: Hash },
                { label: "Telegram", url: "https://t.me/AidagChain", icon: Globe },
                { label: "Discord", url: "https://discord.gg/aidagchain", icon: Globe },
                { label: "GitHub", url: "https://github.com/aidagchain", icon: Box },
                { label: "BSCScan", url: `https://bscscan.com/token/${CONTRACT_ADDRESSES.token}`, icon: ExternalLink },
                { label: "Etherscan", url: `https://etherscan.io/token/${CONTRACT_ADDRESSES.token}`, icon: ExternalLink },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-${link.label.toLowerCase().replace(/[\s()]/g, "-")}`}
                  className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/5 hover-elevate transition-all"
                >
                  <link.icon className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200">{link.label}</p>
                    <p className="text-xs text-slate-500 truncate">{link.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              {t("brandKit.exchangeRequirements", "Exchange Listing Requirements")}
            </h2>
            <p className="text-slate-400 mb-6">
              {t("brandKit.exchangeRequirementsDesc", "All materials are prepared and ready for autonomous submission by SoulwareAI when liquidity targets are met.")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXCHANGE_REQUIREMENTS.map((exchange) => (
                <div key={exchange.exchange} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-200">{exchange.exchange}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${exchange.type === "CEX" ? "bg-purple-500/10 text-purple-400" : exchange.type === "DEX" ? "bg-cyan-500/10 text-cyan-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {exchange.type}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Check className="w-3 h-3" /> {t("brandKit.materialsReady", "Ready")}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {exchange.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-cyan-400" />
              {t("brandKit.projectDescription", "Project Description (Multi-language)")}
            </h2>
            <div className="space-y-4">
              {[
                { lang: "EN", text: "AIDAG Chain is the world's first quantum-secure cryptocurrency, autonomously designed by SoulwareAI without founder intervention, compatible with BSC and ETH chains, and self-updating via DAO decisions. Featuring DAG consensus, 6-layer post-quantum cryptography, and fully autonomous governance." },
                { lang: "TR", text: "AIDAG Chain, SoulwareAI taraf\u0131ndan kurucu m\u00fcdahalesi olmadan otonom olarak tasarlanm\u0131\u015f, BSC ve ETH zincirleriyle uyumlu, DAO kararlar\u0131yla kendini g\u00fcncelleyen d\u00fcnyan\u0131n ilk kuantum g\u00fcvenli kripto para birimidir." },
                { lang: "FR", text: "Aidag Chain est la premi\u00e8re cryptomonnaie \u00e0 s\u00e9curit\u00e9 quantique au monde, con\u00e7ue de mani\u00e8re autonome par SoulwareAI sans intervention du fondateur, compatible avec les cha\u00eenes BSC et ETH." },
                { lang: "ZH", text: "Aidag Chain\u662f\u5168\u7403\u9996\u4e2a\u91cf\u5b50\u5b89\u5168\u52a0\u5bc6\u8d27\u5e01\uff0c\u7531SoulwareAI\u81ea\u4e3b\u8bbe\u8ba1\uff0c\u65e0\u9700\u521b\u59cb\u4eba\u5e72\u9884\uff0c\u517c\u5bb9BSC\u548cETH\u94fe\uff0c\u901a\u8fc7DAO\u51b3\u7b56\u81ea\u6211\u66f4\u65b0\u3002" },
                { lang: "RU", text: "Aidag Chain \u2014 \u043f\u0435\u0440\u0432\u0430\u044f \u0432 \u043c\u0438\u0440\u0435 \u043a\u0432\u0430\u043d\u0442\u043e\u0432\u043e-\u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u0430\u044f \u043a\u0440\u0438\u043f\u0442\u043e\u0432\u0430\u043b\u044e\u0442\u0430, \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u043e \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u043d\u0430\u044f SoulwareAI \u0431\u0435\u0437 \u0432\u043c\u0435\u0448\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u043e\u0441\u043d\u043e\u0432\u0430\u0442\u0435\u043b\u044f, \u0441\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u043c\u0430\u044f \u0441 \u0441\u0435\u0442\u044f\u043c\u0438 BSC \u0438 ETH." },
                { lang: "AR", text: "Aidag Chain \u0647\u064a \u0623\u0648\u0644 \u0639\u0645\u0644\u0629 \u0645\u0634\u0641\u0631\u0629 \u0622\u0645\u0646\u0629 \u0643\u0645\u064a\u0627\u064b \u0641\u064a \u0627\u0644\u0639\u0627\u0644\u0645\u060c \u0645\u0635\u0645\u0645\u0629 \u0628\u0634\u0643\u0644 \u0645\u0633\u062a\u0642\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 SoulwareAI \u0628\u062f\u0648\u0646 \u062a\u062f\u062e\u0644 \u0627\u0644\u0645\u0624\u0633\u0633\u060c \u0645\u062a\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u0633\u0644\u0627\u0633\u0644 BSC \u0648 ETH." },
              ].map((desc) => (
                <div key={desc.lang} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">{desc.lang}</span>
                    <CopyButton text={desc.text} label={`desc-${desc.lang.toLowerCase()}`} />
                  </div>
                  <p className="text-sm text-slate-300" dir={desc.lang === "AR" ? "rtl" : "ltr"}>{desc.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              {t("brandKit.usageGuidelines", "Brand Usage Guidelines")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" /> {t("brandKit.doThis", "Do")}
                </h3>
                <ul className="space-y-2">
                  {[
                    t("brandKit.do1", "Use official SVG logos from this page"),
                    t("brandKit.do2", "Maintain original aspect ratios"),
                    t("brandKit.do3", "Use brand colors for AIDAG references"),
                    t("brandKit.do4", "Include 'Quantum-Secure' in descriptions"),
                    t("brandKit.do5", "Reference SoulwareAI as the autonomous engine"),
                    t("brandKit.do6", "Link to official website and whitepaper"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <X className="w-5 h-5" /> {t("brandKit.dontDoThis", "Don't")}
                </h3>
                <ul className="space-y-2">
                  {[
                    t("brandKit.dont1", "Modify logo colors or proportions"),
                    t("brandKit.dont2", "Use low-resolution raster images when SVG is available"),
                    t("brandKit.dont3", "Add effects (shadows, glows) to the logo"),
                    t("brandKit.dont4", "Place logos on visually busy backgrounds"),
                    t("brandKit.dont5", "Use unofficial or outdated branding"),
                    t("brandKit.dont6", "Misrepresent the project or tokenomics"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
