'use client'

import React, { useEffect } from 'react'
import { Gamepad2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore } from '@/stores/navigationStore'

// Lista de jogos disponíveis no cassino
const casinoGames = [
  { name: 'Plinko', route: '/m/plinko', icon: 'plinko-icon.svg' },
  // Adicione outros jogos aqui conforme necessário
]

export default function CassinoPage() {
  const router = useRouter()
  const { setPageLoading } = useNavigationStore()
  
  // Quando o componente é montado, definimos o loading como false
  useEffect(() => {
    // Simula um tempo de carregamento para os componentes
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 500) // 500ms de delay para simular carregamento
    
    return () => clearTimeout(timer)
  }, [setPageLoading])

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      <main className="flex-1 overflow-auto pb-16">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Cassino</h1>
          
          {/* Lista de Jogos Disponíveis */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {casinoGames.map((game, index) => (
              <RippleButton
                key={index}
                onClick={() => router.push(game.route)}
                className="bg-[#1a1a2e] rounded-lg p-4 flex flex-col items-center justify-center h-32 border border-gray-800 hover:border-purple-500 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-2">
                  <Gamepad2 className="w-6 h-6 text-purple-400" />
                </div>
                <span className="font-medium">{game.name}</span>
              </RippleButton>
            ))}
          </div>
          
          {/* Seção de Jogos Populares */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Jogos Populares</h2>
            <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400">Experimente nosso jogo mais popular:</p>
              <RippleButton
                onClick={() => router.push('/m/plinko')}
                className="w-full mt-3 bg-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Jogar Plinko
              </RippleButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}