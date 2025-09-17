'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, DollarSign } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface PlinkoGameProps {
  onBack?: () => void
}

interface GameState {
  isPlaying: boolean
  betAmount: number
  ballsCount: number
  autoPlay: boolean
  totalWinnings: number
  currentMultiplier: number
}

const initialGameState: GameState = {
  isPlaying: false,
  betAmount: 0,
  ballsCount: 1,
  autoPlay: false,
  totalWinnings: 0,
  currentMultiplier: 0
}

// Multiplicadores para cada posição (8 caixas)
const multipliers = [110, 41, 10, 5, 3, 5, 10, 41, 110]

export default function PlinkoGame({ onBack }: PlinkoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [balance] = useState(1000) // Mock balance
  const [isAnimating, setIsAnimating] = useState(false)

  // Função para iniciar o jogo
  const startGame = () => {
    if (gameState.betAmount <= 0 || gameState.betAmount > balance) return
    
    setGameState(prev => ({ ...prev, isPlaying: true }))
    dropBall()
  }

  // Função para soltar a bola
  const dropBall = () => {
    setIsAnimating(true)
    
    // Simular animação da bola caindo
    setTimeout(() => {
      // Simular resultado aleatório
      const randomIndex = Math.floor(Math.random() * multipliers.length)
      const multiplier = multipliers[randomIndex]
      const winAmount = gameState.betAmount * (multiplier / 100)
      
      setGameState(prev => ({
        ...prev,
        currentMultiplier: multiplier,
        totalWinnings: prev.totalWinnings + winAmount,
        isPlaying: false
      }))
      
      setIsAnimating(false)
    }, 2000)
  }

  // Função para resetar o jogo
  const resetGame = () => {
    setGameState(initialGameState)
  }

  // Função para toggle auto play
  const toggleAutoPlay = () => {
    setGameState(prev => ({ ...prev, autoPlay: !prev.autoPlay }))
  }

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 400

    // Clear canvas
    ctx.fillStyle = colors.primary
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw pegs (simplified version)
    ctx.fillStyle = colors.mediumGray
    const pegRows = 8
    const pegSpacing = 60
    const startY = 50

    for (let row = 0; row < pegRows; row++) {
      const pegsInRow = row + 3
      const startX = (canvas.width - (pegsInRow - 1) * pegSpacing) / 2
      
      for (let peg = 0; peg < pegsInRow; peg++) {
        const x = startX + peg * pegSpacing
        const y = startY + row * 40
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw bins at bottom
    const binWidth = 60
    const binHeight = 30
    const binsY = canvas.height - 50
    const binsStartX = (canvas.width - (multipliers.length * binWidth)) / 2

    multipliers.forEach((multiplier, index) => {
      const x = binsStartX + index * binWidth
      
      // Bin background
      ctx.fillStyle = colors.mediumGray + '20'
      ctx.fillRect(x, binsY, binWidth, binHeight)
      
      // Bin border
      ctx.strokeStyle = colors.mediumGray + '40'
      ctx.lineWidth = 2
      ctx.strokeRect(x, binsY, binWidth, binHeight)
      
      // Multiplier text
      ctx.fillStyle = colors.secondary
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${multiplier}x`, x + binWidth / 2, binsY + binHeight / 2 + 4)
    })

    // Draw ball if animating
    if (isAnimating) {
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.arc(canvas.width / 2, 30, 6, 0, Math.PI * 2)
      ctx.fill()
    }

  }, [isAnimating])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <RippleButton
            onClick={onBack}
            className="p-2 rounded-lg hover:scale-105 transition-transform"
            style={{
              backgroundColor: colors.mediumGray + '20',
              borderColor: colors.mediumGray + '40',
              borderWidth: '1px'
            }}
          >
            <ArrowLeft size={20} style={{ color: colors.mediumGray }} />
          </RippleButton>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
              Plinko
            </h1>
            <p className="text-sm" style={{ color: colors.mediumGray }}>
              Deixe a bola cair e ganhe prêmios incríveis
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div 
            className="px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '30'
            }}
          >
            <span className="text-sm" style={{ color: colors.mediumGray }}>Saldo: </span>
            <span className="font-bold" style={{ color: colors.secondary }}>
              ${balance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Game Canvas */}
        <div className="lg:col-span-3">
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.mediumGray + '05',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full max-w-2xl mx-auto rounded-lg border"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.mediumGray + '20'
              }}
            />
            
            {/* Multiplier Display */}
            <div className="mt-6">
              <div className="flex justify-center space-x-2">
                {multipliers.map((multiplier, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-center min-w-[60px]",
                      gameState.currentMultiplier === multiplier && "ring-2"
                    )}
                    style={{
                      backgroundColor: gameState.currentMultiplier === multiplier 
                        ? colors.accent + '20' 
                        : colors.mediumGray + '10',
                      borderColor: gameState.currentMultiplier === multiplier 
                        ? colors.accent + '40' 
                        : colors.mediumGray + '20',
                    }}
                  >
                    <span 
                      className="text-sm font-bold"
                      style={{ 
                        color: gameState.currentMultiplier === multiplier 
                          ? colors.accent 
                          : colors.mediumGray 
                      }}
                    >
                      {multiplier}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Bet Amount */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.secondary }}>
              Valor da Aposta
            </h3>
            <div className="space-y-4">
              <input
                type="number"
                value={gameState.betAmount}
                onChange={(e) => setGameState(prev => ({ ...prev, betAmount: Number(e.target.value) }))}
                disabled={gameState.isPlaying || isAnimating}
                className="w-full p-3 rounded-lg border text-center font-bold"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.mediumGray + '40',
                  color: colors.secondary
                }}
                placeholder="0.00"
              />
              <div className="grid grid-cols-2 gap-2">
                {[10, 50, 100, 500].map(amount => (
                  <RippleButton
                    key={amount}
                    onClick={() => setGameState(prev => ({ ...prev, betAmount: amount }))}
                    disabled={gameState.isPlaying || isAnimating}
                    className="py-2 rounded-lg border text-sm font-medium hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: colors.mediumGray + '20',
                      borderColor: colors.mediumGray + '40',
                      color: colors.mediumGray
                    }}
                  >
                    ${amount}
                  </RippleButton>
                ))}
              </div>
            </div>
          </div>

          {/* Balls Count */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.secondary }}>
              Número de Bolas
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 10, 100].map(count => (
                <RippleButton
                  key={count}
                  onClick={() => setGameState(prev => ({ ...prev, ballsCount: count }))}
                  disabled={gameState.isPlaying || isAnimating}
                  className={cn(
                    "py-2 rounded-lg border text-sm font-medium hover:scale-105 transition-transform",
                    gameState.ballsCount === count && "ring-2"
                  )}
                  style={{
                    backgroundColor: gameState.ballsCount === count 
                      ? colors.secondary + '20' 
                      : colors.mediumGray + '20',
                    borderColor: gameState.ballsCount === count 
                      ? colors.secondary + '40' 
                      : colors.mediumGray + '40',
                    color: gameState.ballsCount === count 
                      ? colors.secondary 
                      : colors.mediumGray,
                  }}
                >
                  {count}
                </RippleButton>
              ))}
            </div>
          </div>

          {/* Game Stats */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.secondary }}>
              Estatísticas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: colors.mediumGray }}>Último Multiplicador:</span>
                <span className="font-bold" style={{ color: colors.secondary }}>
                  {gameState.currentMultiplier}x
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mediumGray }}>Total Ganho:</span>
                <span className="font-bold" style={{ color: colors.accent }}>
                  ${gameState.totalWinnings.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mediumGray }}>Ganho Potencial:</span>
                <span className="font-bold" style={{ color: colors.accent }}>
                  ${(gameState.betAmount * 1.1).toFixed(2)} - ${(gameState.betAmount * 11).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <RippleButton
              onClick={startGame}
              disabled={gameState.betAmount <= 0 || gameState.betAmount > balance || isAnimating}
              className="w-full py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: colors.secondary,
                color: colors.primary
              }}
            >
              {isAnimating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                       style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}>
                  </div>
                  <span>Jogando...</span>
                </div>
              ) : (
                <>
                  <Play size={20} className="inline mr-2" />
                  Soltar Bola
                </>
              )}
            </RippleButton>

            <div className="grid grid-cols-2 gap-2">
              <RippleButton
                onClick={toggleAutoPlay}
                className={cn(
                  "py-2 rounded-lg font-medium hover:scale-105 transition-transform",
                  gameState.autoPlay && "ring-2"
                )}
                style={{
                  backgroundColor: gameState.autoPlay 
                    ? colors.accent + '20' 
                    : colors.mediumGray + '20',
                  borderColor: gameState.autoPlay 
                    ? colors.accent + '40' 
                    : colors.mediumGray + '40',
                  borderWidth: '1px',
                  color: gameState.autoPlay 
                    ? colors.accent 
                    : colors.mediumGray,
                }}
              >
                {gameState.autoPlay ? <Pause size={16} /> : <Play size={16} />}
                <span className="ml-1">Auto</span>
              </RippleButton>

              <RippleButton
                onClick={resetGame}
                className="py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.mediumGray + '20',
                  borderColor: colors.mediumGray + '40',
                  borderWidth: '1px',
                  color: colors.mediumGray
                }}
              >
                <RotateCcw size={16} />
                <span className="ml-1">Reset</span>
              </RippleButton>
            </div>
          </div>

          {/* Last Win Display */}
          {gameState.currentMultiplier > 0 && (
            <div 
              className="p-4 rounded-lg border text-center"
              style={{
                backgroundColor: colors.accent + '20',
                borderColor: colors.accent + '40'
              }}
            >
              <p className="font-bold text-lg" style={{ color: colors.accent }}>
                Último Ganho!
              </p>
              <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                {gameState.currentMultiplier}x - ${(gameState.betAmount * (gameState.currentMultiplier / 100)).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}