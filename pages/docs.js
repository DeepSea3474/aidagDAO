import Layout from "../components/Layout";
import { Icons } from "../components/Icons";

export default function Docs() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 text-white">

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Icons.Docs />
          Documentation
        </h1>

        <p className="text-slate-400">
          Technical and governance documentation will be available soon.
        </p>

      </div>
    </Layout>
  );
}
