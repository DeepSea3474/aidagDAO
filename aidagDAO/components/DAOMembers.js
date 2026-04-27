import { useState, useEffect } from "react";
import { Users, Crown, Shield, ExternalLink, Copy, Check, Search } from "lucide-react";
import { shortenAddress, formatTimestamp } from "../lib/helpers";
import { BSCSCAN_ADDRESS_URL } from "../lib/config";

const MOCK_DAO_MEMBERS = [
  { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD00", joinedAt: Date.now() - 86400000 * 30, tokens: 125000, role: "founder", proposals: 5, votes: 12 },
  { address: "0x9Cb12D69138ACf8d5F0e4B5C4A3c9a2B1d0E4f67", joinedAt: Date.now() - 86400000 * 25, tokens: 85000, role: "dao", proposals: 3, votes: 8 },
  { address: "0xAb5801a7D398351b8bE11C439e05C5B3259aec9B", joinedAt: Date.now() - 86400000 * 20, tokens: 52000, role: "dao", proposals: 1, votes: 15 },
  { address: "0xDd4B55EbC7f49b80D8C3aB59F57Cb5e69e8f6C89", joinedAt: Date.now() - 86400000 * 15, tokens: 34500, role: "dao", proposals: 0, votes: 6 },
  { address: "0x1234567890abcdef1234567890abcdef12345678", joinedAt: Date.now() - 86400000 * 10, tokens: 21000, role: "dao", proposals: 2, votes: 4 },
  { address: "0xfedcba0987654321fedcba0987654321fedcba09", joinedAt: Date.now() - 86400000 * 5, tokens: 15000, role: "dao", proposals: 0, votes: 3 },
  { address: "0x5678901234abcdef5678901234abcdef56789012", joinedAt: Date.now() - 86400000 * 2, tokens: 8500, role: "dao", proposals: 0, votes: 1 },
];

function RoleBadge({ role }) {
  const config = {
    founder: { icon: Crown, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30", label: "Founder" },
    dao: { icon: Shield, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30", label: "DAO Member" }
  };
  const { icon: Icon, color, bg, border, label } = config[role] || config.dao;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${color} border ${border}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function MemberCard({ member }) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(member.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <RoleBadge role={member.role} />
        <span className="text-gray-500 text-xs">{formatTimestamp(member.joinedAt)}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-gray-900/50 rounded-lg px-3 py-2 font-mono text-sm text-cyan-400 border border-gray-700/50">
          {shortenAddress(member.address, 8, 6)}
        </div>
        <button 
          onClick={copyAddress}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
          title="Copy Address"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
        </button>
        <a 
          href={BSCSCAN_ADDRESS_URL(member.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
          title="View on BSCScan"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
        </a>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-lg font-bold text-white">{(member.tokens / 1000).toFixed(1)}K</p>
          <p className="text-gray-500 text-xs">AIDAG</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-lg font-bold text-purple-400">{member.proposals}</p>
          <p className="text-gray-500 text-xs">Proposals</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-lg font-bold text-cyan-400">{member.votes}</p>
          <p className="text-gray-500 text-xs">Votes</p>
        </div>
      </div>
    </div>
  );
}

export default function DAOMembers() {
  const [members, setMembers] = useState(MOCK_DAO_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("tokens");

  const filteredMembers = members
    .filter(m => m.address.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "tokens") return b.tokens - a.tokens;
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "joined") return a.joinedAt - b.joinedAt;
      return 0;
    });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-5 border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              DAO Members
              <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                {members.length}
              </span>
            </h3>
            <p className="text-gray-500 text-sm">Active participants in AIDAG governance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none w-48"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="tokens">By Tokens</option>
              <option value="votes">By Votes</option>
              <option value="joined">By Date</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <MemberCard key={member.address} member={member} />
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="p-10 text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No members found</p>
        </div>
      )}
    </div>
  );
}
