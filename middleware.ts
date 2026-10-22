import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isApi = pathname.startsWith('/api/')
  const isLogin = pathname === '/admin/login' || pathname === '/api/admin/login'

  // CSRF hardening: state-changing admin API calls must come from our own origin.
  if (isApi && req.method !== 'GET' && req.method !== 'HEAD') {
    const origin = req.headers.get('origin')
    if (origin) {
      let sameOrigin = false
      try {
        sameOrigin = new URL(origin).host === req.headers.get('host')
      } catch {}
      if (!sameOrigin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
  }

  if (!isLogin) {
    const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
    if (!ok) {
      if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = `?next=${encodeURIComponent(pathname)}`
      return NextResponse.redirect(url)
    }
  }

  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
