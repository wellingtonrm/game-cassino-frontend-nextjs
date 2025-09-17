'use client'

import { useEffect } from 'react'
import { setupWalletConnectErrorHandler, checkWalletConnectHealth } from '@/utils/walletConnectErrorHandler'

/**
 * Hook para corrigir problemas de event listeners do WalletConnect
 * Este hook garante que os event listeners sejam configurados corretamente
 */
export const useWalletConnectFix = () => {
  useEffect(() => {
    // Configura o handler de erros do WalletConnect
    const cleanup = setupWalletConnectErrorHandler()

    // Verifica a saúde do WalletConnect após inicialização
    const healthCheckTimeout = setTimeout(() => {
      const health = checkWalletConnectHealth()
      console.log('🔧 WalletConnect Health Check:', health)
    }, 1000)

    // Aguarda a inicialização completa do DOM
    const initializeWalletConnect = () => {
      // Verifica se o WalletConnect está disponível globalmente
      if (typeof window !== 'undefined') {
        // Adiciona um listener global para capturar eventos do WalletConnect
        const handleWalletConnectEvent = (event: any) => {
          if (event.type && event.type.includes('session_request')) {
            console.log('WalletConnect session_request capturado:', event)
            // Aqui você pode adicionar lógica adicional se necessário
          }
        }

        // Adiciona listener para eventos customizados do WalletConnect
        window.addEventListener('walletconnect_session_request', handleWalletConnectEvent)
        
        // Cleanup function
        return () => {
          window.removeEventListener('walletconnect_session_request', handleWalletConnectEvent)
        }
      }
    }

    // Executa após um pequeno delay para garantir que tudo foi inicializado
    const timeoutId = setTimeout(initializeWalletConnect, 100)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(healthCheckTimeout)
      if (cleanup) cleanup()
    }
  }, [])
}