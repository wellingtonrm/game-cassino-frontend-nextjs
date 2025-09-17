'use client'

import React, { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { colors } from '@/lib/design-system'

// Layout Components
import Sidebar from '@/components/desktop/layout/Sidebar'
import TopBar from '@/components/desktop/layout/TopBar'

// Page Components
import HomePage from '@/components/desktop/pages/HomePage'

export default function DesktopCasinoPage() {
  const [activeTab, setActiveTab] = useState('home')



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
        
          <HomePage  />
        
        </main>
      </div>
    </div>
  )
}
