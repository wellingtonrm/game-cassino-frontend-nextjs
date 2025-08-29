import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const protectedRoutes = ['/wallet', '/checkout']

// Rotas públicas (não requerem autenticação)
const publicRoutes = ['/auth', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se há token de autenticação
  const token = request.cookies.get('auth-token')?.value
  
  // Se está tentando acessar uma rota protegida sem token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // Se está logado e tentando acessar a página de auth, redirecionar para wallet
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/wallet', request.url))
  }
  
  // Redirecionar da página inicial para auth se não estiver logado
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // Redirecionar da página inicial para wallet se estiver logado
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/wallet', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}