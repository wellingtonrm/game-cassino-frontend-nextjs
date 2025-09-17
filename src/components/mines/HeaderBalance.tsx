'use client'

import React from 'react'
import { ArrowLeft, Wallet } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { cn } from '@/lib/utils'

interface HeaderBalanceProps {
  balance: number
  onBack: () => void
}

const HeaderBalance: React.FC<HeaderBalanceProps> = ({
  balance,
  onBack
}) => {
  return (
    <header className="bg-[#1b1020] border-b border-[#2A3050] p-4">
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <RippleButton
          onClick={onBack}
          className="p-2 rounded-lg bg-[#2A3050] hover:bg-[#2A3050]/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </RippleButton>

        {/* Game Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-white">Mines</h1>
          <p className="text-xs text-gray-400">Stake Originals</p>
        </div>

        {/* Balance Display */}
        <div className="flex items-center space-x-2 bg-[#0f0b12] rounded-lg px-3 py-2 border border-[#2A3050]">
          <Wallet className="w-4 h-4 text-[#fdbf5c]" />
          <div className="text-right">
            <p className="text-sm font-semibold text-white">
              {balance.toFixed(8)}
            </p>
            <p className="text-xs text-gray-400">USDT</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderBalance