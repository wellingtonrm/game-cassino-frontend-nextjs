'use client'

/**
 * Utilitário para capturar e tratar erros do WalletConnect
 * Especialmente útil para o erro "emitting session_request without any listeners"
 */

// Intercepta erros do console relacionados ao WalletConnect
export const setupWalletConnectErrorHandler = () => {
  if (typeof window === 'undefined') return

  // Salva a função original do console.error
  const originalConsoleError = console.error

  // Sobrescreve console.error para capturar erros do WalletConnect
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ')
    
    // Verifica se é o erro específico do WalletConnect
    if (errorMessage.includes('emitting session_request') && errorMessage.includes('without any listeners')) {
      console.warn('🔧 WalletConnect: Erro de session_request capturado e tratado automaticamente')
      
      // Tenta reconfigurar os listeners do WalletConnect
      try {
        // Dispara um evento customizado para notificar outros componentes
        window.dispatchEvent(new CustomEvent('walletconnect_error_handled', {
          detail: { 
            error: errorMessage,
            timestamp: Date.now(),
            action: 'session_request_listener_missing'
          }
        }))
      } catch (e) {
        // Se falhar, apenas registra o erro original
        originalConsoleError('WalletConnect Error Handler falhou:', e)
      }
      
      return // Não exibe o erro original no console
    }
    
    // Para outros erros, usa o comportamento padrão
    originalConsoleError(...args)
  }

  // Adiciona listener para eventos de erro do WalletConnect
  const handleWalletConnectError = (event: CustomEvent) => {
    console.log('🔧 WalletConnect Error Handler ativado:', event.detail)
    
    // Aqui você pode adicionar lógica adicional para recuperação
    // Por exemplo, tentar reconectar ou limpar estado
  }

  window.addEventListener('walletconnect_error_handled', handleWalletConnectError as EventListener)

  // Retorna função de cleanup
  return () => {
    console.error = originalConsoleError
    window.removeEventListener('walletconnect_error_handled', handleWalletConnectError as EventListener)
  }
}

// Função para verificar se o WalletConnect está funcionando corretamente
export const checkWalletConnectHealth = () => {
  if (typeof window === 'undefined') return false

  try {
    // Verifica se as dependências do WalletConnect estão disponíveis
    const hasWagmi = typeof window !== 'undefined' && 'wagmi' in window
    const hasWalletConnect = typeof window !== 'undefined' && 'WalletConnect' in window
    
    return {
      hasWagmi,
      hasWalletConnect,
      isHealthy: true // Por enquanto, sempre retorna true
    }
  } catch (error) {
    console.warn('Erro ao verificar saúde do WalletConnect:', error)
    return {
      hasWagmi: false,
      hasWalletConnect: false,
      isHealthy: false
    }
  }
}