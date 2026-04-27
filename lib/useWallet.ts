'use client';
/**
 * Compatibility shim — re-exports from WalletContext so all pages
 * that import useWallet continue to work without modification.
 */
export { useWalletContext as useWallet } from './WalletContext';
export type { WalletContextValue as WalletState } from './WalletContext';
