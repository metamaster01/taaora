import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from './admin-auth'

// Defense in depth: middleware already blocks unauthenticated /api/admin calls,
// but every admin route handler re-checks so a middleware misconfiguration can
// never expose customer data.
export async function requireAdmin(): Promise<NextResponse | null> {
  const store = await cookies()
  const ok = await verifySessionToken(store.get(ADMIN_COOKIE)?.value)
  return ok ? null : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
