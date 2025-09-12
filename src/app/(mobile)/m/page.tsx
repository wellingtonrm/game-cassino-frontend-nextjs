'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { ChevronDown, Menu, Bell, Home, Gamepad2, Activity, User, Wallet, 
         TrendingUp, Trophy, Target, 
         Zap, Crown, Settings } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'
import { useNavigationStore, type NavigationTab } from '@/stores/navigationStore'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { RippleButton } from '@/components/ui/RippleButton'
import AppBar from '@/components/mobile/appBar'
import BottomNavigationBar from '@/components/mobile/bottomNavigationBar'

// Importando os componentes de página
import HomePage from '@/components/mobile/itensPage/home'
import CassinoPage from '@/components/mobile/itensPage/cassino'
import EsportsPage from '@/components/mobile/itensPage/esports'
import WalletPage from '@/components/mobile/itensPage/wallet'
import ProfilePage from '@/components/mobile/itensPage/profile'



const navigationItems = [
  { icon: Gamepad2, label: 'Cassino', active: true },
  { icon: Activity, label: 'Esportes', active: false },
  { icon: TrendingUp, label: 'Trading', active: false },
  { icon: Zap, label: 'Corridas', active: false },
  { icon: Target, label: 'Loteria', active: false },
  { icon: Crown, label: 'Clube VIP', active: false },
  { icon: Trophy, label: 'Ranking', active: false },
]

const bottomNavItems = [
  { icon: Home, label: 'Início', tab: 'home' as NavigationTab, route: '/' },
  { icon: Gamepad2, label: 'Cassino', tab: 'casino' as NavigationTab, route: '/m' },
  { icon: Activity, label: 'Esportes', tab: 'sports' as NavigationTab, route: '/sports' },
  { icon: User, label: 'Perfil', tab: 'profile' as NavigationTab, route: '/profile' },
  { icon: Wallet, label: 'Carteira', tab: 'wallet' as NavigationTab, route: '/wallet' },
]

// Lista de jogos disponíveis no cassino
const casinoGames = [
  { name: 'Plinko', route: '/m/plinko', icon: 'plinko-icon.svg' },
  // Adicione outros jogos aqui conforme necessário
]

// Plinko Game Component using Professional Phaser.js Scene with Zustand Store
// Now imported from separate clean component file

// RippleButton now imported from UI components for better organization



export default function MobileCasinoPage() {
  const { activeTab, isDrawerOpen, setDrawerOpen, isPageLoading, setPageLoading } = useNavigationStore()
  
  // SSR-safe mounting state to prevent hydration mismatches
  

  // Acesso ao saldo do usuário para exibição no cabeçalho
  const { balance, formatBalance } = usePlinkoStore()
  
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

  return (
    <div className="min-h-screen  text-white flex flex-col">
      {/* App Bar */}
      <AppBar />
      
      {/* Conteúdo Principal - Renderiza o componente ativo com loading */}
     
       <Suspense fallback={ <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>}>
          {renderActiveComponent()}
      </Suspense>
      {/* Barra de Navegação Inferior */}
      <BottomNavigationBar />
    </div>
  )
}