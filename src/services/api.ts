import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { AuthCookies } from '@/lib/cookies';
import { logout } from '@/lib/logout';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Manipula erros de autorização fazendo logout do usuário
 */
const handleUnauthorizedError = (): void => {
  logout();
};


/**
 * Configura interceptadores para uma instância do Axios
 */
const setupAxiosInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  // Interceptor de requisição para adicionar token de autenticação
  axiosInstance.interceptors.request.use(
    (config) => {
      // Obter token dos cookies usando AuthCookies
      const accessToken = AuthCookies.getAccessToken();

      // Adicionar token ao header de autorização se existir
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta para lidar com erros de autenticação
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      
      // Se erro é 401 e ainda não tentamos atualizar o token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = AuthCookies.getRefreshToken();
          
          // Se não temos refresh token, faz logout
          if (!refreshToken) {
            handleUnauthorizedError();
            return Promise.reject(error);
          }
          
          // Tenta atualizar o token
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken } = refreshResponse.data;
          
          // Refaz a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Se falhar em atualizar, faz logout
          handleUnauthorizedError();
          return Promise.reject(refreshError);
        }
      }
      
      // Para outros erros 401, redireciona para login
      if (error.response?.status === 401) {
        handleUnauthorizedError();
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

/**
 * Cria uma instância do Axios com interceptadores configurados
 */
const createAxiosWithInterceptors = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return setupAxiosInterceptors(instance);
};

// Exportar uma instância padrão já configurada
export const api = createAxiosWithInterceptors();
export default api;