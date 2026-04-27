import { ethers } from "ethers";
import { 
  TOKEN_ADDRESS, 
  DAO_WALLET, 
  FOUNDER_WALLET,
  CHAINS,
  BSC_RPC_URL,
  IS_TESTNET,
  PRESALE_STAGE1_PRICE
} from "./config";
import AidagABI from "./AidagABI.json";

const RPC_URLS = [
  BSC_RPC_URL,
  IS_TESTNET 
    ? "https://data-seed-prebsc-2-s1.bnbchain.org:8545"
    : "https://bsc-dataseed1.binance.org",
  IS_TESTNET
    ? "https://data-seed-prebsc-1-s2.bnbchain.org:8545"
    : "https://bsc-dataseed2.binance.org"
].filter(Boolean);

let _provider = null;
let _providerIndex = 0;

function getProvider() {
  if (_provider) return _provider;
  _provider = new ethers.JsonRpcProvider(RPC_URLS[0]);
  return _provider;
}

async function callWithFallback(fn) {
  for (let i = 0; i < RPC_URLS.length; i++) {
    try {
      const idx = (_providerIndex + i) % RPC_URLS.length;
      const p = new ethers.JsonRpcProvider(RPC_URLS[idx]);
      const result = await fn(p);
      _provider = p;
      _providerIndex = idx;
      return result;
    } catch (err) {
      if (i === RPC_URLS.length - 1) throw err;
    }
  }
}

let _bnbPriceCache = { price: 0, timestamp: 0 };

export async function getBNBPrice() {
  const now = Date.now();
  if (_bnbPriceCache.price > 0 && now - _bnbPriceCache.timestamp < 60000) {
    return _bnbPriceCache.price;
  }
  
  const apis = [
    { url: "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT", parse: (d) => parseFloat(d.price) },
    { url: "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd", parse: (d) => d.binancecoin.usd },
    { url: "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD", parse: (d) => d.USD }
  ];
  
  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        const price = api.parse(data);
        if (price && price > 0) {
          _bnbPriceCache = { price, timestamp: now };
          return price;
        }
      }
    } catch (e) {
      continue;
    }
  }
  
  return _bnbPriceCache.price > 0 ? _bnbPriceCache.price : 600;
}

export async function getTokenInfo() {
  try {
    if (!TOKEN_ADDRESS) {
      return { name: "AIDAG", symbol: "AIDAG", decimals: 18, totalSupply: "0" };
    }
    
    return await callWithFallback(async (provider) => {
      const contract = new ethers.Contract(TOKEN_ADDRESS, AidagABI, provider);
      const [name, symbol, decimals, totalSupplyRaw] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);
      
      const totalSupply = ethers.formatUnits(totalSupplyRaw, Number(decimals));
      return { name, symbol, decimals: Number(decimals), totalSupply };
    });
  } catch (error) {
    console.error("Error fetching token info:", error.message);
    return { name: "AIDAG", symbol: "AIDAG", decimals: 18, totalSupply: "0" };
  }
}

export async function getWalletBalance(address) {
  try {
    if (!address) return "0";
    return await callWithFallback(async (provider) => {
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    });
  } catch (error) {
    console.error("Error fetching balance:", error.message);
    return "0";
  }
}

export async function getTokenBalance(walletAddress) {
  try {
    if (!TOKEN_ADDRESS || !walletAddress) return "0";
    return await callWithFallback(async (provider) => {
      const contract = new ethers.Contract(TOKEN_ADDRESS, AidagABI, provider);
      const balance = await contract.balanceOf(walletAddress);
      return ethers.formatUnits(balance, 18);
    });
  } catch (error) {
    console.error("Error fetching token balance:", error.message);
    return "0";
  }
}

export async function getTreasuryBalance() {
  try {
    if (!DAO_WALLET) return { bnb: "0", usd: "0", tokenBalance: "0" };
    
    const [bnbPrice, balanceResult, tokenResult] = await Promise.all([
      getBNBPrice(),
      callWithFallback(async (provider) => {
        const balance = await provider.getBalance(DAO_WALLET);
        return ethers.formatEther(balance);
      }),
      TOKEN_ADDRESS ? callWithFallback(async (provider) => {
        const contract = new ethers.Contract(TOKEN_ADDRESS, AidagABI, provider);
        const balance = await contract.balanceOf(DAO_WALLET);
        return ethers.formatUnits(balance, 18);
      }).catch(() => "0") : Promise.resolve("0")
    ]);
    
    const bnbBalance = balanceResult;
    const usdBalance = (parseFloat(bnbBalance) * bnbPrice).toFixed(2);
    
    return { bnb: bnbBalance, usd: usdBalance, tokenBalance: tokenResult };
  } catch (error) {
    console.error("Error fetching treasury:", error.message);
    return { bnb: "0", usd: "0", tokenBalance: "0" };
  }
}

export async function getFounderBalance() {
  try {
    if (!FOUNDER_WALLET) return { bnb: "0", usd: "0", tokenBalance: "0" };
    
    const [bnbPrice, balanceResult, tokenResult] = await Promise.all([
      getBNBPrice(),
      callWithFallback(async (provider) => {
        const balance = await provider.getBalance(FOUNDER_WALLET);
        return ethers.formatEther(balance);
      }),
      TOKEN_ADDRESS ? callWithFallback(async (provider) => {
        const contract = new ethers.Contract(TOKEN_ADDRESS, AidagABI, provider);
        const balance = await contract.balanceOf(FOUNDER_WALLET);
        return ethers.formatUnits(balance, 18);
      }).catch(() => "0") : Promise.resolve("0")
    ]);
    
    const bnbBalance = balanceResult;
    const usdBalance = (parseFloat(bnbBalance) * bnbPrice).toFixed(2);
    
    return { bnb: bnbBalance, usd: usdBalance, tokenBalance: tokenResult };
  } catch (error) {
    console.error("Error fetching founder balance:", error.message);
    return { bnb: "0", usd: "0", tokenBalance: "0" };
  }
}

export async function getPresaleStats() {
  try {
    const [treasury, founder, bnbPrice, tokenInfo] = await Promise.all([
      getTreasuryBalance(),
      getFounderBalance(),
      getBNBPrice(),
      getTokenInfo()
    ]);
    
    const totalRaisedBNB = parseFloat(treasury.bnb) + parseFloat(founder.bnb);
    const totalRaisedUSD = (totalRaisedBNB * bnbPrice).toFixed(2);
    const tokensSold = Math.floor(totalRaisedBNB * bnbPrice / PRESALE_STAGE1_PRICE);
    const totalSupply = parseFloat(tokenInfo.totalSupply) || 21000000;
    const progress = Math.min((tokensSold / 10000000) * 100, 100);
    
    const txCount = await getTransactionCount();
    
    return {
      totalRaisedBNB: totalRaisedBNB.toFixed(4),
      totalRaisedUSD,
      tokensSold,
      totalSupply: tokenInfo.totalSupply,
      progress: progress.toFixed(2),
      participants: txCount,
      bnbPrice,
      treasuryBNB: treasury.bnb,
      treasuryUSD: treasury.usd,
      treasuryTokens: treasury.tokenBalance,
      founderBNB: founder.bnb,
      founderUSD: founder.usd,
      founderTokens: founder.tokenBalance
    };
  } catch (error) {
    console.error("Error fetching presale stats:", error.message);
    return {
      totalRaisedBNB: "0",
      totalRaisedUSD: "0",
      tokensSold: 0,
      totalSupply: "0",
      progress: "0",
      participants: 0,
      bnbPrice: 0,
      treasuryBNB: "0",
      treasuryUSD: "0",
      treasuryTokens: "0",
      founderBNB: "0",
      founderUSD: "0",
      founderTokens: "0"
    };
  }
}

let _txCountCache = { count: 0, timestamp: 0 };

async function getTransactionCount() {
  const now = Date.now();
  if (_txCountCache.count > 0 && now - _txCountCache.timestamp < 120000) {
    return _txCountCache.count;
  }
  
  try {
    const wallets = [FOUNDER_WALLET, DAO_WALLET].filter(Boolean);
    let total = 0;
    
    for (const wallet of wallets) {
      const count = await callWithFallback(async (provider) => {
        return await provider.getTransactionCount(wallet);
      });
      total += count;
    }
    
    _txCountCache = { count: total, timestamp: now };
    return total;
  } catch (e) {
    return _txCountCache.count;
  }
}

export async function getCurrentBlockNumber() {
  try {
    return await callWithFallback(async (provider) => {
      return await provider.getBlockNumber();
    });
  } catch (error) {
    console.error("Error fetching block number:", error.message);
    return 0;
  }
}

export async function getGasPrice() {
  try {
    return await callWithFallback(async (provider) => {
      const feeData = await provider.getFeeData();
      return ethers.formatUnits(feeData.gasPrice || 0, "gwei");
    });
  } catch (error) {
    console.error("Error fetching gas price:", error.message);
    return "5";
  }
}

export async function getNetworkInfo() {
  try {
    const [blockNumber, gasPrice, bnbPrice] = await Promise.all([
      getCurrentBlockNumber(),
      getGasPrice(),
      getBNBPrice()
    ]);
    
    return {
      blockNumber,
      gasPrice,
      bnbPrice,
      chainId: IS_TESTNET ? 97 : 56,
      chainName: IS_TESTNET ? "BSC Testnet" : "BSC Mainnet",
      isTestnet: IS_TESTNET
    };
  } catch (error) {
    return {
      blockNumber: 0,
      gasPrice: "5",
      bnbPrice: 0,
      chainId: IS_TESTNET ? 97 : 56,
      chainName: IS_TESTNET ? "BSC Testnet" : "BSC Mainnet",
      isTestnet: IS_TESTNET
    };
  }
}

export async function getUserTokenBalance(userAddress) {
  if (!userAddress || !TOKEN_ADDRESS) return { bnb: "0", token: "0", tokenUSD: "0" };
  
  try {
    const [bnbBalance, tokenBalance, bnbPrice] = await Promise.all([
      getWalletBalance(userAddress),
      getTokenBalance(userAddress),
      getBNBPrice()
    ]);
    
    const tokenUSD = (parseFloat(tokenBalance) * PRESALE_STAGE1_PRICE).toFixed(2);
    
    return {
      bnb: bnbBalance,
      token: tokenBalance,
      tokenUSD,
      bnbUSD: (parseFloat(bnbBalance) * bnbPrice).toFixed(2)
    };
  } catch (error) {
    return { bnb: "0", token: "0", tokenUSD: "0", bnbUSD: "0" };
  }
}

export { getProvider as provider };
