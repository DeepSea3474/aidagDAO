'use client';
/**
 * ══════════════════════════════════════════════════════════════
 *  AIDAG Chain — Global Wallet Context
 *  Direct wallet connection: MetaMask · Trust · Coinbase ·
 *  WalletConnect · Binance Web3 · OKX
 *  After permission + AIDAG Chain signature → autonomous connect
 * ══════════════════════════════════════════════════════════════
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────
const TOKEN_CONTRACT  = '0xe6B06f7C63F6AC84729007ae8910010F6E721041';
const FOUNDER_WALLET  = '0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9';
const BSC_CHAIN_ID    = 56;
const BSC_CHAIN_HEX   = '0x38';
const BSC_RPC         = 'https://bsc-dataseed1.binance.org';
const REOWN_PROJECT_ID = '1d3b7fb8b050f6ffb48a3b3df1658b06';

const BSC_NETWORK_PARAMS = {
  chainId: BSC_CHAIN_HEX,
  chainName: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: ['https://bsc-dataseed1.binance.org', 'https://bsc-dataseed2.binance.org'],
  blockExplorerUrls: ['https://bscscan.com'],
};

// ── AIDAG Chain sign message ──────────────────────────────────
function buildSignMessage(address: string): string {
  return [
    '══════════════════════════════════════',
    '  AIDAG Chain — SoulwareAI Connection',
    '══════════════════════════════════════',
    '',
    'Welcome to AIDAG Chain.',
    '',
    'You are connecting your wallet to the',
    'SoulwareAI autonomous ecosystem.',
    '',
    'This signature grants READ access to',
    'your on-chain AIDAG balance and enables',
    'participation in presale and DAO governance.',
    '',
    'No tokens will be transferred by this signature.',
    '',
    `Wallet:    ${address}`,
    `Chain:     BSC (Chain ID: 56)`,
    `Network:   BNB Smart Chain`,
    `Protocol:  SoulwareAI v1.0.0`,
    `Timestamp: ${new Date().toISOString()}`,
    '',
    'Owner: AIDAG Chain & DeepSea3474',
    '══════════════════════════════════════',
  ].join('\n');
}

// ── RPC helpers ───────────────────────────────────────────────
async function rpcCall(method: string, params: unknown[]): Promise<string> {
  const res = await fetch(BSC_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    signal: AbortSignal.timeout(6000),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result as string;
}

async function fetchBnbBalance(addr: string): Promise<string> {
  try {
    const hex = await rpcCall('eth_getBalance', [addr, 'latest']);
    return (Number(BigInt(hex)) / 1e18).toFixed(4);
  } catch { return '0.0000'; }
}

async function fetchAidagBalance(addr: string): Promise<string> {
  try {
    const data = '0x70a08231' + addr.slice(2).padStart(64, '0');
    const hex = await rpcCall('eth_call', [{ to: TOKEN_CONTRACT, data }, 'latest']);
    if (!hex || hex === '0x') return '0';
    return (Number(BigInt(hex)) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 4 });
  } catch { return '0'; }
}

async function fetchAidagBalanceRaw(addr: string): Promise<bigint> {
  try {
    const data = '0x70a08231' + addr.slice(2).padStart(64, '0');
    const hex = await rpcCall('eth_call', [{ to: TOKEN_CONTRACT, data }, 'latest']);
    if (!hex || hex === '0x') return 0n;
    return BigInt(hex);
  } catch { return 0n; }
}

// ── Types ─────────────────────────────────────────────────────
export type WalletType = 'metamask' | 'trust' | 'coinbase' | 'walletconnect' | 'binance' | 'okx' | 'injected';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  bnbBalance: string | null;
  aidagBalance: string | null;
  aidagBalanceRaw: bigint;
  isConnected: boolean;
  isConnecting: boolean;
  isSigning: boolean;
  isSigned: boolean;          // signed AIDAG Chain auth message
  walletType: WalletType | null;
  signature: string | null;
  error: string | null;
  modalOpen: boolean;
}

export interface WalletContextValue extends WalletState {
  openModal: () => void;
  closeModal: () => void;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  switchToBSC: () => Promise<void>;
  sendPresaleTx: (bnbAmount: string) => Promise<string>;
  getActiveProvider: () => Promise<any | null>;
}

// ── Context ───────────────────────────────────────────────────
const WalletCtx = createContext<WalletContextValue | null>(null);

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error('useWalletContext must be used inside <WalletProvider>');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null, chainId: null, bnbBalance: null, aidagBalance: null,
    aidagBalanceRaw: 0n, isConnected: false, isConnecting: false,
    isSigning: false, isSigned: false, walletType: null,
    signature: null, error: null, modalOpen: false,
  });

  const merge = useCallback((patch: Partial<WalletState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  // ── Get ethereum provider based on wallet type ─────────────
  const getProvider = useCallback((type: WalletType): any => {
    if (typeof window === 'undefined') return null;
    const eth = (window as any).ethereum;
    if (!eth) return null;

    switch (type) {
      case 'metamask':
        // Multi-provider EIP-5749: prefer MetaMask explicitly
        if (eth.providers && Array.isArray(eth.providers)) {
          const mm = eth.providers.find((p: any) => p.isMetaMask && !p.isBraveWallet && !p.isTrust && !p.isCoinbaseWallet && !p.isOkxWallet);
          if (mm) return mm;
        }
        // Some MM builds expose detectEthereumProvider via window.ethereum directly
        if (eth.isMetaMask && !eth.isBraveWallet && !eth.isTrust && !eth.isCoinbaseWallet) return eth;
        return null;
      case 'coinbase':
        if (eth.providers) return eth.providers.find((p: any) => p.isCoinbaseWallet) ?? null;
        return eth.isCoinbaseWallet ? eth : null;
      case 'binance':
        if (eth.providers) return eth.providers.find((p: any) => p.isBinance || p.isBinanceSmartChain) ?? null;
        return (eth.isBinance || eth.isBinanceSmartChain) ? eth : null;
      case 'okx':
        if (eth.providers) return eth.providers.find((p: any) => p.isOKExWallet || p.isOkxWallet) ?? null;
        return (eth.isOKExWallet || eth.isOkxWallet) ? eth : null;
      case 'trust':
        if (eth.providers) return eth.providers.find((p: any) => p.isTrust) ?? null;
        return eth.isTrust ? eth : null;
      default:
        return eth;
    }
  }, []);

  // ── Mobile deeplink builders (open dApp inside wallet's own browser) ──
  const buildMobileDeeplink = useCallback((type: WalletType): string | null => {
    if (typeof window === 'undefined') return null;
    const host = window.location.host;
    const path = window.location.pathname + window.location.search;
    const fullUrl = `${host}${path}`;
    const httpsUrl = `https://${fullUrl}`;
    switch (type) {
      case 'metamask':
        return `https://metamask.app.link/dapp/${fullUrl}`;
      case 'trust':
        return `https://link.trustwallet.com/open_url?coin_id=20000714&url=${encodeURIComponent(httpsUrl)}`;
      case 'coinbase':
        return `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(httpsUrl)}`;
      case 'okx':
        return `okx://wallet/dapp/url?dappUrl=${encodeURIComponent(httpsUrl)}`;
      case 'binance':
        return `bnc://app.binance.com/cedefi/ramp-binance?url=${encodeURIComponent(httpsUrl)}`;
      default:
        return null;
    }
  }, []);

  // ── Switch to BSC ─────────────────────────────────────────
  const switchToBSC = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_HEX }] });
    } catch (err: any) {
      if (err.code === 4902) {
        await eth.request({ method: 'wallet_addEthereumChain', params: [BSC_NETWORK_PARAMS] });
      }
    }
  }, []);

  // ── Request signature = AIDAG Chain auth ───────────────────
  const requestSignature = useCallback(async (provider: any, address: string): Promise<string> => {
    const message = buildSignMessage(address);
    const hexMsg = '0x' + Array.from(new TextEncoder().encode(message))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    return await provider.request({ method: 'personal_sign', params: [hexMsg, address] });
  }, []);

  // ── Refresh balances ──────────────────────────────────────
  const refreshBalances = useCallback(async () => {
    if (!state.address) return;
    const [bnb, aidag, aidagRaw] = await Promise.all([
      fetchBnbBalance(state.address),
      fetchAidagBalance(state.address),
      fetchAidagBalanceRaw(state.address),
    ]);
    merge({ bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: aidagRaw });
  }, [state.address, merge]);

  // ── Finalize: switch chain → sign → balances ──────────────
  const finalizeConnection = useCallback(async (provider: any, rawAddress: string, type: WalletType) => {
    const address = rawAddress.toLowerCase();

    try {
      const currentChain: string = await provider.request({ method: 'eth_chainId' });
      if (parseInt(currentChain, 16) !== BSC_CHAIN_ID) {
        try {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_HEX }] });
        } catch (switchErr: any) {
          if (switchErr.code === 4902) {
            await provider.request({ method: 'wallet_addEthereumChain', params: [BSC_NETWORK_PARAMS] });
          }
        }
      }
    } catch {}

    merge({ isSigning: true });
    let signature = '';
    try {
      signature = await requestSignature(provider, address);
    } catch (sigErr: any) {
      // signature optional on WC flows where some wallets reject silently — keep going
      console.warn('Signature skipped:', sigErr?.message);
    }

    const [bnb, aidag, aidagRaw] = await Promise.all([
      fetchBnbBalance(address),
      fetchAidagBalance(address),
      fetchAidagBalanceRaw(address),
    ]);

    merge({
      address, chainId: BSC_CHAIN_ID, walletType: type,
      bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: aidagRaw,
      isConnected: true, isConnecting: false, isSigning: false,
      isSigned: !!signature, signature: signature || null, error: null,
    });

    // Persist session so all pages / refreshes see the same wallet
    try {
      localStorage.setItem('aidag_wallet_session', JSON.stringify({
        address, walletType: type, signature: signature || null, signed: !!signature,
        ts: Date.now(),
      }));
    } catch {}
  }, [merge, requestSignature]);

  // ── Core connect flow ─────────────────────────────────────
  const connect = useCallback(async (type: WalletType) => {
    merge({ isConnecting: true, error: null, modalOpen: false });

    try {
      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const specificProvider = getProvider(type);
      const eth = (window as any).ethereum;

      // ─── 1. Explicit WalletConnect choice ───
      if (type === 'walletconnect') {
        const { connectViaWalletConnect } = await import('./web3modal');
        const result = await connectViaWalletConnect();
        if (!result || !result.address) { merge({ isConnecting: false }); return; }
        const wcProvider = result.provider ?? (window as any).ethereum;
        await finalizeConnection(wcProvider, result.address, 'walletconnect');
        return;
      }

      // ─── 2. Specific provider found in-page (extension OR wallet's in-app browser) ───
      if (specificProvider) {
        const accounts: string[] = await specificProvider.request({ method: 'eth_requestAccounts' });
        if (!accounts.length) throw new Error('No accounts returned');
        await finalizeConnection(specificProvider, accounts[0], type);
        return;
      }

      // ─── 3. Mobile + no injected provider → open wallet's own browser via deeplink ───
      if (isMobile) {
        const deeplink = buildMobileDeeplink(type);
        if (deeplink) {
          merge({ isConnecting: false, error: null });
          // Use location.href so iOS/Android pass control to the wallet app
          window.location.href = deeplink;
          return;
        }
        // Fallback: WalletConnect QR/modal for wallets without a deeplink
        const { connectViaWalletConnect } = await import('./web3modal');
        const result = await connectViaWalletConnect();
        if (!result || !result.address) { merge({ isConnecting: false }); return; }
        const wcProvider = result.provider ?? (window as any).ethereum;
        await finalizeConnection(wcProvider, result.address, type);
        return;
      }

      // ─── 4. Desktop fallbacks ───
      // 4a. Generic injected (eth) exists but specific isn't recognised — try it
      if (eth) {
        try {
          const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
          if (accounts.length) {
            await finalizeConnection(eth, accounts[0], type);
            return;
          }
        } catch { /* fall through to install */ }
      }

      // 4b. No extension at all → install page
      const installUrls: Record<string, string> = {
        metamask: 'https://metamask.io/download/',
        coinbase: 'https://www.coinbase.com/wallet/downloads',
        binance:  'https://www.binance.com/en/web3wallet',
        okx:      'https://www.okx.com/web3',
        trust:    'https://trustwallet.com/download',
      };
      if (installUrls[type]) window.open(installUrls[type], '_blank');
      merge({ isConnecting: false, error: `${type} wallet not found. Please install the extension.` });

    } catch (err: any) {
      const msg = err?.message || 'Connection failed';
      merge({ isConnecting: false, isSigning: false, error: msg.includes('rejected') ? 'Signature rejected. Please approve to connect.' : msg });
    }
  }, [getProvider, buildMobileDeeplink, finalizeConnection, merge]);

  // ── Disconnect ────────────────────────────────────────────
  const disconnect = useCallback(() => {
    try { localStorage.removeItem('aidag_wallet_session'); } catch {}
    // Also disconnect the WalletConnect/AppKit session if any
    try {
      import('./web3modal').then(m => m.initWeb3Modal().then((modal: any) => {
        if (modal && typeof modal.disconnect === 'function') modal.disconnect().catch(() => {});
      }).catch(() => {}));
    } catch {}
    setState({
      address: null, chainId: null, bnbBalance: null, aidagBalance: null,
      aidagBalanceRaw: 0n, isConnected: false, isConnecting: false,
      isSigning: false, isSigned: false, walletType: null,
      signature: null, error: null, modalOpen: false,
    });
  }, []);

  // ── Get active provider (window.ethereum OR re-init WC OR deeplink) ──
  const getActiveProvider = useCallback(async (): Promise<any | null> => {
    if (typeof window === 'undefined') return null;
    const eth = (window as any).ethereum;
    if (eth) {
      // Prefer the specific wallet by type if present
      const specific = state.walletType ? getProvider(state.walletType) : null;
      return specific ?? eth;
    }
    // No injected — try restoring WalletConnect session
    try {
      const { initWeb3Modal } = await import('./web3modal');
      const m = await initWeb3Modal();
      if (m) {
        let p: any = null;
        try { p = m.getWalletProvider ? m.getWalletProvider() : null; } catch {}
        if (!p) { try { p = m.getProvider ? m.getProvider('eip155') : null; } catch {} }
        if (p) return p;
      }
    } catch {}
    return null;
  }, [state.walletType, getProvider]);

  // ── Send presale BNB transaction ──────────────────────────
  const sendPresaleTx = useCallback(async (bnbAmount: string): Promise<string> => {
    if (!state.address) throw new Error('Wallet not connected');
    let provider = await getActiveProvider();

    // No provider available — on mobile, deeplink to the wallet's in-app browser
    if (!provider) {
      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile && state.walletType) {
        const link = buildMobileDeeplink(state.walletType);
        if (link) {
          window.location.href = link;
          throw new Error('Opening your wallet app — please complete the transaction there.');
        }
      }
      throw new Error('Wallet provider unavailable. Please reconnect your wallet.');
    }

    // Ensure BSC
    try {
      const cur = await provider.request({ method: 'eth_chainId' });
      if (parseInt(cur, 16) !== BSC_CHAIN_ID) {
        try {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_HEX }] });
        } catch (sw: any) {
          if (sw.code === 4902) {
            await provider.request({ method: 'wallet_addEthereumChain', params: [BSC_NETWORK_PARAMS] });
          }
        }
      }
    } catch {}

    const weiHex = '0x' + BigInt(Math.round(parseFloat(bnbAmount) * 1e18)).toString(16);
    const txHash: string = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: state.address,
        to: FOUNDER_WALLET,
        value: weiHex,
        gas: '0x5208',       // 21000
        chainId: BSC_CHAIN_HEX,
      }],
    });
    return txHash;
  }, [state.address, state.walletType, getActiveProvider, buildMobileDeeplink]);

  // ── Restore persisted session + listen for account/chain changes ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let saved: any = null;
    try {
      const raw = localStorage.getItem('aidag_wallet_session');
      if (raw) saved = JSON.parse(raw);
    } catch {}

    // Optimistic UI: paint connected state immediately from storage so
    // navigating to other pages doesn't show "Connect Wallet" again.
    if (saved && saved.address) {
      merge({
        address: saved.address,
        chainId: BSC_CHAIN_ID,
        walletType: saved.walletType ?? 'injected',
        isConnected: true,
        isSigned: !!saved.signed,
        signature: saved.signature ?? null,
      });
      // Refresh balances in the background
      Promise.all([
        fetchBnbBalance(saved.address),
        fetchAidagBalance(saved.address),
        fetchAidagBalanceRaw(saved.address),
      ]).then(([bnb, aidag, raw]) => {
        merge({ bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: raw });
      }).catch(() => {});
    }

    const eth = (window as any).ethereum;
    if (eth) {
      const onAccounts = (accounts: string[]) => {
        if (!accounts.length) disconnect();
        else {
          const addr = accounts[0].toLowerCase();
          merge({ address: addr });
          try {
            const cur = localStorage.getItem('aidag_wallet_session');
            const obj = cur ? JSON.parse(cur) : {};
            localStorage.setItem('aidag_wallet_session', JSON.stringify({ ...obj, address: addr }));
          } catch {}
        }
      };
      const onChain = (chainId: string) => merge({ chainId: parseInt(chainId, 16) });
      eth.on('accountsChanged', onAccounts);
      eth.on('chainChanged', onChain);

      // If extension is unlocked & already authorized, sync silently
      if (!saved) {
        eth.request({ method: 'eth_accounts' }).then((accs: string[]) => {
          if (accs.length) {
            const addr = accs[0].toLowerCase();
            Promise.all([fetchBnbBalance(addr), fetchAidagBalance(addr), fetchAidagBalanceRaw(addr)])
              .then(([bnb, aidag, raw]) => {
                merge({
                  address: addr, chainId: BSC_CHAIN_ID,
                  bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: raw,
                  isConnected: true, isSigned: false,
                });
                try {
                  localStorage.setItem('aidag_wallet_session', JSON.stringify({
                    address: addr, walletType: 'injected', signed: false, signature: null, ts: Date.now(),
                  }));
                } catch {}
              });
          }
        }).catch(() => {});
      }

      return () => {
        eth.removeListener('accountsChanged', onAccounts);
        eth.removeListener('chainChanged', onChain);
      };
    }
  }, []); // eslint-disable-line

  const value: WalletContextValue = {
    ...state,
    openModal: () => merge({ modalOpen: true, error: null }),
    closeModal: () => merge({ modalOpen: false, error: null }),
    connect,
    disconnect,
    refreshBalances,
    switchToBSC,
    sendPresaleTx,
    getActiveProvider,
  };

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}
