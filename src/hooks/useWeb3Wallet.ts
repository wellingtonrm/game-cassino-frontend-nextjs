'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useAccount, useBalance, useDisconnect, useEnsName, useReadContract, useChainId } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { useWeb3WalletStore } from '@/stores/web3Wallet'
import { 
  formatTokenBalance, 
  balanceToNumber, 
  isPolygonNetwork, 
  getMockPrices,
  calculateUSDValue 
} from '@/web3/util/web3Utils'
import { networkConfig } from '@/web3/config/web3Config'
import { TokenBalance } from '@/types'

// ABI mínimo do ERC-20 para USDT
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
] as const

import { useNetworkStatus } from './useNetworkStatus'

/**
 * Hook principal para gerenciar estado da carteira Web3
 * Integra com RainbowKit/Wagmi e sincroniza com Zustand store
 */
export const useWeb3Wallet = () => {
  const { disconnect } = useDisconnect()
  const { isOnline, connectionStatus } = useNetworkStatus()
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Estado da carteira Web3 do Zustand
  const {
    address,
    isConnected,
    chainId,
    isLoading,
    error,
    maticBalance,
    usdtBalance,
    ensName,
    connector,
    setConnected,
    setDisconnected,
    setLoading,
    setError,
    setMaticBalance,
    setUSDTBalance,
    setEnsName,
    updateSession,
  } = useWeb3WalletStore()

  // Hooks do Wagmi
  const wagmiAccount = useAccount()
  const currentChainId = useChainId()
  const { data: ensData } = useEnsName({ address: wagmiAccount.address })
  
  // Saldo MATIC nativo
  const { data: maticBalanceData, refetch: refetchMaticBalance, isError: isMaticBalanceError } = useBalance({
    address: wagmiAccount.address,
    chainId: polygon.id,
    // Add query settings for offline support
    query: {
      enabled: isOnline && wagmiAccount.address !== undefined && wagmiAccount.isConnected,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && 
            (error.message.includes('WalletConnect') || 
             error.message.includes('User rejected'))) {
          return false;
        }
        return failureCount < 2;
      }
    }
  })

  // Saldo USDT (ERC-20)
  const { data: usdtBalanceData, refetch: refetchUSDTBalance, isError: isUSDTBalanceError } = useReadContract({
    address: networkConfig.polygon.contracts.usdt.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: wagmiAccount.address ? [wagmiAccount.address] : undefined,
    chainId: polygon.id,
    // Add query settings for offline support
    query: {
      enabled: isOnline && wagmiAccount.address !== undefined && wagmiAccount.isConnected,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && 
            (error.message.includes('WalletConnect') || 
             error.message.includes('User rejected'))) {
          return false;
        }
        return failureCount < 2;
      }
    }
  })

  // Clear retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  // Handle network status changes
  useEffect(() => {
    if (!isOnline && isConnected) {
      setError('Conexão perdida. Verifique sua conexão com a internet.')
    } else if (isOnline && error && error.includes('Conexão perdida')) {
      // Clear connection lost error when back online
      setError(null)
      // Refresh balances when back online
      refreshBalances()
    }
  }, [isOnline, isConnected, error, setError])

  // Sincroniza estado da conexão com Wagmi
  useEffect(() => {
    if (wagmiAccount.isConnected && wagmiAccount.address && currentChainId) {
      setConnected(
        wagmiAccount.address,
        currentChainId,
        wagmiAccount.connector?.name || 'Unknown'
      )
    } else if (!wagmiAccount.isConnected) {
      setDisconnected()
    }
  }, [wagmiAccount.isConnected, wagmiAccount.address, currentChainId, wagmiAccount.connector, setConnected, setDisconnected])

  // Atualiza saldo MATIC
  useEffect(() => {
    if (maticBalanceData) {
      const formattedBalance = formatTokenBalance(maticBalanceData.value, 18, 4)
      setMaticBalance(formattedBalance)
    } else if (isMaticBalanceError && connectionStatus === 'online') {
      // Retry after a delay if there was an error and we're online
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      retryTimeoutRef.current = setTimeout(() => {
        refetchMaticBalance()
      }, 5000)
    }
  }, [maticBalanceData, isMaticBalanceError, connectionStatus, setMaticBalance, refetchMaticBalance])

  // Atualiza saldo USDT
  useEffect(() => {
    if (usdtBalanceData) {
      const formattedBalance = formatTokenBalance(usdtBalanceData as bigint, 6, 2)
      setUSDTBalance(formattedBalance)
    } else if (isUSDTBalanceError && connectionStatus === 'online') {
      // Retry after a delay if there was an error and we're online
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      retryTimeoutRef.current = setTimeout(() => {
        refetchUSDTBalance()
      }, 5000)
    }
  }, [usdtBalanceData, isUSDTBalanceError, connectionStatus, setUSDTBalance, refetchUSDTBalance])

  // Atualiza ENS name
  useEffect(() => {
    setEnsName(ensData || null)
  }, [ensData, setEnsName])

  // Função para desconectar carteira
  const handleDisconnect = useCallback(async () => {
    try {
      setLoading(true)
      await disconnect()
      setDisconnected()
    } catch (error) {
      console.error('Erro ao desconectar carteira:', error)
      setError('Erro ao desconectar carteira')
    } finally {
      setLoading(false)
    }
  }, [disconnect, setLoading, setDisconnected, setError])

  // Função para atualizar saldos manualmente
  const refreshBalances = useCallback(async () => {
    if (!isOnline) {
      setError('Não é possível atualizar saldos offline')
      return
    }

    if (!wagmiAccount.isConnected || !wagmiAccount.address) {
      setError('Carteira não conectada')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await Promise.all([
        refetchMaticBalance(),
        refetchUSDTBalance(),
      ])
      updateSession()
    } catch (error) {
      console.error('Erro ao atualizar saldos:', error)
      if (error instanceof Error && error.message.includes('WalletConnect')) {
        setError('Erro de conexão com a carteira. Tente reconectar.')
      } else {
        setError('Erro ao atualizar saldos')
      }
    } finally {
      setLoading(false)
    }
  }, [isOnline, wagmiAccount.isConnected, wagmiAccount.address, refetchMaticBalance, refetchUSDTBalance, updateSession, setLoading, setError])

  // Verifica se está na rede correta
  const isCorrectNetwork = isPolygonNetwork(chainId || 0)

  // Calcula valores em USD
  const prices = getMockPrices()
  const maticUSDValue = calculateUSDValue(parseFloat(maticBalance), prices.matic.usd)
  const usdtUSDValue = calculateUSDValue(parseFloat(usdtBalance), prices.usdt.usd)

  // Formata balances para exibição
  const formattedBalances = {
    matic: {
      balance: maticBalance,
      formatted: `${maticBalance} MATIC`,
      decimals: 18,
      symbol: 'MATIC',
      usdValue: maticUSDValue,
    } as TokenBalance,
    usdt: {
      balance: usdtBalance,
      formatted: `${usdtBalance} USDT`,
      decimals: 6,
      symbol: 'USDT',
      usdValue: usdtUSDValue,
    } as TokenBalance,
  }

  return {
    // Estado da conexão
    address,
    ensName,
    isConnected,
    chainId,
    connector,
    
    // Estados
    isLoading,
    error,
    isOnline,
    connectionStatus,
    
    // Saldos
    maticBalance,
    usdtBalance,
    balances: formattedBalances,
    isCorrectNetwork,
    
    // Funções
    disconnect: handleDisconnect,
    refreshBalances,
    clearError: () => setError(null),
  }
}