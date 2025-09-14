'use client'

import React, { useEffect, useRef } from 'react'

// CSS para esconder scrollbar
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`
import { Gamepad2, TrendingUp, Activity, Zap, Play, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore } from '@/stores/navigationStore'

// List of quick games for carousel
const quickGames = [
  {
    id: 1,
    name: 'Plinko',
    route: '/m/plinko',
    icon: '🎯',
    description: 'Drop balls and win up to 1000x',
    multiplier: '1000x',
    players: '2.4k',
    rating: 4.8,
    gradient: '',
    backgroundImage: '/plinko/capa.png'
  },
  {
    id: 2,
    name: 'Crash',
    route: '/m/crash',
    icon: '🚀',
    description: 'Ride the rocket to the moon',
    multiplier: '∞x',
    players: '1.8k',
    rating: 4.9,
    gradient: '',
    backgroundImage: '/crash/capa.png'
  },
  {
    id: 3,
    name: 'Dice',
    route: '/m/dice',
    icon: '🎲',
    description: 'Roll your way to victory',
    multiplier: '9900x',
    players: '3.1k',
    rating: 4.7,
    gradient: 'from-green-500 to-emerald-500',
    backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Mines',
    route: '/m/mines',
    icon: '💎',
    description: 'Find gems, avoid mines',
    multiplier: '5000x',
    players: '1.2k',
    rating: 4.6,
    gradient: '',
    backgroundImage: '/mines/capa.png'
  },
  {
    id: 5,
    name: 'Wheel',
    route: '/m/wheel',
    icon: '🎡',
    description: 'Spin the wheel of fortune',
    multiplier: '50x',
    players: '890',
    rating: 4.5,
    gradient: 'from-red-500 to-pink-500',
    backgroundImage: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=200&fit=crop'
  },
  {
    id: 6,
    name: 'Limbo',
    route: '/m/limbo',
    icon: '🔥',
    description: 'How low can you go?',
    multiplier: '1000000x',
    players: '567',
    rating: 4.8,
    gradient: 'from-indigo-500 to-purple-500',
    backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop'
  }
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
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' })
    }
  }

  // When the component is mounted, set loading to false
  useEffect(() => {
    // Simulate component loading time
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 500) // 500ms delay to simulate loading

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
      <main className="min-h-screen text-white flex flex-col">
        <div className="flex-1 overflow-auto pb-16">
          <div className="p-4">

            {/* Quick Games Carousel */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Jogos em Destaque</h2>
                <div className="flex gap-2">
                  <button
                    onClick={scrollLeft}
                    className="w-8 h-8 bg-[#1A2040] hover:bg-[#2A3050] rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#fdbf5c]" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="w-8 h-8 bg-[#1A2040] hover:bg-[#2A3050] rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[#fdbf5c]" />
                  </button>
                </div>
              </div>

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
              >
                {quickGames.map((game) => (
                  <div
                    key={game.id}
                    className="relative flex-shrink-0 w-64 h-[310px] rounded-xl overflow-hidden border border-[#2A3050] hover:border-[#fdbf5c]/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer bg-no-repeat"
                    style={{
                      backgroundImage: `url(${game.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={() => router.push(game.route)}
                  >
                    {/* Background Overlays */}
                    {game.gradient && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-60`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Header Elements */}
                    <div className="absolute top-3 left-3 text-2xl drop-shadow-lg filter brightness-110">
                      {game.icon}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-white font-medium">{game.rating}</span>
                    </div>
                    
                    {/* Multiplier Badge */}
                    <div className="absolute top-12 right-3">
                      <span className="text-[#fdbf5c] font-bold text-sm bg-gradient-to-r from-[#fdbf5c]/20 to-[#f69a0b]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#fdbf5c]/30">
                        {game.multiplier}
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {/* Players Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="w-4 h-4 text-white drop-shadow-lg" />
                        <span className="text-xs text-white/90 drop-shadow-lg font-medium">{game.players} jogando agora</span>
                      </div>
                      
                      {/* Game Title */}
                      <h3 className="font-bold text-white text-xl mb-2 drop-shadow-lg">{game.name}</h3>
                      
                      {/* Game Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2 drop-shadow-sm">{game.description}</p>

                      {/* Play Button */}
                      <RippleButton
                        className="w-full bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] hover:from-[#f69a0b] hover:to-[#fdbf5c] text-[#121214] font-semibold py-3 px-4 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(game.route)
                        }}
                      >
                        🎮 Jogar Agora
                      </RippleButton>
                    </div>
                  </div>
                ))}
              </div>
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
    </>
  )
}