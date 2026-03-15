import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import soulwareAI from "../assets/soulwareai_1770572.png";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GREETINGS: Record<string, string> = {
  en: "Hello! I'm SoulwareAI, the autonomous AI engine of AIDAG Chain. How can I assist you today?",
  tr: "Merhaba! Ben SoulwareAI, AIDAG Chain'in otonom yapay zeka motoruyum. Nasıl yardımcı olabilirim?",
  zh: "您好！我是SoulwareAI，AIDAG Chain的自主AI引擎。我能为您做什么？",
  ja: "こんにちは！私はSoulwareAI、AIDAG Chainの自律型AIエンジンです。今日は何をお手伝いできますか？",
  ko: "안녕하세요! 저는 AIDAG Chain의 자율 AI 엔진 SoulwareAI입니다. 무엇을 도와드릴까요?",
  es: "¡Hola! Soy SoulwareAI, el motor de IA autónomo de AIDAG Chain. ¿En qué puedo ayudarte hoy?",
  de: "Hallo! Ich bin SoulwareAI, die autonome KI-Engine von AIDAG Chain. Wie kann ich dir helfen?",
  fr: "Bonjour ! Je suis SoulwareAI, le moteur d'IA autonome d'AIDAG Chain. Comment puis-je vous aider aujourd'hui ?",
  ar: "مرحبًا! أنا SoulwareAI، محرك الذكاء الاصطناعي المستقل لـ AIDAG Chain. كيف يمكنني مساعدتك؟",
  ru: "Привет! Я SoulwareAI, автономный ИИ-движок AIDAG Chain. Чем могу помочь?",
  pt: "Olá! Sou o SoulwareAI, o motor de IA autônomo da AIDAG Chain. Como posso ajudar?",
  hi: "नमस्ते! मैं SoulwareAI हूं, AIDAG Chain का स्वायत्त AI इंजन. मैं आपकी कैसे सहायता कर सकता हूँ?"
};

const quickActions: Record<string, string[]> = {
  en: ["How to buy AIDAG?", "40% revenue share?", "Join the DAO", "Security model"],
  tr: ["AIDAG nasıl alınır?", "%40 gelir paylaşımı?", "DAO'ya katıl", "Güvenlik modeli"],
  zh: ["如何购买AIDAG？", "40%收益分成？", "加入DAO", "安全模型"],
  ja: ["AIDAGの買い方は？", "40%収益分配？", "DAOに参加", "セキュリティモデル"],
  ko: ["AIDAG는 어떻게 사나요?", "40% 수익 공유?", "DAO 참여", "보안 모델"],
  es: ["¿Cómo comprar AIDAG?", "¿40% de ingresos?", "Unirse al DAO", "Modelo de seguridad"],
  de: ["Wie kaufe ich AIDAG?", "40% Einnahmen?", "DAO beitreten", "Sicherheitsmodell"],
  fr: ["Comment acheter AIDAG ?", "40% de revenus ?", "Rejoindre le DAO", "Modèle de sécurité"],
  ar: ["كيف أشتري AIDAG؟", "40٪ من الإيرادات؟", "انضم إلى DAO", "نموذج الأمان"],
  ru: ["Как купить AIDAG?", "40% доходов?", "Вступить в DAO", "Модель безопасности"],
  pt: ["Como comprar AIDAG?", "40% de receitas?", "Entrar no DAO", "Modelo de segurança"],
  hi: ["AIDAG कैसे खरीदें?", "40% राजस्व?", "DAO से जुड़ें", "सुरक्षा मॉडल"]
};

export default function SoulwareAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: GREETINGS[lang] ?? GREETINGS.en, timestamp: new Date() }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFounderMode, setIsFounderMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: 0,
        role: "assistant",
        content: GREETINGS[lang] ?? GREETINGS.en,
        timestamp: new Date(),
      },
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async () => {
      const text = input.trim();
      if (!text || isTyping) return;

      if (text.includes("DeepSea3474")) {
        setIsFounderMode(true);
      }

      const userMsg: Message = {
        id: Date.now(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsTyping(true);

      const assistantId = Date.now() + 1;
      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      try {
        abortRef.current = new AbortController();

        const chatHistory = newMessages
          .filter(m => m.id !== 0)
          .map(m => ({ role: m.role, content: m.content }));

        const response = await fetch("/soulwareai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatHistory,
            language: lang,
            founderMode: isFounderMode,
          }),
          signal: abortRef.current.signal,
        });

        const data = await response.json();

        if (data.founderMode) {
          setIsFounderMode(true);
        }

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: data.message }
              : m
          ),
        );

      } catch (error) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: "[Error: AI response failed]" }
              : m
          ),
        );
      } finally {
        setIsTyping(false);
        abortRef.current = null;
      }
    },
    [input, isTyping, messages, lang, isFounderMode],
  );

  const handleQuickAction = (text: string) => {
    setInput(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const currentQuickActions = quickActions[lang] ?? quickActions.en;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-purple-600 text-white px-4 py-2 shadow-lg hover:bg-purple-500 transition"
      >
        <MessageCircle className="w-5 h-5" />
        <span>SoulwareAI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
              <div className="flex items-center gap-3">
                <img
                  src={soulwareAI}
                  alt="SoulwareAI"
                  className="w-8 h-8 rounded-full object-cover border border-purple-500/60"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    SoulwareAI
                  </span>
                  <span className="text-xs text-zinc-400">
                    Autonomous AI engine of AIDAG Chain
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isFounderMode && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Founder mode
                  </span>
                )}
                <button
                  onClick={() => {
                    if (abortRef.current) abortRef.current.abort();
                    setIsOpen(false);
                  }}
                  className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col gap-3 px-4 py-3 overflow-y-auto max-h-96 bg-gradient-to-b from-zinc-950 to-zinc-900">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className="mt-1">
                      {msg.role === "assistant" ? (
                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-800 text-zinc-100 border border-zinc-700/70"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Loader className="w-3 h-3 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/80">
              <div className="flex flex-wrap gap-2">
                {currentQuickActions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(q)}
                    className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition border border-zinc-700/60"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-950/95"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-900 text-sm text-zinc-100 px-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
