import { polygon } from 'viem/chains'
import { formatUnits, parseUnits } from 'viem'
import { CurrencyConversion, NetworkConfig } from '@/types'

/**
 * Formata endereço da carteira para exibição
 * @param address - Endereço completo da carteira
 * @param chars - Número de caracteres a mostrar no início e fim
 * @returns Endereço formatado (ex: 0x1234...5678)
 */
export const formatAddress = (address: string, chars: number = 4): string => {
  if (!address) return ''
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

/**
 * Formata saldo de token para exibição
 * @param balance - Saldo em wei ou unidade menor
 * @param decimals - Decimais do token
 * @param precision - Precisão para exibição
 * @returns Saldo formatado
 */
export const formatTokenBalance = (
  balance: string | bigint,
  decimals: number = 18,
  precision: number = 4
): string => {
  try {
    const formatted = formatUnits(BigInt(balance), decimals)
    const num = parseFloat(formatted)
    return num.toFixed(precision)
  } catch (error) {
    console.error('Error formatting token balance:', error)
    return '0.0000'
  }
}

/**
 * Converte token balance para número
 * @param balance - Saldo em wei
 * @param decimals - Decimais do token
 * @returns Número decimal
 */
export const balanceToNumber = (balance: string | bigint, decimals: number = 18): number => {
  try {
    const formatted = formatUnits(BigInt(balance), decimals)
    return parseFloat(formatted)
  } catch (error) {
    console.error('Error converting balance to number:', error)
    return 0
  }
}

/**
 * Verifica se está na rede Polygon
 * @param chainId - ID da rede atual
 * @returns true se estiver na Polygon
 */
export const isPolygonNetwork = (chainId: number): boolean => {
  return chainId === polygon.id
}

/**
 * Obtém nome da rede por chainId
 * @param chainId - ID da rede
 * @returns Nome da rede
 */
export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum'
    case 137:
      return 'Polygon'
    case 80001:
      return 'Mumbai (Testnet)'
    case 56:
      return 'BSC'
    case 43114:
      return 'Avalanche'
    default:
      return `Rede ${chainId}`
  }
}

/**
 * Configuração da rede Polygon
 */
export const polygonConfig: NetworkConfig = {
  id: polygon.id,
  name: polygon.name,
  network: 'polygon',
  nativeCurrency: polygon.nativeCurrency,
  rpcUrls: {
    default: {
      http: [...polygon.rpcUrls.default.http]
    },
    public: {
      http: ["https://polygon-rpc.com"]
    }
  },
  blockExplorers: polygon.blockExplorers,
  contracts: {
    usdt: {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT Polygon mainnet
      decimals: 6,
    },
  },
}

/**
 * Formata valor em USD
 * @param amount - Valor numérico
 * @returns Valor formatado em USD
 */
export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formata valor em BRL
 * @param amount - Valor numérico
 * @returns Valor formatado em BRL
 */
export const formatBRL = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Calcula valor em USD baseado no preço atual
 * @param tokenAmount - Quantidade do token
 * @param usdPrice - Preço atual em USD
 * @returns Valor total em USD
 */
export const calculateUSDValue = (tokenAmount: number, usdPrice: number): number => {
  return tokenAmount * usdPrice
}

/**
 * Obtém link do block explorer para transação
 * @param txHash - Hash da transação
 * @param chainId - ID da rede
 * @returns URL do block explorer
 */
export const getBlockExplorerTxUrl = (txHash: string, chainId: number): string => {
  switch (chainId) {
    case 137: // Polygon
      return `https://polygonscan.com/tx/${txHash}`
    case 1: // Ethereum
      return `https://etherscan.io/tx/${txHash}`
    case 56: // BSC
      return `https://bscscan.com/tx/${txHash}`
    default:
      return `https://polygonscan.com/tx/${txHash}`
  }
}

/**
 * Obtém link do block explorer para endereço
 * @param address - Endereço da carteira
 * @param chainId - ID da rede
 * @returns URL do block explorer
 */
export const getBlockExplorerAddressUrl = (address: string, chainId: number): string => {
  switch (chainId) {
    case 137: // Polygon
      return `https://polygonscan.com/address/${address}`
    case 1: // Ethereum
      return `https://etherscan.io/address/${address}`
    case 56: // BSC
      return `https://bscscan.com/address/${address}`
    default:
      return `https://polygonscan.com/address/${address}`
  }
}

/**
 * Valida se é um endereço Ethereum válido
 * @param address - Endereço para validar
 * @returns true se válido
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Trunca hash de transação para exibição
 * @param hash - Hash da transação
 * @param chars - Caracteres a mostrar
 * @returns Hash truncado
 */
export const truncateHash = (hash: string, chars: number = 6): string => {
  if (!hash) return ''
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`
}

/**
 * Converte tempo Unix para data legível
 * @param timestamp - Timestamp Unix
 * @returns Data formatada em português
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calcula tempo relativo (ex: "5 minutos atrás")
 * @param timestamp - Timestamp Unix em milissegundos
 * @returns Tempo relativo em português
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} dia${days > 1 ? 's' : ''} atrás`
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  } else if (minutes > 0) {
    return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`
  } else {
    return 'Agora mesmo'
  }
}

/**
 * Simula cotação de preços (em produção, usar API real)
 * @returns Preços simulados em USD
 */
export const getMockPrices = (): CurrencyConversion => {
  return {
    matic: { usd: 0.85 }, // Preço simulado do MATIC
    usdt: { usd: 1.0 },   // USDT sempre próximo de $1
  }
}