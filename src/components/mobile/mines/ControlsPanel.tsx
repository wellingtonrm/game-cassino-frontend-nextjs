'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/design-system'

interface ControlsPanelProps {
  betAmount: number
  balance: number
  isPlaying: boolean
  isLoading: boolean
  onBetAmountChange: (amount: number) => void
  onStartGame: () => void
  onCashOut: () => void
  onResetGame: () => void
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  betAmount,
  balance,
  isPlaying,
  isLoading,
  onBetAmountChange,
  onStartGame,
  onCashOut,
  onResetGame
}) => {
  const [inputValue, setInputValue] = useState(betAmount.toString())

  const handleInputChange = (value: string) => {
    setInputValue(value)
    const numValue = parseFloat(value) || 0
    onBetAmountChange(numValue)
  }

  const handleMultiplier = (multiplier: number) => {
    const newAmount = betAmount * multiplier
    const clampedAmount = Math.min(newAmount, balance)
    setInputValue(clampedAmount.toString())
    onBetAmountChange(clampedAmount)
  }

  const canAffordBet = betAmount > 0 && betAmount <= balance
  const isValidBet = betAmount >= 0.01 // Minimum bet

  return (
    <div 
      className="rounded-xl p-4 border-2 space-y-4"
      style={{
        backgroundColor: colors.mediumGray + '10',
        borderColor: colors.mediumGray + '40'
      }}
    >
      {/* Bet Amount Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: colors.mediumGray }}>Bet Amount</span>
          <span className="text-xs" style={{ color: colors.mediumGray }}>
            {balance.toFixed(8)} USDT
          </span>
        </div>
        
        {/* Input and Multiplier Buttons */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={balance}
              disabled={isPlaying || isLoading}
              className={cn(
                'w-full rounded-lg px-3 py-2.5 border-2',
                'text-white placeholder-gray-500 focus:outline-none',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.mediumGray + '40',
                color: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.secondary
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.mediumGray + '40'
              }}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs" style={{ color: colors.mediumGray }}>
              USDT
            </span>
          </div>
          
          {/* Multiplier Buttons */}
          <RippleButton
            onClick={() => handleMultiplier(0.5)}
            disabled={isPlaying || isLoading || betAmount <= 0}
            className={cn(
              'px-3 py-2.5 rounded-lg border-2',
              'text-white text-sm font-medium hover:opacity-80',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{
              backgroundColor: colors.mediumGray + '20',
              borderColor: colors.mediumGray + '40',
              color: colors.secondary
            }}
          >
            ½
          </RippleButton>
          
          <RippleButton
            onClick={() => handleMultiplier(2)}
            disabled={isPlaying || isLoading || betAmount <= 0}
            className={cn(
              'px-3 py-2.5 rounded-lg border-2',
              'text-white text-sm font-medium hover:opacity-80',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{
              backgroundColor: colors.mediumGray + '20',
              borderColor: colors.mediumGray + '40',
              color: colors.secondary
            }}
          >
            2x
          </RippleButton>
        </div>
      </div>

      {/* Main Action Button */}
      <RippleButton
        onClick={isPlaying ? onCashOut : onStartGame}
        disabled={isLoading || (!isPlaying && (!canAffordBet || !isValidBet))}
        className={cn(
          'w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80'
        )}
        style={{
          backgroundColor: isPlaying ? colors.danger : colors.accent,
          color: isPlaying ? 'white' : colors.primary
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : isPlaying ? (
          'Cash Out'
        ) : (
          'Bet'
        )}
      </RippleButton>

      {/* Validation Messages */}
      {!canAffordBet && betAmount > 0 && (
        <p className="text-xs text-[#fc036c] text-center">
          Insufficient balance
        </p>
      )}
      {!isValidBet && betAmount > 0 && (
        <p className="text-xs text-[#fc036c] text-center">
          Minimum bet is 0.01 USDT
        </p>
      )}
    </div>
  )
}

export default ControlsPanel