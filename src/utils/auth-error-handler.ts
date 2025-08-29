/**
 * Utilitários para tratamento de erros de autenticação
 */

/**
 * Interface para resposta de erro de autorização
 */
interface UnauthorizedResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Verifica se a resposta é um erro de autorização (401)
 * @param responseData Dados da resposta do erro
 * @returns true se for um erro de autorização
 */
export const isUnauthorizedResponse = (responseData: unknown): responseData is UnauthorizedResponse => {
  return Boolean(
    responseData &&
    typeof responseData === 'object' &&
    responseData !== null &&
    ((responseData as UnauthorizedResponse).statusCode === 401 ||
      (responseData as UnauthorizedResponse).message?.toLowerCase().includes('unauthorized') ||
      (responseData as UnauthorizedResponse).error?.toLowerCase().includes('unauthorized'))
  );
};

/**
 * Manipula erros de autorização redirecionando para login
 */
export const handleUnauthorizedError = (error?: unknown) => {
  // Limpar dados de autenticação
  if (typeof window !== 'undefined') {
    // Remover token dos cookies
    document.cookie = 'auth-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    
    // Limpar localStorage se necessário
    localStorage.removeItem('auth-storage');
    
    // Redirecionar para página de login
    window.location.href = '/auth';
  }
};