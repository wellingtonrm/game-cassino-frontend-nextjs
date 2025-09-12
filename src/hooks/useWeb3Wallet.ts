'use client'

import { useEffect, useCallback } from 'react'
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
import { networkConfig, ERC20_ABI } from '@/web3/config/web3Config'
import { TokenBalance } from '@/types'

/**
 * Hook principal para gerenciar estado da carteira Web3
 * Integra com RainbowKit/Wagmi e sincroniza com Zustand store
 */
export const useWeb3Wallet = () => {
  const { disconnect } = useDisconnect()
  
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
  const { data: maticBalanceData, refetch: refetchMaticBalance } = useBalance({
    address: wagmiAccount.address,
    chainId: polygon.id,
  })

  // Saldo USDT (ERC-20)
  const { data: usdtBalanceData, refetch: refetchUSDTBalance } = useReadContract({
    address: networkConfig.polygon.contracts.usdt.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: wagmiAccount.address ? [wagmiAccount.address] : undefined,
    chainId: polygon.id,
  })

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
    }
  }, [maticBalanceData, setMaticBalance])

  // Atualiza saldo USDT
  useEffect(() => {
    if (usdtBalanceData) {
      const formattedBalance = formatTokenBalance(usdtBalanceData as bigint, 6, 2)
      setUSDTBalance(formattedBalance)
    }
  }, [usdtBalanceData, setUSDTBalance])

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
    try {
      setLoading(true)
      await Promise.all([
        refetchMaticBalance(),
        refetchUSDTBalance(),
      ])
      updateSession()
    } catch (error) {
      console.error('Erro ao atualizar saldos:', error)
      setError('Erro ao atualizar saldos')
    } finally {
      setLoading(false)
    }
  }, [refetchMaticBalance, refetchUSDTBalance, updateSession, setLoading, setError])

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
    isLoading,
    error,
    isCorrectNetwork,

    // Saldos
    balances: formattedBalances,
    maticBalance,
    usdtBalance,
    totalUSDValue: maticUSDValue + usdtUSDValue,

    // Funções
    disconnect: handleDisconnect,
    refreshBalances,
    clearError: () => setError(null),

    // Informações da rede
    networkName: chainId ? (chainId === 137 ? 'Polygon' : `Rede ${chainId}`) : null,
    blockExplorerUrl: chainId === 137 ? 'https://polygonscan.com' : null,
  }
}