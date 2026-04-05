import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, bsc, polygon } from '@reown/appkit/networks'

const projectId = '1d3b7fb8b050f6ffb48a3b3df1658b06'

export const initWeb3Modal = () => {
  if (typeof window !== 'undefined') {
    createAppKit({
      adapters: [new EthersAdapter()],
      networks: [mainnet, bsc, polygon],
      metadata: {
        name: 'AIDAG CHAIN',
        description: 'AIDAG DAO Ecosystem',
        url: window.location.origin,
        icons: ['https://agdao.pages.dev/logo.png']
      },
      projectId,
      features: {
        analytics: true,
        allWallets: true, // Dünyadaki tüm cüzdanları aktif et
        email: false
      },
      themeMode: 'dark'
    })
  }
}
