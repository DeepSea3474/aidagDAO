import { useState } from "react";
import { 
  TOKEN_ADDRESS, 
  FOUNDER_WALLET, 
  DAO_WALLET, 
  PRESALE_CONTRACT,
  BSCSCAN_ADDRESS_URL,
  ETHERSCAN_ADDRESS_URL
} from "../lib/config";

const ContractSvg = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ctr-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
    <rect x="4" y="2" width="16" height="20" rx="2" fill="url(#ctr-g)" opacity="0.15" stroke="#06b6d4" strokeWidth="1.5" />
    <line x1="8" y1="7" x2="16" y2="7" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="11" x2="14" y2="11" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="15" x2="12" y2="15" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UserSvg = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="usr-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
    <circle cx="12" cy="8" r="4" fill="url(#usr-g)" opacity="0.2" stroke="#a855f7" strokeWidth="1.5" />
    <path d="M4 21v-2a6 6 0 0112 0v2" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const InstitutionSvg = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="inst-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
    <path d="M3 21h18M3 10l9-7 9 7" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="5" y="10" width="3" height="9" fill="url(#inst-g)" opacity="0.15" stroke="#06b6d4" strokeWidth="1" />
    <rect x="10.5" y="10" width="3" height="9" fill="url(#inst-g)" opacity="0.2" stroke="#06b6d4" strokeWidth="1" />
    <rect x="16" y="10" width="3" height="9" fill="url(#inst-g)" opacity="0.15" stroke="#06b6d4" strokeWidth="1" />
  </svg>
);

const CoinSvg = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="cn-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#eab308" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient></defs>
    <circle cx="12" cy="12" r="9" fill="url(#cn-g)" opacity="0.15" stroke="#eab308" strokeWidth="1.5" />
    <path d="M12 7v10M9 9.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5S14.66 11 12 11s-3 .67-3 1.5 1.34 1.5 3 1.5 3 .67 3 1.5c0 .83-1.34 1.5-3 1.5s-3-.67-3-1.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CopySvg = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ExternalLinkSvg = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockSmallSvg = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AiSmallSvg = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    <path d="M9 15c1 1.5 5 1.5 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BscHexSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bsc-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0B90B" /><stop offset="100%" stopColor="#F8D12F" /></linearGradient></defs>
    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="url(#bsc-g)" opacity="0.15" stroke="#F0B90B" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 7l3 2v4l-3 2-3-2V9l3-2z" fill="#F0B90B" opacity="0.6" />
  </svg>
);

const EthDiamondSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="eth-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#627EEA" /><stop offset="100%" stopColor="#3B5998" /></linearGradient></defs>
    <path d="M12 2l7 10-7 4-7-4 7-10z" fill="url(#eth-g)" opacity="0.2" stroke="#627EEA" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 16l7-4-7 10-7-10 7 4z" fill="url(#eth-g)" opacity="0.35" stroke="#627EEA" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const AuditSvg = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="aud-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
    <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" fill="url(#aud-g)" opacity="0.15" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 12l3 3 5-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const iconMap = {
  contract: <ContractSvg />,
  user: <UserSvg />,
  institution: <InstitutionSvg />,
  coin: <CoinSvg />
};

function AddressCard({ title, address, iconType, description, chain = "bsc" }) {
  const [copied, setCopied] = useState(false);
  
  const explorerUrl = chain === "bsc" 
    ? BSCSCAN_ADDRESS_URL(address) 
    : ETHERSCAN_ADDRESS_URL(address);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  if (!address) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
            {iconMap[iconType] || iconMap.contract}
          </div>
          <div>
            <h4 className="text-white font-semibold">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <span className="text-gray-500 text-sm">Coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 rounded-xl p-4 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
          {iconMap[iconType] || iconMap.contract}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold">{title}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${address ? "bg-green-400" : "bg-gray-500"}`}></div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-3 mb-3">
        <code className="text-cyan-400 text-xs md:text-sm font-mono break-all">
          {address}
        </code>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={copyAddress}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg font-semibold transition-all ${
            copied 
              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {copied ? (
            <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Copied</>
          ) : (
            <><CopySvg className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-center transition-all"
        >
          <ExternalLinkSvg className="w-3.5 h-3.5" /> Explorer
        </a>
      </div>
    </div>
  );
}

export default function ContractAddresses() {
  const addresses = [
    {
      title: "Token Contract",
      address: TOKEN_ADDRESS,
      iconType: "contract",
      description: "AIDAG Token smart contract",
      chain: "bsc"
    },
    {
      title: "Founder Wallet",
      address: FOUNDER_WALLET,
      iconType: "user",
      description: "60% of presale revenue - operational fund",
      chain: "bsc"
    },
    {
      title: "DAO / Liquidity Wallet",
      address: DAO_WALLET,
      iconType: "institution",
      description: "40% of presale revenue + DAO treasury",
      chain: "bsc"
    },
    {
      title: "Presale Contract",
      address: PRESALE_CONTRACT,
      iconType: "coin",
      description: "Presale smart contract",
      chain: "bsc"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-full mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Full Transparency
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="logo-aidag">Contract</span>{" "}
            <span className="text-white">Addresses</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All transactions are open and verifiable on the blockchain. 
            Use the addresses below to track all operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {addresses.map((addr, index) => (
            <AddressCard key={index} {...addr} />
          ))}
        </div>

        <div className="card-neon p-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-400 text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-gray-400 text-sm">1 Year Locked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400"><LockSmallSvg className="w-4 h-4" /></span>
              <span className="text-gray-400 text-sm">Audited Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400"><AiSmallSvg className="w-4 h-4" /></span>
              <span className="text-gray-400 text-sm">Managed by SoulwareAI</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <a 
            href="https://bscscan.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-yellow-500/30 rounded-xl p-4 flex items-center gap-3 transition-all group"
          >
            <BscHexSvg />
            <div>
              <h4 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">BscScan</h4>
              <p className="text-xs text-gray-500">BSC Explorer</p>
            </div>
          </a>
          
          <a 
            href="https://etherscan.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/30 rounded-xl p-4 flex items-center gap-3 transition-all group"
          >
            <EthDiamondSvg />
            <div>
              <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">Etherscan</h4>
              <p className="text-xs text-gray-500">ETH Explorer</p>
            </div>
          </a>
          
          <a 
            href="#" 
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-green-500/30 rounded-xl p-4 flex items-center gap-3 transition-all group"
          >
            <AuditSvg />
            <div>
              <h4 className="text-white font-semibold group-hover:text-green-400 transition-colors">Audit Report</h4>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
