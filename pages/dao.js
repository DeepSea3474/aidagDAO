import Layout from "../components/Layout";
import Card from "../components/Card";
import WalletButton from "../components/WalletButton";
import DAOMembers from "../components/DAOMembers";
import TransactionExplorer from "../components/TransactionExplorer";
import SmartAssistant from "../components/SmartAssistant";
import { Icons } from "../components/Icons";

export default function DAO() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Icons.DAO className="w-7 h-7" />
        AIDAG DAO Governance
      </h1>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icons.Members />
            DAO Membership
          </h2>

          <p className="text-slate-400 mb-4">
            Become part of the governance ecosystem.
          </p>

          <WalletButton />
        </Card>

        <DAOMembers />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <Card>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Icons.Governance />
            Active Proposals
          </h3>

          <p className="text-slate-400">Proposal system coming soon.</p>
        </Card>

        <TransactionExplorer />
      </div>

      <SmartAssistant />
    </Layout>
  );
}
