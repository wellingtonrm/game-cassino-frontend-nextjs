'use client'

import React from 'react'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'loading' | 'warning'

interface TxStatusToastProps {
  type: ToastType
  message: string
  isVisible: boolean
  onClose?: () => void
}

const TxStatusToast: React.FC<TxStatusToastProps> = ({
  type,
  message,
  isVisible,
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#00ff66]" />
      case 'error':
        return <XCircle className="w-5 h-5 text-[#fc036c]" />
      case 'loading':
        return <Loader2 className="w-5 h-5 text-[#fdbf5c] animate-spin" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#fdbf5c]" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#00ff66]/10 border-[#00ff66]/30'
      case 'error':
        return 'bg-[#fc036c]/10 border-[#fc036c]/30'
      case 'loading':
        return 'bg-[#fdbf5c]/10 border-[#fdbf5c]/30'
      case 'warning':
        return 'bg-[#fdbf5c]/10 border-[#fdbf5c]/30'
      default:
        return 'bg-[#1b1020] border-[#2A3050]'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className={cn(
        'flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-sm',
        getBackgroundColor()
      )}>
        {getIcon()}
        <p className="flex-1 text-sm text-white font-medium">{message}</p>
        {onClose && type !== 'loading' && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TxStatusToast