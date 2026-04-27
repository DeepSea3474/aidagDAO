import { ethers } from "ethers";
import { BSC_RPC_URL } from "./config";

export const bscProvider = new ethers.JsonRpcProvider(BSC_RPC_URL);

export const provider = bscProvider;

export async function getWalletProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

export async function getSigner() {
  const walletProvider = await getWalletProvider();
  if (walletProvider) {
    return await walletProvider.getSigner();
  }
  return null;
}
