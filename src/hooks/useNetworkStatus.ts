'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to monitor network connectivity status
 * Helps handle connection interruptions gracefully
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'reconnecting'>('online')

  useEffect(() => {
    // Check initial connection status
    setIsOnline(navigator.onLine)
    setConnectionStatus(navigator.onLine ? 'online' : 'offline')

    // Event listeners for connection status changes
    const handleOnline = () => {
      setIsOnline(true)
      setConnectionStatus('reconnecting')
      
      // After a short delay, mark as online
      setTimeout(() => {
        setConnectionStatus('online')
      }, 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setConnectionStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    isOnline,
    connectionStatus,
    isReconnecting: connectionStatus === 'reconnecting'
  }
}