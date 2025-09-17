'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/design-system'

interface MinesSelectorProps {
  minesCount: number
  gameMode: 'manual' | 'auto'
  isPlaying: boolean
  onMinesCountChange: (count: number) => void
  onGameModeChange: (mode: 'manual' | 'auto') => void
}

const MinesSelector: React.FC<MinesSelectorProps> = ({
  minesCount,
  gameMode,
  isPlaying,
  onMinesCountChange,
  onGameModeChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Opções de minas (1-24)
  const minesOptions = Array.from({ length: 24 }, (_, i) => i + 1)

  const handleMinesSelect = (count: number) => {
    onMinesCountChange(count)
    setIsDropdownOpen(false)
  }

  // Calcular multiplicador baseado no número de minas
  const calculateMultiplier = (mines: number) => {
    const safeCells = 25 - mines
    return (25 / safeCells).toFixed(2)
  }

  return (
    <div 
      className="rounded-xl p-4 border-2 space-y-4"
      style={{
        backgroundColor: colors.mediumGray + '10',
        borderColor: colors.mediumGray + '40'
      }}
    >
      {/* Mines Selector */}
      <div className="space-y-2">
        <label className="text-sm" style={{ color: colors.mediumGray }}>Mines</label>
        <div className="relative">
          <RippleButton
            onClick={() => !isPlaying && setIsDropdownOpen(!isDropdownOpen)}
            disabled={isPlaying}
            className={cn(
              'w-full rounded-lg px-3 py-2.5 border-2',
              'flex items-center justify-between text-white',
              'hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.mediumGray + '40'
            }}
          >
            <div className="flex items-center space-x-2">
              <span>{minesCount}</span>
              <span className="text-xs" style={{ color: colors.mediumGray }}>
                (x{calculateMultiplier(minesCount)})
              </span>
            </div>
            <ChevronDown 
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isDropdownOpen && 'rotate-180'
              )} 
            />
          </RippleButton>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50">
              <div 
                className="rounded-lg max-h-48 overflow-y-auto border-2"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.mediumGray + '40'
                }}
              >
                {minesOptions.map((count) => (
                  <RippleButton
                    key={count}
                    onClick={() => handleMinesSelect(count)}
                    className={cn(
                      'w-full px-3 py-2 text-left hover:opacity-80 transition-colors',
                      'flex items-center justify-between'
                    )}
                    style={{
                      backgroundColor: count === minesCount ? colors.secondary + '20' : 'transparent',
                      color: count === minesCount ? colors.secondary : 'white'
                    }}
                  >
                    <span>{count} mines</span>
                    <span className="text-xs" style={{ color: colors.mediumGray }}>
                      x{calculateMultiplier(count)}
                    </span>
                  </RippleButton>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Mode Toggle */}
      <div className="space-y-2">
        <label className="text-sm" style={{ color: colors.mediumGray }}>Game Mode</label>
        <div className="flex space-x-2">
          <RippleButton
            onClick={() => !isPlaying && onGameModeChange('manual')}
            disabled={isPlaying}
            className={cn(
              'flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 border-2',
              'disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
            )}
            style={{
              backgroundColor: gameMode === 'manual' ? colors.secondary + '20' : colors.mediumGray + '20',
              color: gameMode === 'manual' ? colors.secondary : colors.mediumGray,
              borderColor: gameMode === 'manual' ? colors.secondary + '40' : colors.mediumGray + '40'
            }}
          >
            Manual
          </RippleButton>
          
          <RippleButton
            onClick={() => !isPlaying && onGameModeChange('auto')}
            disabled={isPlaying}
            className={cn(
              'flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 border-2',
              'disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
            )}
            style={{
              backgroundColor: gameMode === 'auto' ? colors.secondary + '20' : colors.mediumGray + '20',
              color: gameMode === 'auto' ? colors.secondary : colors.mediumGray,
              borderColor: gameMode === 'auto' ? colors.secondary + '40' : colors.mediumGray + '40'
            }}
          >
            Auto
          </RippleButton>
        </div>
      </div>

      {/* Game Info */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Safe cells: {25 - minesCount}</span>
        <span>Win chance: {((25 - minesCount) / 25 * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}

export default MinesSelector