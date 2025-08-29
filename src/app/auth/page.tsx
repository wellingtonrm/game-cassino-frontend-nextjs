'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { LoginCredentials } from '@/types'
import { Eye, EyeOff, Wallet, Mail, Lock } from 'lucide-react'

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data)
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1b3a] via-[#2a2b4a] to-[#1a1b3a] p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35] rounded-full mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Wallet</h1>
          <p className="text-gray-400">Acesse sua carteira digital</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-[#2a2b4a] rounded-2xl shadow-2xl p-8 border border-[#3a3b5a] animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1b3a] border border-[#3a3b5a] rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 bg-[#1a1b3a] border border-[#3a3b5a] rounded-lg focus:ring-2 focus:ring-[#4fc3f7] focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Erro de Login */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  {error instanceof Error ? error.message : 'Erro ao fazer login'}
                </p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ff6b35] hover:bg-[#ff8c42] disabled:bg-[#ff6b35]/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-[#ff6b35] focus:ring-offset-2 focus:ring-offset-[#2a2b4a]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Links adicionais */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Esqueceu sua senha?{' '}
              <a href="#" className="text-[#4fc3f7] hover:text-[#3fb3e7] transition-colors">
                Recuperar senha
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Game Wallet. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}