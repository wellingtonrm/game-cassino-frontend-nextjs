import { AuthCookies } from './cookies';

/**
 * Função para realizar o logout do usuário
 * Remove todos os cookies de autenticação e redireciona para a página de login
 */
export const logout = () => {
  // Remove todos os cookies de autenticação usando o novo sistema
  AuthCookies.clearAuthCookies();

};
