// @ts-nocheck
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet, bsc } from 'wagmi/chains'

export const projectId = '1d3b7fb8b050f6ffb48a3b3df1658b06'

export const metadata = {
  name: 'Aidag-Chain',
  description: 'Aidag-Chain Web3 Dashboard',
  url: 'https://aidag-chain.com',
  icons: ['https://aidag-chain.com/logo.png']
}

export const chains = [mainnet, bsc] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
})
