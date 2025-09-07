export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface UsuarioLogin {
  id: string
  email: string
  name: string
  role: string
  iat?: number
  exp?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface WalletBalance {
  balance: number
  currency: string
}

export interface PaymentMethod {
  id: string
  type: 'pix' | 'credit_card'
  name: string
}

export interface AddMoneyRequest {
  amount: number
  paymentMethod: PaymentMethod
}

export interface PaymentResponse {
  transactionId: string
  status: 'pending' | 'completed' | 'failed'
  paymentUrl?: string
  pixCode?: string
}

export interface Transaction {
  id: string
  amount: number
  type: 'deposit' | 'withdrawal'
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  paymentMethod: PaymentMethod
}

export interface Professor {
  id: string
  name: string
  telefone?: string
  account?: {
    email: string
  }
}

export interface UnauthorizedResponse {
  code: number
  success: boolean
  message?: string
}

// Web3 Wallet Types
export interface Web3WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
  isLoading: boolean
  error: string | null
  maticBalance: string
  usdtBalance: string
  ensName: string | null
  connector: string | null
}

export interface TokenBalance {
  balance: string
  formatted: string
  decimals: number
  symbol: string
  usdValue?: number
}

export interface Web3Session {
  address: string
  chainId: number
  maticBalance: string
  usdtBalance: string
  connectedAt: number
  lastUpdated: number
  connector: string
}

export interface NetworkConfig {
  id: number
  name: string
  network: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: {
    default: {
      http: string[]
    }
    public: {
      http: string[]
    }
  }
  blockExplorers: {
    default: {
      name: string
      url: string
    }
  }
  contracts?: {
    usdt?: {
      address: string
      decimals: number
    }
  }
}

export interface CurrencyConversion {
  matic: {
    usd: number
  }
  usdt: {
    usd: number
  }
}

export interface PendingTransaction {
  hash: string
  type: 'approve' | 'transfer' | 'deposit' | 'withdrawal'
  amount?: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
}

export interface Web3WalletActions {
  setConnected: (address: string, chainId: number, connector: string) => void
  setDisconnected: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setMaticBalance: (balance: string) => void
  setUSDTBalance: (balance: string) => void
  setEnsName: (ensName: string | null) => void
  updateSession: () => void
  addPendingTransaction: (tx: PendingTransaction) => void
  removePendingTransaction: (hash: string) => void
}