'use client'

import { useReadContract } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { networkConfig, ERC20_ABI } from '@/config/web3Config'
import { formatTokenBalance, balanceToNumber } from '@/lib/web3Utils'

/**
 * Hook especializado para gerenciar saldo USDT
 * Fornece leitura em tempo real e formatação automática
 */
export const useUSDTBalance = (address?: `0x${string}`) => {
  // Lê saldo USDT do contrato ERC-20
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: networkConfig.polygon.contracts.usdt.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: polygon.id,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Atualiza a cada 10 segundos
      staleTime: 5000, // Considera dados válidos por 5 segundos
    },
  })

  // Lê informações do token (nome, símbolo, decimais)
  const { data: symbol } = useReadContract({
    address: networkConfig.polygon.contracts.usdt.address,
    abi: ERC20_ABI,
    functionName: 'symbol',
    chainId: polygon.id,
  })

  const { data: name } = useReadContract({
    address: networkConfig.polygon.contracts.usdt.address,
    abi: ERC20_ABI,
    functionName: 'name',
    chainId: polygon.id,
  })

  const { data: decimals } = useReadContract({
    address: networkConfig.polygon.contracts.usdt.address,
    abi: ERC20_ABI,
    functionName: 'decimals',
    chainId: polygon.id,
  })

  // Formata o saldo para diferentes precisões
  const formatBalance = (precision: number = 2) => {
    if (!balance) return '0.00'
    return formatTokenBalance(balance as bigint, 6, precision)
  }

  // Converte saldo para número
  const balanceAsNumber = balance ? balanceToNumber(balance as bigint, 6) : 0

  return {
    // Dados brutos
    rawBalance: balance,
    
    // Saldo formatado
    balance: formatBalance(2),
    balanceFormatted: `${formatBalance(2)} USDT`,
    balanceAsNumber,
    
    // Informações do token
    symbol: symbol || 'USDT',
    name: name || 'Tether USD',
    decimals: decimals || 6,
    
    // Estados
    isLoading,
    error,
    
    // Funções
    refetch,
    formatBalance,
    
    // Verificações úteis
    hasBalance: balanceAsNumber > 0,
    isEmpty: balanceAsNumber === 0,
    isAboveThreshold: (threshold: number) => balanceAsNumber >= threshold,
    
    // Formatação customizada
    formatCurrency: () => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(balanceAsNumber)
    },
  }
}