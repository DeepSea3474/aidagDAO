import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Aidag-Chain',
  projectId: '1d3b7fb8b050f6ffb48a3b3df1658b06',
  chains: [bsc],
});
