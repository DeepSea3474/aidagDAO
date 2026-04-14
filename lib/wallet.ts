import { http, createConfig } from 'wagmi'
import { mainnet, bsc } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = createConfig(
  getDefaultConfig({
    appName: 'Aidag Chain',
    projectId: 'WALLETCONNECT_PROJECT_ID',
    chains: [bsc, mainnet],
    transports: {
      [bsc.id]: http(),
      [mainnet.id]: http(),
    },
  })
)

