'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Menu, Bell, Home, Gamepad2, Activity, User, Wallet, 
         TrendingUp, Trophy, Target, 
         Zap, Crown, Settings, 
         Play} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'
import { useNavigationStore, type NavigationTab } from '@/stores/navigationStore'
import { usePlinkoStore, type PlinkoResult } from '@/stores/plinkoStore'
import { PlinkoBoard, GameControls, GameStats, HistoryPanel } from '@/components/game'
import { RippleButton } from '@/components/ui/RippleButton'
import { useSSRSafe } from '@/hooks/useSSRSafe'



const navigationItems = [
  { icon: Gamepad2, label: 'Casino', active: true },
  { icon: Activity, label: 'Sports', active: false },
  { icon: TrendingUp, label: 'Trading', active: false },
  { icon: Zap, label: 'Racing', active: false },
  { icon: Target, label: 'Lottery', active: false },
  { icon: Crown, label: 'VIP Club', active: false },
  { icon: Trophy, label: 'Leaderboard', active: false },
]

const bottomNavItems = [
  { icon: Home, label: 'Home', tab: 'home' as NavigationTab, route: '/' },
  { icon: Gamepad2, label: 'Casino', tab: 'casino' as NavigationTab, route: '/m' },
  { icon: Activity, label: 'Sports', tab: 'sports' as NavigationTab, route: '/sports' },
  { icon: User, label: 'Profile', tab: 'profile' as NavigationTab, route: '/profile' },
  { icon: Wallet, label: 'Wallet', tab: 'wallet' as NavigationTab, route: '/wallet' },
]

// Plinko Game Component using Professional Phaser.js Scene with Zustand Store
// Now imported from separate clean component file

// RippleButton now imported from UI components for better organization



export default function MobilePlinkoPage() {
  const router = useRouter()
  const { activeTab, setActiveTab, isDrawerOpen, setDrawerOpen } = useNavigationStore()
  
  // SSR-safe mounting state to prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false)
  
  // Only mount after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // ============================================================================
  // DEMONSTRATION: Using Zustand for State Sharing
  // ============================================================================
  // The usePlinkoStore hook provides access to centralized Plinko game state
  // that can be shared across multiple components without prop drilling.
  // 
  // Key benefits:
  // 1. Centralized state management - All game data in one place
  // 2. Component independence - Components can access state directly
  // 3. Automatic persistence - Game state is automatically saved/loaded
  // 4. Type safety - Full TypeScript support with proper typing
  // 5. Performance - Only components using specific state pieces re-render
  //
  // Usage examples:
  // - PlinkoBoard component uses: settings, isPlaying, animating, etc.
  // - PlinkoControlPanel component uses: balance, settings, actions, etc.
  // - PlinkoHistory component uses: history, clearHistory, etc.
  // - This main component uses: balance, settings, game actions, etc.
  //
  // All components stay in sync automatically through Zustand!
  // ============================================================================
  
  const { 
    balance,           // Current player balance
    settings,          // Game settings (bet amount, risk level, etc.)
    isPlaying,         // Is game currently playing
    animating,         // Is ball currently animating
    isAutoPlay,        // Is auto-play mode enabled
    autoPlayRunning,   // Is auto-play currently running
    setBetAmount,      // Action to set bet amount
    setRiskLevel,      // Action to set risk level
    setGameMode,       // Action to set game mode (manual/auto)
    setBallWeight,     // Action to set ball weight
    setBallFriction,   // Action to set ball friction
    setBallSize,       // Action to set ball size
    startGame,         // Action to start a single game
    startAutoPlay,     // Action to start auto-play
    stopAutoPlay,      // Action to stop auto-play
    canAffordBet,      // Utility to check if player can afford current bet
    getMaxBet,         // Utility to get maximum possible bet
    formatBalance      // Utility to format balance display
  } = usePlinkoStore()
  


  // Handle navigation
  const handleNavigation = (tab: NavigationTab, route: string) => {
    setActiveTab(tab)
    if (route !== '/m') { // Don't navigate away from current page if it's casino
      router.push(route)
    }
  }



  const handleBetChange = (amount: number) => {
    const validAmount = Math.max(1, Math.min(getMaxBet(), amount))
    setBetAmount(validAmount)
  }

  const handleQuickBet = (multiplier: number) => {
    const newAmount = settings.betAmount * multiplier
    const validAmount = Math.min(getMaxBet(), newAmount)
    setBetAmount(validAmount)
  }

  const handleMaxBet = () => {
    setBetAmount(getMaxBet())
  }

  const handlePlayClick = () => {
    console.log('=== PLAY BUTTON CLICKED ===');
    console.log('Current balance:', balance);
    console.log('Bet amount:', settings.betAmount);
    console.log('Can afford bet:', canAffordBet());
    console.log('Is playing:', isPlaying);
    console.log('Is animating:', animating);
    console.log('Settings:', settings);
    
    // Check conditions before starting
    if (canAffordBet() && !isPlaying && !animating) {
      console.log('✅ All conditions met - Starting game...');
      const result = startGame();
      console.log('Game start result:', result);
      
      if (result) {
        console.log('🎯 Game started successfully - ball should drop now!');
      } else {
        console.log('❌ Game failed to start despite conditions being met');
      }
    } else {
      console.log('❌ Cannot start game:');
      console.log('  - Can afford bet:', canAffordBet());
      console.log('  - Not playing:', !isPlaying);
      console.log('  - Not animating:', !animating);
      
      // Provide user feedback
      if (!canAffordBet()) {
        console.log('💰 Insufficient balance for bet');
      }
      if (isPlaying) {
        console.log('🎮 Game already in progress');
      }
      if (animating) {
        console.log('🏀 Ball animation in progress');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      {/* Header / App Bar */}
      <header className="bg-[#1a1a2e] border-b border-gray-800 px-4 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <RippleButton className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Menu className="w-6 h-6" />
            </RippleButton>
          </SheetTrigger>
          
          {/* Drawer Navigation */}
          <SheetContent side="left" className="w-80 bg-gray-900 border-gray-800 p-0">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="p-6 bg-[#1a1a2e]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Boominas</h2>
                    <p className="text-sm text-gray-400">Premium Gaming</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 py-4">
                {navigationItems.map((item, index) => (
                  <RippleButton
                    key={index}
                    className={cn(
                      "w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors",
                      item.active 
                        ? "bg-purple-600/20 text-purple-400 border-r-2 border-purple-400" 
                        : "text-gray-300 hover:bg-gray-800/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </RippleButton>
                ))}
              </nav>
              
              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-800">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Settings</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Logo */}
       <Logo/>
        
        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#2a2a3e] rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-mono">{formatBalance(balance)}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <RippleButton className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
            <Bell className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </RippleButton>
        </div>
      </header>

      {/* Main Content - Optimized for mobile Android app feel with increased game area */}
      <main className="flex-1 overflow-auto pb-16">
        <div className="space-y-1">
          {/* Plinko Game Board - Full screen Android app style with 9 rows */}
          <div className="px-1">
            <PlinkoBoard />
          </div>
          
          {/* Compact Game Controls - Android bottom sheet style with reduced spacing */}
          <GameControls 
            onPlayClick={handlePlayClick}
            onBetChange={handleBetChange}
            onQuickBet={handleQuickBet}
            onMaxBet={handleMaxBet}
            onRiskChange={setRiskLevel}
            onBallWeightChange={setBallWeight}
            onBallFrictionChange={setBallFriction}
            onBallSizeChange={setBallSize}
          />

          {/* Unified Game Statistics Component */}
          <GameStats />
          
          {/* History Panel */}
          <HistoryPanel />
        </div>
      </main>

      {/* Bottom Navigation - Android Style with Zustand */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-gray-800 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item, index) => {
            const isActive = activeTab === item.tab
            return (
              <RippleButton
                key={index}
                onClick={() => handleNavigation(item.tab, item.route)}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors min-w-0",
                  isActive 
                    ? "text-purple-400" 
                    : "text-gray-400 hover:text-gray-300"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-purple-400")} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-purple-400 rounded-full" />}
              </RippleButton>
            )
          })}
        </div>
      </nav>
    </div>
  )
}