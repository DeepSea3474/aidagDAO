"use client";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useSignMessage } from 'wagmi'

export default function ConnectButton() {
  const { open } = useWeb3Modal()
  const { isConnected, address } = useAccount()
  const { signMessage } = useSignMessage()

  const handleAction = async () => {
    if (!isConnected) {
      await open()
    } else {
      signMessage({ 
        message: 'Aidag-Chain Onayi\nCüzdan: ' + address + '\nZaman: ' + Date.now()
      })
    }
  }

  return (
    <button 
      onClick={handleAction}
      style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}
    >
      {isConnected ? 'Oturumu Onayla' : 'Cüzdanı Bağla'}
    </button>
  )
}
