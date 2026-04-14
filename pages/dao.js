import Layout from "../components/Layout";
import GovernanceSection from "../components/GovernanceSection";
import DAOMembers from "../components/DAOMembers";
import TransactionExplorer from "../components/TransactionExplorer";

export default function DAOPage() {
  return (
    <Layout>
      <div className="pt-24 pb-12">
        <GovernanceSection />
        <DAOMembers />
        <TransactionExplorer />
      </div>
    </Layout>
  );
}
