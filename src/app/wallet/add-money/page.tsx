'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { ArrowLeft, Wallet, CreditCard, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function AddMoneyPage() {
  const router = useRouter()
  const { predefinedAmounts, formatCurrency, addMoney, isLoading } = useWallet()
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'credit_card' | null>(null)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseFloat(value.replace(',', '.'))
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue)
    } else {
      setSelectedAmount(0)
    }
  }

  const handleContinue = () => {
    if (selectedAmount > 0 && selectedPaymentMethod) {
      router.push(`/checkout?amount=${selectedAmount}&method=${selectedPaymentMethod}`)
    }
  }

  const isValidAmount = selectedAmount >= 10 && selectedAmount <= 5000

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/wallet">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Adicionar Dinheiro</h1>
                <p className="text-gray-400 text-sm">Recarregue sua carteira</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Seleção de Valor */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-fade-in">
            <h2 className="text-white font-semibold text-lg mb-6">Escolha o valor</h2>
            
            {/* Valores Predefinidos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAmount === amount && !customAmount
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold">{formatCurrency(amount)}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Valor Customizado */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Ou digite um valor personalizado
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Valor mínimo: R$ 10,00 | Valor máximo: R$ 5.000,00
              </p>
            </div>

            {/* Valor Selecionado */}
            {selectedAmount > 0 && (
              <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium">Valor selecionado:</span>
                  <span className="text-green-400 font-bold text-lg">{formatCurrency(selectedAmount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Método de Pagamento */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-fade-in">
            <h2 className="text-white font-semibold text-lg mb-6">Método de pagamento</h2>
            
            <div className="space-y-3">
              {/* PIX */}
              <button
                onClick={() => setSelectedPaymentMethod('pix')}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedPaymentMethod === 'pix'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === 'pix' ? 'bg-blue-500' : 'bg-gray-700'
                  }`}>
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      selectedPaymentMethod === 'pix' ? 'text-blue-400' : 'text-white'
                    }`}>
                      PIX
                    </h3>
                    <p className="text-gray-400 text-sm">Pagamento instantâneo</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      selectedPaymentMethod === 'pix' ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      Sem taxas
                    </p>
                  </div>
                </div>
              </button>

              {/* Cartão de Crédito */}
              <button
                onClick={() => setSelectedPaymentMethod('credit_card')}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedPaymentMethod === 'credit_card'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === 'credit_card' ? 'bg-purple-500' : 'bg-gray-700'
                  }`}>
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      selectedPaymentMethod === 'credit_card' ? 'text-purple-400' : 'text-white'
                    }`}>
                      Cartão de Crédito
                    </h3>
                    <p className="text-gray-400 text-sm">Visa, Mastercard, Elo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 text-sm font-medium">
                      Taxa: 2,9%
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Resumo e Botão de Continuar */}
          {selectedAmount > 0 && selectedPaymentMethod && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-fade-in">
              <h3 className="text-white font-semibold mb-4">Resumo</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Valor:</span>
                  <span>{formatCurrency(selectedAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Taxa:</span>
                  <span>
                    {selectedPaymentMethod === 'pix' 
                      ? 'Grátis' 
                      : formatCurrency(selectedAmount * 0.029)
                    }
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total:</span>
                    <span>
                      {formatCurrency(
                        selectedPaymentMethod === 'pix' 
                          ? selectedAmount 
                          : selectedAmount + (selectedAmount * 0.029)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!isValidAmount || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : (
                  'Continuar para o Pagamento'
                )}
              </button>

              {!isValidAmount && selectedAmount > 0 && (
                <p className="text-red-400 text-sm mt-2 text-center">
                  {selectedAmount < 10 
                    ? 'Valor mínimo é R$ 10,00' 
                    : 'Valor máximo é R$ 5.000,00'
                  }
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}