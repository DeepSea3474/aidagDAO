import Link from "next/link";
import { DAO_COINS, MAX_SUPPLY } from "../lib/config";
import { formatNumber } from "../lib/utils";

const ColumnsIcon = ({ className = "w-8 h-8", gradient = "cyan" }) => {
  const colors = { cyan: ["#06b6d4", "#0891b2"], purple: ["#a855f7", "#7c3aed"], yellow: ["#eab308", "#ca8a04"], green: ["#22c55e", "#16a34a"] };
  const [c1, c2] = colors[gradient] || colors.cyan;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id={`col-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></linearGradient></defs>
      <path d="M3 4h4v16H3V4zm7 0h4v16h-4V4zm7 0h4v16h-4V4z" fill={`url(#col-${gradient})`} opacity="0.2" stroke={c1} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 3h20v2H2V3zm0 16h20v2H2v-2z" fill={c1} opacity="0.8" />
    </svg>
  );
};

const BallotIcon = ({ className = "w-8 h-8", gradient = "purple" }) => {
  const colors = { cyan: ["#06b6d4", "#0891b2"], purple: ["#a855f7", "#7c3aed"] };
  const [c1, c2] = colors[gradient] || colors.purple;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id={`bal-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></linearGradient></defs>
      <rect x="3" y="3" width="18" height="18" rx="3" fill={`url(#bal-${gradient})`} opacity="0.15" stroke={c1} strokeWidth="1.5" />
      <path d="M7 12l3 3 7-7" stroke={c1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const BoltIcon = ({ className = "w-8 h-8", gradient = "yellow" }) => {
  const colors = { yellow: ["#eab308", "#f59e0b"], cyan: ["#06b6d4", "#0891b2"] };
  const [c1, c2] = colors[gradient] || colors.yellow;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id={`bolt-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></linearGradient></defs>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={`url(#bolt-${gradient})`} opacity="0.2" stroke={c1} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const LockIcon = ({ className = "w-8 h-8", gradient = "green" }) => {
  const colors = { green: ["#22c55e", "#16a34a"], cyan: ["#06b6d4", "#0891b2"] };
  const [c1, c2] = colors[gradient] || colors.green;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id={`lock-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></linearGradient></defs>
      <rect x="5" y="11" width="14" height="10" rx="2" fill={`url(#lock-${gradient})`} opacity="0.15" stroke={c1} strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 118 0v4" stroke={c1} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill={c1} />
    </svg>
  );
};

const TargetIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="target-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
    <circle cx="12" cy="12" r="9" stroke="url(#target-g)" strokeWidth="1.5" opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke="url(#target-g)" strokeWidth="1.5" opacity="0.5" />
    <circle cx="12" cy="12" r="3" fill="url(#target-g)" opacity="0.8" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClipboardIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="clip-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
    <rect x="5" y="4" width="14" height="17" rx="2" fill="url(#clip-g)" opacity="0.15" stroke="#a855f7" strokeWidth="1.5" />
    <path d="M9 2h6a1 1 0 011 1v1H8V3a1 1 0 011-1z" fill="#a855f7" opacity="0.6" />
    <line x1="9" y1="10" x2="15" y2="10" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="14" x2="13" y2="14" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GearIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gear-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#6366f1" /></linearGradient></defs>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="url(#gear-g)" opacity="0.3" stroke="#a855f7" strokeWidth="1.5" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 8.6a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#a855f7" strokeWidth="1.2" opacity="0.6" />
  </svg>
);

const CoinIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="coin-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#eab308" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient></defs>
    <circle cx="12" cy="12" r="9" fill="url(#coin-g)" opacity="0.15" stroke="#eab308" strokeWidth="1.5" />
    <path d="M12 7v10M9 9.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5S14.66 11 12 11s-3 .67-3 1.5 1.34 1.5 3 1.5 3 .67 3 1.5c0 .83-1.34 1.5-3 1.5s-3-.67-3-1.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UsersIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="users-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
    <circle cx="9" cy="7" r="3" fill="url(#users-g)" opacity="0.2" stroke="#06b6d4" strokeWidth="1.5" />
    <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="17" cy="7" r="2.5" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
    <path d="M18 15a4 4 0 013 3.88V21" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const AlertIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="alert-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
    <path d="M12 2L2 20h20L12 2z" fill="url(#alert-g)" opacity="0.15" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="14" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="#ef4444" />
  </svg>
);

const EditIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="edit-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" fill="url(#edit-g)" opacity="0.15" stroke="#06b6d4" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 6l3 3" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AIIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ai-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
    <rect x="4" y="4" width="16" height="16" rx="3" fill="url(#ai-g)" opacity="0.15" stroke="#a855f7" strokeWidth="1.5" />
    <circle cx="9" cy="10" r="1.5" fill="#06b6d4" />
    <circle cx="15" cy="10" r="1.5" fill="#06b6d4" />
    <path d="M9 15c1 1.5 5 1.5 6 0" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 8h-2M22 8h-2M4 16h-2M22 16h-2" stroke="#a855f7" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const CheckIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="check-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
    <circle cx="12" cy="12" r="9" fill="url(#check-g)" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
    <path d="M8 12l3 3 5-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VaultIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="vault-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
    <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#vault-g)" opacity="0.15" stroke="#06b6d4" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
    <circle cx="12" cy="12" r="1.5" fill="#06b6d4" />
    <line x1="16" y1="12" x2="20" y2="12" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 20h2v2H6zM16 20h2v2h-2z" fill="#06b6d4" opacity="0.4" />
  </svg>
);

const ChartIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="chart-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
    <rect x="3" y="14" width="4" height="7" rx="1" fill="url(#chart-g)" opacity="0.3" stroke="#a855f7" strokeWidth="1" />
    <rect x="10" y="9" width="4" height="12" rx="1" fill="url(#chart-g)" opacity="0.5" stroke="#a855f7" strokeWidth="1" />
    <rect x="17" y="4" width="4" height="17" rx="1" fill="url(#chart-g)" opacity="0.7" stroke="#a855f7" strokeWidth="1" />
    <line x1="2" y1="21" x2="22" y2="21" stroke="#a855f7" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

const ShieldLockIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="shlock-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
    <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" fill="url(#shlock-g)" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="9.5" y="10" width="5" height="4" rx="1" stroke="#22c55e" strokeWidth="1.2" />
    <path d="M10.5 10V8.5a1.5 1.5 0 013 0V10" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="0.5" fill="#22c55e" />
  </svg>
);

const ColumnsButtonIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h4v16H3V4zm7 0h4v16h-4V4zm7 0h4v16h-4V4z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M2 3h20v2H2V3zm0 16h20v2H2v-2z" fill="currentColor" opacity="0.8" />
  </svg>
);

export default function GovernanceSection() {
  const governanceFeatures = [
    {
      icon: <ColumnsIcon className="w-10 h-10" gradient="cyan" />,
      title: "Fully Autonomous DAO",
      description: "All decisions are evaluated and executed by SoulwareAI. Zero human intervention.",
      color: "cyan"
    },
    {
      icon: <BallotIcon className="w-10 h-10" gradient="purple" />,
      title: "Transparent Voting",
      description: "Token holders vote on proposals. All votes are recorded on the blockchain.",
      color: "purple"
    },
    {
      icon: <BoltIcon className="w-10 h-10" gradient="yellow" />,
      title: "Smart Execution",
      description: "Approved proposals are automatically executed through smart contracts.",
      color: "yellow"
    },
    {
      icon: <LockIcon className="w-10 h-10" gradient="green" />,
      title: "Quantum Security",
      description: "All governance transactions are protected with next-generation encryption.",
      color: "green"
    }
  ];

  const votingPower = [
    { label: "1 AIDAG", power: "1 Vote", description: "Basic voting right" },
    { label: "1,000 AIDAG", power: "1,000 Votes", description: "Proposal creation right" },
    { label: "10,000 AIDAG", power: "10,000 Votes", description: "Priority evaluation" },
    { label: "100,000 AIDAG", power: "100,000 Votes", description: "Council membership" }
  ];

  const proposalTypes = [
    { type: "Technical", icon: <GearIcon className="w-8 h-8" />, description: "Protocol upgrades, smart contract changes" },
    { type: "Economic", icon: <CoinIcon className="w-8 h-8" />, description: "Tokenomics, fees, reward distributions" },
    { type: "Community", icon: <UsersIcon className="w-8 h-8" />, description: "Marketing, partnerships, events" },
    { type: "Emergency", icon: <AlertIcon className="w-8 h-8" />, description: "Security patches, critical fixes" }
  ];

  const getColorClass = (color) => {
    const colors = {
      cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400",
      purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
      yellow: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
      green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400"
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-sm px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            DAO Governance
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Fully Autonomous Governance
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AIDAG Chain is the first blockchain project fully autonomously managed by SoulwareAI.
            <span className="block mt-2 text-yellow-400 font-semibold">No founder intervention • No human intervention</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {governanceFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${getColorClass(feature.color)} border rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="card-neon p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TargetIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Voting Power System</h3>
                <p className="text-gray-400 text-sm">1 AIDAG = 1 Vote</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {votingPower.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">{item.power}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-neon p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <ClipboardIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Proposal Types</h3>
                <p className="text-gray-400 text-sm">SoulwareAI evaluation</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {proposalTypes.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <div className="mb-2">{item.icon}</div>
                  <h4 className="text-white font-semibold mb-1">{item.type}</h4>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-neon p-6 md:p-8 mb-12 md:mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Governance Process</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Propose", desc: "DAO member creates a proposal", icon: <EditIcon className="w-7 h-7" /> },
              { step: 2, title: "Evaluate", desc: "SoulwareAI analyzes it", icon: <AIIcon className="w-7 h-7" /> },
              { step: 3, title: "Vote", desc: "Token holders cast votes", icon: <BallotIcon className="w-7 h-7" gradient="cyan" /> },
              { step: 4, title: "Approve", desc: "Majority reached = approved", icon: <CheckIcon className="w-7 h-7" /> },
              { step: 5, title: "Execute", desc: "Automatic execution", icon: <BoltIcon className="w-7 h-7" gradient="yellow" /> }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center border border-gray-700 hover:border-cyan-500/50 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-cyan-500/50 text-xl z-10">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3"><VaultIcon className="w-10 h-10" /></div>
            <p className="text-gray-400 text-sm mb-2">DAO Treasury</p>
            <p className="text-3xl font-bold text-cyan-400" suppressHydrationWarning>{formatNumber(DAO_COINS)}</p>
            <p className="text-gray-500 text-xs mt-1">AIDAG</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3"><ChartIcon className="w-10 h-10" /></div>
            <p className="text-gray-400 text-sm mb-2">Governance Ratio</p>
            <p className="text-3xl font-bold text-purple-400">85.7%</p>
            <p className="text-gray-500 text-xs mt-1">Of Total Supply</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3"><ShieldLockIcon className="w-10 h-10" /></div>
            <p className="text-gray-400 text-sm mb-2">Founder Lock</p>
            <p className="text-3xl font-bold text-green-400">1 Year</p>
            <p className="text-gray-500 text-xs mt-1">Full Lock</p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/dao" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            <ColumnsButtonIcon className="w-5 h-5" />
            Join the DAO
            <span>→</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4">Membership fee: $10 • Proposal and voting rights</p>
        </div>
      </div>
    </section>
  );
}