'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {  Play,  ArrowLeft } from 'lucide-react'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'
import { RippleButton } from '@/components/ui/RippleButton'
import PlinkoComponent from '@/components/mobile/plinko/plinkoComponent_8_row'




export default function MobilePlinkoPage() {
  const router = useRouter()
  
  // SSR-safe mounting state to prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false)
  
  // Only mount after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const { 
    isPlaying,
    isAnimating,
    balance,
    settings,
    launchBall,
    setBetAmount,
    setRiskLevel,
    formatBalance,
    getMaxBet,
    canAffordBet
  } = usePlinkoStore()

  const handleBetChange = (amount: number) => {
    const validAmount = Math.max(1, Math.min(getMaxBet(), amount))
    setBetAmount(validAmount)
  }




  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] text-white flex flex-col">
      {/* Header Simplificado */}
      <header className="bg-[#1a1a2e]/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <RippleButton 
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </RippleButton>
        
        <h1 className="text-lg font-semibold">Plinko</h1>
        
        <div className="flex items-center gap-2 bg-green-600/20 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono text-green-400">{formatBalance(balance)} USDT</span>
        </div>
      </header>

      {/* Área do Jogo */}
      <main className="flex-1 flex flex-col">
        {/* Tabuleiro Plinko */}
        <div className="bg-gray-900 bg-opacity-95">
          <PlinkoComponent />
        </div>

        {/* Controles Simplificados */}
        <div className="bg-[#1a1a2e] p-4 space-y-4">
          {/* Seção Action */}
          <div className="space-y-2">
            <span className="text-sm text-gray-400">Action</span>
            <div className="flex items-center gap-2">
              <RippleButton
                onClick={launchBall}
                disabled={!canAffordBet() || isAnimating}
                className={cn(
                  "flex-1 py-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2",
                  canAffordBet() && !isAnimating
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                )}
              >
                <Play className="w-5 h-5" />
                Play
              </RippleButton>
              
              <div className="bg-[#2a2a3e] rounded-lg px-4 py-3 text-center font-mono text-lg">
                {settings.betAmount}
              </div>
            </div>
          </div>

          {/* Controles de Aposta */}
          <div className="flex gap-2">
            <RippleButton 
              onClick={() => handleBetChange(settings.betAmount / 2)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              ½
            </RippleButton>
            
            <RippleButton 
              onClick={() => handleBetChange(settings.betAmount * 2)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              2x
            </RippleButton>
            
            <RippleButton 
              onClick={() => handleBetChange(settings.betAmount + 10)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              +10
            </RippleButton>
            
            <RippleButton 
              onClick={() => handleBetChange(getMaxBet())}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              MAX
            </RippleButton>
          </div>

          {/* Seletor de Risco */}
          <div className="space-y-2">
            <span className="text-sm text-gray-400">Risk Level</span>
            <div className="flex gap-1">
              {[{label: 'Low', value: 'low'}, {label: 'Average', value: 'medium'}, {label: 'High', value: 'high'}].map((risk) => (
                <RippleButton
                  key={risk.value}
                  onClick={() => setRiskLevel(risk.value as any)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                    settings.risk === risk.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  )}
                >
                  {risk.label}
                </RippleButton>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}