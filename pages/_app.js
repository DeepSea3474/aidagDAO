import { useEffect } from "react";
import "../lib/i18n";
import '../styles/globals.css'
import '../styles/components.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const initModal = async () => {
      try {
        const { initWeb3Modal } = await import('../lib/web3modal');
        initWeb3Modal();
      } catch (error) {
        console.error('Failed to initialize Web3Modal:', error);
      }
    };
    initModal();
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
