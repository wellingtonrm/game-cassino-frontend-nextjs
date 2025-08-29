import { setCookie, getCookie, deleteCookie, hasCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';

// Tipos para configuração de cookies
export interface CookieOptions {
  maxAge?: number; // em segundos
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  priority?: 'low' | 'medium' | 'high';
}

// Interface para dados de cookie
export interface CookieData {
  name: string;
  value: string;
  options?: CookieOptions;
}

// Classe principal para gerenciamento de cookies (CLIENTE APENAS)
export class CookieManager {
  /**
   * Define um cookie no lado do cliente
   */
  static setClientCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    const defaultOptions: CookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias por padrão
      ...options,
    };

    setCookie(name, value, defaultOptions);
  }

  /**
   * Obtém um cookie no lado do cliente
   */
  static getClientCookie(name: string): string | undefined {
    const cookie = getCookie(name);
    return typeof cookie === 'string' ? cookie : undefined;
  }

  /**
   * Remove um cookie no lado do cliente
   */
  static removeClientCookie(name: string, options: Partial<CookieOptions> = {}): void {
    deleteCookie(name, {
      path: '/',
      ...options,
    });
  }

  /**
   * Verifica se um cookie existe no lado do cliente
   */
  static hasClientCookie(name: string): boolean {
    const exists = hasCookie(name);
    return typeof exists === 'boolean' ? exists : false;
  }
}

// Utilitários para middleware e API routes
export class CookieMiddleware {
  /**
   * Define um cookie em uma resposta de middleware ou API route
   */
  static setCookieInResponse(
    response: NextResponse,
    name: string,
    value: string,
    options: CookieOptions = {}
  ): NextResponse {
    const defaultOptions: CookieOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      ...options,
    };

    let cookieString = `${name}=${value}`;
    
    if (defaultOptions.maxAge) {
      cookieString += `; Max-Age=${defaultOptions.maxAge}`;
    }
    
    if (defaultOptions.expires) {
      cookieString += `; Expires=${defaultOptions.expires.toUTCString()}`;
    }
    
    if (defaultOptions.path) {
      cookieString += `; Path=${defaultOptions.path}`;
    }
    
    if (defaultOptions.domain) {
      cookieString += `; Domain=${defaultOptions.domain}`;
    }
    
    if (defaultOptions.secure) {
      cookieString += '; Secure';
    }
    
    if (defaultOptions.httpOnly) {
      cookieString += '; HttpOnly';
    }
    
    if (defaultOptions.sameSite) {
      cookieString += `; SameSite=${defaultOptions.sameSite}`;
    }

    response.headers.set('Set-Cookie', cookieString);
    return response;
  }

  /**
   * Obtém um cookie de uma requisição
   */
  static getCookieFromRequest(request: NextRequest, name: string): string | undefined {
    return request.cookies.get(name)?.value;
  }

  /**
   * Remove um cookie em uma resposta
   */
  static removeCookieInResponse(
    response: NextResponse,
    name: string,
    options: Partial<CookieOptions> = {}
  ): NextResponse {
    return this.setCookieInResponse(response, name, '', {
      ...options,
      maxAge: 0,
      expires: new Date(0),
    });
  }
}

// Utilitários simples para autenticação no cliente
export class AuthCookies {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken'; // Usando o nome atual
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken'; // Usando o nome atual
  private static readonly USER_DATA_KEY = 'account'; // Usando o nome atual

  /**
   * Define tokens de autenticação (CLIENTE APENAS)
   * Para uso no servidor, use ServerAuthCookies de server-cookies.ts
   */
  static setAuthTokens(
    accessToken: string,
    refreshToken: string,
    userData?: Record<string, unknown> | object
  ): void {
    // Access token
    CookieManager.setClientCookie(this.ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 24 * 60 * 60, // 24 horas
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Dados do usuário (não sensíveis)
    if (userData) {
      CookieManager.setClientCookie(
        this.USER_DATA_KEY,
        JSON.stringify(userData),
        {
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        }
      );
    }
  }

  /**
   * Obtém o access token
   */
  static getAccessToken(): string | undefined {
    return CookieManager.getClientCookie(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Obtém dados do usuário
   */
  static getUserData(): Record<string, unknown> | object | undefined {
    const userData = CookieManager.getClientCookie(this.USER_DATA_KEY);
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
  static clearAuthCookies(): void {
    CookieManager.removeClientCookie(this.ACCESS_TOKEN_KEY);
    CookieManager.removeClientCookie(this.USER_DATA_KEY);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return !!accessToken;
  }
}

// Exportações para compatibilidade com código existente
export const setCookieCompat = CookieManager.setClientCookie;
export const getCookieCompat = CookieManager.getClientCookie;
export const deleteCookieCompat = CookieManager.removeClientCookie;