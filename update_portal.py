import os

app_content = """
import React, { useState } from 'react';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: "aidagDAO Ecosystem",
    chains: [mainnet],
    walletConnectProjectId: "YOUR_PROJECT_ID", // Otonom sistem bunu sonra günceller
  }),
);

export default function App() {
  const [lang, setLang] = useState('TR');

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' }}>
          {/* DİL VE CÜZDAN ÜST MENÜ */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '15px' }}>
            <select onChange={(e) => setLang(e.target.value)} style={{ background: '#222', color: '#0f0', border: '1px solid #0f0' }}>
              <option value="TR">TR 🇹🇷</option>
              <option value="EN">EN 🇺🇸</option>
              <option value="DE">DE 🇩🇪</option>
            </select>
            <ConnectKitButton />
          </div>

          {/* PORTAL ANA GÖVDE */}
          <div style={{ marginTop: '10vh' }}>
            <img src="/logo.png" alt="AIDAG Logo" style={{ width: '200px' }} />
            <h1 style={{ color: '#00ffcc', letterSpacing: '5px' }}>AUTONOMOUS INFRASTRUCTURE</h1>
            
            <div style={{ margin: '40px 0' }}>
              <a href="/presale" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: '#00ffcc', color: '#000', fontWeight: 'bold', borderRadius: '5px', textDecoration: 'none', fontSize: '1.2rem' }}>
                {lang === 'TR' ? 'HIZLI AIDAG TOKEN AL' : 'FAST BUY AIDAG'}
              </a>
            </div>

            <nav style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.9rem' }}>
              <a href="/dao" style={{ color: '#aaa' }}>{lang === 'TR' ? 'Yönetişim (DAO)' : 'Governance'}</a>
              <a href="/whitepaper" style={{ color: '#aaa' }}>Whitepaper</a>
              <a href="/tokenomics" style={{ color: '#aaa' }}>{lang === 'TR' ? 'Tekonomi' : 'Tokenomics'}</a>
              <a href="/social" style={{ color: '#aaa' }}>{lang === 'TR' ? 'Sosyal Ağlar' : 'Socials'}</a>
            </nav>
          </div>
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
"""

with open('app/page.tsx', 'w') as f:
    f.write(app_content)
