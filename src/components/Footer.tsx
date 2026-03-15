import { Link } from "wouter";
import { SiX, SiTelegram, SiDiscord, SiGithub } from "react-icons/si";
import aidagLogo from "@assets/aidag-logo_1770572833982.jpg";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 border-t border-white/5 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-12">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group cursor-pointer">
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.4)] ring-1 ring-cyan-500/20">
                <img src={aidagLogo} alt="Aidag Chain Logo" className="w-full h-full object-cover" />
              </div>
              <div className="neon-logo-text">
                <span className="neon-logo-main">AIDAG</span>
                <span className="neon-logo-sub">CHAIN</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6" data-testid="text-footer-description">
              {t("footer.description", "The world's first quantum-secure cryptocurrency, autonomously designed by SoulwareAI and governed by DAO. Compatible with BSC and ETH chains.")}
            </p>
            <div className="flex gap-3 social-icons-row">
              <a href="https://x.com/aidagDAO" target="_blank" rel="noopener noreferrer" className="social-icon-link social-x" data-testid="link-twitter" aria-label="X / Twitter">
                <SiX className="w-4.5 h-4.5" />
              </a>
              <a href="https://t.me/Aidag_Chain_Global_Community" target="_blank" rel="noopener noreferrer" className="social-icon-link social-telegram" data-testid="link-telegram" aria-label="Telegram">
                <SiTelegram className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="social-icon-link social-discord" data-testid="link-discord" aria-label="Discord">
                <SiDiscord className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="social-icon-link social-github" data-testid="link-github" aria-label="GitHub">
                <SiGithub className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t("footer.platform", "Platform")}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/presale" className="hover:text-cyan-400 transition-colors">{t("footer.tokenPresale", "Token Presale")}</Link></li>
              <li><Link href="/staking" className="hover:text-cyan-400 transition-colors">{t("footer.stakingEarn", "Staking & Earn")}</Link></li>
              <li><Link href="/dao" className="hover:text-cyan-400 transition-colors">{t("footer.daoGovernance", "DAO Governance")}</Link></li>
              <li><Link href="/bridge" className="hover:text-cyan-400 transition-colors">{t("footer.crossChainBridge", "Cross-Chain Bridge")}</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">{t("nav.dashboard", "Dashboard")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t("footer.ecosystem", "Ecosystem")}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/explorer" className="hover:text-cyan-400 transition-colors">{t("footer.dagExplorer", "DAG Explorer")}</Link></li>
              <li><Link href="/ecosystem" className="hover:text-cyan-400 transition-colors">{t("footer.qsaasPartners", "QSaaS & Partners")}</Link></li>
              <li><Link href="/security" className="hover:text-cyan-400 transition-colors">{t("footer.quantumSecurity", "Quantum Security")}</Link></li>
              <li><Link href="/whitepaper" className="hover:text-cyan-400 transition-colors">{t("nav.whitepaper", "Whitepaper")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t("footer.community", "Community")}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="https://t.me/Aidag_Chain_Global_Community" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
              <li><a href="https://x.com/aidagDAO" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div data-testid="text-copyright">&copy; {t("footer.copyright", "Aidag Chain. Powered by SoulwareAI. All rights reserved.")}</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">{t("footer.privacy", "Privacy Policy")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("footer.terms", "Terms of Service")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
