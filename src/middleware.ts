import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { UsuarioLogin } from '@/types';

// ======================== CONSTANTS ========================

const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/game',
] as const;

const PROTECTED_ROUTES = [
  '/wallet',
  '/wallet/*',
  '/checkout',
] as const;

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
} as const;

const LOGIN_PAGE = '/auth';
const DEFAULT_DASHBOARD = '/wallet';

// ======================== UTILITY FUNCTIONS ========================

/**
 * Verifica se uma rota corresponde a um padrão (incluindo wildcards)
 */
function matchRoute(pathname: string, pattern: string): boolean {
  if (pattern.includes('*')) {
    const regexPattern = pattern.replace('*', '.*');
    return new RegExp(`^${regexPattern}$`).test(pathname);
  }
  
  if (pattern.includes('[') && pattern.includes(']')) {
    const regexPattern = pattern.replace(/\[.*?\]/g, '[^/]+');
    return new RegExp(`^${regexPattern}$`).test(pathname);
  }
  
  return pattern === pathname;
}

/**
 * Verifica se é uma rota pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => matchRoute(pathname, route));
}

/**
 * Verifica se é uma rota de sistema que deve ser ignorada
 */
function isSystemRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  );
}

/**
 * Verifica se é uma rota protegida que requer autenticação
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => matchRoute(pathname, route));
}

/**
 * Remove aspas desnecessárias do token
 */
function sanitizeToken(rawToken?: string): string | undefined {
  return rawToken
}

/**
 * Cria resposta base com headers de segurança
 */
function createSecureResponse(): NextResponse {
  const response = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}


// ======================== AUTHENTICATION FUNCTIONS ========================

/**
 * Verifica e decodifica o JWT token
 */
async function verifyJWTToken(token: string): Promise<UsuarioLogin | null> {
  try {
    if (!token?.trim()) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const secretKey = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify<UsuarioLogin>(token, secretKey);

    if (!payload.role) return null;
    return payload as UsuarioLogin;
  } catch {
    return null;
  }
}

/**
 * Extrai e sanitiza o token de acesso do cookie
 */
function extractAccessToken(request: NextRequest): string | undefined {
  const rawToken = request.cookies.get('accessToken')?.value;
  return sanitizeToken(rawToken);
}


// ======================== MAIN MIDDLEWARE ========================

/**
 * Middleware principal do Next.js
 */
export async function middleware(request: NextRequest): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;

  // Ignora rotas de sistema
  if (isSystemRoute(pathname)) return;

  // Permite acesso a rotas públicas
  if (isPublicRoute(pathname)) {
    return createSecureResponse();
  }

  // Para rotas protegidas, verifica autenticação
  if (isProtectedRoute(pathname)) {
    const token = extractAccessToken(request);
    
    // Se não tem token, redireciona para login
    if (!token) {
      return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
    }

    try {
      // Verifica token
      const payload = await verifyJWTToken(token);
      if (!payload) {
        const response = NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('account');
        return response;
      }

      // Token válido, permite acesso
      return createSecureResponse();
    } catch {
      const response = NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('account');
      return response;
    }
  }

  // Se usuário autenticado está tentando acessar página de login, redireciona para dashboard
  if (pathname === LOGIN_PAGE) {
    const token = extractAccessToken(request);
    if (token) {
      try {
        const payload = await verifyJWTToken(token);
        if (payload) {
          return NextResponse.redirect(new URL(DEFAULT_DASHBOARD, request.url));
        }
      } catch {
        // Token inválido, permite acesso à página de login
      }
    }
  }

  return createSecureResponse();
}

// ======================== CONFIG ========================

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};