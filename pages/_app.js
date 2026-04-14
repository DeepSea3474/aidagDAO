import "../styles/globals.css";
import React, { useEffect, useState } from 'react';
import { wagmiAdapter } from "../lib/wallet";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  
  // Hydration hatalarını (HTML/React uyumsuzluğu) önlemek için
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
