import { useState } from 'react'
import { useWalletStore } from '@/stores/wallet'
import { useWalletBalance, useAddMoney, useTransactions } from '@/queries/wallet'
import { AddMoneyRequest } from '@/types'

export const useWallet = () => {
  const { balance, isLoading, setLoading } = useWalletStore()
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  
  const balanceQuery = useWalletBalance()
  const addMoneyMutation = useAddMoney()
  const transactionsQuery = useTransactions()

  const addMoney = async (request: AddMoneyRequest) => {
    try {
      setLoading(true)
      const result = await addMoneyMutation.mutateAsync(request)
      return result
    } catch (error) {
      console.error('Erro ao adicionar dinheiro:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  const predefinedAmounts = [10, 25, 50, 100, 200, 500]

  return {
    balance: balanceQuery.data?.balance || balance,
    isLoading: isLoading || balanceQuery.isLoading || addMoneyMutation.isPending,
    transactions: transactionsQuery.data || [],
    selectedAmount,
    setSelectedAmount,
    predefinedAmounts,
    addMoney,
    formatCurrency,
    error: addMoneyMutation.error || balanceQuery.error || transactionsQuery.error,
    refetchBalance: balanceQuery.refetch,
    refetchTransactions: transactionsQuery.refetch,
  }
}