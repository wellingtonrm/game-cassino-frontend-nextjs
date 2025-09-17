'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Target, Bomb, Gem, DollarSign } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'

// Estados das células
export type CellState = 'closed' | 'safe' | 'mine' | 'revealed'

// Interface do estado do jogo
interface GameState {
  board: CellState[][]
  isPlaying: boolean
  gameOver: boolean
  won: boolean
  betAmount: number
  minesCount: number
  revealedCount: number
  multiplier: number
  gameMode: 'manual' | 'auto'
}

// Estado inicial do jogo
const initialGameState: GameState = {
  board: Array(5).fill(null).map(() => Array(5).fill('closed')),
  isPlaying: false,
  gameOver: false,
  won: false,
  betAmount: 0,
  minesCount: 14,
  revealedCount: 0,
  multiplier: 1,
  gameMode: 'manual'
}

interface MinesGameProps {
  onBack?: () => void
}

export default function MinesGame({ onBack }: MinesGameProps) {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [balance] = useState(1000) // Mock balance

  // Função para obter cores das células
  const getCellColors = (cellState: CellState) => {
    switch (cellState) {
      case 'closed':
        return {
          backgroundColor: colors.mediumGray + '20',
          borderColor: colors.mediumGray + '40',
          color: colors.secondary
        }
      case 'safe':
        return {
          backgroundColor: '#00ff66' + '20',
          borderColor: '#00ff66',
          color: '#00ff66'
        }
      case 'mine':
        return {
          backgroundColor: colors.danger + '20',
          borderColor: colors.danger,
          color: colors.danger
        }
      case 'revealed':
        return {
          backgroundColor: colors.accent + '20',
          borderColor: colors.accent,
          color: colors.secondary
        }
      default:
        return {
          backgroundColor: colors.mediumGray + '20',
          borderColor: colors.mediumGray + '40',
          color: colors.secondary
        }
    }
  }

  // Função para revelar célula
  const revealCell = (row: number, col: number) => {
    if (!gameState.isPlaying || gameState.gameOver) return
    
    const newBoard = [...gameState.board]
    if (newBoard[row][col] !== 'closed') return

    // Simular lógica do jogo (aqui seria a lógica real)
    const isMine = Math.random() < 0.1 // 10% chance de mina
    
    if (isMine) {
      newBoard[row][col] = 'mine'
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameOver: true,
        won: false
      }))
    } else {
      newBoard[row][col] = 'safe'
      const newRevealedCount = gameState.revealedCount + 1
      const newMultiplier = 1 + (newRevealedCount * 0.1)
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        revealedCount: newRevealedCount,
        multiplier: newMultiplier
      }))
    }
  }

  // Função para iniciar jogo
  const startGame = () => {
    if (gameState.betAmount <= 0 || gameState.betAmount > balance) return
    
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameOver: false,
      won: false,
      board: Array(5).fill(null).map(() => Array(5).fill('closed')),
      revealedCount: 0,
      multiplier: 1
    }))
  }

  // Função para cash out
  const cashOut = () => {
    if (!gameState.isPlaying || gameState.gameOver) return
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameOver: true,
      won: true
    }))
  }

  // Função para resetar jogo
  const resetGame = () => {
    setGameState(initialGameState)
  }

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
              Mines
            </h1>
            <p className="text-sm" style={{ color: colors.mediumGray }}>
              Encontre os diamantes e evite as minas
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Board */}
        <div className="lg:col-span-2">
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.mediumGray + '05',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
              {gameState.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const cellColors = getCellColors(cell)
                  return (
                    <RippleButton
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => revealCell(rowIndex, colIndex)}
                      disabled={!gameState.isPlaying || gameState.gameOver}
                      className={cn(
                        "aspect-square rounded-lg border-2 flex items-center justify-center",
                        "hover:scale-105 transition-all duration-200",
                        "disabled:cursor-not-allowed disabled:hover:scale-100"
                      )}
                      style={{
                        backgroundColor: cellColors.backgroundColor,
                        borderColor: cellColors.borderColor
                      }}
                    >
                      {cell === 'safe' && <Gem size={20} style={{ color: cellColors.color }} />}
                      {cell === 'mine' && <Bomb size={20} style={{ color: cellColors.color }} />}
                      {cell === 'closed' && (
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cellColors.color + '40' }}
                        />
                      )}
                    </RippleButton>
                  )
                })
              )}
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
                disabled={gameState.isPlaying}
                className="w-full p-3 rounded-lg border text-center font-bold"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.mediumGray + '40',
                  color: colors.secondary
                }}
                placeholder="0.00"
              />
              <div className="grid grid-cols-3 gap-2">
                {[10, 50, 100].map(amount => (
                  <RippleButton
                    key={amount}
                    onClick={() => setGameState(prev => ({ ...prev, betAmount: amount }))}
                    disabled={gameState.isPlaying}
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

          {/* Mines Count */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.secondary }}>
              Número de Minas
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map(count => (
                <RippleButton
                  key={count}
                  onClick={() => setGameState(prev => ({ ...prev, minesCount: count }))}
                  disabled={gameState.isPlaying}
                  className={cn(
                    "py-2 rounded-lg border text-sm font-medium hover:scale-105 transition-transform",
                    gameState.minesCount === count && "ring-2"
                  )}
                  style={{
                    backgroundColor: gameState.minesCount === count 
                      ? colors.secondary + '20' 
                      : colors.mediumGray + '20',
                    borderColor: gameState.minesCount === count 
                      ? colors.secondary + '40' 
                      : colors.mediumGray + '40',
                    color: gameState.minesCount === count 
                      ? colors.secondary 
                      : colors.mediumGray
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
                <span style={{ color: colors.mediumGray }}>Multiplicador:</span>
                <span className="font-bold" style={{ color: colors.secondary }}>
                  {gameState.multiplier.toFixed(2)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mediumGray }}>Células Reveladas:</span>
                <span className="font-bold" style={{ color: colors.secondary }}>
                  {gameState.revealedCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mediumGray }}>Ganho Potencial:</span>
                <span className="font-bold" style={{ color: colors.accent }}>
                  ${(gameState.betAmount * gameState.multiplier).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!gameState.isPlaying ? (
              <RippleButton
                onClick={startGame}
                disabled={gameState.betAmount <= 0 || gameState.betAmount > balance}
                className="w-full py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary
                }}
              >
                Iniciar Jogo
              </RippleButton>
            ) : (
              <div className="space-y-2">
                <RippleButton
                  onClick={cashOut}
                  disabled={gameState.gameOver || gameState.revealedCount === 0}
                  className="w-full py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.primary
                  }}
                >
                  Cash Out - ${(gameState.betAmount * gameState.multiplier).toFixed(2)}
                </RippleButton>
                
                <RippleButton
                  onClick={resetGame}
                  className="w-full py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: colors.mediumGray + '20',
                    borderColor: colors.mediumGray + '40',
                    borderWidth: '1px',
                    color: colors.mediumGray
                  }}
                >
                  Resetar Jogo
                </RippleButton>
              </div>
            )}
          </div>

          {/* Game Status */}
          {gameState.gameOver && (
            <div 
              className="p-4 rounded-lg border text-center"
              style={{
                backgroundColor: gameState.won 
                  ? colors.accent + '20' 
                  : colors.danger + '20',
                borderColor: gameState.won 
                  ? colors.accent + '40' 
                  : colors.danger + '40'
              }}
            >
              <p className="font-bold text-lg" style={{ 
                color: gameState.won ? colors.accent : colors.danger 
              }}>
                {gameState.won ? 'Você Ganhou!' : 'Game Over!'}
              </p>
              {gameState.won && (
                <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                  Ganho: ${(gameState.betAmount * gameState.multiplier).toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}