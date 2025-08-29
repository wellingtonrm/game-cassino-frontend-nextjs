import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { isUnauthorizedResponse, handleUnauthorizedError } from '../utils/auth-error-handler';
import { CookieManager } from '@/lib/cookies';

/**
 * Configura interceptores para o Axios para tratar automaticamente respostas 401
 * @param axiosInstance Instância do Axios para configurar
 * @returns A mesma instância do Axios com os interceptores configurados
 */
export const setupAxiosInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  // Interceptor de requisição para adicionar token de autenticação
  axiosInstance.interceptors.request.use(
    (config) => {
      // Obter token dos cookies (no navegador)
      const token = CookieManager.getClientCookie("auth-token");

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
    baseURL: process.env.API_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return setupAxiosInterceptors(instance);
};

// Exportar uma instância padrão já configurada
export const api = createAxiosWithInterceptors();
