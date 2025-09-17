'use client'

import React from 'react'
import { Home, Gamepad2, Activity, User, Wallet } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'casino', label: 'Cassino', icon: Gamepad2 },
  { id: 'sports', label: 'Esports', icon: Activity },
  { id: 'wallet', label: 'Carteira', icon: Wallet },
  { id: 'profile', label: 'Perfil', icon: User },
]

export default function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
  return (
    <div 
      className={cn(
        "w-64 h-full flex flex-col border-r",
        className
      )}
      style={{
        backgroundColor: colors.primary,
        borderColor: colors.mediumGray + '20'
      }}
    >
      {/* Logo Section */}
      <div className="p-[14px] border-b" style={{ borderColor: colors.mediumGray + '20' }}>
       <Logo/>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <RippleButton
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                  "hover:scale-105"
                )}
                style={{
                  backgroundColor: isActive ? colors.secondary + '20' : 'transparent',
                  borderColor: isActive ? colors.secondary + '40' : 'transparent',
                  borderWidth: '1px'
                }}
              >
                <Icon 
                  size={20} 
                  style={{ 
                    color: isActive ? colors.secondary : colors.mediumGray 
                  }} 
                />
                <span 
                  className="font-medium"
                  style={{ 
                    color: isActive ? colors.secondary : colors.mediumGray 
                  }}
                >
                  {item.label}
                </span>
              </RippleButton>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: colors.mediumGray + '20' }}>
        <div className="text-center">
          <p className="text-xs" style={{ color: colors.mediumGray }}>
            © 2024 PolDex Casino
          </p>
        </div>
      </div>
    </div>
  )
}