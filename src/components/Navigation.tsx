import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, X, ChevronRight, ChevronDown, Wallet, LogOut, Globe,
  Languages, Check, Coins, ArrowDownUp, Eye, Shield, FileText,
  Brain, Vote, TrendingUp, Activity, Layers, Zap, Sparkles,
  Palette, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/walletContext";
import { BSC_CHAIN_ID } from "@/lib/web3Config";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "@/lib/i18n";
import aidagLogo from "@assets/aidag-logo_1770572833982.jpg";

interface NavItem {
  name: string;
  href: string;
  isHash?: boolean;
  icon?: any;
  desc?: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const wallet = useWallet();
  const { t, i18n } = useTranslation();
  
  const navGroups: NavGroup[] = [
    {
      name: t("nav.platform", "Platform"),
      items: [
        { name: t("presale.title", "Presale"), href: "/presale", icon: Zap, desc: t("nav.descBuyTokens", "Buy AIDAG tokens") },
        { name: t("nav.staking", "Staking"), href: "/staking", icon: Coins, desc: t("nav.descEarnApy", "Earn up to 35% APY") },
        { name: t("nav.dao", "DAO"), href: "/dao", icon: Vote, desc: t("nav.descGovernance", "Governance & voting") },
        { name: t("nav.bridge", "Bridge"), href: "/bridge", icon: ArrowDownUp, desc: t("nav.descCrossChain", "Cross-chain transfer") },
      ],
    },
    {
      name: t("nav.explore", "Explore"),
      items: [
        { name: t("nav.dashboard", "Dashboard"), href: "/dashboard", icon: Activity, desc: t("nav.descLiveOps", "Live operations") },
        { name: t("nav.explorer", "Explorer"), href: "/explorer", icon: Eye, desc: t("nav.descBlockExplorer", "DAG block explorer") },
        { name: t("nav.ecosystem", "Ecosystem"), href: "/ecosystem", icon: Globe, desc: t("nav.descQsaasDeFi", "QSaaS & DeFi") },
      ],
    },
    {
      name: t("nav.learn", "Learn"),
      items: [
        { name: t("nav.security", "Security"), href: "/security", icon: Shield, desc: t("nav.descQuantumProtection", "Quantum protection") },
        { name: t("nav.whitepaper", "Whitepaper"), href: "/whitepaper", icon: FileText, desc: t("nav.descTechnicalDocs", "Technical docs") },
        { name: t("nav.brandKit", "Brand Kit"), href: "/brand-kit", icon: Palette, desc: t("nav.descBrandKit", "Logos & assets") },
        { name: t("nav.exchangeListing", "Exchange Listing"), href: "/exchange-listing", icon: BarChart3, desc: t("nav.descExchangeListing", "Autonomous listing") },
      ],
    },
  ];

  const quickLinks: NavItem[] = [
    { name: t("nav.features", "Features"), href: "/#features", isHash: true },
    { name: t("nav.roadmap", "Roadmap"), href: "/#roadmap", isHash: true },
  ];
  const langRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, isHash: boolean) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    if (isHash && location === "/") {
      const id = href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const handleBuyClick = () => {
    if (wallet.isConnected) {
      // If already connected, just go to presale page
      window.location.href = "/presale";
    } else {
      // If not connected, trigger wallet connection modal first
      wallet.setShowWalletModal(true);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer flex-shrink-0" data-testid="link-logo">
            <div className="w-9 h-9 rounded-lg overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_24px_rgba(6,182,212,0.6)] transition-shadow ring-1 ring-cyan-500/20">
              <img src={aidagLogo} alt="Aidag Chain" className="w-full h-full object-cover" />
            </div>
            <div className="neon-logo-text">
              <span className="neon-logo-main" data-testid="text-logo-name">AIDAG</span>
              <span className="neon-logo-sub">CHAIN</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
            {navGroups.map((group) => (
              <div key={group.name} className="relative"
                onMouseEnter={() => handleDropdownEnter(group.name)}
                onMouseLeave={handleDropdownLeave}>
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm transition-all rounded-lg",
                    openDropdown === group.name
                      ? "text-cyan-400 bg-white/5"
                      : "text-slate-300 hover:text-white hover:bg-white/5",
                    navGroups.find(g => g.name === group.name)?.items.some(i => i.href === location)
                      ? "text-cyan-400"
                      : ""
                  )}
                  data-testid={`button-nav-${group.name.toLowerCase()}`}
                >
                  {group.name}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === group.name && "rotate-180")} />
                </button>

                {openDropdown === group.name && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-2 nav-dropdown z-50">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.href;
                      return (
                        <Link key={item.name} href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className={cn("nav-dropdown-item", isActive && "!text-cyan-400 bg-cyan-500/5")}
                          data-testid={`link-nav-${item.name.toLowerCase()}`}>
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center nav-dd-icon transition-all duration-300",
                            isActive
                              ? "bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                              : "bg-white/5 text-slate-400 border border-white/5"
                          )}>
                            {Icon && <Icon className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{item.name}</div>
                            {item.desc && <div className="text-[10px] text-slate-500">{item.desc}</div>}
                          </div>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {quickLinks.map((link) => (
              <a key={link.name} href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); if (location !== "/") window.location.href = link.href; }}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                data-testid={`link-nav-${link.name.toLowerCase()}`}>
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleBuyClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all animate-pulse-subtle active:scale-95"
              data-testid="button-nav-buy"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.buyAidag", "Buy AIDAG")}</span>
              <span className="sm:hidden">{t("nav.buy", "Buy")}</span>
            </button>

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-white/10 hover:border-cyan-500/30"
                data-testid="button-language-selector"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold">{currentLang.name}</span>
                <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isLangOpen && "rotate-180")} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-2 z-50 max-h-80 overflow-y-auto lang-dropdown">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t("nav.selectLanguage", "Select Language")}</span>
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setIsLangOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-white/5",
                        i18n.language === lang.code ? "text-cyan-400" : "text-slate-300 hover:text-white"
                      )}
                      data-testid={`button-lang-${lang.code}`}
                    >
                      <span className="text-base w-6 text-center">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.name}</span>
                      {i18n.language === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {wallet.isConnected ? (
              <div className="flex items-center gap-2">
                {!wallet.isCorrectChain && (
                  <button onClick={() => wallet.switchChain(BSC_CHAIN_ID)}
                    className="hidden sm:flex px-3 py-2 text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg font-bold hover:bg-yellow-500/20 transition-colors"
                    data-testid="button-switch-network">
                    <Globe className="w-3 h-3 inline mr-1" /> {t("nav.switchToBsc", "Switch to BSC")}
                  </button>
                )}
                <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white font-mono">{wallet.shortAddress}</span>
                  <span className="hidden sm:inline text-[10px] text-slate-400">{wallet.chainName && `(${wallet.chainName})`}</span>
                </div>
                <button onClick={wallet.disconnect}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                  data-testid="button-disconnect"
                  title={t("nav.disconnect", "Disconnect")}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => wallet.setShowWalletModal(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
                data-testid="button-connect-wallet">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.connectWallet", "Connect Wallet")}</span>
                <span className="sm:hidden">{t("nav.wallet", "Wallet")}</span>
              </button>
            )}

            <button className="lg:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-xl border-b border-white/5 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navGroups.map((group) => (
              <div key={group.name}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === group.name ? null : group.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                  data-testid={`button-mobile-${group.name.toLowerCase()}`}>
                  <span className="font-medium text-sm">{group.name}</span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", mobileExpanded === group.name && "rotate-180")} />
                </button>
                {mobileExpanded === group.name && (
                  <div className="pl-4 space-y-0.5 mb-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                            location === item.href ? "text-cyan-400 bg-cyan-500/5" : "text-slate-400 hover:text-white hover:bg-white/5"
                          )}
                          data-testid={`link-mobile-${item.name.toLowerCase()}`}>
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center",
                            location === item.href ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-400"
                          )}>
                            {Icon && <Icon className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="text-sm">{item.name}</div>
                            {item.desc && <div className="text-[10px] text-slate-500">{item.desc}</div>}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-white/5 pt-2 space-y-0.5">
              {quickLinks.map((link) => (
                <a key={link.name} href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); if (location !== "/") window.location.href = link.href; }}
                  className="flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-sm">{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
              ))}
            </div>

            <div className="border-t border-white/5 pt-2">
              <div className="px-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t("nav.language", "Language")}</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border",
                        i18n.language === lang.code
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                          : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                      data-testid={`button-mobile-lang-${lang.code}`}
                    >
                      <span>{lang.flag}</span>
                      <span className="uppercase font-medium">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-2 space-y-2">
              <button onClick={() => { handleBuyClick(); setIsMobileMenuOpen(false); }}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
                data-testid="button-mobile-buy">
                <Zap className="w-4 h-4" /> {t("nav.buyAidagToken", "Buy AIDAG Token")}
              </button>
              {wallet.isConnected ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-white font-mono">{wallet.shortAddress}</span>
                  </div>
                  <button onClick={wallet.disconnect} className="text-red-400 text-sm">{t("nav.disconnect", "Disconnect")}</button>
                </div>
              ) : (
                <button onClick={() => { wallet.setShowWalletModal(true); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95">
                  <Wallet className="w-4 h-4" /> {t("nav.connectWallet", "Connect Wallet")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
