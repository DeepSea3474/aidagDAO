import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header-main">
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex justify-between items-center">

          {/* LOGO + AIDAG CHAIN */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/aidag-logo.jpg"
              alt="AIDAG Chain Logo"
              width={50}
              height={50}
              className="rounded-full border-2 border-cyan-500/50"
              style={{ boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)' }}
            />
            <div className="flex items-center gap-1">
              <span className="text-xl md:text-2xl font-bold text-cyan-400">AIDAG</span>
              <span className="text-xl md:text-2xl font-bold text-white">CHAIN</span>
            </div>
          </Link>

          {/* DİL + MENÜ */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden mobile-menu-btn"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
