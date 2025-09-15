'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'

// Estados das células
export type CellState = 'closed' | 'safe' | 'mine' | 'revealed'

interface GameBoardProps {
  board: CellState[][]
  onCellClick: (row: number, col: number) => void
  isPlaying: boolean
  gameOver: boolean
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  isPlaying,
  gameOver
}) => {
  const getCellStyle = (cellState: CellState) => {
    const baseStyle = 'transition-all duration-200'
    switch (cellState) {
      case 'closed':
        return `${baseStyle} border-2`
      case 'safe':
        return `${baseStyle} border-2 text-green-400`
      case 'mine':
        return `${baseStyle} border-2`
      case 'revealed':
        return `${baseStyle} border-2`
      default:
        return `${baseStyle} border-2`
    }
  }

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

  const getCellContent = (cellState: CellState) => {
    switch (cellState) {
      case 'safe':
        return '💎'
      case 'mine':
        return '💣'
      default:
        return ''
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        className="grid grid-cols-5 gap-2 p-4 rounded-xl border-2"
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.mediumGray + '40'
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellColors = getCellColors(cell)
            return (
              <RippleButton
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'aspect-square w-full h-12 rounded-lg',
                  'flex items-center justify-center text-lg font-bold',
                  'disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80',
                  getCellStyle(cell)
                )}
                style={cellColors}
                onClick={() => onCellClick(rowIndex, colIndex)}
                disabled={!isPlaying || gameOver || cell !== 'closed'}
              >
                {getCellContent(cell)}
              </RippleButton>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GameBoard