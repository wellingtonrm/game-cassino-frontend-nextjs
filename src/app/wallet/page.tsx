'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@/hooks/useWallet'
import { Wallet, Plus, History, LogOut, User, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function WalletPage() {
  const { user, logout, requireAuth } = useAuth()
  const { balance, formatCurrency, isLoading, transactions, refetchBalance } = useWallet()

  useEffect(() => {
    requireAuth()
  }, [])

  useEffect(() => {
    refetchBalance()
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b3a] via-[#2a2b4a] to-[#1a1b3a]">
      {/* Header */}
      <header className="bg-[#2a2b4a]/50 backdrop-blur-sm border-b border-[#3a3b5a]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#ff6b35] rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Game Wallet</h1>
                <p className="text-gray-400 text-sm">Olá, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#3a3b5a]">
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-[#3a3b5a]"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Saldo Principal */}
        <div className="bg-gradient-to-r from-[#ff6b35] to-[#4fc3f7] rounded-2xl p-8 mb-8 text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Saldo Disponível</p>
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/30 rounded w-32"></div>
                  </div>
                ) : (
                  <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
                )}
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/game">
            <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ffad42] rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Jogar Agora</h3>
                  <p className="text-white/80 text-sm">Entre no jogo da raspadinha</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/wallet/add-money">
            <div className="bg-[#2a2b4a] hover:bg-[#3a3b5a] border border-[#3a3b5a] rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#4fc3f7] rounded-full flex items-center justify-center group-hover:bg-[#3fb3e7] transition-colors">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Adicionar Dinheiro</h3>
                  <p className="text-gray-400 text-sm">Deposite via PIX ou cartão</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Transações Recentes */}
        <div className="bg-[#2a2b4a] border border-[#3a3b5a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">Transações Recentes</h3>
            <Link href="/wallet/history" className="text-[#4fc3f7] hover:text-[#3fb3e7] text-sm font-medium">
              Ver todas
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#3a3b5a] rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#3a3b5a] rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-[#3a3b5a] rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-[#3a3b5a] rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-[#1a1b3a] rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-[#4fc3f7]' : 'bg-[#ff6b35]'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <Plus className="w-5 h-5 text-white" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {transaction.type === 'deposit' ? 'Depósito' : 'Saque'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-400' :
                      transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {transaction.status === 'completed' ? 'Concluído' :
                       transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma transação encontrada</p>
              <p className="text-gray-500 text-sm">Suas transações aparecerão aqui</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}