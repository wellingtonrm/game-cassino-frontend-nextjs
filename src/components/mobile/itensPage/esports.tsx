'use client'

import React, { useEffect } from 'react'
import { Activity, Trophy } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore } from '@/stores/navigationStore'

const sportsEvents = [
  { name: 'Football', matches: 24 },
  { name: 'Basketball', matches: 12 },
  { name: 'Tennis', matches: 8 },
  { name: 'MMA', matches: 5 },
]

export default function EsportsPage() {
  const { setPageLoading } = useNavigationStore()
  
  // When the component is mounted, set loading to false
  useEffect(() => {
    // Simulate component loading time
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 500) // 500ms delay to simulate loading
    
    return () => clearTimeout(timer)
  }, [setPageLoading])
  
  return (
    <div className="min-h-screen  text-white flex flex-col">
      <main className="flex-1 overflow-auto pb-16">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Sports</h1>
          
          {/* Featured Events */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Featured Events</h2>
            <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Champions League</h3>
                  <p className="text-sm text-gray-400">Real Madrid vs Liverpool</p>
                </div>
                <div className="bg-purple-600/20 px-3 py-1 rounded-full">
                  <span className="text-purple-400 text-sm">Today 16:00</span>
                </div>
              </div>
              <div className="flex justify-around">
                <RippleButton className="bg-[#232342] px-4 py-2 rounded-lg text-sm">
                  Real Madrid <span className="font-bold ml-1">2.10</span>
                </RippleButton>
                <RippleButton className="bg-[#232342] px-4 py-2 rounded-lg text-sm">
                  Draw <span className="font-bold ml-1">3.25</span>
                </RippleButton>
                <RippleButton className="bg-[#232342] px-4 py-2 rounded-lg text-sm">
                  Liverpool <span className="font-bold ml-1">2.80</span>
                </RippleButton>
              </div>
            </div>
          </div>
          
          {/* Sports List */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Available Sports</h2>
            <div className="grid grid-cols-2 gap-4">
              {sportsEvents.map((sport, index) => (
                <RippleButton
                  key={index}
                  className="bg-[#1a1a2e] rounded-lg p-4 flex items-center justify-between border border-gray-800 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mr-3">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="font-medium">{sport.name}</span>
                  </div>
                  <div className="bg-[#232342] px-2 py-1 rounded-full text-xs text-gray-300">
                    {sport.matches} matches
                  </div>
                </RippleButton>
              ))}
            </div>
          </div>
          
          {/* Competitions */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Competitions</h2>
            <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center mb-3">
                <Trophy className="w-5 h-5 text-purple-400 mr-2" />
                <h3 className="font-semibold">Live Tournaments</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-[#232342] p-3 rounded-lg flex justify-between items-center">
                  <span>Copa do Brasil</span>
                  <span className="text-purple-400 text-sm">8 matches</span>
                </div>
                <div className="bg-[#232342] p-3 rounded-lg flex justify-between items-center">
                  <span>Premier League</span>
                  <span className="text-purple-400 text-sm">6 matches</span>
                </div>
                <div className="bg-[#232342] p-3 rounded-lg flex justify-between items-center">
                  <span>La Liga</span>
                  <span className="text-purple-400 text-sm">4 matches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}