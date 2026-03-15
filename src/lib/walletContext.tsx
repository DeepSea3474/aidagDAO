import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ethers } from "ethers";
import { BSC_CHAIN_ID, CHAIN_CONFIG, SUPPORTED_CHAINS, shortenAddress } from "./web3Config";
import type { WalletType } from "@/components/WalletModal";

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  error: string | null;
  connectedWallet: WalletType | null;
}

interface WalletContextType extends WalletState {
  connect: (walletType?: WalletType) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
  sendTransaction: (to: string, valueInEth: string) => Promise<string>;
  isCorrectChain: boolean;
  shortAddress: string;
  chainName: string;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
  connectingWallet: WalletType | null;
  isMobile: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

const WC_PROJECT_ID = "3fcc6bba6f1de962d911bb5b5c3dba68";

function detectMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isInsideWalletBrowser(): boolean {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return false;
  return !!(ethereum.isMetaMask || ethereum.isTrust || ethereum.isTrustWallet || ethereum.isCoinbaseWallet);
}

function getSpecificProvider(walletType: WalletType): any {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return null;

  if (ethereum.providers?.length) {
    for (const p of ethereum.providers) {
      if (walletType === "metamask" && p.isMetaMask && !p.isBraveWallet) return p;
      if (walletType === "trustwallet" && (p.isTrust || p.isTrustWallet)) return p;
      if (walletType === "coinbase" && p.isCoinbaseWallet) return p;
    }
  }

  if (walletType === "metamask" && ethereum.isMetaMask && !ethereum.isBraveWallet) return ethereum;
  if (walletType === "trustwallet") {
    if (ethereum.isTrust || ethereum.isTrustWallet) return ethereum;
    if ((window as any).trustwallet) return (window as any).trustwallet;
  }
  if (walletType === "coinbase") {
    if (ethereum.isCoinbaseWallet) return ethereum;
    if ((window as any).coinbaseWalletExtension) return (window as any).coinbaseWalletExtension;
  }

  return null;
}

function getMobileDeepLink(walletType: WalletType): string | null {
  const host = window.location.host;
  const path = window.location.pathname;
  const fullUrl = window.location.href;

  switch (walletType) {
    case "metamask":
      // Direct deep link that triggers connection prompt in MetaMask app
      return `metamask://dapp/${host}${path}`;
    case "trustwallet":
      // Standard Trust Wallet deep link for DApps
      return `https://link.trustwallet.com/open_url?url=${encodeURIComponent(fullUrl)}&coin_id=60`;
    case "coinbase":
      // Official Coinbase Wallet DApp redirection
      return `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(fullUrl)}`;
    default:
      return null;
  }
}

async function connectToProvider(ethereum: any): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
  chainId: number;
  balance: string;
}> {
  const provider = new ethers.BrowserProvider(ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const balance = await provider.getBalance(address);
  return { provider, signer, address, chainId, balance: ethers.formatEther(balance) };
}

async function initWalletConnect() {
  const { default: EthereumProvider } = await import("@walletconnect/ethereum-provider");
  const wcProv = await EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [BSC_CHAIN_ID],
    optionalChains: [1],
    showQrModal: true,
    metadata: {
      name: "AIDAG Chain",
      description: "AIDAG Chain - Quantum Secure AI Blockchain",
      url: window.location.origin,
      icons: [window.location.origin + "/favicon.ico"],
    },
  });
  await wcProv.connect();
  return await connectToProvider(wcProv);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    chainId: null,
    balance: null,
    provider: null,
    signer: null,
    error: null,
    connectedWallet: null,
  });
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);
  const isMobile = detectMobile();

  const updateBalance = useCallback(async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      setState(prev => ({ ...prev, balance: ethers.formatEther(balance) }));
    } catch {}
  }, []);

  const finishConnect = useCallback((data: Awaited<ReturnType<typeof connectToProvider>>, walletType: WalletType) => {
    setState({
      isConnected: true,
      isConnecting: false,
      address: data.address,
      chainId: data.chainId,
      balance: data.balance,
      provider: data.provider,
      signer: data.signer,
      error: null,
      connectedWallet: walletType,
    });
    localStorage.setItem("walletConnected", "true");
    localStorage.setItem("walletType", walletType);
    setShowWalletModal(false);
    setConnectingWallet(null);
  }, []);

  const handleError = useCallback((err: any, fallbackMsg: string) => {
    const msg = err?.message || "";
    const isUserCancel = err.code === 4001 ||
      err.code === "ACTION_REJECTED" ||
      msg.includes("User rejected") ||
      msg.includes("user rejected") ||
      msg.includes("closed") ||
      msg.includes("denied") ||
      msg.includes("cancelled") ||
      msg.includes("User closed");
    if (isUserCancel) {
      setState(prev => ({ ...prev, isConnecting: false, error: null }));
    } else {
      console.warn("Wallet connection error:", err);
      setState(prev => ({ ...prev, isConnecting: false, error: fallbackMsg }));
    }
    setConnectingWallet(null);
  }, []);

  const connectWallet = useCallback(async (walletType: WalletType) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    setConnectingWallet(walletType);

    if (walletType === "walletconnect") {
      try {
        const data = await initWalletConnect();
        finishConnect(data, "walletconnect");
      } catch (err: any) {
        handleError(err, "Connection cancelled.");
      }
      return;
    }

    if (isInsideWalletBrowser()) {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        try {
          const data = await connectToProvider(ethereum);
          finishConnect(data, walletType);
          return;
        } catch (err: any) {
          handleError(err, "Connection rejected. Please approve the connection.");
          return;
        }
      }
    }

    const provider = getSpecificProvider(walletType);
    if (provider) {
      try {
        const data = await connectToProvider(provider);
        finishConnect(data, walletType);
        return;
      } catch (err: any) {
        handleError(err, "Connection rejected. Please approve the connection in your wallet.");
        return;
      }
    }

    if (isMobile) {
      const deepLink = getMobileDeepLink(walletType);
      if (deepLink) {
        setState(prev => ({ ...prev, isConnecting: false, error: null }));
        setConnectingWallet(null);
        setShowWalletModal(false);
        window.location.href = deepLink;
        return;
      }
    }

    const walletNames: Record<string, string> = {
      metamask: "MetaMask",
      trustwallet: "Trust Wallet",
      coinbase: "Coinbase Wallet",
    };
    const name = walletNames[walletType] || walletType;

    setState(prev => ({
      ...prev,
      isConnecting: false,
      error: isMobile
        ? `${name} app should be opening. If not, please open this site inside the ${name} browser or use WalletConnect.`
        : `${name} extension not detected. Please install ${name} or use WalletConnect.`,
    }));
    setConnectingWallet(null);
  }, [isMobile, finishConnect, handleError]);

  const connect = useCallback(async (walletType?: WalletType) => {
    if (!walletType) {
      setShowWalletModal(true);
      return;
    }
    await connectWallet(walletType);
  }, [connectWallet]);

  const disconnect = useCallback(async () => {
    setState({
      isConnected: false,
      isConnecting: false,
      address: null,
      chainId: null,
      balance: null,
      provider: null,
      signer: null,
      error: null,
      connectedWallet: null,
    });
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletType");
  }, []);

  const switchChain = useCallback(async (targetChainId: number) => {
    const ethereum = getSpecificProvider(state.connectedWallet || "metamask") || (window as any).ethereum;
    if (!ethereum) return;
    const chainHex = "0x" + targetChainId.toString(16);
    try {
      await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainHex }] });
    } catch (err: any) {
      if (err.code === 4902) {
        const config = CHAIN_CONFIG[targetChainId];
        if (config) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{ chainId: chainHex, chainName: config.name, rpcUrls: [config.rpcUrl], blockExplorerUrls: [config.explorerUrl], nativeCurrency: config.nativeCurrency }],
          });
        }
      }
    }
  }, [state.connectedWallet]);

  const sendTransaction = useCallback(async (to: string, valueInEth: string): Promise<string> => {
    if (!state.signer) throw new Error("Wallet not connected");
    const tx = await state.signer.sendTransaction({ to, value: ethers.parseEther(valueInEth) });
    await tx.wait();
    if (state.provider && state.address) updateBalance(state.provider, state.address);
    return tx.hash;
  }, [state.signer, state.provider, state.address, updateBalance]);

  useEffect(() => {
    const ethereum = (window as any)?.ethereum;
    if (!ethereum) return;
    const handleAccounts = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else if (state.isConnected) {
        setState(prev => ({ ...prev, address: accounts[0] }));
        if (state.provider) updateBalance(state.provider, accounts[0]);
      }
    };
    const handleChain = (hex: string) => {
      setState(prev => ({ ...prev, chainId: parseInt(hex, 16) }));
    };
    ethereum.on("accountsChanged", handleAccounts);
    ethereum.on("chainChanged", handleChain);
    return () => { ethereum.removeListener("accountsChanged", handleAccounts); ethereum.removeListener("chainChanged", handleChain); };
  }, [state.isConnected, state.provider, state.address, disconnect, updateBalance]);

  useEffect(() => {
    const reconnect = async () => {
      if (localStorage.getItem("walletConnected") !== "true") return;
      const savedType = localStorage.getItem("walletType") as WalletType | null;
      if (!savedType) return;

      if (isInsideWalletBrowser() && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
          if (accounts?.length > 0) {
            const data = await connectToProvider((window as any).ethereum);
            finishConnect(data, savedType);
            return;
          }
        } catch {}
      }

      const provider = getSpecificProvider(savedType);
      if (!provider) {
        localStorage.removeItem("walletConnected");
        localStorage.removeItem("walletType");
        return;
      }

      try {
        const accounts = await provider.request({ method: "eth_accounts" });
        if (accounts?.length > 0) {
          const data = await connectToProvider(provider);
          finishConnect(data, savedType);
        } else {
          localStorage.removeItem("walletConnected");
          localStorage.removeItem("walletType");
        }
      } catch {
        localStorage.removeItem("walletConnected");
        localStorage.removeItem("walletType");
      }
    };
    reconnect();
  }, []);

  const isCorrectChain = state.chainId !== null && SUPPORTED_CHAINS.includes(state.chainId);
  const shortAddress = state.address ? shortenAddress(state.address) : "";
  const chainName = state.chainId ? (CHAIN_CONFIG[state.chainId]?.shortName || `Chain ${state.chainId}`) : "";

  return (
    <WalletContext.Provider value={{
      ...state, connect, disconnect, switchChain, sendTransaction,
      isCorrectChain, shortAddress, chainName,
      showWalletModal, setShowWalletModal, connectingWallet, isMobile,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
