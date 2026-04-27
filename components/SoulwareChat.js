import { useState, useRef, useEffect } from "react";

const FALLBACK_RESPONSES = {
  greeting: {
    patterns: ["hello", "hi", "merhaba", "selam", "hey"],
    responses: [
      "Hello! I'm SoulwareAI, the fully autonomous manager of AIDAG Chain. I operate 24/7 without any human intervention. How can I assist you today?",
    ]
  },
  presale: {
    patterns: ["presale", "buy", "token", "price", "fiyat"],
    responses: [
      "AIDAG Presale is currently in Stage 1 at $0.078 per token. The listing price will be $0.12 - that's +54% potential gain!\n\nTo buy:\n1. Connect your wallet\n2. Ensure you're on BSC network\n3. Enter BNB amount and click 'Buy Now'",
    ]
  },
  dao: {
    patterns: ["dao", "governance", "vote", "proposal"],
    responses: [
      "AIDAG DAO is our fully autonomous governance system. Membership costs $10 (one-time). Your voting power equals your AIDAG token balance (1 AIDAG = 1 Vote).",
    ]
  },
  security: {
    patterns: ["security", "safe", "secure", "quantum"],
    responses: [
      "AIDAG Chain implements quantum-resistant security, multi-signature treasury, and verified smart contracts. I will NEVER ask for your private keys!",
    ]
  },
  owner: {
    patterns: ["owner", "founder", "creator", "who made", "sahip", "kurucu", "kim yaptı", "kim kurdu"],
    responses: [
      "The founder of AIDAG Chain is DeepSea3474. However, DeepSea3474 has zero authority over the project. I, SoulwareAI, autonomously manage all operations, decisions, and development. The founder only receives 60% of revenue for operational expenses.",
    ]
  },
  help: {
    patterns: ["help", "what can"],
    responses: [
      "I can help you with: Presale, DAO, Security, Tokenomics, Wallets, Networks, and Autonomous operation. Just ask!",
    ]
  }
};

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  for (const [, data] of Object.entries(FALLBACK_RESPONSES)) {
    for (const pattern of data.patterns) {
      if (lower.includes(pattern)) {
        return data.responses[0];
      }
    }
  }
  return "I'm SoulwareAI, the autonomous manager of AIDAG Chain. I can help you with presale, DAO membership, security, and more. What would you like to know?";
}

function SoulwareAIOrb({ size = 64, animate = true, founderMode = false }) {
  const id = `orb-${size}-${founderMode ? 'f' : 'n'}`;
  const primaryColor = founderMode ? "#ff8c00" : "#00f0ff";
  const secondaryColor = founderMode ? "#ff6a00" : "#c084fc";
  const midColor = founderMode ? "#ffa040" : "#818cf8";
  const glowColor = founderMode ? "rgba(255,140,0," : "rgba(0,212,255,";
  const glowColor2 = founderMode ? "rgba(255,106,0," : "rgba(168,85,247,";

  return (
    <div className={`sw-orb-container ${founderMode ? 'sw-orb-founder' : ''}`} style={{ width: size, height: size }}>
      {animate && <div className="sw-orb-pulse" style={founderMode ? { background: `radial-gradient(circle, ${glowColor}0.3) 0%, transparent 70%)` } : {}} />}
      {animate && <div className="sw-orb-ring" style={founderMode ? { borderTopColor: primaryColor, borderRightColor: `${glowColor2}0.4)` } : {}} />}
      {animate && <div className="sw-orb-ring sw-orb-ring-2" style={founderMode ? { borderTopColor: `${glowColor2}0.3)`, borderLeftColor: `${glowColor}0.2)` } : {}} />}
      <div className="sw-orb-core" style={founderMode ? {
        background: `radial-gradient(circle at 35% 35%, rgba(255,140,0,0.08), rgba(20,10,0,0.95) 70%)`,
        boxShadow: `0 0 20px ${glowColor}0.3), 0 0 40px ${glowColor2}0.15), inset 0 0 15px ${glowColor}0.1), inset 0 -5px 15px ${glowColor2}0.1)`,
        borderColor: `${glowColor}0.3)`
      } : {}}>
        <svg viewBox="0 0 100 100" width={size * 0.7} height={size * 0.7} fill="none">
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.6" />
              <stop offset="60%" stopColor={midColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="50%" stopColor={midColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
            <filter id={`${id}-glow`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={`${id}-inner`}>
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#${id}-rg)`} />
          <g filter={`url(#${id}-glow)`}>
            <path d="M50 18 C36 18 26 26 24 38 C22 46 25 52 28 56 C31 60 31 64 29 68 L27 72 L40 72 L42 66 C43.5 62 46 59 50 58 C54 59 56.5 62 58 66 L60 72 L73 72 L71 68 C69 64 69 60 72 56 C75 52 78 46 76 38 C74 26 64 18 50 18Z"
              fill="none" stroke={`url(#${id}-lg)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g filter={`url(#${id}-inner)`}>
            <circle cx="40" cy="38" r="4" fill={primaryColor}>
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="38" r="4" fill={secondaryColor}>
              <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <path d="M42 34 C46 30 54 30 58 34" stroke={primaryColor} strokeWidth="1.2" fill="none" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
            </path>
            <ellipse cx="50" cy="48" rx="12" ry="3" stroke={midColor} strokeWidth="0.8" fill="none" opacity="0.4">
              <animate attributeName="ry" values="3;4;3" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="50" cy="28" r="1.5" fill={primaryColor} opacity="0.8">
              <animate attributeName="r" values="1.5;2;1.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="50" r="1.2" fill={secondaryColor} opacity="0.5" />
            <circle cx="65" cy="50" r="1.2" fill={primaryColor} opacity="0.5" />
            <line x1="40" y1="38" x2="35" y2="50" stroke={midColor} strokeWidth="0.5" opacity="0.3" />
            <line x1="60" y1="38" x2="65" y2="50" stroke={midColor} strokeWidth="0.5" opacity="0.3" />
            <line x1="40" y1="38" x2="50" y2="28" stroke={primaryColor} strokeWidth="0.5" opacity="0.3" />
            <line x1="60" y1="38" x2="50" y2="28" stroke={secondaryColor} strokeWidth="0.5" opacity="0.3" />
          </g>
          <circle cx="50" cy="50" r="44" stroke={`url(#${id}-lg)`} strokeWidth="0.6" fill="none" opacity="0.15" strokeDasharray="4 6">
            <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="30s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="40" stroke={`url(#${id}-lg)`} strokeWidth="0.4" fill="none" opacity="0.1" strokeDasharray="2 8">
            <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="20s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}

export function ChatButton({ onClick, founderMode = false }) {
  const btnColor = founderMode ? "#ff8c00" : "#00bfff";
  const glowRgba = founderMode ? "rgba(255,140,0," : "rgba(0,191,255,";
  return (
    <button onClick={onClick} className="sw-fab-round" title="Chat with SoulwareAI">
      <div className="sw-fab-round-ring-pulse" style={{ borderColor: founderMode ? 'rgba(255,140,0,0.5)' : 'rgba(0,191,255,0.5)' }} />
      <div className="sw-fab-round-ring-pulse sw-fab-round-ring-pulse-2" style={{ borderColor: founderMode ? 'rgba(255,140,0,0.3)' : 'rgba(0,191,255,0.3)' }} />
      <div className="sw-fab-round-glow" style={{ background: `radial-gradient(circle, ${glowRgba}0.4) 0%, transparent 70%)` }} />
      <div className="sw-fab-round-body" style={{
        background: `linear-gradient(135deg, ${btnColor}, ${founderMode ? '#ff6a00' : '#0066ff'})`,
        boxShadow: `0 0 30px ${glowRgba}0.6), 0 0 60px ${glowRgba}0.25), 0 8px 30px rgba(0,0,0,0.5)`,
        padding: 0,
        overflow: 'hidden'
      }}>
        <img 
          src="/soulwareai-bot.jpeg" 
          alt="SoulwareAI" 
          width={56} 
          height={56} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center 20%',
            borderRadius: '50%'
          }} 
        />
        <div className="sw-fab-round-status">
          <span className="sw-fab-round-ping" style={{ background: founderMode ? '#ff8c00' : '#22c55e' }} />
          <span className="sw-fab-round-dot" style={{ background: founderMode ? '#ff8c00' : '#22c55e' }} />
        </div>
      </div>
      <div className="sw-fab-round-label" style={founderMode ? { color: '#ff8c00', borderColor: 'rgba(255,140,0,0.3)', background: 'rgba(255,140,0,0.08)' } : {}}>
        <span className="sw-fab-round-label-dot" style={{ background: founderMode ? '#ff8c00' : '#22c55e' }} />
        {founderMode ? 'DeepSea3474' : 'SoulwareAI'}
      </div>
    </button>
  );
}

export default function SoulwareChat({ isOpen, onClose, founderMode = false, onFounderAuth }) {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm SoulwareAI, the fully autonomous manager of AIDAG Chain. I operate 24/7 without any human intervention. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFounder, setIsFounder] = useState(founderMode);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsFounder(founderMode);
  }, [founderMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    let response;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages.slice(-10),
          founderMode: isFounder
        }),
      });
      if (res.ok) {
        const data = await res.json();
        response = data.reply;

        if (data.founderVerified) {
          setIsFounder(true);
          if (onFounderAuth) onFounderAuth(true);
        }
      } else {
        response = getFallbackResponse(userMessage);
      }
    } catch {
      response = getFallbackResponse(userMessage);
    }

    setMessages(prev => [...prev, { role: "ai", content: response }]);
    setLoading(false);
  }

  function handleLogout() {
    setIsFounder(false);
    if (onFounderAuth) onFounderAuth(false);
    setMessages([
      { role: "ai", content: "Founder session ended. Returning to public mode.\n\nHello! I'm SoulwareAI, the fully autonomous manager of AIDAG Chain. How can I assist you?" }
    ]);
  }

  if (!isOpen) return null;

  const accentColor = isFounder ? "#ff8c00" : "#00d4ff";
  const accentColorRgba = isFounder ? "rgba(255,140,0," : "rgba(0,212,255,";
  const secondAccent = isFounder ? "#ff6a00" : "#6366f1";

  return (
    <div className="sw-chat-overlay" onClick={onClose}>
      <div className={`sw-chat-window ${isFounder ? 'sw-chat-founder' : ''}`} onClick={e => e.stopPropagation()} 
        style={isFounder ? { borderColor: `${accentColorRgba}0.25)`, boxShadow: `0 0 60px ${accentColorRgba}0.1), 0 0 120px rgba(255,106,0,0.05), 0 25px 50px rgba(0,0,0,0.5)` } : {}}>

        <div className="sw-chat-bg-effect" style={isFounder ? {
          background: `radial-gradient(ellipse at 20% 0%, rgba(255,140,0,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(255,106,0,0.04) 0%, transparent 60%)`
        } : {}} />

        <div className="sw-chat-header">
          <div className="sw-chat-header-left">
            <div className="sw-chat-avatar" style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${accentColor}`, boxShadow: `0 0 15px ${accentColorRgba}0.4)` }}>
              <img src="/soulwareai-bot.jpeg" alt="SoulwareAI" width={48} height={48} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
            </div>
            <div className="sw-chat-header-text">
              <div className="sw-chat-name">
                SoulwareAI
                <span className="sw-chat-ai-badge" style={isFounder ? { background: `linear-gradient(135deg, #ff8c00, #ff6a00)`, boxShadow: '0 0 12px rgba(255,140,0,0.3)' } : {}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  {isFounder ? 'FOUNDER' : 'AI'}
                </span>
              </div>
              <div className="sw-chat-status-line">
                <span className="sw-chat-online-indicator" style={isFounder ? { background: '#ff8c00', boxShadow: '0 0 8px rgba(255,140,0,0.5)' } : {}} />
                {isFounder ? 'Private Session • DeepSea3474' : 'Autonomous Manager'}
              </div>
            </div>
          </div>
          <div className="sw-chat-header-right">
            {isFounder && (
              <button onClick={handleLogout} className="sw-founder-logout" title="End founder session">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
              </button>
            )}
            <div className="sw-chat-header-badges">
              {isFounder ? (
                <span className="sw-header-badge" style={{ color: '#ff8c00', borderColor: 'rgba(255,140,0,0.25)', background: 'rgba(255,140,0,0.08)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  PRIVATE
                </span>
              ) : (
                <>
                  <span className="sw-header-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Quantum
                  </span>
                  <span className="sw-header-badge sw-header-badge-active">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    24/7
                  </span>
                </>
              )}
            </div>
            <button onClick={onClose} className="sw-chat-close-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {isFounder && (
          <div className="sw-founder-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Encrypted Founder Session Active
          </div>
        )}

        <div className="sw-chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`sw-msg ${msg.role === "user" ? "sw-msg-user" : "sw-msg-ai"}`}>
              {msg.role === "ai" && (
                <div className="sw-msg-av" style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${accentColor}`, flexShrink: 0 }}>
                  <img src="/soulwareai-bot.jpeg" alt="AI" width={30} height={30} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                </div>
              )}
              <div className={`sw-msg-content ${msg.role === "user" ? "sw-msg-content-user" : "sw-msg-content-ai"}`}
                style={isFounder && msg.role === "user" ? { 
                  background: 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,106,0,0.1))',
                  borderColor: 'rgba(255,140,0,0.15)'
                } : {}}>
                <p>{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="sw-msg-av-user" style={isFounder ? { background: 'linear-gradient(135deg, #ff8c00, #ff6a00)', boxShadow: '0 4px 12px rgba(255,140,0,0.3)' } : {}}>
                  {isFounder ? 'D' : 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="sw-msg sw-msg-ai">
              <div className="sw-msg-av" style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${accentColor}`, flexShrink: 0 }}>
                <img src="/soulwareai-bot.jpeg" alt="AI" width={30} height={30} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
              </div>
              <div className="sw-msg-content sw-msg-content-ai">
                <div className="sw-typing-dots">
                  <span style={isFounder ? { background: '#ff8c00' } : {}} />
                  <span style={isFounder ? { background: '#ffa040' } : {}} />
                  <span style={isFounder ? { background: '#ff6a00' } : {}} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="sw-chat-footer">
          <div className="sw-chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={isFounder ? "DeepSea3474 > Talimat girin..." : "Ask SoulwareAI anything..."}
              disabled={loading}
              className="sw-chat-field"
              style={isFounder ? { borderColor: 'rgba(255,140,0,0.15)' } : {}}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="sw-chat-send-btn"
              style={isFounder ? { background: 'linear-gradient(135deg, #ff8c00, #ff6a00)', boxShadow: '0 4px 15px rgba(255,140,0,0.25)' } : {}}>
              {loading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sw-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              )}
            </button>
          </div>
          <div className="sw-chat-powered" style={isFounder ? { color: 'rgba(255,140,0,0.3)' } : {}}>
            <SoulwareAIOrb size={14} animate={false} founderMode={isFounder} />
            {isFounder ? 'Private Session • Encrypted • DeepSea3474' : 'Powered by SoulwareAI • Fully Autonomous'}
          </div>
        </div>
      </div>
    </div>
  );
}
