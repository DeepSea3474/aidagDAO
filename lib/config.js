export const CHAINS = {
  BSC: {
    id: 56,
    name: "Binance Smart Chain",
    symbol: "BNB",
    rpc: process.env.NEXT_PUBLIC_BSC_RPC,
    explorer: "https://bscscan.com",
    active: true
  },
  ETH: {
    id: 1,
    name: "Ethereum Mainnet",
    symbol: "ETH",
    rpc: process.env.NEXT_PUBLIC_ETH_RPC,
    explorer: "https://etherscan.io",
    active: true
  },
  POLYGON: {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    rpc: process.env.NEXT_PUBLIC_POLYGON_RPC,
    explorer: "https://polygonscan.com",
    active: false
  },
  ARBITRUM: {
    id: 42161,
    name: "Arbitrum One",
    symbol: "ETH",
    rpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC,
    explorer: "https://arbiscan.io",
    active: false
  }
};

export const DEFAULT_CHAIN = CHAINS.BSC;
export const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC || process.env.NEXT_PUBLIC_RPC_URL;
export const BSC_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) || 56;
export const BSC_CHAIN_NAME = CHAINS.BSC.name;
export const ETH_CHAIN_ID = CHAINS.ETH.id;
export const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC;

export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT || "0xe6B06f7C63F6AC84729007ae8910010F6E721041";
export const PRESALE_CONTRACT = process.env.NEXT_PUBLIC_PRESALE_CONTRACT || "";
export const DAO_WALLET = process.env.NEXT_PUBLIC_DAO_WALLET || "";
export const FOUNDER_WALLET = process.env.NEXT_PUBLIC_FOUNDER_WALLET || "";
export const OPERATION_WALLET = process.env.NEXT_PUBLIC_OPERATION_WALLET || "";
export const GITHUB_URL = "https://github.com/DeepSea3474/aidagchain";

export const TREASURY_ADDRESS = DAO_WALLET;
export const GOVERNANCE_ADDRESS = PRESALE_CONTRACT;
export const FOUNDER_ADDRESS = FOUNDER_WALLET;

export const PRESALE_STAGE1_PRICE = parseFloat(process.env.NEXT_PUBLIC_PRESALE_STAGE1) || 0.078;
export const PRESALE_STAGE2_PRICE = parseFloat(process.env.NEXT_PUBLIC_PRESALE_STAGE2) || 0.098;
export const LISTING_PRICE = parseFloat(process.env.NEXT_PUBLIC_LISTING_PRICE) || 0.12;

export const MAX_SUPPLY = 21000000;
export const TOKEN_SUPPLY = parseInt(process.env.NEXT_PUBLIC_TOKEN_SUPPLY) || MAX_SUPPLY;
export const FOUNDER_COINS = parseInt(process.env.NEXT_PUBLIC_FOUNDER_COINS) || 3001000;
export const FOUNDER_LOCK_YEARS = parseInt(process.env.NEXT_PUBLIC_FOUNDER_LOCK_PERIOD) || 1;
export const DAO_COINS = MAX_SUPPLY - FOUNDER_COINS;
export const PRESALE_TARGET = parseInt(process.env.NEXT_PUBLIC_PRESALE_TARGET) || 10000000;

export const REVENUE_FOUNDER_PERCENT = 60;
export const REVENUE_LIQUIDITY_PERCENT = 40;
export const DAO_MEMBERSHIP_FEE = parseFloat(process.env.NEXT_PUBLIC_DAO_MEMBERSHIP_FEE) || 5;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aidag-chain.com";
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER || "https://twitter.com/aidagDAO";
export const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM || "https://t.me/Aidag_Chain_Global_Community";
export const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || "/logo.svg";

export const BSCSCAN_URL = CHAINS.BSC.explorer;
export const ETHERSCAN_URL = CHAINS.ETH.explorer;
export const BSCSCAN_TOKEN_URL = `${BSCSCAN_URL}/token/${TOKEN_ADDRESS}`;
export const BSCSCAN_ADDRESS_URL = (address) => `${BSCSCAN_URL}/address/${address}`;
export const BSCSCAN_TX_URL = (hash) => `${BSCSCAN_URL}/tx/${hash}`;
export const ETHERSCAN_ADDRESS_URL = (address) => `${ETHERSCAN_URL}/address/${address}`;
export const ETHERSCAN_TX_URL = (hash) => `${ETHERSCAN_URL}/tx/${hash}`;

export const getChainConfig = (chainId) => {
  return Object.values(CHAINS).find(chain => chain.id === chainId) || DEFAULT_CHAIN;
};

export const getChainConfigForWallet = (chain) => ({
  chainId: `0x${chain.id.toString(16)}`,
  chainName: chain.name,
  nativeCurrency: {
    name: chain.symbol,
    symbol: chain.symbol,
    decimals: 18
  },
  rpcUrls: [chain.rpc].filter(Boolean),
  blockExplorerUrls: [chain.explorer]
});

export const BSC_CHAIN_CONFIG = getChainConfigForWallet(CHAINS.BSC);
export const ETH_CHAIN_CONFIG = getChainConfigForWallet(CHAINS.ETH);
