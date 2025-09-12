'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'

// Configuração do Wagmi com RainbowKit
export const wagmiConfig = getDefaultConfig({
  appName: 'PolDex - Premium Casino Platform ',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [polygon, polygonMumbai],
  ssr: true, // Habilita Server Side Rendering
})

// Cliente do React Query para Web3
export const web3QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

// Configuração de rede personalizada
export const networkConfig = {
  polygon: {
    id: 137,
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://polygon-rpc.com'],
      },
      public: {
        http: ['https://polygon-rpc.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://polygonscan.com',
      },
    },
    contracts: {
      usdt: {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as `0x${string}`,
        decimals: 6,
      },
    },
  },
  mumbai: {
    id: 80001,
    name: 'Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc-mumbai.maticvigil.com'],
      },
      public: {
        http: ['https://rpc-mumbai.maticvigil.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan Testnet',
        url: 'https://mumbai.polygonscan.com',
      },
    },
    contracts: {
      usdt: {
        address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB' as `0x${string}`, // USDT Mumbai
        decimals: 6,
      },
    },
  },
}

// ABI mínimo do ERC-20 para USDT
export const ERC20_ABI = [
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
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const

// Configuração do RainbowKit
export const rainbowKitConfig = {
  appName: 'PolDex - Premium Casino Platform',
  appDescription: 'Casino online com apostas em USDT na Polygon',
  appUrl: 'https://raspadinha-casino.com',
  appIcon: '/favicon.ico',
}