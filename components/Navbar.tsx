"use client";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="text-xl font-bold">
        AIDAG
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
