import Link from 'next/link';
import { useRouter } from 'next/router';
// Mevcut çeviri dosyalarını içe aktarıyoruz
import tr from '../locales/tr.json';
import en from '../locales/en.json';

export default function Features() {
  const { locale } = useRouter();
  // Seçili dile göre tüm içeriği belirle
  const t = locale === 'tr' ? tr : en;

  const features = [
    {
      title: t.features?.security || "Quantum Security",
      desc: t.features?.securityDesc || "Encrypted protocols.",
      link: "/docs/security",
      color: "text-cyan-400",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
    },
    {
      title: t.features?.revenue || "Autonomous Revenue",
      desc: t.features?.revenueDesc || "AI-powered distribution.",
      link: "/dao",
      color: "text-purple-400",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    {
      title: t.features?.ai || "AI Governance",
      desc: t.features?.aiDesc || "Autonomous ecosystem.",
      link: "/docs/ai",
      color: "text-pink-400",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M12 10V2"/><path d="M16.2 3.8l-1.4 1.4"/><path d="M19.8 8.4l-1.4.4"/><path d="M7.8 3.8l1.4 1.4"/></svg>
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4">
      {features.map((item, i) => (
        <Link href={item.link} key={i}>
          <div className="group p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-2xl">
            <div className={`mb-6 ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
