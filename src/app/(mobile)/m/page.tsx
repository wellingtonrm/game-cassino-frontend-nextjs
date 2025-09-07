'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const { activeTab, setActiveTab, isDrawerOpen, setDrawerOpen } = useNavigationStore()
  
  // SSR-safe mounting state to prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false)
  
  // Only mount after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Acesso ao saldo do usuário para exibição no cabeçalho
  const { balance, formatBalance } = usePlinkoStore()
  
  // Handle navigation
  const handleNavigation = (tab: NavigationTab, route: string) => {
    setActiveTab(tab)
    if (route !== '/m') { // Don't navigate away from current page if it's casino
      router.push(route)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      {/* Header / App Bar */}


      {/* Conteúdo Principal - Otimizado para mobile com visual de aplicativo Android */}
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