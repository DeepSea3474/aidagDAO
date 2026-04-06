import { Icons } from "./Icons";

export default function LanguageSwitcher() {
  return (
    <button className="group flex items-center gap-2 text-slate-300">
      <Icons.Globe />
      <span>Language</span>
    </button>
  );
}
