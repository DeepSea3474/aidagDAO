import Layout from "../components/Layout";
import Card from "../components/Card";
import { Icons } from "../components/Icons";

export default function Presale() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Icons.Presale />
        Token Presale
      </h1>

      <Card>
        <p className="text-slate-400">
          Participate in the early phase of A‑DAG ecosystem.
        </p>
      </Card>
    </Layout>
  );
}
