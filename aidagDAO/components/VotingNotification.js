import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const ACTIVE_PROPOSALS = [
  {
    id: "AIDAG-P002",
    title: "Gate.io CEX Listing",
    type: "Economic",
    yesVotes: 2100,
    noVotes: 123,
    totalVotes: 2223,
    yesPercent: 94.5,
    timeLeft: "3d 12h",
  },
  {
    id: "AIDAG-P003",
    title: "Smart Contract Audit",
    type: "Technical",
    yesVotes: 3400,
    noVotes: 89,
    totalVotes: 3489,
    yesPercent: 97.4,
    timeLeft: "1d 6h",
  }
];

export default function VotingNotification() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(0);
  const [pulseVisible, setPulseVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProposal(prev => (prev + 1) % ACTIVE_PROPOSALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseVisible(prev => !prev);
    }, 3000);
    return () => clearInterval(pulseInterval);
  }, []);

  if (dismissed) return null;

  const proposal = ACTIVE_PROPOSALS[currentProposal];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="voting-notif-fab"
        >
          <div className="voting-notif-fab-pulse" />
          <div className="voting-notif-fab-pulse voting-notif-fab-pulse-2" />
          <div className="voting-notif-fab-body">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <div className="voting-notif-badge">{ACTIVE_PROPOSALS.length}</div>
          </div>
          <div className="voting-notif-fab-label">
            <span className="voting-notif-fab-dot" />
            {t("activeVoting", "ACTIVE VOTE")}
          </div>
        </button>
      )}

      {isOpen && (
        <div className="voting-booth-panel">
          <div className="voting-booth-header">
            <div className="voting-booth-title-row">
              <div className="voting-booth-icon">
                <svg viewBox="0 0 64 64" width="40" height="40" fill="none">
                  <rect x="8" y="20" width="48" height="36" rx="4" stroke="#a78bfa" strokeWidth="2.5" fill="rgba(139,92,246,0.08)" />
                  <rect x="22" y="8" width="20" height="16" rx="3" stroke="#c084fc" strokeWidth="2" fill="rgba(192,132,252,0.1)" />
                  <line x1="32" y1="24" x2="32" y2="42" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                  <path d="M26 36l6 6 6-6" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                  </path>
                  <rect x="14" y="48" width="36" height="4" rx="2" fill="rgba(139,92,246,0.15)" />
                  <circle cx="20" cy="14" r="2" fill="#22c55e">
                    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="44" cy="14" r="2" fill="#a78bfa">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">DAO {t("votingBooth", "Voting Booth")}</h3>
                <p className="text-purple-400 text-xs font-mono">
                  {ACTIVE_PROPOSALS.length} {t("activeProposals", "active proposals")}
                </p>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); setDismissed(true); }} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="voting-booth-proposals">
            {ACTIVE_PROPOSALS.map((p, i) => (
              <div key={p.id} className={`voting-booth-card ${i === currentProposal ? 'voting-booth-card-active' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 text-[10px] font-mono font-bold">{p.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.type === 'Economic' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-purple-500/15 text-purple-400 border border-purple-500/25'}`}>
                    {p.type}
                  </span>
                </div>
                <h4 className="text-white font-bold text-xs mb-2">{p.title}</h4>

                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full voting-booth-bar" style={{ width: `${p.yesPercent}%` }}>
                    <div className="voting-booth-bar-glow" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-400 font-bold">{p.yesPercent}% YES</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500">{p.totalVotes.toLocaleString()} {t("votes", "votes")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-orange-400 font-bold">{p.timeLeft}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dao"
            className="voting-booth-cta"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <rect x="3" y="3" width="18" height="18" rx="3" />
            </svg>
            {t("castYourVote", "Cast Your Vote")}
            <span className="voting-booth-cta-arrow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>

          <p className="text-gray-600 text-[10px] text-center mt-2">
            1 AIDAG = 1 {t("vote", "Vote")} | {t("daoMembership", "DAO Membership")}: $10
          </p>
        </div>
      )}
    </>
  );
}
