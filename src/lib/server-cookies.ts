/**
 * Utilitários de cookies para uso EXCLUSIVO no servidor
 * (Server Components, Server Actions, API Routes)
 */

import { cookies } from 'next/headers';
import { CookieOptions } from './cookies';

// Classe para gerenciamento de cookies no servidor
export class ServerCookieManager {
  /**
   * Define um cookie no lado do servidor (Server Components/Actions)
   */
  static async setServerCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): Promise<void> {
    const cookieStore = await cookies();
    
    const defaultOptions: CookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias por padrão
      httpOnly: true, // Por padrão, cookies do servidor são httpOnly
      ...options,
    };

    cookieStore.set(name, value, defaultOptions);
  }

  /**
   * Obtém um cookie no lado do servidor (Server Components)
   */
  static async getServerCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  }

  /**
   * Remove um cookie no lado do servidor (Server Actions)
   */
  static async removeServerCookie(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  }

  /**
   * Verifica se um cookie existe no lado do servidor
   */
  static async hasServerCookie(name: string): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has(name);
  }

  /**
   * Obtém todos os cookies no lado do servidor
   */
  static async getAllServerCookies(): Promise<Array<{ name: string; value: string }>> {
    const cookieStore = await cookies();
    return cookieStore.getAll();
  }

  /**
   * Limpa todos os cookies no lado do servidor
   * Nota: Esta função lista todos os cookies e os remove individualmente
   */
  static async clearAllServerCookies(): Promise<void> {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Remove cada cookie individualmente
    for (const cookie of allCookies) {
      cookieStore.delete(cookie.name);
    }
  }
}

// Hooks e utilitários específicos para autenticação (SERVIDOR)
export class ServerAuthCookies {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_DATA_KEY = 'user_data';

  /**
   * Define tokens de autenticação
   */
  static async setAuthTokens(
    accessToken: string,
    refreshToken: string,
    userData?: Record<string, unknown> | object
  ): Promise<void> {
    // Access token com maior tempo de vida (24 horas)
    await ServerCookieManager.setServerCookie(this.ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 24 * 60 * 60, // 24 horas
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // Refresh token com maior tempo de vida
    await ServerCookieManager.setServerCookie(this.REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // Dados do usuário (não sensíveis)
    if (userData) {
      await ServerCookieManager.setServerCookie(
        this.USER_DATA_KEY,
        JSON.stringify(userData),
        {
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          httpOnly: false, // Permite acesso no cliente
          secure: true,
          sameSite: 'strict',
        }
      );
    }
  }

  /**
   * Obtém o access token
   */
  static async getAccessToken(): Promise<string | undefined> {
    return await ServerCookieManager.getServerCookie(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Obtém o refresh token
   */
  static async getRefreshToken(): Promise<string | undefined> {
    return await ServerCookieManager.getServerCookie(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Obtém dados do usuário
   */
  static async getUserData(): Promise<Record<string, unknown> | object | undefined> {
    const userData = await ServerCookieManager.getServerCookie(this.USER_DATA_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Remove todos os cookies de autenticação
   */
  static async clearAuthCookies(): Promise<void> {
    await Promise.all([
      ServerCookieManager.removeServerCookie(this.ACCESS_TOKEN_KEY),
      ServerCookieManager.removeServerCookie(this.REFRESH_TOKEN_KEY),
      ServerCookieManager.removeServerCookie(this.USER_DATA_KEY),
    ]);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  }
}
