import { useEffect } from 'react';
import '../styles/globals.css';
import { initWeb3Modal } from '../lib/web3modal';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Sayfa yüklenir yüklenmez cüzdan motorunu ateşle
    initWeb3Modal();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
