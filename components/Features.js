import Link from 'next/link';
import { useRouter } from 'next/router';

const content = {
  tr: {
    security: "Kuantum Güvenlik",
    securityDesc: "En ileri düzey şifreleme protokolleri.",
    revenue: "Otonom Gelir",
    revenueDesc: "Yapay zeka destekli akıllı kontratlar.",
    ai: "Yapay Zeka Yönetimi",
    aiDesc: "AIDAG Core ile 7/24 otonom ekosistem."
  },
  en: {
    security: "Quantum Security",
    securityDesc: "Advanced encryption protocols.",
    revenue: "Autonomous Revenue",
    revenueDesc: "AI-powered smart contracts.",
    ai: "AI Governance",
    aiDesc: "24/7 autonomous ecosystem via AIDAG Core."
  }
};

const features = (lang) => [
  {
    title: content[lang]?.security || content.en.security,
    desc: content[lang]?.securityDesc || content.en.securityDesc,
    link: "/docs/security",
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.4)]",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
  },
  {
    title: content[lang]?.revenue || content.en.revenue,
    desc: content[lang]?.revenueDesc || content.en.revenueDesc,
    link: "/dao",
    color: "text-purple-400",
    glow: "shadow-[0_0_15px_rgba(192,132,252,0.4)]",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  },
  {
    title: content[lang]?.ai || content.en.ai,
    desc: content[lang]?.aiDesc || content.en.aiDesc,
    link: "/docs/ai",
    color: "text-pink-400",
    glow: "shadow-[0_0_15px_rgba(244,114,182,0.4)]",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M12 10V2"/><path d="M19.8 8.4l-1.4.4"/><path d="M19.8 15.6l-1.4-.4"/><path d="M16.2 20.2l-1.4-1.4"/><path d="M7.8 20.2l1.4-1.4"/><path d="M4.2 8.4l1.4.4"/><path d="M7.8 3.8l1.4 1.4"/></svg>
  }
];

export default function Features() {
  const { locale } = useRouter();
  const lang = locale || 'en';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 px-4">
      {features(lang).map((item, i) => (
        <Link href={item.link} key={i}>
          <div className={`group p-6 rounded-xl bg-gray-900/50 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer ${item.glow}`}>
            <div className={`mb-4 ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
