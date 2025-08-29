/**
 * Utilitários para gerenciamento de cookies no cliente e servidor
 */

/**
 * Classe para gerenciar cookies tanto no cliente quanto no servidor
 */
export class CookieManager {
  /**
   * Obtém um cookie no lado do cliente
   * @param name Nome do cookie
   * @returns Valor do cookie ou null se não encontrado
   */
  static getClientCookie(name: string): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    
    return null;
  }

  /**
   * Define um cookie no lado do cliente
   * @param name Nome do cookie
   * @param value Valor do cookie
   * @param days Dias para expiração (padrão: 7)
   */
  static setClientCookie(name: string, value: string, days: number = 7): void {
    if (typeof window === 'undefined') {
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  /**
   * Remove um cookie no lado do cliente
   * @param name Nome do cookie
   */
  static removeClientCookie(name: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  /**
   * Verifica se um cookie existe no lado do cliente
   * @param name Nome do cookie
   * @returns true se o cookie existe
   */
  static hasClientCookie(name: string): boolean {
    return this.getClientCookie(name) !== null;
  }
}

/**
 * Funções auxiliares para compatibilidade com código existente
 */
export const setCookie = CookieManager.setClientCookie;
export const getCookie = CookieManager.getClientCookie;
export const deleteCookie = CookieManager.removeClientCookie;