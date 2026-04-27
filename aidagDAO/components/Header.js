import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { TWITTER_URL, TELEGRAM_URL, IS_TESTNET } from "../lib/config";
import { Menu, X, ChevronDown, Wallet } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("platform", "Platform") },
    { href: "/docs", label: t("explore", "Explore") },
    { 
      label: t("learn", "Learn"),
      dropdown: true,
      items: [
        { href: "/docs", label: t("docs", "Docs") },
        { href: "/docs#whitepaper", label: t("whitepaper", "Whitepaper") },
        { href: "/docs#faq", label: "FAQ" },
      ]
    },
    { href: "/contract", label: t("smartContract", "Smart Contract") },
    { href: "/#features", label: t("features", "Features") },
    { href: "/#roadmap", label: t("roadmap", "Roadmap") },
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
                width={42} 
                height={42}
                className="rounded-full border-2 border-cyan-500/50"
                style={{ boxShadow: '0 0 15px rgba(0, 191, 255, 0.4)' }}
              />
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className="logo-aidag text-lg md:text-xl">AIDAG</span>
              <span className="logo-chain text-lg md:text-xl">CHAIN</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => {
              if (link.dropdown) {
                return (
                  <div key={index} className="relative group">
                    <button className="nav-link flex items-center gap-1">
                      {link.label}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        {link.items.map((item, i) => (
                          <Link 
                            key={i}
                            href={item.href}
                            className="block px-3 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link 
                  key={index}
                  href={link.href} 
                  className="nav-link"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {IS_TESTNET && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                TESTNET
              </span>
            )}
            <LanguageSwitcher />
            
            <button 
              onClick={() => {
                const event = new CustomEvent('openWalletModal');
                window.dispatchEvent(event);
              }}
              className="connect-wallet-btn hidden sm:flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>{t("connectWallet", "Connect Wallet")}</span>
            </button>

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
                if (link.dropdown) {
                  return (
                    <div key={index}>
                      <p className="px-4 py-2 text-gray-300 font-semibold">{link.label}</p>
                      {link.items.map((item, i) => (
                        <Link 
                          key={i}
                          href={item.href}
                          className="mobile-section-link ml-4"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 px-4">
                <button 
                  onClick={() => {
                    const event = new CustomEvent('openWalletModal');
                    window.dispatchEvent(event);
                    setMobileMenuOpen(false);
                  }}
                  className="connect-wallet-btn w-full flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{t("connectWallet", "Connect Wallet")}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
