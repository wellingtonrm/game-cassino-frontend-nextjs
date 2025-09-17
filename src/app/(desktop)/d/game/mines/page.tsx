'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Target, Bomb, Gem, DollarSign } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import BetAmount from '@/components/mines/BetAmount'
import MinesSelector from '@/components/mines/MinesSelector'
import GameBoard from '@/components/mines/GameBoard'
import Sidebar from '@/components/desktop/layout/Sidebar'
import TopBar from '@/components/desktop/layout/TopBar'

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
    const [activeTab, setActiveTab] = useState('home')
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
              <GameBoard
                board={gameState.board}
                onCellClick={() => { }}
                isPlaying={gameState.isPlaying}
                gameOver={gameState.gameOver}
              />

              {/* Controls Panel */}
              <BetAmount
                betAmount={gameState.betAmount}
                balance={0}
                isPlaying={gameState.isPlaying}
                isLoading={false}
                onBetAmountChange={(amount) =>
                  setGameState(prev => ({ ...prev, betAmount: amount }))
                }
                onStartGame={startGame}
                onCashOut={() => { }}
                onResetGame={resetGame}
              />

              {/* Mines Selector */}
              <MinesSelector
                minesCount={gameState.minesCount}
                gameMode={gameState.gameMode}
                isPlaying={gameState.isPlaying}
                onMinesCountChange={(count) =>
                  setGameState(prev => ({ ...prev, minesCount: count }))
                }
                onGameModeChange={(mode) =>
                  setGameState(prev => ({ ...prev, gameMode: mode }))
                }
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}