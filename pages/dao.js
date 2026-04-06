import { useState } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import DAOMembers from "../components/DAOMembers";
import TransactionExplorer from "../components/TransactionExplorer";
import SmartAssistant from "../components/SmartAssistant";
import { Icons } from "../components/Icons";

export default function DAO() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4 text-white">

        <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
          <Icons.DAO className="w-7 h-7" />
          AIDAG DAO Governance
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icons.Members />
              DAO Membership
            </h2>

            <p className="text-slate-400 mb-4">
              Become part of the governance ecosystem.
            </p>

            <WalletButton />

          </div>

          <DAOMembers />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icons.Governance />
              Active Proposals
            </h3>

            <p className="text-slate-400">Proposal system coming soon.</p>
          </div>

          <TransactionExplorer />
        </div>

        <SmartAssistant />
      </div>
    </Layout>
  );
}
