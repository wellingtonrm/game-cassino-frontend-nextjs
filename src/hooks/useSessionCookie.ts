'use client'

import { useEffect, useCallback } from 'react'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import { Web3Session } from '@/types'

const COOKIE_NAME = 'web3-wallet-session'
const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

/**
 * Hook para gerenciar sessão Web3 via cookies
 * Salva dados da carteira conectada de forma segura
 */
export const useSessionCookie = () => {
  // Salva sessão Web3 no cookie
  const saveSession = useCallback((session: Web3Session) => {
    try {
      const sessionData = {
        ...session,
        savedAt: Date.now(),
      }
      
      setCookie(COOKIE_NAME, JSON.stringify(sessionData), COOKIE_OPTIONS)
      
      console.log('Sessão Web3 salva:', {
        address: session.address,
        chainId: session.chainId,
        connector: session.connector,
        timestamp: new Date(session.connectedAt).toISOString(),
      })
    } catch (error) {
      console.error('Erro ao salvar sessão Web3:', error)
    }
  }, [])

  // Carrega sessão Web3 do cookie
  const loadSession = useCallback((): Web3Session | null => {
    try {
      const cookieValue = getCookie(COOKIE_NAME)
      
      if (!cookieValue || typeof cookieValue !== 'string') {
        return null
      }

      const sessionData = JSON.parse(cookieValue) as Web3Session & { savedAt?: number }
      
      // Verifica se a sessão não está muito antiga (7 dias)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      if (sessionData.savedAt && sessionData.savedAt < sevenDaysAgo) {
        clearSession()
        return null
      }

      return {
        address: sessionData.address,
        chainId: sessionData.chainId,
        maticBalance: sessionData.maticBalance,
        usdtBalance: sessionData.usdtBalance,
        connectedAt: sessionData.connectedAt,
        lastUpdated: sessionData.lastUpdated,
        connector: sessionData.connector,
      }
    } catch (error) {
      console.error('Erro ao carregar sessão Web3:', error)
      clearSession() // Remove cookie corrompido
      return null
    }
  }, [])

  // Remove sessão Web3 do cookie
  const clearSession = useCallback(() => {
    try {
      deleteCookie(COOKIE_NAME, { path: '/' })
      console.log('Sessão Web3 removida')
    } catch (error) {
      console.error('Erro ao remover sessão Web3:', error)
    }
  }, [])

  // Atualiza apenas os saldos na sessão existente
  const updateSessionBalances = useCallback((maticBalance: string, usdtBalance: string) => {
    const currentSession = loadSession()
    
    if (currentSession) {
      const updatedSession: Web3Session = {
        ...currentSession,
        maticBalance,
        usdtBalance,
        lastUpdated: Date.now(),
      }
      
      saveSession(updatedSession)
    }
  }, [loadSession, saveSession])

  // Verifica se existe uma sessão válida
  const hasValidSession = useCallback((): boolean => {
    const session = loadSession()
    return session !== null && !!session.address
  }, [loadSession])

  // Obtém informações básicas da sessão sem carregá-la completamente
  const getSessionInfo = useCallback(() => {
    const session = loadSession()
    
    if (!session) {
      return null
    }

    return {
      address: session.address,
      chainId: session.chainId,
      connector: session.connector,
      isRecent: (Date.now() - session.lastUpdated) < (60 * 60 * 1000), // Menos de 1 hora
      connectedDuration: Date.now() - session.connectedAt,
    }
  }, [loadSession])

  // Valida integridade da sessão
  const validateSession = useCallback((address?: string, chainId?: number): boolean => {
    const session = loadSession()
    
    if (!session) return false
    
    // Verifica se endereço coincide (se fornecido)
    if (address && session.address.toLowerCase() !== address.toLowerCase()) {
      clearSession()
      return false
    }
    
    // Verifica se rede coincide (se fornecida)
    if (chainId && session.chainId !== chainId) {
      // Atualiza apenas o chainId se endereço for o mesmo
      if (address && session.address.toLowerCase() === address.toLowerCase()) {
        const updatedSession = { ...session, chainId, lastUpdated: Date.now() }
        saveSession(updatedSession)
        return true
      } else {
        clearSession()
        return false
      }
    }
    
    return true
  }, [loadSession, clearSession, saveSession])

  return {
    // Funções principais
    saveSession,
    loadSession,
    clearSession,
    
    // Funções de atualização
    updateSessionBalances,
    
    // Funções de verificação
    hasValidSession,
    validateSession,
    getSessionInfo,
    
    // Utilitários
    cookieName: COOKIE_NAME,
    cookieOptions: COOKIE_OPTIONS,
  }
}