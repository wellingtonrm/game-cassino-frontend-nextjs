'use client'

import React, { useState, Suspense } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { colors } from '@/lib/design-system'

// Layout Components
import Sidebar from '@/components/desktop/layout/Sidebar'
import TopBar from '@/components/desktop/layout/TopBar'

// Page Components
import HomePage from '@/components/desktop/pages/HomePage'
import MinesGame from '@/components/desktop/games/MinesGame'

// Importando os componentes de página mobile adaptados
import CassinoPage from '@/components/mobile/itensPage/cassino'
import EsportsPage from '@/components/mobile/itensPage/esports'
import WalletPage from '@/components/mobile/itensPage/wallet'
import ProfilePage from '@/components/mobile/itensPage/profile'

export default function DesktopCasinoPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const { state: { isLoading } } = useAuth()

  // Função para navegar para um jogo específico
  const navigateToGame = (game: string) => {
    setCurrentGame(game)
    setActiveTab('casino')
  }

  // Função para voltar da tela do jogo
  const handleBackFromGame = () => {
    setCurrentGame(null)
  }

  // Função para renderizar o componente correto com base na aba ativa
  const renderActiveComponent = () => {
    // Se estamos em um jogo específico, renderizar o jogo
    if (currentGame) {
      switch (currentGame) {
        case 'mines':
          return <MinesGame onBack={handleBackFromGame} />
        default:
          return <HomePage onNavigateToGame={navigateToGame} />
      }
    }

    // Caso contrário, renderizar baseado na aba ativa
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigateToGame={navigateToGame} />
      case 'casino':
        return <CassinoPage />
      case 'sports':
        return <EsportsPage />
      case 'wallet':
        return <WalletPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage onNavigateToGame={navigateToGame} />
    }
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
             style={{ borderColor: colors.secondary, borderTopColor: 'transparent' }}>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: colors.primary }}
    >
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        className="fixed left-0 top-0 z-10"
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <TopBar className="fixed top-0 right-0 z-10" />

        {/* Page Content */}
        <main className="flex-1 pt-16 overflow-auto">
          <Suspense 
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                     style={{ borderColor: colors.secondary, borderTopColor: 'transparent' }}>
                </div>
              </div>
            }
          >
            {renderActiveComponent()}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
