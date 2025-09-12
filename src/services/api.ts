import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Verifica se a resposta tem o formato de erro não autorizado
 */
const isUnauthorizedResponse = (data: any): data is { code: number; success: boolean; message?: string } => {
  return data && typeof data === 'object' && 'code' in data && 'success' in data && data.code === 401;
};

/**
 * Trata o erro 401 redirecionando para a página de login
 */
const handleUnauthorizedError = () => {
  // Limpar dados de autenticação do estado
  const { logout } = useAuthStore.getState();
  logout();
  
  // Redirecionar para página de login (no cliente)
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
};

/**
 * Configura interceptadores para o Axios para tratar automaticamente respostas 401
 * @param axiosInstance Instância do Axios para configurar
 * @returns A mesma instância do Axios com os interceptores configurados
 */
export const setupAxiosInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  // Interceptor de requisição para adicionar token de autenticação
  axiosInstance.interceptors.request.use(
    (config) => {
      // Obter token dos cookies (no navegador)
      const token = getCookie("auth-token");

      // Adicionar token ao header de autorização se existir
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta
  axiosInstance.interceptors.response.use(
    // Caso de sucesso
    (response: AxiosResponse) => {
      return response;
    },
    // Caso de erro
    (error: AxiosError) => {
      // Verificar se é erro 401
      if (error.response?.status === 401) {
        const responseData = error.response.data;

        // Verificar se a resposta tem o formato esperado e tratar
        if (isUnauthorizedResponse(responseData)) {
          handleUnauthorizedError();
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

/**
 * Cria uma instância do Axios com interceptores configurados
 */
export const createAxiosWithInterceptors = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return setupAxiosInterceptors(instance);
};

// Exportar uma instância padrão já configurada
export const api = createAxiosWithInterceptors();