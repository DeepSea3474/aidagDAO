import { useEffect } from 'react';
import '../styles/globals.css';
import { initWeb3Modal } from '../lib/web3modal';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Cüzdan motorunu güvenli bir şekilde başlat
    if (typeof window !== 'undefined') {
      initWeb3Modal();
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
