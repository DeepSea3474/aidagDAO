'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1d3b7fb8b050f6ffb48a3b3df1658b06';

const bscMainnet = {
  chainId: 56,
  name: 'BNB Smart Chain',
  currency: 'BNB',
  explorerUrl: 'https://bscscan.com',
  rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC || 'https://bsc-dataseed1.binance.org'
};

const ethereumMainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://eth.llamarpc.com'
};

const metadata = {
  name: 'AIDAG Chain',
  description: 'First AI-Managed Cryptocurrency - No Founder Intervention',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://aidag.io',
  icons: ['/aidag-logo.jpg']
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: bscMainnet.rpcUrl,
  defaultChainId: 56
});

let modal = null;

export function initWeb3Modal() {
  if (typeof window === 'undefined') return null;
  
  if (!modal) {
    try {
      modal = createWeb3Modal({
        ethersConfig,
        chains: [bscMainnet, ethereumMainnet],
        projectId,
        enableAnalytics: false,
        themeMode: 'dark',
        themeVariables: {
          '--w3m-accent': '#00bfff',
          '--w3m-color-mix': '#0a0a0a',
          '--w3m-color-mix-strength': 40,
          '--w3m-border-radius-master': '12px'
        }
      });
    } catch (error) {
      console.error('Web3Modal init error:', error);
    }
  }
  
  return modal;
}

export function getWeb3Modal() {
  if (!modal) {
    return initWeb3Modal();
  }
  return modal;
}

export function openWeb3Modal() {
  const m = getWeb3Modal();
  if (m) {
    m.open();
  }
}

export function closeWeb3Modal() {
  const m = getWeb3Modal();
  if (m) {
    m.close();
  }
}

export { projectId, bscMainnet, ethereumMainnet, metadata, ethersConfig };
