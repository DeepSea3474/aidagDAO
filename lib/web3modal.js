'use client';

let modal = null;
let initPromise = null;

export async function initWeb3Modal() {
  if (typeof window === 'undefined') return null;
  if (modal) return modal;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const { createAppKit } = await import('@reown/appkit');

      const projectId = '1d3b7fb8b050f6ffb48a3b3df1658b06';

      modal = createAppKit({
        networks: [
          {
            id: 56,
            chainNamespace: 'eip155',
            caipNetworkId: 'eip155:56',
            name: 'BNB Smart Chain',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            rpcUrls: { default: { http: ['https://bsc-dataseed1.binance.org'] } },
            blockExplorers: { default: { name: 'BscScan', url: 'https://bscscan.com' } },
          },
        ],
        metadata: {
          name: 'AIDAG Chain',
          description: 'First AI-Managed Cryptocurrency',
          url: window.location.origin,
          icons: [window.location.origin + '/aidag-logo.jpg'],
        },
        projectId,
        features: { analytics: false, email: false, socials: [] },
        themeMode: 'dark',
      });
    } catch (err) {
      console.error('Web3Modal init error:', err);
      modal = null;
    }
    return modal;
  })();

  return initPromise;
}

export async function openWeb3Modal() {
  const m = await initWeb3Modal();
  if (m) m.open();
}

export async function closeWeb3Modal() {
  const m = await initWeb3Modal();
  if (m) m.close();
}

/**
 * Open AppKit modal and resolve with { provider, address, chainId }
 * once the user completes connection. Resolves with null if user closes the modal.
 */
export async function connectViaWalletConnect() {
  const m = await initWeb3Modal();
  if (!m) throw new Error('WalletConnect unavailable');

  await m.open();

  return new Promise((resolve) => {
    let unsubAccount = null;
    let unsubState = null;
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      try { unsubAccount && unsubAccount(); } catch {}
      try { unsubState && unsubState(); } catch {}
      resolve(result);
    };

    try {
      unsubAccount = m.subscribeAccount((acc) => {
        if (acc && acc.isConnected && acc.address) {
          let provider = null;
          try { provider = m.getWalletProvider ? m.getWalletProvider() : null; } catch {}
          if (!provider) {
            try { provider = m.getProvider ? m.getProvider('eip155') : null; } catch {}
          }
          let chainId = 56;
          try {
            const cid = m.getChainId ? m.getChainId() : null;
            if (typeof cid === 'number') chainId = cid;
          } catch {}
          finish({ provider, address: acc.address, chainId });
        }
      });
    } catch (e) { console.warn('subscribeAccount failed', e); }

    try {
      unsubState = m.subscribeState((s) => {
        if (s && s.open === false && !settled) {
          setTimeout(() => {
            if (!settled) finish(null);
          }, 400);
        }
      });
    } catch (e) { console.warn('subscribeState failed', e); }
  });
}
