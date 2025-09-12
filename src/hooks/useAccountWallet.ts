'use client'

import { useCallback } from 'react'
import { getCookie } from 'cookies-next'

// Nome do cookie usado para armazenar a sessão da carteira
const WALLET_SESSION_COOKIE_NAME = 'web3-wallet-session'

/**
 * Hook para verificar a existência da sessão da carteira
 * Verifica se o usuário tem uma sessão de carteira ativa armazenada em cookies
 */
export const useAccountWallet = () => {
  /**
   * Verifica se existe uma sessão de carteira válida
   * @returns true se existir uma sessão válida, false caso contrário
   */
  const hasWalletSession = useCallback((): boolean => {
    try {
      const sessionCookie = getCookie(WALLET_SESSION_COOKIE_NAME)
      
      // Verifica se o cookie existe e não está vazio
      if (!sessionCookie || typeof sessionCookie !== 'string') {
        return false
      }
      
      // Tenta parsear o cookie para verificar se é um JSON válido
      const sessionData = JSON.parse(sessionCookie)
      
      // Verifica se contém os dados essenciais de uma sessão
      return !!(
        sessionData &&
        sessionData.address &&
        typeof sessionData.address === 'string' &&
        sessionData.address.length > 0
      )
    } catch (error) {
      // Se houver erro ao parsear ou verificar, considera que não há sessão válida
      console.debug('Erro ao verificar sessão da carteira:', error)
      return false
    }
  }, [])

  /**
   * Obtém os dados da sessão da carteira se existir
   * @returns Dados da sessão ou null se não existir sessão válida
   */
  const getWalletSession = useCallback((): any => {
    try {
      const sessionCookie = getCookie(WALLET_SESSION_COOKIE_NAME)
      
      if (!sessionCookie || typeof sessionCookie !== 'string') {
        return null
      }
      
      const sessionData = JSON.parse(sessionCookie)
      
      // Verifica se é uma sessão válida
      if (sessionData && sessionData.address) {
        return sessionData
      }
      
      return null
    } catch (error) {
      console.debug('Erro ao obter dados da sessão da carteira:', error)
      return null
    }
  }, [])

  return {
    hasWalletSession,
    getWalletSession,
    cookieName: WALLET_SESSION_COOKIE_NAME
  }
}