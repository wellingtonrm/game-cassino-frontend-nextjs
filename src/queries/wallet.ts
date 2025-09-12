import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWalletStore } from '@/stores/wallet'
import { Transaction, AddMoneyRequest, PaymentResponse } from '@/types'

// Simulated API functions (in a real app, these would call actual API endpoints)
const fetchWalletBalance = async (): Promise<{ balance: number }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real app, this would fetch from an API
  // For now, we'll return a mock balance
  return { balance: 100.00 }
}

const addMoneyToWallet = async (request: AddMoneyRequest): Promise<PaymentResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would call an API to add money
  // For now, we'll simulate a successful response
  return {
    transactionId: `txn_${Date.now()}`,
    status: 'pending',
    paymentUrl: 'https://example.com/payment',
  }
}

const fetchTransactions = async (): Promise<Transaction[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real app, this would fetch from an API
  // For now, we'll return mock transactions
  return [
    {
      id: '1',
      amount: 100,
      type: 'deposit',
      status: 'completed',
      createdAt: new Date().toISOString(),
      paymentMethod: {
        id: '1',
        type: 'pix',
        name: 'PIX'
      }
    }
  ]
}

/**
 * Hook para buscar saldo da carteira
 */
export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['walletBalance'],
    queryFn: fetchWalletBalance,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook para adicionar dinheiro à carteira
 */
export const useAddMoney = () => {
  const queryClient = useQueryClient()
  const { addToBalance } = useWalletStore()
  
  return useMutation({
    mutationFn: addMoneyToWallet,
    onSuccess: (data, variables) => {
      // Update local balance state
      addToBalance(variables.amount)
      
      // Invalidate and refetch wallet balance
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] })
    },
  })
}

/**
 * Hook para buscar transações
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}