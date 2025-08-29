import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { WalletBalance, AddMoneyRequest, PaymentResponse, Transaction } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useWalletStore } from '@/stores/wallet'
import { api } from '@/services/api'

// Wallet API functions
const walletApi = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await api.get('/wallet/balance')
    return response.data
  },
  
  addMoney: async (data: AddMoneyRequest): Promise<PaymentResponse> => {
    const response = await api.post('/wallet/add-money', data)
    return response.data
  },
  
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/wallet/transactions')
    return response.data
  },
}

// React Query hooks
export const useWalletBalance = () => {
  const { isAuthenticated } = useAuthStore()
  const { setBalance } = useWalletStore()
  
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: walletApi.getBalance,
    enabled: isAuthenticated,
    
  })
}

export const useAddMoney = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: walletApi.addMoney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
    },
  })
}

export const useTransactions = () => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: walletApi.getTransactions,
    enabled: isAuthenticated,
  })
}