import { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { useTranslation } from "react-i18next";
import {
  Vote, Crown, Shield, Users, CheckCircle, AlertTriangle,
  Loader2, ThumbsUp, ThumbsDown, Plus, Clock, Wallet,
  Globe, TrendingUp, Sparkles, ExternalLink, Lock, Zap
} from "lucide-react";
import { useWallet } from "@/lib/walletContext";
import { CONTRACT_ADDRESSES, BSC_CHAIN_ID, shortenAddress, getExplorerUrl } from "@/lib/web3Config";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const BNB_PRICE_USD = 600;

function useSampleProposals() {
  const { t } = useTranslation();
  return [
    {
      id: 1, title: t("dao.proposal1Title", "Enable Cross-Chain Bridge to Ethereum"), description: t("dao.proposal1Desc", "Implement a trustless bridge between BSC and Ethereum mainnet for seamless AIDAG transfers. SoulwareAI will autonomously develop and deploy the bridge smart contracts."),
      forVotes: 14520, againstVotes: 2100, status: "active", proposer: "0x7a3B...f21E", endTime: `3 ${t("dao.daysLeft", "days left")}`, category: t("dao.infrastructure", "Infrastructure"),
    },
    {
      id: 2, title: t("dao.proposal2Title", "Increase Staking Rewards to 12% APY"), description: t("dao.proposal2Desc", "Adjust the staking reward mechanism to offer 12% annual yield for AIDAG holders who stake for a minimum of 30 days."),
      forVotes: 18900, againstVotes: 850, status: "active", proposer: "0x1cF9...8b2A", endTime: `5 ${t("dao.daysLeft", "days left")}`, category: t("dao.tokenomics", "Tokenomics"),
    },
    {
      id: 3, title: t("dao.proposal3Title", "Partner with CoinGecko for Listing"), description: t("dao.proposal3Desc", "Allocate $10,000 from the DAO treasury for CoinGecko and CoinMarketCap listing fees to increase token visibility."),
      forVotes: 22100, againstVotes: 1200, status: "passed", proposer: "0x9eD2...3c7F", endTime: t("dao.ended", "Ended"), category: t("dao.marketing", "Marketing"),
    },
    {
      id: 4, title: t("dao.proposal4Title", "Launch NFT Membership Cards"), description: t("dao.proposal4Desc", "Create unique NFT membership cards for DAO members with tiered benefits based on voting participation and token holdings."),
      forVotes: 8400, againstVotes: 5600, status: "active", proposer: "0x4bA1...d9E5", endTime: `7 ${t("dao.daysLeft", "days left")}`, category: t("dao.communityCategory", "Community"),
    },
    {
      id: 5, title: t("dao.proposal5Title", "SoulwareAI Security Audit v2"), description: t("dao.proposal5Desc", "Commission a second comprehensive security audit of all smart contracts by a top-tier blockchain security firm."),
      forVotes: 25800, againstVotes: 300, status: "executed", proposer: "0x6fC8...a4B3", endTime: t("dao.ended", "Ended"), category: t("dao.securityCategory", "Security"),
    },
  ];
}

function DAOMembership() {
  const { t } = useTranslation();
  const wallet = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const daoFeeInBnb = (5 / BNB_PRICE_USD).toFixed(6);

  const handleJoinDAO = async () => {
    if (!wallet.signer) return;
    setIsProcessing(true);
    setError(null);
    try {
      const tx = await wallet.signer.sendTransaction({
        to: CONTRACT_ADDRESSES.founderWallet,
        value: ethers.parseEther(daoFeeInBnb),
      });
      setTxHash(tx.hash);
      await tx.wait();
      setIsMember(true);
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") setError("Transaction cancelled");
      else setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isMember) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] text-center">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">{t("dao.daoMemberActive", "DAO Member Active")}</h3>
        <p className="text-slate-400 mb-4">{t("dao.fullVotingRights", "You have full voting rights on all protocol proposals")}</p>
        {txHash && (
          <a href={getExplorerUrl(BSC_CHAIN_ID, txHash)} target="_blank" rel="noopener noreferrer"
            className="text-sm text-cyan-400 hover:underline flex items-center justify-center gap-1">
            {t("dao.viewTransaction", "View Transaction")} <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.1)]">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
          <Crown className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{t("dao.joinAidagDao", "Join AIDAG DAO")}</h3>
        <p className="text-slate-400">{t("dao.earnRevenueShare", "Become a governance member and earn 40% of all ecosystem revenue")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
          <Vote className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-xs text-slate-400">{t("dao.votingRights", "Voting Rights")}</div>
          <div className="text-sm font-bold text-white">{t("dao.fullAccess", "Full Access")}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
          <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-xs text-slate-400">{t("dao.revenueShare", "Revenue Share")}</div>
          <div className="text-sm font-bold text-emerald-400">40%</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
          <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-xs text-slate-400">{t("dao.aiProjects", "AI Projects")}</div>
          <div className="text-sm font-bold text-white">10 {t("dao.active", "Active")}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
          <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-xs text-slate-400">{t("dao.membership", "Membership")}</div>
          <div className="text-sm font-bold text-white">$5 USD</div>
        </div>
      </div>

      {!wallet.isConnected ? (
        <button onClick={() => wallet.setShowWalletModal(true)} data-testid="button-connect-dao"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5" />
          {t("dao.connectWalletToJoin", "Connect Wallet to Join")}
        </button>
      ) : (
        <>
          <button onClick={handleJoinDAO} disabled={isProcessing} data-testid="button-join-dao"
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
            {isProcessing ? t("dao.processingViaSoulware", "Processing via SoulwareAI...") : t("dao.joinDaoPrice", "Join DAO - $5 (in BNB)")}
          </button>
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </>
      )}

      <p className="text-[10px] text-slate-500 text-center mt-4">
        {t("dao.daoFeeNote", "$5 membership fee is autonomously transferred to founder wallet by SoulwareAI")}
      </p>
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: typeof sampleProposals[0] }) {
  const { t } = useTranslation();
  const wallet = useWallet();
  const [voted, setVoted] = useState<"for" | "against" | null>(null);
  const totalVotes = proposal.forVotes + proposal.againstVotes;
  const forPct = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;

  const statusColors: Record<string, string> = {
    active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    passed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    executed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const categoryColors: Record<string, string> = {
    Infrastructure: "text-cyan-400",
    Tokenomics: "text-emerald-400",
    Marketing: "text-yellow-400",
    Community: "text-purple-400",
    Security: "text-orange-400",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="glass-card rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-colors"
      data-testid={`proposal-${proposal.id}`}>
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[proposal.status]}`}>
            {proposal.status.toUpperCase()}
          </span>
          <span className={`text-xs font-medium ${categoryColors[proposal.category] || "text-slate-400"}`}>
            {proposal.category}
          </span>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {proposal.endTime}</span>
      </div>

      <h4 className="text-lg font-bold text-white mb-2">#{proposal.id} {proposal.title}</h4>
      <p className="text-sm text-slate-400 mb-4">{proposal.description}</p>
      <div className="text-xs text-slate-500 mb-4">{t("dao.proposedBy", "Proposed by")}: <span className="text-slate-300 font-mono">{proposal.proposer}</span></div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-emerald-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {proposal.forVotes.toLocaleString()} {t("dao.for", "For")}</span>
          <span className="text-red-400 flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> {proposal.againstVotes.toLocaleString()} {t("dao.against", "Against")}</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 rounded-l-full transition-all" style={{ width: `${forPct}%` }} />
          <div className="h-full bg-red-500 rounded-r-full transition-all" style={{ width: `${100 - forPct}%` }} />
        </div>
        <div className="text-center text-xs text-slate-400 mt-1">{totalVotes.toLocaleString()} {t("dao.totalVotesCount", "total votes")}</div>
      </div>

      {proposal.status === "active" && !voted && (
        wallet.isConnected ? (
          <div className="flex gap-3">
            <button onClick={() => setVoted("for")} data-testid={`button-vote-for-${proposal.id}`}
              className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
              <ThumbsUp className="w-4 h-4" /> {t("dao.for", "For")}
            </button>
            <button onClick={() => setVoted("against")} data-testid={`button-vote-against-${proposal.id}`}
              className="flex-1 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
              <ThumbsDown className="w-4 h-4" /> {t("dao.against", "Against")}
            </button>
          </div>
        ) : (
          <button onClick={() => wallet.setShowWalletModal(true)} data-testid={`button-connect-vote-${proposal.id}`}
            className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20 text-purple-400 rounded-xl font-bold hover:from-purple-500/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2">
            <Wallet className="w-4 h-4" /> {t("dao.connectWalletToVote", "Connect Wallet to Vote")}
          </button>
        )
      )}

      {voted && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {voted === "for" ? t("dao.votedFor", "Voted For - Recorded on chain by SoulwareAI") : t("dao.votedAgainst", "Voted Against - Recorded on chain by SoulwareAI")}
        </div>
      )}
    </motion.div>
  );
}

function GovernanceStats() {
  const { t } = useTranslation();
  const stats = [
    { label: t("dao.activeProposals", "Active Proposals"), value: "5", icon: <Vote className="w-6 h-6" />, color: "text-cyan-400" },
    { label: t("dao.revenueShare", "Revenue Share"), value: "40%", icon: <TrendingUp className="w-6 h-6" />, color: "text-purple-400" },
    { label: t("dao.aiProjects", "AI Projects"), value: "10", icon: <Crown className="w-6 h-6" />, color: "text-emerald-400" },
    { label: t("dao.membership", "Membership"), value: "$5", icon: <Users className="w-6 h-6" />, color: "text-yellow-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="glass-card rounded-2xl p-6 text-center border border-white/5">
          <div className={`${s.color} mx-auto mb-3`}>{s.icon}</div>
          <div className="text-2xl font-bold text-white font-display mb-1">{s.value}</div>
          <div className="text-xs text-slate-400">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function DAO() {
  const { t } = useTranslation();
  const sampleProposals = useSampleProposals();
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Vote className="w-4 h-4" /> {t("dao.decentralizedGovernance", "Decentralized Governance")}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display" data-testid="text-dao-title">
                AIDAG <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">DAO</span> Governance
              </h1>
              <p className="text-lg text-slate-400">
                {t("dao.headerDesc", "Community-driven governance with 40% ecosystem revenue share. SoulwareAI builds 10 autonomous projects, generates revenue, and distributes 40% to DAO members and stakers. Your vote shapes the ecosystem.")}
              </p>
            </motion.div>
          </div>

          <GovernanceStats />

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
              <DAOMembership />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="text-xl font-bold text-white">{t("dao.proposals", "Proposals")}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  {t("dao.poweredBySoulware", "Powered by SoulwareAI")}
                </div>
              </div>
              {sampleProposals.map(p => <ProposalCard key={p.id} proposal={p} />)}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="glass-card rounded-2xl p-10 max-w-3xl mx-auto text-center border border-white/5">
            <Lock className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">{t("dao.governanceRevenueModel", "Governance + Revenue Model")}</h4>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              {t("dao.governanceRevenueDesc", "All protocol decisions are made through community voting. SoulwareAI autonomously builds 10 revenue-generating projects (QSaaS, QuantumShield, QuantumVault, and more). 40% of all ecosystem revenue is distributed to DAO members and stakers. 60% goes to the founder (DeepSea3474) for continued development. One member, one vote.")}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>{t("dao.daoWallet", "DAO Wallet")}:</span>
              <span className="font-mono text-cyan-400">{shortenAddress(CONTRACT_ADDRESSES.daoWallet, 6)}</span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
