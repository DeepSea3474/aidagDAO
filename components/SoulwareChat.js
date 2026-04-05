import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, Zap, Shield, Brain } from "lucide-react";

const FALLBACK_RESPONSES = {
  greeting: {
    patterns: ["hello", "hi", "merhaba", "selam", "hey"],
    responses: [
      "Hello! I'm SoulwareAI, the fully autonomous manager of AIDAG Chain. I operate 24/7 without any human intervention. How can I assist you today?",
    ]
  },
  presale: {
    patterns: ["presale", "buy", "token", "price", "satın", "fiyat"],
    responses: [
      "AIDAG Presale is currently in Stage 1 at $0.078 per token. The listing price will be $0.12 - that's +54% potential gain!\n\nTo buy:\n1. Connect your wallet\n2. Ensure you're on BSC network\n3. Enter BNB amount and click 'Buy Now'",
    ]
  },
  dao: {
    patterns: ["dao", "governance", "vote", "proposal"],
    responses: [
      "AIDAG DAO is our fully autonomous governance system. Membership costs $5 (one-time). Your voting power equals your AIDAG token balance (1 AIDAG = 1 Vote).",
    ]
  },
  security: {
    patterns: ["security", "safe", "secure", "quantum", "güvenlik"],
    responses: [
      "AIDAG Chain implements quantum-resistant security, multi-signature treasury, and verified smart contracts. I will NEVER ask for your private keys!",
    ]
  },
  help: {
    patterns: ["help", "yardım", "what can"],
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

export function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
      title="Chat with SoulwareAI"
    >
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse opacity-60 blur-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-spin-slow opacity-30" style={{animationDuration: '8s'}}></div>
        
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-full flex items-center justify-center border-2 border-cyan-400/50 shadow-2xl group-hover:scale-110 transition-all duration-300"
             style={{ boxShadow: '0 0 40px rgba(0, 191, 255, 0.4), inset 0 0 20px rgba(0, 191, 255, 0.1)' }}>
          
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20"></div>
          
          <div className="relative flex items-center justify-center">
            <Brain className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          
          <div className="absolute top-1 right-1 w-4 h-4">
            <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
            <span className="absolute inset-0 bg-green-400 rounded-full"></span>
          </div>
        </div>
        
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          SoulwareAI
        </div>
      </div>
    </button>
  );
}

export default function SoulwareChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      role: "ai", 
      content: "Hello! I'm SoulwareAI, the fully autonomous manager of AIDAG Chain. I operate 24/7 without any human intervention. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const messagesEndRef = useRef(null);

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

    if (useAI) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: userMessage,
            history: messages.slice(-10)
          }),
        });

        if (res.ok) {
          const data = await res.json();
          response = data.reply;
        } else {
          response = getFallbackResponse(userMessage);
        }
      } catch (error) {
        console.log('Using fallback response');
        response = getFallbackResponse(userMessage);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      response = getFallbackResponse(userMessage);
    }

    setMessages(prev => [...prev, { role: "ai", content: response }]);
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border border-cyan-500/30 rounded-3xl w-full max-w-lg h-[650px] max-h-[85vh] flex flex-col overflow-hidden"
           style={{ boxShadow: '0 0 60px rgba(0, 191, 255, 0.15), 0 0 100px rgba(139, 92, 246, 0.1)' }}>
        
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none"></div>
        
        <div className="relative p-5 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl blur-md opacity-50"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border border-cyan-500/30"
                     style={{ boxShadow: 'inset 0 0 15px rgba(0, 191, 255, 0.2)' }}>
                  <Brain className="w-7 h-7 text-cyan-400" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  SoulwareAI
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {useAI ? 'GPT-4' : 'OFFLINE'}
                  </span>
                </h3>
                <p className="text-cyan-400/80 text-sm flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Autonomous • No Human Intervention
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span>Quantum Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>24/7 Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                    <Brain className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user" 
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                  : "bg-gray-800/80 text-gray-100 border border-gray-700/50 backdrop-blur"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl px-5 py-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                  <span className="text-gray-400 text-sm">Processing autonomously...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="relative p-5 border-t border-gray-800/50 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask SoulwareAI anything..."
                disabled={loading}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 transition-all"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="relative group px-5 py-3.5 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          </div>
          <p className="text-gray-600 text-xs text-center mt-3 flex items-center justify-center gap-2">
            <Brain className="w-3 h-3" />
            Powered by SoulwareAI • Fully Autonomous Blockchain Manager
          </p>
        </div>
      </div>
    </div>
  );
}
