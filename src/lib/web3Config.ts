export const BSC_CHAIN_ID = 56;
export const BSC_TESTNET_CHAIN_ID = 97;
export const ETH_CHAIN_ID = 1;

export const SUPPORTED_CHAINS = [BSC_CHAIN_ID, ETH_CHAIN_ID];

export const CHAIN_CONFIG: Record<number, {
  name: string;
  shortName: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  color: string;
  icon: string;
}> = {
  [BSC_CHAIN_ID]: {
    name: "BNB Smart Chain",
    shortName: "BSC",
    rpcUrl: "https://bsc-dataseed1.binance.org",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    color: "#F0B90B",
    icon: "bnb",
  },
  [ETH_CHAIN_ID]: {
    name: "Ethereum",
    shortName: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "#627EEA",
    icon: "eth",
  },
};

export const CONTRACT_ADDRESSES = {
  token: import.meta.env.VITE_TOKEN_CONTRACT || "0xe6B06f7C63F6AC84729007ae8910010F6E721041",
  presale: import.meta.env.VITE_PRESALE_CONTRACT || "0xc0c050c064cc46ceca7dc5339244515c8a29590b",
  governance: import.meta.env.VITE_GOVERNANCE_CONTRACT || "0xC0c050c064Cc46ceca7dC5339244515c8A29590B",
  daoWallet: import.meta.env.VITE_DAO_WALLET || "0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9",
  operationWallet: import.meta.env.VITE_OPERATION_WALLET || "0x0ffe438e047dfb08c0c79aac9a63ea32d49a272c",
  founderWallet: import.meta.env.VITE_FOUNDER_WALLET || "0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23",
  liquidityWallet: import.meta.env.VITE_LIQUIDITY_WALLET || "0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9",
};

export const FUND_DISTRIBUTION = {
  founder: 60,
  liquidity: 40,
};

export const PRESALE_CONFIG = {
  stage1Price: parseFloat(import.meta.env.VITE_PRESALE_STAGE1 || "0.078"),
  stage2Price: parseFloat(import.meta.env.VITE_PRESALE_STAGE2 || "0.093"),
  listingPrice: parseFloat(import.meta.env.VITE_LISTING_PRICE || "0.12"),
  totalSupply: parseInt(import.meta.env.VITE_TOKEN_SUPPLY || "21000000"),
  presaleTarget: parseInt(import.meta.env.VITE_PRESALE_TARGET || "10000000"),
  minBuyUSD: 50,
  maxBuyUSD: 50000,
  minBuy: 0.01,
  maxBuy: 50,
  soulwareAuthority: "FULL_AUTONOMY",
  governanceModel: "AI_FIRST",
};

export const TOKENOMICS = {
  totalSupply: 21_000_000,
  soulwareDaoWallet: {
    amount: 17_999_000,
    label: "SoulwareAI + DAO",
    description: "Bonus, DEX/CEX liquidity, system coins — autonomously distributed on-chain by SoulwareAI",
  },
  founderWallet: {
    amount: 3_001_000,
    address: "0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23",
    label: "Founder (1 Year Locked)",
    description: "Locked for 1 year from listing date",
  },
  get soulwareDaoPercent() {
    return +((this.soulwareDaoWallet.amount / this.totalSupply) * 100).toFixed(2);
  },
  get founderPercent() {
    return +((this.founderWallet.amount / this.totalSupply) * 100).toFixed(2);
  },
};

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

export const PRESALE_ABI = [
  "function buyTokens() payable",
  "function buy() payable",
  "function getTokenPrice() view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function totalRaised() view returns (uint256)",
  "function stage() view returns (uint8)",
  "function isActive() view returns (bool)",
  "function getContribution(address) view returns (uint256)",
  "event TokensPurchased(address indexed buyer, uint256 amount, uint256 tokens)",
  "event StageChanged(uint8 newStage)",
];

export const DAO_ABI = [
  "function proposalCount() view returns (uint256)",
  "function proposals(uint256) view returns (uint256 id, string description, uint256 forVotes, uint256 againstVotes, uint256 startTime, uint256 endTime, bool executed, address proposer)",
  "function vote(uint256 proposalId, bool support)",
  "function createProposal(string description) returns (uint256)",
  "function hasVoted(uint256 proposalId, address voter) view returns (bool)",
  "function getProposal(uint256 proposalId) view returns (tuple(uint256 id, string description, uint256 forVotes, uint256 againstVotes, uint256 startTime, uint256 endTime, bool executed, address proposer))",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)",
  "event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId)",
];

export function getExplorerUrl(chainId: number, txHash: string): string {
  const chain = CHAIN_CONFIG[chainId];
  return chain ? `${chain.explorerUrl}/tx/${txHash}` : `https://bscscan.com/tx/${txHash}`;
}

export function getAddressExplorerUrl(chainId: number, address: string): string {
  const chain = CHAIN_CONFIG[chainId];
  return chain ? `${chain.explorerUrl}/address/${address}` : `https://bscscan.com/address/${address}`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatTokenAmount(amount: number | string, decimals = 2): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + "K";
  return num.toFixed(decimals);
}
