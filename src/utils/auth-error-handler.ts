import { UnauthorizedResponse } from '@/types';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

/**
 * Verifica se a resposta da API é um erro 401 (não autorizado)
 * @param response Resposta da API
 * @returns true se for um erro 401, false caso contrário
 */
export const isUnauthorizedResponse = (response: unknown): response is UnauthorizedResponse => {
  if (!response || typeof response !== 'object' || response === null) {
    return false;
  }
  
  const obj = response as Record<string, unknown>;
  return 'code' in obj && 'success' in obj && 
    obj.code === 401 && obj.success === false;
};

/**
 * Função para tratar erro de autorização (para uso fora de componentes React)
 */
export const handleUnauthorizedError = (): void => {
  // Remover cookies de autenticação
  deleteCookie('token');
  deleteCookie('refreshToken');
  deleteCookie('user');
  deleteCookie('accessToken');
  deleteCookie('account');

  // Redirecionar para a página de login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Hook para tratar erros de autorização
 * Efetua logout automático quando recebe resposta 401
 */
export const useAuthErrorHandler = () => {
  const router = useRouter();

  /**
   * Trata a resposta da API e efetua logout se for erro 401
   * @param response Resposta da API
   * @returns A mesma resposta para encadeamento
   */
  const handleApiResponse = <T>(response: T | UnauthorizedResponse): T | UnauthorizedResponse => {
    if (isUnauthorizedResponse(response)) {
      // Efetuar logout
      handleLogout();
      return response;
    }
    return response as T;
  };

  /**
   * Efetua logout e redireciona para a página de login
   */
  const handleLogout = () => {
    // Remover cookies de autenticação
    deleteCookie('token');
    deleteCookie('refreshToken');
    deleteCookie('user');

    // Redirecionar para a página de login
    router.push('/login');
  };

  return {
    handleApiResponse,
    handleLogout,
    isUnauthorizedResponse
  };
};



