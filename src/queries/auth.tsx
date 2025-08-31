"use client"

import { useMutation, useQuery } from '@tanstack/react-query'
import { AuthResponse, LoginCredentials, User } from '@/types'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Auth API functions
const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    if (!response.ok) {
      throw new Error('Falha na autenticação')
    }
    
    return response.json()
  },
  
  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Falha ao buscar perfil')
    }
    
    return response.json()
  },
}

// React Query hooks
export const useLogin = () => {
  const { login } = useAuthStore()
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.token)
    },
  })
}

export const useProfile = () => {
  const { token, isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(token!),
    enabled: isAuthenticated && !!token,
  })
}