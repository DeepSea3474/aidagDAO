import { ethers } from "ethers";
import { 
  TOKEN_ADDRESS, 
  DAO_WALLET, 
  FOUNDER_WALLET,
  CHAINS,
  BSC_RPC_URL
} from "./config";
import AidagABI from "./AidagABI.json";

const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);

export async function getTokenInfo() {
  try {
    if (!TOKEN_ADDRESS) {
      return { name: "AIDAG", symbol: "AIDAG", decimals: 18, totalSupply: "21000000" };
    }
    
    const contract = new ethers.Contract(TOKEN_ADDRESS, AidagABI, provider);
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ]);
    
    return { name, symbol, decimals: Number(decimals), totalSupply: "21000000" };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return { name: "AIDAG", symbol: "AIDAG", decimals: 18, totalSupply: "21000000" };
  }
}

export async function getWalletBalance(address) {
  try {
    if (!address) return "0";
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
}

export async function getTokenBalance(walletAddress) {
  try {
    if (!TOKEN_ADDRESS || !walletAddress) return "0";
    const contract = new ethers.Contract(TOKEN_ADDRESS, AidagABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return "0";
  }
}

export async function getTreasuryBalance() {
  try {
    if (!DAO_WALLET) return { bnb: "0", usd: "0" };
    const balance = await provider.getBalance(DAO_WALLET);
    const bnbBalance = ethers.formatEther(balance);
    const usdBalance = (parseFloat(bnbBalance) * 600).toFixed(2);
    return { bnb: bnbBalance, usd: usdBalance };
  } catch (error) {
    console.error("Error fetching treasury:", error);
    return { bnb: "0", usd: "0" };
  }
}

export async function getFounderBalance() {
  try {
    if (!FOUNDER_WALLET) return { bnb: "0", usd: "0" };
    const balance = await provider.getBalance(FOUNDER_WALLET);
    const bnbBalance = ethers.formatEther(balance);
    const usdBalance = (parseFloat(bnbBalance) * 600).toFixed(2);
    return { bnb: bnbBalance, usd: usdBalance };
  } catch (error) {
    console.error("Error fetching founder balance:", error);
    return { bnb: "0", usd: "0" };
  }
}

export async function getPresaleStats() {
  try {
    const treasury = await getTreasuryBalance();
    const founder = await getFounderBalance();
    
    const totalRaisedBNB = parseFloat(treasury.bnb) + parseFloat(founder.bnb);
    const totalRaisedUSD = (totalRaisedBNB * 600).toFixed(2);
    const tokensSold = Math.floor(totalRaisedBNB * 600 / 0.078);
    const progress = Math.min((tokensSold / 10000000) * 100, 100);
    
    return {
      totalRaisedBNB: totalRaisedBNB.toFixed(4),
      totalRaisedUSD,
      tokensSold,
      progress: progress.toFixed(2),
      participants: Math.floor(tokensSold / 5000) + 1
    };
  } catch (error) {
    console.error("Error fetching presale stats:", error);
    return {
      totalRaisedBNB: "0",
      totalRaisedUSD: "0",
      tokensSold: 0,
      progress: "0",
      participants: 0
    };
  }
}

export async function getCurrentBlockNumber() {
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    console.error("Error fetching block number:", error);
    return 0;
  }
}

export async function getGasPrice() {
  try {
    const feeData = await provider.getFeeData();
    return ethers.formatUnits(feeData.gasPrice || 0, "gwei");
  } catch (error) {
    console.error("Error fetching gas price:", error);
    return "5";
  }
}

export { provider };
