'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Menu, Bell, Home, Gamepad2, Activity, User, Wallet, 
         TrendingUp, Trophy, Target, 
         Zap, Crown, Settings, 
         Play} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'
import { useNavigationStore, type NavigationTab } from '@/stores/navigationStore'

// Types
interface GameStats {
  id: string
  username: string
  bet: number
  multiplier: number
  payout: number
  time: string
}

interface PlinkoSettings {
  mode: 'manual' | 'auto'
  betAmount: number
  lines: number
  risk: 'low' | 'average' | 'high'
  balance: number
}

// Desktop stats format
const highestWins = [
  { user: 'Mine', avatar: '👑', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  { user: 'Mine', avatar: '⚡', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  { user: 'Mine', avatar: '🎮', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
]

const latestBets = [
  { user: 'Mine', avatar: '🎯', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  { user: 'Mine', avatar: '💎', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  { user: 'Mine', avatar: '🍀', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
]

const highRollers = [
  { user: 'Mine', avatar: '💎', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  { user: 'Mine', avatar: '🐋', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  { user: 'Mine', avatar: '💰', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
]

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

// Plinko Ball Animation Component
const PlinkoBoard = ({ isPlaying, gameSettings, setGameSettings, animating, setAnimating, setIsPlaying }: { 
  isPlaying: boolean; 
  gameSettings: PlinkoSettings;
  setGameSettings: React.Dispatch<React.SetStateAction<PlinkoSettings>>;
  animating: boolean;
  setAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 })

  const startGame = useCallback(() => {
    if (animating) return
    setAnimating(true)
    setBallPosition({ x: 50, y: 0 })
    
    // Enhanced physics simulation
    const animate = () => {
      let currentY = 0
      let currentX = 50
      let velocityX = 0
      let velocityY = 0
      const gravity = 0.3
      const bounce = 0.7
      const friction = 0.98
      
      // Generate peg positions for collision detection
      const pegs: Array<{ x: number; y: number; radius: number }> = []
      for (let row = 0; row < 8; row++) {
        const pegsInRow = 3 + row
        const totalWidth = 98
        const pegSpacing = totalWidth / (10 - 1)
        const rowWidth = (pegsInRow - 1) * pegSpacing
        const startX = (100 - rowWidth) / 2
        const availableHeight = 65
        const verticalSpacing = availableHeight / 7
        const pegY = 8 + (row * verticalSpacing)
        
        for (let col = 0; col < pegsInRow; col++) {
          const pegX = startX + (col * pegSpacing)
          pegs.push({ x: pegX, y: pegY, radius: 1.5 })
        }
      }
      
      const interval = setInterval(() => {
        // Apply gravity
        velocityY += gravity
        
        // Update position
        currentX += velocityX
        currentY += velocityY
        
        // Check collision with pegs
        for (const peg of pegs) {
          const dx = currentX - peg.x
          const dy = currentY - peg.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Collision detected
          if (distance < peg.radius + 2) {
            // Calculate collision response
            const angle = Math.atan2(dy, dx)
            const force = 2.5
            
            velocityX += Math.cos(angle) * force
            velocityY += Math.sin(angle) * force * 0.5
            
            // Add some randomness for natural bouncing
            velocityX += (Math.random() - 0.5) * 1.5
            
            // Prevent ball from sticking to peg
            currentX = peg.x + Math.cos(angle) * (peg.radius + 2.5)
            currentY = peg.y + Math.sin(angle) * (peg.radius + 2.5)
          }
        }
        
        // Apply friction to horizontal velocity
        velocityX *= friction
        
        // Boundary collisions with walls
        if (currentX <= 2) {
          currentX = 2
          velocityX = Math.abs(velocityX) * bounce
        }
        if (currentX >= 98) {
          currentX = 98
          velocityX = -Math.abs(velocityX) * bounce
        }
        
        // Limit velocities for stability
        velocityX = Math.max(-8, Math.min(8, velocityX))
        velocityY = Math.max(-5, Math.min(12, velocityY))
        
        setBallPosition({ x: currentX, y: currentY })
        
        // Ball reaches bottom multiplier area
        if (currentY >= 82) {
          clearInterval(interval)
          setAnimating(false)
          setIsPlaying(false)
          
          // Determine which multiplier slot
          const slotIndex = Math.floor((currentX / 100) * 9)
          const finalSlot = Math.max(0, Math.min(8, slotIndex))
          const multiplierValues = [5.6, 3, 1.5, 1.2, 1.1, 1.2, 1.5, 3, 5.6]
          const finalMultiplier = multiplierValues[finalSlot]
          const payout = gameSettings.betAmount * finalMultiplier
          
          // Update balance with result
          setTimeout(() => {
            setGameSettings(prev => ({ 
              ...prev, 
              balance: prev.balance - prev.betAmount + payout 
            }))
            console.log(`Ball landed in slot ${finalSlot + 1} with ${finalMultiplier}x multiplier! Payout: ${payout}`)
          }, 300)
        }
      }, 16) // ~60 FPS for smooth animation
    }
    
    animate()
  }, [animating, setAnimating, setIsPlaying, gameSettings, setGameSettings])

  useEffect(() => {
    if (isPlaying) {
      startGame()
    }
  }, [isPlaying, startGame])

  // Exactly 9 multipliers as shown in the image
  const multipliers = ['5.6x', '3x', '1.5x', '1.2x', '1.1x', '1.2x', '1.5x', '3x', '5.6x']
  
  return (
    <div className="relative w-full h-[50vh] bg-gradient-to-b from-blue-900/80 via-blue-800/60 to-blue-900/90 overflow-hidden" 
         style={{
           backgroundImage: `
             radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
             radial-gradient(circle at 70% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
             radial-gradient(circle at 40% 70%, rgba(255,255,255,0.1) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12) 1px, transparent 1px),
             radial-gradient(circle at 10% 60%, rgba(255,255,255,0.08) 1px, transparent 1px),
             radial-gradient(circle at 90% 40%, rgba(255,255,255,0.1) 1px, transparent 1px)
           `,
           backgroundSize: '150px 150px, 200px 200px, 180px 180px, 160px 160px, 170px 170px, 190px 190px'
         }}>
      
      {/* Triangular Plinko Pegs - 8 rows: 3,4,5,6,7,8,9,10 pegs in optimized pyramid formation */}
      <div className="absolute inset-0 pt-4">
        {[...Array(8)].map((_, row) => {
          const pegsInRow = 3 + row // Row 0: 3 pegs, Row 1: 4 pegs, ..., Row 7: 10 pegs
          const maxPegs = 10 // Maximum pegs in the last row
          const totalWidth = 94 // Further increased width for maximum horizontal spacing
          
          // Calculate the starting position to center each row with increased spacing
          const pegSpacing = totalWidth / (maxPegs - 1) // Space between pegs based on max row
          const rowWidth = (pegsInRow - 1) * pegSpacing
          const startX = (100 - rowWidth) / 2 // Center the row
          
          // Better vertical distribution
          const availableHeight = 65 // Available height percentage for pegs
          const verticalSpacing = availableHeight / 7 // Space between 8 rows
          
          return [...Array(pegsInRow)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              className="absolute w-2 h-2 bg-white/95 rounded-full shadow-lg"
              style={{
                left: `${startX + (col * pegSpacing)}%`,
                top: `${8 + (row * verticalSpacing)}%`,
                boxShadow: '0 0 8px rgba(255,255,255,0.7), 0 0 16px rgba(255,255,255,0.3)'
              }}
            />
          ))
        })}
      </div>
      
      {/* Ball */}
      {animating && (
        <div
          className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-xl transition-all duration-120 ease-in-out z-20"
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.9), 0 0 30px rgba(255, 215, 0, 0.4)'
          }}
        />
      )}
      
      {/* 9 Multiplier Slots - exactly as shown in image with better spacing */}
      <div className="absolute bottom-0 w-full flex h-16">
        {multipliers.map((mult, index) => {
          const isCenter = index === 4
          const isHighValue = parseFloat(mult) >= 3
          
          return (
            <div
              key={index}
              className={cn(
                "flex-1 text-center py-3 text-base font-bold border-r border-white/20 relative flex items-center justify-center",
                isCenter 
                  ? "bg-green-500/30 text-green-300 shadow-lg" 
                  : isHighValue 
                    ? "bg-orange-500/25 text-orange-300"
                    : "bg-blue-500/20 text-blue-300"
              )}
              style={{
                background: isCenter 
                  ? 'linear-gradient(to bottom, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))'
                  : isHighValue
                    ? 'linear-gradient(to bottom, rgba(249, 115, 22, 0.25), rgba(249, 115, 22, 0.1))'
                    : 'linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))'
              }}
            >
              <div className="font-mono font-bold text-shadow">{mult}</div>
              {isCenter && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-400" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Ripple Effect Component
type RippleButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const RippleButton = ({ children, onClick, className, ...props }: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const addRipple = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Date.now()
    
    setRipples(prev => [...prev, { x, y, id }])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)
    
    onClick?.(event)
  }

  return (
    <button
      className={cn("relative overflow-hidden", className)}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms'
          }}
        />
      ))}
    </button>
  )
}

export default function MobilePlinkoPage() {
  const router = useRouter()
  const { activeTab, setActiveTab, isDrawerOpen, setDrawerOpen } = useNavigationStore()
  
  const [gameSettings, setGameSettings] = useState<PlinkoSettings>({
    mode: 'manual',
    betAmount: 10,
    lines: 12,
    risk: 'average',
    balance: 0.546698956
  })
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [activeTabStats, setActiveTabStats] = useState<'highest' | 'latest' | 'rollers'>('highest')

  // Handle navigation
  const handleNavigation = (tab: NavigationTab, route: string) => {
    setActiveTab(tab)
    if (route !== '/m') { // Don't navigate away from current page if it's casino
      router.push(route)
    }
  }

  const getCurrentData = () => {
    switch (activeTabStats) {
      case 'highest': return highestWins
      case 'latest': return latestBets
      case 'rollers': return highRollers
      default: return highestWins
    }
  }

  const handleBetChange = (amount: number) => {
    setGameSettings(prev => ({
      ...prev,
      betAmount: Math.max(1, Math.min(prev.balance, amount))
    }))
  }

  const handleQuickBet = (multiplier: number) => {
    const newAmount = gameSettings.betAmount * multiplier
    setGameSettings(prev => ({ ...prev, betAmount: Math.min(prev.balance, newAmount) }))
  }

  const handleMaxBet = () => {
    setGameSettings(prev => ({ ...prev, betAmount: prev.balance }))
  }

  const handlePlayClick = () => {
    if (gameSettings.betAmount <= gameSettings.balance && !isPlaying && !animating) {
      setIsPlaying(true)
      // The useEffect will trigger startBallAnimation when isPlaying becomes true
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
            <span className="text-sm font-mono">{gameSettings.balance.toFixed(8)}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <RippleButton className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
            <Bell className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </RippleButton>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="space-y-4">
          {/* Plinko Game Board - Maximum space utilization */}
          <div className="w-full">
            <PlinkoBoard 
              isPlaying={isPlaying} 
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
              animating={animating}
              setAnimating={setAnimating}
              setIsPlaying={setIsPlaying}
            />
          </div>
          
          {/* Compact Game Controls */}
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg mx-3 p-3">
            {/* Play Button and Bet Amount */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Play Button - Replaces Mode Selection */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Action</label>
                <button 
                  onClick={handlePlayClick}
                  disabled={isPlaying || animating}
                  className={cn(
                    "w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                    (isPlaying || animating)
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                  )}
                >
                  {(isPlaying || animating) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Playing
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </button>
              </div>

              {/* Bet Amount */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Your Bet</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={gameSettings.betAmount}
                    onChange={(e) => handleBetChange(Number(e.target.value))}
                    className="w-full bg-[#2a2a3e] border border-gray-600 rounded-lg px-3 py-1.5 text-white font-mono text-sm"
                    min="1"
                    max={gameSettings.balance}
                    placeholder="Bet amount"
                  />
                </div>
              </div>
            </div>

            {/* Quick Bet Buttons - Horizontal */}
            <div className="flex gap-1 mb-3">
              <button 
                onClick={() => handleQuickBet(0.5)}
                className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
              >
                ½
              </button>
              <button 
                onClick={() => handleQuickBet(2)}
                className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
              >
                2x
              </button>
              <button 
                onClick={() => handleQuickBet(10)}
                className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
              >
                +10
              </button>
              <button 
                onClick={() => handleMaxBet()}
                className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
              >
                MAX
              </button>
            </div>

            {/* Risk Selection - Now more prominent */}
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Risk Level</label>
              <div className="flex bg-[#2a2a3e] rounded-lg p-1">
                <button 
                  onClick={() => setGameSettings(prev => ({ ...prev, risk: 'low' }))}
                  className={cn(
                    "flex-1 py-2 px-2 rounded text-sm font-medium transition-colors",
                    gameSettings.risk === 'low' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  Low
                </button>
                <button 
                  onClick={() => setGameSettings(prev => ({ ...prev, risk: 'average' }))}
                  className={cn(
                    "flex-1 py-2 px-2 rounded text-sm font-medium transition-colors",
                    gameSettings.risk === 'average' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  Average
                </button>
                <button 
                  onClick={() => setGameSettings(prev => ({ ...prev, risk: 'high' }))}
                  className={cn(
                    "flex-1 py-2 px-2 rounded text-sm font-medium transition-colors",
                    gameSettings.risk === 'high' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          {/* Compact Statistics */}
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg mx-3 p-3">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Game Statistics</h3>
            
            {/* Tabs */}
            <div className="flex mb-3 bg-[#2a2a3e] rounded-lg p-1">
              <button 
                onClick={() => setActiveTabStats('highest')}
                className={cn(
                  "flex-1 py-1.5 px-2 text-xs font-medium transition-colors rounded",
                  activeTabStats === 'highest' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                Highest
              </button>
              <button 
                onClick={() => setActiveTabStats('latest')}
                className={cn(
                  "flex-1 py-1.5 px-2 text-xs font-medium transition-colors rounded",
                  activeTabStats === 'latest' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                Latest
              </button>
              <button 
                onClick={() => setActiveTabStats('rollers')}
                className={cn(
                  "flex-1 py-1.5 px-2 text-xs font-medium transition-colors rounded",
                  activeTabStats === 'rollers' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                Rollers
              </button>
            </div>
            
            {/* Stats List - Compact */}
            <div className="space-y-2">
              {getCurrentData().slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-[#2a2a3e] rounded-lg">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{item.user}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-500 font-mono">{item.bet}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-500 font-mono">{item.payout}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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