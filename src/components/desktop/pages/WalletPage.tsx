'use client'

import React, { useState } from 'react'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Banknote,
  QrCode,
  Copy,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/formatCurrency'

interface WalletPageProps {
  onTransactionSelect?: (transactionId: string) => void
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'bet' | 'win'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  date: Date
  description: string
  method?: string
}

interface WalletBalance {
  currency: string
  balance: number
  usdValue: number
  change24h: number
}

const mockBalances: WalletBalance[] = [
  {
    currency: 'BTC',
    balance: 0.00234567,
    usdValue: 89.45,
    change24h: 2.34
  },
  {
    currency: 'ETH',
    balance: 0.0456789,
    usdValue: 156.78,
    change24h: -1.23
  },
  {
    currency: 'USDT',
    balance: 500.00,
    usdValue: 500.00,
    change24h: 0.01
  },
  {
    currency: 'BNB',
    balance: 1.234567,
    usdValue: 345.67,
    change24h: 4.56
  }
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 100,
    currency: 'USDT',
    status: 'completed',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: 'Depósito via PIX',
    method: 'PIX'
  },
  {
    id: '2',
    type: 'bet',
    amount: -25,
    currency: 'USDT',
    status: 'completed',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    description: 'Aposta - Mines',
    method: 'Game'
  },
  {
    id: '3',
    type: 'win',
    amount: 75,
    currency: 'USDT',
    status: 'completed',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    description: 'Ganho - Mines',
    method: 'Game'
  },
  {
    id: '4',
    type: 'withdrawal',
    amount: -50,
    currency: 'USDT',
    status: 'pending',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    description: 'Saque via PIX',
    method: 'PIX'
  }
]

export default function WalletPage({ onTransactionSelect }: WalletPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview')
  const [selectedCurrency, setSelectedCurrency] = useState('USDT')
  const [showBalances, setShowBalances] = useState(true)

  const totalUSDValue = mockBalances.reduce((sum, balance) => sum + balance.usdValue, 0)




  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USDT' || currency === 'USD') {
      return `$${amount.toFixed(2)}`
    }
    return `${amount.toFixed(8)} ${currency}`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return ArrowDownLeft
      case 'withdrawal': return ArrowUpRight
      case 'bet': return TrendingDown
      case 'win': return TrendingUp
      default: return History
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return colors.accent
      case 'withdrawal': return colors.secondary
      case 'bet': return '#ef4444'
      case 'win': return '#10b981'
      default: return colors.mediumGray
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.secondary }}>
          Carteira
        </h1>
        <p className="text-lg" style={{ color: colors.mediumGray }}>
          Gerencie seus fundos e transações
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.mediumGray + '20' }}>
          {[
            { id: 'overview', name: 'Visão Geral', icon: Wallet },
            { id: 'deposit', name: 'Depositar', icon: ArrowDownLeft },
            { id: 'withdraw', name: 'Sacar', icon: ArrowUpRight },
            { id: 'history', name: 'Histórico', icon: History }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <RippleButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all",
                  activeTab === tab.id && "shadow-sm"
                )}
                style={{
                  backgroundColor: activeTab === tab.id ? colors.secondary : 'transparent',
                  color: activeTab === tab.id ? colors.primary : colors.mediumGray
                }}
              >
                <Icon size={20} />
                <span className="font-medium hidden sm:inline">{tab.name}</span>
              </RippleButton>
            )
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Total Balance Card */}
          <div 
            className="p-8 rounded-xl border relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent}20)`,
              borderColor: colors.mediumGray + '20'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                Saldo Total
              </h2>
              <RippleButton
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 rounded-lg hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.mediumGray + '20',
                  color: colors.mediumGray
                }}
              >
                {showBalances ? <Eye size={20} /> : <EyeOff size={20} />}
              </RippleButton>
            </div>
            
            <div className="text-4xl font-bold mb-2" style={{ color: colors.secondary }}>
              {showBalances ? `$${totalUSDValue.toFixed(2)}` : '••••••'}
            </div>
            <p className="text-lg" style={{ color: colors.mediumGray }}>
              Valor total em USD
            </p>

            {/* Quick Actions */}
            <div className="flex space-x-4 mt-8">
              <RippleButton
                onClick={() => setActiveTab('deposit')}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                <ArrowDownLeft size={20} />
                <span>Depositar</span>
              </RippleButton>
              
              <RippleButton
                onClick={() => setActiveTab('withdraw')}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-bold border hover:scale-105 transition-transform"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.secondary + '40',
                  color: colors.secondary
                }}
              >
                <ArrowUpRight size={20} />
                <span>Sacar</span>
              </RippleButton>
            </div>
          </div>

          {/* Balances Grid */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>
              Seus Ativos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockBalances.map(balance => (
                <div 
                  key={balance.currency}
                  className="p-6 rounded-xl border hover:scale-105 transition-transform cursor-pointer"
                  style={{
                    backgroundColor: colors.mediumGray + '10',
                    borderColor: colors.mediumGray + '20'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        backgroundColor: colors.secondary + '20',
                        color: colors.secondary
                      }}
                    >
                      {balance.currency.charAt(0)}
                    </div>
                    <div className={cn(
                      "flex items-center space-x-1 text-sm font-medium",
                      balance.change24h >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {balance.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span>{Math.abs(balance.change24h).toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-1" style={{ color: colors.secondary }}>
                    {balance.currency}
                  </h4>
                  
                  <div className="space-y-1">
                    <p className="font-bold" style={{ color: colors.secondary }}>
                      {showBalances ? formatCurrency(balance.balance, balance.currency) : '••••••'}
                    </p>
                    <p className="text-sm" style={{ color: colors.mediumGray }}>
                      {showBalances ? `$${balance.usdValue.toFixed(2)}` : '••••••'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.secondary }}>
                Transações Recentes
              </h3>
              <RippleButton
                onClick={() => setActiveTab('history')}
                className="text-sm hover:scale-105 transition-transform"
                style={{ color: colors.secondary }}
              >
                Ver todas
              </RippleButton>
            </div>
            
            <div className="space-y-3">
              {mockTransactions.slice(0, 5).map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  onSelect={onTransactionSelect}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deposit' && (
        <DepositSection selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
      )}

      {activeTab === 'withdraw' && (
        <WithdrawSection selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
      )}

      {activeTab === 'history' && (
        <HistorySection transactions={mockTransactions} onTransactionSelect={onTransactionSelect} />
      )}
    </div>
  )
}

// Transaction Item Component
function TransactionItem({ transaction, onSelect }: { transaction: Transaction, onSelect?: (id: string) => void }) {
  const Icon = getTransactionIcon(transaction.type)
  const color = getTransactionIcon(transaction.type)
  
  function formatTime(date: Date): React.ReactNode {
    throw new Error('Function not implemented.')
  }

  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg border hover:scale-[1.02] transition-transform cursor-pointer"
      style={{
        backgroundColor: colors.mediumGray + '10',
        borderColor: colors.mediumGray + '20'
      }}
      onClick={() => onSelect?.(transaction.id)}
    >
      <div className="flex items-center space-x-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
        </div>
        
        <div>
          <h4 className="font-medium" style={{ color: colors.secondary }}>
            {transaction.description}
          </h4>
          <p className="text-sm" style={{ color: colors.mediumGray }}>
            {formatTime(transaction.date)}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p 
          className="font-bold"
          style={{ 
            color: transaction.amount > 0 ? '#10b981' : transaction.amount < 0 ? '#ef4444' : colors.secondary 
          }}
        >
          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
        </p>
        <span 
          className="text-xs px-2 py-1 rounded-full"
          style={{
            backgroundColor: transaction.status === 'completed' ? '#10b981' + '20' : 
                           transaction.status === 'pending' ? '#f59e0b' + '20' : '#ef4444' + '20',
            color: transaction.status === 'completed' ? '#10b981' : 
                   transaction.status === 'pending' ? '#f59e0b' : '#ef4444'
          }}
        >
          {transaction.status === 'completed' ? 'Concluído' : 
           transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
        </span>
      </div>
    </div>
  )
}

// Deposit Section Component
function DepositSection({ selectedCurrency, onCurrencyChange }: { selectedCurrency: string, onCurrencyChange: (currency: string) => void }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('pix')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div 
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: colors.mediumGray + '10',
          borderColor: colors.mediumGray + '20'
        }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: colors.secondary }}>
          Fazer Depósito
        </h3>
        
        {/* Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
            Moeda
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['USDT', 'BTC', 'ETH', 'BNB'].map(currency => (
              <RippleButton
                key={currency}
                onClick={() => onCurrencyChange(currency)}
                className={cn(
                  "py-3 rounded-lg border font-medium hover:scale-105 transition-transform",
                  selectedCurrency === currency && "ring-2"
                )}
                style={{
                  backgroundColor: selectedCurrency === currency 
                    ? colors.secondary + '20' 
                    : colors.mediumGray + '20',
                  borderColor: selectedCurrency === currency 
                    ? colors.secondary + '40' 
                    : colors.mediumGray + '40',
                  color: selectedCurrency === currency 
                    ? colors.secondary 
                    : colors.mediumGray
                }}
              >
                {currency}
              </RippleButton>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
            Valor
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 rounded-lg border text-lg font-bold text-center focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.mediumGray + '40',
              color: colors.secondary
            }}
            placeholder="0.00"
          />
        </div>

        {/* Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
            Método de Pagamento
          </label>
          <div className="space-y-2">
            {[
              { id: 'pix', name: 'PIX', icon: QrCode },
              { id: 'card', name: 'Cartão de Crédito', icon: CreditCard },
              { id: 'bank', name: 'Transferência Bancária', icon: Banknote }
            ].map(paymentMethod => {
              const Icon = paymentMethod.icon
              return (
                <RippleButton
                  key={paymentMethod.id}
                  onClick={() => setMethod(paymentMethod.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-4 rounded-lg border hover:scale-[1.02] transition-transform",
                    method === paymentMethod.id && "ring-2"
                  )}
                  style={{
                    backgroundColor: method === paymentMethod.id 
                      ? colors.secondary + '20' 
                      : colors.mediumGray + '10',
                    borderColor: method === paymentMethod.id 
                      ? colors.secondary + '40' 
                      : colors.mediumGray + '20'
                  }}
                >
                  <Icon size={24} style={{ color: colors.secondary }} />
                  <span className="font-medium" style={{ color: colors.secondary }}>
                    {paymentMethod.name}
                  </span>
                </RippleButton>
              )
            })}
          </div>
        </div>

        {/* Deposit Button */}
        <RippleButton
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: colors.accent,
            color: colors.primary
          }}
        >
          Depositar {amount && `$${amount}`}
        </RippleButton>
      </div>
    </div>
  )
}

// Withdraw Section Component
function WithdrawSection({ selectedCurrency, onCurrencyChange }: { selectedCurrency: string, onCurrencyChange: (currency: string) => void }) {
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div 
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: colors.mediumGray + '10',
          borderColor: colors.mediumGray + '20'
        }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: colors.secondary }}>
          Fazer Saque
        </h3>
        
        {/* Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
            Moeda
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['USDT', 'BTC', 'ETH', 'BNB'].map(currency => (
              <RippleButton
                key={currency}
                onClick={() => onCurrencyChange(currency)}
                className={cn(
                  "py-3 rounded-lg border font-medium hover:scale-105 transition-transform",
                  selectedCurrency === currency && "ring-2"
                )}
                style={{
                  backgroundColor: selectedCurrency === currency 
                    ? colors.secondary + '20' 
                    : colors.mediumGray + '20',
                  borderColor: selectedCurrency === currency 
                    ? colors.secondary + '40' 
                    : colors.mediumGray + '40',
                  color: selectedCurrency === currency 
                    ? colors.secondary 
                    : colors.mediumGray
                }}
              >
                {currency}
              </RippleButton>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
            Valor
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 rounded-lg border text-lg font-bold text-center focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.mediumGray + '40',
              color: colors.secondary
            }}
            placeholder="0.00"
          />
        </div>

        {/* Address Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
            Endereço de Destino
          </label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.mediumGray + '40',
                color: colors.secondary
              }}
              placeholder="Endereço da carteira..."
            />
            <RippleButton
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-transform"
              style={{
                backgroundColor: colors.mediumGray + '20',
                color: colors.mediumGray
              }}
            >
              <QrCode size={20} />
            </RippleButton>
          </div>
        </div>

        {/* Withdraw Button */}
        <RippleButton
          disabled={!amount || !address || parseFloat(amount) <= 0}
          className="w-full py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: colors.secondary,
            color: colors.primary
          }}
        >
          Sacar {amount && `$${amount}`}
        </RippleButton>
      </div>
    </div>
  )
}

// History Section Component
function HistorySection({ transactions, onTransactionSelect }: { transactions: Transaction[], onTransactionSelect?: (id: string) => void }) {
  const [filter, setFilter] = useState('all')

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  )

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', name: 'Todas' },
          { id: 'deposit', name: 'Depósitos' },
          { id: 'withdrawal', name: 'Saques' },
          { id: 'bet', name: 'Apostas' },
          { id: 'win', name: 'Ganhos' }
        ].map(filterOption => (
          <RippleButton
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={cn(
              "px-4 py-2 rounded-lg border hover:scale-105 transition-transform",
              filter === filterOption.id && "ring-2"
            )}
            style={{
              backgroundColor: filter === filterOption.id 
                ? colors.secondary + '20' 
                : colors.mediumGray + '20',
              borderColor: filter === filterOption.id 
                ? colors.secondary + '40' 
                : colors.mediumGray + '40',
              color: filter === filterOption.id 
                ? colors.secondary 
                : colors.mediumGray,
            }}
          >
            {filterOption.name}
          </RippleButton>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div 
            className="text-center py-12 rounded-lg border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <p className="text-lg" style={{ color: colors.mediumGray }}>
              Nenhuma transação encontrada
            </p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              onSelect={onTransactionSelect}
            />
          ))
        )}
      </div>
    </div>
  )
}

function getTransactionIcon(type: string) {
  throw new Error('Function not implemented.')
}
