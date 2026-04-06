import Layout from "../components/Layout";
import Card from "../components/Card";
import { Icons } from "../components/Icons";

export default function Docs() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Icons.Docs />
        Documentation
      </h1>

      <Card>
        <p className="text-slate-400">
          Technical and governance documentation will be available soon.
        </p>
      </Card>
    </Layout>
  );
}
