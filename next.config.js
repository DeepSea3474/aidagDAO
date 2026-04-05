/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_BSC_RPC: process.env.NEXT_PUBLIC_BSC_RPC,
    NEXT_PUBLIC_ETH_RPC: process.env.NEXT_PUBLIC_ETH_RPC,
    NEXT_PUBLIC_TOKEN_CONTRACT: process.env.NEXT_PUBLIC_TOKEN_CONTRACT,
    NEXT_PUBLIC_PRESALE_CONTRACT: process.env.NEXT_PUBLIC_PRESALE_CONTRACT,
    NEXT_PUBLIC_DAO_WALLET: process.env.NEXT_PUBLIC_DAO_WALLET,
    NEXT_PUBLIC_FOUNDER_WALLET: process.env.NEXT_PUBLIC_FOUNDER_WALLET,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.replit.app',
    '*.pike.replit.dev',
    '127.0.0.1',
  ],
};

module.exports = nextConfig;
