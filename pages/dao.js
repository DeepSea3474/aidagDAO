import { useState } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import DAOMembers from "../components/DAOMembers";
import TransactionExplorer from "../components/TransactionExplorer";
import SmartAssistant from "../components/SmartAssistant";
import { DAO_WALLET, FOUNDER_WALLET, BSCSCAN_ADDRESS_URL, MAX_SUPPLY, DAO_COINS, DAO_MEMBERSHIP_FEE } from "../lib/config";
import { getSigner } from "../lib/provider";
import { parseError, ErrorAlert, SuccessAlert } from "../lib/errors";
import { formatNumber } from "../lib/utils";
import { Users, Vote, FileText, Zap, Shield, Crown, Check, ExternalLink, Brain, Clock, TrendingUp } from "lucide-react";

const GAS_LIMIT = 50000;
const BNB_USD_PRICE = 600;

export default function DAO() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMember, setIsMember] = useState(false);

  async function joinDAO() {
    if (!walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    if (!FOUNDER_WALLET) {
      setError("Founder wallet address not found. Please check configuration.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      const signer = await getSigner();
      if (!signer) {
        setError("Wallet not connected. Please connect your wallet.");
        setLoading(false);
        return;
      }

      const balance = await signer.provider.getBalance(walletAddress);
      const feeInBNB = (DAO_MEMBERSHIP_FEE / BNB_USD_PRICE).toFixed(6);
      const feeInWei = ethers.parseEther(feeInBNB);
      
      if (balance < feeInWei) {
        setError("Insufficient BNB balance. Please add more BNB to your account.");
        setLoading(false);
        return;
      }

      const tx = await signer.sendTransaction({
        to: FOUNDER_WALLET,
        value: feeInWei,
        gasLimit: GAS_LIMIT
      });
      
      setTxHash(tx.hash);
      setSuccess("Transaction sent! Waiting for confirmation...");
      
      await tx.wait();
      
      setSuccess("Congratulations! You are now a DAO member!");
      setIsMember(true);
    } catch (err) {
      console.error("Transaction failed:", err);
      const parsedError = parseError(err);
      setError(parsedError.message);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-600/30 text-purple-400 text-sm px-4 py-1.5 rounded-full mb-4">
            <Brain className="w-4 h-4" />
            SoulwareAI Autonomous DAO Governance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            AIDAG DAO
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Fully autonomous governance system - All decisions executed by SoulwareAI with no human intervention
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-2xl p-6 border border-cyan-500/20">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">1,247</p>
            <p className="text-gray-400 text-sm">DAO Members</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">23</p>
            <p className="text-gray-400 text-sm">Active Proposals</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-6 border border-green-500/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1" suppressHydrationWarning>${formatNumber(125000)}</p>
            <p className="text-gray-400 text-sm">Treasury Value</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl p-6 border border-purple-500/20 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <Brain className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">SoulwareAI Autonomous Manager</h3>
              <p className="text-gray-300 mb-4">
                AIDAG DAO is fully managed by SoulwareAI. The AI evaluates all proposals, 
                monitors voting, and automatically executes decisions on the BSC chain.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  BSC Chain Active
                </div>
                <div className="flex items-center gap-2 text-sm bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">
                  <Zap className="w-3 h-3" />
                  Autonomous Mode
                </div>
                <div className="flex items-center gap-2 text-sm bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  24/7 Active
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <SmartAssistant context="dao" />
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Join the DAO
            </h3>
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">Membership Fee</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">${DAO_MEMBERSHIP_FEE}</p>
              <p className="text-gray-500 text-sm mt-1">One-time payment</p>
            </div>
            
            <div className="space-y-2 mb-6">
              {[
                "Create and vote on proposals",
                "Direct interaction with SoulwareAI",
                "Access to exclusive DAO channels",
                "Governance participation rights"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/30 p-2 rounded-lg">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
            {success && <SuccessAlert message={success} txHash={txHash} onDismiss={() => setSuccess(null)} />}

            <div className="mt-4">
              {isMember ? (
                <div className="text-center p-4 bg-green-900/20 border border-green-600/30 rounded-xl">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">You are a DAO Member!</p>
                </div>
              ) : walletAddress ? (
                <button
                  onClick={joinDAO}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Users className="w-4 h-4" />
                      Join DAO (${DAO_MEMBERSHIP_FEE})
                    </>
                  )}
                </button>
              ) : (
                <WalletButton onConnected={setWalletAddress} onError={setError} />
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Vote className="w-5 h-5 text-purple-400" />
              Active Proposals
            </h3>
            <div className="space-y-4">
              {[
                { id: 1, title: "Increase Staking Rewards", description: "Raise staking APY from 10% to 15%", yes: 1234, no: 567, status: "active", daysLeft: 2 },
                { id: 2, title: "New Exchange Listing", description: "List AIDAG on major CEX", yes: 2100, no: 123, status: "active", daysLeft: 5 },
                { id: 3, title: "Community Marketing Fund", description: "Allocate 100,000 AIDAG for marketing", yes: 890, no: 234, status: "active", daysLeft: 1 }
              ].map((proposal) => (
                <div key={proposal.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">#{proposal.id}: {proposal.title}</h4>
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{proposal.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Yes: {proposal.yes}</span>
                      <span>No: {proposal.no}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                        style={{ width: `${(proposal.yes / (proposal.yes + proposal.no)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {proposal.daysLeft} days left
                    </span>
                    <div className="flex gap-2">
                      <button className="bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-1 rounded-lg text-xs transition-colors">
                        Vote Yes
                      </button>
                      <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded-lg text-xs transition-colors">
                        Vote No
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              DAO Functions
            </h3>
            <div className="space-y-4">
              {[
                { icon: FileText, title: "Create Proposals", description: "DAO members can create proposals for the ecosystem. SoulwareAI evaluates all proposals.", color: "cyan" },
                { icon: Vote, title: "Voting System", description: "Token holders can vote on proposals. 1 AIDAG = 1 Vote. All votes recorded on-chain.", color: "purple" },
                { icon: Zap, title: "Autonomous Execution", description: "Approved proposals are automatically executed by SoulwareAI. No human intervention.", color: "yellow" },
                { icon: Shield, title: "Transparent Results", description: "All voting results and execution logs are publicly visible and verifiable.", color: "green" }
              ].map((func, i) => (
                <div key={i} className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-${func.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <func.icon className={`w-5 h-5 text-${func.color}-400`} />
                    </div>
                    <h4 className="text-white font-semibold">{func.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm pl-13">{func.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <DAOMembers />
        </div>

        <div className="mb-8">
          <TransactionExplorer limit={5} />
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400" />
            DAO Wallet Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-500 text-sm mb-2">SoulwareAI + DAO Treasury</p>
              <a 
                href={BSCSCAN_ADDRESS_URL(DAO_WALLET)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 font-mono break-all hover:text-cyan-300 text-sm flex items-center gap-2"
              >
                {DAO_WALLET || "Coming soon"}
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-gray-500 text-sm mb-2">Founder Wallet (Membership Revenue)</p>
              <a 
                href={BSCSCAN_ADDRESS_URL(FOUNDER_WALLET)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 font-mono break-all hover:text-cyan-300 text-sm flex items-center gap-2"
              >
                {FOUNDER_WALLET || "Coming soon"}
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
