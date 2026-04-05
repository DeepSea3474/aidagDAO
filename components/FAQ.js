import { useState } from "react";

const faqs = [
  {
    question: "AIDAG Chain nedir?",
    answer: "AIDAG Chain, kripto tarihinde tam otonom olarak yönetilen ilk projedir. SoulwareAI yapay zekası tarafından yönetilir, kurucu müdahalesi ve insan müdahalesi YOKTUR. Quantum güvenlikli, BSC ve Ethereum uyumlu bir ekosistemdir."
  },
  {
    question: "Ön satışa nasıl katılabilirim?",
    answer: "1) Cüzdanınızı bağlayın (MetaMask, Trust Wallet, Coinbase vb.), 2) DAO üyeliği için $5 ödeme yapabilirsiniz (isteğe bağlı), 3) BNB miktarı girin ve 'Satın Al' butonuna tıklayın. İşlem otomatik olarak gerçekleşir."
  },
  {
    question: "Token dağılımı nasıl yapılıyor?",
    answer: "Ön satışta ödenen miktarın %60'ı kurucu cüzdanına, %40'ı ise SoulwareAI + DAO likidite havuzuna aktarılır. Bu dağılım akıllı kontrat ile otomatik gerçekleşir."
  },
  {
    question: "DAO üyeliği ne sağlar?",
    answer: "$5 karşılığında DAO üyesi olursunuz. Üyeler teklif oluşturabilir, oylamaya katılabilir ve SoulwareAI ile doğrudan etkileşime geçebilir. Tüm kararlar topluluk oylamasıyla alınır."
  },
  {
    question: "Quantum güvenlik ne demek?",
    answer: "AIDAG Chain, gelecekteki kuantum bilgisayar tehditlerine karşı koruma sağlayan quantum-resistant algoritmalar kullanır. Bu, uzun vadeli güvenlik garantisi sağlar."
  },
  {
    question: "Hangi cüzdanları kullanabilirim?",
    answer: "MetaMask, Trust Wallet, Coinbase Wallet, WalletConnect, TokenPocket ve Math Wallet desteklenmektedir. BSC veya Ethereum ağına bağlanabilirsiniz."
  },
  {
    question: "Listeleme fiyatı ne olacak?",
    answer: "Ön satış fiyatı $0.078, listeleme fiyatı ise $0.12 olacaktır. Bu, erken katılımcılara %54 kazanç potansiyeli sunar."
  },
  {
    question: "SoulwareAI ile nasıl iletişime geçebilirim?",
    answer: "Sağ alt köşedeki chat butonuna tıklayarak SoulwareAI ile doğrudan konuşabilirsiniz. AI, sorularınızı yanıtlar ve AIDAG Chain hakkında bilgi verir."
  }
];

export default function FAQ({ id = "faq" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id={id} className="py-16 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Sıkça</span>{" "}
            <span className="text-white">Sorulan Sorular</span>
          </h2>
          <p className="text-gray-400">AIDAG Chain hakkında merak edilenler</p>
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
