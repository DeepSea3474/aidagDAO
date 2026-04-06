import { useState } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import DAOMembers from "../components/DAOMembers";
import TransactionExplorer from "../components/TransactionExplorer";
import SmartAssistant from "../components/SmartAssistant";
import {
  DAO_WALLET,
  FOUNDER_WALLET,
  BSCSCAN_ADDRESS_URL,
  MAX_SUPPLY,
  DAO_COINS,
  DAO_MEMBERSHIP_FEE
} from "../lib/config";
import { getSigner } from "../lib/provider";
import { parseError, ErrorAlert, SuccessAlert } from "../lib/errors";
import { formatNumber } from "../lib/utils";
import {
  Users,
  Vote,
  FileText,
  Zap,
  Shield,
  Crown,
  Check,
  ExternalLink,
  Brain,
  Clock,
  TrendingUp
} from "lucide-react";

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
      <div className="max-w-5xl mx-auto py-10 px-4 text-white">

        <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400" />
          AIDAG DAO Governance
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              DAO Membership
            </h2>

            <div className="mb-6">
              <p className="text-gray-400 mb-2">Membership Fee</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ${DAO_MEMBERSHIP_FEE}
              </p>
              <p className="text-gray-500 text-sm mt-1">One-time payment</p>
            </div>

            <div className="space-y-2 mb-6">
              {[
                "Create and vote on proposals",
                "Direct interaction with SoulwareAI",
                "Access to exclusive DAO channels",
                "Governance participation rights"
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/30 p-2 rounded-lg"
                >
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}
            {success && (
              <SuccessAlert
                message={success}
                txHash={txHash}
                onDismiss={() => setSuccess(null)}
              />
            )}

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
                  {loading ? (
                    "Processing..."
                  ) : (
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

          <DAOMembers />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Vote className="w-5 h-5 text-purple-400" />
              Active Proposals
            </h3>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "Increase Staking Rewards",
                  description: "Raise staking APY from 10% to 15%",
                  yes: 1234,
                  no: 567,
                  status: "active",
                  daysLeft: 2
                },
                {
                  id: 2,
                  title: "New Exchange Listing",
                  description: "List AIDAG on major CEX",
                  yes: 2100,
                  no: 123,
                  status: "active",
                  daysLeft: 5
                },
                {
                  id: 3,
                  title: "Community Marketing Fund",
                  description: "Allocate 100,000 AIDAG for marketing",
                  yes: 890,
                  no: 234,
                  status: "active",
                  daysLeft: 1
                }
              ].map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">
                      #{proposal.id}: {proposal.title}
                    </h4>
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                      Active
                    </span>
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
                        style={{
                          width: `${
                            (proposal.yes / (proposal.yes + proposal.no)) * 100
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {proposal.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <TransactionExplorer />
        </div>

        <SmartAssistant />
      </div>
    </Layout>
  );
}
