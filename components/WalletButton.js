import { appKit } from "../lib/wallet";

export default function WalletButton() {
  return (
    <button
      onClick={() => appKit.open()}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
    >
      Connect Wallet
    </button>
  );
}

