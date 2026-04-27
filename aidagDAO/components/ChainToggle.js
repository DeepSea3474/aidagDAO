import { useState } from "react";
import { CHAINS } from "../lib/config";

export default function ChainToggle({ selectedChain, onChainChange }) {
  const chains = Object.values(CHAINS).filter(c => c.active);
  
  return (
    <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-xl p-1">
      {chains.map(chain => (
        <button
          key={chain.id}
          onClick={() => onChainChange(chain.id === 56 ? "bsc" : "eth")}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
            ${(chain.id === 56 && selectedChain === "bsc") || (chain.id === 1 && selectedChain === "eth")
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
            }
          `}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              (chain.id === 56 && selectedChain === "bsc") || (chain.id === 1 && selectedChain === "eth")
                ? "bg-green-400"
                : "bg-gray-500"
            }`}></span>
            {chain.id === 56 ? "BSC" : "ETH"}
          </span>
        </button>
      ))}
    </div>
  );
}
