import Link from "next/link";
import { Icons } from "./Icons";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <Icons.Home />
        <span className="font-semibold text-slate-100">A‑DAG Protocol</span>
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-300">
        <Link href="/" className="group flex items-center gap-2">
          <Icons.Home />
          Home
        </Link>

        <Link href="/dao" className="group flex items-center gap-2">
          <Icons.DAO />
          DAO
        </Link>

        <Link href="/presale" className="group flex items-center gap-2">
          <Icons.Presale />
          Presale
        </Link>

        <Link href="/docs" className="group flex items-center gap-2">
          <Icons.Docs />
          Docs
        </Link>
      </div>
    </nav>
  );
}
