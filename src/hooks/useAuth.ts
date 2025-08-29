import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { useLogin } from '@/queries/auth'
import { LoginCredentials } from '@/types'

export const useAuth = () => {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const loginMutation = useLogin()

  const login = async (credentials: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(credentials)
      router.push('/wallet')
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push('/auth')
      return false
    }
    return true
  }

  return {
    user,
    isAuthenticated,
    login,
    logout: handleLogout,
    requireAuth,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  }
}