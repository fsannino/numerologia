import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * CSP com nonce por requisição — sem 'unsafe-inline' em scripts (spec §5).
 * O nonce vai no header da requisição para o App Router aplicá-lo aos
 * scripts que o próprio Next injeta; por isso as páginas rendem dinâmicas.
 * Exceções restritas ao modo dev: 'unsafe-eval' (react-refresh) e ws: (HMR).
 */
function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${IS_DEV ? " 'unsafe-eval'" : ''}`,
    `style-src 'self'${IS_DEV ? " 'unsafe-inline'" : ` 'nonce-${nonce}'`}`,
    "img-src 'self' data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    `connect-src 'self'${IS_DEV ? ' ws:' : ''}`,
  ].join('; ')
}

export function middleware(request: NextRequest): NextResponse {
  const nonce = btoa(crypto.randomUUID())
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', contentSecurityPolicy)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
