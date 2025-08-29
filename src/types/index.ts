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