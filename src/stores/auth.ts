import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setToken: (token: string) => void
}

// Função para gerenciar cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
  }
}

const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        setCookie('auth-token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        deleteCookie('auth-token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      setToken: (token) => {
        setCookie('auth-token', token)
        set({ token, isAuthenticated: true })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)