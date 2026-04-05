import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { TWITTER_URL, TELEGRAM_URL } from "../lib/config";
import { Home, Rocket, Building2, FileText, BarChart3, Bot, Gem, Shield, Map, HelpCircle, Menu, X, ChevronDown, Layers } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home"), Icon: Home },
    { href: "/presale", label: t("presale"), Icon: Rocket },
    { href: "/dao", label: t("dao"), Icon: Building2 },
    { href: "/docs", label: t("docs"), Icon: FileText }
  ];

  const sectionLinks = [
    { href: "#stats", label: "Statistics", Icon: BarChart3 },
    { href: "#soulware", label: "SoulwareAI", Icon: Bot },
    { href: "#tokenomics", label: "Tokenomics", Icon: Gem },
    { href: "#security", label: "Security", Icon: Shield },
    { href: "#roadmap", label: "Roadmap", Icon: Map },
    { href: "#faq", label: "FAQ", Icon: HelpCircle }
  ];

  return (
    <header className="header-main">
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="logo-container">
            <div className="relative">
              <Image 
                src="/aidag-logo.jpg" 
                alt="AIDAG Chain Logo" 
                width={50} 
                height={50}
                className="rounded-full border-2 border-cyan-500/50"
                style={{ boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)' }}
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="logo-aidag text-xl md:text-2xl">AIDAG</span>
              <span className="logo-chain text-xl md:text-2xl">CHAIN</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const IconComponent = link.Icon;
              return (
                <Link 
                  key={index}
                  href={link.href} 
                  className="nav-link"
                >
                  <IconComponent className="w-4 h-4 hidden xl:inline" />
                  {link.label}
                </Link>
              );
            })}
            
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            
            <div className="relative group">
              <button className="nav-link flex items-center gap-1">
                <Layers className="w-4 h-4 hidden xl:inline" />
                Content
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {sectionLinks.map((link, index) => {
                    const IconComponent = link.Icon;
                    return (
                      <a 
                        key={index}
                        href={link.href}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                      >
                        <IconComponent className="w-4 h-4" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2">
              {TWITTER_URL && (
                <a 
                  href={TWITTER_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  title="Twitter/X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {TELEGRAM_URL && (
                <a 
                  href={TELEGRAM_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  title="Telegram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
              )}
            </div>
            
            <LanguageSwitcher />
            
            <Link href="/presale" className="presale-btn hidden sm:flex">
              <Rocket className="w-4 h-4" />
              <span className="hidden md:inline">Presale</span>
            </Link>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden mobile-menu-btn"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <nav className="space-y-2">
              {navLinks.map((link, index) => {
                const IconComponent = link.Icon;
                return (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-800 my-3 pt-3">
                <p className="text-xs text-gray-500 px-4 mb-2">Page Content</p>
                {sectionLinks.map((link, index) => {
                  const IconComponent = link.Icon;
                  return (
                    <a 
                      key={index}
                      href={link.href}
                      className="mobile-section-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-4 h-4" />
                      {link.label}
                    </a>
                  );
                })}
              </div>

              <div className="flex gap-2 px-4 pt-2">
                {TWITTER_URL && (
                  <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="mobile-social-btn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter
                  </a>
                )}
                {TELEGRAM_URL && (
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="mobile-social-btn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Telegram
                  </a>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
