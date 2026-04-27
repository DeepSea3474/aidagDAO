import './globals.css';
import { WalletProvider } from '../lib/WalletContext';
import { LanguageProvider } from '../lib/LanguageContext';
import WalletModal from '../components/WalletModal';
import SoulwareBootstrap from '../components/SoulwareBootstrap';

export const metadata = {
  title: 'AIDAG DAO — AI-Managed Decentralized Chain',
  description: "The world's first fully autonomous AI-managed cryptocurrency. SoulwareAI — AIDAG Chain's own brain & cell system — governs the chain. 21M fixed supply on BSC.",
  keywords: 'AIDAG, DAO, SoulwareAI, cryptocurrency, BSC, autonomous, AI blockchain, LSC Chain, DeepSea3474',
  openGraph: {
    title: 'AIDAG DAO — SoulwareAI Autonomous Chain',
    description: "First fully autonomous AI-managed cryptocurrency. SoulwareAI + DAO governance. Not OpenAI. Not any external AI.",
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#020617] text-white antialiased">
        <LanguageProvider>
          <WalletProvider>
            <SoulwareBootstrap />
            {children}
            <WalletModal />
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
