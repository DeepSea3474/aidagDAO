import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, bsc } from '@reown/appkit/networks'

export const projectId = '1d3b7fb8b050f6ffb48a3b3df1658b06'
export const networks = [mainnet, bsc]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'Aidag-Chain',
    description: 'Decentralized Autonomous Agent Network',
    url: 'https://aidag-chain.com',
    icons: ['https://aidag-chain.com/logo.png']
  }
})
