'use client'

import React from 'react'
import { Settings, BarChart3, Shield, ChevronLeft } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { cn } from '@/lib/utils'

const FooterNav: React.FC = () => {
  return (
    <footer className="bg-[#1b1020] border-t border-[#2A3050] p-4">
      <div className="flex items-center justify-between">
        {/* Navigation Icons */}
        <div className="flex items-center space-x-4">
          <RippleButton
            className="p-2 rounded-lg hover:bg-[#2A3050]/50 transition-colors"
            onClick={() => console.log('Settings clicked')}
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </RippleButton>
          
          <RippleButton
            className="p-2 rounded-lg hover:bg-[#2A3050]/50 transition-colors"
            onClick={() => console.log('Statistics clicked')}
          >
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </RippleButton>
          
          <RippleButton
            className="p-2 rounded-lg hover:bg-[#2A3050]/50 transition-colors"
            onClick={() => console.log('Security clicked')}
          >
            <Shield className="w-5 h-5 text-gray-400" />
          </RippleButton>
        </div>

        {/* Fairness Section */}
        <RippleButton
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#2A3050]/50 transition-colors"
          onClick={() => console.log('Fairness clicked')}
        >
          <span className="text-sm text-gray-400">Fairness</span>
          <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
        </RippleButton>
      </div>

      {/* Game Info */}
      <div className="mt-3 pt-3 border-t border-[#2A3050]/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Mines • Stake Originals</span>
          <span>Provably Fair</span>
        </div>
      </div>
    </footer>
  )
}

export default FooterNav