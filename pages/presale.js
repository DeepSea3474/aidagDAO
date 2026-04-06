import Layout from "../components/Layout";
import { Icons } from "../components/Icons";

export default function Presale() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 text-white">

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Icons.Presale />
          Token Presale
        </h1>

        <p className="text-slate-400 mb-6">
          Participate in the early phase of A‑DAG ecosystem.
        </p>

      </div>
    </Layout>
  );
}
