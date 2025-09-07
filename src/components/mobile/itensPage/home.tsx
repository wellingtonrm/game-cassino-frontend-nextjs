'use client'

import React, { useEffect } from 'react'
import { Gamepad2, TrendingUp, Activity, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore } from '@/stores/navigationStore'

// Lista de jogos disponíveis no cassino
const casinoGames = [
  { name: 'Plinko', route: '/m/plinko', icon: 'plinko-icon.svg' },
  // Adicione outros jogos aqui conforme necessário
]

// Lista de destaques
const highlights = [
  { title: 'Cassino', description: 'Jogos de cassino populares', icon: Gamepad2, route: '/m/casino' },
  { title: 'Esportes', description: 'Apostas esportivas ao vivo', icon: Activity, route: '/m/sports' },
  { title: 'Trading', description: 'Operações de trading', icon: TrendingUp, route: '/m/trading' },
  { title: 'Promoções', description: 'Ofertas especiais', icon: Zap, route: '/m/promotions' },
]

export default function HomePage() {
  const router = useRouter()
  const { setPageLoading } = useNavigationStore()
  
  // Quando o componente é montado, definimos o loading como false
  useEffect(() => {
    // Simula um tempo de carregamento para os componentes
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 500) // 500ms de delay para simular carregamento
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      <main className="flex-1 overflow-auto pb-16">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Bem-vindo</h1>
          
          {/* Banner Principal */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-5 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2">Bônus de Boas-vindas</h2>
            <p className="text-sm text-purple-200 mb-3">Ganhe até R$500 no seu primeiro depósito!</p>
            <RippleButton 
              className="bg-white text-purple-800 font-semibold py-2 px-4 rounded-lg text-sm"
              onClick={() => router.push('/m/wallet')}
            >
              Depositar Agora
            </RippleButton>
          </div>
          
          {/* Destaques */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Destaques</h2>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <RippleButton
                  key={index}
                  onClick={() => router.push(item.route)}
                  className="bg-[#1a1a2e] rounded-lg p-4 flex flex-col items-center justify-center h-32 border border-gray-800 hover:border-purple-500 transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-2">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </RippleButton>
              ))}
            </div>
          </div>
          
          {/* Jogos Populares */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Jogos Populares</h2>
            <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 mb-3">Experimente nossos jogos mais populares:</p>
              <div className="space-y-3">
                <RippleButton
                  onClick={() => router.push('/m/plinko')}
                  className="w-full bg-[#232342] text-white py-3 px-4 rounded-lg font-medium flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Plinko</div>
                    <div className="text-xs text-gray-400">Jogue agora e ganhe até 1000x</div>
                  </div>
                </RippleButton>
                
                <RippleButton
                  onClick={() => router.push('/m/casino')}
                  className="w-full bg-[#232342] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Ver todos os jogos</div>
                      <div className="text-xs text-gray-400">Explore nossa coleção completa</div>
                    </div>
                  </div>
                </RippleButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}