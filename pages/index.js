import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import '../src/config/i18n';

export default function AidagMainSkeleton() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const s = {
    container: { backgroundColor: '#020617', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '0 15px 100px 15px', backgroundImage: 'radial-gradient(circle at 50% 20%, #083344 0%, #020617 100%)' },
    glassCard: { background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '24px', padding: '20px', backdropFilter: 'blur(10px)', marginBottom: '15px' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '20px 0' },
    statBox: { background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px', textAlign: 'center' },
    actionBtn: (color1, color2) => ({ background: `linear-gradient(90deg, ${color1}, ${color2})`, color: '#fff', border: 'none', borderRadius: '15px', padding: '18px', fontWeight: 'bold', width: '100%', marginBottom: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }),
    badge: { background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }
  };

  return (
    <div style={s.container}>
      {/* 1. BÖLÜM: HEADER & LOGO (Önceki iskeletten devam) */}
      <header style={{ height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee, #0891b2)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>A</div>
           <span style={{ fontWeight: 'bold', letterSpacing: '1.5px' }}>AIDAG CHAIN</span>
        </div>
        <ConnectButton label="Connect" accountStatus="address" showBalance={false} />
      </header>

      {/* 2. BÖLÜM: NETWORK SELECTION */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
        <button style={{ ...s.statBox, borderColor: '#22d3ee', color: '#22d3ee', padding: '8px 20px', borderRadius: '50px' }}>● Binance Smart Chain</button>
      </div>

      {/* 3. BÖLÜM: STATS GRID */}
      <div style={s.statGrid}>
        <div style={s.statBox}>
          <div style={{ color: '#22d3ee', fontWeight: 'bold', fontSize: '16px' }}>21M</div>
          <div style={{ fontSize: '9px', color: '#94a3b8' }}>Total Supply</div>
        </div>
        <div style={s.statBox}>
          <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '16px' }}>+54%</div>
          <div style={{ fontSize: '9px', color: '#94a3b8' }}>Potential Profit</div>
        </div>
        <div style={s.statBox}>
          <div style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '16px' }}>2</div>
          <div style={{ fontSize: '9px', color: '#94a3b8' }}>Blockchains</div>
        </div>
      </div>

      {/* 4. BÖLÜM: MAIN ACTIONS */}
      <button style={s.actionBtn('#8b5cf6', '#a855f7')}>🤖 Chat with SoulwareAI</button>
      <button style={s.actionBtn('#10b981', '#059669')}>🏛️ Join DAO</button>

      {/* 5. BÖLÜM: PRESALE CARD (Görsel 2) */}
      <div style={{ ...s.glassCard, textAlign: 'center', marginTop: '30px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '10px', color: '#94a3b8' }}>YAKINDA</div>
        <div style={s.badge}>● LIVE</div>
        <h2 style={{ fontSize: '32px', margin: '10px 0' }}>Presale</h2>
        <p style={{ color: '#22d3ee', fontWeight: 'bold', marginBottom: '20px' }}>2-Stage Sale</p>

        {/* Progress Bar */}
        <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #22d3ee, #0891b2)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#22d3ee' }}>
          <span>$0.078</span>
          <span style={{ color: '#94a3b8' }}>$0.098</span>
        </div>

        {/* Stages Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' }}>
           <div style={{ ...s.statBox, background: 'rgba(34, 211, 238, 0.05)', borderColor: '#22d3ee' }}>
              <div style={{ fontSize: '10px', color: '#4ade80', marginBottom: '5px' }}>AKTİF</div>
              <div style={{ fontSize: '12px' }}>Stage 1</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>$0.078</div>
           </div>
           <div style={{ ...s.statBox, opacity: '0.5' }}>
              <div style={{ fontSize: '10px', marginBottom: '5px' }}>YAKINDA</div>
              <div style={{ fontSize: '12px' }}>Stage 2</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>$0.098</div>
           </div>
        </div>
      </div>

      {/* FLOAT AI ICON (Görseldeki Sağ Alt Beyin) */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.9)', border: '2px solid #22d3ee', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', zIndex: '1000' }}>
        🧠
        <div style={{ position: 'absolute', top: '5px', right: '5px', width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80', border: '2px solid #020617' }}></div>
      </div>
    </div>
  );
}
