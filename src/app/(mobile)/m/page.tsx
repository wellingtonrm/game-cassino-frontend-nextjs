'use client'

import React, { Suspense } from 'react'
import { useNavigationStore, type NavigationTab } from '@/stores/navigationStore'
import AppBar from '@/components/mobile/appBar'
import BottomNavigationBar from '@/components/mobile/bottomNavigationBar'

// Importando os componentes de página
import HomePage from '@/components/mobile/itensPage/home'
import CassinoPage from '@/components/mobile/itensPage/cassino'
import EsportsPage from '@/components/mobile/itensPage/esports'
import WalletPage from '@/components/mobile/itensPage/wallet'
import ProfilePage from '@/components/mobile/itensPage/profile'
import { useAuth } from '@/providers/auth-provider'




export default function MobileCasinoPage() {
  const { activeTab } = useNavigationStore()
  const { state: { isLoading } } = useAuth();


  // Função para renderizar o componente correto com base na aba ativa
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />
      case 'casino':
        return <CassinoPage />
      case 'sports':
        return <EsportsPage />
      case 'wallet':
        return <WalletPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  if (isLoading) {
    return (
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    )
  }
  return (
    <div className="min-h-screen  text-white flex flex-col">
      {/* App Bar */}
      <AppBar />
      {renderActiveComponent()}
      <BottomNavigationBar />
    </div>
  )
}