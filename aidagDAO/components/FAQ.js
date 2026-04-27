import { useState } from "react";

const faqs = [
  {
    question: "What is AIDAG Chain?",
    answer: "AIDAG Chain is the first fully autonomously managed project in crypto history. It is managed by SoulwareAI artificial intelligence - there is absolutely NO founder or human intervention. It is a quantum-secure, BSC and Ethereum compatible ecosystem."
  },
  {
    question: "How do I join the presale?",
    answer: "1) Connect your wallet (MetaMask, Trust Wallet, Coinbase, etc.), 2) Optionally join the DAO for $10, 3) Enter BNB amount and click 'Buy Now'. The transaction executes automatically with 60% to operational fund and 40% to DAO/liquidity."
  },
  {
    question: "How is revenue distributed?",
    answer: "60% of all presale revenue goes to the operational fund (development, hosting, infrastructure costs) and 40% goes to SoulwareAI + DAO liquidity pool. This distribution is executed autonomously via smart contracts."
  },
  {
    question: "What does DAO membership provide?",
    answer: "For a one-time $10 fee, you become a DAO member. Members can create proposals, participate in voting, and interact directly with SoulwareAI. All decisions are made through community voting."
  },
  {
    question: "What is quantum security?",
    answer: "AIDAG Chain uses quantum-resistant algorithms (CRYSTALS-Kyber, Dilithium, SPHINCS+) that protect against future quantum computer threats. This ensures long-term security even when quantum computers become powerful enough to break traditional encryption."
  },
  {
    question: "Which wallets are supported?",
    answer: "MetaMask, Trust Wallet, Coinbase Wallet, WalletConnect, TokenPocket, and Math Wallet are supported. You can connect to BSC or Ethereum network."
  },
  {
    question: "What will the listing price be?",
    answer: "Stage 1 presale price is $0.078, Stage 2 is $0.098, and the DEX/CEX listing price will be $0.12. This offers early participants up to +54% potential gain."
  },
  {
    question: "How can I talk to SoulwareAI?",
    answer: "Click the chat button in the bottom right corner to talk directly with SoulwareAI. The AI answers your questions and provides information about AIDAG Chain, presale, DAO, and more."
  }
];

export default function FAQ({ id = "faq" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id={id} className="py-16 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Frequently</span>{" "}
            <span className="text-white">Asked Questions</span>
          </h2>
          <p className="text-gray-400">Everything you need to know about AIDAG Chain</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`card-neon overflow-hidden transition-all duration-300 ${
                openIndex === index ? "border-cyan-500/50" : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-white font-semibold">{faq.question}</span>
                <span className={`text-cyan-400 text-2xl transition-transform duration-300 ${
                  openIndex === index ? "rotate-45" : ""
                }`}>
                  +
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}>
                <div className="px-5 pb-5 text-gray-400">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
