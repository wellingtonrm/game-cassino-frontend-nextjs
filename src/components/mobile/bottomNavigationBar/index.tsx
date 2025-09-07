'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore, type NavigationTab } from '@/stores/navigationStore'

// Importando os ícones necessários
import { Home, Gamepad2, Activity, User, Wallet } from 'lucide-react'

const bottomNavItems = [
  { icon: Home, label: 'Início', tab: 'home' as NavigationTab, route: '/m' },
  { icon: Gamepad2, label: 'Cassino', tab: 'casino' as NavigationTab, route: '/m/casino' },
  { icon: Activity, label: 'Esportes', tab: 'sports' as NavigationTab, route: '/m/sports' },
  { icon: User, label: 'Perfil', tab: 'profile' as NavigationTab, route: '/m/profile' },
  { icon: Wallet, label: 'Carteira', tab: 'wallet' as NavigationTab, route: '/m/wallet' },
]

export default function BottomNavigationBar() {
  const router = useRouter()
  const { activeTab, setActiveTab } = useNavigationStore()


  const handleNavigation = (tab: NavigationTab, route: string) => {
    setActiveTab(tab)
    router.push(route)
  }

  return (
    /* Navegação Inferior - Estilo moderno de aplicativo mobile */
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#1a1a2e] to-[#232342] backdrop-blur-lg border-t border-purple-900/20 px-2 py-1 z-40 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {bottomNavItems.map((item, index) => {
          const isActive = activeTab === item.tab
          return (
            <RippleButton
              key={index}
              onClick={() => handleNavigation(item.tab, item.route)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0",
                isActive
                  ? "text-white bg-purple-600/20"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-purple-600/20 rounded-xl" />
              )}
              <div className="relative z-10">
                <item.icon className={cn("w-5 h-5", isActive && "text-purple-400")} />
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 relative z-10",
                isActive && "font-semibold"
              )}>{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              )}
            </RippleButton>
          )
        })}
      </div>
    </nav>
  )
}