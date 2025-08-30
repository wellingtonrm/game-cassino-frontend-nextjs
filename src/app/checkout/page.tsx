'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { useForm } from 'react-hook-form'
import { ArrowLeft, CreditCard, Smartphone, Shield, Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface CreditCardForm {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { formatCurrency, addMoney, isLoading } = useWallet()
  
  const amount = parseFloat(searchParams?.get('amount') || '0')
  const method = searchParams?.get('method') as 'pix' | 'credit_card'
  
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment')
  const [pixCode, setPixCode] = useState<string>('')
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreditCardForm>()

  useEffect(() => {
    if (!amount || !method) {
      router.push('/wallet/add-money')
    }
  }, [amount, method, router])

  const handlePayment = async (data?: CreditCardForm) => {
    try {
      setStep('processing')
      
      const paymentData = {
        amount,
        paymentMethod: {
          id: method,
          type: method,
          name: method === 'pix' ? 'PIX' : 'Cartão de Crédito',
        },
        ...(method === 'credit_card' && data ? { cardData: data } : {}),
      }
      
      const result = await addMoney(paymentData)
      
      if (method === 'pix' && result.pixCode) {
        setPixCode(result.pixCode)
      }
      
      if (result.paymentUrl) {
        setPaymentUrl(result.paymentUrl)
      }
      
      // Simular processamento
      setTimeout(() => {
        setStep('success')
      }, 2000)
      
    } catch (error) {
      console.error('Erro no pagamento:', error)
      setStep('payment')
    }
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b3a] via-[#2a2b4a] to-[#1a1b3a] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-[#4fc3f7] rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Processando Pagamento</h2>
          <p className="text-gray-400">Aguarde enquanto processamos sua transação...</p>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b3a] via-[#2a2b4a] to-[#1a1b3a] flex items-center justify-center">
        <div className="text-center animate-fade-in max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Pagamento Realizado!</h2>
          <p className="text-gray-400 mb-6">
            Seu pagamento de {formatCurrency(amount)} foi processado com sucesso.
          </p>
          <Link href="/wallet">
            <button className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ffad42] text-white font-semibold py-3 px-6 rounded-lg transition-all">
              Voltar para Carteira
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b3a] via-[#2a2b4a] to-[#1a1b3a]">
      {/* Header */}
      <header className="bg-[#2a2b4a]/50 backdrop-blur-sm border-b border-[#3a3b5a]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/wallet/add-money">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#3a3b5a]">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                method === 'pix' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {method === 'pix' ? (
                  <Smartphone className="w-6 h-6 text-white" />
                ) : (
                  <CreditCard className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Checkout</h1>
                <p className="text-gray-400 text-sm">
                  {method === 'pix' ? 'Pagamento via PIX' : 'Pagamento via Cartão'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Resumo do Pedido */}
          <div className="bg-[#2a2b4a] border border-[#3a3b5a] rounded-xl p-6 animate-fade-in">
            <h2 className="text-white font-semibold text-lg mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Valor:</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Taxa:</span>
                <span>
                  {method === 'pix' ? 'Grátis' : formatCurrency(amount * 0.029)}
                </span>
              </div>
              <div className="border-t border-[#3a3b5a] pt-3">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      method === 'pix' ? amount : amount + (amount * 0.029)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Pagamento */}
          {method === 'pix' ? (
            <div className="bg-[#2a2b4a] border border-[#3a3b5a] rounded-xl p-6 animate-fade-in">
              <h2 className="text-white font-semibold text-lg mb-4">Pagamento PIX</h2>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4fc3f7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300 mb-6">
                  Clique no botão abaixo para gerar o código PIX e finalizar o pagamento.
                </p>
                <button
                  onClick={() => handlePayment()}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ffad42] disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gerando PIX...
                    </div>
                  ) : (
                    'Gerar Código PIX'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handlePayment)} className="bg-[#2a2b4a] border border-[#3a3b5a] rounded-xl p-6 animate-fade-in">
              <h2 className="text-white font-semibold text-lg mb-6">Dados do Cartão</h2>
              
              <div className="space-y-4">
                {/* Número do Cartão */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Número do Cartão
                  </label>
                  <input
                    {...register('cardNumber', {
                      required: 'Número do cartão é obrigatório',
                      pattern: {
                        value: /^[0-9\s]{13,19}$/,
                        message: 'Número do cartão inválido',
                      },
                    })}
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    onChange={(e) => {
                      e.target.value = formatCardNumber(e.target.value)
                    }}
                    className="w-full px-4 py-3 bg-[#1a1b3a] border border-[#3a3b5a] rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent text-white placeholder-gray-400"
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-400">{errors.cardNumber.message}</p>
                  )}
                </div>

                {/* Nome no Cartão */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    {...register('cardName', {
                      required: 'Nome no cartão é obrigatório',
                    })}
                    type="text"
                    placeholder="NOME COMO NO CARTÃO"
                    className="w-full px-4 py-3 bg-[#1a1b3a] border border-[#3a3b5a] rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent text-white placeholder-gray-400 uppercase"
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-sm text-red-400">{errors.cardName.message}</p>
                  )}
                </div>

                {/* Validade e CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Validade
                    </label>
                    <input
                      {...register('expiryDate', {
                        required: 'Validade é obrigatória',
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: 'Formato inválido (MM/AA)',
                        },
                      })}
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      onChange={(e) => {
                        e.target.value = formatExpiryDate(e.target.value)
                      }}
                      className="w-full px-4 py-3 bg-[#1a1b3a] border border-[#3a3b5a] rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent text-white placeholder-gray-400"
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-400">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      CVV
                    </label>
                    <input
                      {...register('cvv', {
                        required: 'CVV é obrigatório',
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: 'CVV inválido',
                        },
                      })}
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-[#1a1b3a] border border-[#3a3b5a] rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent text-white placeholder-gray-400"
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-400">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ffad42] disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : (
                  `Pagar ${formatCurrency(amount + (amount * 0.029))}`
                )}
              </button>
            </form>
          )}

          {/* Segurança */}
          <div className="bg-[#2a2b4a] border border-[#3a3b5a] rounded-xl p-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-semibold">Pagamento Seguro</h3>
            </div>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Seus dados são protegidos com criptografia SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Processamento seguro via Efi Pay</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fc3f7]"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}