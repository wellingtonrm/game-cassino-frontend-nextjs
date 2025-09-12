'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore, type NavigationTab } from '@/stores/navigationStore'

// Importing necessary icons
import { Home, Gamepad2, Activity, User, Wallet } from 'lucide-react'

const bottomNavItems = [
  { icon: Home, label: 'Home', tab: 'home' as NavigationTab },
  { icon: Gamepad2, label: 'Casino', tab: 'casino' as NavigationTab },
  { icon: Activity, label: 'Sports', tab: 'sports' as NavigationTab },
  { icon: User, label: 'Profile', tab: 'profile' as NavigationTab },
  { icon: Wallet, label: 'Wallet', tab: 'wallet' as NavigationTab },
]

export default function BottomNavigationBar() {
  const { activeTab, setActiveTab } = useNavigationStore();

  const handleNavigation = (tab: NavigationTab) => {
    setActiveTab(tab)
  }

  return (
    /* Bottom Navigation - Modern mobile app style */
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t border-[#1A2040] px-2 py-1 z-40 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {bottomNavItems.map((item, index) => {
          const isActive = activeTab === item.tab
          return (
            <RippleButton
              key={index}
              onClick={() => handleNavigation(item.tab)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0",
                isActive
                  ? "text-[#fdbf5c] bg-[#1A2040]"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-[#1A2040] rounded-xl" />
              )}
              <div className="relative z-10">
                <item.icon className={cn("w-5 h-5", isActive && "text-[#fdbf5c]")} />
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 relative z-10",
                isActive && "font-semibold"
              )}>{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#fdbf5c] rounded-full" />
              )}
            </RippleButton>
          )
        })}
      </div>
    </nav>
  )
}