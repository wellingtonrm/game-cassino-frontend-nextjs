'use client'

import React, { useEffect } from 'react'
import { Gamepad2, TrendingUp, Activity, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore } from '@/stores/navigationStore'

// List of available casino games
const casinoGames = [
  { name: 'Plinko', route: '/m/plinko', icon: 'plinko-icon.svg' },
  // Add other games here as needed
]

// Highlights list
const highlights = [
  { title: 'Casino', description: 'Popular casino games', icon: Gamepad2, route: '/m/casino' },
  { title: 'Sports', description: 'Live sports betting', icon: Activity, route: '/m/sports' },
  { title: 'Trading', description: 'Trading operations', icon: TrendingUp, route: '/m/trading' },
  { title: 'Promotions', description: 'Special offers', icon: Zap, route: '/m/promotions' },
]

export default function HomePage() {
  const router = useRouter()
  const { setPageLoading } = useNavigationStore()
  
  // When the component is mounted, set loading to false
  useEffect(() => {
    // Simulate component loading time
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 500) // 500ms delay to simulate loading
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen text-white flex flex-col">
      <div className="flex-1 overflow-auto pb-16">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          
          {/* Main Banner */}
          <div className="bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] rounded-xl p-5 mb-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-[#121214]">Welcome Bonus</h2>
            <p className="text-sm text-[#121214]/80 mb-3">Get up to $500 on your first deposit!</p>
            <RippleButton 
              className="bg-[#121214] text-[#fdbf5c] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-[#1A2040]"
              onClick={() => router.push('/m/wallet')}
            >
              Deposit Now
            </RippleButton>
          </div>
          
          {/* Highlights */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Highlights</h2>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <RippleButton
                  key={index}
                  onClick={() => router.push(item.route)}
                  className="bg-[#1A2040] rounded-lg p-4 flex flex-col items-center justify-center h-32 border border-[#1A2040] hover:border-[#fdbf5c] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#fdbf5c]/20 rounded-full flex items-center justify-center mb-2">
                    <item.icon className="w-6 h-6 text-[#fdbf5c]" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </RippleButton>
              ))}
            </div>
          </div>
          
          {/* Popular Games */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Popular Games</h2>
            <div className="bg-[#1A2040] rounded-lg p-4 border border-[#1A2040]">
              <p className="text-gray-400 mb-3">Try our most popular games:</p>
              <div className="space-y-3">
                <RippleButton
                  onClick={() => router.push('/m/plinko')}
                  className="w-full bg-[#121214] text-white py-3 px-4 rounded-lg font-medium flex items-center gap-3 hover:bg-[#1A2040]"
                >
                  <div className="w-10 h-10 bg-[#fdbf5c]/20 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-[#fdbf5c]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Plinko</div>
                    <div className="text-xs text-gray-400">Play now and win up to 1000x</div>
                  </div>
                </RippleButton>
                
                <RippleButton
                  onClick={() => router.push('/m/casino')}
                  className="w-full bg-[#121214] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-between hover:bg-[#1A2040]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#fdbf5c]/20 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-[#fdbf5c]" />
                    </div>
                    <div>
                      <div className="font-semibold">View all games</div>
                      <div className="text-xs text-gray-400">Explore our complete collection</div>
                    </div>
                  </div>
                </RippleButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}