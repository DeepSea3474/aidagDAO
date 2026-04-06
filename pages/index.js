import Layout from "../components/Layout";
import Card from "../components/Card";
import { Icons } from "../components/Icons";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Icons.Home className="w-7 h-7" />
        A‑DAG Protocol
      </h1>

      <Card>
        <p className="text-slate-400">
          Welcome to the A‑DAG ecosystem. Explore DAO governance, presale, and documentation.
        </p>
      </Card>
    </Layout>
  );
}
